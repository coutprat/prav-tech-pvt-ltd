"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, prefersReducedMotion, afterPaint } from "@/lib/gsap";

/**
 * Casts a faint tint of the current business line's colour over the page
 * ground as that section passes through the viewport.
 *
 * Writes CSS custom properties on <body>, which a fixed pseudo-element reads,
 * so the cross-fade is a single compositor-friendly transition rather than
 * repainting any content. Strength stays very low — this is a cast of light
 * over the paper, not a change of background colour.
 */
export function ScrollTint({
  sections
}: {
  /** In document order: the element id to watch, and the colour to cast. */
  sections: { id: string; color: string }[];
}) {
  const done = useRef(false);

  useGSAP(() => {
    if (prefersReducedMotion() || done.current) return;

    const cancel = afterPaint(() => {
      const body = document.body;
      const triggers = sections.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 35%",
          onToggle: (self) => {
            if (self.isActive) {
              body.style.setProperty("--tint", s.color);
              body.style.setProperty("--tint-strength", "0.07");
            }
          },
          onLeave: () => body.style.setProperty("--tint-strength", "0"),
          onLeaveBack: () => body.style.setProperty("--tint-strength", "0")
        });
      });

      done.current = true;
      return () => triggers.forEach((t) => t?.kill());
    });

    return () => {
      cancel();
      document.body.style.setProperty("--tint-strength", "0");
    };
  }, []);

  return null;
}
