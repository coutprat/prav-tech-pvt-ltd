"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Runs the CSS animations inside only while on screen (data-live), so a
 * looping hero visual costs nothing once it has scrolled away. Under reduced
 * motion the attribute is never set and the visual rests in its final state.
 */
export function Live({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.setAttribute("data-live", "");
      else el.removeAttribute("data-live");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`lv ${className}`}>
      {children}
    </div>
  );
}
