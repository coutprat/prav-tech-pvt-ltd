"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { ScrubVideo } from "@/components/motion/ScrubVideo";
import type { SignatureVideo } from "@/content/media";

/**
 * A page's signature told as film: one continuous shot, scrubbed by scroll,
 * with the argument arriving over it a beat at a time.
 *
 * This replaced two product-UI mockups — an agent console and a document
 * workspace. They were accurate and nobody wanted to look at them. A screenshot
 * of an interface asks the reader to study a demonstration; a shot of the room
 * the work happens in, with one sentence on it, asks them to feel something and
 * then tells them the point. The second lands at this stage of a sale and the
 * first does not, which is the owner's call and the right one.
 *
 * The meaning is not lost in the move. Every beat the console used to show —
 * what the agent read, that it stops, who approves, that it is logged — is
 * still here, as a line of type instead of a row in a table.
 *
 * Low-power devices and reduced motion never reach any of it: they get the
 * same chapters as a plain readable stack, which is also what is in the DOM
 * for search and assistive tech either way.
 */
export type Chapter =
  /** One large line, optionally with a quieter second line under it. */
  | { kind: "statement"; at: [number, number]; text: string; sub?: string }
  /** Two to four short labelled beats, appearing in sequence. */
  | {
      kind: "beats";
      at: [number, number];
      beats: { label: string; text: string }[];
    }
  /** A sentence with phrases that highlight as it is read. */
  | {
      kind: "marked";
      at: [number, number];
      label: string;
      parts: { text: string; mark?: boolean }[];
      note?: string;
    };

function chapterText(c: Chapter): string {
  if (c.kind === "statement") return [c.text, c.sub].filter(Boolean).join(" ");
  if (c.kind === "beats") return c.beats.map((b) => `${b.label}: ${b.text}`).join(" ");
  return c.parts.map((p) => p.text).join("");
}

/**
 * Every progress value the render below compares against. Keep in step with
 * the `data-on` conditions in the JSX.
 */
function chapterStops(chapters: Chapter[]): number[] {
  const stops: number[] = [];
  for (const c of chapters) {
    const [from, to] = c.at;
    stops.push(from, to);
    if (c.kind === "beats") {
      const span = (to - from) / (c.beats.length + 1);
      c.beats.forEach((_, k) => stops.push(from + span * k));
    } else if (c.kind === "marked") {
      c.parts.forEach((_, k) => stops.push(from + (to - from) * (0.18 + k * 0.06)));
    }
  }
  return stops.sort((a, b) => a - b);
}

function countPassed(stops: number[], p: number): number {
  let n = 0;
  while (n < stops.length && p >= stops[n]) n++;
  return n;
}

