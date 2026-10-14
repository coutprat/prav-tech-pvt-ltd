"""
Build public/logo.svg from the Praverse mark.

The only copies of the logo are rasters: a flat PNG in the company deck and a
3D signage render. The deck PNG is geometrically accurate but has compression
damage exactly where the P's bowl rejoins the stem - the teal is eaten away to
grey mush and the arm is severed, so an automatic trace reproduces a tear.

So the glyph is authored from measurements taken off the deck raster (row-by-
row edge extents, see the row-extent measurements recorded below), with only the damaged junction
reconstructed - and the signage render was used to confirm that the bowl does
rejoin the stem there. The orbit rings and nodes are undamaged, so their
positions, radii and colours are read straight out of the raster.

Coordinates are the deck raster's own pixel space, so every number here can be
checked against the source image.
"""
import sys
import numpy as np, cv2
from PIL import Image

# Usage: python scripts/media/logo.py #            assets-incoming/logo-source.png public/logo.svg public/favicon.svg
src, out = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert("RGBA"))
rgb, al = a[:, :, :3].astype(float), a[:, :, 3]
n, lab, st, cen = cv2.connectedComponentsWithStats((al > 100).astype(np.uint8), 8)

P_ID, ARC_L, ARC_R = 6, 3, 4          # glyph+inner ring, left arc, right arc

# ---- the P, measured off the raster ----------------------------------
# outer silhouette, clockwise from the top-left apex
OUTER = """M236,254 L500,254
 C544,256 578,262 612,282 C648,303 670,342 681,382
 C690,416 690,446 681,480 C670,520 646,552 612,573
 C590,587 566,595 540,596 L408,596 L408,781 L324,781
 L320,370 Z"""
# the counter: stem edge on the left, the bowl's inner curve on the right
COUNTER = """M408,312 L498,314
 C536,320 566,336 584,362 C598,382 603,404 603,430
 C603,462 594,492 574,516 C552,542 520,560 480,566
 L408,574 Z"""


def hexc(c):
    return "#%02x%02x%02x" % tuple(int(round(v)) for v in np.clip(c, 0, 255))


def colour_of(i):
    return hexc(rgb[lab == i].mean(0))


dots = []
for i in range(1, n):
    if i in (P_ID, ARC_L, ARC_R):
        continue
    area = st[i, cv2.CC_STAT_AREA]
    if area < 20:
        continue
    r = float(np.sqrt(area / np.pi))
    dots.append((cen[i][0], cen[i][1], r, colour_of(i)))
dots.sort(key=lambda d: -d[2])

# outer ring: a circle through the three large nodes
big = sorted(dots, key=lambda d: -d[2])[:3]
cx = (min(d[0] for d in big) + max(d[0] for d in big)) / 2
R = max(d[0] for d in big) - cx
cy = max(d[1] for d in big[:3])
cy = sorted(d[1] for d in big)[1]          # the two side nodes share cy


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def arc(a0, a1):
    """Stroked arc of the outer ring, degrees clockwise from 3 o'clock."""
    x0, y0 = cx + R * np.cos(np.radians(a0)), cy + R * np.sin(np.radians(a0))
    x1, y1 = cx + R * np.cos(np.radians(a1)), cy + R * np.sin(np.radians(a1))
    large = 1 if abs(a1 - a0) > 180 else 0
    sweep = 1 if a1 > a0 else 0
    return f"M{f(x0)},{f(y0)} A{f(R)},{f(R)} 0 {large} {sweep} {f(x1)},{f(y1)}"


svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 943 867" role="img" aria-label="Praverse">
  <defs>
    <linearGradient id="pv-p" gradientUnits="userSpaceOnUse" x1="672" y1="286" x2="342" y2="742">
      <stop offset="0" stop-color="#4ACBB4"/>
      <stop offset=".52" stop-color="#43AABC"/>
      <stop offset="1" stop-color="#3B7FC2"/>
    </linearGradient>
    <linearGradient id="pv-l" gradientUnits="userSpaceOnUse" x1="44" y1="512" x2="408" y2="85">
      <stop offset="0" stop-color="#3F7FC0"/>
      <stop offset="1" stop-color="#3FA8A8"/>
    </linearGradient>
    <linearGradient id="pv-r" gradientUnits="userSpaceOnUse" x1="546" y1="88" x2="895" y2="505">
      <stop offset="0" stop-color="#B6BCC6"/>
      <stop offset="1" stop-color="#8E96A4"/>
    </linearGradient>
  </defs>

  <!-- outer orbit, broken where the nodes sit -->
  <g fill="none" stroke-linecap="round">
    <path stroke="url(#pv-l)" stroke-width="8" d="{arc(180, 265)}"/>
    <path stroke="url(#pv-r)" stroke-width="8" d="{arc(275, 358)}"/>
  </g>

  <!-- inner orbit -->
  <ellipse cx="465" cy="515" rx="354" ry="205" fill="none"
           stroke="#3F8FA6" stroke-width="7" opacity=".85"/>

  <!-- the P -->
  <path fill="url(#pv-p)" fill-rule="evenodd" d="{OUTER} {COUNTER}"/>

  <!-- orbiting nodes, positions and colours read from the source -->
  <g>
'''
for x, y, r, c in dots:
    svg += f'    <circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{c}"/>\n'
svg += "  </g>\n</svg>\n"

open(out, "w", encoding="utf-8").write(svg)
print(f"ring centre ({f(cx)},{f(cy)}) r={f(R)}   dots={len(dots)}   bytes={len(svg)}")

# ---- favicon ---------------------------------------------------------
# The same glyph path, so the two files can never drift apart. The orbit rings
# and the 32 nodes collapse into grey mush below about 32px, so the favicon
# keeps the P, one ring and the three large nodes, on the dark brand plate.
PX0, PY0, PX1, PY1 = 236, 254, 694, 781
SCALE = 42.0 / (PY1 - PY0)
TX = 32 - ((PX0 + PX1) / 2) * SCALE
TY = 33 - ((PY0 + PY1) / 2) * SCALE
fav = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Praverse">
  <defs>
    <linearGradient id="f" gradientUnits="userSpaceOnUse" x1="672" y1="286" x2="342" y2="742">
      <stop offset="0" stop-color="#4ACBB4"/>
      <stop offset=".52" stop-color="#43AABC"/>
      <stop offset="1" stop-color="#3B7FC2"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0B1020"/>
  <ellipse cx="32" cy="33" rx="24" ry="13.5" fill="none" stroke="#3F8FA6" stroke-width="1.7"/>
  <circle cx="32" cy="8.6" r="3.2" fill="#50C8BC"/>
  <circle cx="7.6" cy="33" r="2.8" fill="#4D98B6"/>
  <circle cx="56.4" cy="33" r="2.8" fill="#5AC5BC"/>
  <g transform="translate({TX:.2f},{TY:.2f}) scale({SCALE:.5f})">
    <path fill="url(#f)" fill-rule="evenodd" d="{OUTER} {COUNTER}"/>
  </g>
</svg>
"""
open(sys.argv[3], "w", encoding="utf-8").write(fav)
print(f"favicon scale {SCALE:.5f}  bytes={len(fav)}")
