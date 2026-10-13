"""
Build 1200x630 Open Graph cards.

Each card is a real frame from that page's hero (or the MENNIE still) with a
dark scrim and the page title, so a shared link looks like the page it opens
rather than a generic logo.

Run: python scripts/media/og.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (238, 237, 234)
INK = (14, 18, 32)

CARDS = [
    ("home", "render2/home/desktop/frame-0120.png", "Intelligence, engineered for industry.", "#4BD6C4"),
    ("enterprise-ai", "render2/home/desktop/frame-0050.png", "Enterprise AI & Agents", "#7C5CFF"),
    ("pharma", "render2/home/desktop/frame-0075.png", "Pharma & Regulatory AI", "#10B981"),
    ("mennie", None, "MENNIE — voice-first patient assistant", "#38BDF8"),
    ("photonics", "render2/photonics/desktop/frame-0095.png", "Photonics & AI Data Centres", "#F59E0B"),
    ("company", "render2/home/desktop/frame-0118.png", "Praverse Tech — Company", "#4BD6C4"),
    ("careers", "render2/home/desktop/frame-0030.png", "Careers at Praverse Tech", "#7C5CFF"),
    ("research", "render2/home/desktop/frame-0010.png", "Research", "#4BD6C4"),
]


def font(size, bold=False):
    for name in (
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build(slug, src, title, accent, scratch: Path, out: Path):
    if src and (scratch / src).exists():
        base = Image.open(scratch / src).convert("RGB")
    else:
        p = Path("public/media/mennie/still.webp")
        base = Image.open(p).convert("RGB") if p.exists() else Image.new("RGB", (W, H), INK)

    # cover-fit to 1200x630
    r = max(W / base.width, H / base.height)
    base = base.resize((round(base.width * r), round(base.height * r)), Image.LANCZOS)
    left = (base.width - W) // 2
    top = (base.height - H) // 3
    card = base.crop((left, top, left + W, top + H))

    # dark scrim from the bottom so the type always reads
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(scrim)
    for y in range(H):
        a = int(235 * max(0.0, (y / H - 0.18) / 0.82) ** 1.25)
        d.line([(0, y), (W, y)], fill=(8, 11, 20, a))
    card = Image.alpha_composite(card.convert("RGBA"), scrim).convert("RGB")

    d = ImageDraw.Draw(card)
    rgb = tuple(int(accent[i : i + 2], 16) for i in (1, 3, 5))
    d.rectangle([64, H - 196, 64 + 54, H - 192], fill=rgb)
    d.text((64, H - 170), "PRAVERSE TECH", font=font(21, True), fill=rgb)

    f = font(52, True)
    words, lines, cur = title.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) > W - 128 and cur:
            lines.append(cur)
            cur = w
        else:
            cur = t
    lines.append(cur)
    y = H - 124 - (len(lines) - 1) * 62
    for line in lines:
        d.text((64, y), line, font=f, fill=PAPER)
        y += 62

    out.mkdir(parents=True, exist_ok=True)
    # JPEG, not PNG: these are photographic renders, and a 600 KB card is a
    # slow unfurl in every chat app that fetches it.
    path = out / f"{slug}.jpg"
    card.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{path}  {path.stat().st_size // 1024} KB")


def main():
    import sys
    scratch = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    out = Path("public/og")
    for slug, src, title, accent in CARDS:
        build(slug, src, title, accent, scratch, out)


if __name__ == "__main__":
    main()
