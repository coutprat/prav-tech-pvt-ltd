"use client";

import { useEffect, useRef, type RefObject } from "react";
import { stageScale } from "@/lib/fit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/gsap";
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
  const router = useRouter();
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

  /* --------------------------------------------- depth: pointer parallax */
  // The render is pre-baked, so the depth is faked the way a camera would
  // show it: the stage drifts one way and the labels, nearer the viewer,
  // drift the other. Desktop pointers only, and never under reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    const pin = root?.closest<HTMLElement>(".sequence-pin");
    if (!root || !pin || !active || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const state = { x: 0, y: 0 };
    const write = () => {
      pin.style.setProperty("--px", state.x.toFixed(3));
      pin.style.setProperty("--py", state.y.toFixed(3));
    };
    const tx = gsap.quickTo(state, "x", { duration: 1.2, ease: "expo.out", onUpdate: write });
    const ty = gsap.quickTo(state, "y", { duration: 1.2, ease: "expo.out", onUpdate: write });
    const onMove = (e: PointerEvent) => {
      const r = pin.getBoundingClientRect();
      tx(((e.clientX - r.left) / r.width) * 2 - 1);
      ty(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => {
      tx(0);
      ty(0);
    };
    pin.classList.add("has-depth");
    pin.addEventListener("pointermove", onMove);
    pin.addEventListener("pointerleave", onLeave);
    return () => {
      pin.classList.remove("has-depth");
      pin.removeEventListener("pointermove", onMove);
      pin.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  /* ------------------------------------------- focus and the fly-in */
  const focusOn = (key: string | null, href?: string) => {
    const root = rootRef.current;
    if (!root) return;
    if (key) root.dataset.focus = key;
    else delete root.dataset.focus;
    if (href) router.prefetch(href);
  };

  const flyTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // New tab, modified click, or no motion: let the link behave as a link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || prefersReducedMotion()) return;
    const pin = rootRef.current?.closest<HTMLElement>(".sequence-pin");
    if (!pin) return;
    e.preventDefault();
    const dot = e.currentTarget.querySelector(".hero-label-dot") ?? e.currentTarget;
    const d = dot.getBoundingClientRect();
    const r = pin.getBoundingClientRect();
    pin.style.setProperty("--zx", `${d.left + d.width / 2 - r.left}px`);
    pin.style.setProperty("--zy", `${d.top + d.height / 2 - r.top}px`);
    pin.style.setProperty("--zacc", e.currentTarget.style.getPropertyValue("--acc"));
    pin.classList.add("is-flying");
    window.setTimeout(() => router.push(href), 620);
  };

  // Coming back with the browser's back button must not land mid-zoom.
  useEffect(() => {
    const clear = () =>
      rootRef.current?.closest(".sequence-pin")?.classList.remove("is-flying");
    window.addEventListener("pageshow", clear);
    return () => window.removeEventListener("pageshow", clear);
  }, []);

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
          onPointerEnter={() => focusOn(m.key, m.href)}
          onPointerLeave={() => focusOn(null)}
          onFocus={() => focusOn(m.key, m.href)}
          onBlur={() => focusOn(null)}
          onClick={(e) => flyTo(e, m.href)}
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
