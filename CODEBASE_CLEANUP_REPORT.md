# Codebase Cleanup Report

**Repository:** `prav-tech-pvt-ltd` (Praverse Tech website)
**Branch:** `main` · **Baseline commit:** `2e744f1`
**Date:** 2026-07-17

> **Pass 2 (same day).** After the first pass, the remaining "manual review" items were
> re-examined and cleared. See **§11 — Second pass** at the end. Sections 1–10 describe
> pass 1 and are left as written, except where §11 explicitly supersedes them.

---

## 1. Executive summary

The full repository (110 tracked files) was inspected and a complete import/usage graph was built
before any change was made. The cleanup removed **22 files** and **~2,259 lines** of provably
unreachable source, dropped **4 unused npm dependencies**, and deleted **~1.15 MB** of unreferenced
tracked binaries — with no change to user-facing behaviour.

Two findings dominated the work:

1. **The production build was already broken at baseline.** `next build`, `tsc --noEmit` and
   `npm run lint` all failed on the untouched checkout. The build has been broken since commit
   `b324dee`, with five further commits landed on top of it. This was **not** caused by the cleanup.
   It is now fixed, so the repo has a green baseline for the first time in six commits.

2. **There are two "space tour" implementations, and only one is dead.** The React implementation
   (`components/space-tour/`) is disabled and unreachable. The *legacy* implementation lives inside
   the live `public/site.js` and shares the same `space-tour-` CSS prefix in `globals.css`.
   Deleting "the space-tour CSS" would have broken the live Noir/Flux theme. That CSS was
   **deliberately preserved** and verified live in a browser (see §4).

---

## 2. Baseline condition (before any change)

Recorded on the untouched checkout at `2e744f1`, after `npm install`:

| Command | Exit | Detail |
|---|---|---|
| `npx next build` | **1 — FAIL** | `components/layout/Navbar.tsx:19` — `Type error: 'nav' is possibly 'null'.` |
| `npx tsc --noEmit` | **1 — FAIL** | 3 errors, all `Navbar.tsx` (lines 19, 21, 25) |
| `npm run lint` | **1 — FAIL** | 3 errors (`.local-static-server.cjs`, `no-require-imports`) + 1 warning (`SatelliteParallax.jsx:152`, `react-hooks/exhaustive-deps`) |

**Pre-existing defects found and documented (not caused by cleanup):**

- **Broken production build** (above). Introduced by `b324dee`, which added the `nav-hidden` scroll
  effect. TypeScript does not preserve narrowing of a captured `const` inside a *hoisted function
  declaration*; it does inside an arrow function. Verified empirically with an isolated test case
  against the project's own TypeScript 5.7.2.
- **The legacy space-tour overlay never renders in the Next.js app.** `public/site.js:460` runs
  `document.body.appendChild(tourOverlay)`, but React owns `<body>` and removes the injected
  `<aside>` during hydration. Confirmed present at baseline **and** after cleanup (identical DOM),
  so it is pre-existing and untouched. See §9.
- `tsconfig.tsbuildinfo` was tracked; merely running `tsc` rewrote it, dirtying the working tree.

Environment: Node/npm on Windows; no test framework, no CI config, no Docker/K8s, no database and
no migrations exist in this repository, so those verification steps are **not applicable**.

---

## 3. Removed code

### 3.1 Dead React space-tour tree — 1,740 lines

| File | Lines |
|---|---|
| `components/space-tour/SpaceTourEngine.ts` | 1,436 |
| `components/space-tour/SpaceTourOverlay.tsx` | 260 |
| `components/space-tour/SpaceTourProvider.tsx` | 44 |

- **Reason:** superseded and disabled.
- **Evidence:** the only reference anywhere was a **commented-out** import in `app/layout.tsx:7`
  (`// import { SpaceTourProvider } ...`), disabled by commit `b324dee`. The Navbar contains no
  Space Tour entry point. Nothing else imports the tree; the three files only referenced each other.
  Components under `components/` are not framework-discovered by Next.js (only `app/**/page.tsx` and
  `layout.tsx` are), so "no importer" is conclusive here.
