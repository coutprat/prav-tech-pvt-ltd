"use client";

import { useRef } from "react";
import { ScrollSequence, type FrameSet } from "@/components/motion/ScrollSequence";
import { HomeRingOverlay } from "@/components/sections/HomeRingOverlay";
import { useReducedMotion } from "@/lib/useMediaQuery";

/**
 * Home hero: the pre-rendered sequence plus the live particle overlay.
 *
 * Split out of the page so app/page.tsx can stay a server component and keep
 * its metadata export — only the parts that need a ref and the browser live
 * on the client.
 */
export function HomeHero({
  frames
}: {
  frames: {
    desktop: FrameSet;
    mobile: FrameSet;
    desktopDark: FrameSet;
    mobileDark: FrameSet;
    poster: string;
    posterDark: string;
  };
}) {
  const frameRef = useRef(0);
  const reduced = useReducedMotion();

  return (
    <ScrollSequence
      desktop={frames.desktop}
      mobile={frames.mobile}
      desktopDark={frames.desktopDark}
      mobileDark={frames.mobileDark}
      poster={frames.poster}
      posterDark={frames.posterDark}
      alt="A white ceramic core on a plinth. An orbital ring draws around it and four modules dock onto the ring in turn, each lighting its own colour: violet Enterprise AI, emerald Pharma AI, sky Healthcare AI, amber Photonics."
      scrollLength={420}
      frameRef={frameRef}
      overlay={
        <HomeRingOverlay
          frameRef={frameRef}
          frameCount={frames.desktop.count}
          active={!reduced}
        />
      }
      chapters={[
        {
          title: "One core.",
          body: "A single engineering practice underneath everything we ship.",
          from: 0,
          to: 0.2
        },
        {
          title: "Enterprise AI & Agents",
          body: "Agents and copilots inside the workflows your teams already run.",
          from: 0.2,
          to: 0.38
        },
        {
          title: "Pharma & Regulatory AI",
          body: "483 responses, CAPA and inspection readiness — expert-reviewed.",
          from: 0.38,
          to: 0.56
        },
        {
          title: "Healthcare AI",
          body: "MENNIE meets patients at the door and hands clinicians a structured picture.",
          from: 0.56,
          to: 0.74
        },
        {
          title: "Photonics & AI Data Centres",
          body: "The interconnect layer for India's sovereign AI data centres.",
          from: 0.74,
          to: 1.01
        }
      ]}
    />
  );
}
