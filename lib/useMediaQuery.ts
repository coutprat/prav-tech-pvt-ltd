"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a media query without setState-in-effect.
 *
 * useSyncExternalStore is the right tool here: the match is external state
 * that can change at any time (the visitor flips their OS motion setting, or
 * rotates the device), and it gives us a correct server snapshot instead of a
 * render-then-correct flash.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

/** True when the visitor has asked for reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Scroll position past a threshold, as a boolean. */
export function useScrolled(threshold = 8): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > threshold,
    () => false
  );
}

/**
 * The current theme, read from <html data-theme>.
 *
 * External state again: the pre-paint script sets it before React exists, and
 * the toggle mutates the attribute directly.
 */
export function useTheme(): "light" | "dark" {
  return useSyncExternalStore(
    (onChange) => {
      const obs = new MutationObserver(onChange);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
      return () => obs.disconnect();
    },
    () =>
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light",
    () => "light"
  );
}
