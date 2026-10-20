"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AmbientPad } from "@/lib/ambient";

const KEY = "praverse-mennie-sound";

/**
 * The sound toggle for the MENNIE film.
 *
 * Off until the visitor asks: browsers block audio before a gesture, and a
 * page that starts making noise uninvited is a page people close. Once they
 * turn it on, the choice is remembered, and on the next visit the pad starts
 * at their first click or key press instead of needing the button again.
 *
 * The pad follows the film — it brightens with the scrub and chimes at each
 * beat — and fades out when the film leaves the screen or the tab is hidden.
 */
export function MennieSound({
  rootRef,
  progressRef,
  beat
}: {
  rootRef: RefObject<HTMLElement | null>;
  /** 0..1 through the clip, written on the ticker. */
  progressRef: RefObject<number>;
  /** Increments as the film crosses each chapter stop. */
  beat: number;
}) {
  const pad = useRef<AmbientPad | null>(null);
  const [on, setOn] = useState(false);
  const wantRef = useRef(false);
  const visibleRef = useRef(true);
  const lastBeat = useRef(beat);

  const sync = () => {
    const p = pad.current;
    if (!p) return;
    if (wantRef.current && visibleRef.current && !document.hidden) void p.start();
    else p.stop();
  };

  const enable = async () => {
    if (!pad.current) pad.current = new AmbientPad();
    wantRef.current = true;
    setOn(true);
    try {
      localStorage.setItem(KEY, "on");
    } catch {
      /* storage unavailable — fine for this visit */
    }
    sync();
  };

  const disable = () => {
    wantRef.current = false;
    setOn(false);
    try {
      localStorage.setItem(KEY, "off");
    } catch {
      /* storage unavailable */
    }
    sync();
  };

  // Returning visitor who chose sound: start at their first gesture.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* storage unavailable */
    }
    if (saved !== "on") return;
    const go = (e: Event) => {
      // A click on the toggle itself is handled by the toggle.
      if ((e.target as Element | null)?.closest?.(".film-sound")) return;
      void enable();
      remove();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown", go, { once: true });
    return remove;
    // enable is stable in behaviour; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade out off screen and in a hidden tab.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [rootRef]);

  // Follow the film while it is sounding.
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      const p = progressRef.current ?? 0;
      if (Math.abs(p - last) > 0.002) {
        last = p;
        pad.current?.setProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, progressRef]);

  // A chime each time the film moves into a new beat, forwards or back.
  useEffect(() => {
    if (beat !== lastBeat.current) {
      lastBeat.current = beat;
      pad.current?.chime(beat);
    }
  }, [beat]);

  useEffect(() => () => pad.current?.dispose(), []);

  return (
    <button
      type="button"
      className="film-sound"
      data-on={on}
      onClick={() => (on ? disable() : void enable())}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Play with sound"}
    >
      <span className="film-sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="film-sound-label">{on ? "Sound on" : "Play with sound"}</span>
    </button>
  );
}
