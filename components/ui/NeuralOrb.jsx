"use client";
import { useEffect, useRef } from "react";

// ─── Tuning knobs ─────────────────────────────────────────────────────────────
// Drop these numbers to customize without touching any drawing logic.
const CFG = {
  orbRadius:       30,    // CSS px — central core radius
  glowSpread:      4.4,   // multiplier — how far the orb bloom reaches
  nodeRadius:      5.2,   // CSS px — endpoint dot size
  parallaxPx:      150,   // total upward drift of center at 100% scroll
  idleRotationSec: 88,    // seconds for one full slow idle rotation
  pulseSpeedHz:    0.38,  // signal pulse cycles per second along edges

  // Ring 0 appears at 22–42 % scroll, Ring 1 at 47–67 %, Ring 2 at 71–93 %
  rings: [
    { count: 6,  radius: 118, threshold: 0.22, spread: 0.20 },
    { count: 9,  radius: 228, threshold: 0.47, spread: 0.20 },
    { count: 14, radius: 362, threshold: 0.71, spread: 0.22 },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

function easeOutCubic(t) { return 1 - (1 - t) ** 3; }

function angleDiff(a, b) {
  let d = a - b;
  while (d >  Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export default function NeuralOrb() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const stRef     = useRef(null);
  const progRef   = useRef(0);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── DPR-aware resize ─────────────────────────────────────────────────────
    function resize() {
      const dpr     = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      // setTransform resets the matrix cleanly on every resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Build node graph ──────────────────────────────────────────────────────
    const nodes = []; // { angle, radius, ring, phase }
    const edges = []; // { from (-1=center), to, ring, lateral? }

    CFG.rings.forEach((ring, ri) => {
      const offset = ri % 2 === 0 ? 0 : Math.PI / ring.count;
      for (let i = 0; i < ring.count; i++) {
        const angle = offset + (i / ring.count) * Math.PI * 2;
        nodes.push({ angle, radius: ring.radius, ring: ri, phase: angle });
      }
    });

    // Ring start indices for slicing
    const rS = CFG.rings.reduce((acc, r) => [...acc, acc.at(-1) + r.count], [0]);

    // Center → Ring 0
    for (let i = rS[0]; i < rS[1]; i++) edges.push({ from: -1, to: i, ring: 0 });

    // Ring 0 → Ring 1 (2 nearest-angle per node)
    for (let i = rS[0]; i < rS[1]; i++) {
      nodes.slice(rS[1], rS[2])
        .map((n, j) => ({ j: rS[1] + j, d: Math.abs(angleDiff(n.angle, nodes[i].angle)) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => edges.push({ from: i, to: j, ring: 1 }));
    }

    // Ring 1 → Ring 2 (2 nearest-angle per node)
    for (let i = rS[1]; i < rS[2]; i++) {
      nodes.slice(rS[2])
        .map((n, j) => ({ j: rS[2] + j, d: Math.abs(angleDiff(n.angle, nodes[i].angle)) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => edges.push({ from: i, to: j, ring: 2 }));
    }

    // Lateral connections inside Ring 1 (every-other pair → web density)
    for (let i = rS[1]; i < rS[2] - 1; i += 2) {
      edges.push({ from: i, to: i + 1, ring: 1, lateral: true });
    }

    // ── GSAP ScrollTrigger via already-loaded window globals ─────────────────
    // This project loads gsap + ScrollTrigger via public/vendor/ scripts.
    // Using window.gsap avoids spawning a second GSAP instance from the npm bundle.
    function hookScrollTrigger() {
      const gsap          = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) {
        setTimeout(hookScrollTrigger, 40);
        return;
      }
      stRef.current = ScrollTrigger.create({
        trigger: document.body,
        start:   "top top",
        end:     "bottom bottom",
        onUpdate: (self) => { progRef.current = self.progress; },
      });
    }
    hookScrollTrigger();

    // ── Helpers ───────────────────────────────────────────────────────────────
    function ringProg(ringIdx) {
      const { threshold, spread } = CFG.rings[ringIdx];
      return easeOutCubic(Math.max(0, Math.min(1, (progRef.current - threshold) / spread)));
    }

    function nodePos(node, cx, cy, rot) {
      const a = node.angle + rot;
      return { x: cx + Math.cos(a) * node.radius, y: cy + Math.sin(a) * node.radius };
    }

    // ── Draw loop ─────────────────────────────────────────────────────────────
    let prevTs = 0;

    function draw(ts) {
      rafRef.current = requestAnimationFrame(draw);

      // Advance time only when motion is allowed
      if (!reduced) timeRef.current += (ts - prevTs) * 0.001;
      prevTs = ts;

      const W  = window.innerWidth;
      const H  = window.innerHeight;
      const p  = progRef.current;
      const t  = timeRef.current;

      // Center point with parallax offset
      const cx = W * 0.5;
      const cy = H * 0.50 - p * CFG.parallaxPx;

      // Shared scalars
      const rot       = reduced ? 0 : (t / CFG.idleRotationSec) * Math.PI * 2;
      const orbPulse  = reduced ? 1 : 0.88 + Math.sin(t * 1.55) * 0.12;
      const glowPulse = reduced ? 1 : 0.72 + Math.sin(t * 0.82) * 0.28;
      const scrollGlo = 0.28 + p * 0.72;
      const gI        = glowPulse * scrollGlo; // combined glow intensity

      ctx.clearRect(0, 0, W, H);

      // ── Layer 1: Ambient bloom ──────────────────────────────────────────────
      const bloomR = CFG.orbRadius * CFG.glowSpread * (2.0 + p * 3.0) * orbPulse;
      const bloom  = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
      bloom.addColorStop(0,    `rgba(0,238,255,${0.11 * gI})`);
      bloom.addColorStop(0.28, `rgba(0,148,255,${0.065 * gI})`);
      bloom.addColorStop(0.62, `rgba(88,0,210,${0.032 * gI})`);
      bloom.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx, cy, bloomR, 0, Math.PI * 2);
      ctx.fill();

      // ── Layer 2: Connection lines ───────────────────────────────────────────
      edges.forEach(({ from, to, ring, lateral }) => {
        const rp = ringProg(ring);
        if (rp <= 0) return;

        // Source position (center or node)
        let sx = cx, sy = cy;
        if (from !== -1) ({ x: sx, y: sy } = nodePos(nodes[from], cx, cy, rot));

        const { x: tx, y: ty } = nodePos(nodes[to], cx, cy, rot);
        // Tip advances as ring progress grows
        const ex = sx + (tx - sx) * rp;
        const ey = sy + (ty - sy) * rp;

        const a    = (lateral ? 0.20 : 0.40) * rp;
        const grad = ctx.createLinearGradient(sx, sy, tx, ty);
        grad.addColorStop(0,    `rgba(0,205,255,${a})`);
        grad.addColorStop(0.52, `rgba(72,88,255,${a * 0.88})`);
        grad.addColorStop(1,    `rgba(128,0,255,${a * 0.62})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = lateral ? 0.65 : 1.0;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();
      });

      // ── Layer 3: Signal pulses (visible after 75 % scroll) ─────────────────
      if (p > 0.75 && !reduced) {
        const pulseAlpha = Math.min(1, (p - 0.75) / 0.18);

        edges.forEach(({ from, to, ring, lateral }, ei) => {
          if (lateral || ringProg(ring) < 0.95) return;

          let sx = cx, sy = cy;
          if (from !== -1) ({ x: sx, y: sy } = nodePos(nodes[from], cx, cy, rot));
          const { x: tx, y: ty } = nodePos(nodes[to], cx, cy, rot);

          // Each edge gets a staggered phase so pulses don't all fire at once
          const edgePhase = (ei * 0.618) % 1; // golden ratio spacing
          const pulse     = ((t * CFG.pulseSpeedHz + edgePhase) % 1 + 1) % 1;

          const px = sx + (tx - sx) * pulse;
          const py = sy + (ty - sy) * pulse;

          const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
          pg.addColorStop(0, `rgba(200,255,255,${0.9 * pulseAlpha})`);
          pg.addColorStop(0.4,`rgba(0,220,255,${0.45 * pulseAlpha})`);
          pg.addColorStop(1,  "rgba(0,0,0,0)");
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ── Layer 4: Endpoint nodes ─────────────────────────────────────────────
      nodes.forEach((node) => {
        const rp = ringProg(node.ring);
        if (rp <= 0) return;

        const { x: nx, y: ny } = nodePos(node, cx, cy, rot);
        const np    = reduced ? 1 : 0.82 + Math.sin(t * 1.25 + node.phase) * 0.18;
        const ndot  = CFG.nodeRadius * rp * np;
        const haloR = ndot * 5.0;

        // Halo
        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, haloR);
        halo.addColorStop(0,   `rgba(0,215,255,${0.36 * rp})`);
        halo.addColorStop(0.42,`rgba(55,95,255,${0.13 * rp})`);
        halo.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(nx, ny, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        const core = ctx.createRadialGradient(nx, ny, 0, nx, ny, ndot);
        core.addColorStop(0,   `rgba(215,248,255,${rp})`);
        core.addColorStop(0.5, `rgba(0,206,255,${0.9 * rp})`);
        core.addColorStop(1,   `rgba(0,55,195,0)`);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(nx, ny, ndot, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Layer 5: Orb mid-glow ───────────────────────────────────────────────
      const orbGlowR = CFG.orbRadius * CFG.glowSpread * orbPulse * (1 + p * 0.75);
      const orbGlow  = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbGlowR);
      orbGlow.addColorStop(0,    `rgba(0,255,255,${0.34 * gI})`);
      orbGlow.addColorStop(0.26, `rgba(0,185,255,${0.20 * gI})`);
      orbGlow.addColorStop(0.58, `rgba(48,0,195,${0.08 * gI})`);
      orbGlow.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = orbGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, orbGlowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Layer 6: Orb core ───────────────────────────────────────────────────
      const orbR = CFG.orbRadius * orbPulse * (1 + p * 0.30);
      const orb  = ctx.createRadialGradient(cx - orbR * 0.08, cy - orbR * 0.08, 0, cx, cy, orbR);
      orb.addColorStop(0,    "rgba(228,255,255,1)");
      orb.addColorStop(0.18, "rgba(0,255,255,0.96)");
      orb.addColorStop(0.52, "rgba(0,158,255,0.84)");
      orb.addColorStop(0.80, "rgba(28,0,175,0.58)");
      orb.addColorStop(1,    "rgba(0,0,75,0)");
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fill();

      // ── Layer 7: Orb specular highlight ────────────────────────────────────
      const hx   = cx - orbR * 0.28;
      const hy   = cy - orbR * 0.32;
      const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, orbR * 0.62);
      spec.addColorStop(0,   `rgba(255,255,255,${0.66 * orbPulse})`);
      spec.addColorStop(0.44,`rgba(200,240,255,${0.14 * orbPulse})`);
      spec.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      stRef.current?.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        1,
      }}
    />
  );
}
