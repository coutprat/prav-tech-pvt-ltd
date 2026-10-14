"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

const KEY = "praverse-theme";

/**
 * Runs before first paint to set the theme, so there is no light flash on a
 * dark-mode load. Kept deliberately tiny and dependency-free.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("${KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.setAttribute("data-theme","dark");}catch(e){}})();`;

/**
 * The theme lives on <html data-theme>, set before paint by themeScript.
 * That makes it external state, so it is read with useSyncExternalStore
 * rather than mirrored into React state inside an effect.
 *
 * The server snapshot is `false`, so the button renders its light-mode label
 * during SSR and React re-renders with the real value on hydration.
 */
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
  return () => obs.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false
  );

  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* storage unavailable — the theme still applies for this page view */
    }
  }

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? (
        <Sun size={17} weight="duotone" aria-hidden="true" />
      ) : (
        <Moon size={17} weight="duotone" aria-hidden="true" />
      )}
    </button>
  );
}
