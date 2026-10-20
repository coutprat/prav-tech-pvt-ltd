"""
Build the 1200x630 Open Graph cards in public/og/.

The cards follow the site's graphite theme (the tokens in app/globals.css):
a graphite field with a soft teal and amber glow, the Praverse mark and
wordmark, the page's own eyebrow in its line accent, the page's headline in
light ink and one short line under it in the secondary ink.

Home and Photonics have pre-rendered studio heroes, so their cards use a frame
from that hero on the right, faded into the graphite so the type always reads.
Every other page is type on graphite with the line's accent glow and a large,
faint mark — the films on those pages are moody stills that do not survive
being shrunk to a chat-app thumbnail.

Everything the script needs is committed: frames under public/media, the mark
geometry below (the same 1000-unit drawing as public/logo.svg and
components/ui/Mark.tsx — edit all of them together), and Geist, which ships
with Next in node_modules. Segoe UI / Arial are fallbacks if that file moves.

Output is JPEG: the photographic cards would be several hundred KB as PNG, and
that is a slow unfurl in every chat app that fetches it.

Run from the repo root: python scripts/media/og.py
"""
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

# Theme tokens, app/globals.css :root.
PAPER = (0x1C, 0x20, 0x28)
PAPER_3 = (0x2A, 0x30, 0x3A)
INK = (0xEE, 0xF0, 0xF4)
INK_2 = (0xA9, 0xB0, 0xBC)
TEAL = (0x4B, 0xD6, 0xC4)
AMBER = (0xF5, 0x9E, 0x0B)

# Line accents, and their lighter "-ink" variants for small text on graphite.
VIOLET, VIOLET_INK = (0x8B, 0x6D, 0xFF), (0xAB, 0x9B, 0xFF)
EMERALD, EMERALD_INK = (0x10, 0xB9, 0x81), (0x3F, 0xDC, 0x9A)
SKY, SKY_INK = (0x38, 0xBD, 0xF8), (0x7D, 0xD3, 0xFC)
AMBER_INK = (0xFB, 0xBF, 0x24)
TEAL_INK = (0x5F, 0xD9, 0xC9)

HOME_FRAME = "public/media/home/desktop/frame-0060.webp"
PHOTONICS_FRAME = "public/media/photonics/desktop/frame-0060.webp"

# slug, eyebrow, title, line, (glow, eyebrow ink), backdrop frame or None.
# Titles are each page's own <h1>; lines restate what the page already says.
CARDS = [
    (
        "home",
        "Enterprise AI · Photonics",
        "Intelligence, engineered for industry.",
        "Enterprise AI for regulated industries, and the interconnect for India's AI data centres.",
        (TEAL, TEAL_INK),
        HOME_FRAME,
    ),
    (
        "enterprise-ai",
        "Enterprise AI & Agents",
        "The gate is the architecture.",
        "Agents, copilots, RAG search and production ML — with a human gate and an audit trail.",
        (VIOLET, VIOLET_INK),
        None,
    ),
    (
        "pharma",
        "Pharma & Regulatory AI",
        "Every line traces back to evidence.",
        "FDA 483 responses, CAPA, data integrity and inspection readiness — every output expert-reviewed.",
        (EMERALD, EMERALD_INK),
        None,
    ),
    (
        "mennie",
        "Healthcare AI · MENNIE",
        "She meets patients at the door.",
        "MENNIE, a voice-first patient assistant at the door, the kiosk or the phone. In research and development.",
        (SKY, SKY_INK),
        None,
    ),
    (
        "photonics",
        "Photonics & AI Data Centres",
        "The layer every AI cluster runs on.",
        "Copper and optical interconnect at 800G and 1.6T for India's sovereign AI data centres.",
        (AMBER, AMBER_INK),
        PHOTONICS_FRAME,
    ),
    (
        "sovereign-ai-data-centres",
        "Sovereign AI data centres",
        "Sovereignty is decided in the cable plant.",
        "Architecture, design-in, qualification and support for the interconnect of AI clusters built in India.",
        (AMBER, AMBER_INK),
        None,
    ),
    (
        "company",
        "Company",
        "Built by people who have done the work.",
        "Praverse Tech Pvt Ltd, Vadodara, Gujarat. The idea began in 2023; incorporated in 2026.",
        (TEAL, TEAL_INK),
        None,
    ),
    (
        "trust",
        "Trust",
        "Answers for your security review.",
        "Where your data goes, who processes it, and what this website does and does not collect.",
        (TEAL, TEAL_INK),
        None,
    ),
    (
        "careers",
        "Careers",
        "Build things that get used.",
        "Engineering on AI systems that run inside regulated workflows. Vadodara, Gujarat.",
        (VIOLET, VIOLET_INK),
        None,
    ),
    (
        "contact",
        "Contact",
        "Start a conversation.",
        "Enterprise AI, pharma AI, MENNIE or photonics. A written plan within two business days.",
        (TEAL, TEAL_INK),
        None,
    ),
    (
        "start-a-project",
        "Start a project",
        "Tell us the problem.",
        "You get a written plan within two business days — no pitch deck, no discovery retainer.",
        (TEAL, TEAL_INK),
        None,
    ),
]


