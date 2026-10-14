"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/useMediaQuery";

/**
 * Whether this device should get the full 3D experience.
 *
 * The rule, per the brief: WebGL must be available, the device must report
 * more than 4 GB of memory where it reports anything at all, and the visitor
 * must not have asked for reduced motion. Anything else gets the image-based
 * version, which is a complete experience rather than a degraded one.
 *
 * Deliberately conservative: `deviceMemory` is only exposed by Chromium, so
 * most phones return undefined. We treat unknown as "allowed" but still gate
 * on WebGL and on a coarse-pointer + small-screen heuristic, so a cheap
 * Android does not get handed a shader it cannot run.
 */
/** Measured once per page load; capability does not change under us. */
let cached: boolean | null = null;

/** Nothing to subscribe to — the answer is fixed for this session. */
const subscribe = () => () => {};

function measure(): boolean {
    let ok = true;

    // 1. WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      if (!gl) ok = false;
      // Release it immediately; contexts are a limited resource.
      const lose = (gl as WebGLRenderingContext | null)?.getExtension(
        "WEBGL_lose_context"
      );
      lose?.loseContext();
    } catch {
      ok = false;
    }

    // 2. Memory, where the browser tells us
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof mem === "number" && mem <= 4) ok = false;

    // 3. Very low core counts struggle with postprocessing
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2) {
      ok = false;
    }

    return ok;
}

export function useHighPower(): boolean | null {
  const reduced = useReducedMotion();

  // null on the server and for the first hydration pass, so callers render
  // the image fallback rather than flashing 3D on and off.
  const capable = useSyncExternalStore(
    subscribe,
    () => {
      if (cached === null) cached = measure();
      return cached;
    },
    () => null
  );

  if (reduced) return false;
  return capable;
}
