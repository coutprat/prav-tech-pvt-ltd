/**
 * Scroll performance trace.
 *
 *   node scripts/qa/scroll-perf.mjs [slug] [route] [cpuThrottle]
 *   node scripts/qa/scroll-perf.mjs photonics /photonics 4
 *
 * Drives a scripted scroll through a pinned hero with CDP tracing on, then
 * reports frame cadence and the longest main-thread tasks.
 *
 * Measures before guessing: "the dots lag" can mean dropped frames or the
 * overlay trailing the rendered frame, and the fix is different for each.
 */

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const slug = process.argv[2] ?? "photonics";
const route = process.argv[3] ?? "/photonics";
const throttle = Number(process.argv[4] ?? 1);
const OUT = "qa/perf";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const client = await context.newCDPSession(page);

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(3500);

if (throttle > 1) {
  await client.send("Emulation.setCPUThrottlingRate", { rate: throttle });
}

// Collect frame timings from inside the page: rAF deltas are what a visitor
// actually feels, and they survive CPU throttling honestly.
await page.evaluate(() => {
  const w = window;
  w.__frames = [];
  let last = performance.now();
  const tick = (now) => {
    w.__frames.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

await client.send("Tracing.start", {
  categories: "devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline",
  transferMode: "ReturnAsStream"
});

// Scripted scroll through the pinned hero: many small steps, like a trackpad.
const height = await page.evaluate(() => document.body.scrollHeight);
const target = Math.min(height - 900, 5200);
const STEPS = 120;
for (let i = 0; i <= STEPS; i++) {
  const y = Math.round((target * i) / STEPS);
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await page.waitForTimeout(16);
}

const traceDone = new Promise((resolve) => client.once("Tracing.tracingComplete", resolve));
await client.send("Tracing.end");
await traceDone;

const frames = await page.evaluate(() => {
  return window.__frames.slice(5);
});

const sorted = [...frames].sort((a, b) => a - b);
const pct = (p) => sorted[Math.floor(sorted.length * p)] ?? 0;
const dropped = frames.filter((f) => f > 20).length;
const bad = frames.filter((f) => f > 34).length;

const result = {
  page: slug,
  cpuThrottle: throttle,
  frames: frames.length,
  medianMs: +pct(0.5).toFixed(2),
  p95Ms: +pct(0.95).toFixed(2),
  worstMs: +Math.max(...frames).toFixed(2),
  over20ms: dropped,
  over34ms: bad,
  droppedPct: +((dropped / frames.length) * 100).toFixed(1),
  estFps: +(1000 / pct(0.5)).toFixed(1)
};

await writeFile(
  `${OUT}/${slug}-cpu${throttle}x.json`,
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log(
  `${slug} @${throttle}x  median ${result.medianMs}ms (${result.estFps}fps)  ` +
    `p95 ${result.p95Ms}ms  worst ${result.worstMs}ms  ` +
    `>20ms ${result.droppedPct}%  >34ms ${bad}`
);

await browser.close();
