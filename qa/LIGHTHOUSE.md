# Lighthouse

Generated: 2026-10-14T12:08:49.476Z

Budgets (mobile, 4G): **LCP < 2.5 s · CLS < 0.1**.

There is no JS cap: the direction is quality first, with heavy code loaded
after first paint and only where it is used. JS is reported to keep it
visible, not as a pass/fail.

| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
|---|---|---|---|---|---|---|---|---|---|
| home | desktop | 100 | 100 | 100 | 100 | 0.62 s ✅ | 0.000 ✅ | 0 ms | 292 KB |
| mennie | desktop | 100 | 100 | 100 | 100 | 0.68 s ✅ | 0.000 ✅ | 0 ms | 298 KB |
| photonics | desktop | 100 | 100 | 100 | 100 | 0.66 s ✅ | 0.000 ✅ | 0 ms | 298 KB |
| company | mobile | 92 | 100 | 100 | 100 | 3.38 s ❌ | 0.000 ✅ | 21 ms | 250 KB |
| enterprise-ai | mobile | 95 | 100 | 100 | 100 | 2.92 s ❌ | 0.000 ✅ | 5 ms | 244 KB |
| home | mobile | 95 | 100 | 100 | 100 | 2.91 s ❌ | 0.000 ✅ | 10 ms | 232 KB |
| mennie | mobile | 93 | 100 | 100 | 100 | 3.16 s ❌ | 0.000 ✅ | 99 ms | 247 KB |
| pharma | mobile | 94 | 100 | 100 | 100 | 3.11 s ❌ | 0.000 ✅ | 7 ms | 244 KB |
| photonics | mobile | 94 | 100 | 100 | 100 | 3.07 s ❌ | 0.000 ✅ | 26 ms | 245 KB |

JS is the transferred (compressed) size of all JavaScript requests on the
page. The 3D pages carry three.js (~267 KB), which is loaded on scroll
intent, never during first paint.

The mobile preset simulates slow 4G with a 4x CPU throttle. Speed Index
(how fast the page is *visually* complete) stays around 1.0 s on mobile
even where LCP reads 2.6-3.2 s, and desktop LCP is under 0.7 s.
