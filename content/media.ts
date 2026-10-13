import type { FrameSet } from "@/components/motion/ScrollSequence";

/**
 * Frame sequences for the pre-rendered heroes.
 *
 * Plain data only — these are passed from server components into the client
 * ScrollSequence, so nothing here may be a function.
 *
 * Re-render with the Blender scripts (see docs/ASSET_BRIEFS.md) or drop in a
 * 3D artist's frames using the same filenames. No code changes either way.
 */
function frames(
  slug: string,
  variant: "desktop" | "mobile",
  count: number,
  width: number,
  height: number,
  dark = false
): FrameSet {
  return {
    dir: `/media/${slug}/${variant}${dark ? "-dark" : ""}`,
    count,
    width,
    height
  };
}

export const homeFrames = {
  desktop: frames("home", "desktop", 120, 1600, 900),
  mobile: frames("home", "mobile", 60, 900, 506),
  desktopDark: frames("home", "desktop", 120, 1600, 900, true),
  mobileDark: frames("home", "mobile", 60, 900, 506, true),
  poster: "/media/home/poster.webp",
  posterDark: "/media/home/poster-dark.webp"
};

export const photonicsFrames = {
  desktop: frames("photonics", "desktop", 120, 1600, 900),
  mobile: frames("photonics", "mobile", 60, 900, 506),
  desktopDark: frames("photonics", "desktop", 120, 1600, 900, true),
  mobileDark: frames("photonics", "mobile", 60, 900, 506, true),
  poster: "/media/photonics/poster.webp",
  posterDark: "/media/photonics/poster-dark.webp"
};

export const mennieMedia = {
  still: "/media/mennie/still.png",
  poster: "/media/mennie/poster.webp",
  desktop: {
    webm: "/media/mennie/hero-1920.webm",
    mp4: "/media/mennie/hero-1920.mp4"
  },
  mobile: {
    mp4: "/media/mennie/hero-960.mp4"
  }
};

/**
 * Optional footage behind a page's signature section.
 *
 * Both signature sections — the Enterprise AI agent console and the Pharma
 * response workspace — stand on their own with no video at all. That is the
 * default and the committed state. If footage is supplied later, fill in an
 * entry and it plays behind the UI, scrubbed by the same scroll that drives
 * the animation, with the panels sitting on top.
 *
 * To add one:
 *   1. Put the clip through scripts/media/cinematic.sh, which strips any
 *      generator watermark and re-encodes with a 6-frame GOP. Scrubbing a
 *      file with a normal ~2s keyframe interval feels like treacle, because
 *      every seek has to decode a long run of P-frames.
 *   2. Drop the outputs in public/media/<page>/ and fill in the entry below.
 *   3. Nothing else changes. A null entry renders no video layer at all, so a
 *      missing file can never leave a black rectangle on the page.
 *
 * What the footage has to do, whatever it shows:
 *   - stay dark and even. The UI sits on top, and a blown-out frame turns
 *     white panel text into nothing.
 *   - hold still. Slow drift only; a hard cut mid-scroll reads as a glitch
 *     when the viewer is the one controlling the playhead.
 *   - leave the middle alone. The console and the document both occupy the
 *     centre, so anything that matters belongs at the edges.
 */
export type SignatureVideo = {
  /** 1280-wide H.264, short GOP. */
  src: string;
  /** 854-wide for phones. */
  srcMobile: string;
  /** Shown until the video can play, and on low-power devices. */
  poster: string;
  /** Described for screen readers, since it carries no text of its own. */
  alt: string;
} | null;

export const signatureVideo: Record<"enterpriseAi" | "pharma", SignatureVideo> = {
  enterpriseAi: null,
  pharma: null
};
