/**
 * The Praverse mark: a P inside two orbit rings with nodes on them.
 *
 * Inlined rather than an <img src="/logo.svg"> so it never flashes in after
 * first paint in the header, and so the rings can dim independently of the
 * glyph. The same geometry is in public/logo.svg (for JSON-LD and link
 * previews) and public/favicon.svg; all three are generated from the one
 * source raster by scripts/media/logo.py, so they cannot drift apart.
 */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 943 867"
      aria-hidden="true"
      focusable="false"
      className="mark"
    >
      <defs>
        <linearGradient
          id="mk-p"
          gradientUnits="userSpaceOnUse"
          x1="672"
          y1="286"
          x2="342"
          y2="742"
        >
          <stop offset="0" stopColor="#4ACBB4" />
          <stop offset=".52" stopColor="#43AABC" />
          <stop offset="1" stopColor="#3B7FC2" />
        </linearGradient>
      </defs>
      {/* orbits, held back so the glyph carries the mark at 28px */}
      <g fill="none" stroke="currentColor" opacity=".45">
        <path strokeWidth="14" strokeLinecap="round" d="M43,492.7 A428,428 0 0 0 433.7,882" />
        <ellipse cx="465" cy="515" rx="354" ry="205" strokeWidth="12" />
      </g>
      <path
        fill="url(#mk-p)"
        fillRule="evenodd"
        d="M236,254 L500,254 C544,256 578,262 612,282 C648,303 670,342 681,382 C690,416 690,446 681,480 C670,520 646,552 612,573 C590,587 566,595 540,596 L408,596 L408,781 L324,781 L320,370 Z M408,312 L498,314 C536,320 566,336 584,362 C598,382 603,404 603,430 C603,462 594,492 574,516 C552,542 520,560 480,566 L408,574 Z"
      />
      {/* the three nodes that sit on the outer orbit */}
      <circle cx="478" cy="84" r="33.5" fill="#50C8BC" />
      <circle cx="43" cy="492.7" r="29" fill="#4D98B6" />
      <circle cx="899" cy="492.7" r="28.5" fill="#5AC5BC" />
    </svg>
  );
}
