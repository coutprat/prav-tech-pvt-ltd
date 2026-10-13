# Praverse Tech — redesign overview

Branch `redesign-2026`, built on `D:\praverse website v3`.
Everything below is what actually shipped, including what missed.

---

## 1. Start here

| | |
|---|---|
| Where the work is | `D:\praverse website v3`, branch `redesign-2026` |
| Base commit | `7d36a87`, cloned from `D:\prav-tech-pvt-ltd` |
| Remote | `github.com/coutprat/prav-tech-pvt-ltd` — **nothing has been pushed** |
| Build | `npm run build` — passes, 12 static routes, no type or lint errors |
| QA output | `qa/REPORT.md`, `qa/LIGHTHOUSE.md`, screenshots in `qa/` |

```bash
npm install
npm run dev
```

> **The workspace was empty when this started.** The brief assumed it was being
> run inside the praversetech.com repo. The real repo was found in two local
> checkouts; v3 was cloned from the newer, clean one. See §9 for the Orbit
> work that was rescued in the process.

---

## 2. Routes

| Route | Status | Signature animation |
|---|---|---|
| `/` | rebuilt | ScrollSequence — ring draws, four modules dock and light |
| `/enterprise-ai` | **new** | Checkpoint — documents stop at a human gate |
| `/pharma` | rebuilt | EvidenceThread — claims thread back to sources |
| `/mennie` | **new canonical** | pinned push-in with per-step glass HUD tags |
| `/photonics` | rebuilt + corrected | ScrollSequence — racks rise, light crosses the hall |
| `/research` | rebuilt | — (no hero animation; it is a list page) |
| `/company` | **new canonical** | — |
| `/contact` | restyled | — |
| `/start-a-project` | **new** | — |
| `/privacy` | **new** | — |
| `/terms` | **new** | — |

### Redirects (`next.config.mjs`)

All 308 permanent except `/orbit`:

```
/foundry  /about  /team  → /company
/healthmate              → /mennie
/domains                 → /enterprise-ai
/innovate  /insights     → /research
/orbit                   → /          (307 temporary — see §9)
```

All eight verified landing correctly; no broken internal links.

**Deviation from the brief:** it asked to keep `/foundry`, `/innovate` and
`/insights` as footer-linked pages. You chose to 301 all three — `/foundry`
duplicated the leadership content now on `/company`, and the other two were 12
and 66 lines of near-empty page. The old URLs still work.

---

## 3. Signature animations

Every one carries meaning, and every one resolves to a complete static state
under `prefers-reduced-motion`.

**Home — "Four lines, one core."** A pre-rendered Blender sequence scrubbed on
a `<canvas>`. A ceramic core sits on a plinth; an orbital ring draws itself;
four modules dock in turn, each lighting its teal seams — Enterprise AI, Pharma
AI, Healthcare AI, Photonics. A text chapter fades in with each. *One practice,
four lines.*

**Photonics — "Light across the hall."** Empty data-hall floor → rows of racks
rise → amber copper links light inside each rack → teal optical fibres race
across the rows to the spine switches → camera lifts to a top view. Amber is
copper, teal is optics, and the page only ever uses amber here.

**Enterprise AI — "The checkpoint."** Document particles stream into an agent
node and **stop** at a human gate. A check approves, the gate opens, and an
audit ledger types three lines: who asked · what was surfaced · who decided.
*Human-in-the-loop is the architecture, not a setting.*

**Pharma — "The evidence thread."** A generic, clearly fictional observation
card. Highlighted phrases send teal threads to an SOP, a batch record and a
deviation log; a CAPA draft assembles line by line; a QA approval stamp lands
with a name placeholder and timestamp. *Every output traces to evidence and a
person signs it.*

**MENNIE.** The hero pins and pushes in 1.00 → 1.12 while four glass HUD tags
resolve one per scroll step — intake, routing, reminders, clinician summary.

### Reduced motion
Nothing pins. Sequences show the final frame as a plain `<img>` (no canvas, no
frame loading at all), every chapter renders as stacked text, SVG stories are
set to their finished state, and `LoopVideo` never fetches a video. Verified
in 22 reduced-motion screenshots.

---

## 4. Media pipeline

