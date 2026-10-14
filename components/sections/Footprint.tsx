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
      const nums = q<HTMLElement>(".fp-n");

      if (prefersReducedMotion()) {
        gsap.set(q(".fp-fill"), { scaleX: 1 });
        nums.forEach((el) => {
          el.textContent = el.dataset.to ?? el.textContent;
        });
        return;
      }

      gsap.set(q(".fp-fill"), { scaleX: 0, transformOrigin: "left center" });
      nums.forEach((el) => {
        el.textContent = "0";
      });

      return afterPaint(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 72%" }
        });

        tl.to(q(".fp-fill"), {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08
        });

        /*
         * The figures count up alongside their own bar.
         *
         * Not decoration: these are the numbers the whole section is about,
         * and watching 790 climb past the others is the point being made. The
         * counter is driven off a plain object and written to textContent, so
         * it costs no re-renders, and the end value comes from data-to rather
         * than from the tween so it can never land on a rounding error.
         */
        nums.forEach((el, i) => {
          const to = Number(el.dataset.to ?? 0);
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: to,
              duration: 0.9,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counter.v));
              },
              onComplete: () => {
                el.textContent = String(to);
              }
            },
            i * 0.08
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
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
              <span className="fp-n" data-to={c.mw}>
                {c.mw}
              </span>
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
