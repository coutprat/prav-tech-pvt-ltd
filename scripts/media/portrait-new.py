"""
Turn a full-length photo into a leadership portrait matching the existing set.

    python scripts/media/portrait-new.py assets-incoming/ashwani-shrivastav-new.jpg ashwani-shrivastav

What it does:
  1. Finds the subject with rembg (birefnet-portrait, falling back to
     isnet-general-use) on a downscaled pass, to locate the head.
  2. Crops head-and-shoulders at FULL resolution, framed to match the other
     portraits: head top at ~10% of frame height, shoulders filling the width.
  3. Removes the background on the full-resolution crop and cleans the edge.
  4. Composites onto the same warm-gray plate and writes the same file names.

Deliberately no AI upscaling or "face enhancement": those invent detail and
change what a real person looks like. Only ordinary Lanczos resampling, and
only if the crop is smaller than the output.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

TEAM = Path("public/team")
OUT_W, OUT_H = 800, 1000
PLATE = (228, 227, 223)

# Geometry measured from the existing portraits.
HEAD_TOP_FRAC = 0.10        # head top sits 10% down the frame
# Shoulders span this fraction of the frame width. Measured 0.89 on Vishal and
# 1.00 on Pratham; 0.84 lands the head at the same scale as theirs, which is
# what makes the row read as one set rather than three crops.
SHOULDER_FRAC = 0.84


def remove_bg(img: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    for model in ("birefnet-portrait", "isnet-general-use", "u2net"):
        try:
            session = new_session(model)
            out = remove(img, session=session)
            print(f"  background removed with {model}")
            return out.convert("RGBA")
        except Exception as exc:  # model unavailable / download failed
            print(f"  {model} unavailable ({type(exc).__name__}), trying next")
    raise SystemExit("no rembg model available")


def subject_box(alpha: np.ndarray, thresh: int = 24):
    ys, xs = np.nonzero(alpha > thresh)
    if not len(ys):
        raise SystemExit("no subject found")
    return xs.min(), ys.min(), xs.max(), ys.max()


def clean_edges(rgba: Image.Image) -> Image.Image:
    """Soften the alpha edge so hair and shoulders do not look cut out."""
    r, g, b, a = rgba.split()
    a = a.filter(ImageFilter.MedianFilter(size=3))
    a = a.filter(ImageFilter.GaussianBlur(radius=0.8))
    # pull the matte in very slightly to kill the background fringe
    a = a.point(lambda v: 0 if v < 26 else min(255, int((v - 26) * 1.12)))
    return Image.merge("RGBA", (r, g, b, a))


def main() -> None:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else "assets-incoming/ashwani-shrivastav-new.jpg")
    slug = sys.argv[2] if len(sys.argv) > 2 else "ashwani-shrivastav"
    shoulder_frac = float(sys.argv[3]) if len(sys.argv) > 3 else SHOULDER_FRAC
    if not src.exists():
        raise SystemExit(f"not found: {src}")

    full = Image.open(src).convert("RGB")
    print(f"source {src}  {full.size[0]}x{full.size[1]}")

    # --- locate the subject on a small pass ------------------------------
    small = full.copy()
    small.thumbnail((900, 900))
    scale = full.size[0] / small.size[0]
    cut_small = remove_bg(small)
    x0, y0, x1, y1 = subject_box(np.asarray(cut_small)[:, :, 3])

    head_top = y0 * scale
    # Shoulder width: measured a little below the head, where the body is
    # widest before the arms separate.
    a_small = np.asarray(cut_small)[:, :, 3]
    probe = int(y0 + (y1 - y0) * 0.30)
    row = np.nonzero(a_small[probe] > 24)[0]
    shoulder_w = (row.max() - row.min()) * scale if len(row) else (x1 - x0) * scale
    centre_x = ((row.min() + row.max()) / 2 * scale) if len(row) else ((x0 + x1) / 2 * scale)

    print(f"  head top y={head_top:.0f}  shoulder width={shoulder_w:.0f}px  centre x={centre_x:.0f}")

    # --- frame to match the existing portraits ---------------------------
    crop_w = shoulder_w / shoulder_frac
    crop_h = crop_w * (OUT_H / OUT_W)
    cx0 = centre_x - crop_w / 2
    cy0 = head_top - crop_h * HEAD_TOP_FRAC

    box = (round(cx0), round(cy0), round(cx0 + crop_w), round(cy0 + crop_h))
    box = (max(0, box[0]), max(0, box[1]), min(full.size[0], box[2]), min(full.size[1], box[3]))
    crop = full.crop(box)
    print(f"  crop {crop.size[0]}x{crop.size[1]} from {box}")

    factor = OUT_H / crop.size[1]
    if factor > 1:
        print(f"  NOTE: upsampling {factor:.2f}x (Lanczos, no generative enhancement)")
    if factor > 2:
        raise SystemExit(
            f"crop is only {crop.size[1]}px tall; {OUT_H}px needed. "
            "Ask for a closer original rather than upscaling a face."
        )

    # --- remove background at full crop resolution -----------------------
    cut = clean_edges(remove_bg(crop))
    cut = cut.resize((OUT_W, OUT_H), Image.LANCZOS)

    TEAM.mkdir(parents=True, exist_ok=True)
    cut.save(TEAM / f"{slug}-cutout.png")

    plate = Image.new("RGBA", (OUT_W, OUT_H), PLATE + (255,))
    plate.alpha_composite(cut)
    colour = plate.convert("RGB")
    colour.save(TEAM / f"{slug}-plate.webp", "WEBP", quality=88, method=6)
    colour.save(TEAM / f"{slug}.webp", "WEBP", quality=88, method=6)
    colour.save(TEAM / f"{slug}.jpg", "JPEG", quality=90, optimize=True)

    from PIL import ImageOps

    mono = ImageOps.grayscale(colour).convert("RGB")
    mono.save(TEAM / f"{slug}-plate-mono.webp", "WEBP", quality=88, method=6)
    mono.save(TEAM / f"{slug}-mono.webp", "WEBP", quality=88, method=6)

    print(f"  wrote {slug}-plate.webp and friends into {TEAM}")


if __name__ == "__main__":
    main()
