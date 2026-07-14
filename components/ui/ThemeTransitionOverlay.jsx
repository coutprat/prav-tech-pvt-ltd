"use client";
import { useEffect, useState } from "react";

export default function ThemeTransitionOverlay() {
  const [info, setInfo] = useState({ phase: "idle", label: "NOIR" });

  useEffect(() => {
    function onTransition(e) {
      const label = e.detail?.label ?? "NOIR";
      setInfo({ phase: "enter", label });

      // panels close at ~580ms → hold
      const t1 = setTimeout(() => setInfo(s => ({ ...s, phase: "hold"  })),  560);
      // hold for 1s so user can read NOIR / FLUX comfortably
      const t2 = setTimeout(() => setInfo(s => ({ ...s, phase: "exit"  })), 1560);
      // exit panels take ~590ms → unmount
      const t3 = setTimeout(() => setInfo(s => ({ ...s, phase: "idle"  })), 2220);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    window.addEventListener("praverse-theme-transition", onTransition);
    return () => window.removeEventListener("praverse-theme-transition", onTransition);
  }, []);

  if (info.phase === "idle") return null;

  const isNoir = info.label === "NOIR";

  return (
    <div
      className={`tto-root tto-${info.phase} ${isNoir ? "tto-noir" : "tto-flux"}`}
      aria-hidden="true"
    >
      <div className="tto-panel tto-top" />
      <div className="tto-panel tto-bot" />

      {/* seam line that appears when panels meet */}
      <div className="tto-seam" />

      {/* mode label */}
      <div className="tto-label">
        <span className="tto-word-wrap">
          <span className="tto-word">{info.label}</span>
        </span>
        <span className="tto-sub">
          {isNoir ? "dark experience" : "light experience"}
        </span>
      </div>
    </div>
  );
}
