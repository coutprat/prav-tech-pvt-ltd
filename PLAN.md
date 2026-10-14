# PLAN.md — Praverse Tech website redesign (`redesign-2026`)

Phase 0 output. Written before any code changes.

---

## 0. Workspace provenance (read this first)

The working directory `D:\praverse website v3` was **empty** at session start. The brief
assumes it is being run inside the praversetech.com repo, so the first job was to find
the real repo and establish a base.

Two local checkouts of `github.com/coutprat/prav-tech-pvt-ltd` exist:

| Checkout | HEAD | Date | State |
|---|---|---|---|
| `D:\prav-tech-pvt-ltd` | `7d36a87` | 2026-07-17 | clean, **newest** |
| `D:\new praverse\prav-tech-pvt-ltd` | `2bdb9cc` | 2026-07-10 | 15 uncommitted files, incl. the whole `/orbit` build |

`2bdb9cc` is a verified ancestor of `7d36a87`, so the newer checkout contains all
*committed* history. **v3 was cloned from `D:\prav-tech-pvt-ltd`**, remote re-pointed at
GitHub, branch `redesign-2026` created.

> ⚠️ **The `/orbit` "Flight Deck" experience was never committed.** It exists only as
> untracked files in the older checkout (`app/orbit/`, `components/orbit/`, `content/`,
> `lib/`, `ORBIT_OVERVIEW.md`, plus edits to `layout.tsx` / `page.tsx` / `Navbar.tsx`).
> It is therefore **not** in this v3 base. See decision D1.

## 1. Current stack and versions

| | |
|---|---|
| Framework | **Next.js 16.2.9**, App Router, React 19.0.0 |
| Language | TypeScript 5.7.2 |
| Styling | **Tailwind 3.4.17** + a 1,064-line `app/globals.css` carrying nearly all real styling |
| Motion | `framer-motion` 11.18.2 (npm) **plus** GSAP 3 + ScrollTrigger + Lenis as **static vendor scripts** in `public/vendor/` driven by `public/site.js` (815 lines) |
| 3D | `three` 0.160.0 — `WebGLBackground.tsx`, `ThreeGlobalBridge.tsx` |
| Fonts | Sora / Inter / JetBrains Mono via `next/font/google` |
| Icons | `lucide-react` 0.468.0 |

Scripts: `dev`, `build`, `start`, `lint` (`eslint . --max-warnings=0`).

### Current design tokens (to be replaced)
Light base `#f5f7fb`, ink `#0b1226`, accent gradient cyan `#06b6d4` → blue `#3b82f6` →
violet `#8b5cf6`, plus a full dark **"space"** theme (`body[data-theme="space"]`,
near-black `#080809`, cyan `#00d4ff`) with an animated theme-transition overlay.
This is a different visual language from the brief's warm-ceramic palette — the swap is
total, not incremental.

## 2. Route list (as built today)

| Route | File | Lines |
|---|---|---|
| `/` | `app/page.tsx` | 74 |
| `/contact` | `app/contact/page.tsx` | 195 |
| `/foundry` | `app/foundry/page.tsx` | 109 |
| `/healthmate` | `app/healthmate/page.tsx` | 118 |
| `/innovate` | `app/innovate/page.tsx` | 12 |
| `/insights` | `app/insights/page.tsx` | 66 |
| `/pharma` | `app/pharma/page.tsx` | 92 |
| `/photonics` | `app/photonics/page.tsx` | 315 |
| `/research` | `app/research/page.tsx` | 131 |

Existing redirects in `next.config.mjs`: `/domains` → `/foundry#domains`, `/about` → `/foundry`.

Current nav: Foundry · Photonics · MENNIE (→`/healthmate`) · Pharma AI · Research · Contact.

Legacy static site (`*.html` at root + `assets/`) is still in the tree, unused by the
App Router build. Left untouched this phase.

## 3. What I will change

**Phase 1 — foundations**
- Replace the token layer in `globals.css` with the brief's Section 4 variables
  (`--paper`, `--ink`, `--navy`, `--teal`, `--teal-ink`, `--amber`, …).
