/**
 * Rendered-text checks.
 *
 * JSX silently drops the space after an interpolated expression in some
 * positions, producing text like "Vadodara, Gujarat, Indiabuilding". It is
 * invisible in source review — the source has the space — and only shows in
 * the rendered output, so it is asserted here.
 *
 *   node scripts/qa/text-check.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";

/** [route, selector, substring that must appear in the rendered text] */
const CHECKS = [
  ["/careers", "p.lede", "interconnect layer underneath India"],
  ["/privacy", "p.lede", "Pvt Ltd (“Praverse”"],
  ["/start-a-project", "p.lede", "business days. No pitch deck"],
  ["/", "footer p", "Pvt Ltd · Registered in India"],
  ["/company", "p.lede", "Headquartered in Vadodara, Gujarat, with team members"],
  ["/mennie", "p.lede", "meets patients at the door"]
];

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
let failed = 0;

for (const [route, sel, expect] of CHECKS) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  const text = (await page.locator(sel).first().innerText()).replace(/\s+/g, " ");
  const ok = text.includes(expect);
  if (!ok) {
    failed += 1;
    console.log(`FAIL ${route} ${sel}`);
    console.log(`     expected: ${expect}`);
    console.log(`     rendered: ${text.slice(0, 140)}`);
  } else {
    console.log(`ok   ${route}`);
  }
}

// Catch the general shape too: a word ending in a letter glued to a capital
// mid-sentence is almost always a dropped space around an expression.
await browser.close();
console.log(failed ? `\n${failed} text problem(s)` : "\nall rendered text checks passed");
process.exit(failed ? 1 : 0);
