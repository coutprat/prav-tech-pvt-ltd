"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useGpuScene } from "@/lib/capability";
import { observeVisible } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";
import type { GreeterSceneProps } from "@/components/three/GreeterScene";

/**
 * The 3D greeter as a page centrepiece (used on /start-a-project).
 *
 * Same contract as the other scenes: the mark holds the place, three.js is
 * fetched only on capable hardware once the figure is near the viewport, the
 * canvas draws only while on screen and the tab is visible, and reduced
 * motion never loads it.
 */
export function HeroGreeter() {
  const root = useRef<HTMLDivElement>(null);
  const capable = useGpuScene();
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [Scene, setScene] = useState<ComponentType<GreeterSceneProps> | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let onScreen = false;
    const sync = () => setActive(onScreen && document.visibilityState === "visible");
    const stopNear = observeVisible(
      el,
      (v) => {
        if (v) setNear(true);
      },
      "600px 0px"
    );
    const stopOn = observeVisible(
      el,
      (v) => {
        onScreen = v;
        sync();
      },
      "0px"
    );
    document.addEventListener("visibilitychange", sync);
    return () => {
      stopNear();
      stopOn();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (capable !== true || !near || Scene) return;
    let cancelled = false;
    import("@/components/three/GreeterScene")
      .then((m) => {
        if (!cancelled) setScene(() => m.default);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [capable, near, Scene]);

  return (
    <div ref={root} className="welcome-stage hero-greeter" data-ready={ready} aria-hidden="true">
      <div className="welcome-mark">
        <Mark size={84} />
      </div>
      {Scene && capable === true ? (
        <Scene active={active} onReady={() => setReady(true)} />
      ) : null}
    </div>
  );
}
