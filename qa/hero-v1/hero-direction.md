# Hero direction — first pass (ultra-premium-2026)

Screenshots: `hero-v1/home-desktop.png`, `hero-v1/home-mobile.png` (this folder).

## What replaces the cube
**A dispersion prism.** One beam of white light — the single engineering practice —
enters a glass prism and leaves as four coloured beams, one per business line:
amber Photonics & AI data centres, emerald Pharma & regulatory AI, sky Healthcare AI
(MENNIE), violet Enterprise AI & agents. Data packets travel along every beam.

Why this one:
- It is a real mechanism (dispersion), drawn honestly: longer wavelengths bend
  least, so amber leaves at the top and violet at the bottom; the rising beam is
  bent toward the prism's base as a real prism does.
- It is native to photonics (the company literally sells light) and states the
  company structure — one core, four disciplines — without a word.
- Each beam ends at a real link to its page. Hover a label and its beam brightens
  while the others dim.

Alternatives considered and rejected: neural-network particle brain (generic, says
nothing), DNA helix (pharma only), globe/fibre map (needs an official India boundary),
a nicer cube/module (the founder asked for it gone).

## Performance / degradation
- Fully procedural three.js: one extruded triangle with a fresnel shader, additive
  quads for beams, a point cloud. No postprocessing, no models, no textures. All
  animation in shaders; CPU only updates uniforms + four label positions.
- Fetched only after page load + idle, never in the LCP path. Server HTML paints an
  SVG version of the same figure from the same layout function.
- SVG stays on screen for reduced motion, software-rendered WebGL (no GPU), and
  low-memory devices. Phones get a lighter scene (DPR ≤1.25, fewer particles).
- Render loop stops when the hero is off screen or the tab is hidden.

## Still to do
Every page, nav/footer, new section kit, copy. Background videos stay exactly as they are.
