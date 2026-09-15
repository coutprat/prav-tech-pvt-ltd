# CPHI Milan 2026: Website Changes

**Event:** CPHI Milan, 6–8 October 2026, Fiera Milano
**Zone of interest:** AI & Tech ("Where pharma's digital future starts")
**Our role:** Attending as company representatives, meeting exhibitors. Not exhibiting.
**Prepared:** 15 September 2026

---

## The brief, and why it shaped everything

Without a booth, the website is not a stage prop on a large screen with a narrator beside it. It does three different jobs, and all three are unattended and mobile-first:

1. Opened on **our phone, at someone else's stand**, mid-conversation.
2. Looked up **days later** by a person who took a card, on their own device, with nobody there to explain it.
3. Sitting as a link in **every follow-up email** sent after the show.

So the work split in two: give the site something worth reading when a pharma buyer looks us up, and make sure it cannot embarrass us while they do.

---

## Part 1 — Content added to make an impression

### New page: `/cphi`

A dedicated, time-boxed page (`app/cphi/page.tsx`, 128 lines) built from the site's existing component classes so it reads as native. A URL that can be said out loud at a stand and pulled up on a phone.

**Hero:** "Europe is writing the rules for AI in GMP." Plus event facts: Fiera Milano, AI & Tech Zone, 67,000+ attendees, 166+ countries.

#### Section 1: "Four focus areas. We do one of them properly."

CPHI splits the AI & Tech zone into four categories. The page quotes each in CPHI's own wording and states plainly where Praverse sits:

| Position | CPHI category | Our claim |
|---|---|---|
| **Core** | Quality & Compliance | The entire product. FDA 483 drafting, OOS/OOT investigation, CAPA reasoning, ALCOA+ data-integrity review, SOP gap detection, inspection readiness. |
| **Partial** | Digital Transformation | We automate the document-heavy end of quality. We do not run enterprise transformation programmes, and we are not a consultancy. |
| **Adjacent** | Manufacturing Optimisation | We read from MES/LIMS rather than replace them. If you sell MES or LIMS, we are a complement, not a competitor. |
| **Not us** | Commercialisation & Market Intelligence | Not our domain. We would rather say so than pad a capability list. |

**Why this works:** every other vendor in that zone will claim all four. Declining one, and positioning as a complement rather than a competitor to the MES/LIMS vendors we are standing in front of, is the part a quality professional will remember. They have been oversold by all four-category vendors before.

#### Section 2: "Annex 22, and why it does not change our architecture."

The strongest card we had, and the site did not mention it.

The European Commission, the EMA and the PIC/S inspectors working group opened consultation on a new GMP annex for artificial intelligence on **7 July 2025**. It closed that October with roughly **1,300 comments**. A final **Annex 22 is expected before the end of 2026**, which means it lands effectively as the show happens.

The page maps the draft's demands against what we already do:

- **Intended use** must be defined in writing, including which decisions a model may touch.
- **Human oversight**: a model that flags for review is treated differently from one that decides. We only ever do the first.
- **Generative AI**: the draft says generative models and LLMs should not be used in critical GMP applications. Our outputs are drafts prepared for expert review, never autonomous decisions, never the final record.
- **Validation**: predefined metrics, representative test data, explainability, change control, ongoing monitoring.
- **EU AI Act**: separate from GMP, high-risk obligations phase in through August 2026 and August 2027.

**Why this works:** the site was USFDA-centric (21 CFR Part 211, ICH Q9, ICH Q10). In Milan, the European frameworks are the ones in the room. Connecting the existing thesis ("The system drafts. Your team decides.") to the regulation about to arrive turns a philosophical claim into a commercial one.

#### Section 3: "Where we are careful"

An explicit block stating we do **not** claim Annex 22 compliance, because it is still a draft and not final.

**Why this works:** restraint reads as expertise to a regulated-industry buyer. Claiming certification against a document that does not yet exist would be the fastest way to lose a QA director.

#### Section 4: Meet us

Honest framing: attending rather than exhibiting, so no stand number, just a calendar. Direct mail link with a CPHI subject line.

### Supporting changes

- **`app/globals.css`** — 28 `cphi-*` rules, driven entirely by existing design tokens so both light and space themes adapt. Commented as time-boxed.
- **`app/pharma/page.tsx`** — one link line into `/cphi` as the discovery path.

---

## Part 2 — Fixes that protect the impression

Content only matters if the site works when a prospect opens it. Two defects could have cost a conversation.

### Fixed: the contact form could not fail safely

`app/api/send/route.ts` built its mail client at module scope, so a missing `RESEND_API_KEY` threw at import time. It did not merely break the form, it **failed `next build` outright**.

