"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * The line that lands once all four modules are docked.
 *
 * Driven off the same frame ref as everything else, and written straight to
 * the DOM on the ticker — it changes on every scroll tick, so re-rendering
 * React for it would be wasteful.
 */
export function HeroFinalCaption({
  frameRef,
  frameCount
}: {
  frameRef: RefObject<number>;
  frameCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = "";
    const tick = () => {
      const p = (frameRef.current ?? 0) / Math.max(1, frameCount - 1);
      const on = String(p > 0.9);
      // Only touch the DOM when it changes; an attribute write is a style
      // invalidation even when the value is the same.
      if (on === last) return;
      last = on;
      el.dataset.on = on;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [frameRef, frameCount]);

  return (
    <div className="hero-final" ref={ref} data-on="false">
      <p>One intelligence core. Four industries.</p>
      <small>Select a line to see how it works</small>
    </div>
  );
}
