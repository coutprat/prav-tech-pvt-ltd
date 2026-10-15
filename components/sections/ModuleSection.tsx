"use client";

import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, afterPaint, observeVisible } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { PARTS } from "@/components/three/module-parts";

/**
 * three.js is loaded with a runtime import(), deliberately not next/dynamic.
 *
 * next/dynamic still adds the chunk to the page's preload list, so the 267 KB
 * bundle was downloading before the hero poster and giving the LCP element
 * 1134ms of load delay that the Home page (which has no 3D) did not have.
 * A bare import() inside an event handler is invisible to that machinery, so
 * nothing is fetched until the visitor actually scrolls toward this section.
 */
type ModuleProps = { explode: RefObject<number>; labels: boolean; active: boolean };

export function ModuleSection() {
  const root = useRef<HTMLDivElement>(null);
  const highPower = useHighPower();
  /** Written on scroll, read by the scene's own frame loop; never re-renders. */
  const explode = useRef(0);
  const [labels, setLabels] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [Scene, setScene] = useState<ComponentType<ModuleProps> | null>(null);

  /**
   * Arm the observer only after load, and only once the visitor has scrolled.
   *
   * Observing immediately pulled the 267 KB three.js chunk into the initial
   * load window, and compiling it there delayed the hero's own first paint by
   * ~3.5s of render delay on throttled mobile. This section is several
   * screens down: nobody reaches it without scrolling first, so nothing is
   * lost by waiting, and the chunk still arrives well before it is needed.
   */
  useEffect(() => {
    if (highPower !== true) return;
    const el = root.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;

    const arm = () => {
      if (io) return;
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          void import("@/components/three/ModuleExploded")
            .then((m) => setScene(() => m.default))
            .catch(() => {
              /* the labelled list below is a complete fallback */
            });
        },
        { rootMargin: "600px 0px" }
      );
      io.observe(el);
    };

    window.addEventListener("scroll", arm, { once: true, passive: true });
    window.addEventListener("wheel", arm, { once: true, passive: true });
    window.addEventListener("touchstart", arm, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", arm);
      window.removeEventListener("wheel", arm);
      window.removeEventListener("touchstart", arm);
      io?.disconnect();
    };
  }, [highPower]);

  // Pause the 3D render loop whenever the section is off screen.
  useEffect(() => {
    const el = root.current;
    if (!el || !Scene) return;
    return observeVisible(el, setOnScreen, "100px 0px");
  }, [Scene]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !highPower) return;

      const cancel = afterPaint(() => {
        const st = gsap.to(
          { v: 0 },
          {
            v: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=260%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                explode.current = self.progress;
                setLabels(self.progress > 0.62);
              }
            }
          }
        );
        return () => {
          st.scrollTrigger?.kill();
          st.kill();
        };
      });

      return cancel;
    },
    { scope: root, dependencies: [highPower] }
  );

  // Low-power, reduced motion, or still measuring: the same content as a
  // plain labelled list. Nothing is lost, only the animation.
  if (highPower !== true) {
    return (
      <section className="section section-alt">
        <div className="wrap">
          <p className="section-label" data-accent="line">
            Inside an 800G module
          </p>
          <h2 className="h2">What is actually in there.</h2>
          <ul className="tile-list" style={{ marginTop: 40 }}>
            {PARTS.map((p) => (
              <li key={p.id}>
                <strong>{p.label}</strong>
                <span className="tile-note">{p.blurb}</span>
              </li>
            ))}
          </ul>
          <p className="body-2" style={{ marginTop: 24, fontSize: 14 }}>
            Illustrative. Not a specific vendor&rsquo;s product.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mod-section" ref={root}>
      <div className="mod-stage">
        <div className="mod-canvas">
          {Scene ? (
            <Scene explode={explode} labels={labels} active={onScreen} />
          ) : (
            <div className="mod-poster" aria-hidden="true" />
          )}
        </div>

        <div className="mod-copy wrap">
          <p className="section-label" data-accent="line">
            Inside an 800G module
          </p>
          <h2 className="h2">What is actually in there.</h2>
          <p className="body-2" style={{ marginTop: 16 }}>
            Scroll to take it apart. Every part is doing one job, and the job
            is why the module costs what it costs.
          </p>
          <p className="mod-caption mono">
            Illustrative. Not a specific vendor&rsquo;s product.
          </p>
        </div>
      </div>
    </section>
  );
}
