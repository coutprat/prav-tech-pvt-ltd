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
/** True when WebGL is drawn by a CPU rasteriser rather than a GPU. */
let software = false;

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
      // A software rasteriser (no GPU, a blocklisted driver, a remote
      // desktop) reports WebGL but draws every pixel on the CPU. A shader
      // scene there costs the whole main thread, so it gets the SVG version.
      if (gl) {
        const g = gl as WebGLRenderingContext;
        const info = g.getExtension("WEBGL_debug_renderer_info");
        const renderer = String(
          info ? g.getParameter(info.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER)
        );
        software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
      }
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

/**
 * useHighPower, and additionally a real GPU behind WebGL.
 *
 * Only the shader scenes need this. Video and scroll-scrubbed sections run
 * fine on a software rasteriser, so they keep using useHighPower.
 */
export function useGpuScene(): boolean | null {
  const high = useHighPower();
  if (high !== true) return high;
  // ?gpu=1 forces the scene, for QA in headless browsers.
  if (typeof location !== "undefined" && /[?&]gpu=1/.test(location.search)) return true;
  return !software;
}