- **Verification:** `tsc`, `eslint`, `next build` all pass; all 11 routes still prerender.
- **Risk:** Low. Recoverable via `git show 166ebcd -- components/space-tour`.

### 3.2 Nine dead one-line alias shims — 9 lines

`components/sections/{CTASection, CapabilitiesSection, FrontierLabSection, HealthMateSection,
HeroSection, JourneySection, PharmaAISection, ProcessSection, StatsSection}.tsx`

- **Reason:** each was a single re-export alias, e.g.
  `export { StaticPageContent as StatsSection } from "@/components/layout/StaticPageContent";`
- **Evidence:** zero importers. Every page imports `StaticPageContent` directly. Pure indirection.
- **Risk:** Low.

### 3.3 Unused UI components — 485 lines

| File | Lines | Evidence |
|---|---|---|
| `components/ui/NeuralOrb.jsx` | 318 | Zero importers; never wired up since creation (`b324dee`). |
| `components/ui/BrandWatermark.jsx` | 136 | Zero importers. **Superseded** — the live PRAVERSE watermark is `TextHoverEffect` in the Footer; the recent watermark commit `d289a84` modified `TextHoverEffect.tsx` only, not this file. |
| `components/ui/SectionHeader.tsx` | 18 | Zero importers. |
| `components/ui/GradientButton.tsx` | 8 | Zero importers. |
| `components/ui/AnimatedCard.tsx` | 5 | Zero importers. |

> **Note:** the CSS classes these components emitted (`sec-head`, `kicker`, `btn-grad`, `card rv`)
> **are still used** by the raw HTML injected through `StaticPageContent`. Only the unused React
> wrappers were deleted; **no CSS was removed.**

### 3.4 Dead data modules — 20 lines

| File | Evidence |
|---|---|
| `data/pages.ts` | Zero importers. Also stale: listed `/about` and `/domains`, which are now permanent redirects in `next.config.mjs`. |
| `data/domains.ts` | `frontierTracks` had zero importers. |

`data/site.ts` and `data/navigation.ts` were **kept** — both are live.

### 3.5 Dead ref in a live component

`components/ui/SatelliteParallax.jsx` — removed `floatRef` (declared line 50) and its cleanup call
`floatRef.current?.kill()` (line 152).

- **Evidence:** `floatRef` was **declared and read but never assigned anywhere**, so `.current` was
  permanently `null` and the optional-chained call was a provable no-op. Leftover from a removed
  float animation.
- This resolved the pre-existing `react-hooks/exhaustive-deps` warning **by removing genuinely dead
  code, not by suppressing the rule.** (The rule's suggested fix — copying the ref into a local —
  would have been wrong here anyway: `stRef` holds a GSAP instance, not a React-rendered node.)

### 3.6 Unreferenced tracked assets — 906,762 bytes

| File | Bytes | Evidence |
|---|---|---|
| `public/vendor/three.min.js` | 669,884 | Referenced by **nothing**. `SmoothScrollProvider` loads only `gsap`, `ScrollTrigger`, `lenis` from `/vendor/`. THREE is supplied to `window` by `ThreeGlobalBridge` (npm `three`). The legacy HTML loads three from the jsDelivr CDN, not `/vendor/`. |
| `public/images/satellite .png` | 236,878 | **Byte-identical** duplicate (md5 `c6dd3f77…`) of `public/satellite.png`; only `/satellite.png` is referenced. The filename contains a stray space. |

### 3.7 Generated artifact untracked

`tsconfig.tsbuildinfo` (301,365 bytes) — `git rm --cached` + added `*.tsbuildinfo` to `.gitignore`.
The file remains on disk.

- **Evidence:** it is a TypeScript **incremental build cache**. Proof: running `tsc --noEmit` on a
  clean tree immediately reported `M tsconfig.tsbuildinfo`. It is regenerated on every run and
  cannot be depended on by any deployment. Next.js's own recommended `.gitignore` excludes
  `*.tsbuildinfo`.

---

## 4. Preserved suspicious code (appeared unused — deliberately retained)

