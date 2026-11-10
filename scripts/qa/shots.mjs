/**
 * Desktop and mobile screenshots of every route.
 *
 *   node scripts/qa/shots.mjs                 # all routes, viewport + full page
 *   ROUTES=/,/pharma node scripts/qa/shots.mjs
 *   OUT=qa/shots-hero FULL=0 node scripts/qa/shots.mjs
 *
 * Headless Chromium renders WebGL in software, which the site correctly
 * treats as "no GPU" and serves the SVG figure. ?gpu=1 forces the 3D scene so
 * the shots show what a visitor with a graphics card sees.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "qa/shots";
const FULL = process.env.FULL !== "0";
const ROUTES = (
  process.env.ROUTES ??
  "/,/enterprise-ai,/pharma,/mennie,/photonics,/sovereign-ai-data-centres,/company,/careers,/contact,/start-a-project,/trust,/privacy,/terms"
).split(",");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true }
];

await mkdir(OUT, { recursive: true });
// GPU=1 asks headless Chromium for the real graphics card (D3D11 on
// Windows); otherwise WebGL runs on SwiftShader.
const browser = await chromium.launch({
  args:
    process.env.GPU === "1"
      ? ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"]
      : ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile
  });
  // Skip the opening curtain so every shot is of the page itself.
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("praverse-welcomed", "1");
    } catch {}
  });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    const url = `${BASE}${route}${route.includes("?") ? "&" : "?"}gpu=1`;
    await page.goto(url, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${OUT}/${slug}-${vp.name}.png` });
    if (FULL) {
      // Walk the page so scroll-triggered reveals have fired, then return.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += vp.height * 0.8) {
        await page.evaluate((t) => window.scrollTo(0, t), y);
        await page.waitForTimeout(140);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${slug}-${vp.name}-full.png`, fullPage: true });
    }
    console.log("shot", slug, vp.name);
  }
  await ctx.close();
}
await browser.close();
