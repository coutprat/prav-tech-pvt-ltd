import { chromium } from "playwright";
const b = await chromium.launch();
for (const base of ["https://www.praversetech.com", "http://localhost:3000"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
  let ok = true;
  try { await p.goto(base + "/photonics", { waitUntil: "load", timeout: 45000 }); }
  catch (e) { ok = false; errs.push("goto: " + e.message); }
  await p.waitForTimeout(6000);
  const broke = await p.locator("text=This page failed to load").count().catch(() => 0);
  console.log(`\n### ${base}  loaded=${ok}  errorBoundary=${broke ? "YES" : "no"}`);
  for (const e of [...new Set(errs)].slice(0, 8)) console.log("   " + e.slice(0, 220));
  await ctx.close();
}
await b.close();
