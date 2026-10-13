"use client";

import { useSyncExternalStore } from "react";

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
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.6" />
            {[
              [12, 2, 12, 4.4],
              [12, 19.6, 12, 22],
              [2, 12, 4.4, 12],
              [19.6, 12, 22, 12],
              [4.9, 4.9, 6.6, 6.6],
              [17.4, 17.4, 19.1, 19.1],
              [19.1, 4.9, 17.4, 6.6],
              [6.6, 17.4, 4.9, 19.1]
            ].map(([x1, y1, x2, y2]) => (
              <line
                key={`${x1}-${y1}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ))}
          </>
        ) : (
          <path
            d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
