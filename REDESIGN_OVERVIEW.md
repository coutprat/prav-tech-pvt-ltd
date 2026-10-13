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

| Sequence | Frames | Total | Per frame | Budget |
|---|---|---|---|---|
| Home desktop | 120 @ 1600×900 | 1.7 MB | 14 KB | ≤ 45 KB ✅ |
| Home mobile | 60 @ 900×506 | 464 KB | 7 KB | ≤ 25 KB ✅ |
| Photonics desktop | 120 @ 1600×900 | 2.7 MB | 22 KB | ≤ 45 KB ✅ |
| Photonics mobile | 60 @ 900×506 | 764 KB | 12 KB | ≤ 25 KB ✅ |

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
down rather than a second brand. Same teal, same amber, inverted ground.

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
- **axe: 0 violations** across all 11 pages (WCAG 2.0/2.1/2.2 A + AA)
- Lighthouse accessibility **94–96**
- skip link, visible focus rings, `aria-current` on nav, labelled forms,
  `aria-pressed` theme toggle, Escape closes the drawer, alt text throughout
- one violation was found and fixed: the evidence-thread source cards started
  at `opacity: 0.35`, dropping the teal label below AA. They now light their
  border instead of dimming their text.

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

## 11. Acceptance checklist

- [x] Every page has one signature animation explaining its business, with a complete static state under reduced motion
- [x] No satellite, no repeated globe hero, no letter-per-line labels *(none existed in this repo)*
- [x] Photonics no longer claims manufacturing; MENNIE described identically everywhere; "HealthMate" removed
- [x] No fact appears that is not in Section 9; all 13 `[VERIFY]` items wrapped and listed
- [x] Leader photos on Home and Company, consistent crop and treatment
- [x] Old URLs redirect; no broken internal links *(8/8 redirects, 0 broken links)*
- [ ] **Mobile LCP < 2.5 s** — 2.62–3.26 s simulated mobile; 0.60–0.69 s desktop. See §8.
- [x] Mobile CLS < 0.1 — **0.000** on every page
- [x] `npm run build` passes with no type or lint errors