- Fonts → **Geist Sans + Geist Mono** via `next/font/google`, replacing Sora/Inter/JetBrains.
- Rebuild nav/footer to the Section 5 IA; new footer identity block.
- Build shared components: `SectionLabel`, `Headline`, `ProofBar`, `StatBlock`,
  `SpecTable`, `MilestoneTracker`, `PersonCard`, `BusinessLineCard`, `Disclaimer`,
  `CTASection`, `Verify`.
- **Remove** `satellite.png` + `SatelliteParallax.jsx` + `SatelliteGuard.tsx`, and the
  repeated wireframe globe (`WebGLBackground.tsx`, `ThreeGlobalBridge.tsx`).

**Phase 2 — motion engine**
`<ScrollSequence>` (canvas, pinned, ScrollTrigger-scrubbed, progressive frame loading),
`<LoopVideo>` (IntersectionObserver-paused), SVG DrawSVG/MotionPath helpers. Move GSAP +
Lenis from `public/vendor` to npm (`gsap`, `@gsap/react`, `lenis`); port what is still
needed out of `site.js`, then retire it.

**Phase 3 — pages** in brief order: Home → Photonics → MENNIE → Pharma → Enterprise AI →
Research → Company → Contact, plus redirects.

**Phase 4 — media** (see §6), **Phase 5 — QA** (Playwright, Lighthouse, axe → `qa/`).

## 4. What I will remove

| Item | Reason |
|---|---|
| `public/satellite.png`, `SatelliteParallax.jsx`, `SatelliteGuard.tsx` | brief §2.6 — decorative |
| `WebGLBackground.tsx`, `ThreeGlobalBridge.tsx`, `three` dep | repeated globe hero, brief §2.6; no section needs 3D (§3) |
| `public/site.js`, `public/vendor/*` | superseded by npm GSAP/Lenis + `useGSAP` (brief §2.8) |
| Photonics: "What we manufacture", "Made in India", "Advanced manufacturing division", "trained in 21 days instead of 34" | brief §6.5 — unsupportable claims |
| Research: "2027 Cognitive AI Ecosystem", "100% human-in-the-loop" stats | brief §6.6 |
| "HealthMate" product naming everywhere | brief §6.7 — product is MENNIE |

**Not found in this repo** (so nothing to remove): letter-per-line vertical section
labels. Labels here are already horizontal mono (`.kicker`, `.eyebrow`). If they appear
on the live deployment, that build is not this one — flagging for confirmation.

## 5. Decisions — RESOLVED

All four were put to the user at the end of Phase 0 and answered. Recorded
here as the rationale; outcomes are in `REDESIGN_OVERVIEW.md`.

- **D1 — `/orbit`: leave out, commit to its own branch.** Done — branch
  `orbit-flight-deck` in `D:
ew praverse\prav-tech-pvt-ltd`. `/orbit`
  redirects to `/` as a 307 so it can come back.
- **D2 — dark theme: keep the toggle, author a dark palette.** Done — dark is
  the same ceramic studio with the lights down, not a second brand. All pairs
  verified to AA.
- **D3 — thin routes: 301 all three.** Done — `/foundry` → `/company`,
  `/innovate` and `/insights` → `/research`. This deviates from the brief,
  which asked to keep them as footer links.
- **D4 — media tooling: install both.** Done — Blender 5.2.2 LTS and ffmpeg
  9.0.2 installed via winget; both hero sequences are real renders, not
  placeholders.

### Original framing of the decisions

- **D1 — `/orbit`.** Brief §5 lists it as "keep, footer-only link, decide in PLAN.md".
  It is ~2,000 lines of uncommitted 3D work (shader planets, autopilot, HUD, WebAudio,
  Lighthouse 99/100) sitting in another folder, and its visual language (deep-space dark,
  cyan) is the *opposite* of the new ceramic palette. **Decision: do not port it into the
  redesign.** It would need a full restyle to not look like a different company, which is
  outside this brief. It stays safe in `D:\new praverse\prav-tech-pvt-ltd`. I will
  recommend committing it to its own branch so it is not lost. *Needs your sign-off.*
