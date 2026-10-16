"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { useReducedMotion, useTheme } from "@/lib/useMediaQuery";

/**
 * Must stay plain data: this crosses the server → client boundary, and a
 * function here cannot be serialised.
 */
export type FrameSet = {
  /** Folder holding the frames, e.g. "/media/home/desktop". */
  dir: string;
  count: number;
  width: number;
  height: number;
  /** Filename shape: `${prefix}${i padded to pad}.${ext}`. */
  prefix?: string;
  ext?: string;
  pad?: number;
};

/** URL for frame `i` (1-based). */
function frameUrl(set: FrameSet, i: number) {
  const { dir, prefix = "frame-", ext = "webp", pad = 4 } = set;
  return `${dir}/${prefix}${String(i).padStart(pad, "0")}.${ext}`;
}

export type Chapter = {
  title: string;
  body?: string;
  /** Progress window, 0–1, during which this chapter is on screen. */
  from: number;
  to: number;
};

/**
 * Plays a numbered frame sequence on a <canvas>, pinned and scrubbed by
 * ScrollTrigger.
 *
 * Loading strategy: frame 1 is drawn the moment it decodes, then every 4th
 * frame, then the gaps. Whatever the scroll position, the nearest already
 * loaded frame is drawn, so the sequence is watchable long before it has
 * fully downloaded.
 *
 * Under prefers-reduced-motion the canvas is not pinned or scrubbed at all:
 * the final frame is shown as a still and every chapter is rendered as
 * ordinary stacked text.
 *
 * The component is deliberately agnostic about where frames come from — point
 * it at any folder and a real render replaces placeholders with no code change.
 */
