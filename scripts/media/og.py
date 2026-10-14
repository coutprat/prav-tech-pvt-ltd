"""
Build 1200x630 Open Graph cards.

Each card is a real frame from that page's own hero or film, with a dark
scrim and the page title, so a shared link looks like the page it opens rather
than a generic logo.

Sources are committed files under public/. They used to be frames from the
Blender output directory, which is intermediate build product and is not in
the repo - so the script could not actually be re-run, which is how three
pages ended up shipping with no card at all and one card outliving its page.

Run: python scripts/media/og.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (238, 237, 234)
INK = (14, 18, 32)

HOME = "public/media/home/poster.webp"

CARDS = [
    ("home", HOME, "Intelligence, engineered for industry.", "#4BD6C4"),
    ("enterprise-ai", "public/media/enterprise-ai/cine-poster.webp", "Enterprise AI & Agents", "#9B85FF"),
    ("pharma", "public/media/pharma/cine-poster.webp", "Pharma & Regulatory AI", "#10B981"),
    ("mennie", "public/media/mennie/cine-poster.webp", "MENNIE — voice-first patient assistant", "#38BDF8"),
    ("photonics", "public/media/photonics/poster.webp", "Photonics & AI Data Centres", "#F59E0B"),
    ("sovereign-ai-data-centres", "public/media/sovereign/cine-poster.webp", "Sovereign AI data centres", "#F59E0B"),
    ("company", "public/media/company/cine-poster.webp", "Praverse Tech — Company", "#4BD6C4"),
    ("careers", "public/media/company/cine-poster.webp", "Careers at Praverse Tech", "#9B85FF"),
    ("contact", HOME, "Start a conversation.", "#4BD6C4"),
    ("start-a-project", HOME, "Start a project.", "#4BD6C4"),
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
    path_in = scratch / src if src else None
    if path_in and path_in.exists():
        base = Image.open(path_in).convert("RGB")
    else:
        raise SystemExit(f"source missing for {slug}: {src}")

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
