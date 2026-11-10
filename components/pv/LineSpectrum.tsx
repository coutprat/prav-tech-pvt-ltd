"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Home, below the hero: the prism stays pinned while the four lines scroll
 * past, and the beam it sends out re-aims at whichever line you are reading.
 * A giant numeral in that line's colour marks the step.
 *
 * Driven by an IntersectionObserver (no scroll handler, no per-frame work);
 * the transitions are CSS. Below 960px the pinned stage is dropped and the
 * steps simply stack.
 */
export type SpectrumLine = {
  n: string;
  colour: string;
  href: string;
  title: string;
  body: string;
  tags: string[];
  we: string[];
};

const W = 600;
const H = 640;
const PX = 230;
const PY = 330;
/** Where each line's beam lands on the right edge — same order as the hero. */
const ENDS = [150, 270, 390, 510];

export function LineSpectrum({ lines }: { lines: SpectrumLine[] }) {
  const [on, setOn] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ox = PX + 92;
  const oy = PY;

  return (
    <div className="spx">
      <div className="spx-stage" aria-hidden="true">
        <div className="spx-glass pv-glass">
          <svg className="spx-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="spx-in" x1="0" x2="1">
                <stop offset="0" stopColor="#fbf6ea" stopOpacity="0" />
                <stop offset="1" stopColor="#fbf6ea" />
              </linearGradient>
              <linearGradient id="spx-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#34302a" stopOpacity="0.85" />
                <stop offset="1" stopColor="#141311" stopOpacity="0.7" />
              </linearGradient>
              {lines.map((l, i) => (
                <linearGradient key={l.n} id={`spx-r${i}`} x1="0" x2="1">
                  <stop offset="0" stopColor="#fbf6ea" />
                  <stop offset="0.35" stopColor={l.colour} />
                  <stop offset="1" stopColor={l.colour} stopOpacity="0.9" />
                </linearGradient>
              ))}
              <filter id="spx-blur" x="-10%" y="-300%" width="120%" height="700%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <radialGradient id="spx-pool" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#fbf6ea" stopOpacity="0.16" />
                <stop offset="1" stopColor="#fbf6ea" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx={ox} cy={oy} r="190" fill="url(#spx-pool)" />
            {/* faint measuring grid */}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={0} x2={W} y1={70 + i * 64} y2={70 + i * 64} stroke="rgba(246,236,210,0.04)" />
            ))}

            <line x1={-20} y1={PY + 150} x2={PX + 46} y2={PY + 6} stroke="url(#spx-in)" strokeWidth="2.4" />

            {lines.map((l, i) => (
              <g key={l.n}>
                <line
                  className="spx-ray"
                  data-on={i === on || undefined}
                  x1={ox}
                  y1={oy}
                  x2={W}
                  y2={ENDS[i]}
                  stroke={`url(#spx-r${i})`}
                  strokeWidth="9"
                  filter="url(#spx-blur)"
                  style={{ opacity: i === on ? 0.5 : 0.04 }}
                />
                <line
                  className="spx-ray"
                  data-on={i === on || undefined}
                  x1={ox}
                  y1={oy}
                  x2={W}
                  y2={ENDS[i]}
                  stroke={`url(#spx-r${i})`}
                  strokeWidth={i === on ? 2 : 1}
                />
              </g>
            ))}

            <polygon
              points={`${PX},${PY + 110} ${PX + 70},${PY - 108} ${PX + 140},${PY + 110}`}
              fill="url(#spx-glass)"
              stroke="rgba(246,236,210,0.45)"
              strokeWidth="1"
            />
            <polygon
              points={`${PX + 24},${PY + 96} ${PX + 70},${PY - 48} ${PX + 116},${PY + 96}`}
              fill="none"
              stroke="rgba(246,236,210,0.12)"
              strokeWidth="1"
            />
            <line x1={PX + 70} y1={PY - 108} x2={PX + 140} y2={PY + 110} stroke="#fbf6ea" strokeOpacity="0.8" />
            <line x1={PX + 46} y1={PY + 6} x2={ox} y2={oy} stroke="#fbf6ea" strokeWidth="1.6" />
          </svg>

          <p className="spx-cap">
            Fig. 02 · one input
            <br />
            {lines[on]?.title}
          </p>
          <div className="spx-num">
            <span className="spx-num-size">00</span>
            {lines.map((l, i) => (
              <span key={l.n} data-on={i === on || undefined} style={{ "--c": l.colour } as CSSProperties}>
                {l.n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ol className="spx-steps">
        {lines.map((l, i) => (
          <li
            key={l.n}
            ref={(el) => {
              steps.current[i] = el;
            }}
            data-i={i}
            className="spx-step"
            data-on={i === on || undefined}
            style={{ "--c": l.colour } as CSSProperties}
          >
            <span className="spx-k">Line {l.n}</span>
            <h3 className="spx-t">{l.title}</h3>
            <p className="spx-b">{l.body}</p>
            <ul className="spx-we">
              {l.we.map((w) => (
                <li key={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</li>
              ))}
            </ul>
            <div className="spx-tags">
              {l.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <p>
              <Link className="pv-link" href={l.href}>
                Inside the line <span aria-hidden="true">→</span>
              </Link>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