### Pre-rendered heroes
Two fully procedural Blender scenes — no downloaded models, no external
textures. Built with **Blender 5.2.2 LTS**; `scripts/blender/_common.py`
probes for API differences back to 4.x rather than assuming them.

```bash
# look test (frames 1 / 40 / 80 / 120)
blender -b -P scripts/blender/home_core.py -- --out /tmp/look --res 960x540 --contact
# full render
blender -b -P scripts/blender/home_core.py -- --out /tmp/home/desktop --res 1600x900 --frames 120 --samples 32
bash scripts/media/frames.sh /tmp/home/desktop public/media/home/desktop 80
```

Each scene renders in **two themes**. The light render is a bright studio
plate; against dark chrome it read as a glowing white block, so `--dark` swaps
the world gradient, ground and fill levels. Geometry, animation and camera are
identical, so the hero says exactly the same thing in either theme. Only one
set is ever downloaded.

| Sequence | Frames | Total | Per frame | Budget |
|---|---|---|---|---|
| Home desktop | 120 @ 1600×900 | 1.7 MB | 14 KB | ≤ 45 KB ✅ |
| Home mobile | 60 @ 900×506 | 464 KB | 7 KB | ≤ 25 KB ✅ |
| Home desktop (dark) | 120 @ 1600×900 | 2.3 MB | 19 KB | ≤ 45 KB ✅ |
| Home mobile (dark) | 60 @ 900×506 | 668 KB | 11 KB | ≤ 25 KB ✅ |
| Photonics desktop | 120 @ 1600×900 | 2.7 MB | 22 KB | ≤ 45 KB ✅ |
| Photonics mobile | 60 @ 900×506 | 764 KB | 12 KB | ≤ 25 KB ✅ |
| Photonics desktop (dark) | 120 @ 1600×900 | 4.3 MB | 36 KB | ≤ 45 KB ✅ |
| Photonics mobile (dark) | 60 @ 900×506 | 1.2 MB | 19 KB | ≤ 25 KB ✅ |

Dark frames are heavier — smooth dark gradients give WebP less to work with —
but still inside budget.

`<ScrollSequence>` takes any frame folder, so a 3D artist's render drops in
with **no code change**.

Three look iterations were run against contact sheets, as the brief required.
What the renders actually taught:
- a frosted-glass shell over the core rendered as two grey "eyes" — it looked
  like a face. The glass note moved to the plinth.
- `bevel_factor_end` does nothing on a **cyclic** spline, so the ring and the
  fibres are open arcs; that is the only reason they can draw on.
- AgX compresses bright emissives toward white. Amber and teal only read as
  themselves with a **tinted base and low emission** — raising emission
  strength made both go cream.

### MENNIE
You supplied `back.png` — a photoreal render, seen from behind, white/silver
shell with cyan spine seams, face not visible. It is **portrait (1086 × 1448)**,
not the 16:9 the brief assumed, so the hero was built as a pinned split
(figure one column, HUD tags the other) rather than a letterbox crop that would
cut the figure in half or an upscale that would invent detail. Converted to
WebP: **2 MB → 115 KB**.

`scripts/media/make-loop.sh` is written and ready for when you have a clip —
it trims, crossfades the tail into the head for a seamless loop, and exports
mp4/webm/mobile/posters. `LoopVideo` is built and wired; swapping it in is one
component change, documented in `docs/ASSET_BRIEFS.md`.

### Portraits
The three headshots **do not actually share a backdrop** — Pratham's is a light
office blur, Vishal's and Ashwani's are dark — so side by side they read as
three unrelated photos. `scripts/media/portraits.py` composites the supplied
transparent cutouts onto one warm-gray plate. They now read as one set.

**Ashwani's source is low resolution** and visibly softer (23 KB vs 69 KB at
the same dimensions). Usable, but a reshoot drops in over the same filenames
with no code change.

---

## 5. Content corrections

Everything on the site now comes from `content/company.ts`, which holds only
the facts in Section 9 of the brief.

**Photonics — manufacturing claims removed.** "What we manufacture", "Made in
India" and "Advanced manufacturing division" are gone, as is the unsourced
"trained in 21 days instead of 34". The page now says plainly: *"We do not
manufacture in India today. Local testing and qualification come first;
assembly follows when volumes justify it."*

**Research.** "2027 Cognitive AI Ecosystem" and the "100% human-in-the-loop"
stat removed. Exploratory tracks are in one section labelled *"Exploratory
research — not products"*.

