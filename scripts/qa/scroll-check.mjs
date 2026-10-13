/**
 * Viewport screenshots at several scroll depths.
 *
 * Full-page screenshots are misleading for pinned sections: the pin spacer
 * captures as a tall blank band because the canvas is fixed while pinned.
 * This walks the page instead and shoots what a visitor actually sees.
 *
 *   node scripts/qa/scroll-check.mjs [slug] [path]
 */

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const slug = process.argv[2] ?? "home";
const route = process.argv[3] ?? "/";
const STEPS = Number(process.env.STEPS ?? 8);
const OUT = "qa/scroll";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mkdir(OUT, { recursive: true });

await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const height = await page.evaluate(() => document.body.scrollHeight);

for (let i = 0; i < STEPS; i++) {
  const y = Math.round((height - 900) * (i / (STEPS - 1)));
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  // Lenis + ScrollTrigger scrub need a beat to catch up and redraw the canvas.
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${slug}-${String(i).padStart(2, "0")}.png` });
}

console.log(`${slug}: ${STEPS} viewport shots, page height ${height}px`);
await browser.close();
