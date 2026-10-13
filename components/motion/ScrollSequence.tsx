"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

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
  chapters = [],
  poster,
  alt,
  scrollLength = 400
}: {
  desktop: FrameSet;
  mobile: FrameSet;
  chapters?: Chapter[];
  poster: string;
  /** Describes the whole sequence for assistive tech. */
  alt: string;
  /** Scroll distance of the pinned section, in % of viewport height. */
  scrollLength?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      const set = isMobile ? mobile : desktop;

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

      void loadAll();
      window.addEventListener("resize", resize);

      /* ------------------------------------------------- reduced motion */

      if (prefersReducedMotion()) {
        setReduced(true);
        // Show the completed end state rather than an empty pinned stage.
        void load(set.count - 1).then(() => {
          current = set.count - 1;
          resize();
        });
        return () => {
          disposed = true;
          window.removeEventListener("resize", resize);
        };
      }

      /* ------------------------------------------------------- scrubbing */

      const state = { frame: 0 };

      const tween = gsap.to(state, {
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

      return () => {
        disposed = true;
        window.removeEventListener("resize", resize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef }
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
        {/* Poster covers the canvas until the first frame decodes. */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sequence-poster" src={poster} alt={alt} />
        </noscript>

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
