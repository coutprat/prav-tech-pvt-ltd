"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for the plugins every page needs.
 *
 * ScrollTrigger is used on nearly every page, so it lives here. SplitText and
 * DrawSVG are registered by the components that actually use them
 * (Headline, EvidenceThread) so a page does not download a plugin it never
 * calls. MotionPath was in the brief's list but nothing ended up needing it,
 * so it is not imported at all.
 */
let registered = false;
if (!registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Run `cb` after the browser has had a chance to paint.
 *
 * useGSAP fires in a layout effect, i.e. *before* paint. Creating a pinned
 * ScrollTrigger there forces a synchronous layout of the whole page, which on
 * a throttled mobile CPU pushed LCP out by ~2s of pure render delay even
 * though FCP was well under a second. Deferring the pin by two frames lets
 * the hero paint first and costs nothing visually, because nothing is
 * scrolled yet.
 *
 * Returns a canceller for the effect cleanup.
 */
export function afterPaint(cb: () => void): () => void {
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(cb);
  });
  return () => {
    cancelAnimationFrame(raf1);
    if (raf2) cancelAnimationFrame(raf2);
  };
}

export { gsap, ScrollTrigger };
