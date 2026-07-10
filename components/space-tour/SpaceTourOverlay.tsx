"use client";

import { useEffect, useRef } from "react";
import { SPACE_TOUR_STEPS, SpaceTourEngine } from "@/components/space-tour/SpaceTourEngine";

interface SpaceTourOverlayProps {
  onClose: () => void;
}

export function SpaceTourOverlay({ onClose }: SpaceTourOverlayProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgNumRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const manifestRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const vProgressRef = useRef<HTMLDivElement | null>(null);
  const coordRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("space-tour-takeover-active");
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5 && scrollRef.current) {
        const el = scrollRef.current;
        const tot = el.scrollHeight - el.clientHeight;
        el.scrollTo({ top: ((n - 1) / 5) * tot, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("space-tour-takeover-active");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scrollEl = scrollRef.current;
    if (!canvas || !scrollEl) return;
    if (
      !bgNumRef.current ||
      !kickerRef.current ||
      !titleRef.current ||
      !bodyRef.current ||
      !tagsRef.current ||
      !manifestRef.current ||
      !linkRef.current ||
      !vProgressRef.current ||
      !coordRef.current
    ) {
      return;
    }
    const dots = dotRefs.current.filter((d): d is HTMLDivElement => Boolean(d));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const engine = new SpaceTourEngine(
      {
        canvas,
        scrollEl,
        bgNum: bgNumRef.current,
        kicker: kickerRef.current,
        title: titleRef.current,
        body: bodyRef.current,
        tags: tagsRef.current,
        manifest: manifestRef.current,
        link: linkRef.current,
        vProgress: vProgressRef.current,
        coord: coordRef.current,
        dots,
        hud: hudRef.current ?? undefined
      },
      reducedMotion
    );
    engine.mount();
    return () => engine.destroy();
  }, []);

  return (
    <div className="space-tour-takeover" role="dialog" aria-modal="true" aria-label="PraverseTech Space Tour">
      <button ref={closeBtnRef} type="button" className="space-tour-exit" onClick={onClose} aria-label="Exit Space Tour">
        <span aria-hidden="true">×</span>
        <span aria-hidden="true">Exit Space Tour</span>
      </button>

      <div ref={scrollRef} className="space-tour-scroll" data-lenis-prevent>
        <div className="space-tour-spacer">
          <div className="space-tour-stage">
            <canvas ref={canvasRef} className="space-tour-canvas" />

            <div className="space-tour-vignette" aria-hidden="true" />
            <div className="space-tour-scanlines" aria-hidden="true" />

            <div className="space-tour-label-tl" aria-hidden="true">
              <div className="st-eyebrow">PraverseTech · Space Tour</div>
              <div className="st-eyebrow-sub">Gravitational Observatory</div>
              <div ref={hudRef} className="st-hud-counter" />
            </div>

            <div className="space-tour-label-tr" aria-hidden="true">
              <div className="st-status">SYS STATUS ▸ NOMINAL</div>
              <div ref={coordRef} className="st-coord">
                LAT +0.0° · LON 0.0°
              </div>
            </div>

            <div className="space-tour-vrail" aria-hidden="true">
              <div ref={vProgressRef} className="space-tour-vrail-fill" />
            </div>

            <div ref={bgNumRef} className="space-tour-bgnum" aria-hidden="true">
              01
            </div>

            <div className="space-tour-panel">
              <div className="space-tour-stepper" role="tablist" aria-label="Space Tour chapters">
                {SPACE_TOUR_STEPS.map((s, i) => {
                  const parts = s.code.split(" / ");
                  return (
                    <div
                      key={s.code}
                      ref={(el) => { dotRefs.current[i] = el; }}
                      className="stp-item"
                      role="tab"
                      aria-label={s.title}
                      aria-selected="false"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          (e.currentTarget as HTMLDivElement).click();
                        }
                      }}
                    >
                      <div className="stp-pip" />
                      <div className="stp-text">
                        <span className="stp-num">{parts[0]}</span>
                        <span className="stp-label">{parts[1] ?? s.code}</span>
                      </div>
                      <div className="stp-tooltip" aria-hidden="true">
                        <strong>{s.title}</strong>
                        <span>{s.body.length > 80 ? s.body.slice(0, 78) + "…" : s.body}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-tour-content-card">
                <div ref={kickerRef} className="space-tour-kicker-text" />
                <div className="space-tour-copy-grid">
                  <h2 ref={titleRef} className="space-tour-title" />
                  <div className="space-tour-body-col">
                    <p ref={bodyRef} className="space-tour-body" />
                    <div ref={tagsRef} className="space-tour-tags-row" />
                    <a ref={linkRef} className="space-tour-link" href="/domains" />
                  </div>
                  <div ref={manifestRef} className="space-tour-manifest" />
                </div>
              </div>
            </div>

            <div className="space-tour-scrollhint" aria-hidden="true">↓ scroll to explore</div>
          </div>
        </div>
      </div>
    </div>
  );
}
