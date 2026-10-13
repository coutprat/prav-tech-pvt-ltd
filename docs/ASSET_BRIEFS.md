# Asset briefs

Everything the site needs that is not code. Each asset says what it is, where
it goes, and how to regenerate it.

---

## 1. MENNIE hero

### Current state

`public/media/mennie/still.png` is supplied and in use — a photoreal render of
the assistive robot seen from behind, white/silver shell, cyan spine seams,
bright clinical interior, face not visible. The hero currently animates **that
still**: a pinned slow push-in (1.00 → 1.12) with the glass HUD tags resolving
one per scroll step.

The still is **portrait (1086 × 1448, 3:4)**, not the 16:9 the original brief
assumed. The hero was therefore built as a pinned split — figure in one column,
HUD tags in the other — rather than a letterbox crop, which would have cut the
figure in half, or an upscale, which would invent detail that is not there.

### If you want the video loop

1. Generate an 8-second clip from the still with the image-to-video prompt
   below and save it as `public/media/mennie/source.mp4`.
2. Run:
   ```bash
   bash scripts/media/make-loop.sh
   ```
   This trims, crossfades the tail into the head for a seamless loop, and
   writes `hero-1920.mp4`, `hero-1920.webm`, `hero-960.mp4`, `poster.avif`
   and `poster.webp`. Tune with `START`, `DUR`, `FADE` and `CRF` env vars.
3. Swap the still for the video in
   [`components/sections/MennieHero.tsx`](../components/sections/MennieHero.tsx):
   replace the `<Image className="mennie-figure" …>` with

   ```tsx
   <LoopVideo
     className="mennie-figure"
     desktop={mennieMedia.desktop}
     mobile={mennieMedia.mobile}
     poster={mennieMedia.poster}
     alt="Concept visualisation of the MENNIE assistive robot…"
   />
   ```

   `LoopVideo` and `mennieMedia` are already built and wired — it is a one
   component swap. Keep the `.mennie-figure` class so the push-in still
   applies, and leave the concept caption in place.

Budgets: desktop ≤ 6 MB, mobile ≤ 2.5 MB.

### Still image prompt (if regenerating, 16:9 4K)

