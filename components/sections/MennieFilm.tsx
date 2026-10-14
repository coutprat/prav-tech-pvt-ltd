"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { MennieHero } from "@/components/sections/MennieHero";
import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { mennie } from "@/content/company";

/**
 * MENNIE as a short scroll-driven film.
 *
 * One shot, scrubbed by scroll from first frame to last, with everything else
 * surfacing over it:
 *
 *   0  the title, over the opening frames
 *   1  "her view" — what she is hearing, as glass panels
 *   2  the panels resolve into the three surfaces
 *   3  the concept caption
 *
 * Deliberately a single piece of footage. An earlier cut handed the second
 * half to a 2.5D depth plate built from a still, so the section showed the
 * same product twice in two visual languages and loaded three.js to do it.
 * The film is stronger as one continuous shot with the interface arriving on
 * top of it, and the page no longer ships a 3D engine at all.
 *
 * Low-power devices and reduced motion never reach any of this: they get the
 * image hero, which carries every line of the same content.
 */
const SURFACES = mennie.surfaces;

/**
 * The footage runs the whole way. A short lead-in and run-out hold the first
 * and last frames while the title and the closing caption read, rather than
 * the shot being over before the words are.
 */
const CINE_FROM = 0.04;
const CINE_TO = 0.96;

export function MennieFilm() {
  const root = useRef<HTMLDivElement>(null);
  const highPower = useHighPower();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  /** 0..1 within the clip, written on the ticker; never re-renders. */
  const cineRef = useRef(0);

  /**
   * Upgrade from the image hero to the film on the first sign of scrolling.
   *
   * Someone who never scrolls never sees a frame of it, so there is no reason
   * to spend their first paint on a 3 MB video. The poster is a complete hero
   * until then, and ScrubVideo preloads metadata only.
   */
  useEffect(() => {
    if (highPower !== true) return;

    const onIntent = () => setReady(true);
    window.addEventListener("scroll", onIntent, { once: true, passive: true });
    window.addEventListener("wheel", onIntent, { once: true, passive: true });
    window.addEventListener("touchstart", onIntent, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", onIntent);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
    };
  }, [highPower]);

  useGSAP(
    () => {
      if (!highPower || !ready || prefersReducedMotion()) return;

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

        {/* the shot, scrubbed, running under everything else */}
        <div className="film-canvas" data-on={true}>
          <ScrubVideo
            className="film-video"
            src="/media/mennie/cine-1280.mp4"
            srcMobile="/media/mennie/cine-854.mp4"
            poster="/media/mennie/cine-poster.webp"
            progressRef={cineRef}
            alt="Concept visualisation: the MENNIE assistive robot stands at a rooftop balustrade above an Indian city at sunrise, seen from behind."
          />
        </div>

        {/* grade + grain over everything */}
        <div className="film-grade" aria-hidden="true" />

        {/*
          A scrim that fades in only while something is being read over the
          footage. The shot ends on a blown-out sunrise, and white-on-sky is
          not a contrast ratio.
        */}
        <div
          className="film-scrim"
          data-on={progress >= hudFrom || progress < 0.12}
          aria-hidden="true"
        />

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
