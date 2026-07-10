"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  BrainCircuit,
  FileSearch,
  Microscope,
  Network,
  Orbit,
  ScanEye,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface Station {
  name: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

const INNER: Station[] = [
  {
    name: "AI/ML Systems",
    description:
      "Production-focused machine learning systems spanning model design, deployment, monitoring, and MLOps.",
    href: "/domains",
    Icon: BrainCircuit,
  },
  {
    name: "AI Agents",
    description:
      "Domain-specific agents for documents, reporting, knowledge search, and workflow automation with human oversight.",
    href: "/domains",
    Icon: Bot,
  },
  {
    name: "Document Intelligence",
    description:
      "RAG and knowledge systems that turn unstructured documents into searchable, evidence-backed answers.",
    href: "/domains",
    Icon: FileSearch,
  },
  {
    name: "Vision & Imaging",
    description:
      "Computer vision for healthcare imaging, visual inspection, diagnostics support, and multimodal perception.",
    href: "/research",
    Icon: ScanEye,
  },
];

const OUTER: Station[] = [
  {
    name: "HealthMate",
    description:
      "A healthcare and education assistive platform for patient interaction, routing, reminders, and workflow support.",
    href: "/healthmate",
    Icon: Microscope,
  },
  {
    name: "Pharma Intelligence",
    description:
      "AI-assisted regulatory and quality workflows for inspection readiness, CAPA reasoning, and GMP documentation.",
    href: "/pharma",
    Icon: ShieldCheck,
  },
  {
    name: "Secure & Edge AI",
    description:
      "Federated learning, edge inference, and privacy-preserving architectures for regulated environments.",
    href: "/domains",
    Icon: Network,
  },
  {
    name: "Frontier Research",
    description:
      "Exploration across humanoid robotics, biochips, photonics, AIoT, and AI infrastructure tracks.",
    href: "/research",
    Icon: Orbit,
  },
];

const INNER_R = 190;
const OUTER_R = 295;
const INNER_DUR = 22;
const OUTER_DUR = 36;

interface PopupState {
  station: Station;
  left: number;
  top: number;
}

function OrbitNode({
  station,
  radius,
  duration,
  startDeg,
  orbitRef,
  isActive,
  onEnter,
  onLeave,
}: {
  station: Station;
  radius: number;
  duration: number;
  startDeg: number;
  orbitRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  onEnter: (s: Station, left: number, top: number) => void;
  onLeave: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const delay = `${-(startDeg / 360) * duration}s`;
  const playState = isActive ? "paused" : "running";

  const computePopup = useCallback(() => {
    const btn = btnRef.current;
    const orbit = orbitRef.current;
    if (!btn || !orbit) return;

    const br = btn.getBoundingClientRect();
    const or = orbit.getBoundingClientRect();

    const nx = br.left + br.width / 2 - or.left;
    const ny = br.top + br.height / 2 - or.top;
    const cx = or.width / 2;
    const cy = or.height / 2;

    const dx = cx - nx;
    const dy = cy - ny;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const PUSH = 72; // px inward toward core
    const CARD_W = 232;
    const CARD_H = 210;

    const cardCx = nx + (dx / dist) * PUSH;
    const cardCy = ny + (dy / dist) * PUSH;

    const left = Math.max(6, Math.min(or.width - CARD_W - 6, cardCx - CARD_W / 2));
    const top = Math.max(6, Math.min(or.height - CARD_H - 6, cardCy - CARD_H / 2));

    onEnter(station, left, top);
  }, [station, onEnter, orbitRef]);

  return (
    <div
      className={`orbit-node${radius === OUTER_R ? " orbit-node--outer" : ""}`}
      style={
        {
          "--orbit-r": `${radius}px`,
          "--orbit-dur": `${duration}s`,
          "--orbit-delay": delay,
          animationPlayState: playState,
        } as React.CSSProperties
      }
    >
      <div
        className="orbit-counter"
        style={
          {
            "--orbit-dur": `${duration}s`,
            "--orbit-delay": delay,
            animationPlayState: playState,
          } as React.CSSProperties
        }
      >
        <button
          ref={btnRef}
          type="button"
          aria-label={`View ${station.name}`}
          className={`orbit-icon-btn${isActive ? " is-active" : ""}`}
          onMouseEnter={computePopup}
          onMouseLeave={onLeave}
          onFocus={computePopup}
          onBlur={onLeave}
        >
          <station.Icon size={16} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}

export function InnovationStations() {
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(
    (station: Station, left: number, top: number) => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      setPopup({ station, left, top });
    },
    []
  );

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setPopup(null), 130);
  }, []);

  const handleCardEnter = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  return (
    <section className="innovation-stations sec-pad" id="innovation-stations">
      <div className="innovation-stars" aria-hidden="true" />
      <div className="wrap innovation-wrap">
        {/* ── Left copy ── */}
        <div className="innovation-copy rv">
          <span className="kicker">PraverseTech Innovation Stations</span>
          <h2>
            Travel through the innovation stations shaping{" "}
            <span className="grad-text">PraverseTech.</span>
          </h2>
          <p>
            A guided view of the product areas, applied AI capabilities, and
            research tracks already represented across the PraverseTech ecosystem.
          </p>
          <div className="innovation-guide" aria-label="Guided route note">
            <div className="guide-orb" aria-hidden="true">AT</div>
            <div>
              <span>Route Briefing</span>
              <strong>Start at the PraverseTech core.</strong>
              <p>
                Move from applied AI systems into healthcare, pharma,
                secure-edge intelligence, and frontier research. Every station
                maps to content already present on the site.
              </p>
            </div>
          </div>
        </div>

        {/* ── Orbit map ── */}
        <div
          ref={orbitRef}
          className="station-orbit"
          aria-label="PraverseTech innovation orbit map"
        >
          {/* Decorative rings */}
          <div className="orbit-ring orbit-ring-one" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-two" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-three" aria-hidden="true" />

          {/* Animated runners */}
          <div className="orbit-runner orbit-runner-one" aria-hidden="true" />
          <div className="orbit-runner orbit-runner-two" aria-hidden="true" />
          <div className="orbit-runner orbit-runner-three" aria-hidden="true" />

          {/* Core */}
          <div className="annatech-core" aria-hidden="true">
            <span>PraverseTech</span>
            <b>Core</b>
          </div>

          {/* Inner ring nodes — 4 equally spaced (0°, 90°, 180°, 270°) */}
          {INNER.map((s, i) => (
            <OrbitNode
              key={s.name}
              station={s}
              radius={INNER_R}
              duration={INNER_DUR}
              startDeg={i * 90}
              orbitRef={orbitRef}
              isActive={popup?.station.name === s.name}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}

          {/* Outer ring nodes — 4 offset by 45° (45°, 135°, 225°, 315°) */}
          {OUTER.map((s, i) => (
            <OrbitNode
              key={s.name}
              station={s}
              radius={OUTER_R}
              duration={OUTER_DUR}
              startDeg={45 + i * 90}
              orbitRef={orbitRef}
              isActive={popup?.station.name === s.name}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}

          {/* Popup card — positioned relative to hovered node */}
          {popup && (
            <div
              className="orbit-popup"
              style={{ left: popup.left, top: popup.top }}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleLeave}
            >
              <div className="orbit-popup-icon" aria-hidden="true">
                <popup.station.Icon size={14} strokeWidth={1.8} />
              </div>
              <h3 className="orbit-popup-title">{popup.station.name}</h3>
              <p className="orbit-popup-body">{popup.station.description}</p>
              <Link href={popup.station.href} className="orbit-popup-link">
                Explore station →
              </Link>
            </div>
          )}

          <p className="orbit-hint" aria-hidden="true">
            hover icons to explore
          </p>
        </div>
      </div>
    </section>
  );
}
