"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useGpuScene } from "@/lib/capability";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";
import { observeVisible } from "@/lib/gsap";
import { LINES, prismLayout, type PrismLayout } from "@/lib/prism-layout";
import { PrismFallback } from "@/components/hero/PrismFallback";
import type { PrismSceneProps } from "@/components/three/PrismScene";

/**
 * Home hero. The figure is a dispersion prism: one white beam in, four
 * coloured beams out, one per business line — one engineering core, four
 * disciplines. The four labels are real links.
 *
 * Loading order, so the hero is never blank and never blocks the LCP:
 *   1. Server HTML: copy + the SVG version of the figure.
 *   2. After load and idle, on capable hardware only, three.js is fetched
 *      with a bare import() (next/dynamic would add it to the preload list).
 *   3. The canvas fades in over the SVG once its first frame is drawn.
 * Reduced motion, software WebGL and weak devices stay on step 1.
 */
export function PrismHero({ lead, proof }: { lead: string; proof?: string }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const hover = useRef(-1);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const highPower = useGpuScene();
  const reduced = useReducedMotion();
  const phone = useMediaQuery("(max-width: 899px)");

  const [L, setL] = useState<PrismLayout>(() => prismLayout(1440, 900));
  const [measured, setMeasured] = useState(false);
  const [Scene, setScene] = useState<ComponentType<PrismSceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [hovered, setHovered] = useState(-1);

  // Size the figure to the stage.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setL(prismLayout(Math.round(r.width), Math.round(r.height)));
        setMeasured(true);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fetch the 3D scene once the page is idle, capable hardware only.
  useEffect(() => {
    if (highPower !== true) return;
    let cancelled = false;
    let idle = 0;
    const go = () => {
      const ric =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(
        () => {
          import("@/components/three/PrismScene")
            .then((m) => {
              if (!cancelled) setScene(() => m.default);
            })
            .catch(() => {});
        },
        { timeout: 2500 }
      );
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
      if (idle) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [highPower]);

  // Only render while the hero is on screen and the tab is visible.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => setActive(onScreen && document.visibilityState === "visible");
    const stop = observeVisible(el, (v) => {
      onScreen = v;
      sync();
    }, "0px");
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Scroll and pointer feed the scene through refs: no re-renders.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.offsetHeight || window.innerHeight;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const setHover = (i: number) => {
    hover.current = i;
    setHovered(i);
  };

  const live = Scene !== null && !reduced;

  return (
    <section
      ref={root}
      className="ph"
      data-ready={ready}
      data-measured={measured}
      data-hover={hovered >= 0 ? LINES[hovered].id : undefined}
      aria-labelledby="ph-title"
    >
      <div className="ph-stage" ref={stage}>
        <PrismFallback L={L} still={reduced} />
        {live ? (
          <Scene
            active={active}
            lite={phone}
            hover={hover}
            scroll={scroll}
            pointer={pointer}
            labels={labels}
            onReady={() => setReady(true)}
          />
        ) : null}

        <ul className="ph-labels" aria-label="Business lines">
          {LINES.map((line, i) => (
            <li
              key={line.id}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="ph-label"
              style={{
                transform: `translate3d(${L.ends[i].x}px, ${L.ends[i].y}px, 0)`,
                ["--c" as string]: line.color,
                transitionDelay: `${1.6 + i * 0.08}s`
              }}
            >
              <Link
                href={line.href}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(-1)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
              >
                <span className="ph-label-n">{line.n}</span>
                <span className="ph-label-t">
                  <span className="ph-label-long">{line.title}</span>
                  <span className="ph-label-short">{line.short}</span>
                </span>
                <span className="ph-label-note">{line.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="ph-fig mono"
          aria-hidden="true"
          style={{
            left: L.centre.x - L.size * 0.9,
            top: L.centre.y + L.size * 0.5 + 96
          }}
        >
          <span>Fig. 01</span> One input, four disciplines. White light enters the
          glass and leaves separated by wavelength.
        </p>
      </div>

      <div className="ph-copy wrap">
        {/* The eyebrow says what Praverse is, so it is part of the H1. */}
        <h1 id="ph-title" className="ph-h1-group">
          <span className="eyebrow ph-eyebrow">
            <span className="ph-dot" aria-hidden="true" />
            {lead}
          </span>
          <span className="ph-title">
            Intelligence, <em>engineered</em> for industry.
          </span>
        </h1>
        <p className="ph-lede">
          Bring us the problem. One engineering core builds the answer across four
          disciplines: enterprise AI and agents, pharma and regulatory AI, healthcare
          AI, and the optical interconnect India&rsquo;s AI data centres run on.
        </p>
        <div className="ph-cta">
          <Link className="btn-p" href="/start-a-project">
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn-g" href="#lines">
            Explore the four lines
          </Link>
        </div>
        {proof ? (
          <p className="ph-proof mono">
            <i aria-hidden="true" />
            {proof}
          </p>
        ) : null}
      </div>

      <div className="ph-scrollhint mono" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}
