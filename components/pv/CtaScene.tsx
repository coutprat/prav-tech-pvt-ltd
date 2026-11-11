"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useGpuScene } from "@/lib/capability";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { observeVisible } from "@/lib/gsap";
import type { ConvergeSceneProps } from "@/components/three/ConvergeScene";

/**
 * Mounts the closing 3D figure behind the call-to-action band.
 *
 * Same contract as the hero: the band is complete without it (the CSS light
 * stays underneath), three.js is only fetched on capable hardware and only
 * once the band is close to the viewport, and the canvas renders only while
 * it is on screen and the tab is visible. Reduced motion never loads it.
 */
export function CtaScene() {
  const root = useRef<HTMLDivElement>(null);
  const capable = useGpuScene();
  const phone = useMediaQuery("(max-width: 899px)");

  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [Scene, setScene] = useState<ComponentType<ConvergeSceneProps> | null>(null);

  // Wake up a screen or so before the band arrives.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return observeVisible(
      el,
      (v) => {
        if (v) setNear(true);
      },
      "900px 0px"
    );
  }, []);

  useEffect(() => {
    if (capable !== true || !near || Scene) return;
    let cancelled = false;
    import("@/components/three/ConvergeScene")
      .then((m) => {
        if (!cancelled) setScene(() => m.default);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [capable, near, Scene]);

  // Only draw while the band is on screen and the tab is visible.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let onScreen = false;
    const sync = () => setActive(onScreen && document.visibilityState === "visible");
    const stop = observeVisible(
      el,
      (v) => {
        onScreen = v;
        sync();
      },
      "0px"
    );
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={root} className="pv-cta-scene" data-ready={ready} aria-hidden="true">
      {Scene && capable === true ? (
        <Scene active={active} lite={phone} onReady={() => setReady(true)} />
      ) : null}
    </div>
  );
}