- **D2 — dark "space" theme.** The brief's design system is a single light paper theme
  with navy sections; it defines no dark palette. **Decision: retire the theme toggle**
  (`ThemeToggleSwitch`, `ThemeTransitionOverlay`, all `body[data-theme="space"]` CSS).
  This deletes a working feature, so per brief §2.1 I am flagging rather than assuming.
- **D3 — `/foundry`.** Currently absorbs About + Domains + leadership. Leadership moves to
  the new `/company`. Plan: `/foundry` → 301 to `/company`, since keeping both splits the
  same content across two URLs. Brief says keep `/foundry`; this contradicts it, so
  flagging. `/innovate` (12 lines) and `/insights` (66 lines) are near-empty — recommend
  301 to `/research` rather than footer links to thin pages.
- **D4 — `/team` redirect.** Brief asks for `/team` → `/company`. No `/team` route exists
  here. Adding the redirect anyway (harmless, covers the live site's URL).

## 6. Media tooling — checked, both missing

```
blender --version  → not found
ffmpeg  -version   → not found
cwebp   -version   → not found
```
Node 24.14.1, npm 11.11.0, Python 3.13.14, winget present.

Per brief §7B this means: **generate placeholder gradient frames, build everything else,
and ask you to install Blender (4.2 LTS or newer).** `<ScrollSequence>` will take any
frame folder, so a real render drops in later with **no code change**.

ffmpeg is also needed for the MENNIE loop (§7C) and PNG→WebP conversion. To install both:

```bash
winget install BlenderFoundation.Blender Gyan.FFmpeg
```

Say the word and I'll run it; I have not installed anything unprompted.

**Team photos:** `team-headshots.zip` verified — 12 files, all exactly 800×1000, naming
matches brief §8 (`*.webp`, `*.jpg`, `*-mono.webp`, `*-cutout.png` for pratham /
vishal / ashwani). Ashwani's is the lightest (24–64 KB vs 72–119 KB for Vishal),
consistent with the brief's note that his source is low-res — component will stay
reshoot-ready on the same filenames.

## 7. Risks

1. **Total visual replacement.** Nearly all styling lives in one 1,064-line `globals.css`
   built around the old gradient/dark-theme language. Replacing tokens alone will not get
   the new look — the stylesheet gets rewritten section by section, so regressions are
   likely mid-flight. Mitigated by per-phase commits and Phase 5 screenshot QA.
2. **Two motion systems.** `framer-motion` *and* vendor GSAP/Lenis/`site.js` both run
   today. Porting to npm GSAP while `site.js` still drives existing pages is the most
   breakage-prone step; `site.js` is removed only after its behaviour is accounted for.
3. **JS budget.** Brief caps JS at 200 KB gz/page. Dropping `three` (~150 KB gz) helps a
   lot; adding GSAP + ScrollTrigger + SplitText + DrawSVG + MotionPath + Lenis gives much
   of it back. Will measure per route in Phase 5 and trim plugins per page if needed.
4. **Fact discipline.** Brief §2.3 forbids inventing facts, but the current pages contain
   claims absent from §9 (notably Photonics manufacturing). Removing them changes page
   substance — all such edits are listed in `REDESIGN_OVERVIEW.md`.
5. **Hero media is the LCP element** on Home / Photonics / MENNIE and does not exist yet.
   LCP numbers from Phase 5 against placeholder frames will not predict the real render;
   I'll re-measure once real media lands.
6. **No `/start-a-project`, `/privacy`, `/terms` exist** — three new pages, and the legal
   copy (GDPR + DPDP) needs real review before it goes live.

## 8. Phase order

0. ✅ Inspect + this file. Tools checked.
1. Tokens, fonts, layout, nav, footer, shared components; remove satellite/globe.
2. Motion engine with placeholder media.
3. Pages + redirects.
4. Media: Blender scripts, loop script, `docs/ASSET_BRIEFS.md`, team photos.
5. QA: Playwright screenshots (1440×900, 390×844, ± reduced motion), Lighthouse mobile,
   axe, link/redirect check → `qa/`.

Final deliverable: `REDESIGN_OVERVIEW.md`.