Now the client is constructed inside the request handler behind a guard that logs to the server and returns a 503 telling the visitor to email `inquiry@praversetech.com` directly.

**Verified:** built successfully with `.env.local` removed entirely. Previously a hard failure.

### Fixed: the site could render as a blank white page

`public/site.js` set `<body>` to `opacity: 0` via a `page-enter` class and removed it **only on the window `load` event**. If `load` never fired, the entire site stayed invisible with the full DOM underneath. This was observed rendering completely blank on a real page load.

Now:
- Visibility no longer depends on `load`.
- `requestAnimationFrame` is used only to give the fade-in one painted frame.
- A `setTimeout` backstop clears the class directly at 600ms, independent of rAF.
- `pageshow` covers bfcache restores, closing a separate blank-page route via the browser Back button.

**Verified** under three simultaneous failure conditions: tab hidden, `requestAnimationFrame` not firing, `load` never fired. Page renders.

Cache-buster bumped `site.js?v=7` → `?v=9` in `components/layout/SmoothScrollProvider.tsx`. Without this, browsers and the CDN keep serving the old script and the fix reaches nobody.

---

## Files changed

| File | Status | Purpose |
|---|---|---|
| `app/cphi/page.tsx` | **new** (128 lines) | CPHI page |
| `app/globals.css` | +38 | `cphi-*` styles |
| `app/pharma/page.tsx` | +1 | Link to `/cphi` |
| `app/api/send/route.ts` | +12/−1 | Contact-form guard |
| `public/site.js` | +14/−3 | Blank-page fix |
| `components/layout/SmoothScrollProvider.tsx` | +1/−1 | Cache-buster |
| `.env.example` | **new** | Documents `RESEND_API_KEY` |
| `app/contact/page.tsx` | +1/−1 | Phone placeholder (not CPHI work) |

Build clean, TypeScript clean, ESLint clean at `--max-warnings=0`. No gradient text added. No horizontal overflow at 886px or 375px. Rows collapse to one column on mobile.

---

## Not done

From the nine-finding readiness review, these remain open and affect whether follow-ups convert:

- **Link previews are broken.** `og:image` is `favicon.svg`; social scrapers do not render SVG, so shared links preview blank. `twitter:card` is `summary`. Needs a real 1200×630 PNG.
- **No deployment-stage answer on `/pharma`.** A quality professional's first question is whether this has touched a real GMP environment. Which modules are live, which are pilot, which are roadmap.
- **Gradient text**, 8 instances in `app/globals.css`. The most recognisable AI-vendor visual tell.
- **Form asks for "Subject"** where Company and Role would qualify a lead.
- **Palette** is the category reflex (cyan → blue → violet). Deliberately deferred until after the show.

---

## Before the show

- [ ] **Submit the live contact form and confirm the mail arrives.** The code now fails gracefully, but that does not prove the key in Vercel is valid, that `praversetech.com` is verified in Resend, or that anyone reads `inquiry@praversetech.com`. Untested.
- [ ] Confirm `inquiry@praversetech.com` is monitored. `data/site.ts` advertises `pratham@praversetech.com`; they differ.
- [ ] **Review the Annex 22 section personally.** Sources verified, but this is regulatory copy under our name in front of QA directors.
- [ ] Confirm the ALCOA+ and framework references are ones we can defend if pushed.
- [ ] Commit, push, deploy. **None of this is live until then.**
- [ ] Open the site on a real phone on cellular, not office wifi.
- [ ] Export a one-page PDF of the pharma story to the phone. Hall wifi will fail at some point.

## After the show, 9 October

- [ ] Delete `app/cphi/`
- [ ] Delete the `/* CPHI MILAN 2026 */` block in `app/globals.css`
- [ ] Remove the `/cphi` link line from `app/pharma/page.tsx`

All three are commented for this purpose. A stale "meet us at CPHI" line in November is worse than never having had one.

---

## Sources

- [CPHI Milan AI & Tech zone](https://www.cphi.com/europe/exhibit/new-zones/ai-and-tech/)
- [ECA Academy: EU GMP Annex 22 (Draft 2025)](https://www.gmp-compliance.org/guidelines/gmp-guideline/eu-gmp-annex-22-draft-2025-artificial-intelligence)
- [EMA: Annex 22 multistakeholder workshop](https://www.ema.europa.eu/en/events/good-manufacturing-practice-multistakeholder-workshop-expert-contributions-artificial-intelligence-guidance-development-annex-22)
- [GxP-CC: Implementing AI in GMP, Annex 22 takeaways](https://www.gxp-cc.com/insights/blog/implementing-ai-in-gmp-key-takeaways-from-the-eus-annex-22-guideline/)
