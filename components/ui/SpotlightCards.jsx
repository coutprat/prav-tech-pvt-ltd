"use client";
import { useEffect } from "react";

// Activates the already-built CSS spotlight on cards by feeding --mx / --my
// from mousemove. CSS ::before is already in globals.css for .card;
// we extend the same behaviour to agent-card, pharma-cell, step, tl-card,
// and frontier-card here.
export default function SpotlightCards() {
  useEffect(() => {
    const SEL =
      ".card, .agent-card, .pharma-cell, .step, .tl-card, .frontier-card, .ph-card";
    let targets = [];

    function onMove(e) {
      const el = e.currentTarget;
      const r  = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top)  + "px");
    }

    function init() {
      targets = Array.from(document.querySelectorAll(SEL));
      targets.forEach((el) => {
        el.classList.add("sp-live");
        el.addEventListener("mousemove", onMove, { passive: true });
      });
    }

    // Short delay so StaticPageContent has flushed to DOM
    const t = setTimeout(init, 400);
    return () => {
      clearTimeout(t);
      targets.forEach((el) => el.removeEventListener("mousemove", onMove));
    };
  }, []);

  return null;
}
