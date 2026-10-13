"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Enterprise AI signature — "the checkpoint".
 *
 * Document particles stream into an agent node, stop dead at a human gate, a
 * check mark approves, the gate opens, and an audit ledger types three lines:
 * who asked · what was surfaced · who decided.
 *
 * Meaning: human-in-the-loop is the architecture, not a setting.
 */
const DOCS = Array.from({ length: 9 }, (_, i) => i);

const LEDGER = [
  "who asked      · k.rao@ · 09:41",
  "what surfaced  · 4 records, 2 flagged",
  "who decided    · s.mehta@ · approved"
];

export function Checkpoint() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (prefersReducedMotion()) {
        gsap.set(q(".cp-doc"), { x: 150, opacity: 1 });
        gsap.set([q(".cp-check"), q(".cp-ledger-line")], { opacity: 1, y: 0 });
        gsap.set(q(".cp-gate-bar"), { scaleY: 0.12, opacity: 0.4 });
        gsap.set(q(".cp-node"), { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(q(".cp-doc"), { x: 0, opacity: 0 });
      gsap.set([q(".cp-check"), q(".cp-ledger-line")], { opacity: 0, y: 8 });
      gsap.set(q(".cp-gate-bar"), { scaleY: 1, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // stream in, and stop at the gate
      tl.to(q(".cp-doc"), {
        opacity: 1,
        duration: 0.3,
        stagger: 0.06
      })
        .to(
          q(".cp-doc"),
          { x: 150, duration: 1.2, stagger: 0.06, ease: "power2.inOut" },
          "<"
        )
        .to(q(".cp-node"), { scale: 1.06, duration: 0.4, yoyo: true, repeat: 1 }, "-=0.5")
        // the pause is the point: nothing passes until a person approves
        .to(q(".cp-check"), { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.8)" }, "+=0.3")
        .to(q(".cp-gate-bar"), {
          scaleY: 0.12,
          opacity: 0.4,
          duration: 0.6,
          ease: "power2.inOut"
        })
        .to(q(".cp-doc"), { x: 300, duration: 0.9, stagger: 0.05, ease: "power2.in" }, "<0.2")
        .to(
          q(".cp-ledger-line"),
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.35, ease: "power2.out" },
          "-=0.4"
        );
    },
    { scope: root }
  );

  return (
    <section className="cp" ref={root} aria-label="Documents reach an agent, stop at a human gate, and are recorded in an audit ledger">
      <div className="cp-stage wrap">
        <div className="cp-diagram" aria-hidden="true">
          <svg viewBox="0 0 420 220" fill="none">
            {/* incoming documents */}
            {DOCS.map((i) => (
              <rect
                key={i}
                className="cp-doc"
                x="8"
                y={28 + (i % 3) * 56 + Math.floor(i / 3) * 6}
                width="13"
                height="17"
                rx="2"
                stroke="var(--line-strong)"
                strokeWidth="1.1"
                fill="var(--paper-3)"
              />
            ))}

            {/* agent node */}
            <circle
              className="cp-node"
              cx="190"
              cy="110"
              r="26"
              stroke="var(--ink-2)"
              strokeWidth="1.4"
              fill="var(--paper-3)"
            />
            <text
              x="190"
              y="114"
              textAnchor="middle"
              fontSize="9"
              fill="var(--ink-2)"
              fontFamily="var(--font-mono)"
            >
              AGENT
            </text>

            {/* the human gate */}
            <line
              className="cp-gate-bar"
              x1="258"
              y1="26"
              x2="258"
              y2="194"
              stroke="var(--teal-ink)"
              strokeWidth="2.5"
              style={{ transformOrigin: "258px 110px" }}
            />
            <g className="cp-check">
              <circle cx="258" cy="110" r="16" fill="var(--teal-ink)" />
              <path
                d="M251 110.5l5 5 9-10"
                stroke="var(--paper)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            <text
              x="258"
              y="212"
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--ink-2)"
              fontFamily="var(--font-mono)"
            >
              HUMAN GATE
            </text>
          </svg>
        </div>

        <div className="cp-ledger">
          <p className="mono cp-ledger-head">Audit ledger</p>
          {LEDGER.map((l) => (
            <p className="cp-ledger-line num" key={l}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
