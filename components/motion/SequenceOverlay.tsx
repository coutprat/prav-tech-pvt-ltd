"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Screen-space tracks exported by the Blender scenes alongside the frames.
 * Positions are 0..1 from the top-left of the rendered image. Points behind
 * the camera come back as (-9, -9).
 */
export type Point = [number, number];

type RawTracks = {
  frames: number;
  resolution: [number, number];
  tracks: Record<string, Point[] | Point[][]>;
};

/**
 * Tracks flattened into typed arrays once, at load.
 *
 * The first version held the parsed JSON and rebuilt JS arrays on every
 * frame — `at.map(p => [x, y])` for a 72-point ring and four 24-point fibre
 * paths, sixty times a second. That is thousands of short-lived arrays a
 * second of pure GC pressure for data that never changes.
 */
type Track = {
  /** Points per frame: 1 for a moving object, N for a polyline. */
  stride: number;
  /** frames * stride * 2 floats, normalised 0..1. */
  data: Float32Array;
};

export type Tracks = {
  frames: number;
  resolution: [number, number];
  tracks: Record<string, Track>;
};

function flatten(raw: RawTracks): Tracks {
  const out: Record<string, Track> = {};
  for (const [key, frames] of Object.entries(raw.tracks)) {
    if (!frames.length) continue;
    const first = frames[0];
    const stride = Array.isArray(first[0]) ? (first as Point[]).length : 1;
    const data = new Float32Array(frames.length * stride * 2);
    for (let f = 0; f < frames.length; f++) {
      const at = frames[f];
      if (stride === 1) {
        const p = at as Point;
        data[f * 2] = p[0];
        data[f * 2 + 1] = p[1];
      } else {
        const pts = at as Point[];
        for (let i = 0; i < stride; i++) {
          data[(f * stride + i) * 2] = pts[i][0];
          data[(f * stride + i) * 2 + 1] = pts[i][1];
        }
      }
    }
    out[key] = { stride, data };
  }
  return { frames: raw.frames, resolution: raw.resolution, tracks: out };
}

/**
 * A pre-rendered radial glow, drawn once per colour and blitted with
 * drawImage thereafter.
 *
 * `createRadialGradient` per particle per frame was the single most expensive
 * thing in the overlay: Photonics draws ~100 particles, so that was ~100
 * gradient objects built and thrown away every frame.
 */
const SPRITE_SIZE = 64;
const spriteCache = new Map<string, HTMLCanvasElement>();

function glowSprite(color: string): HTMLCanvasElement {
  const cached = spriteCache.get(color);
  if (cached) return cached;

  const c = document.createElement("canvas");
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const ctx = c.getContext("2d");
  if (ctx) {
    const r = SPRITE_SIZE / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, color);
    g.addColorStop(0.18, color);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
  }
  spriteCache.set(color, c);
  return c;
}

/** Blit a pre-rendered glow. `r` is the core radius; the sprite extends ~4x. */
export function glowDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 1
) {
  if (alpha <= 0.01) return;
  const sprite = glowSprite(color);
  const size = r * 8;
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
}

/** Point at fraction `t` along a flat [x,y,x,y,...] path, written into `out`. */
export function alongPath(path: Float32Array, count: number, t: number, out: Point): Point {
  if (count < 2) {
    out[0] = path[0];
    out[1] = path[1];
    return out;
  }
  const clamped = t < 0 ? 0 : t > 0.9999 ? 0.9999 : t;
  const seg = clamped * (count - 1);
  const i = seg | 0;
  const f = seg - i;
  const ax = path[i * 2];
  const ay = path[i * 2 + 1];
  const bx = path[(i + 1) * 2];
  const by = path[(i + 1) * 2 + 1];
  out[0] = ax + (bx - ax) * f;
  out[1] = ay + (by - ay) * f;
  return out;
}

export type Resolver = {
  /** Resolved screen position of a single-point track, or null if off-screen. */
  point: (key: string, out: Point) => Point | null;
  /** Fills `out` with a polyline in canvas pixels; returns the point count. */
  path: (key: string, out: Float32Array) => number;
};

/**
 * Draws light particles on top of a <ScrollSequence>, using the per-frame
 * screen positions the render exported.
 *
 * Runs on **gsap.ticker**, not its own requestAnimationFrame. ScrollTrigger,
 * Lenis and the sequence canvas all already run there, so sharing the loop
 * guarantees the overlay paints in the same tick as the frame it belongs to.
 * With two independent loops the dots could resolve against a different frame
 * than the one on screen, which is exactly the trailing the owner reported.
 */
export function SequenceOverlay({
  tracksUrl,
  frameRef,
  frameCount,
  draw,
  active
}: {
  tracksUrl: string;
  frameRef: RefObject<number>;
  frameCount: number;
  draw: (
    ctx: CanvasRenderingContext2D,
    resolve: Resolver,
    t: number,
    size: { w: number; h: number }
  ) => void;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tracksRef = useRef<Tracks | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch(tracksUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: RawTracks | null) => {
        if (!cancelled && j) tracksRef.current = flatten(j);
      })
      .catch(() => {
        /* the overlay is an enhancement; the sequence stands on its own */
      });
    return () => {
      cancelled = true;
    };
  }, [tracksUrl, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reusable scratch, so the draw loop allocates nothing.
    let ox = 0;
    let oy = 0;
    let dw = 0;
    let dh = 0;

    const resize = () => {
      // Cap DPR: above 2 the particle layer costs 2-3x the fill for a
      // difference nobody can see on a soft glow.
      const cap = window.innerWidth < 900 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const resolver: Resolver = {
      point(key, out) {
        const data = tracksRef.current;
        if (!data) return null;
        const track = data.tracks[key];
        if (!track) return null;
        const f = clampFrame(frameRef.current ?? 0, data.frames, track);
        const i = f * 2;
        const nx = track.data[i];
        const ny = track.data[i + 1];
        if (nx < -1) return null;
        out[0] = ox + nx * dw;
        out[1] = oy + ny * dh;
        return out;
      },
      path(key, out) {
        const data = tracksRef.current;
        if (!data) return 0;
        const track = data.tracks[key];
        if (!track) return 0;
        const f = clampFrame(frameRef.current ?? 0, data.frames, track);
        const n = Math.min(track.stride, out.length >> 1);
        const base = f * track.stride * 2;
        for (let i = 0; i < n; i++) {
          out[i * 2] = ox + track.data[base + i * 2] * dw;
          out[i * 2 + 1] = oy + track.data[base + i * 2 + 1] * dh;
        }
        return n;
      }
    };

    const tick = () => {
      const data = tracksRef.current;
      if (!data) return;

      const [rw, rh] = data.resolution;
      // Match the sequence canvas's contain-fit box so overlay coordinates
      // land on the same pixels as the rendered frame.
      const scale = Math.min(canvas.width / rw, canvas.height / rh);
      dw = rw * scale;
      dh = rh * scale;
      ox = (canvas.width - dw) / 2;
      oy = (canvas.height - dh) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      draw(ctx, resolver, gsap.ticker.time, { w: canvas.width, h: canvas.height });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // Same loop as ScrollTrigger, Lenis and the frame canvas.
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
    };
  }, [draw, frameCount, active, frameRef]);

  if (!active) return null;
  return <canvas className="sequence-overlay" ref={canvasRef} aria-hidden="true" />;
}

function clampFrame(frame: number, frames: number, track: Track): number {
  const total = track.data.length / (track.stride * 2);
  const max = Math.min(frames, total) - 1;
  const f = Math.round(frame);
  return f < 0 ? 0 : f > max ? max : f;
}
