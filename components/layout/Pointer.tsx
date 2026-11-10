"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The pointer layer: magnetic buttons and a soft champagne ring that trails
 * the cursor and opens over anything clickable.
 *
 * Fine pointers only, never under reduced motion, and the native cursor is
 * left alone — the ring is an accent, not a replacement. One pointermove
 * listener for the whole document; positions are written through
 * gsap.quickTo, so nothing re-renders.
 */
const MAGNETS = ".btn-p, .btn-g, .nav-cta, .wa-btn";
const HOT = "a, button, summary, [role='button'], input, textarea, select, label";

export function Pointer() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const el = ring.current;
    if (!fine || prefersReducedMotion() || !el) return;

    const rx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    let magnet: HTMLElement | null = null;
    let mx: ((v: number) => void) | null = null;
    let my: ((v: number) => void) | null = null;

    const release = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      el.setAttribute("data-show", "");
      rx(e.clientX);
      ry(e.clientY);

      const t = e.target as Element | null;
      if (t?.closest(HOT)) el.setAttribute("data-hot", "");
      else el.removeAttribute("data-hot");

      const m = t?.closest<HTMLElement>(MAGNETS) ?? null;
      if (m !== magnet) {
        release();
        if (m) {
          magnet = m;
          mx = gsap.quickTo(m, "x", { duration: 0.4, ease: "power3" });
          my = gsap.quickTo(m, "y", { duration: 0.4, ease: "power3" });
        }
      }
      if (magnet && mx && my) {
        const r = magnet.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.38);
      }
    };
    const onLeave = () => {
      el.removeAttribute("data-show");
      release();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
    };
  }, []);

  return <div ref={ring} className="cur" aria-hidden="true" />;
}
