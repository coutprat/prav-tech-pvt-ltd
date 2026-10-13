"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { reachChart } from "@/content/company";

/**
 * Reach by media type on a log scale — 3 m and 2,000 m cannot share a linear
 * axis without the short runs vanishing. Ticks are labelled so the log scale
 * is explicit rather than quietly flattering the copper numbers.
 */
const TICKS = [1, 10, 100, 1000, 3000];
const MIN = 1;
const MAX = 3000;

function pct(metres: number) {
  const lo = Math.log10(MIN);
  const hi = Math.log10(MAX);
  return ((Math.log10(metres) - lo) / (hi - lo)) * 100;
}

export function ReachChart() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current?.querySelectorAll(".reach-fill") ?? [], {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <div className="reach" ref={ref}>
      <ul className="reach-rows">
        {reachChart.map((r) => (
          <li key={r.label}>
            <span className="reach-label">
              {r.label}
              <small>{r.note}</small>
            </span>
            <span className="reach-track">
              <span
                className="reach-fill"
                style={{ width: `${pct(r.metres)}%` }}
                data-optical={r.metres >= 100}
              />
            </span>
            <span className="reach-value num">
              {r.metres >= 1000 ? r.metres.toLocaleString("en-US") : r.metres} m
            </span>
          </li>
        ))}
      </ul>

      <div className="reach-axis" aria-hidden="true">
        {TICKS.map((t) => (
          <span key={t} style={{ left: `${pct(t)}%` }}>
            {t >= 1000 ? `${t / 1000}k` : t}
          </span>
        ))}
      </div>
      <p className="reach-note mono">Log scale · metres · typical maximums</p>
    </div>
  );
}