# ------------------------------------------------------------------- fonts

GEIST = "node_modules/next/dist/next-devtools/server/font/geist-latin.woff2"
GEIST_MONO = "node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2"


def font(size, weight=400, mono=False):
    path = GEIST_MONO if mono else GEIST
    try:
        f = ImageFont.truetype(path, size)
        try:
            f.set_variation_by_axes([weight])
        except (OSError, AttributeError):
            pass
        return f
    except OSError:
        pass
    bold = weight >= 600
    for name in (
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def tracked(d, xy, text, f, fill, tracking):
    """Draw letter-spaced text (Pillow has no tracking of its own)."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking
    return x


def wrap(d, text, f, width):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = t
    lines.append(cur)
    return lines


# --------------------------------------------------------------- the mark

def hexrgb(h):
    return tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))


def linear(size, scale, p0, p1, stops):
    """A linear gradient over a square canvas, in 1000-unit mark space."""
    n = size
    ys, xs = np.mgrid[0:n, 0:n].astype(np.float32) / scale
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    t = ((xs - p0[0]) * dx + (ys - p0[1]) * dy) / (dx * dx + dy * dy)
    t = np.clip(t, 0, 1)
    out = np.zeros((n, n, 3), np.float32)
    offs = [s[0] for s in stops]
    for c in range(3):
        out[..., c] = np.interp(t, offs, [hexrgb(s[1])[c] for s in stops])
    return Image.fromarray(out.astype(np.uint8), "RGB")


def arc_points(cx, cy, rx, ry, a0, a1, steps=360):
    return [
        (cx + rx * math.cos(a0 + (a1 - a0) * i / steps), cy + ry * math.sin(a0 + (a1 - a0) * i / steps))
        for i in range(steps + 1)
    ]


def svg_arc(x1, y1, rx, ry, large, sweep, x2, y2):
    """SVG endpoint arc (no rotation) to centre form, as sampled points."""
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    lam = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)
    if lam > 1:
        rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx
    den = rx * rx * dy * dy + ry * ry * dx * dx
    k = math.sqrt(max(0.0, num / den)) * (-1 if large == sweep else 1)
    cxp, cyp = k * rx * dy / ry, -k * ry * dx / rx
    cx, cy = cxp + (x1 + x2) / 2, cyp + (y1 + y2) / 2
    a0 = math.atan2((dy - cyp) / ry, (dx - cxp) / rx)
    a1 = math.atan2((-dy - cyp) / ry, (-dx - cxp) / rx)
    da = a1 - a0
    if sweep and da < 0:
        da += 2 * math.pi
    elif not sweep and da > 0:
        da -= 2 * math.pi
    return arc_points(cx, cy, rx, ry, a0, a0 + da)


def stroke(mask, pts, width):
    d = ImageDraw.Draw(mask)
    d.line(pts, fill=255, width=round(width), joint="curve")
    r = width / 2
    for x, y in (pts[0], pts[-1]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=255)


def mark(size, pale="#E6EAF0", ss=4):
    """The Praverse mark, rasterised from the logo.svg geometry."""
    n = size * ss
    s = n / 1000
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))

    def paint(fill, mask, opacity=1.0):
        nonlocal img
        if opacity < 1:
            mask = mask.point(lambda v: int(v * opacity))
        layer = fill.convert("RGBA") if isinstance(fill, Image.Image) else Image.new("RGBA", (n, n), hexrgb(fill) + (255,))
        layer.putalpha(mask)
        img = Image.alpha_composite(img, layer)

    def sc(pts):
        return [(x * s, y * s) for x, y in pts]

    deg = math.radians
    circ = lambda a0, a1: arc_points(500, 500, 440, 440, deg(a0), deg(a1))  # noqa: E731

    # outer orbit: gradient over the top-left, pale top-right, dotted below
    m = Image.new("L", (n, n), 0)
    stroke(m, sc(circ(186, 264)), 10 * s)
    paint(linear(n, s, (60, 500), (500, 60), [(0, "#4A8FD0"), (1, "#4CC8B8")]), m)

    m = Image.new("L", (n, n), 0)
    stroke(m, sc(circ(276, 354)), 10 * s)
    paint(pale, m)

    m = Image.new("L", (n, n), 0)
    dm = ImageDraw.Draw(m)
    a0, a1 = deg(6), deg(174)
    count = int(440 * (a1 - a0) / 34)
    r = 5.5 * s
    for i in range(count + 1):
        a = a0 + (a1 - a0) * i / count
        x, y = (500 + 440 * math.cos(a)) * s, (500 + 440 * math.sin(a)) * s
        dm.ellipse([x - r, y - r, x + r, y + r], fill=255)
    paint(linear(n, s, (940, 0), (60, 0), [(0, "#4CC8B8"), (1, "#4A8FD0")]), m, 0.8)

    # inner orbit, passing behind the P
    m = Image.new("L", (n, n), 0)
    stroke(m, sc(svg_arc(720, 381.8, 361, 194, 1, 1, 350, 355)), 8 * s)
    paint("#45C2B4", m)

    # the P (evenodd: the bowl is a hole)
    outer = (
        [(244, 236), (552, 236)]
        + svg_arc(552, 236, 180.5, 180.5, 0, 1, 552, 597)
        + [(435, 597), (435, 773), (375, 773)]
        + svg_arc(375, 773, 30, 30, 0, 1, 345, 743)
        + [(345, 351)]
    )
    hole = [(435, 312), (552, 312)] + svg_arc(552, 312, 104.5, 104.5, 0, 1, 552, 521) + [(435, 521)]
    m = Image.new("L", (n, n), 0)
    dm = ImageDraw.Draw(m)
    dm.polygon(sc(outer), fill=255)
    dm.polygon(sc(hole), fill=0)
    paint(linear(n, s, (700, 250), (350, 780), [(0, "#5FE0C8"), (0.5, "#47B4C2"), (1, "#3A80CF")]), m)
    ys = np.arange(n, dtype=np.float32) / s
    ramp = np.clip((ys - 430) / 350, 0, 1) * 0.22 * 255
    shade = Image.fromarray(np.repeat(ramp[:, None], n, axis=1).astype(np.uint8), "L")
    pm = Image.fromarray((np.asarray(m, np.float32) * np.asarray(shade, np.float32) / 255).astype(np.uint8), "L")
    paint("#0B1020", pm)

    # nodes and satellites
    for cx, cy, rr, col in (
        (500, 60, 32, "#4FD2BE"),
        (60, 500, 28, "#4A8FD0"),
        (940, 500, 28, "#4FD2BE"),
        (500, 168, 8, "#4FD2BE"),
        (493, 440, 8, "#4FD2BE"),
        (770, 478, 8, "#4FD2BE"),
        (290, 480, 8, pale),
        (205, 566, 7, pale),
        (500, 840, 8, pale),
    ):
        m = Image.new("L", (n, n), 0)
        ImageDraw.Draw(m).ellipse([(cx - rr) * s, (cy - rr) * s, (cx + rr) * s, (cy + rr) * s], fill=255)
        paint(col, m)

    return img.resize((size, size), Image.LANCZOS)


# --------------------------------------------------------------- the card

def glow(canvas, cx, cy, radius, color, strength):
    """Add a soft radial glow (screen-ish additive) to a float RGB array."""
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    d2 = ((xs - cx) ** 2 + (ys - cy) ** 2) / (radius * radius)
    a = np.exp(-d2 * 2.2) * strength
    for c in range(3):
        canvas[..., c] += (color[c] - canvas[..., c]) * a


def background(accent):
    arr = np.zeros((H, W, 3), np.float32)
    arr[:] = PAPER
    # a gentle lift toward the top-left, like the site's paper-3 card surface
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    t = np.clip(1 - (xs / W * 0.6 + ys / H * 0.4), 0, 1)[..., None]
    arr += (np.array(PAPER_3, np.float32) - arr) * t * 0.55
    glow(arr, 120, -40, 520, TEAL, 0.16)
    glow(arr, W + 40, H + 60, 560, AMBER, 0.13)
    if accent not in (TEAL, AMBER):
        glow(arr, W * 0.78, H * 0.35, 460, accent, 0.16)
    return arr


def backdrop(arr, src):
    """Lay a hero frame over the right of the card, fading into graphite."""
    base = Image.open(src).convert("RGB")
    # cover the right 72% of the card at full height
    bw = int(W * 0.72)
    r = max(bw / base.width, H / base.height)
    base = base.resize((round(base.width * r), round(base.height * r)), Image.LANCZOS)
    left = (base.width - bw) // 2
    top = (base.height - H) // 2
    frame = np.asarray(base.crop((left, top, left + bw, top + H)), np.float32)

    x0 = W - bw
    xs = np.arange(bw, dtype=np.float32) / bw
    # transparent at the left edge of the frame, solid by ~45% across
    alpha = np.clip(xs / 0.45, 0, 1) ** 1.6
    ys = np.arange(H, dtype=np.float32) / H
    vert = 1 - 0.35 * np.clip((ys - 0.65) / 0.35, 0, 1)
    a = (alpha[None, :] * vert[:, None])[..., None]
    region = arr[:, x0:]
    arr[:, x0:] = region + (frame - region) * a

    # legibility scrim: darken the left half, where the type sits
    xs_full = np.arange(W, dtype=np.float32) / W
    scrim = np.clip(1 - (xs_full - 0.30) / 0.35, 0, 1) * 0.55
    arr *= (1 - scrim)[None, :, None]
    arr += np.array(PAPER, np.float32) * scrim[None, :, None]


def build(slug, eyebrow, title, line, colors, src, out: Path):
    accent, accent_ink = colors
    arr = background(accent)
    if src:
        backdrop(arr, src)
    card = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    if not src:
        # big, faint mark bleeding off the right edge
        big = mark(560)
        a = big.getchannel("A").point(lambda v: int(v * 0.14))
        big.putalpha(a)
        card.alpha_composite(big, (W - 400, 36))

    # header: mark + wordmark
    small = mark(60)
    card.alpha_composite(small, (60, 52))
    d = ImageDraw.Draw(card)
    d.text((134, 66), "Praverse Tech", font=font(28, 600), fill=INK)

    # body block, anchored from the bottom
    text_w = 660 if src else 820
    ft = font(64 if len(title) <= 34 else 58, 640)
    fl = font(25, 400)
    title_lines = wrap(d, title, ft, text_w)
    body_lines = wrap(d, line, fl, 540 if src else 700)
    if len(body_lines) > 2:
        raise SystemExit(f"{slug}: the short line wraps to {len(body_lines)} lines; shorten it")
    th = ft.size * 1.08
    lh = fl.size * 1.42

    y_url = H - 80
    y = y_url - 46 - len(body_lines) * lh
    y_title = y - 26 - len(title_lines) * th
    y_eye = y_title - 50

    d.rectangle([64, y_eye + 9, 64 + 34, y_eye + 11], fill=accent)
    tracked(d, (112, y_eye), eyebrow.upper(), font(17, 500, mono=True), accent_ink, 2.2)

    ty = y_title
    for t in title_lines:
        d.text((61, ty), t, font=ft, fill=INK)
        ty += th
    by = y
    for t in body_lines:
        d.text((64, by), t, font=fl, fill=INK_2)
        by += lh

    d.line([(64, y_url - 18), (W - 64, y_url - 18)], fill=(0x34, 0x3A, 0x45), width=1)
    tracked(d, (64, y_url), "praversetech.com", font(17, 450, mono=True), INK_2, 0.6)

    out.mkdir(parents=True, exist_ok=True)
    path = out / f"{slug}.jpg"
    card.convert("RGB").save(path, "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)
    print(f"{path}  {path.stat().st_size // 1024} KB")


def main():
    out = Path("public/og")
    for slug, eyebrow, title, line, colors, src in CARDS:
        build(slug, eyebrow, title, line, colors, src, out)


if __name__ == "__main__":
    main()
