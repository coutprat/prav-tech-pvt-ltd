"use client";

import { useEffect, useRef, useState } from "react";
import type { BentoItem } from "@/components/pv/IndustriesBento";

/**
 * The Industries hero visual: one beam enters a prism and fans out to every
 * sector we build for. Point at a sector and the bright beam re-aims at it
 * (and its tile below lights); left alone, it walks the list on its own.
 * Under reduced motion it rests on the first sector.
 */
const W = 300;
const H = 600;
const PX = 96; // prism left foot x
const PY = H / 2;

export function SectorPrism({ items }: { items: BentoItem[] }) {
  const [on, setOn] = useState(0);
  const held = useRef(false);
  const seen = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const n = items.length;
  const y = (i: number) => ((i + 0.5) / n) * H;
  const ox = PX + 62;
  const oy = PY + 10;
  const angle = (i: number) => (Math.atan2(y(i) - oy, W - ox) * 180) / Math.PI;
  const len = Math.hypot(W - ox, H / 2) + 6;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (
        !held.current &&
        seen.current &&
        document.visibilityState === "visible"
      )
        setOn((v) => (v + 1) % n);
    }, 2400);
    // only walk the list while the hero is on screen
    const io = new IntersectionObserver(([e]) => {
      seen.current = e.isIntersecting;
    });
    if (box.current) io.observe(box.current);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [n]);

  // light the matching tile in the bento below
  useEffect(() => {
    const el = document.getElementById(`s-${items[on]?.id}`);
    el?.setAttribute("data-lit", "");
    return () => el?.removeAttribute("data-lit");
  }, [on, items]);

  const c = items[on]?.colour ?? "var(--gold)";

  return (
    <div
      ref={box}
      className="sp"
      onMouseLeave={() => {
        held.current = false;
      }}
    >
      <svg
        className="sp-svg"
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="sp-in" x1="0" x2="1">
            <stop offset="0" stopColor="#f6ecd2" stopOpacity="0" />
            <stop offset="1" stopColor="#fbf6ea" />
          </linearGradient>
          <linearGradient
            id="sp-out"
            gradientUnits="userSpaceOnUse"
            x1={ox}
            y1={oy}
            x2={ox + len}
            y2={oy}
          >
            <stop offset="0" stopColor="#fbf6ea" />
            <stop offset="0.5" stopColor="#d9c08e" />
            <stop offset="1" stopColor={c} />
          </linearGradient>
          <linearGradient id="sp-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2e2b26" stopOpacity="0.92" />
            <stop offset="1" stopColor="#121110" stopOpacity="0.75" />
          </linearGradient>
          <clipPath id="sp-clip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
          <filter id="sp-glow" x="-10%" y="-300%" width="120%" height="700%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <g className="sp-fan">
          {items.map((it, i) => (
            <line key={it.id} x1={ox} y1={oy} x2={W} y2={y(i)} />
          ))}
        </g>

        {/* white light in */}
        <line
          x1={-60}
          y1={PY + 70}
          x2={PX + 32}
          y2={PY + 10}
          stroke="url(#sp-in)"
          strokeWidth="2"
        />

        {/* the beam that re-aims */}
        <g clipPath="url(#sp-clip)">
          <g
            className="sp-beam"
            style={{
              transform: `rotate(${angle(on)}deg)`,
              transformOrigin: `${ox}px ${oy}px`,
            }}
          >
            <line
              x1={ox}
              y1={oy}
              x2={ox + len}
              y2={oy}
              stroke="url(#sp-out)"
              strokeWidth="8"
              opacity="0.14"
              strokeLinecap="round"
            />
            <line
              x1={ox}
              y1={oy}
              x2={ox + len}
              y2={oy}
              stroke="url(#sp-out)"
              strokeWidth="1.6"
            />
          </g>
        </g>

        {/* prism */}
        <polygon
          points={`${PX},${PY + 62} ${PX + 44},${PY - 60} ${PX + 88},${PY + 62}`}
          fill="url(#sp-glass)"
          stroke="rgba(246,236,210,0.5)"
          strokeWidth="1"
        />
        <line
          x1={PX + 44}
          y1={PY - 60}
          x2={PX + 88}
          y2={PY + 62}
          stroke="#fbf6ea"
          strokeOpacity="0.85"
          strokeWidth="1"
        />
        <line
          x1={PX + 32}
          y1={PY + 10}
          x2={ox}
          y2={oy}
          stroke="#fbf6ea"
          strokeOpacity="0.9"
          strokeWidth="1.4"
        />
      </svg>

      <ul className="sp-list" aria-label="Sectors">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#s-${it.id}`}
              data-on={i === on || undefined}
              data-flag={it.flagship || undefined}
              onMouseEnter={() => {
                held.current = true;
                setOn(i);
              }}
              onFocus={() => {
                held.current = true;
                setOn(i);
              }}
            >
              {it.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
