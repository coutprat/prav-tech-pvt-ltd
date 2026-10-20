"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Staggered in-view reveal.
 *
 * Content is in the DOM and styled normally; this only hides it in the moment
 * before it animates, and only when GSAP is running. No-JS and reduced-motion
 * visitors see finished content, never a blank gap.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 18,
  className
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const tween = gsap.from(el, {
        opacity: 0,
        y,
        duration: 0.7,
        ease: "power3.out",
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [delay, y] }
  );

  // React 19's ElementType cannot carry a ref generically; narrow it here.
  const Comp = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Comp ref={ref} className={className ? `reveal ${className}` : "reveal"}>
      {children}
    </Comp>
  );
}
