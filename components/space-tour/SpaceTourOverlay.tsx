"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SPACE_TOUR_STEPS, SpaceTourEngine } from "@/components/space-tour/SpaceTourEngine";

interface SpaceTourOverlayProps {
  onClose: () => void;
}

export function SpaceTourOverlay({ onClose }: SpaceTourOverlayProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const takeoverRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false);
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
  const progressRef = useRef<HTMLDivElement | null>(null);
  const warpRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hudTlRef = useRef<HTMLDivElement | null>(null);
  const hudTrRef = useRef<HTMLDivElement | null>(null);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    takeoverRef.current?.classList.add("st-closing");
    window.setTimeout(onClose, 380);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (closingRef.current) return;
    closingRef.current = true;
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    stageRef.current?.classList.add("st-exit-zoom");
    window.setTimeout(() => router.push(href), 300);
    window.setTimeout(onClose, 520);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("space-tour-takeover-active");
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        hud: hudRef.current ?? undefined,
        progress: progressRef.current ?? undefined,
        warp: warpRef.current ?? undefined
      },
      reducedMotion
    );
    engine.mount();
    return () => engine.destroy();
  }, []);

  /* 3D tilt + depth parallax for the UI chrome (mouse-only, RAF + direct DOM) */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;

      const card = cardRef.current;
      if (card) {
        const rotY = cur.x * 3.2;
        const rotX = -cur.y * 2.4;
        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      }
      const tl = hudTlRef.current;
      if (tl) tl.style.transform = `translate3d(${cur.x * -6}px, ${cur.y * -4}px, 0)`;
      const tr = hudTrRef.current;
      if (tr) tr.style.transform = `translate3d(${cur.x * 6}px, ${cur.y * -4}px, 0)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={takeoverRef} className="space-tour-takeover" role="dialog" aria-modal="true" aria-label="PraverseTech Space Tour">
      <button ref={closeBtnRef} type="button" className="space-tour-exit" onClick={requestClose} aria-label="Exit Space Tour">
        <span aria-hidden="true">×</span>
        <span aria-hidden="true">Exit Space Tour</span>
      </button>

      <div ref={scrollRef} className="space-tour-scroll" data-lenis-prevent>
        <div className="space-tour-spacer">
          <div ref={stageRef} className="space-tour-stage">
            <canvas ref={canvasRef} className="space-tour-canvas" />

            <div ref={warpRef} className="space-tour-warp" aria-hidden="true" />
            <div className="space-tour-vignette" aria-hidden="true" />
            <div className="space-tour-scanlines" aria-hidden="true" />

            <div ref={hudTlRef} className="space-tour-label-tl" aria-hidden="true">
              <div className="st-eyebrow">PraverseTech · Space Tour</div>
              <div className="st-eyebrow-sub">Gravitational Observatory</div>
              <div ref={hudRef} className="st-hud-counter" />
            </div>

            <div ref={hudTrRef} className="space-tour-label-tr" aria-hidden="true">
              <div className="st-radar" aria-hidden="true" />
              <div className="st-status">SYS STATUS ▸ NOMINAL</div>
              <div ref={progressRef} className="st-progress">01 / 05</div>
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

              <div ref={cardRef} className="space-tour-content-card">
                <div ref={kickerRef} className="space-tour-kicker-text" />
                <div className="space-tour-copy-grid">
                  <h2 ref={titleRef} className="space-tour-title" />
                  <div className="space-tour-body-col">
                    <p ref={bodyRef} className="space-tour-body" />
                    <div ref={tagsRef} className="space-tour-tags-row" />
                    <a ref={linkRef} className="space-tour-link" href="/foundry#domains" onClick={handleLinkClick} />
                  </div>
                  <div ref={manifestRef} className="space-tour-manifest" />
                </div>
              </div>
            </div>

            <div className="space-tour-scrollhint" aria-hidden="true">↓ scroll to explore · drag to rotate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
