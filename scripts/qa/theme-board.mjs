/**
 * Builds qa/theme-board.png: every signature surface in light and dark, side
 * by side, at the same scroll position.
 *
 * Light and dark were art-directed separately in Prompt 3 - different Blender
 * light rigs, different paper and ink ramps, accents that read as coloured
 * light rather than coloured paint - and the only way to judge that is to see
 * the pairs together. Flipping a toggle and relying on memory does not catch
 * an accent that has gone muddy on one side.
 *
 *   node scripts/qa/theme-board.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const W = 760;
const H = 460;

/** [label, route, selector-or-scroll] */
const SHOTS = [
  ["Home — hero", "/", { scroll: 0 }],
  ["Home — core, modules lit", "/", { scroll: 3.4 }],
  ["Home — business lines", "/", { sel: ".line-grid" }],
  ["Enterprise AI — the checkpoint", "/enterprise-ai", { sel: ".cp-ui" }],
  ["Pharma — evidence", "/pharma", { sel: ".section-alt .wrap" }],
  ["MENNIE — film", "/mennie", { scroll: 1.4 }],
  ["Photonics — capacity hubs", "/photonics", { sel: ".hubs" }],
  ["Company — footprint", "/company", { sel: ".fp" }],
  ["Contact — form", "/contact", { sel: "form" }]
];

await mkdir("qa", { recursive: true });
const browser = await chromium.launch();

async function shoot(theme, route, where) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    colorScheme: theme
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);

  // The sticky chrome is not what this board is for, and it covers the thing
  // being judged in every single panel.
  await page.addStyleTag({
    content: ".nav, .wa-fab { display: none !important; }"
  });

  // Sequence pages paint black until the first frame has actually decoded, and
  // a 'networkidle' that fired before the fetch started is not good enough.
  await page
    .waitForFunction(() => {
      const img = document.querySelector(".sequence-poster");
      return !img || (img.complete && img.naturalWidth > 0);
    }, { timeout: 15000 })
    .catch(() => {});
  await page.waitForTimeout(600);

  // Headless Chromium composites <canvas> correctly into a fullPage capture but
  // not into a viewport or element one - the canvas comes out solid black while
  // getImageData on the very same element returns the right pixels. Both hero
  // sequences and every scroll animation on this site are canvases, so the board
  // would be a wall of black rectangles. Freezing each canvas into an <img> of
  // its own toDataURL sidesteps the compositor entirely.
  await page.evaluate(() => {
    for (const canvas of document.querySelectorAll("canvas")) {
      let url;
      try {
        url = canvas.toDataURL("image/png");
      } catch {
        continue; // tainted; leave it alone
      }
      const img = new Image();
      img.src = url;
      const cs = getComputedStyle(canvas);
      img.style.cssText = cs.cssText || "";
      img.style.position = cs.position;
      img.style.inset = cs.inset;
      img.style.zIndex = cs.zIndex;
      img.style.width = `${canvas.getBoundingClientRect().width}px`;
      img.style.height = `${canvas.getBoundingClientRect().height}px`;
      img.className = canvas.className;
      canvas.replaceWith(img);
    }
  });
  await page.waitForTimeout(250);

  let buf;
  if (where.sel) {
    const el = page.locator(where.sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    buf = await el.screenshot();
  } else {
    await page.evaluate((f) => window.scrollTo(0, window.innerHeight * f), where.scroll);
    await page.waitForTimeout(900);
    buf = await page.screenshot();
  }
  await ctx.close();
  return buf;
}

const rows = [];
for (const [label, route, where] of SHOTS) {
  process.stdout.write(`  ${label} … `);
  const light = await shoot("light", route, where);
  const dark = await shoot("dark", route, where);
  rows.push({ label, light, dark });
  console.log("ok");
}
await browser.close();

// Compose with a headless page so there is no image library to install.
const b2 = await chromium.launch();
const page = await b2.newPage({ deviceScaleFactor: 1 });
const html = `<!doctype html><meta charset="utf-8">
<style>
  :root { color-scheme: light; }
  body { margin:0; background:#eceef2; font:13px/1.4 ui-sans-serif,system-ui,sans-serif; color:#0b1020; }
  h1 { font-size:20px; margin:0 0 4px; letter-spacing:-.02em; }
  header { padding:26px 28px 18px; }
  header p { margin:0; color:#4a5266; max-width:92ch; }
  .row { padding:10px 28px 22px; }
  .row h2 { font-size:13px; font-weight:500; margin:0 0 8px; color:#4a5266;
            font-family:ui-monospace,monospace; letter-spacing:.06em; text-transform:uppercase; }
  .pair { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  figure { margin:0; }
  figcaption { font-size:11px; color:#4a5266; padding:5px 2px 0;
               font-family:ui-monospace,monospace; letter-spacing:.06em; text-transform:uppercase; }
  img { width:100%; display:block; border-radius:8px; border:1px solid #dadde3; }
</style>
<header>
  <h1>Praverse — light and dark, side by side</h1>
  <p>Each pair is the same surface at the same scroll position, rendered twice.
     Dark is not light with the colours inverted: the Blender scenes use a
     separate light rig, and the accents are tuned to read as coloured light on
     navy rather than coloured paint on paper.</p>
</header>
${rows
  .map(
    (r) => `<div class="row"><h2>${r.label}</h2><div class="pair">
      <figure><img src="data:image/png;base64,${r.light.toString("base64")}"><figcaption>Light</figcaption></figure>
      <figure><img src="data:image/png;base64,${r.dark.toString("base64")}"><figcaption>Dark</figcaption></figure>
    </div></div>`
  )
  .join("\n")}`;
await page.setContent(html);
await page.setViewportSize({ width: 1680, height: 900 });
const out = await page.screenshot({ fullPage: true });
await writeFile("qa/theme-board.png", out);
await b2.close();
console.log(`\nqa/theme-board.png — ${rows.length} pairs, ${(out.length / 1024 / 1024).toFixed(1)} MB`);
