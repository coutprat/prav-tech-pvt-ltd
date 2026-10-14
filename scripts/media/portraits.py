"""
Build uniform leadership portraits.

The three supplied headshots do not actually share a backdrop — Pratham's is a
light office blur, Vishal's and Ashwani's are dark — so side by side they read
as three photos rather than one set. The supplied `-cutout.png` files are
transparent, so compositing them onto a single warm-gray plate gives the
consistent treatment the design calls for.

Outputs, per person:
    <slug>-plate.webp        colour on the plate
    <slug>-plate-mono.webp   grayscale on the plate

Run:
    python scripts/media/portraits.py
"""

from pathlib import Path

from PIL import Image, ImageOps

TEAM = Path("public/team")
SLUGS = ["pratham-shrivastav", "vishal-jajodia", "ashwani-shrivastav"]

# --paper-2 from the design system; the portrait plate matches the card it sits on.
PLATE = (228, 227, 223)
QUALITY = 88


def build(slug: str) -> None:
    cutout = Image.open(TEAM / f"{slug}-cutout.png").convert("RGBA")

    plate = Image.new("RGBA", cutout.size, PLATE + (255,))
    plate.alpha_composite(cutout)
    colour = plate.convert("RGB")
    colour.save(TEAM / f"{slug}-plate.webp", "WEBP", quality=QUALITY, method=6)

    # Grayscale the subject only; the plate is already neutral, so converting
    # the whole composite keeps the backdrop exactly on tone.
    mono = ImageOps.grayscale(colour).convert("RGB")
    mono.save(TEAM / f"{slug}-plate-mono.webp", "WEBP", quality=QUALITY, method=6)

    kb = (TEAM / f"{slug}-plate.webp").stat().st_size // 1024
    kb_mono = (TEAM / f"{slug}-plate-mono.webp").stat().st_size // 1024
    print(f"{slug:24s} {colour.size[0]}x{colour.size[1]}  colour {kb} KB  mono {kb_mono} KB")


def main() -> None:
    if not TEAM.exists():
        raise SystemExit(f"not found: {TEAM} (run from the repo root)")
    for slug in SLUGS:
        build(slug)


if __name__ == "__main__":
    main()
