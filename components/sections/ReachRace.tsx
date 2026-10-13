"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * "Copper vs optics" — two lanes, scroll-driven.
 *
 * Copper pulses fade out at their reach limit; the optical pulses keep going.
 * The whole Photonics argument in one object: copper is cheaper and shorter,
 * optics costs more and goes the distance.
 *
 * Distances are on a log scale (3 m to 2,000 m cannot share a linear axis),
 * and the axis says so.
 */
const LANES = [
  { id: "dac", label: "DAC", kind: "copper", metres: 3, note: "Passive copper" },
  { id: "acc", label: "ACC", kind: "copper", metres: 5, note: "Linear redriver" },
  { id: "aec", label: "AEC", kind: "copper", metres: 9, note: "Retimer / DSP" },
  { id: "aoc", label: "AOC", kind: "optical", metres: 100, note: "Active optical" },
  { id: "smf", label: "Single-mode", kind: "optical", metres: 2000, note: "Across the hall" }
] as const;

const MIN = 1;
const MAX = 3000;
const pct = (m: number) =>
  ((Math.log10(m) - Math.log10(MIN)) / (Math.log10(MAX) - Math.log10(MIN))) * 100;

export function ReachRace() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setProgress(1);
        return;
      }
      const st = gsap.to(
        { v: 0 },
        {
          v: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.7,
            onUpdate: (self) => setProgress(self.progress)
          }
        }
      );
      return () => {
        st.scrollTrigger?.kill();
        st.kill();
      };
    },
    { scope: root }
  );

  return (
    <div className="race" ref={root}>
      <ul className="race-lanes">
        {LANES.map((l) => {
          const reach = pct(l.metres);
          // Each pulse runs the full track; copper simply dies at its limit.
          const head = progress * 100;
          const alive = head <= reach;
          const shown = Math.min(head, reach);
          // numbers count up to the lane's reach as the pulse travels
          const counted = Math.round(
            Math.min(1, head / Math.max(reach, 0.001)) * l.metres
          );

          return (
            <li key={l.id} data-kind={l.kind}>
              <span className="race-label">
                {l.label}
                <small>{l.note}</small>
              </span>

              <span className="race-track">
                <span className="race-reach" style={{ width: `${reach}%` }} />
                <span
                  className="race-pulse"
                  style={{
                    left: `${shown}%`,
                    opacity: alive ? 1 : 0
                  }}
                />
                {!alive ? (
                  <span className="race-stop" style={{ left: `${reach}%` }} />
                ) : null}
              </span>

              <span className="race-value num">
                {counted >= 1000
                  ? `${(counted / 1000).toFixed(counted >= 2000 ? 0 : 1)} km`
                  : `${counted} m`}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="race-note mono">
        Log scale · copper fades at its reach · optics keeps going
      </p>
    </div>
  );
}