**MENNIE.** "HealthMate" is gone everywhere — product, route and nav. MENNIE is
described identically on every page: a voice-first patient assistant. Pratham's
bio says so; Netra Sakhi is the eye-care system. The assistive robot is
labelled R&D only.

**Regulated markets.** The feature→regime table says "designed to support"
throughout, with an explicit note that it is **not** a certification, an audit
result or a compliance claim.

**Partner logos.** None. Partners are named in text only, because a logo
implies an endorsement that has not been granted in writing.

---

## 6. Open `[VERIFY]` items

All 13 live in `content/verify.ts`. In development they render with a yellow
dashed outline; in production they render a safe fallback, or nothing at all.

| # | Item | Ships as | Needed |
|---|---|---|---|
| 1 | `cin` | "CIN available on request" | CIN, and that it is correct to publish |
| 2 | `registered-address` | "Vadodara, Gujarat, India" | full registered address as filed |
| 3 | `publications-count` | generic wording | exact count + DOIs/links |
| 4 | `mennie-patent` | "patent-pending" | application number and jurisdiction |
| 5 | `infraeo-consent` | "our US technology partner" | **written consent to name Infraeo Inc.**, and the formal status of the partnership |
| 6 | `aec-reach` | "up to 9 m at 800G (partner specification)" | confirm against the datasheet |
| 7 | `dme-accuracy` | "Results reported in the published paper" | the 98% figure and the dataset it refers to |
| 8 | `netra-sakhi-scopus` | "peer-reviewed conference" | confirm Scopus indexing + link |
| 9 | `intel-collaboration` | **omitted entirely** | programme, partnership, or just tools? |
| 10 | `pps-cost` | **omitted entirely** | primary source for USD 25,000 → 1,200 |
| 11 | `ashwani-title` | his Nexgen title only | what title he carries on this site |
| 12 | `linkedin-people` | **links omitted** | profile URLs for all three |
| 13 | `linkedin-company` | **link omitted** | company LinkedIn URL |

Items 9 and 10 are withheld completely rather than softened — there is no
honest fallback for a specific unverified claim.

**One more to confirm:** the old contact form posted to
`inquiry@praversetech.com`, but the brief gives `pratham@praversetech.com` as
the company address. The new forms use `pratham@`. Tell me which should receive
enquiries.

---

## 7. Design system

Tokens in `app/globals.css`. Light is the brief's palette verbatim. **Dark was
authored for this redesign** — you chose to keep the toggle, and the brief
defines no dark palette, so dark is the same ceramic studio with the lights
down rather than a second brand. Same teal, same amber, inverted ground. It
goes all the way down: both hero sequences have their own dark renders, so
nothing on the page is a light plate pasted onto a dark background.

Dark was verified, not assumed: `scripts/qa/theme-check.mjs` runs axe against
it. It found one real bug — `.btn-on-dark` took its background from `--paper`,
which flips dark in dark mode, so the CTA button was dark-on-dark at 1.05:1.
It now uses the on-dark tokens, which stay light in both themes. **Dark mode:
0 axe violations.**

Every pair was computed against WCAG 2.2 AA before use:

| Pair | Ratio | Needs |
|---|---|---|
| `--ink` on `--paper` | 15.9:1 | 4.5 |
| `--ink-2` on `--paper` | 6.9:1 | 4.5 |
| `--teal-ink` on `--paper` | 5.5:1 | 5.0 |
| `--amber-ink` on `--paper` | 5.1:1 | 4.5 |
| dark `--ink` on dark `--paper` | 15.6:1 | 4.5 |
| dark `--teal-ink` on dark `--paper` | 12.1:1 | 4.5 |

A `--line-strong` token was added that the brief did not specify: the
decorative `--line` hairline is 1.3:1, which is fine for a divider but fails
the 3:1 that real UI boundaries need. Inputs, focus rings and meaningful
borders use `--line-strong` (3.5:1).

**Removed:** the floating satellite PNG and its parallax, the WebGL globe
repeated on every hero (and the `three` dependency, ~150 KB gz), the 2.2-second
"NOIR/FLUX" cinematic theme wipe, `public/site.js` (815 lines) and
`public/vendor/*`. Also removed a global `*::-webkit-scrollbar{display:none}`
that hid scrollbars site-wide.

