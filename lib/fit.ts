/**
 * How much to scale a rendered frame to sit in a box.
 *
 * Cover, so a 16:9 render fills a 16:10 laptop without bands — but capped at
 * 1.3x the contain size, so a portrait screen does not zoom into the middle
 * of the scene and crop the subject. Past the cap the stage colour shows,
 * which is the render's own studio black.
 *
 * The sequence canvas and every overlay that tracks it must use this, or the
 * overlay lands on different pixels from the frame.
 */
export function stageScale(bw: number, bh: number, iw: number, ih: number): number {
  const contain = Math.min(bw / iw, bh / ih);
  const cover = Math.max(bw / iw, bh / ih);
  return Math.min(cover, contain * 1.3);
}
