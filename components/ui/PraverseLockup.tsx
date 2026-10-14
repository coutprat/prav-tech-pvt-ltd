import { Mark } from "@/components/ui/Mark";

/**
 * The Praverse lockup that sits on the group tile, next to the partner marks.
 *
 * Drawn inline rather than loaded as an image, for two reasons that both bite:
 *
 *  - the tile is a fixed white panel in both themes, and the mark's orbits are
 *    stroked in currentColor. As an <img> they could not be told to stay dark
 *    on that panel, so in dark mode the rings would have inherited a pale ink
 *    and disappeared into the white.
 *  - an SVG loaded through <img> cannot reach a web font, so the name would
 *    have fallen back to whatever serif the browser keeps for such occasions.
 *    Inline, it is set in the site's own typeface like every other word here.
 *
 * Shaped to match the company's own artwork — mark above, name beneath — which
 * is also how the Nexgen mark is built, so the three tiles read as a set.
 */
export function PraverseLockup() {
  return (
    <span className="eco-lockup">
      <Mark size={70} />
      <span className="eco-lockup-name">
        <span className="eco-lockup-main">Praverse Tech</span>
        <span className="eco-lockup-sub">Pvt. Ltd.</span>
      </span>
    </span>
  );
}
