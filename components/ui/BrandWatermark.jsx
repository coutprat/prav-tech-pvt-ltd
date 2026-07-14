"use client";
import { useEffect, useRef } from "react";

export default function BrandWatermark() {
  const outerRef     = useRef(null);
  const svgRef       = useRef(null);
  const strokeRef    = useRef(null);  // animated draw text
  const revealGrad   = useRef(null);  // radialGradient for mask
  const textGrad     = useRef(null);  // linearGradient for highlight
  const drawn        = useRef(false);

  useEffect(() => {
    const outer = outerRef.current;
    const svg   = svgRef.current;
    if (!outer || !svg) return;

    /* ── Stroke draw on scroll into view ─────────────────────────── */
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !drawn.current) {
        drawn.current = true;
        const el = strokeRef.current;
        if (el) {
          el.style.transition = "stroke-dashoffset 2.8s cubic-bezier(.16,1,.3,1)";
          el.setAttribute("stroke-dashoffset", "0");
        }
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    io.observe(outer);

    /* ── Mouse tracking ───────────────────────────────────────────── */
    const VW = 450, VH = 150;

    function onMove(e) {
      const r  = svg.getBoundingClientRect();
      const mx = ((e.clientX - r.left)  / r.width)  * VW;
      const my = ((e.clientY - r.top)   / r.height) * VH;

      // reveal spotlight follows cursor
      revealGrad.current?.setAttribute("cx", mx);
      revealGrad.current?.setAttribute("cy", my);

      // gradient sweep along cursor x
      if (textGrad.current) {
        textGrad.current.setAttribute("x1", mx - 80);
        textGrad.current.setAttribute("y1", my);
        textGrad.current.setAttribute("x2", mx + 80);
        textGrad.current.setAttribute("y2", my);
      }
    }

    svg.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      io.disconnect();
      svg.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={outerRef} className="bwm-outer" aria-hidden="true">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 450 150"
        xmlns="http://www.w3.org/2000/svg"
        className="bwm-svg"
      >
        <defs>
          {/* colour highlight gradient — sweeps with mouse */}
          <linearGradient
            ref={textGrad}
            id="bwm-tg"
            gradientUnits="userSpaceOnUse"
            x1="145" y1="75" x2="305" y2="75"
          >
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="50%"  stopColor="#3ca2fa" stopOpacity="0.92" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* radial spotlight for mask */}
          <radialGradient
            ref={revealGrad}
            id="bwm-rm"
            gradientUnits="userSpaceOnUse"
            r="85"
            cx="225" cy="75"
          >
            <stop offset="0%"   stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <mask id="bwm-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#bwm-rm)" />
          </mask>
        </defs>

        {/* Layer 1 — static base outline, always visible */}
        <text
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.35"
          className="bwm-t bwm-base"
        >
          PRAVERSE
        </text>

        {/* Layer 2 — stroke draw animation */}
        <text
          ref={strokeRef}
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.35"
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
          strokeWidth="0.35"
          mask="url(#bwm-mask)"
          className="bwm-t bwm-reveal"
        >
          PRAVERSE
        </text>
      </svg>
    </div>
  );
}
