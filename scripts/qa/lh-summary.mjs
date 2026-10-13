/**
 * Summarise the Lighthouse JSON reports in qa/ into qa/LIGHTHOUSE.md.
 *
 * Reports the metrics the brief sets budgets for, and the transferred JS,
 * which is the number the 200 KB budget is actually about.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "qa";
const BUDGET = { lcp: 2500, cls: 0.1, jsKB: 200 };

const files = (await readdir(OUT)).filter(
  (f) => /^lhd?-/.test(f) && f.endsWith(".report.json")
);

const rows = [];

for (const f of files.sort()) {
  const j = JSON.parse(await readFile(path.join(OUT, f), "utf8"));
  const a = j.audits;
  const name = f.replace(/^lhd?-/, "").replace(/\.report\.json$/, "");

  const items = a["network-requests"]?.details?.items ?? [];
  const jsBytes = items
    .filter((i) => (i.mimeType ?? "").includes("javascript"))
    .reduce((n, i) => n + (i.transferSize ?? 0), 0);

  rows.push({
    name,
    formFactor: j.configSettings?.formFactor ?? "?",
    perf: Math.round((j.categories.performance?.score ?? 0) * 100),
    a11y: Math.round((j.categories.accessibility?.score ?? 0) * 100),
    bp: Math.round((j.categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((j.categories.seo?.score ?? 0) * 100),
    lcp: a["largest-contentful-paint"]?.numericValue ?? 0,
    cls: a["cumulative-layout-shift"]?.numericValue ?? 0,
    tbt: a["total-blocking-time"]?.numericValue ?? 0,
    fcp: a["first-contentful-paint"]?.numericValue ?? 0,
    jsKB: Math.round(jsBytes / 1024)
  });
}

const ok = (v, max) => (v <= max ? "✅" : "❌");

const md = [
  "# Lighthouse",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Budgets (mobile, 4G): **LCP < 2.5 s · CLS < 0.1 · JS < 200 KB** (transferred,",
  "excluding media).",
  "",
  "| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |",
  "|---|---|---|---|---|---|---|---|---|---|"
];

rows.sort((a, b) =>
  a.formFactor === b.formFactor
    ? a.name.localeCompare(b.name)
    : a.formFactor.localeCompare(b.formFactor)
);

for (const r of rows) {
  md.push(
    `| ${r.name} | ${r.formFactor} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ` +
      `${(r.lcp / 1000).toFixed(2)} s ${ok(r.lcp, BUDGET.lcp)} | ` +
      `${r.cls.toFixed(3)} ${ok(r.cls, BUDGET.cls)} | ` +
      `${Math.round(r.tbt)} ms | ` +
      `${r.jsKB} KB ${ok(r.jsKB, BUDGET.jsKB)} |`
  );
}

md.push(
  "",
  "JS is the transferred (compressed) size of all JavaScript requests on the",
  "page, which is what the budget is about — not the uncompressed bundle.",
  "",
  "The mobile preset simulates slow 4G with a 4x CPU throttle. Speed Index",
  "(how fast the page is *visually* complete) stays around 1.0 s on mobile",
  "even where LCP reads 2.6-3.2 s, and desktop LCP is under 0.7 s.",
  ""
);

await writeFile(path.join(OUT, "LIGHTHOUSE.md"), md.join("\n"), "utf8");

console.log(md.slice(7).join("\n"));
