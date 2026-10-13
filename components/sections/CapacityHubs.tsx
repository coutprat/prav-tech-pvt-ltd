"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Operational data-centre capacity by hub.
 *
 * Deliberately an abstract node network with **no India outline**: drawing a
 * national boundary freehand would misstate borders, and the only correct
 * source for one is the official Survey of India map, which we do not have a
 * licence to reproduce. Position here encodes rough relative geography only,
 * and the layout is labelled as a schematic.
 */
const HUBS = [
  { id: "mumbai", label: "Mumbai", mw: 790, x: 22, y: 58, team: true },
  { id: "chennai", label: "Chennai", mw: 305, x: 54, y: 84, team: true },
  { id: "bengaluru", label: "Bengaluru", mw: 182, x: 42, y: 78, team: true },
  { id: "hyderabad", label: "Hyderabad", mw: 152, x: 47, y: 64, team: false },
  { id: "delhi", label: "Delhi NCR", mw: 76, x: 38, y: 18, team: true }
] as const;

const HQ = { id: "vadodara", label: "Vadodara — Praverse HQ", x: 20, y: 40 };

const MAX_MW = 790;
/** Area-proportional, so a 790 MW hub does not look 10x a 76 MW one. */
const radius = (mw: number) => 10 + Math.sqrt(mw / MAX_MW) * 30;

export function CapacityHubs() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const tw = gsap.from(q(".hub"), {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.8,
        ease: "back.out(1.5)",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true }
      });
      return () => {
        tw.scrollTrigger?.kill();
        tw.kill();
      };
    },
    { scope: root }
  );

  return (
    <div className="hubs" ref={root}>
      <svg viewBox="0 0 100 100" className="hubs-svg" role="img"
        aria-label="Schematic of Indian data-centre hubs by operational capacity: Mumbai 790 megawatts, Chennai 305, Bengaluru 182, Hyderabad 152, Delhi NCR 76, with Praverse headquarters in Vadodara. Praverse has team members in Mumbai, Chennai, Bengaluru and Delhi NCR.">
        {/* links from HQ outward — relationships, not routes */}
        {HUBS.map((h) => (
          <line
            key={h.id}
            x1={HQ.x}
            y1={HQ.y}
            x2={h.x}
            y2={h.y}
            stroke="var(--line-strong)"
            strokeWidth="0.25"
            strokeDasharray="1 1.4"
            opacity="0.5"
          />
        ))}

        {HUBS.map((h) => {
          const r = radius(h.mw) / 10;
          return (
            <g className="hub" key={h.id} data-team={h.team}>
              <circle cx={h.x} cy={h.y} r={r * 1.9} className="hub-halo" />
              <circle cx={h.x} cy={h.y} r={r} className="hub-core" />
            </g>
          );
        })}

        <g className="hub">
          <circle cx={HQ.x} cy={HQ.y} r="1.5" className="hub-hq" />
          <circle cx={HQ.x} cy={HQ.y} r="2.8" className="hub-hq-ring" />
        </g>
      </svg>

      <ul className="hubs-legend">
        {HUBS.map((h) => (
          <li key={h.id} data-team={h.team}>
            <span className="hubs-dot" />
            <b>{h.label}</b>
            <span className="num">{h.mw} MW</span>
            {h.team ? <em className="hubs-team">team</em> : null}
          </li>
        ))}
        <li data-hq="true">
          <span className="hubs-dot" />
          <b>Vadodara</b>
          <span>Praverse HQ</span>
        </li>
      </ul>

      <p className="hubs-source">
        Operational capacity. Source: MeitY reply in Lok Sabha (Mar 2026).
        Schematic layout — positions are indicative, not a survey map.
      </p>
    </div>
  );
}