**Letter-per-line vertical labels: not found in this repo.** Labels here were
already horizontal mono. If they appear on the live site, that deployment is
not this codebase — worth checking.

Fonts are Geist Sans + Geist Mono via `next/font`, self-hosted at build time,
so no runtime request to Google.

---

## 8. Accessibility and performance

### Accessibility — clean
- **axe: 0 violations** across all 11 pages (WCAG 2.0/2.1/2.2 A + AA), light
  **and** dark
- Lighthouse accessibility **94–96**
- skip link, visible focus rings, `aria-current` on nav, labelled forms,
  `aria-pressed` theme toggle, Escape closes the drawer, alt text throughout
- two violations were found and fixed: the evidence-thread source cards
  started at `opacity: 0.35`, dropping the teal label below AA (they now light
  their border instead of dimming their text), and the dark-mode CTA button
  described in §7.

### Performance — two budgets missed, honestly

| | Mobile | Desktop | Budget |
|---|---|---|---|
| Performance | 93–97 | **100** | — |
| LCP | 2.62–3.26 s ❌ | **0.60–0.69 s** ✅ | < 2.5 s |
| CLS | **0.000** ✅ | **0.000** ✅ | < 0.1 |
| Speed Index | ~1.0 s | ~0.3 s | — |
| TBT | 8–26 ms | 0 ms | — |
| JS transferred | 209–221 KB ❌ | — | < 200 KB |

**LCP misses on simulated mobile.** Four things were tried and measured:
deferring pin creation past first paint, putting the hero's first frame in the
markup, preloading it, and halving the portrait images. The preload cut
photonics' LCP *load delay* from 584 ms to 21 ms — and LCP did not move,
because render delay absorbed it. Disabling the headline animation entirely:
no change. Disabling Lenis: no change.

The mobile preset simulates slow 4G **plus a 4× CPU throttle**, and under it
LCP tracks when the simulated main thread settles, not when anything is
actually drawn. Speed Index — how fast the page is *visually* complete — is
**~1.0 s on mobile and ~0.3 s on desktop**, and CLS is a flat zero. I would
call this acceptable and verify against field data rather than keep optimising
a simulation, but it does not meet the stated budget and I am not going to
claim otherwise.

**JS misses, and the brief's own stack is why.** React 19 + Next 16 is ~110 KB
gz before a line of our code; GSAP + ScrollTrigger is ~50 KB; SplitText ~8 KB;
Lenis ~8 KB. That is ~176 KB of mandated stack against a 200 KB budget. What
was trimmed: MotionPath removed (registered globally, used nowhere), SplitText
and DrawSVG moved into the components that call them, `three` dropped, and
`framer-motion` + `lucide-react` removed as unused dependencies. Getting under
200 KB means dropping Lenis (~8 KB) and SplitText (~8 KB) — both named in
Section 3 of the brief. **Your call**; it is a 10-minute change either way.

---

## 9. The Orbit experience

While locating the repo I found the `/orbit` "Flight Deck" — roughly 2,000
lines of 3D work (shader planets, autopilot camera flight, HUD, WebAudio,
Lighthouse 99/100) sitting **uncommitted** in `D:\new praverse\prav-tech-pvt-ltd`,
one `git clean` away from being lost.

It is now committed to branch **`orbit-flight-deck`** in that checkout.

It is deliberately **not** in this redesign: its deep-space dark language is
the opposite of the ceramic palette, and restyling it was outside this brief.
`/orbit` temporarily redirects to `/` (307, not 308, so it can come back).

---

## 10. What I would do next

1. **Clear the `[VERIFY]` list** (§6), especially #5 — the Infraeo naming
   consent gates how the whole Photonics page reads.
2. **Decide the JS budget trade-off** (§8). Dropping Lenis and SplitText gets
   under 200 KB at the cost of two brief-specified libraries.
3. **Legal review of `/privacy` and `/terms`.** They are accurate about what
   the site does today — no cookies, no analytics, no form backend, so no
   consent banner is needed — but they have not been reviewed by a lawyer, and
   the DPDP/GDPR wording should be.
4. **A real form backend.** `mailto:` works but it is not a contact form; it
   depends on the visitor having a mail client configured and you never learn
   about the ones who bounce.
