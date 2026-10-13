"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { dcCapacity } from "@/content/company";

/**
 * India data-centre capacity in GW.
 *
 * Actuals and 2030 forecasts are drawn differently on purpose: the three
 * forecasts disagree by 3x, so presenting them as one number would be
 * misleading. Each forecast is attributed inline and the source line sits
 * directly under the chart.
 */
const MAX = 13;

export function CapacityChart() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current?.querySelectorAll(".cap-bar span") ?? [], {
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true }
      });
    },
    { scope: ref }
  );

  const bars = [
    ...dcCapacity.actuals.map((a) => ({
      key: a.year,
      label: a.year,
      sub: "actual",
      gw: a.gw,
      forecast: false
    })),
    ...dcCapacity.forecasts2030.map((f) => ({
      key: f.source,
      label: "2030",
      sub: f.source,
      gw: f.gw,
      forecast: true
    }))
  ];

  return (
    <div className="capacity" ref={ref}>
      <ul className="cap-bars">
        {bars.map((b) => (
          <li key={b.key}>
            <span className="cap-value num">{b.gw}</span>
            <span className="cap-bar">
              <span
                style={{ height: `${(b.gw / MAX) * 100}%` }}
                data-forecast={b.forecast}
              />
            </span>
            <span className="cap-label">
              {b.label}
              <small>{b.sub}</small>
            </span>
          </li>
        ))}
      </ul>

      <p className="cap-unit mono">Gigawatts of installed capacity</p>
      <p className="cap-sources">{dcCapacity.sources}</p>
    </div>
  );
}
