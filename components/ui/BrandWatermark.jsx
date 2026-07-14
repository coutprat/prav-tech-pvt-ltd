"use client";
import { useEffect, useRef } from "react";

export default function BrandWatermark() {
  const outerRef   = useRef(null);
  const strokeRef  = useRef(null);
  const revealRef  = useRef(null);   // radialGradient — spotlight cx/cy
  const gradRef    = useRef(null);   // linearGradient  — colour x1/y1/x2/y2
  const drawn      = useRef(false);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const svg = outer.querySelector("svg");

    /* ── Stroke draw on scroll into view ────────────────────────── */
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !drawn.current) {
        drawn.current = true;
        const el = strokeRef.current;
        if (el) {
          el.style.transition = "stroke-dashoffset 3s cubic-bezier(.16,1,.3,1)";
          el.setAttribute("stroke-dashoffset", "0");
        }
      }
    }, { threshold: 0.1 });
    io.observe(outer);

    /* ── Mouse follow — update mask spotlight + gradient sweep ─── */
    const VW = 450, VH = 150;

    function onMove(e) {
      const r  = svg.getBoundingClientRect();
      const mx = ((e.clientX - r.left)  / r.width)  * VW;
      const my = ((e.clientY - r.top)   / r.height) * VH;

      // radial spotlight follows cursor
      revealRef.current?.setAttribute("cx", mx);
      revealRef.current?.setAttribute("cy", my);

      // colour gradient sweeps horizontally with cursor
      if (gradRef.current) {
        gradRef.current.setAttribute("x1", mx - 100);
        gradRef.current.setAttribute("y1", my);
        gradRef.current.setAttribute("x2", mx + 100);
        gradRef.current.setAttribute("y2", my);
      }
    }

    svg?.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      io.disconnect();
      svg?.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={outerRef} className="bwm-outer" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 450 150"
        xmlns="http://www.w3.org/2000/svg"
        className="bwm-svg"
      >
        <defs>
          {/* colour gradient — sweeps with mouse; starts transparent, populated on move */}
          <linearGradient
            ref={gradRef}
            id="bwm-tg"
            gradientUnits="userSpaceOnUse"
            x1="125" y1="75" x2="325" y2="75"
          >
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="50%"  stopColor="#3ca2fa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* radial spotlight mask */}
          <radialGradient
            ref={revealRef}
            id="bwm-rm"
            gradientUnits="userSpaceOnUse"
            r="90"
            cx="225" cy="75"
          >
            <stop offset="0%"   stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <mask id="bwm-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#bwm-rm)" />
          </mask>
        </defs>

        {/* Layer 1 — hidden base (matches reference opacity:0) */}
        <text
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.3"
          className="bwm-t bwm-base"
          style={{ opacity: 0 }}
        >
          PRAVERSE
        </text>

        {/* Layer 2 — stroke draw animation in brand blue */}
        <text
          ref={strokeRef}
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="bwm-t bwm-draw"
        >
          PRAVERSE
        </text>

        {/* Layer 3 — mouse-reveal gradient highlight */}
        <text
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          stroke="url(#bwm-tg)"
          strokeWidth="0.3"
          mask="url(#bwm-mask)"
          className="bwm-t bwm-reveal"
        >
          PRAVERSE
        </text>
      </svg>
    </div>
  );
}