5. **Reshoot Ashwani's portrait**, and consider a 16:9 MENNIE still if you want
   that hero full-bleed.
6. **Photography of real work** — installations, the lab, the team. It is the
   single biggest credibility upgrade still available, and no amount of render
   quality substitutes for it.
7. **Push the branch** and open a PR. Nothing has been pushed yet.

---

## 11. Acceptance checklist (prompt 1)

- [x] Every page has one signature animation explaining its business, with a complete static state under reduced motion
- [x] No satellite, no repeated globe hero, no letter-per-line labels *(none existed in this repo)*
- [x] Photonics no longer claims manufacturing; MENNIE described identically everywhere; "HealthMate" removed
- [x] No fact appears that is not in Section 9; all 13 `[VERIFY]` items wrapped and listed
- [x] Leader photos on Home and Company, consistent crop and treatment
- [x] Old URLs redirect; no broken internal links *(8/8 redirects, 0 broken links)*
- [ ] **Mobile LCP < 2.5 s** — 2.62–3.26 s simulated mobile; 0.60–0.69 s desktop. See §8.
- [x] Mobile CLS < 0.1 — **0.000** on every page
- [x] `npm run build` passes with no type or lint errors

---
---

# Prompt 2 — richer motion, colour, contact, launch readiness

Everything below was added after the first redesign. Same branch,
`redesign-2026`; `npm run build` and `npm run lint` are clean.

Direction taken as given: **quality first, no JS size cap, nothing removed to
save kilobytes.** The one rule applied throughout is that the first screen
must appear fast and heavy code must load after it — which turned out to be
the main performance lever (§P7).

---

## P1. Contact

**The phone number is gone** from every surface: header, footer, contact,
company, legal pages, metadata and JSON-LD. `content/company.ts` no longer has
`phone`/`tel`, and `data/site.ts` (which still held them and was imported by
nothing) is deleted. Verified against the built HTML: no `tel:` link and no
formatted number anywhere. The only remaining occurrence of those digits is
inside the `wa.me` link.

**WhatsApp button** — floating, bottom-right, every page. A plain `wa.me` link
with the official glyph inline, not the official widget: the widget loads
third-party JavaScript and sets cookies, which would force a consent banner
onto a site that currently needs none, and cost weight for nothing.

- hides while the mobile drawer is open (the drawer sets `data-nav-open` on
  `<html>`; the button watches it)
- `env(safe-area-inset-bottom)` offset, and forms/footer get bottom padding on
  mobile so it can never sit on a submit button or a footer link

**Changing the number is one line** — `content/site.ts`:

```ts
whatsappNumber: "919313247264",  // TEMPORARY — replace with the business number
```

Nothing else references it; `whatsappHref` is derived from it.

**Emails** — enquiries to `inquiry@praversetech.com`, hiring to
`careers@praversetech.com`, both confirmed by you as existing. Shown in the
footer under explicit labels.

## P2. Careers (`/careers`)

Linked from the footer and the Company page, deliberately not the main nav.
Intro uses only confirmed facts. One open role: Full Stack Engineer, Vadodara,
some experience preferred, skilled interns welcome, CVs to `careers@`.

Nothing was supplied about pay, stack, benefits or other roles, so **none is
stated** — compensation renders as "Discussed at offer stage" behind a new
`[VERIFY]` entry rather than being invented.

## P3. Colour system

One accent per line, as **two tokens**: `-glow` for light (gradients, seams,
rim light, chart marks) and `-ink`, the only one allowed to carry text. Body
copy stays `--ink` everywhere.

| Line | Glow | Ink (light) | On paper | Ink (dark) |
|---|---|---|---|---|
| Enterprise AI | `#7C5CFF` | `#5B3FD6` | 5.74:1 | `#9B85FF` (6.39:1) |
| Pharma AI | `#10B981` | `#066B49` | 5.59:1 | `#34D399` (9.70:1) |
| MENNIE | `#38BDF8` | `#035F92` | 5.87:1 | `#7DD3FC` (11.19:1) |
| Photonics | `#F59E0B` | `#8A5005` | 5.55:1 | `#FBBF24` (11.17:1) |
| Photonics (optical) | `#4BD6C4` | `#0A6A60` | 5.53:1 | `#6FE3D3` (12.08:1) |

