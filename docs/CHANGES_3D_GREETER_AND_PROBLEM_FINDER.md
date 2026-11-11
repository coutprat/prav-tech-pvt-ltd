# Change notes: 3D greeter, problem finder, proof section

Branch: `3d-greeter-problem-finder` (cut from `main` at `b371b9d`)
Date: 11 November 2026
Status: not merged. Vercel deploys `main`, so the live site is unchanged until this branch is merged.

This file is for whoever (person or AI assistant) picks this work up next. It says what changed, why, where the code is, and what is still open.

## Summary

| Area | What changed |
|---|---|
| Opening screen | A 3D android bust greets first-time visitors for about 3 seconds |
| Home page | New "What is the problem on your desk?" section |
| Home page | New "Already working with global and Indian pharmaceutical companies" section |
| Every page with a CTA band | 3D closing figure: four beams converge in a gem |
| Site-wide | More space between sections; six wording fixes |
| Forms | "Government / public sector" option added |

## 1. Opening screen with the 3D greeter

**Files**
- `components/layout/Welcome.tsx` — markup and the inline `welcomeScript`
- `components/layout/WelcomeBot.tsx` — client loader for the 3D scene (new)
- `components/three/GreeterScene.tsx` — the android itself (new)
- `app/globals.css` — section "OPENING CURTAIN" (`.welcome`, `.welcome-stage`, `.welcome-hello`)

**Behaviour**
- Shown on a first visit only (`localStorage` key `praverse-welcomed`). Never shown under reduced motion.
- The curtain waits for the greeter's first frame (up to `WAIT` = 4200 ms), shows it for `SHOW` = 3000 ms, and is never up longer than `HARD` = 6500 ms.
- Devices that fail `useGpuScene()` get the logo for `FALLBACK` = 1300 ms instead.
- Any pointerdown, keydown, wheel or touchstart lifts it at once.
- Lifting is two steps: `<html data-welcome-out>` starts the fade, `<html data-welcomed>` removes the curtain. A delayed CSS animation (7 s) lifts it with no JavaScript at all.
- `window.__pvWelcome.show()` / `.skip()` is how `WelcomeBot` reports to the inline script.

**The android**
- Fully procedural: no model file, texture or HDR download. The head is a sphere reshaped by `helmet()`; reflections come from drei `Environment` + `Lightformer` panels.
- "Alive" behaviour lives in one `useFrame`: eyes lead and the head follows, irregular gaze jumps, uneven blinking, iris focus, breathing, a head tilt and one nod on first contact.
- The four collar lights use the four business-line colours; the chest triangle is the hero prism.

**To test:** clear `praverse-welcomed` from localStorage (or use a private window) and reload.

## 2. Problem finder (home)

**Files**
- `components/pv/ProblemFinder.tsx` (new, client component)
- `app/page.tsx` — the `PROBLEMS` array and the `<Section id="problem">` block
- `app/premium-kit.css` — classes prefixed `pq-` (note: `pf-` is already used in `premium.css`, do not reuse it)

**Behaviour**
- Seven problems in the visitor's words. Hover, click or arrow keys select one; the panel shows what would be built, what the visitor holds first, and (for pharma only) who Praverse already works with.
- "Start with this problem" links to `/start-a-project?topic=<topic>&note=<problem>`, which `EnquiryForm` already uses to prefill the form.
- All answer copy is taken from existing site copy (`content/offers.ts`, line descriptions, `company.promise`). No new claims.

## 3. Proof section (home)

- In `app/page.tsx`, shown only while `getVerifyItem("pharma-engagements").confirmed` is true.
- Three engagements, described and never named: a US-headquartered global generics manufacturer, two Indian pharmaceutical groups, and an FDA 483 intelligence platform built under contract for a pharma regulatory-technology company.
- **Rule from the founder: no client or company names anywhere on the site.** Add further engagements only as descriptions, and record them in `content/verify.ts` first.

## 4. 3D closing figure on the CTA band

**Files**
- `components/three/ConvergeScene.tsx` (new)
- `components/pv/CtaScene.tsx` (new, client loader)
- `components/pv/kit.tsx` — `CtaBand` now renders `<CtaScene />`
- `app/premium-kit.css` — `.pv-cta-scene`

Same loading contract as the hero prism: `useGpuScene()` gate, bare `import()` once the band is within 900px of the viewport, renders only while on screen and the tab is visible, never under reduced motion.

## 5. Spacing and wording

- `app/premium-kit.css` (end of file, "breathing room"): `--sec` raised to `clamp(104px, 13vw, 208px)`, more space under `.pv-head`, `.pv-lede` line-height 1.66.
- Wording:
  - `app/page.tsx`, `app/government/page.tsx`: "all five lines" → "every line we run" (the home page says four disciplines).
  - `app/government/page.tsx`: removed a repeated sentence.
  - `app/sovereign-ai-data-centres/page.tsx`: replaced the "Indian flag on a slide" opener.
  - `app/company/page.tsx`: "One office, on your clock" → "One office, one team", with IST stated.
  - `app/photonics/page.tsx`, `lib/answers.ts`: "India's partner for…" → "an India-based partner for…".
- `app/contact/page.tsx`, `app/start-a-project/page.tsx`: added the "Government / public sector" option.

## Verification done

- `npx tsc --noEmit` and `npm run lint` pass.
- Seen in a local browser at 1440×900: the greeter, the backdrop, the curtain lifting, the problem finder, the proof section, the CTA figure.
- Seen at 375×812: the problem finder (no horizontal scroll).
- **Not confirmed at phone size:** the 3D greeter and the CTA figure. Check both on a real phone before merging.
- `npm run build` was not run.

## Open items (need the founder)

1. One-line, name-free descriptions of large engagements outside pharma, if any, for the proof section.
2. Procurement registrations (Udyam, DPIIT, GeM, PAN) — pages exist but stay hidden until confirmed in `content/verify.ts`.
3. A downloadable capability statement, engagement and pricing signals, NDA / IP terms, team profiles.
4. Two claims to check: "designed in and qualified in India" (marked unconfirmed in `content/verify.ts`), and MENNIE's status ("launching soon" vs "private beta").

## Conventions to keep

- No invented clients, numbers or certifications. Unconfirmed facts are gated in `content/verify.ts`.
- 3D scenes are procedural, gated by `useGpuScene()`, loaded with a bare `import()`, and paused off screen.
- Dev preview note: some embedded preview panes pause `requestAnimationFrame` unless the tab is in front, which makes canvases look blank in screenshots.
