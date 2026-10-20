"""
Make a dark-background version of a black-on-white logo.

The white ground becomes transparent (alpha is recovered by un-compositing
each pixel off white, so anti-aliased edges stay smooth), neutral dark ink
becomes the site's light ink, and coloured parts keep their colour.

    python scripts/media/reverse_logo.py public/partners/nexgen.webp
    -> public/partners/nexgen-on-dark.webp
"""
import sys
from pathlib import Path
from PIL import Image

INK = (238, 240, 244)  # --ink


def reverse(src: Path) -> Path:
    im = Image.open(src).convert("RGB")
    out = Image.new("RGBA", im.size)
    px, po = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            a = (255 - min(r, g, b)) / 255
            if a < 0.04:
                po[x, y] = (0, 0, 0, 0)
                continue
            # The colour this pixel would be at full coverage over white.
            fr, fg, fb = (max(0, min(255, round(255 - (255 - c) / a))) for c in (r, g, b))
            sat = max(fr, fg, fb) - min(fr, fg, fb)
            if sat < 60:
                # Neutral ink: recolour, keep the recovered coverage.
                po[x, y] = (*INK, round(a * 255))
            else:
                # Brand colour: keep it exactly as drawn. Light colours (a
                # teal) only cover ~65% by this measure, so solid areas are
                # rescaled to opaque and only true edges stay translucent.
                po[x, y] = (r, g, b, round(min(1.0, a / 0.6) * 255))
    dst = src.with_name(src.stem + "-on-dark.webp")
    out.save(dst, "WEBP", lossless=True)
    return dst


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        print(reverse(Path(arg)))
