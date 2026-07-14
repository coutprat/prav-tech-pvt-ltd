"use client";
import { useEffect, useRef } from "react";

export default function ThemeToggleSwitch() {
  const checkRef  = useRef(null);
  const hiddenBtn = useRef(null);
  const pending   = useRef(false);

  /* sync checkbox with body[data-theme] */
  useEffect(() => {
    const sync = () => {
      if (checkRef.current)
        checkRef.current.checked = document.body.getAttribute("data-theme") === "space";
    };

    // read localStorage first (site.js may not have run yet at mount)
    try {
      const stored = localStorage.getItem("praverse-theme");
      if (checkRef.current) checkRef.current.checked = stored === "space";
    } catch {}
    sync();

    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  function handleChange(e) {
    if (pending.current) { e.preventDefault(); return; }
    pending.current = true;

    const goingSpace = e.target.checked;
    const label      = goingSpace ? "NOIR" : "FLUX";

    // launch cinematic overlay
    window.dispatchEvent(new CustomEvent("praverse-theme-transition", {
      detail: { label }
    }));

    // fire applyTheme via the hidden .theme-toggle button — panels fully
    // close at ~580ms so the theme repaint is always hidden under cover
    setTimeout(() => {
      hiddenBtn.current?.click();
      pending.current = false;
    }, 420);
  }

  return (
    <>
      {/* Hidden button that site.js click-delegation catches */}
      <button
        ref={hiddenBtn}
        className="theme-toggle"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        style={{ display: "none" }}
      />

      {/* Pill toggle */}
      <label className="ts-pill-wrap" aria-label="Toggle theme (Noir / Flux)">
        <input
          ref={checkRef}
          className="ts-pill"
          type="checkbox"
          onChange={handleChange}
        />
      </label>
    </>
  );
}
