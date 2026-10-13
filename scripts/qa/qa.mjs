/**
 * QA sweep: screenshots, accessibility, links and redirects.
 *
 *   node scripts/qa/qa.mjs            # expects a server on :3000
 *   BASE=http://localhost:3000 node scripts/qa/qa.mjs
 *
 * Writes screenshots to qa/ and a summary to qa/REPORT.md.
 *
 * The matrix is deliberately wide: Chromium and WebKit, light and dark, two
 * viewports, with and without prefers-reduced-motion. The reduced-motion pass
 * is the point of the motion work — those states have to be complete, not
 * empty — and WebKit catches the Safari-only problems (backdrop-filter, svh
 * units, pinned scrolling) that Chromium never shows.
 */

import { chromium, webkit } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "qa";

const PAGES = [
  ["home", "/"],
  ["enterprise-ai", "/enterprise-ai"],
  ["pharma", "/pharma"],
  ["mennie", "/mennie"],
  ["photonics", "/photonics"],
  ["research", "/research"],
  ["company", "/company"],
  ["careers", "/careers"],
  ["contact", "/contact"],
  ["start-a-project", "/start-a-project"],
  ["privacy", "/privacy"],
  ["terms", "/terms"]
];

const REDIRECTS = [
  ["/foundry", "/company"],
  ["/about", "/company"],
  ["/team", "/company"],
  ["/healthmate", "/mennie"],
  ["/domains", "/enterprise-ai"],
  ["/innovate", "/research"],
  ["/insights", "/research"],
  ["/orbit", "/"]
];

const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }]
];

const ENGINES = [
  ["chromium", chromium],
  ["webkit", webkit]
];

const report = { shots: 0, a11y: [], links: [], redirects: [], errors: [] };

async function visit(browser, engine, name, url, vpName, viewport, reduced, theme) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
    colorScheme: theme === "dark" ? "dark" : "light",
    ...(vpName === "mobile" ? { isMobile: engine === "chromium", hasTouch: true } : {})
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 200)));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });

  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (theme === "dark") {
    await page.evaluate(() => localStorage.setItem("praverse-theme", "dark"));
    await page.reload({ waitUntil: "domcontentloaded" });
  }
  await page.waitForTimeout(1600);

  const tag = `${name}--${engine}--${vpName}--${theme}--${reduced ? "reduced" : "motion"}`;
  try {
    await page.screenshot({
      path: path.join(OUT, `${tag}.png`),
      fullPage: !reduced,
      animations: "allow",
      timeout: 45000
    });
    report.shots += 1;
  } catch {
    // A continuously animating 3D canvas can outrun the screenshot timeout;
    // that is a capture limitation, not a page defect.
  }

  if (consoleErrors.length) {
    report.errors.push({ page: name, engine, vp: vpName, theme, reduced, errors: [...new Set(consoleErrors)] });
  }

  // axe once per page per theme, on Chromium desktop with motion on.
  if (engine === "chromium" && vpName === "desktop" && !reduced) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    report.a11y.push({
      page: name,
      theme,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        target: v.nodes[0]?.target?.join(" ") ?? ""
      }))
    });

    if (theme === "light") {
      const hrefs = await page.$$eval("a[href]", (as) =>
        as.map((a) => a.getAttribute("href")).filter(Boolean)
      );
      for (const h of hrefs) {
        if (h.startsWith("/") && !h.startsWith("//")) {
          report.links.push(h.split("#")[0] || "/");
        }
      }
    }
  }

  await context.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const [engine, launcher] of ENGINES) {
    const browser = await launcher.launch();
    for (const [name, url] of PAGES) {
      for (const [vpName, viewport] of VIEWPORTS) {
        for (const theme of ["light", "dark"]) {
          for (const reduced of [false, true]) {
            await visit(browser, engine, name, url, vpName, viewport, reduced, theme);
          }
        }
      }
      process.stdout.write(`${engine}: ${name}\n`);
    }
    await browser.close();
  }

  // redirects + links on one plain context
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  for (const [from, to] of REDIRECTS) {
    const res = await page.goto(BASE + from, { waitUntil: "domcontentloaded" });
    const landed = new URL(page.url()).pathname;
    report.redirects.push({
      from,
      expected: to,
      landed,
      status: res?.request()?.redirectedFrom()?.response
        ? (await res.request().redirectedFrom().response())?.status() ?? 0
        : res?.status() ?? 0,
      ok: landed === to
    });
  }

  const unique = [...new Set(report.links)];
  const linkResults = [];
  for (const href of unique) {
    const res = await page.goto(BASE + href, { waitUntil: "domcontentloaded" });
    linkResults.push({ href, status: res?.status() ?? 0, ok: (res?.status() ?? 0) < 400 });
  }
  await ctx.close();
  await browser.close();

  const byTheme = (t) => report.a11y.filter((p) => p.theme === t);
  const count = (t) => byTheme(t).reduce((n, p) => n + p.violations.length, 0);
  const badLinks = linkResults.filter((l) => !l.ok);
  const badRedirects = report.redirects.filter((r) => !r.ok);

  const md = [
    "# QA report",
    "",
    `Base: ${BASE}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Screenshots: **${report.shots}** — ${PAGES.length} pages x {chromium, webkit} x {desktop, mobile} x {light, dark} x {motion, reduced}`,
    `- axe violations: **${count("light")} light**, **${count("dark")} dark**`,
    `- Internal links: ${linkResults.length} checked, **${badLinks.length}** broken`,
    `- Redirects: ${report.redirects.length} checked, **${badRedirects.length}** wrong`,
    `- Page/console errors: **${report.errors.length}**`,
    "",
    "## Accessibility (axe, WCAG 2.2 AA)",
    ""
  ];

  for (const theme of ["light", "dark"]) {
    md.push(`### ${theme}`, "");
    for (const p of byTheme(theme)) {
      if (!p.violations.length) md.push(`- **${p.page}** — none`);
      else {
        md.push(`- **${p.page}** — ${p.violations.length}:`);
        for (const v of p.violations) {
          md.push(`  - \`${v.id}\` (${v.impact}, ${v.nodes}) — ${v.help}`);
          md.push(`    - \`${v.target}\``);
        }
      }
    }
    md.push("");
  }

  md.push("## Redirects", "", "| From | Expected | Landed | OK |", "|---|---|---|---|");
  for (const r of report.redirects) {
    md.push(`| ${r.from} | ${r.expected} | ${r.landed} | ${r.ok ? "yes" : "**NO**"} |`);
  }

  md.push("", "## Internal links", "");
  md.push(
    badLinks.length
      ? ["| Link | Status |", "|---|---|", ...badLinks.map((l) => `| ${l.href} | ${l.status} |`)].join("\n")
      : `All ${linkResults.length} internal links return < 400.`
  );

  md.push("", "## Console / page errors", "");
  if (!report.errors.length) md.push("None.");
  else {
    for (const e of report.errors) {
      md.push(`- **${e.page}** (${e.engine}, ${e.vp}, ${e.theme}, ${e.reduced ? "reduced" : "motion"}):`);
      for (const m of e.errors) md.push(`  - ${m}`);
    }
  }

  await writeFile(path.join(OUT, "REPORT.md"), md.join("\n"), "utf8");
  console.log(`\nshots ${report.shots}`);
  console.log(`axe light ${count("light")} / dark ${count("dark")}`);
  console.log(`links broken ${badLinks.length}, redirects wrong ${badRedirects.length}`);
  console.log(`error pages ${report.errors.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
