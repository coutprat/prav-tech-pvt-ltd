import { businessLines, company, mennie, people, trackRecord } from "@/content/company";
import { faqs } from "@/content/faq";
import { industries } from "@/content/industries";
import { offers } from "@/content/offers";
import { site, locations } from "@/content/site";
import { ROUTES } from "@/lib/routes";
import { sectors } from "@/content/sectors";
import { govOffers } from "@/content/government";
import { weDo } from "@/content/wedo";

/**
 * Plain-text summaries for AI assistants (https://llmstxt.org). Built from the
 * same content files as the pages, so what an assistant quotes is what the
 * site says. Facts gated by [VERIFY] entries are deliberately left out.
 */

const abs = (path: string) => `${company.url}${path === "/" ? "" : path}`;

const pages = ROUTES.filter((r) => !["/privacy", "/terms"].includes(r.path));

export function llmsIndex(): string {
  return [
    `# ${company.name}`,
    "",
    `> ${company.oneLiner}`,
    "",
    `${company.legalName} is headquartered in ${company.hq}. Markets: ${company.markets}. ${company.originLine}`,
    "",
    "## Pages",
    "",
    ...pages.map((r) => `- [${r.name}](${abs(r.path)})`),
    "",
    "## Business lines",
    "",
    ...businessLines.map((l) => `- [${l.title}](${abs(l.href)}): ${l.blurb}`),
    "",
    "## More",
    "",
    `- [Full company facts for AI assistants](${company.url}/llms-full.txt)`,
    `- Enquiries: ${site.enquiryEmail}`,
    `- LinkedIn: ${company.linkedIn}`,
    ""
  ].join("\n");
}

export function llmsFull(): string {
  return [
    `# ${company.name} — full company facts`,
    "",
    `> ${company.oneLiner}`,
    "",
    "## Who we are",
    "",
    `${company.legalName}. ${company.originLine} ${locations.line} Markets served: ${company.markets}.`,
    company.principle,
    "",
    "## What we do",
    "",
    ...businessLines.flatMap((l) => [`### ${l.title}`, `${l.blurb} Page: ${abs(l.href)}`, ""]),
    "## Ways to start",
    "",
    ...offers.map((o) => `- ${o.title}: ${o.body}`),
    "",
    "## What we build",
    "",
    ...Object.values(weDo)
      .flat()
      .map((w) => `- We build ${w.title}: ${w.body}`),
    "",
    "## Industries we serve",
    "",
    ...industries.map((i) => `- ${i.name}: ${i.use}`),
    "",
    ...sectors.flatMap((x) => [
      `### AI for ${x.name}`,
      `${x.lede} Page: ${abs(`/industries/${x.slug}`)}`,
      ...x.services.map((v) => `- ${v.title}: ${v.body}`),
      ""
    ]),
    "## Government and public sector",
    "",
    `Page: ${abs("/government")}. No department, regulator or PSU is named as a client, and no empanelment or certification is claimed.`,
    ...govOffers.map((g) => `- ${g.title}: ${g.body}`),
    "",
    `### About MENNIE`,
    `MENNIE stands for ${mennie.expansion}. ${mennie.summary} It is in research and development.`,
    "",
    "## Research track record",
    "",
    ...trackRecord.map((t) => `- ${t.year}: ${t.title} — ${t.body}`),
    "",
    "## Leadership and advisors",
    "",
    ...people.flatMap((p) => [`### ${p.name} — ${p.role}`, ...p.proof.map((x) => `- ${x}`), ""]),
    "## Frequently asked questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Contact",
    "",
    `- Enquiries: ${site.enquiryEmail}`,
    `- Start a project: ${abs("/start-a-project")}`,
    `- Promise: ${company.promise}`,
    `- LinkedIn: ${company.linkedIn}`,
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
