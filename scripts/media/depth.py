"""
Generate a depth map for the MENNIE 2.5D hero.

Model: depth-anything/Depth-Anything-V2-Small-hf
Licence: Apache-2.0 — commercial use is permitted.

This matters: the Base and Large variants of Depth Anything V2 are
CC-BY-NC-4.0 (non-commercial), so only the Small checkpoint is usable on a
company website. Do not swap it for a bigger one without re-checking.

Writes, next to the source image:
    depth.png        16-bit grayscale, near = white
    spine-mask.png   8-bit mask of the cyan light seams, for the emissive pulse

Run:
    python scripts/media/depth.py
    python scripts/media/depth.py --src public/media/mennie/still.webp
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

MODEL = "depth-anything/Depth-Anything-V2-Small-hf"


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--src", default="public/media/mennie/still.webp")
    p.add_argument("--out", default="public/media/mennie")
    p.add_argument(
        "--max-side",
        type=int,
        default=1024,
        help="longest edge of the written depth map",
    )
    return p.parse_args()


def estimate_depth(image: Image.Image) -> np.ndarray:
    """Return depth as float32 in 0..1, where 1 is nearest the camera."""
    import torch
    from transformers import AutoImageProcessor, AutoModelForDepthEstimation

    processor = AutoImageProcessor.from_pretrained(MODEL)
    model = AutoModelForDepthEstimation.from_pretrained(MODEL)
    model.eval()

    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        predicted = model(**inputs).predicted_depth

    # back to the source resolution
    depth = torch.nn.functional.interpolate(
        predicted.unsqueeze(1),
        size=image.size[::-1],
        mode="bicubic",
        align_corners=False,
    ).squeeze()

    d = depth.cpu().numpy().astype(np.float32)
    lo, hi = float(d.min()), float(d.max())
    if hi - lo < 1e-6:
        return np.zeros_like(d)
    return (d - lo) / (hi - lo)


def clean_edges(depth: np.ndarray) -> np.ndarray:
    """
    Soften the silhouette so the displaced mesh does not tear.

    Depth Anything gives a crisp edge around the figure. Displacing a mesh by
    a hard step stretches the triangles that straddle it into visible spikes,
    so the edge is eased just enough to keep the surface continuous while
    leaving the real depth separation intact.
    """
    img = Image.fromarray((depth * 255).astype(np.uint8))
    # a median pass kills speckle, then a small blur rounds the step
    img = img.filter(ImageFilter.MedianFilter(size=5))
    img = img.filter(ImageFilter.GaussianBlur(radius=2.2))
    return np.asarray(img).astype(np.float32) / 255.0


def spine_mask(image: Image.Image) -> Image.Image:
    """
    Isolate the cyan light seams by colour threshold.

    Used as an emissive overlay so the seams can pulse without touching the
    rest of the plate. Threshold only — anything it misses is better left out
    than guessed at.
    """
    rgb = np.asarray(image.convert("RGB")).astype(np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    # cyan: blue and green both well above red, and bright
    cyan = np.clip((g - r) * 1.6, 0, 1) * np.clip((b - r) * 1.6, 0, 1)
    bright = np.clip((rgb.max(axis=-1) - 0.55) / 0.45, 0, 1)
    mask = np.clip(cyan * 3.0, 0, 1) * bright

    out = Image.fromarray((mask * 255).astype(np.uint8))
    out = out.filter(ImageFilter.MedianFilter(size=3))
    out = out.filter(ImageFilter.GaussianBlur(radius=1.2))
    return out


def main() -> None:
    args = parse_args()
    src = Path(args.src)
    out = Path(args.out)
    if not src.exists():
        raise SystemExit(f"not found: {src}")
    out.mkdir(parents=True, exist_ok=True)

    image = Image.open(src).convert("RGB")
    print(f"source {src}  {image.size[0]}x{image.size[1]}")

    print(f"loading {MODEL} (Apache-2.0) ...")
    depth = estimate_depth(image)
    depth = clean_edges(depth)

    # 16-bit: an 8-bit depth map bands visibly once you displace a mesh by it.
    d16 = (np.clip(depth, 0, 1) * 65535).astype(np.uint16)
    dimg = Image.fromarray(d16, mode="I;16")

    scale = args.max_side / max(dimg.size)
    if scale < 1:
        size = (round(dimg.size[0] * scale), round(dimg.size[1] * scale))
        dimg = dimg.resize(size, Image.LANCZOS)

    depth_path = out / "depth.png"
    dimg.save(depth_path)
    print(f"wrote {depth_path}  {dimg.size[0]}x{dimg.size[1]}  16-bit")

    mask = spine_mask(image)
    if scale < 1:
        mask = mask.resize(dimg.size, Image.LANCZOS)
    mask_path = out / "spine-mask.png"
    mask.save(mask_path)
    coverage = np.asarray(mask).mean() / 255
    print(f"wrote {mask_path}  coverage {coverage * 100:.2f}%")
    if coverage < 0.002:
        print("  NOTE: very little cyan found — check the mask before relying on it")


if __name__ == "__main__":
    main()
