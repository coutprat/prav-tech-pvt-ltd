"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

/**
 * Pharma signature — "the evidence thread".
 *
 * A generic, clearly fictional observation card. On scroll, highlighted
 * phrases send thin teal threads to their sources (an SOP, a batch record, a
 * deviation log), a CAPA draft assembles line by line, and a QA approval
 * stamp lands with a name placeholder and timestamp.
 *
 * Meaning: every output traces back to evidence, and a person approves it.
 *
 * The observation text is invented and deliberately generic — it is not from
 * any real 483 and names no real company, site or product.
 */
const SOURCES = [
  { id: "sop", label: "SOP-QC-014", sub: "Sampling procedure", y: 30 },
  { id: "batch", label: "BR-2291", sub: "Batch record", y: 120 },
  { id: "dev", label: "DEV-0471", sub: "Deviation log", y: 210 }
];

const CAPA = [
  "Root cause: sampling step not witnessed as required.",
  "Correction: re-train shift analysts; revise SOP-QC-014 §4.2.",
  "Preventive: add witness field to the batch record template."
];

export function EvidenceThread() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        // Present the finished state: threads drawn, CAPA written, stamp on.
        gsap.set(q(".et-thread"), { drawSVG: "100%" });
        gsap.set([q(".et-capa-line"), q(".et-stamp")], { opacity: 1, y: 0 });
        gsap.set(q(".et-source"), { borderColor: "var(--teal-ink)" });
        gsap.set(q(".et-mark"), { backgroundSize: "100% 100%" });
        return;
      }

      gsap.set(q(".et-thread"), { drawSVG: "0%" });
      gsap.set([q(".et-capa-line"), q(".et-stamp")], { opacity: 0, y: 12 });
      gsap.set(q(".et-source"), { borderColor: "var(--line)" });
      gsap.set(q(".et-mark"), { backgroundSize: "0% 100%" });

      // Deferred past first paint: a pinned ScrollTrigger forces a full-page
      // layout, and useGSAP runs before the browser paints.
      let tl: gsap.core.Timeline | null = null;
      const cancel = afterPaint(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        tl.to(q(".et-mark"), {
          backgroundSize: "100% 100%",
          duration: 1,
          stagger: 0.4,
          ease: "power1.inOut"
        })
          .to(
            q(".et-thread"),
            { drawSVG: "100%", duration: 1.4, stagger: 0.35, ease: "power2.inOut" },
            "-=0.6"
          )
          .to(
            q(".et-source"),
            { borderColor: "var(--teal-ink)", duration: 0.5, stagger: 0.35 },
            "<0.3"
          )
          .to(
            q(".et-capa-line"),
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.4, ease: "power2.out" },
            "+=0.2"
          )
          .to(q(".et-stamp"), { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, "+=0.3");
      });

      return () => {
        cancel();
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    },
    { scope: root }
  );

  return (
    <section className="et" ref={root} aria-label="How an observation becomes an approved CAPA draft">
      <div className="et-stage wrap">
        {/* ------------------------------------------------ observation */}
        <article className="et-card">
          <p className="mono et-card-head">Observation — illustrative example</p>
          <p className="et-card-body">
            Written procedures for sampling are not{" "}
            <span className="et-mark">consistently followed</span>, and the
            associated records do not show that the step was{" "}
            <span className="et-mark">witnessed</span> by a second analyst for
            the <span className="et-mark">batches reviewed</span>.
          </p>
          <p className="et-card-note">
            Fictional text for illustration. Not from any real inspection.
          </p>
        </article>

        {/* ---------------------------------------------------- threads */}
        <div className="et-threads" aria-hidden="true">
          <svg viewBox="0 0 240 260" fill="none" preserveAspectRatio="none">
            {SOURCES.map((s, i) => (
              <path
                key={s.id}
                className="et-thread"
                d={`M0 ${70 + i * 18} C 90 ${70 + i * 18}, 120 ${s.y + 18}, 232 ${s.y + 18}`}
                stroke="var(--teal-ink)"
                strokeWidth="1.5"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* ---------------------------------------------------- sources */}
        <div className="et-sources">
          {SOURCES.map((s) => (
            <div className="et-source" key={s.id}>
              <p className="mono">{s.label}</p>
              <p>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------- CAPA */}
        <article className="et-capa">
          <p className="mono et-card-head">CAPA draft</p>
          {CAPA.map((line) => (
            <p className="et-capa-line" key={line}>
              {line}
            </p>
          ))}
          <div className="et-stamp">
            <span className="et-stamp-mark" aria-hidden="true">
              ✓
            </span>
            <span>
              <b>Approved by [QA name]</b>
              <small>Reviewed and signed · [timestamp]</small>
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
