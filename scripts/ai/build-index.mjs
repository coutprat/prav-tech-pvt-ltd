/**
 * Builds the assistant's knowledge index from the published site.
 *
 *   node scripts/ai/build-index.mjs [baseUrl]
 *
 * Deliberately crawls the rendered pages rather than reading content/*.ts.
 * The index is then, by construction, exactly what a visitor can read — the
 * assistant cannot know a fact the site does not state, and it cannot keep
 * quoting a claim after that claim is edited or withheld. Re-run it whenever
 * content changes; a stale index is the one way this thing starts lying.
 *
 * Chunks are split at headings, because a heading is where a topic actually
 * changes and it gives every chunk a human-readable anchor to cite.
 *
 * No embeddings, no vector database, no second service to pay for or secure.
 * Twelve pages is roughly a hundred chunks, which a lexical scorer handles
 * well and which anyone can audit by reading the JSON.
 */
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3000";

const ROUTES = [
  ["/", "Home"],
  ["/enterprise-ai", "Enterprise AI"],
  ["/pharma", "Pharma & Regulatory AI"],
  ["/mennie", "MENNIE"],
  ["/photonics", "Photonics"],
  ["/sovereign-ai-data-centres", "Sovereign AI data centres"],
  ["/company", "Company"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
  ["/start-a-project", "Start a project"],
  ["/trust", "Trust"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"]
];

/** Chunks below this are navigation crumbs, not knowledge. */
const MIN_CHARS = 120;
/** Keeps any single chunk from dominating the context window. */
const MAX_CHARS = 1400;

const browser = await chromium.launch();
const chunks = [];

for (const [path, pageTitle] of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  // Reduced motion so scroll-driven sections render their complete static
  // text rather than one chapter at a time.
  await page.emulateMedia({ reducedMotion: "reduce" });

  const res = await page.goto(BASE + path, { waitUntil: "load" });
  if (!res || res.status() >= 400) {
    console.error(`  skip ${path} (${res?.status()})`);
    await ctx.close();
    continue;
  }
  await page.waitForTimeout(900);

  const sections = await page.evaluate(() => {
    const main = document.querySelector("main") ?? document.body;
    // Chrome, cookie bars and the assistant itself are not knowledge.
    for (const sel of [".nav", ".footer", ".wa-fab", "#praverse-assistant", "script", "style", "noscript"]) {
      main.querySelectorAll(sel).forEach((n) => n.remove());
    }

    const out = [];
    let current = { heading: null, parts: [] };
    const push = () => {
      const text = current.parts.join(" ").replace(/\s+/g, " ").trim();
      if (text) out.push({ heading: current.heading, text });
    };

    const walk = (node) => {
      for (const el of node.children) {
        const tag = el.tagName.toLowerCase();
        if (/^h[1-4]$/.test(tag)) {
          push();
          current = { heading: el.innerText.replace(/\s+/g, " ").trim(), parts: [] };
          continue;
        }
        if (["p", "li", "dd", "dt", "figcaption", "td", "th", "blockquote"].includes(tag)) {
          // innerText, not textContent: textContent ignores element boundaries,
          // so a list item built from a number span, a heading and a paragraph
          // came out as "01Enterprise AI & AgentsAgents and copilots…".
          // innerText respects the rendered line breaks.
          const t = el.innerText.replace(/\s+/g, " ").trim();
          if (t) current.parts.push(t);
          continue;
        }
        if (el.children.length) walk(el);
      }
    };
    walk(main);
    push();
    return out;
  });

  let kept = 0;
  for (const s of sections) {
    const text = s.text.slice(0, MAX_CHARS);
    if (text.length < MIN_CHARS) continue;
    chunks.push({
      id: `${path}#${kept}`,
      url: path,
      page: pageTitle,
      heading: s.heading ?? pageTitle,
      text
    });
    kept += 1;
  }
  console.log(`  ${path.padEnd(30)} ${kept} chunks`);
  await ctx.close();
}

await browser.close();

await mkdir("content/ai", { recursive: true });
await writeFile(
  "content/ai/knowledge.json",
  JSON.stringify({ builtAt: new Date().toISOString(), chunks }, null, 1),
  "utf8"
);

const words = chunks.reduce((n, c) => n + c.text.split(/\s+/).length, 0);
console.log(`\ncontent/ai/knowledge.json — ${chunks.length} chunks, ~${words} words`);