| Item | Why it was kept |
|---|---|
| **All `space-tour-*` CSS in `app/globals.css` (~116 lines)** | **Partly live.** `public/site.js` (loaded on every page) builds `.space-tour-overlay` at runtime and `applyTheme()` toggles `body.space-tour-active` from the Noir/Flux switch. **Browser-verified:** switching to Flux applies `body.space-tour-active`, and `#webgl` computes to `z-index:1; opacity:0.95` — exactly the values from `globals.css:178`. Removing this CSS **would have broken the Flux theme.** The v1 and v2 selectors interleave in one file with confusingly similar names (`space-tour-copy` vs `space-tour-copy-grid`, `space-tour-rail` vs `space-tour-vrail`), so selector-level surgery is high-risk for ~1 KB gzipped. See §9 for the exact v2-only list. |
| Root `*.html` (9 files) + `assets/` | Not served by Next.js, but `.local-static-server.cjs` — added in the **most recent commit** — serves the repo root, making these an active local preview. Deliberate, recent tooling investment; not safe to assume abandoned. |
| `legacy-static-site/` (13 files) | 8 of 9 HTML files are **byte-identical** to the root copies, so one copy is redundant — but which is canonical is a product decision, not something evidence can settle. Preserved. |
| `Space Tour v2 Standalone.html` (781 KB) | Added in the **latest commit**; appears to be the active v2 prototype that supersedes the deleted React tree. |
| `public/images/image 1..9.png`, `image7.png` (10 files, ~700 KB) | Unreferenced anywhere — but added deliberately in the latest commit titled *"add project assets"*. Likely staged for upcoming work. Preserved. |
| `.space-tour-trigger` CSS (`globals.css:730-734`) | Genuinely dead (the removed navbar button), but sits inside the space-tour CSS block; bundled into the §9 recommendation rather than risking the live block. |
| `data/site.ts` `phone` / `tel` | A recent commit was titled *"remove phone"*, but it only touched the **contact page**. Both fields are still rendered by the **Footer** — verified live (`+91 93132 47264`). Kept. |
| npm `three` | Load-bearing: `ThreeGlobalBridge` sets `window.THREE`, which `public/site.js` blocks on. Verified live (`REVISION 160`). |

---

## 5. Dependency cleanup

**Removed (4):**

| Package | Evidence of non-use |
|---|---|
| `@react-three/drei` | 0 source imports; absent from all config/scripts/build files. |
| `@react-three/fiber` | 0 source imports; absent from all config/scripts/build files. |
| `lenis` | 0 source imports. The runtime uses the **vendored** `/vendor/lenis.min.js` (`window.Lenis`). |
| `gsap` | Imported **only** by the deleted space-tour engine. The runtime uses the **vendored** `/vendor/gsap.min.js` (`window.gsap`). |

**Added (1):** `@types/three@~0.160.0` → `devDependencies`.

> **Why:** removing `@react-three/fiber` surfaced a real latent problem. `three@0.160.0` ships no
> type declarations, and `@types/three` was arriving **implicitly as a transitive dependency** of
> `@react-three/fiber`. Removing the unused package broke typing for the *live* `ThreeGlobalBridge`
> (`TS7016`). The correct fix is to declare the type dependency the code actually needs, rather than
> retain an unused runtime package for its types. **Caught by per-batch verification.**

Searched before removal: source imports, config files, package scripts, build plugins, test setup,
runtime/dynamic loading, CLI usage, deployment files, peer/transitive expectations.

Lockfile regenerated via `npm uninstall` / `npm install` (never hand-edited).
`npm` reported **56 packages removed**, 5 added.

---

## 6. Whitespace and formatting cleanup

The repository has **no formatter configured** (no Prettier config, no `format` script), so no
repo-wide reformatting was performed — that would have buried the functional diff.

The only whitespace change is in `app/layout.tsx`: removing the commented-out `<SpaceTourProvider>`
wrapper left its 9 children over-indented, so they were de-indented one level. No other file had
whitespace touched. No user-visible strings, CSS, HTML, or vendored/generated files were reformatted.

---

## 7. Verification results

Run after every batch, and again at the end:

| Command | Baseline | Final |
|---|---|---|
| `npx tsc --noEmit` | **1 (FAIL — 3 errors)** | **0 (PASS)** |
| `npm run lint` (`eslint . --max-warnings=0`) | **1 (FAIL — 3 errors, 1 warning)** | **0 (PASS)** |
| `npx next build` | **1 (FAIL)** | **0 (PASS — 11/11 routes prerendered)** |

**Runtime verification (dev server + browser):**

- All 9 routes return HTTP 200; `/about` and `/domains` redirects still fire.
- `window.THREE` present (REVISION 160) → `site.js` boot dependency satisfied.
- `window.gsap`, `window.ScrollTrigger`, `window.Lenis` all load from `/vendor/`.
- `#webgl` canvas renders; no console errors.
- **Noir/Flux theme toggle:** `light → space`, applies `body.space-tour-active`, `#webgl` computes
  `z-index:1 / opacity:0.95` (the preserved CSS), persists to `localStorage`.
- Footer watermark renders `PRAVERSE` via `TextHoverEffect`; footer email + phone intact.
- `/contact` correctly hides the satellite via `SatelliteGuard`.
- **A/B proof of no behaviour change:** the cleanup was stashed and the original HEAD re-tested in
  the same browser. The DOM was **identical** before and after, confirming the missing legacy
  overlay (§9) is pre-existing and that the cleanup changed no runtime behaviour.

Not applicable to this repository: unit/integration/E2E tests, API contract checks, database
migration checks, Docker build (none configured).

---

## 8. Performance impact (measured)

| Metric | Before | After | Δ |
|---|---|---|---|
| Tracked files | 110 | 88 | **−22** |
| Source LOC (`app`,`components`,`data`,`lib`) | 5,818 | 3,559 | **−2,259** |
| Runtime dependencies | 12 | 8 | **−4** |
| `node_modules` on disk | 642 MB | 510 MB | **−132 MB** |
| `node_modules` package dirs | 364 | 328 | **−36** |
| Tracked binary/generated bytes removed | — | — | **−1,208,127 B (~1.15 MB)** |
| Lint problems | 3 errors + 1 warning | **0 + 0** | **−4** |
| Type-check errors | 3 | **0** | **−3** |
| Production build | **FAILING** | **PASSING** | unblocked |

**Client bundle size: no delta claimed.** Next 16 + Turbopack does not print First Load JS in this
build output, and no before/after measurement was taken. A change is not expected regardless: the
four removed packages had **zero imports**, so they were never in the client bundle (already
tree-shaken), and `public/` assets are served, not bundled. Current `.next/static` is 1.9 MB.
The gains above are to repo size, install size, and maintainability — not to shipped JS.

Production optimisation posture (verified, unchanged): Next.js applies minification, tree shaking,
code splitting and static prerendering; all 11 routes are `○ (Static)`.

---

## 9. Remaining recommendations (higher-risk — intentionally not implemented)

1. **The legacy space-tour overlay is dead at runtime — decide its fate.** `public/site.js:460`
   appends `<aside class="space-tour-overlay">` to `document.body`, but React removes it during
   hydration, so the feature **never renders** (confirmed at baseline, pre-existing). Either mount it
   through React, or delete the ~200 lines of tour code from `site.js` **and** its CSS together.
   Until then the CSS must stay — the `body.space-tour-active` rules genuinely style the Flux theme.

2. **Then remove v2-only CSS.** Once the above is settled, these selectors in `globals.css` are used
   by nothing (they belonged to the deleted React tree): `space-tour-takeover`, `-takeover-active`,
   `-panel`, `-stage`, `-canvas`, `-warp`, `-vignette`, `-scanlines`, `-label-tl`, `-label-tr`,
   `-vrail`, `-vrail-fill`, `-bgnum`, `-stepper`, `-content-card`, `-copy-grid`, `-title`, `-body`,
   `-body-col`, `-tags-row`, `-link`, `-manifest`, `-manifest-index`, `-manifest-label`,
   `-manifest-text`, `-exit`, `-scroll`, `-spacer`, `-scrollhint`, `-kicker-text`, plus the dead
   `.space-tour-trigger`. **Do not** touch `-overlay`, `-head`, `-copy`, `-kicker`, `-tags`,
   `-actions`, `-system`, `-rail`, or `body.space-tour-active` — those are the live v1 set.

