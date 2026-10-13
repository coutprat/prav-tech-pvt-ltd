"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { MennieHero } from "@/components/sections/MennieHero";
import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { mennie } from "@/content/company";

/** three.js only loads here, only on this page, only when it can be used. */
const MennieScene = dynamic(() => import("@/components/three/MennieScene"), {
  ssr: false
});

/**
 * MENNIE as a short scroll-driven film.
 *
 * Chapters, in order:
 *   0  black, the title blooms in
 *   1  the cinematic, scrubbed by scroll — rooftop, city, golden hour
 *   2  "her view" — the 2.5D plate indoors, glass HUD panels at depth
 *   3  the panels resolve into the three surfaces
 *   4  the concept caption
 *
 * Two different moments, not the same one twice: the cinematic is the wide
 * exterior opening (real footage, real hair movement), and the depth plate is
 * the close interior where the HUD belongs.
 *
 * Low-power devices and reduced motion never reach any of this: they get the
 * existing image hero, which carries every line of the same content.
 */
const SURFACES = mennie.surfaces;

/** Scroll window the cinematic occupies, as a fraction of the pinned scroll. */
const CINE_FROM = 0.06;
const CINE_TO = 0.38;

export function MennieFilm() {
  const root = useRef<HTMLDivElement>(null);
  const highPower = useHighPower();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  /** 0..1 within the cinematic, written on the ticker; never re-renders. */
  const cineRef = useRef(0);

  /**
   * Prefetch the three.js chunk when the browser is idle, but do not mount it
   * until the visitor actually scrolls.
   *
   * The film is entirely scroll-driven: someone who never scrolls never sees a
   * frame of it, so mounting it on load spent ~500ms of main-thread time and
   * 4.8s of LCP on something they would not have looked at. Prefetching keeps
   * the upgrade instant the moment they do scroll, because the chunk is
   * already in cache — the poster is a complete hero in the meantime.
   */
  useEffect(() => {
    if (highPower !== true) return;

    let idle = 0;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };

    const prefetch = () => {
      void import("@/components/three/MennieScene").catch(() => {
        /* the poster stands on its own */
      });
    };
    const schedule = () => {
      idle = w.requestIdleCallback
        ? w.requestIdleCallback(prefetch, { timeout: 4000 })
        : window.setTimeout(prefetch, 1500);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const onIntent = () => setReady(true);
    window.addEventListener("scroll", onIntent, { once: true, passive: true });
    window.addEventListener("wheel", onIntent, { once: true, passive: true });
    window.addEventListener("touchstart", onIntent, { once: true, passive: true });

    return () => {
      window.removeEventListener("load", schedule);
      window.removeEventListener("scroll", onIntent);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      if (idle) (w.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [highPower]);

  useGSAP(
    () => {
      if (!highPower || !ready || prefersReducedMotion()) return;
      setMounted(true);

      const cancel = afterPaint(() => {
        const st = gsap.to(
          { v: 0 },
          {
            v: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=620%",
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setProgress(self.progress);
                // The cinematic owns the opening; map its window onto 0..1.
                cineRef.current = Math.max(
                  0,
                  Math.min(1, (self.progress - CINE_FROM) / (CINE_TO - CINE_FROM))
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

      return cancel;
    },
    { scope: root, dependencies: [highPower, ready] }
  );

  // Not capable, reduced motion, still measuring, or not yet idle → the image
  // hero, which is a complete hero in its own right.
  if (highPower !== true || !ready) return <MennieHero />;

  // chapter windows
  const title = progress < 0.1;
  const hudFrom = 0.4;
  const hudTo = 0.72;
  const surfacesFrom = 0.74;
  const captionFrom = 0.93;

  const hudStep = Math.min(
    mennie.hudSteps.length - 1,
    Math.max(
      0,
      Math.floor(((progress - hudFrom) / (hudTo - hudFrom)) * mennie.hudSteps.length)
    )
  );

  return (
    <section className="film" ref={root} aria-label="MENNIE concept film">
      <div className="film-stage">
        {/* 2.39:1 letterbox bars, opening as the film starts */}
        <div
          className="film-bar film-bar-top"
          style={{ transform: `scaleY(${Math.max(0, 1 - progress * 9)})` }}
          aria-hidden="true"
        />
        <div
          className="film-bar film-bar-bottom"
          style={{ transform: `scaleY(${Math.max(0, 1 - progress * 9)})` }}
          aria-hidden="true"
        />

        {/* 1 — the cinematic, scrubbed */}
        <div className="film-canvas" data-on={progress < CINE_TO}>
          <ScrubVideo
            className="film-video"
            src="/media/mennie/cine-1280.mp4"
            srcMobile="/media/mennie/cine-854.mp4"
            poster="/media/mennie/cine-poster.webp"
            progressRef={cineRef}
            alt="Concept visualisation: the MENNIE assistive robot stands at a rooftop balustrade above an Indian city at sunrise, seen from behind."
          />
        </div>

        {/* 2 — the depth plate, indoors, where the HUD panels sit */}
        <div className="film-canvas" data-on={progress >= CINE_TO}>
          {mounted ? (
            <MennieScene
              progress={Math.max(0, (progress - CINE_TO) / (1 - CINE_TO))}
            />
          ) : null}
        </div>

        {/* grade + grain over everything */}
        <div className="film-grade" aria-hidden="true" />

        {/* 0 — title */}
        <div className="film-title" data-on={title} aria-hidden={!title}>
          <h2>MENNIE</h2>
          <p>{mennie.expansion}</p>
        </div>

        {/* 2 — her view */}
        <div
          className="film-hud"
          data-on={progress >= hudFrom && progress < surfacesFrom}
        >
          {mennie.hudSteps.map((s, i) => (
            <div
              key={s.tag}
              className="film-panel"
              data-on={i === hudStep}
              style={{ ["--i" as string]: String(i) }}
            >
              <span className="film-panel-line" aria-hidden="true" />
              <p className="film-panel-text">&ldquo;{s.tag}&rdquo;</p>
              <p className="film-panel-meaning">{s.meaning}</p>
            </div>
          ))}
        </div>

        {/* 3 — three surfaces */}
        <div
          className="film-surfaces"
          data-on={progress >= surfacesFrom && progress < captionFrom}
        >
          {SURFACES.map((s, i) => (
            <article key={s.title} style={{ ["--i" as string]: String(i) }}>
              <span className={`surface-art surface-${i}`} aria-hidden="true" />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>

        {/* 4 — caption */}
        <div className="film-caption" data-on={progress >= captionFrom}>
          <p>{mennie.conceptCaption}</p>
        </div>
      </div>

      {/* The film's content, always in the DOM for assistive tech and search. */}
      <div className="sr-only">
        <h2>MENNIE — {mennie.expansion}</h2>
        <p>{mennie.summary}</p>
        <ul>
          {mennie.hudSteps.map((s) => (
            <li key={s.tag}>
              {s.tag} — {s.meaning}
            </li>
          ))}
        </ul>
        <ul>
          {SURFACES.map((s) => (
            <li key={s.title}>
              {s.title}: {s.body}
            </li>
          ))}
        </ul>
        <p>{mennie.conceptCaption}</p>
      </div>
    </section>
  );
}
