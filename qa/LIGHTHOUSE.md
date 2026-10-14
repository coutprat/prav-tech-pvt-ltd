# Lighthouse

Generated: 2026-10-14T13:25:34.106Z

Budgets (mobile, 4G): **LCP < 2.5 s · CLS < 0.1**.

There is no JS cap: the direction is quality first, with heavy code loaded
after first paint and only where it is used. JS is reported to keep it
visible, not as a pass/fail.

| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
|---|---|---|---|---|---|---|---|---|---|
| home | desktop | 100 | 100 | 100 | 100 | 0.62 s ✅ | 0.000 ✅ | 0 ms | 290 KB |
| mennie | desktop | 100 | 100 | 100 | 100 | 0.65 s ✅ | 0.000 ✅ | 0 ms | 295 KB |
| photonics | desktop | 100 | 100 | 100 | 100 | 0.66 s ✅ | 0.000 ✅ | 0 ms | 295 KB |
| company | mobile | 93 | 100 | 100 | 100 | 3.27 s ❌ | 0.000 ✅ | 44 ms | 247 KB |
| enterprise-ai | mobile | 95 | 100 | 100 | 100 | 2.94 s ❌ | 0.000 ✅ | 14 ms | 240 KB |
| home | mobile | 95 | 100 | 100 | 100 | 2.92 s ❌ | 0.000 ✅ | 11 ms | 229 KB |
| mennie | mobile | 93 | 100 | 100 | 100 | 3.10 s ❌ | 0.000 ✅ | 66 ms | 243 KB |
| pharma | mobile | 94 | 100 | 100 | 100 | 3.08 s ❌ | 0.000 ✅ | 10 ms | 240 KB |
| photonics | mobile | 94 | 100 | 100 | 100 | 3.07 s ❌ | 0.000 ✅ | 25 ms | 242 KB |

JS is the transferred (compressed) size of all JavaScript requests on the
page. The 3D pages carry three.js (~267 KB), which is loaded on scroll
intent, never during first paint.

The mobile preset simulates slow 4G with a 4x CPU throttle. Speed Index
(how fast the page is *visually* complete) stays around 1.0 s on mobile
even where LCP reads 2.6-3.2 s, and desktop LCP is under 0.7 s.
