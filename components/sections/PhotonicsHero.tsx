"use client";

import { useRef } from "react";
import { ScrollSequence, type FrameSet } from "@/components/motion/ScrollSequence";
import { PhotonicsPacketOverlay } from "@/components/sections/PhotonicsPacketOverlay";
import { useReducedMotion } from "@/lib/useMediaQuery";

export function PhotonicsHero({
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
      alt="An empty data-hall floor. Rows of racks rise, amber copper links light inside each rack, teal optical fibres race across the rows to the spine switches, and the camera lifts to a top view of the hall."
      scrollLength={420}
      frameRef={frameRef}
      overlay={
        <PhotonicsPacketOverlay
          frameRef={frameRef}
          frameCount={frames.desktop.count}
          active={!reduced}
        />
      }
      chapters={[
        {
          title: "Copper inside the rack.",
          body: "Passive and active copper where the distance is short and the budget is power.",
          from: 0,
          to: 0.45
        },
        {
          title: "Optics across the hall.",
          body: "Fibre from the row to the spine, where copper runs out of reach.",
          from: 0.45,
          to: 0.74
        },
        {
          title: "400G → 800G → 1.6T.",
          body: "800G is mainstream for AI clusters today. 1.6T is ramping.",
          from: 0.74,
          to: 1.01
        }
      ]}
    />
  );
}
