"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// ─── Default waypoints — one per section ──────────────────────────────────────
// x/y are viewport fractions (0–1). rot is degrees (+ = clockwise).
// curveFactor controls arc intensity between this and the next waypoint.
// flip alternates which side of the line the arc bows toward.
export const DEFAULT_WAYPOINTS = [
  { sectionId: "hero",                x: 0.84, y: 0.14, rot:  22, curveFactor: 0.42, flip: false },
  { sectionId: "capabilities",        x: 0.10, y: 0.52, rot: -18, curveFactor: 0.48, flip: true  },
  { sectionId: "agents",              x: 0.82, y: 0.68, rot:  28, curveFactor: 0.44, flip: false },
  { sectionId: "innovation-stations", x: 0.48, y: 0.10, rot:  -6, curveFactor: 0.50, flip: true  },
  { sectionId: "pharma",              x: 0.86, y: 0.52, rot:  20, curveFactor: 0.46, flip: false },
  { sectionId: "journey",             x: 0.08, y: 0.32, rot: -24, curveFactor: 0.44, flip: true  },
  { sectionId: "frontier",            x: 0.54, y: 0.16, rot:   8, curveFactor: 0.50, flip: false },
  { sectionId: "process",             x: 0.80, y: 0.44, rot: -12, curveFactor: 0.40, flip: true  },
  { sectionId: "healthmate",          x: 0.10, y: 0.80, rot: -32, curveFactor: 0.38, flip: false },
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── Math helpers ─────────────────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function bezier1D(p0, ctrl, p1, t) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * ctrl + t * t * p1;
}

// Control point that bows the path between A→B off-center for a curved arc
function controlPoint(ax, ay, bx, by, factor, flip) {
  const mx   = (ax + bx) / 2;
  const my   = (ay + by) / 2;
  const dx   = bx - ax;
  const dy   = by - ay;
  const len  = Math.sqrt(dx * dx + dy * dy) || 1;
  const sign = flip ? 1 : -1;
  return {
    x: mx + sign * (-dy / len) * factor * len,
    y: my + sign * (dx / len)  * factor * len,
  };
}
// ──────────────────────────────────────────────────────────────────────────────

export default function SatelliteParallax({ waypoints = DEFAULT_WAYPOINTS }) {
  const wrapRef   = useRef(null);
  const stRef     = useRef(null);
  const rangesRef = useRef([]); // [{scrollStart, scrollEnd}] per waypoint segment

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (wrapRef.current) wrapRef.current.style.display = "none";
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;

    const isMobile = () => window.innerWidth < 768;
    const getSize  = () => (isMobile() ? 90 : 160);

    // ── Build scroll ranges from section positions ────────────────────────────
    // Each range spans from when this section hits the viewport until the next one does.
    function buildRanges() {
      const scrollMax = document.body.scrollHeight - window.innerHeight;
      const starts = waypoints.map((wp, i) => {
        const el = document.getElementById(wp.sectionId);
        if (!el) return (i / waypoints.length) * scrollMax;
        // Trigger when section is 40% into viewport
        return Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4);
      });
      return starts.map((s, i) => ({
        scrollStart: s,
        scrollEnd: i < starts.length - 1 ? starts[i + 1] : scrollMax,
      }));
    }

    // ── Core placement function ───────────────────────────────────────────────
    function place(scrollY) {
      const vw     = window.innerWidth;
      const vh     = window.innerHeight;
      const sz     = getSize();
      const ranges = rangesRef.current;
      if (!ranges.length) return;

      // Which segment are we in?
      let seg = ranges.length - 1;
      for (let i = 0; i < ranges.length; i++) {
        if (scrollY < ranges[i].scrollEnd) { seg = i; break; }
      }

      const { scrollStart, scrollEnd } = ranges[seg];
      const rawT = (scrollY - scrollStart) / Math.max(1, scrollEnd - scrollStart);
      const t    = easeInOut(Math.min(1, Math.max(0, rawT)));

      const wp0 = waypoints[seg];
      const wp1 = waypoints[Math.min(seg + 1, waypoints.length - 1)];

      const ax = wp0.x * vw, ay = wp0.y * vh;
      const bx = wp1.x * vw, by = wp1.y * vh;
      const cp = controlPoint(ax, ay, bx, by, wp0.curveFactor ?? 0.45, wp0.flip ?? false);

      const x   = bezier1D(ax, cp.x, bx, t);
      const y   = bezier1D(ay, cp.y, by, t);
      const rot = wp0.rot + (wp1.rot - wp0.rot) * t;

      // Fade out when exiting the last section
      const isLastSeg = seg === ranges.length - 1;
      const opacity   = isLastSeg ? Math.max(0, 1 - t * 1.6) : 1;

      wrap.style.opacity   = String(opacity);
      wrap.style.width     = sz + "px";
      wrap.style.height    = sz + "px";
      wrap.style.transform = `translate(${x - sz / 2}px, ${y - sz / 2}px) rotate(${rot}deg)`;
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    rangesRef.current = buildRanges();
    place(window.scrollY);

    // ── Wire to Lenis/ScrollTrigger ───────────────────────────────────────────
    function hookST() {
      const gsap = window.gsap;
      const ST   = window.ScrollTrigger;
      if (!gsap || !ST) { setTimeout(hookST, 40); return; }

      stRef.current = ST.create({
        trigger: document.body,
        start:   "top top",
        end:     "bottom bottom",
        onUpdate(self) {
          place(self.progress * (document.body.scrollHeight - window.innerHeight));
        },
      });

      return () => {};
    }

    const cleanup = hookST();

    function onResize() {
      rangesRef.current = buildRanges();
      place(window.scrollY);
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stRef.current?.kill();
      window.removeEventListener("resize", onResize);
      cleanup?.();
    };
  }, [waypoints]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        zIndex:        4,
        pointerEvents: "none",
        willChange:    "transform",
      }}
    >
      <Image
        src="/satellite.png"
        alt=""
        fill
        sizes="(max-width:768px) 90px, 160px"
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
}
