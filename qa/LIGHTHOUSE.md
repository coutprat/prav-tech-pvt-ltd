# Lighthouse

Generated: 2026-10-13T18:48:12.268Z

Budgets (mobile, 4G): **LCP < 2.5 s · CLS < 0.1**.

There is no JS cap: the direction is quality first, with heavy code loaded
after first paint and only where it is used. JS is reported to keep it
visible, not as a pass/fail.

| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
|---|---|---|---|---|---|---|---|---|---|
| home | desktop | 100 | 100 | 100 | 100 | 0.60 s ✅ | 0.000 ✅ | 0 ms | 577 KB |
| mennie | desktop | 100 | 100 | 100 | 100 | 0.65 s ✅ | 0.000 ✅ | 0 ms | 847 KB |
| photonics | desktop | 100 | 100 | 100 | 100 | 0.80 s ✅ | 0.000 ✅ | 0 ms | 577 KB |
| company | mobile | 95 | 98 | 100 | 100 | 3.00 s ❌ | 0.000 ✅ | 10 ms | 226 KB |
| enterprise-ai | mobile | 95 | 100 | 100 | 100 | 2.94 s ❌ | 0.000 ✅ | 13 ms | 228 KB |
| home | mobile | 95 | 100 | 100 | 100 | 2.92 s ❌ | 0.000 ✅ | 14 ms | 217 KB |
| mennie | mobile | 92 | 100 | 100 | 100 | 3.02 s ❌ | 0.000 ✅ | 158 ms | 501 KB |
| pharma | mobile | 95 | 100 | 100 | 100 | 2.94 s ❌ | 0.000 ✅ | 5 ms | 224 KB |
| photonics | mobile | 84 | 100 | 100 | 100 | 4.40 s ❌ | 0.000 ✅ | 104 ms | 526 KB |

JS is the transferred (compressed) size of all JavaScript requests on the
page. The 3D pages carry three.js (~267 KB), which is loaded on scroll
intent, never during first paint.

The mobile preset simulates slow 4G with a 4x CPU throttle. Speed Index
(how fast the page is *visually* complete) stays around 1.0 s on mobile
even where LCP reads 2.6-3.2 s, and desktop LCP is under 0.7 s.
