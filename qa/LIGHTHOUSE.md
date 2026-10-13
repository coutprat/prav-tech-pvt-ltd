# Lighthouse

Generated: 2026-10-13T17:14:42.111Z

Budgets (mobile, 4G): **LCP < 2.5 s · CLS < 0.1**.

There is no JS cap: the direction is quality first, with heavy code loaded
after first paint and only where it is used. JS is reported to keep it
visible, not as a pass/fail.

| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
|---|---|---|---|---|---|---|---|---|---|
| home | desktop | 100 | 100 | 100 | 100 | 0.60 s ✅ | 0.000 ✅ | 0 ms | 569 KB |
| mennie | desktop | 100 | 100 | 100 | 100 | 0.65 s ✅ | 0.000 ✅ | 0 ms | 839 KB |
| photonics | desktop | 100 | 100 | 100 | 100 | 0.62 s ✅ | 0.000 ✅ | 0 ms | 569 KB |
| company | mobile | 95 | 98 | 100 | 100 | 2.92 s ❌ | 0.000 ✅ | 9 ms | 225 KB |
| enterprise-ai | mobile | 96 | 100 | 100 | 100 | 2.67 s ❌ | 0.000 ✅ | 80 ms | 221 KB |
| home | mobile | 96 | 100 | 100 | 100 | 2.78 s ❌ | 0.000 ✅ | 21 ms | 215 KB |
| mennie | mobile | 92 | 100 | 100 | 100 | 3.01 s ❌ | 0.000 ✅ | 185 ms | 499 KB |
| pharma | mobile | 97 | 100 | 100 | 100 | 2.61 s ❌ | 0.000 ✅ | 3 ms | 223 KB |
| photonics | mobile | 94 | 100 | 100 | 100 | 3.06 s ❌ | 0.000 ✅ | 55 ms | 523 KB |

JS is the transferred (compressed) size of all JavaScript requests on the
page. The 3D pages carry three.js (~267 KB), which is loaded on scroll
intent, never during first paint.

The mobile preset simulates slow 4G with a 4x CPU throttle. Speed Index
(how fast the page is *visually* complete) stays around 1.0 s on mobile
even where LCP reads 2.6-3.2 s, and desktop LCP is under 0.7 s.
