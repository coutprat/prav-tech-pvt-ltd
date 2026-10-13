"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { mennie } from "@/content/company";

/**
 * MENNIE hero.
 *
 * The supplied still is portrait (1086x1448), so the hero is built as a
 * pinned split rather than a full-bleed 16:9 crop — cropping her to
 * letterbox would cut the figure in half, and upscaling to 4K would just
 * invent detail. She holds one column; the HUD tags appear in the other.
 *
 * On scroll the image pushes in slowly (1.00 -> 1.12) and one glass HUD tag
 * resolves per step. Under reduced motion nothing pins: the still sits at
 * rest and every tag is listed as plain text.
 */
export function MennieHero() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setReduced(true);
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=340%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(
              mennie.hudSteps.length - 1,
              Math.floor(self.progress * mennie.hudSteps.length)
            );
            setActive(step);
          }
        }
      });

      tl.fromTo(
        root.current?.querySelector(".mennie-figure") ?? null,
        { scale: 1 },
        { scale: 1.12, ease: "none" }
      );
    },
    { scope: root }
  );

  return (
    <section className="mennie-hero" ref={root} aria-label="MENNIE concept visualisation">
      <div className="mennie-stage">
        <div className="mennie-figure-wrap">
          <Image
            className="mennie-figure"
            src="/media/mennie/still.png"
            alt="Concept visualisation of the MENNIE assistive robot, seen from behind, looking out over a bright clinical interior."
            width={1086}
            height={1448}
            priority
            sizes="(min-width: 900px) 46vw, 100vw"
          />
          <p className="mennie-caption">{mennie.conceptCaption}</p>
        </div>

        <div className="mennie-hud">
          {reduced ? (
            <ul className="mennie-steps-static">
              {mennie.hudSteps.map((s) => (
                <li key={s.tag}>
                  <p className="mennie-tag-text">&ldquo;{s.tag}&rdquo;</p>
                  <p className="mennie-tag-meaning">{s.meaning}</p>
                </li>
              ))}
            </ul>
          ) : (
            mennie.hudSteps.map((s, i) => (
              <div
                className="mennie-tag"
                key={s.tag}
                data-active={i === active}
                aria-hidden={i !== active}
              >
                <p className="mennie-tag-text">&ldquo;{s.tag}&rdquo;</p>
                <p className="mennie-tag-meaning">{s.meaning}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
