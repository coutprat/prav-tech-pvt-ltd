/**
 * Dark theme smoke test.
 *
 * Dark was authored for this redesign rather than specified, so it is worth
 * confirming the pre-paint script applies it, the tokens actually swap, and
 * the page renders without contrast regressions.
 *
 *   node scripts/qa/theme-check.mjs
 */

import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = [
  ["home", "/"],
  ["company", "/company"],
  ["photonics", "/photonics"],
  ["pharma", "/pharma"]
];

await mkdir("qa/dark", { recursive: true });
const browser = await chromium.launch();
let total = 0;

for (const [name, route] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Seed the preference, then reload so the pre-paint script picks it up.
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("praverse-theme", "dark"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme")
  );
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  total += results.violations.length;

  await page.screenshot({ path: `qa/dark/${name}.png`, fullPage: false });
  console.log(
    `${name.padEnd(10)} data-theme=${theme} bg=${bg} axe=${results.violations.length}`
  );
  for (const v of results.violations) console.log(`   ${v.id} (${v.impact})`);

  await ctx.close();
}

await browser.close();
console.log(`\ndark-mode axe violations: ${total}`);
