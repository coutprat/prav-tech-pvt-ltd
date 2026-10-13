/**
 * Asserts that no page can be scrolled sideways on a phone.
 *
 * Screenshots never catch this: a page that scrolls horizontally still renders
 * correctly at scroll position 0, so every shot in the QA matrix looks fine
 * while the real page slides around under the reader's thumb.
 *
 * The test is deliberately "can the *page* actually scroll", not "is any box
 * wider than the viewport". A table inside its own overflow-x container is
 * supposed to be wider than the viewport - that is the container doing its
 * job - so measuring box widths reports false positives on correct markup.
 *
 *   node scripts/qa/overflow-check.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const WIDTHS = [360, 390, 420, 768];
const PATHS = [
  "/",
  "/company",
  "/photonics",
  "/pharma",
  "/enterprise-ai",
  "/mennie",
  "/contact",
  "/careers",
  "/research",
  "/start-a-project",
  "/privacy",
  "/terms"
];

const browser = await chromium.launch();
let failures = 0;

for (const width of WIDTHS) {
  for (const path of PATHS) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      window.scrollTo(99999, 0);
      const x = window.scrollX;
      window.scrollTo(0, 0);
      if (!x) return null;
      // Name the widest thing that is not inside its own scroll container, so
      // the failure points at the element to fix rather than just a number.
      const docWidth = document.documentElement.clientWidth;
      let worst = null;
      for (const el of document.querySelectorAll("body *")) {
        let a = el.parentElement;
        let scrolls = false;
        while (a && a !== document.body) {
          if (getComputedStyle(a).overflowX !== "visible") {
            scrolls = true;
            break;
          }
          a = a.parentElement;
        }
        if (scrolls) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.right > docWidth + 1) {
          if (!worst || r.right > worst.right) {
            worst = {
              right: Math.round(r.right),
              name: `${el.tagName.toLowerCase()}.${String(el.className ?? "").split(" ")[0]}`
            };
          }
        }
      }
      return { x, worst };
    });

    if (result) {
      failures += 1;
      const who = result.worst ? ` — widest: ${result.worst.name} right=${result.worst.right}` : "";
      console.error(`FAIL ${String(width).padStart(4)}px ${path} scrolls ${result.x}px sideways${who}`);
    }
    await context.close();
  }
}

await browser.close();

if (failures) {
  console.error(`\n${failures} page/width combinations scroll sideways`);
  process.exit(1);
}
console.log(`no horizontal page scroll across ${PATHS.length} pages x ${WIDTHS.join("/")}px`);