export function ScrollSequence({
  desktop,
  mobile,
  desktopDark,
  mobileDark,
  chapters = [],
  poster,
  posterDark,
  alt,
  scrollLength = 400,
  frameRef,
  autoplay = false,
  overlay
}: {
  desktop: FrameSet;
  mobile: FrameSet;
  /** Dark-theme renders of the same scene. Same geometry, dark studio. */
  desktopDark?: FrameSet;
  mobileDark?: FrameSet;
  chapters?: Chapter[];
  poster: string;
  posterDark?: string;
  /** Describes the whole sequence for assistive tech. */
  alt: string;
  /** Scroll distance of the pinned section, in % of viewport height. */
  scrollLength?: number;
  /** Written on every scrub tick so an overlay can track the render. */
  frameRef?: RefObject<number>;
  /**
   * Play the sequence on its own until the reader scrolls, then hand the
   * playhead back to the scroll. For the hero, where a scrubbed sequence
   * sitting on frame one is indistinguishable from a still that failed to
   * load.
   */
  autoplay?: boolean;
  /** Rendered inside the pinned stage, above the canvas. */
  overlay?: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [painted, setPainted] = useState(false);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const isDark = theme === "dark" && Boolean(desktopDark);

  // The light render is a bright studio plate; against dark chrome it reads as
  // a glowing block. The dark set is the same geometry and camera lit for a
  // dark page, so switching themes does not change what the hero says.
  const desktopSet = isDark && desktopDark ? desktopDark : desktop;
  const mobileSet = isDark && mobileDark ? mobileDark : mobile;
  const posterSrc = isDark && posterDark ? posterDark : poster;

  // Rendered into the HTML so it is not discovered late. Mobile gets its own
  // smaller frame via the CSS below; this is the desktop one.
  const firstFrame = frameUrl(desktopSet, 1);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // alpha:false means "no transparency", and an untouched canvas with no
      // transparency is solid black. This one is stacked above the poster, so
      // between getContext() and the first drawn frame the hero went black —
      // invisible on a warm cache, a hard black flash on a forced reload over
      // a slow connection. Fill it with paper immediately, and again whenever
      // the backing store is resized, which clears it right back to black.
      // Read once per mount (the effect re-runs on theme change). draw() used
      // to call getComputedStyle on every scrub tick, which forces a style
      // recalc of the page sixty times a second while scrolling.
      const paper =
        getComputedStyle(document.body).getPropertyValue("--paper").trim() ||
        "#eeedea";
      const fillPaper = () => {
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
      fillPaper();

      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      const set = isMobile ? mobileSet : desktopSet;

      paintedRef.current = false;
      setPainted(false);

      // Assigned further down, once the playhead state exists. The loader runs
      // before that point, so it calls through this rather than naming it.
      let onFrameStored: (() => void) | null = null;
      // ImageBitmap, not HTMLImageElement: createImageBitmap decodes off the
      // main thread, so scrubbing never stalls on a frame that has arrived but
      // not yet been decoded. Falls back to Image() where it is unavailable.
      type Frame = ImageBitmap | HTMLImageElement;
      const images: (Frame | undefined)[] = new Array(set.count);
      const loaded = new Set<number>();
      const pending = new Set<number>();
      let current = 0;
      let disposed = false;

      // A decoded frame is raw RGBA, whatever the webp on disk weighs: 1.8 MB
      // for a 900x506 mobile frame, 5.8 MB for a 1600x900 desktop one. Holding
      // the whole sequence therefore cost 109 MB on a phone and 691 MB on a
      // laptop — per sequence, and two pages build one. That is the weight you
      // could feel: not dropped frames, but a tab the device is struggling to
      // keep resident.
      //
      // So the set is bounded. An evenly spaced spine is never evicted, which
      // keeps draw()'s nearest-frame fallback close to whatever is wanted, and
      // the rest is a window that follows the reader. Frames outside it are
      // closed and re-fetched from the HTTP cache on demand — off the main
      // thread, so a re-decode never lands as jank.
      const BUDGET = (isMobile ? 40 : 240) * 1024 * 1024;
      const spineStep = Math.max(1, Math.ceil(set.count / 10));
      const isSpine = (i: number) => i % spineStep === 0;
      let maxDecoded = set.count;

      const evict = () => {
        while (loaded.size > maxDecoded) {
          let worst = -1;
          let worstDist = -1;
          for (const j of loaded) {
            if (isSpine(j)) continue;
            const d = Math.abs(j - current);
            if (d > worstDist) {
              worstDist = d;
              worst = j;
            }
          }
          if (worst < 0) return; // only the spine is left; it stays
          const f = images[worst];
          if (f && "close" in f) f.close();
          images[worst] = undefined;
          loaded.delete(worst);
        }
      };

      /* ---------------------------------------------------------- drawing */

      // What is on the canvas now, so a scrub tick that resolves to the same
      // frame (most of them, with snap: "frame") costs nothing.
      let lastDrawn: Frame | undefined;
      let lastW = 0;
      let lastH = 0;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        // No denser than the frames themselves: a 1600px frame on a 2x
        // backing store is upscaled either way, and the bigger canvas only
        // costs fill on every draw. CSS scales it the rest of the way.
        const dpr = Math.min(
          window.devicePixelRatio || 1,
          2,
          Math.max(1, set.width / Math.max(1, rect.width))
        );
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        // Assigning width/height clears the canvas even when unchanged.
        lastDrawn = undefined;
        fillPaper();
        draw(current);
      };

      const frameWidth = (f: Frame) =>
        "naturalWidth" in f ? f.naturalWidth : f.width;
      const frameHeight = (f: Frame) =>
        "naturalHeight" in f ? f.naturalHeight : f.height;

      /** Draw frame `i`, falling back to the nearest frame already decoded. */
      const draw = (i: number) => {
        if (disposed) return;
        let img = images[i];
        if (!img) {
          let best = -1;
          let bestDist = Infinity;
          for (const j of loaded) {
            const d = Math.abs(j - i);
            if (d < bestDist) {
              bestDist = d;
              best = j;
            }
          }
          if (best < 0) return;
          img = images[best];
        }
        if (!img) return;

        const cw = canvas.width;
        const ch = canvas.height;
        // contain
        const iw = frameWidth(img);
        const ih = frameHeight(img);
        const scale = Math.min(cw / iw, ch / ih);
        const w = iw * scale;
        const h = ih * scale;
        // Same image at the same size is already on the canvas.
        if (img === lastDrawn && cw === lastW && ch === lastH) return;
        lastDrawn = img;
        lastW = cw;
        lastH = ch;
        fillPaper();
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
        if (!paintedRef.current) {
          paintedRef.current = true;
          setPainted(true);
        }
      };

      /* ---------------------------------------------------------- loading */

      const store = (i: number, frame: Frame) => {
        if (disposed) {
          if ("close" in frame) frame.close();
          return;
        }
        images[i] = frame;
        loaded.add(i);
        evict();
        onFrameStored?.();
        // Redraw if this is what we are currently meant to be showing.
        if (Math.abs(i - current) <= 1) draw(current);
      };

      const load = async (i: number): Promise<void> => {
        if (images[i] || pending.has(i)) return;
        pending.add(i);
        try {
          await fetchFrame(i);
        } finally {
          pending.delete(i);
        }
      };

      const fetchFrame = async (i: number): Promise<void> => {
        const url = frameUrl(set, i + 1);

        if (typeof createImageBitmap === "function") {
          try {
            // Low priority deliberately. Switching to fetch() for off-thread
            // decode also moved these out of the browser's image-priority
            // lane, so 120 frame requests started competing with the hero
            // poster that is the LCP element. The sequence can wait; the
            // first screen cannot.
            const res = await fetch(url, {
              priority: i === 0 ? "high" : "low"
            } as RequestInit);
            if (!res.ok) return;
            const bitmap = await createImageBitmap(await res.blob());
            store(i, bitmap);
            return;
          } catch {
            // fall through to the Image() path
          }
        }

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            store(i, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = url;
        });
      };

      const loadAll = async () => {
        await load(0);
        resize();

        // Frame 0 is decoded, so the real cost per frame is now known rather
        // than taken on trust from the FrameSet.
        const first = images[0];
        if (first) {
          const bytes = frameWidth(first) * frameHeight(first) * 4;
          maxDecoded = Math.max(12, Math.min(set.count, Math.floor(BUDGET / bytes)));
        }

        // The spine, so every scroll position has something near it to draw.
        for (let i = spineStep; i < set.count && !disposed; i += spineStep) {
          await load(i);
        }
        // Then fill outward from wherever the reader actually is, and stop at
        // the budget instead of fetching 60 frames to throw most of them away.
        for (let r = 1; r < set.count && !disposed; r += 1) {
          for (const i of [current - r, current + r]) {
            if (i < 0 || i >= set.count || images[i]) continue;
            if (loaded.size >= maxDecoded) return;
            await load(i);
          }
        }
      };

      if (!prefersReducedMotion()) {
        void loadAll();
        window.addEventListener("resize", resize);
      }

      /* ------------------------------------------------- reduced motion */

      // Reduced motion: the poster already shows the finished state in the
      // markup, so there is nothing to load, draw, pin or scrub.
      if (prefersReducedMotion()) {
        disposed = true;
        window.removeEventListener("resize", resize);
        return;
      }

      /* ------------------------------------------------------- scrubbing */

      const state = { frame: 0 };
      let tween: gsap.core.Tween | null = null;
      let activeRef = 0;

      /* -------------------------------------------------------- autoplay */

      /**
       * The hero plays itself until the reader does something.
       *
       * Driven from a separate object rather than from `state.frame`: the
       * scrub tween already owns that property, and two tweens writing one
       * value is how you get a fight nobody can see in the code. This one
       * advances, then copies across.
       */
      let playing = false;
      let auto: gsap.core.Tween | null = null;
      const autoState = { f: 0 };

      const paint = () => {
        current = Math.round(state.frame);
        if (frameRef) frameRef.current = current;
        draw(current);
        if (!images[current]) {
          // Pull in what is coming, not what has been: this is running
          // forwards, so the next frames are the ones about to be wanted.
          for (const i of [current, current + 1, current + 2]) {
            if (i >= 0 && i < set.count) void load(i);
          }
        }
        const p = current / Math.max(1, set.count - 1);
        const idx = chapters.findIndex((c) => p >= c.from && p < c.to);
        const next = idx < 0 ? (p >= 1 ? chapters.length - 1 : 0) : idx;
        if (next !== activeRef) {
          activeRef = next;
          setActive(next);
        }
      };

      /** The reader has taken over; ease to where their scroll says we are. */
      const handOver = () => {
        if (!playing) return;
        auto?.kill();
        auto = null;
        const target = (tween?.scrollTrigger?.progress ?? 0) * (set.count - 1);
        // Not a cut. At the top of the page the scroll position maps to frame
        // zero, so releasing control outright would snap the hero backwards
        // through everything it had just played.
        // No overwrite. The scrub tween targets this same property, and
        // `overwrite: true` killed it outright — so the hero eased to the
        // scroll position once and then never moved again, however far anyone
        // scrolled. The scrub is already held off by `playing`, so the two can
        // share the property for this third of a second without fighting.
        gsap.to(state, {
          frame: target,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: paint,
          onComplete: () => {
            playing = false;
          }
        });
      };

      const startAutoplay = () => {
        if (!autoplay || playing || auto || disposed) return;
        // Enough decoded to run without stuttering through the fallback.
        if (loaded.size < Math.min(10, set.count)) return;
        playing = true;
        auto = gsap.to(autoState, {
          f: set.count - 1,
          duration: 9,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            state.frame = autoState.f;
            paint();
          }
        });
      };

      // A plain scroll listener is no good: pinning this section fires one
      // during load. The handover is a distance, or direct input, whichever
      // comes first.
      // Baselined after a beat. The router scrolls a newly navigated page to
      // the top, and that jump is indistinguishable from a reader scrolling
      // unless you wait for it to finish first.
      let startY = window.scrollY;
      let armed = false;
      const arm = window.setTimeout(() => {
        startY = window.scrollY;
        armed = true;
      }, 500);
      const onScroll = () => {
        if (armed && Math.abs(window.scrollY - startY) > 8) handOver();
      };
      const intents = ["wheel", "touchmove", "keydown"] as const;

      if (autoplay) {
        onFrameStored = startAutoplay;
        startAutoplay();
        window.addEventListener("scroll", onScroll, { passive: true });
        for (const ev of intents) {
          window.addEventListener(ev, handOver, { once: true, passive: true });
        }
      }

      // Deferred past first paint: creating a pinned ScrollTrigger forces a
      // full-page layout, and useGSAP runs before the browser paints.
      const cancel = afterPaint(() => {
        if (disposed) return;
        tween = gsap.to(state, {
          frame: set.count - 1,
          ease: "none",
          snap: "frame",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${scrollLength}%`,
            pin: true,
            // scrub: true, not a number. Lenis already smooths the scroll;
            // adding ScrollTrigger's own easing on top meant the frame
            // trailed the wheel and the overlay trailed the frame. One
            // smoothing source only.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (playing) return;
              const p = self.progress;
              const idx = chapters.findIndex((c) => p >= c.from && p < c.to);
              const next = idx < 0 ? (p >= 1 ? chapters.length - 1 : 0) : idx;
              // Re-render only when the chapter actually changes.
              if (next !== activeRef) {
                activeRef = next;
                setActive(next);
              }
            }
          },
          onUpdate: () => {
            if (playing) return;
            current = Math.round(state.frame);
            if (frameRef) frameRef.current = current;
            draw(current);
            // Scrolled into a stretch that has been evicted, or never fetched:
            // ask for it and the two either side. draw() keeps showing the
            // nearest frame until they arrive.
            if (!images[current]) {
              for (const i of [current, current - 1, current + 1]) {
                if (i >= 0 && i < set.count) void load(i);
              }
            }
          }
        });
      });

      return () => {
        disposed = true;
        onFrameStored = null;
        window.clearTimeout(arm);
        auto?.kill();
        window.removeEventListener("scroll", onScroll);
        for (const ev of intents) window.removeEventListener(ev, handOver);
        cancel();
        // ImageBitmaps hold GPU memory until closed.
        for (const f of images) {
          if (f && "close" in f) f.close();
        }
        window.removeEventListener("resize", resize);
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    },
    { scope: rootRef, dependencies: [isDark], revertOnUpdate: true }
  );

  return (
    <section className="sequence" ref={rootRef} aria-label={alt}>
      <div className="sequence-pin">
        <canvas
          className="sequence-canvas"
          ref={canvasRef}
          role="img"
          aria-label={alt}
          data-ready={painted ? "true" : "false"}
        />
        {/*
          The first frame, in the markup, so the browser can discover and
          paint it immediately instead of waiting for JS to construct an
          Image(). The canvas covers it as soon as it has drawn.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="sequence-poster"
          src={reduced ? posterSrc : firstFrame}
          alt={alt}
          width={desktopSet.width}
          height={desktopSet.height}
          fetchPriority="high"
          decoding="async"
          data-hidden={painted && !reduced}
        />

        {overlay}

        {chapters.length > 0 && !reduced ? (
          <div className="chapters">
            {chapters.map((c, i) => (
              <div className="chapter" key={c.title} data-active={i === active}>
                <h2 className="h3">{c.title}</h2>
                {c.body ? <p>{c.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

{/*
        Reduced motion, and low-power devices, get the same chapters as a
        designed list rather than as five stacked headings.

        The first chapter is the lead the film opens on, so it reads as a
        standfirst; the rest are the numbered items it introduces. This used to
        be `display:grid; gap:32px` and nothing else, which looked like markup
        nobody had styled — a poor thing to show the people who opted out of
        the animation, since it is the only version of this section they will
        ever see.
      */}
      {chapters.length > 0 && reduced ? (
        <div className="wrap">
          <div className="chapters-static">
            <div className="cs-lead">
              <h2>{chapters[0].title}</h2>
              {chapters[0].body ? <p>{chapters[0].body}</p> : null}
            </div>
            {chapters.length > 1 ? (
              <ol className="cs-list">
                {chapters.slice(1).map((c, i) => (
                  <li key={c.title}>
                    <span className="cs-n mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="cs-body">
                      <h3>{c.title}</h3>
                      {c.body ? <p>{c.body}</p> : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