export function FilmSection({
  id,
  video,
  chapters,
  label,
  caption,
  accent = "var(--acc-ent)"
}: {
  id: string;
  video: SignatureVideo;
  chapters: Chapter[];
  /** Describes the whole sequence for assistive tech. */
  label: string;
  /** The illustrative-content note, shown under the film. */
  caption: string;
  accent?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const highPower = useHighPower();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  /** 0..1 through the clip; written on the ticker, never re-renders. */
  const clipRef = useRef(0);

  /**
   * Upgrade from the poster to the film on the first sign of scrolling.
   * Someone who never scrolls never sees a frame of it, so there is no reason
   * to spend their first paint on two megabytes of video.
   */
  useEffect(() => {
    if (highPower !== true) return;
    const arm = () => setReady(true);
    window.addEventListener("scroll", arm, { once: true, passive: true });
    window.addEventListener("wheel", arm, { once: true, passive: true });
    window.addEventListener("touchstart", arm, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", arm);
      window.removeEventListener("wheel", arm);
      window.removeEventListener("touchstart", arm);
    };
  }, [highPower]);

  useGSAP(
    () => {
      if (!highPower || !ready || prefersReducedMotion()) return;

      const stops = chapterStops(chapters);
      let passedRef = -1;

      return afterPaint(() => {
        const st = gsap.to(
          { v: 0 },
          {
            v: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=520%",
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // The render only compares progress against fixed stops, so
                // re-render when one is crossed — not on every scroll frame.
                const passed = countPassed(stops, self.progress);
                if (passed !== passedRef) {
                  passedRef = passed;
                  setProgress(self.progress);
                }
                // A short lead-in and run-out hold the first and last frames
                // while the opening and closing lines read.
                clipRef.current = Math.max(
                  0,
                  Math.min(1, (self.progress - 0.04) / 0.92)
                );
              }
            }
          }
        );
        return () => {
          st.scrollTrigger?.kill();
          st.kill();
        };
      });
    },
    { scope: root, dependencies: [highPower, ready] }
  );

  /** The readable fallback: every chapter, stacked, no motion. */
  const stacked = (
    <div className="film-stack">
      {chapters.map((c, i) => (
        <div className="film-stack-item" key={i}>
          {c.kind === "statement" ? (
            <>
              <p className="film-stack-lead">{c.text}</p>
              {c.sub ? <p className="film-stack-sub">{c.sub}</p> : null}
            </>
          ) : c.kind === "beats" ? (
            <ul className="film-stack-beats">
              {c.beats.map((b) => (
                <li key={b.label}>
                  <span className="mono">{b.label}</span>
                  {b.text}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mono film-stack-label">{c.label}</p>
              <p className="film-stack-lead">{chapterText(c)}</p>
              {c.note ? <p className="film-stack-sub">{c.note}</p> : null}
            </>
          )}
        </div>
      ))}
    </div>
  );

  if (highPower !== true || !ready || !video) {
    return (
      <section className="fs fs-static" aria-label={label}>
        <div className="wrap">{stacked}</div>
        <p className="fs-caption mono wrap">{caption}</p>
      </section>
    );
  }

  return (
    <section
      className="fs"
      ref={root}
      id={id}
      aria-label={label}
      style={{ ["--fs-accent" as string]: accent }}
    >
      <div className="fs-stage">
        <ScrubVideo
          className="fs-video"
          src={video.src}
          srcMobile={video.srcMobile}
          poster={video.poster}
          progressRef={clipRef}
          alt={video.alt}
        />

        {/* Held back only while something is being read over the footage. */}
        <div className="fs-scrim" aria-hidden="true" />

        {chapters.map((c, i) => {
          const [from, to] = c.at;
          const on = progress >= from && progress < to;
          return (
            <div className="fs-chapter" key={i} data-on={on} aria-hidden={!on}>
              {c.kind === "statement" ? (
                <>
                  <p className="fs-statement">{c.text}</p>
                  {c.sub ? <p className="fs-sub">{c.sub}</p> : null}
                </>
              ) : c.kind === "beats" ? (
                <ul className="fs-beats">
                  {c.beats.map((b, k) => {
                    // Each beat lands in turn inside the chapter's window.
                    const span = (to - from) / (c.beats.length + 1);
                    const lit = progress >= from + span * k;
                    return (
                      <li key={b.label} data-on={lit}>
                        <span className="fs-beat-label mono">{b.label}</span>
                        <span className="fs-beat-text">{b.text}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <>
                  <p className="fs-marked-label mono">{c.label}</p>
                  <p className="fs-marked">
                    {c.parts.map((p, k) =>
                      p.mark ? (
                        <mark
                          key={k}
                          className="fs-mark"
                          data-on={progress >= from + (to - from) * (0.18 + k * 0.06)}
                        >
                          {p.text}
                        </mark>
                      ) : (
                        <span key={k}>{p.text}</span>
                      )
                    )}
                  </p>
                  {c.note ? <p className="fs-sub">{c.note}</p> : null}
                </>
              )}
            </div>
          );
        })}
      </div>

      <p className="fs-caption mono">{caption}</p>

      {/* Always in the DOM, so the argument is readable without the film. */}
      <div className="sr-only">{stacked}</div>
    </section>
  );
}
