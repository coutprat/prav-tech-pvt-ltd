"use client";

import { useRef } from "react";
import { ScrollSequence, type FrameSet } from "@/components/motion/ScrollSequence";
import { HomeRingOverlay } from "@/components/sections/HomeRingOverlay";
import { HomeHeroLabels } from "@/components/sections/HomeHeroLabels";
import { useHydrated, useMediaQuery, useTheme } from "@/lib/useMediaQuery";
import { HeroFinalCaption } from "@/components/sections/HeroFinalCaption";
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
  const theme = useTheme();
  // Matched to the frames actually being drawn. The mobile track files are
  // half the size of the desktop ones and were sitting unused while every
  // phone downloaded 144 KB of desktop coordinates for a 900px-wide render.
  const wide = useMediaQuery("(min-width: 900px)");
  const dir = `${wide ? "desktop" : "mobile"}${theme === "dark" ? "-dark" : ""}`;

  // The labels wait one tick before mounting. useSyncExternalStore has to
  // render the server's answer first to match the markup, so `wide` is false
  // for that render even on a desktop — long enough for the effect to fetch
  // the mobile track file, then fetch the desktop one when the real value
  // arrives. Mounting after hydration means the first URL asked for is the
  // right one, and it is the only one asked for.
  const settled = useHydrated();

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
        <>
          <HomeRingOverlay
            frameRef={frameRef}
            frameCount={frames.desktop.count}
            active={!reduced}
          />
          <HeroFinalCaption frameRef={frameRef} frameCount={frames.desktop.count} />
          {settled ? (
            <HomeHeroLabels
              frameRef={frameRef}
              frameCount={frames.desktop.count}
              tracksUrl={`/media/home/${dir}/positions.json`}
              active={!reduced}
            />
          ) : null}
        </>
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
