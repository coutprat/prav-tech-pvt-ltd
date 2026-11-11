import { company, mennie, people, trackRecord } from "@/content/company";
import { industries } from "@/content/industries";
import { offers } from "@/content/offers";
import { ROUTES } from "@/lib/routes";
import { sectors } from "@/content/sectors";
import { govOffers } from "@/content/government";
import { weDo } from "@/content/wedo";
import { FACTS, PAGES, SAME_AS, SERVICE_LINES, SUMMARY } from "@/lib/answers";

/**
 * /llms.txt and /llms-full.txt (https://llmstxt.org), for AI assistants.
 *
 * Both are generated from lib/answers.ts (summary, facts, FAQs, page briefs)
 * and the content files, the same sources the pages and the JSON-LD read, so
 * what an assistant quotes is what the site says. Facts gated by [VERIFY]
 * entries are left out until confirmed.
 */

const abs = (path: string) => `${company.url}${path === "/" ? "" : path}`;

const pages = ROUTES.filter((r) => !["/privacy", "/terms"].includes(r.path));

function keyFacts(): string[] {
  const rows: [string, string | null][] = [
    ["Legal name", FACTS.legalName],
    ["Brand", FACTS.name],
    ["What it does", FACTS.whatItDoes],
    ["Headquarters", FACTS.address ?? FACTS.hq],
    ["Team", FACTS.team],
    ["Markets", FACTS.markets],
    ["Founder", `${FACTS.founder.name}, ${FACTS.founder.title}`],
    ["Founded", `Work began in ${FACTS.ideaFrom}; ${FACTS.legalName} incorporated in ${FACTS.incorporated}`],
    ["Website", FACTS.url],
    ["Email (enquiries)", FACTS.enquiryEmail],
    ["Email (careers)", FACTS.careersEmail],
    ["Office hours", FACTS.hours],
    ["Phone", FACTS.phone],
    ["CIN", FACTS.cin],
    ["GSTIN", FACTS.gstin]
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1])).map(([k, v]) => `- ${k}: ${v}`);
}

export function llmsIndex(): string {
  return [
    `# ${FACTS.legalName}`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Key facts",
    "",
    ...keyFacts(),
    "",
    "## Services",
    "",
    ...SERVICE_LINES.map((s) => `- [${s.name}](${abs(s.path)}): ${s.description}`),
    "",
    "## Pages",
    "",
    ...pages.map((r) => `- [${r.name}](${abs(r.path)}): ${PAGES[r.path].brief}`),
    "",
    "## Optional",
    "",
    `- [Full company facts and every page's FAQ](${company.url}/llms-full.txt)`,
    `- [Start a project](${abs("/start-a-project")}): ${FACTS.promise}`,
    ...SAME_AS.map((u) => `- [Profile](${u})`),
    ""
  ].join("\n");
}

export function llmsFull(): string {
  return [
    `# ${FACTS.legalName}: full company facts`,
    "",
    `> ${SUMMARY}`,
    "",
    "## Key facts",
    "",
    ...keyFacts(),
    "",
    company.principle,
    "",
    "## Pages, with their questions and answers",
    "",
    ...pages.flatMap((r) => {
      const b = PAGES[r.path];
      return [
        `### ${r.name}`,
        "",
        `${b.brief} ${abs(r.path)}`,
        "",
        ...(b.faq ?? []).flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""])
      ];
    }),
    "## Ways to start",
    "",
    ...offers.map((o) => `- ${o.title}: ${o.body}`),
    "",
    "## What we build",
    "",
    ...Object.values(weDo)
      .flat()
      .map((w) => `- ${w.title}: ${w.body}`),
    "",
    "## Industries",
    "",
    ...industries.map((i) => `- ${i.name}: ${i.use}`),
    "",
    ...sectors.flatMap((x) => [
      `### AI for ${x.name}`,
      `${x.lede} ${abs(`/industries/${x.slug}`)}`,
      ...x.services.map((v) => `- ${v.title}: ${v.body}`),
      ""
    ]),
    "## Government and public sector",
    "",
    `No department, regulator or PSU is named as a client, and no empanelment or certification is claimed. ${abs("/government")}`,
    ...govOffers.map((g) => `- ${g.title}: ${g.body}`),
    "",
    "## MENNIE",
    "",
    `MENNIE stands for ${mennie.expansion}. ${mennie.summary} It is in research and development. ${mennie.disclaimer}`,
    "",
    "## Research track record",
    "",
    ...trackRecord.map((t) => `- ${t.year}: ${t.title}: ${t.body}`),
    "",
    "## Leadership and advisors",
    "",
    ...people.flatMap((p) => [`### ${p.name}, ${p.role}`, ...p.proof.map((x) => `- ${x}`), ""]),
    "## Contact",
    "",
    `- Enquiries: ${FACTS.enquiryEmail}`,
    `- Start a project: ${abs("/start-a-project")}`,
    `- ${FACTS.promise}`,
    ""
  ].join("\n");
}

export function textResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