3. **Resolve the duplicated static site.** Root `*.html` + `assets/` are byte-identical to
   `legacy-static-site/` (8 of 9 files). Keep one copy. Root is the one `.local-static-server.cjs`
   serves.

4. **Confirm the 10 unreferenced `image N.png` files** (~700 KB) are still needed; delete if the
   work they were staged for has landed elsewhere.

5. **Drop npm `three` from the client bundle.** `ThreeGlobalBridge` bundles the whole `three`
   package purely to assign `window.THREE` for `site.js`. Loading it via `<script>` alongside the
   other vendored libs would remove it from the bundle entirely. This is an architectural change and
   was **not** performed. (`public/vendor/three.min.js` is recoverable: `git show 2e744f1^:public/vendor/three.min.js`.)

6. **Optimise two oversized images:** `praverse-robotic-ai-hero.png` (2.02 MB) and
   `praverse-frontier-lab.png` (1.85 MB) are both live and shipped uncompressed. Converting to
   WebP/AVIF would be the single largest real user-facing performance win available here.

7. **`next-env.d.ts` churns** between `./.next/dev/types/routes.d.ts` and `./.next/types/routes.d.ts`
   depending on whether `next dev` or `next build` ran last. It was reverted to its committed state
   to keep this diff clean, but it will keep producing noise.

---

## 10. Diff review checklist

- [x] Every changed file reviewed line by line.
- [x] No unrelated business logic changed (`next-env.d.ts` build churn explicitly reverted).
- [x] No secrets introduced; no environment values hardcoded.
- [x] No public API removed — no API routes, server actions or package exports exist in this repo.
- [x] No test deleted (no test suite exists).
- [x] No database migration touched (none exist).
- [x] No security, privacy, compliance, audit or traceability control weakened — none present; auth,
      validation, rate limiting, CSRF/CORS and logging are absent from this static marketing site.
- [x] Generated/vendor files not hand-edited (lockfile changed only via npm; `site.js` and the
      remaining `vendor/*.min.js` untouched).
- [x] Formatting changes do not hide functional changes (one de-indent, in `app/layout.tsx`).
- [x] No pagination/virtualisation/streaming/export logic existed to preserve; no content caps,
      truncation or row limits were introduced.

---

## 11. Second pass — clearing the "manual review" backlog

Pass 1 deliberately preserved everything whose use could not be disproven. On review, the
owner authorised removing all of it. This pass also audited `app/globals.css`, which pass 1
never analysed.

### 11.1 What was removed

| Item | Size / scale | Evidence |
|---|---|---|
| `app/globals.css` dead selectors | **1,311 → 1,105 lines** (120 rules, 109 distinct selectors, 5 empty `@media`) | Orphaned by pass 1's deletion of the React space-tour, plus pre-existing leftovers. |
| `Space Tour v2 Standalone.html` | 764 KB | **Generated artifact.** Decompressed it: a `dc-runtime` bundle of 18 gzip+base64 assets — its own copies of three.js (654 KB), GSAP 3.12.5 and ~10 woff2 fonts. Its runtime header reads *"GENERATED from dc-runtime/src/*.ts — do not edit."* Not source, never served. |
| `legacy-static-site/` (13 files) | 172 KB | 8 of 9 HTML files byte-identical to the root copies; nothing serves it (`.local-static-server.cjs` serves the **root**). |
| `public/images/image 1..6,8,9.png` + `image7.png` (9 files) | ~600 KB | Zero references in source, CSS, HTML — including the standalone bundle, which embeds its own assets. |

