"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// Registered here rather than in lib/gsap so pages that never render a
// Headline do not download the plugin.
gsap.registerPlugin(SplitText);

/**
 * Line-by-line headline reveal.
 *
 * The text is rendered normally and is fully visible before JS runs — the
 * animation only ever hides lines it is about to show, so no-JS and
 * reduced-motion visitors get the finished headline, not a blank space.
 */
export function Headline({
  children,
  as: Tag = "h2",
  className = "h2",
  delay = 0,
  /** Animate when the element scrolls into view rather than on mount. */
  onScroll = false
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  onScroll?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = new SplitText(el, {
        type: "lines",
        linesClass: "line-inner",
        mask: "lines"
      });

      el.classList.add("is-animating");

      const tween = gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay,
        scrollTrigger: onScroll
          ? { trigger: el, start: "top 85%", once: true }
          : undefined,
        onComplete: () => el.classList.remove("is-animating")
      });

      return () => {
        tween.kill();
        split.revert();
      };
    },
    { scope: ref, dependencies: [delay, onScroll] }
  );

  // React 19's ElementType cannot carry a ref generically; narrow it here.
  const Comp = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Comp ref={ref} className={`headline ${className}`}>
      {children}
    </Comp>
  );
}
