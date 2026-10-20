"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, afterPaint, prefersReducedMotion } from "@/lib/gsap";

/**
 * Site-wide scroll choreography, so every page moves the same way without
 * each section wiring its own tweens.
 *
 * - Content blocks rise into place in staggered batches as they arrive.
 * - Lit seams along the top of alternate sections draw in.
 * - Aurora glow fields drift slower than the page, for depth.
 * - Cards carry a spotlight that follows the pointer.
 *
 * Only what is below the fold when the page arrives is ever hidden, so
 * nothing on screen blinks out on load, and reduced-motion visitors get the
 * finished page with no movement at all.
 */
const RISE = [
  ".card",
  ".why-list > li",
  ".steps > li",
  ".sov-tests > li",
  ".sov-story",
  ".sov-phases > li",
  ".milestone",
  ".spec-wrap",
  ".chip-list",
  ".speed-list",
  ".stat-value",
  ".stat-label",
  ".stat-note",
  ".lede",
  ".body-2",
  ".section-label"
].join(",");

/** Elements that already animate themselves, or live in a pinned scene. */
const SKIP =
  ".reveal, .sequence, .fs, .film, .mod-section, .mennie-hero, [data-no-motion], .footer, .cta";

const SPOT = ".card, .why-list > li, .sov-story, .steps > li";

export function ScrollMotion() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  // Arm the page fade-in for every navigation after the first load.
  useEffect(() => {
    if (pathname !== firstPath.current) {
      document.documentElement.classList.add("navigated");
    }
  }, [pathname]);

  /* ---------------------------------------------------- pointer spotlight */
  useEffect(() => {
    let raf = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(SPOT) ?? null;
      if (!el) return;
      target = el;
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!target) return;
        const r = target.getBoundingClientRect();
        target.style.setProperty("--sx", `${x - r.left}px`);
        target.style.setProperty("--sy", `${y - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ------------------------------------------------------ scroll reveals */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("motion");

    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Animation[] = [];

    // After paint, so pinned sequences have inserted their spacers and the
    // positions measured here are the real ones.
    const cancel = afterPaint(() => {
      const vh = window.innerHeight;

      const rise = Array.from(document.querySelectorAll<HTMLElement>(RISE)).filter(
        (el) =>
          !el.closest(SKIP) &&
          // A nested match (a .body-2 inside a .card) moves with its parent.
          !el.parentElement?.closest(RISE) &&
          el.getBoundingClientRect().top > vh * 0.9
      );
      rise.forEach((el) => el.setAttribute("data-m", ""));

      triggers.push(
        ...ScrollTrigger.batch(rise, {
          start: "top 92%",
          once: true,
          interval: 0.08,
          batchMax: 8,
          onEnter: (batch) => {
            const els = batch as HTMLElement[];
            els.forEach((el) => {
              el.setAttribute("data-m-done", "");
              // CSS transitions on transform would chase every GSAP frame.
              el.style.transition = "none";
            });
            tweens.push(
              gsap.fromTo(
                els,
                { opacity: 0, y: 44, scale: 0.985 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 1.15,
                  ease: "expo.out",
                  stagger: 0.075,
                  clearProps: "transform,scale,transition",
                  onComplete: () => els.forEach((el) => (el.style.opacity = ""))
                }
              )
            );
          }
        })
      );

      triggers.push(
        ...ScrollTrigger.batch(".section-alt", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => batch.forEach((el) => el.classList.add("is-in"))
        })
      );

      document.querySelectorAll<HTMLElement>(".aurora").forEach((el) => {
        const host = el.parentElement;
        if (!host) return;
        const t = gsap.fromTo(
          el,
          { yPercent: 10 },
          {
            yPercent: -14,
            ease: "none",
            scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: 0.6 }
          }
        );
        tweens.push(t);
        if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      });
    });

    return () => {
      cancel();
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      document
        .querySelectorAll("[data-m]")
        .forEach((el) => el.removeAttribute("data-m"));
    };
  }, [pathname]);

  return null;
}
