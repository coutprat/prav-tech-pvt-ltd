"use client";

import { useRef, useState } from "react";
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
  scrollLength = 400
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

      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      const set = isMobile ? mobileSet : desktopSet;

      paintedRef.current = false;
      setPainted(false);
      const images: (HTMLImageElement | undefined)[] = new Array(set.count);
      const loaded = new Set<number>();
      let current = 0;
      let disposed = false;

      /* ---------------------------------------------------------- drawing */

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        draw(current);
      };

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
        const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const styles = getComputedStyle(document.body);
        ctx.fillStyle = styles.getPropertyValue("--paper").trim() || "#eeedea";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
        if (!paintedRef.current) {
          paintedRef.current = true;
          setPainted(true);
        }
      };

      /* ---------------------------------------------------------- loading */

      const load = (i: number) =>
        new Promise<void>((resolve) => {
          if (images[i]) return resolve();
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            images[i] = img;
            loaded.add(i);
            // Redraw if this is what we are currently meant to be showing.
            if (Math.abs(i - current) <= 1) draw(current);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = frameUrl(set, i + 1);
        });

      const loadAll = async () => {
        await load(0);
        resize();

        const stride = 4;
        for (let i = stride; i < set.count && !disposed; i += stride) {
          await load(i);
        }
        for (let i = 1; i < set.count && !disposed; i += 1) {
          if (!images[i]) await load(i);
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
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = chapters.findIndex((c) => p >= c.from && p < c.to);
              setActive(idx < 0 ? (p >= 1 ? chapters.length - 1 : 0) : idx);
            }
          },
          onUpdate: () => {
            current = Math.round(state.frame);
            draw(current);
          }
        });
      });

      return () => {
        disposed = true;
        cancel();
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

      {/* Reduced motion: the same chapters, as plain stacked text. */}
      {chapters.length > 0 && reduced ? (
        <div className="wrap">
          <div className="chapters" data-static="true">
            {chapters.map((c) => (
              <div className="chapter" key={c.title} data-active="true">
                <h2 className="h3">{c.title}</h2>
                {c.body ? <p>{c.body}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
