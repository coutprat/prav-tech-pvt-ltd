"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useGpuScene } from "@/lib/capability";
import { Mark } from "@/components/ui/Mark";
import type { GreeterSceneProps } from "@/components/three/GreeterScene";

type WelcomeApi = { show: () => void; skip: () => void };

const api = () => (window as Window & { __pvWelcome?: WelcomeApi }).__pvWelcome;

/**
 * The 3D greeter inside the opening curtain.
 *
 * Only a first visit on capable hardware ever fetches three.js here. The
 * mark is shown at once and the android fades in over it on its first frame;
 * the curtain script is then told how long to keep it on screen. A device
 * that will not get the 3D scene tells the script to lift early instead, so
 * nobody waits for something that is not coming.
 */
export function WelcomeBot() {
  const capable = useGpuScene();
  const [Scene, setScene] = useState<ComponentType<GreeterSceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  // Unmount the canvas as soon as the curtain has lifted.
  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      if (root.hasAttribute("data-welcomed")) setGone(true);
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(root, { attributes: true, attributeFilter: ["data-welcomed"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (capable === null) return;
    if (document.documentElement.hasAttribute("data-welcomed")) return;
    if (capable === false) {
      api()?.skip();
      return;
    }
    let cancelled = false;
    import("@/components/three/GreeterScene")
      .then((m) => {
        if (!cancelled) setScene(() => m.default);
      })
      .catch(() => api()?.skip());
    return () => {
      cancelled = true;
    };
  }, [capable]);

  return (
    <div className="welcome-stage" data-ready={ready}>
      <div className="welcome-mark">
        <Mark size={84} />
      </div>
      {Scene && !gone ? (
        <Scene
          onReady={() => {
            setReady(true);
            api()?.show();
          }}
        />
      ) : null}
    </div>
  );
}
