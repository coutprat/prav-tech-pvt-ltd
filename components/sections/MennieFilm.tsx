"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { MennieHero } from "@/components/sections/MennieHero";
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
 *   1  the 2.5D plate; the dolly pushes in over her shoulder
 *   2  "her view" — glass HUD panels at different depths, one per step
 *   3  the panels resolve into the three surfaces
 *   4  the concept caption
 *
 * Low-power devices and reduced motion never reach any of this: they get the
 * existing image hero, which carries every line of the same content.
 */
const SURFACES = mennie.surfaces;

export function MennieFilm() {
  const root = useRef<HTMLDivElement>(null);
  const highPower = useHighPower();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useGSAP(
    () => {
      if (!highPower || prefersReducedMotion()) return;

      // The film is the hero, so it is on screen from the start: mount as soon
      // as the gate passes rather than waiting for a scroll callback.
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
              onUpdate: (self) => setProgress(self.progress)
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
    { scope: root, dependencies: [highPower] }
  );

  // Not capable, reduced motion, or still measuring → the image hero.
  if (highPower !== true) return <MennieHero />;

  // chapter windows
  const title = progress < 0.1;
  const hudFrom = 0.32;
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

        <div className="film-canvas">
          {mounted ? <MennieScene progress={progress} /> : null}
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