Every ink was computed against all three light surfaces before use. The
light-mode inks sit at ~2.8:1 on dark paper, which is why dark has its own set.

A page sets `data-acc` once and labels, seams, charts and glows follow. Added
`Aurora` (drifting, cursor-reactive coloured light at 13% opacity) and a
scroll tint that casts the in-view line's colour over the page ground at 7%.

**axe: 0 violations in both themes**, across all 12 pages.

## P4. Home

**Re-rendered in colour.** Each module now lights in its own line colour as it
docks — violet, emerald, sky, amber — with a matching coloured rim light on
the core. Camera and timing are unchanged, so `ScrollSequence` needed no edits.

**Live overlay synced to the render.** The Blender scenes now export
`positions.json` alongside the frames: per-frame screen-space coordinates for
the ring and each module. A canvas overlay draws light particles from that
data, so they sit on the render exactly as the camera pushes in. Verified by
screenshot — the particles land on the projected ring to the pixel.

Also: the page ground takes a faint tint of each line as you scroll past it;
business-line cards have per-line accents, pointer tilt and a colour-tracking
sheen; and the cards, leadership strip and process steps reveal in sequence.

## P5. Photonics

- **Live packets** over the hero from the same export: amber makes short hops
  inside racks, teal runs the long fibre paths to the spine. Speed follows
  scroll velocity, so the hall surges as you move and idles when you stop.
- **"Inside an 800G module"** (R3F, procedural): housing, heat sink, PCB, DSP,
  optical engine, fibre — comes apart on scroll, each part labelled with one
  plain line. Camera dollies back as it spreads; labels alternate sides so six
  of them on a vertical stack stay readable. Captioned "Illustrative. Not a
  specific vendor's product."
- **Copper vs optics race**: copper pulses die at 3/5/9 m, optical keep going
  to 100 m and 2 km, numbers counting up.
- **Product cards**: a cable slides into a port and the LED lights.
- **Capacity hubs**: Mumbai 790 MW, Chennai 305, Bengaluru 182, Hyderabad 152,
  Delhi NCR 76, Vadodara HQ marked. Source line: MeitY reply in Lok Sabha
  (Mar 2026). **No India outline** — drawing a national boundary freehand
  would misstate borders, and the only correct source is the Survey of India
  map, which we have no licence to reproduce. It is an abstract node network,
  labelled as schematic.

## P6. MENNIE

A scroll-driven film: black title with a bloom, then the 2.5D hero with the
dolly pushing in, then "her view" with glass HUD panels at depth, then the
three surfaces, then the concept caption. Letterbox bars open as it starts;
grain, vignette and a cool-highlight/warm-shadow grade sit over the whole.

**Depth pipeline** (`scripts/media/depth.py`):

- Model **`depth-anything/Depth-Anything-V2-Small-hf`**, licence
  **Apache-2.0 — commercial use permitted**. This is not an arbitrary choice:
  the Base and Large variants of Depth Anything V2 are **CC-BY-NC-4.0**, so
  only the Small checkpoint is usable on a company site. Do not swap it for a
  bigger one without re-checking.
- Writes a 16-bit `depth.png` (8-bit bands visibly once you displace a mesh by
  it) and a `spine-mask.png` extracted by cyan colour threshold for the
  emissive seam pulse.
- The silhouette edge is softened deliberately: displacing a mesh by a hard
  depth step stretches the triangles straddling it into visible spikes.

The hero is a subdivided plane displaced by that map, with a scroll dolly,
mouse parallax, volumetric shafts (a cheap procedural shader rather than real
volumetrics), instanced dust at several depths, depth-of-field, a spine pulse
and bloom. Displacement is kept shallow (0.34 over a 4-unit plane) and checked
at the start, middle and end of the dolly for tearing.

**Hair is not faked.** No warping of the still. `source.mp4` does not exist,
so the still is used; `scripts/media/make-loop.sh` is ready and
`docs/ASSET_BRIEFS.md` documents the one-component swap. Prompts for three
optional cut-away shots are in the asset briefs; the film uses them if the
files appear and ignores them otherwise.

## P7. Performance — what actually mattered

Nothing was removed. The whole gain came from honouring "heavy code after
first paint":

