"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The outlined PRAVERSE wordmark that closes every page.
 *
 * Carried over from the previous site, where the owner liked it, and rebuilt
 * rather than copied. Two reasons the original could not come across as-is:
 *
 *  - it was a framer-motion component, and this project animates with GSAP.
 *    Shipping a second animation library for one footer flourish is a poor
 *    trade, so the draw-in and the cursor reveal are GSAP, and the travelling
 *    highlight is SMIL, which needs no JavaScript at all.
 *  - it was hard-coded for a dark background: a pale blue stroke that would
 *    have been invisible on this site's light theme. The stroke, the sweep and
 *    the reveal all take theme tokens now, so it reads on paper and on navy.
 *
 * Four layers, back to front: the resting outline, the stroke that draws
 * itself in when the footer first scrolls into view, a highlight that travels
 * across the letterforms on a loop, and a brand-gradient reveal that follows
 * the cursor through a radial mask.
 *
 * Entirely decorative — the company name is already in the footer as real
 * text — so it is hidden from assistive technology, and under reduced motion
 * it simply renders as a static outline.
 */
const TEXT = "PRAVERSE";

export function FooterWordmark() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current;
      if (!svg) return;

      const reduced = prefersReducedMotion();
      const draw = svg.querySelector<SVGTextElement>(".wm-draw");
      const reveal = svg.querySelector<SVGRadialGradientElement>("#wm-reveal");

      if (reduced) {
        if (draw) gsap.set(draw, { strokeDasharray: "none", strokeDashoffset: 0 });
        return;
      }

      // Draws itself the first time the footer comes into view.
      let tween: gsap.core.Tween | null = null;
      if (draw) {
        gsap.set(draw, { strokeDasharray: 1400, strokeDashoffset: 1400 });
        tween = gsap.to(draw, {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
          scrollTrigger: { trigger: svg, start: "top 92%", once: true }
        });
      }

      // The reveal follows the pointer. Written straight to the gradient
      // rather than through React state: this fires on every mouse move, and
      // a re-render per move for a decorative flourish is not a good trade.
      if (!reveal) return;
      const quickX = gsap.quickTo(reveal, "attr:cx", { duration: 0.42, ease: "power3" });
      const quickY = gsap.quickTo(reveal, "attr:cy", { duration: 0.42, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        quickX(((e.clientX - r.left) / r.width) * 450);
        quickY(((e.clientY - r.top) / r.height) * 150);
      };
      const onLeave = () => {
        quickX(225);
        quickY(75);
      };

      svg.addEventListener("pointermove", onMove);
      svg.addEventListener("pointerleave", onLeave);
      return () => {
        svg.removeEventListener("pointermove", onMove);
        svg.removeEventListener("pointerleave", onLeave);
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    },
    { scope: root }
  );

  const common = {
    x: "50%",
    y: "50%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontSize: 62,
    fontWeight: 600,
    letterSpacing: "0.01em",
    fill: "transparent"
  };

  return (
    <svg
      ref={root}
      className="wm"
      /*
       * Cropped to the letterforms. The text sits at y=75 with a 62px face, so
       * the glyphs occupy roughly 44..106 — a full 0..150 box left a third of
       * the footer as empty space above and below the word.
       */
      viewBox="0 41 450 68"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* the travelling highlight */}
        <linearGradient id="wm-sweep" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="450" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="34%" stopColor="var(--wm-sweep-a)" stopOpacity="0" />
          <stop offset="47%" stopColor="var(--wm-sweep-a)" stopOpacity="0.85" />
          <stop offset="53%" stopColor="var(--wm-sweep-b)" stopOpacity="1" />
          <stop offset="66%" stopColor="var(--wm-sweep-a)" stopOpacity="0" />
          <stop offset="100%" stopColor="transparent" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-620 0"
            to="620 0"
            dur="6s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* brand gradient, shown through the cursor mask */}
        <linearGradient id="wm-brand" gradientUnits="userSpaceOnUse" x1="60" y1="20" x2="400" y2="130">
          <stop offset="0" stopColor="#4ACBB4" />
          <stop offset="0.55" stopColor="#43AABC" />
          <stop offset="1" stopColor="#3B7FC2" />
        </linearGradient>

        <radialGradient id="wm-reveal" gradientUnits="userSpaceOnUse" r="78" cx="225" cy="75">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="wm-mask">
          <rect x="0" y="0" width="450" height="150" fill="url(#wm-reveal)" />
        </mask>

        <filter id="wm-glow" x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="1.1" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* resting outline */}
      <text {...common} className="wm-rest" strokeWidth="0.55">
        {TEXT}
      </text>

      {/* draws in on first view */}
      <text {...common} className="wm-draw" strokeWidth="0.7">
        {TEXT}
      </text>

      {/* travelling highlight */}
      <text {...common} stroke="url(#wm-sweep)" strokeWidth="0.9" filter="url(#wm-glow)">
        {TEXT}
      </text>

      {/* brand gradient, revealed around the cursor */}
      <text {...common} stroke="url(#wm-brand)" strokeWidth="1.1" mask="url(#wm-mask)">
        {TEXT}
      </text>
    </svg>
  );
}
