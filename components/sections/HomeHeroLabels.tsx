"use client";

import { useEffect, useRef, type RefObject } from "react";
import { stageScale } from "@/lib/fit";
import Link from "next/link";
import { gsap, observeVisible } from "@/lib/gsap";
import type { Tracks } from "@/components/motion/SequenceOverlay";
import { fetchTracks } from "@/lib/tracks";

/**
 * Labels and clickable hotspots that track each docked module.
 *
 * This is what actually makes the hero legible. At hero framing each module is
 * only ~60px wide, so geometry alone cannot say "this one is pharma" no matter
 * how it is shaped — colour distinguishes them, and this says what they are.
 *
 * Positions come from the same positions.json the render exported, so a label
 * sits exactly on its module as the camera pushes in. Each is a real <Link>,
 * so the four lines are keyboard-reachable and crawlable, not canvas pixels.
 */
const MODULES = [
  {
    key: "module0",
    href: "/enterprise-ai",
    name: "Enterprise AI",
    line: "agents and copilots inside real workflows",
    accent: "var(--acc-ent)",
    ink: "var(--acc-ent-ink)",
    litAt: 0.3435
  },
  {
    key: "module1",
    href: "/pharma",
    name: "Pharma AI",
    line: "evidence-linked quality systems",
    accent: "var(--acc-pha)",
    ink: "var(--acc-pha-ink)",
    litAt: 0.5185
  },
  {
    key: "module2",
    href: "/mennie",
    name: "Healthcare AI",
    line: "MENNIE, a voice-first patient assistant",
    accent: "var(--acc-men)",
    ink: "var(--acc-men-ink)",
    litAt: 0.6935
  },
  {
    key: "module3",
    href: "/photonics",
    name: "Photonics",
    line: "the interconnect under AI data centres",
    accent: "var(--acc-pho)",
    ink: "var(--acc-pho-ink)",
    litAt: 0.8685
  }
] as const;

export function HomeHeroLabels({
  frameRef,
  frameCount,
  tracksUrl,
  active
}: {
  frameRef: RefObject<number>;
  frameCount: number;
  tracksUrl: string;
  active: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<Tracks["tracks"] | null>(null);
  const resRef = useRef<[number, number]>([1600, 900]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetchTracks(tracksUrl)
      .then((raw) => {
        const j = raw as {
          resolution: [number, number];
          tracks: Record<string, unknown>;
        } | null;
        if (cancelled || !j) return;
        resRef.current = j.resolution;
        const flat: Record<string, Float32Array> = {};
        for (const [k, frames] of Object.entries(j.tracks)) {
          const list = frames as [number, number][];
          if (Array.isArray(list[0]?.[0])) continue; // polylines not needed here
          const arr = new Float32Array(list.length * 2);
          list.forEach((p, i) => {
            arr[i * 2] = p[0];
            arr[i * 2 + 1] = p[1];
          });
          flat[k] = arr;
        }
        tracksRef.current = flat as unknown as Tracks["tracks"];
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tracksUrl, active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;

    const nodes = MODULES.map((m) =>
      root.querySelector<HTMLElement>(`[data-mod="${m.key}"]`)
    );

    // Measured on resize, not per tick: a getBoundingClientRect() after last
    // tick's transform writes forced a synchronous layout on every frame.
    let rect = { width: 0, height: 0 };
    const measure = () => {
      const r = root.getBoundingClientRect();
      rect = { width: r.width, height: r.height };
      lastFrame = -1;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    let lastFrame = -1;
    const tick = () => {
      const tracks = tracksRef.current as unknown as Record<string, Float32Array> | null;
      if (!tracks) return;
      if (!rect.width) measure();

      // Nothing moves unless the scrubbed frame does.
      const current = Math.round(frameRef.current ?? 0);
      if (current === lastFrame) return;
      lastFrame = current;
      const [rw, rh] = resRef.current;
      // Match the sequence canvas's cover-fit box.
      const scale = stageScale(rect.width, rect.height, rw, rh);
      const dw = rw * scale;
      const dh = rh * scale;
      const ox = (rect.width - dw) / 2;
      const oy = (rect.height - dh) / 2;

      const frame = current;
      const progress = frame / Math.max(1, frameCount - 1);

      MODULES.forEach((m, i) => {
        const el = nodes[i];
        const arr = tracks[m.key];
        if (!el || !arr) return;

        const f = Math.max(0, Math.min(arr.length / 2 - 1, frame));
        const nx = arr[f * 2];
        const ny = arr[f * 2 + 1];

        const on = progress >= m.litAt && nx > -1;
        el.dataset.on = String(on);
        if (!on) return;

        el.style.transform = `translate3d(${ox + nx * dw}px, ${oy + ny * dh}px, 0)`;
        // Flip the label inboard when the module is near the right edge, so it
        // never runs off screen as the camera moves.
        el.dataset.side = nx > 0.62 ? "left" : "right";
      });
    };

    let ticking = false;
    const stopObserving = observeVisible(root, (visible) => {
      if (visible === ticking) return;
      ticking = visible;
      if (visible) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    });
    return () => {
      stopObserving();
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [frameRef, frameCount, active]);

  if (!active) return null;

  return (
    <div className="hero-labels" ref={rootRef}>
      {MODULES.map((m) => (
        <Link
          key={m.key}
          href={m.href}
          className="hero-label"
          data-mod={m.key}
          data-on="false"
          style={
            {
              ["--acc" as string]: m.accent,
              ["--acc-ink" as string]: m.ink
            } as React.CSSProperties
          }
        >
          <span className="hero-label-dot" aria-hidden="true" />
          <span className="hero-label-body">
            <b>{m.name}</b>
            <span>{m.line}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export { MODULES as HERO_MODULES };
