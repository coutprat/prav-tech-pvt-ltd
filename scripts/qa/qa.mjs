/**
 * QA sweep: screenshots, accessibility, links and redirects.
 *
 *   node scripts/qa/qa.mjs            # expects a server on :3000
 *   BASE=http://localhost:3000 node scripts/qa/qa.mjs
 *
 * Writes screenshots to qa/ and a summary to qa/REPORT.md.
 *
 * Every page is shot at 1440x900 and 390x844, both with and without
 * prefers-reduced-motion, because the whole point of the motion work is that
 * the reduced-motion state is complete rather than empty.
 */

import { chromium } from "@playwright/test";
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

const report = { shots: [], a11y: [], links: [], redirects: [], errors: [] };

async function shoot(browser, name, url, vpName, viewport, reduced) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
    ...(vpName === "mobile" ? { isMobile: true, hasTouch: true } : {})
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });

  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });
  // let the hero's first frames decode and any entry animation settle
  await page.waitForTimeout(1200);

  const suffix = reduced ? "reduced" : "motion";
  const file = path.join(OUT, `${name}--${vpName}--${suffix}.png`);
  await page.screenshot({ path: file, fullPage: true });
  report.shots.push(file);

  if (consoleErrors.length) {
    report.errors.push({ page: name, vp: vpName, reduced, errors: consoleErrors });
  }

  // Accessibility scan once per page, at desktop, with motion on.
  if (vpName === "desktop" && !reduced) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    report.a11y.push({
      page: name,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        target: v.nodes[0]?.target?.join(" ") ?? ""
      }))
    });

    // Collect internal links for the link check.
    const hrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => a.getAttribute("href")).filter(Boolean)
    );
    for (const h of hrefs) {
      if (h.startsWith("/") && !h.startsWith("//")) {
        report.links.push({ from: name, href: h.split("#")[0] || "/" });
      }
    }
  }

  await context.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const [name, url] of PAGES) {
    for (const [vpName, viewport] of VIEWPORTS) {
      for (const reduced of [false, true]) {
        await shoot(browser, name, url, vpName, viewport, reduced);
      }
    }
    process.stdout.write(`shot ${name}\n`);
  }

  // --- redirects -----------------------------------------------------------
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const [from, to] of REDIRECTS) {
    const res = await page.goto(BASE + from, { waitUntil: "domcontentloaded" });
    const landed = new URL(page.url()).pathname;
    report.redirects.push({
      from,
      expected: to,
      landed,
      status: res?.status() ?? 0,
      ok: landed === to
    });
  }

  // --- internal links ------------------------------------------------------
  const unique = [...new Set(report.links.map((l) => l.href))];
  const linkResults = [];
  for (const href of unique) {
    const res = await page.goto(BASE + href, { waitUntil: "domcontentloaded" });
    linkResults.push({ href, status: res?.status() ?? 0, ok: (res?.status() ?? 0) < 400 });
  }
  await ctx.close();
  await browser.close();

  // --- report --------------------------------------------------------------
  const totalViolations = report.a11y.reduce((n, p) => n + p.violations.length, 0);
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
    `- Screenshots: ${report.shots.length} (${PAGES.length} pages x 2 viewports x motion/reduced)`,
    `- axe violations: **${totalViolations}**`,
    `- Internal links checked: ${linkResults.length}, broken: **${badLinks.length}**`,
    `- Redirects checked: ${report.redirects.length}, wrong: **${badRedirects.length}**`,
    `- Pages with console errors: **${report.errors.length}**`,
    "",
    "## Accessibility (axe, WCAG 2.2 AA)",
    ""
  ];

  for (const p of report.a11y) {
    if (!p.violations.length) {
      md.push(`- **${p.page}** — no violations`);
    } else {
      md.push(`- **${p.page}** — ${p.violations.length} violation(s):`);
      for (const v of p.violations) {
        md.push(`  - \`${v.id}\` (${v.impact}, ${v.nodes} node(s)) — ${v.help}`);
        md.push(`    - first: \`${v.target}\``);
      }
    }
  }

  md.push("", "## Redirects", "");
  md.push("| From | Expected | Landed | OK |", "|---|---|---|---|");
  for (const r of report.redirects) {
    md.push(`| ${r.from} | ${r.expected} | ${r.landed} | ${r.ok ? "yes" : "**NO**"} |`);
  }

  md.push("", "## Internal links", "");
  if (!badLinks.length) {
    md.push(`All ${linkResults.length} internal links return < 400.`);
  } else {
    md.push("| Link | Status |", "|---|---|");
    for (const l of badLinks) md.push(`| ${l.href} | ${l.status} |`);
  }

  md.push("", "## Console errors", "");
  if (!report.errors.length) {
    md.push("None.");
  } else {
    for (const e of report.errors) {
      md.push(`- **${e.page}** (${e.vp}, ${e.reduced ? "reduced" : "motion"}):`);
      for (const msg of e.errors) md.push(`  - ${msg}`);
    }
  }

  await writeFile(path.join(OUT, "REPORT.md"), md.join("\n"), "utf8");
  console.log(`\naxe violations: ${totalViolations}`);
  console.log(`broken links:   ${badLinks.length}`);
  console.log(`bad redirects:  ${badRedirects.length}`);
  console.log(`console errors: ${report.errors.length}`);
  console.log(`\nwrote ${OUT}/REPORT.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
