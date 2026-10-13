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
  height: number
): FrameSet {
  return { dir: `/media/${slug}/${variant}`, count, width, height };
}

export const homeFrames = {
  desktop: frames("home", "desktop", 120, 1600, 900),
  mobile: frames("home", "mobile", 60, 900, 506),
  poster: "/media/home/poster.webp"
};

export const photonicsFrames = {
  desktop: frames("photonics", "desktop", 120, 1600, 900),
  mobile: frames("photonics", "mobile", 60, 900, 506),
  poster: "/media/photonics/poster.webp"
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
