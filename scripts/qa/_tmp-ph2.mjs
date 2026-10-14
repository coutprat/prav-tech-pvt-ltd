import { chromium } from "playwright";
const b = await chromium.launch();
for (const base of ["https://www.praversetech.com", "http://localhost:3000"]) {
  const ctx = await b.newContext({ viewport: { width: 1920, height: 950 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
  await p.goto(base + "/photonics", { waitUntil: "load", timeout: 60000 });
  await p.waitForTimeout(2500);

  let brokeAt = null;
  for (let i = 1; i <= 30; i += 1) {
    await p.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * f), i / 30);
    await p.waitForTimeout(500);
    if (!brokeAt && (await p.locator("text=This page failed to load").count())) brokeAt = i / 30;
  }
  await p.waitForTimeout(2000);
  const broke = await p.locator("text=This page failed to load").count();
  console.log(`\n### ${base}  errorBoundary=${broke ? "YES at " + Math.round((brokeAt ?? 1) * 100) + "% scroll" : "no"}`);
  for (const e of [...new Set(errs)].slice(0, 10)) console.log("   " + e.slice(0, 260));
  await ctx.close();
}
await b.close();