| | Before | After |
|---|---|---|
| MENNIE mobile perf | 69 | **93** |
| MENNIE LCP | 5.11 s | **3.01 s** |
| MENNIE TBT | 497 ms | **151 ms** |
| Photonics mobile perf | 86 | **94** |
| Photonics LCP | 4.20 s | **3.06 s** |

Three causes, all found by measuring rather than guessing:

1. **MENNIE mounted three.js on load.** The film is entirely scroll-driven, so
   a visitor who never scrolled paid ~500 ms of main-thread time for something
   they never saw. The chunk is now prefetched on idle and mounted on first
   scroll — instant when they scroll, free when they don't.
2. **The Photonics module armed its observer at mount**, pulling the 267 KB
   three.js chunk into the load window and adding 3.5 s of render delay to the
   hero's own paint. It arms on first scroll; the section is several screens
   down.
3. **Overlays fetched 144–344 KB of `positions.json` on phones** for particles
   barely visible at 390 px. Desktop-only now.

Also: Speed Insights renders **only on Vercel** — its script lives at
`/_vercel/...`, so including it anywhere else put a 404 in every console. That
was 192 of 192 QA contexts reporting an error; now zero.

### Current numbers

| Page | Mobile perf | Mobile LCP | CLS | Desktop perf | Desktop LCP |
|---|---|---|---|---|---|
| Home | 96 | 2.78 s | 0.000 | 100 | 0.60 s |
| Photonics | 94 | 3.06 s | 0.000 | 100 | 0.62 s |
| MENNIE | 92 | 3.01 s | 0.000 | 100 | 0.65 s |
| Pharma | 97 | 2.61 s | 0.000 | — | — |
| Enterprise AI | 96 | 2.67 s | 0.000 | — | — |
| Company | 95 | 2.92 s | 0.000 | — | — |

Accessibility 98–100, best practices 100, SEO 100 throughout. CLS is a flat
zero everywhere.

**Mobile LCP still reads above 2.5 s.** As in prompt 1, Speed Index — how fast
the page is *visually* complete — is ~1.0 s, and desktop LCP is under 0.7 s.
Lighthouse's mobile preset also does not emulate `deviceMemory` or
`hardwareConcurrency`, so it runs the full 3D path on a 4x-throttled CPU that
a real 4 GB phone would never reach: the capability gate would have sent it to
the poster instead. Worth confirming against field data from Speed Insights
after launch rather than tuning further against a simulation.

## P8. Enquiry form

The old form built a `mailto:` link, which loses the message entirely for
anyone without a configured mail client — on a work laptop, most people. They
click send, nothing happens, and we never learn they tried.

Now `POST /api/enquiry` (Node runtime), zod validation, nodemailer over Zoho
SMTP. `smtp.zoho.in`, since praversetech.com is on Zoho's India data centre.
The visitor's address goes in `replyTo` so reply works while SPF/DKIM pass.

**Two bugs found by calling the endpoint rather than assuming:**

- the honeypot was enforced in the schema, so filling it returned a precise
  validation error — telling a bot exactly which field caught it, and
  hard-failing any browser that autofilled "website". It is permissive in the
  schema and inspected after validation; either way the answer is 200.
- the rate limit counted validation failures, so a visitor who mistyped their
  email twice was locked out for a minute. It now counts only real send
  attempts.

On failure the form never dead-ends — it shows the address to write to.

**Before launch:** set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (a
Zoho **app-specific** password, not the account password) and `ENQUIRY_TO` in
Vercel. `.env.example` documents the shape; no secrets are committed. Until
they are set the endpoint returns 502 and the form shows the fallback address.

The rate limit is in-memory, so it is per-instance. Fine for this traffic; if
it ever needs to be reliable across instances, move it to Upstash.

## P9. SEO and sharing

- Unique title (<=60 chars) and description (<=155) per page, via `lib/seo.ts`
- Canonical URLs on every page
- `app/sitemap.ts` (canonical routes only, including `/careers`) and
  `app/robots.ts`
- Organization JSON-LD: no phone, no `aggregateRating`, no awards. The postal
  address is gated on the **same `[VERIFY]` entry as the footer**, so the
  structured data and the visible page cannot disagree.
- Eight 1200x630 OG cards built from each page's own hero frame, so a shared
  link previews the page it opens. JPEG — 336 KB for the whole set, where PNG
  was 400–600 KB each.