> Photorealistic cinematic still. Seen from directly behind and slightly to the
> right, framed from the middle of the back upward: an original humanoid
> healthcare assistant robot stands at a glass balustrade on the mezzanine of a
> bright, modern hospital atrium in early morning light, looking out over the
> space below. Her face is not visible. Shoulder-length, softly layered
> dark-brown hair rests over a slim high collar. Her body shell is matte white
> ceramic with brushed-silver joints and a calm, clinical design; thin teal
> (#4BD6C4) light seams run down the spine; a slim halo-like ring floats just
> behind her head. Below: blurred people, plants, wayfinding signs, warm
> daylight through a glass roof. Mood: calm, caring, trustworthy, realistic
> near-future. Soft volumetric light, shallow depth of field, 35 mm lens, high
> detail. No text, no logos, no face, no weapons, no neon cyberpunk, not
> sexualised.

A 16:9 version would let the hero go full-bleed. The current portrait asset is
good and in use; this is only if you want the wider composition.

### Image-to-video prompt (8 s, from the still)

> Camera almost still with an extremely slow push-in. Her hair moves gently in
> a soft air-conditioning breeze; a few strands lift and settle. Her shoulders
> rise and fall subtly as if breathing. Her head turns very slightly to the
> left, as if noticing someone below, then returns. The teal seams along her
> spine pulse once, slowly. People walk across the atrium below, out of focus.
> Natural, calm, realistic motion. No cuts, no camera shake, no face reveal. If
> the tool supports an end frame, use the same still as the end frame for a
> clean loop.

Works in Higgsfield, Veo, Kling or Runway. Supplying the same still as the end
frame gives the cleanest loop and makes the crossfade in `make-loop.sh`
near-invisible.

---

## 2. Pre-rendered hero sequences

Two procedural Blender scenes. No downloaded models, no external textures, so
they regenerate from source on any machine with Blender.

| Hero | Script | Output |
|---|---|---|
| Home — "Four lines, one core" | `scripts/blender/home_core.py` | `public/media/home/{desktop,mobile}[-dark]` |
| Photonics — "Light across the hall" | `scripts/blender/photonics_hall.py` | `public/media/photonics/{desktop,mobile}[-dark]` |

**Each scene renders in two themes.** `--dark` swaps the world gradient, the
ground/plinth/floor colours and the fill levels; geometry, animation and camera
are identical, so the two sets stay in sync and the hero says the same thing
either way. Without this the light studio plate reads as a glowing white block
on a dark page.

### Regenerate

```bash
# look test first — renders frames 1 / 40 / 80 / 120 only
blender -b -P scripts/blender/home_core.py -- --out /tmp/look --res 960x540 --contact

# full sequences — light
blender -b -P scripts/blender/home_core.py -- --out /tmp/home/desktop --res 1600x900 --frames 120 --samples 32
blender -b -P scripts/blender/home_core.py -- --out /tmp/home/mobile  --res 900x506  --frames 60  --samples 24

# ...and dark
blender -b -P scripts/blender/home_core.py -- --out /tmp/home/desktop-dark --res 1600x900 --frames 120 --samples 32 --dark
blender -b -P scripts/blender/home_core.py -- --out /tmp/home/mobile-dark  --res 900x506  --frames 60  --samples 24 --dark

# PNG -> WebP, reports total and per-frame weight
bash scripts/media/frames.sh /tmp/home/desktop public/media/home/desktop 80
bash scripts/media/frames.sh /tmp/home/mobile   public/media/home/mobile  80
```

Same shape for `photonics_hall.py`.

Built with **Blender 5.2.2 LTS**. `scripts/blender/_common.py` absorbs the API
differences back to 4.x — EEVEE's identifier, auto-smooth, and slotted actions
all moved between versions, and each is probed rather than assumed.

### Replacing these with a professional render

`<ScrollSequence>` takes any folder of numbered frames:

```ts
{ dir: "/media/home/desktop", count: 120, width: 1600, height: 900 }
```

Default filename shape is `frame-0001.webp`; override with `prefix`, `ext` and
`pad`. A 3D artist can drop their frames in with **no code change**. Keep the
frame count and the chapter progress windows in
[`app/page.tsx`](../app/page.tsx) in sync if the beat timings move.

### Measured weight

| Sequence | Frames | Total | Per frame | Budget |
|---|---|---|---|---|
| Home desktop | 120 @ 1600×900 | 1.7 MB | 14 KB | ≤ 45 KB |
| Home mobile | 60 @ 900×506 | 464 KB | 7 KB | ≤ 25 KB |
| Photonics desktop | 120 @ 1600×900 | 2.7 MB | 22 KB | ≤ 45 KB |
| Photonics mobile | 60 @ 900×506 | 764 KB | 12 KB | ≤ 25 KB |

Comfortably inside budget, because the scenes are clean studio renders with
large flat areas — exactly what WebP compresses well.

---

## 3. Leadership portraits

`public/team/` — three people, four files each, all 800 × 1000 on the same
warm-gray backdrop:

| File | Used for |
|---|---|
| `<slug>-mono.webp` | the portrait at rest (grayscale) |
| `<slug>.webp` | revealed on hover / keyboard focus |
| `<slug>.jpg` | fallback source |
| `<slug>-cutout.png` | transparent, currently unused |

Slugs: `pratham-shrivastav`, `vishal-jajodia`, `ashwani-shrivastav`.

**Ashwani's source photo is low resolution** (24 KB mono vs 72 KB for Vishal at
the same dimensions — it has been upscaled). It is usable but visibly softer. A
reshoot drops in over the same filenames with no code change; keep 800 × 1000
and the same backdrop.

---

## 4. What we deliberately do not have

- **Partner logos.** Named in text only. No logo goes on the site without
  written permission — a logo implies endorsement we have not been granted.
  See the `infraeo-consent` item in `content/verify.ts`.
- **Photography of the team at work, offices, or hardware.** The site uses
  renders and portraits only. Real photography of actual installations would
  be the single biggest credibility upgrade available, if it exists.
