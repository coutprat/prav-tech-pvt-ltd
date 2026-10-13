"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint } from "@/lib/gsap";
import { dataCentreCapacity } from "@/content/company";
import { locations } from "@/content/site";

/**
 * Where India's AI capacity is, and where our people are.
 *
 * This replaces the map in the company deck. A map of India on a commercial
 * site has to use the official Survey of India boundary, which we do not have,
 * and the outline was never the point: the point is that four of the five
 * largest data-centre markets in the country are cities where Praverse has
 * team members. A ranked bar says that more plainly than dots on a coastline.
 *
 * The bars carry third-party market data, so the sources sit directly under
 * them, including the deck's own caveat that forecasts vary widely.
 */
const { cities, source, unit } = dataCentreCapacity;
const MAX = Math.max(...cities.map((c) => c.mw));

export function Footprint() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q(".fp-fill"), { scaleX: 1 });
        return;
      }
      gsap.set(q(".fp-fill"), { scaleX: 0, transformOrigin: "left center" });
      return afterPaint(() =>
        gsap.to(q(".fp-fill"), {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 72%" }
        })
      );
    },
    { scope: root }
  );

  return (
    <div className="fp" ref={root}>
      <ol className="fp-rows">
        {cities.map((c) => (
          <li className="fp-row" key={c.city} data-team={c.team}>
            <span className="fp-city">
              {c.city}
              {c.team ? <b className="fp-tag">Praverse team</b> : null}
            </span>
            <span className="fp-bar" aria-hidden="true">
              <span className="fp-fill" style={{ width: `${(c.mw / MAX) * 100}%` }} />
            </span>
            <span className="fp-mw num">
              {c.mw}
              <small> {unit}</small>
            </span>
          </li>
        ))}
      </ol>

      <p className="fp-hq">
        <b>{locations.hq}</b> — headquarters, about {locations.hqToMumbaiKm} km from
        Mumbai. Not a capacity market, which is rather the point: the engineering
        sits close enough to reach the clusters, and the people sit in them.
      </p>

      <p className="fp-source">
        Operational data-centre capacity by market. Source: {source}
      </p>
    </div>
  );
}