Dead CSS families removed: the space-tour **v2** set (`-takeover`, `-panel`, `-stage`, `-canvas`,
`-warp`, `-vignette`, `-scanlines`, `-label-tl/tr`, `-vrail`, `-bgnum`, `-stepper`, `-content-card`,
`-copy-grid`, `-title`, `-body`, `-body-col`, `-tags-row`, `-link`, `-manifest*`, `-exit`, `-scroll`,
`-spacer`, `-scrollhint`, `-kicker-text`, `-trigger`); the 15 `st-*` / `stp-*` HUD classes
(`st-radar`, `st-hud-num`, `st-progress`, …); `case-card` / `case-grid` / `case-metrics` / `metric`;
`photonics-product-grid` and the **empty rule** `.photonics-product-cell{}`; `menu-lines`; `orb-ic`.

`.case-grid` was **rewritten** rather than dropped — it was one selector in a live comma list
(`.cap-grid,.cap-grid.two,…`), so only that selector was removed.

### 11.2 Near-miss: dynamically constructed class names

The static audit flagged `tto-enter` / `tto-hold` / `tto-exit` as unused. **They are live.**
`ThemeTransitionOverlay.jsx:32` builds them by interpolation:

```jsx
className={`tto-root tto-${info.phase} ${isNoir ? "tto-noir" : "tto-flux"}`}
```

`info.phase` is `enter|hold|exit`, so the literals never appear in source and any
`grep`-style audit calls them dead. Removing them would have broken the theme-transition
animation. They were whitelisted, and the surviving `tto-*` rules verified **byte-identical**
to the original. **Any future CSS purge of this repo must whitelist them.**

This is the same class of trap as the space-tour CSS in §4: the repo has two independent
mechanisms (React and the vanilla `public/site.js`) writing classes onto the same DOM.

### 11.3 Tooling note — why a hand-rolled purge was abandoned

A bespoke line-based cutter was written, then discarded after verification caught four
successive defects it introduced: it corrupted the 58 multi-line rules (unbalanced braces),
parsed comma-containing section-header **comments** as selectors, duplicated comment blocks,
and mis-reconstructed `@media` bodies. Each was caught before it shipped; none reached a commit.

The purge was redone with **postcss** (already a devDependency), which parses properly and
re-parses its own output to prove validity. Verification: braces balanced 703/703, postcss
re-parse valid, no duplicated content, every live selector retained. The one formatting change
is the rewritten `.cap-grid` rule, collapsed from multi-line to a single line by postcss.

### 11.4 Verification (pass 2)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS (0) |
| `npm run lint` | PASS (0) |
| `npx next build` | PASS — 11/11 routes prerendered |
| Theme transition | `tto-enter` → `tto-hold` → `tto-exit` all mount; FLUX label renders; `.tto-top` computes to identity transform, proving `.tto-enter .tto-top` applies (base is `translateY(-102%)`) |
| Flux theme (preserved v1 CSS) | `body.space-tour-active` applied; `#webgl` → `z-index:1`, `opacity:0.95` — unchanged from baseline |
| Routes | 9/9 → 200; zero failed resources |
| Engine | THREE r160, gsap, ScrollTrigger, Lenis all live; 9 homepage sections |

### 11.5 Net result across both passes

| Metric | Before pass 1 | After pass 2 |
|---|---|---|
| Tracked files | 110 | **66** |
| `app/globals.css` | 1,311 lines | **1,105 lines** |
| Runtime dependencies | 12 | **8** |
| `node_modules` | 642 MB | **510 MB** |
| Production build | **FAILING** | **PASSING** |

### 11.6 Still outstanding

- **The legacy space-tour overlay still never renders** (§9 item 1) — `site.js:460` appends it to
  `<body>`; React strips it during hydration. Its CSS is therefore retained.
- Root `*.html` + `assets/` (~200 KB) are kept: `.local-static-server.cjs` serves them as a local
  preview of the pre-Next design.
- `DEFAULT_WAYPOINTS` (`SatelliteParallax.jsx`) is exported but only used as a default parameter in
  its own file. Retained — it is a defensible configuration point for the component.
- The 6 photonics images use raw `<img>` inside `StaticPageContent` HTML, so they bypass
  `next/image` and ship unoptimised on any host. The two large hero PNGs **do** go through
  `next/image`, so Vercel would optimise those automatically — this supersedes §9 item 6.