- **Redirects are now explicit 301s** (Next's `permanent: true` emits 308).
  Both are permanent and Google treats them alike, but 301 is what was asked
  for and is more universally understood. `/orbit` stays a 307 so it can come
  back. All 8 verified.

## P10. Measurement

Vercel Speed Insights, cookieless — no cookies, no cross-site profile, so no
consent banner is needed. `/privacy` now describes it, the form, the Zoho
mailbox, the honeypot and the IP-based rate check.

## P11. QA

**192 screenshots**: 12 pages x {Chromium, WebKit} x {desktop 1440x900, mobile
390x844} x {light, dark} x {motion, reduced}. WebKit is in the matrix because
the Safari-only risks here — pinned scrolling, `svh`, `backdrop-filter` —
never appear in Chromium.

| | |
|---|---|
| axe violations | **0 light, 0 dark** |
| Broken internal links | **0** |
| Redirects | **8/8 correct** |
| Console / page errors | **0** |

**A bug the screenshots caught that source review could not:** the careers and
privacy pages rendered "Vadodara, Gujarat, **India**building" and "Pvt
Ltd(Praverse". JSX drops the space after an interpolated expression in certain
positions — the source contains the space, so it is invisible in review and
only shows in the output. Fixed, and `scripts/qa/text-check.mjs` now asserts
the rendered text so it cannot come back silently.

`qa/DEVICE_CHECKLIST.md` covers what a harness cannot: address-bar resize
during a pinned scroll, thermal throttling on a real GPU, touch, WhatsApp
deep-linking, and confirming a 4 GB Android is routed away from 3D.

## P12. Open `[VERIFY]` items and launch blockers

### Blockers — the site should not go live until these are done

1. **SMTP env vars in Vercel.** Until set, every enquiry fails to 502. The
   form degrades honestly, but no enquiry reaches you.
2. **Send one real test enquiry** and confirm it lands in `inquiry@` and that
   reply goes to the sender.
3. **`infraeo-consent`** — written consent to name Infraeo Inc. Photonics
   currently reads "our US technology partner" throughout.
4. **Replace the WhatsApp number** in `content/site.ts` if the business number
   differs from the founder's.
5. **Legal review of `/privacy` and `/terms`.** Accurate about what the site
   does, but not reviewed by a lawyer.

### Still open from prompt 1

`cin`, `registered-address`, `publications-count`, `mennie-patent`,
`aec-reach`, `dme-accuracy`, `netra-sakhi-scopus`, `intel-collaboration`
(withheld entirely), `pps-cost` (withheld entirely), `ashwani-title`,
`linkedin-people` (links omitted), `linkedin-company` (link omitted).

### New in prompt 2

- **`careers-compensation`** — no salary band, intern pay, stack or benefits
  were supplied, so none is stated.

### Not blockers, but worth doing

- `public/media/mennie/source.mp4` for real hair movement, and the three
  cut-away shots. The still works; the loop would be better.
- Reshoot Ashwani's portrait — still visibly softer than the other two.
- Real photography of installations or the team.

## P13. Acceptance checklist (prompt 2)

- [x] Phone number removed everywhere, verified in built HTML
- [x] WhatsApp button on every page, one-line number change, clears forms and footer
- [x] `/careers` with the one open role; nothing invented
- [x] Per-line accent colours, all >=5.5:1 on light and >=6.3:1 on dark
- [x] Aurora washes, cursor-reactive; scroll tint per line
- [x] Home re-rendered in line colours with a live overlay tracking the render
- [x] Photonics: live packets, 3D module, race, port cards, capacity hubs
- [x] MENNIE: depth map (Apache-2.0), 2.5D hero, film chapters, fallback
- [x] Heavy 3D dynamically imported, `ssr:false`, after first paint, per page
- [x] Low-power and reduced-motion fallback on every 3D section
- [x] Real form submission with validation, honeypot and rate limiting
- [x] SEO: titles, descriptions, canonicals, OG images, sitemap, robots, JSON-LD
- [x] 301s confirmed in the production config
- [x] Cookieless Core Web Vitals; `/privacy` updated
- [x] QA: build, lint, axe both themes, links, redirects, 192 screenshots
- [x] `qa/DEVICE_CHECKLIST.md`
- [ ] **SMTP credentials set and a real enquiry confirmed** — needs you
