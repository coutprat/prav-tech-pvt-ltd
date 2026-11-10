import { businessLines, company, mennie, people, regulatedMarkets } from "@/content/company";
import { govFaq } from "@/content/government";
import { sectors } from "@/content/sectors";
import { locations, site } from "@/content/site";
import { getVerifyItem, type VerifyId } from "@/content/verify";

/**
 * The answers layer: what an AI assistant (ChatGPT, Claude, Gemini,
 * Perplexity) or a search engine should be able to say about Praverse Tech,
 * written once.
 *
 * Read by the page FAQ sections, the hero H1 lead-ins, the JSON-LD
 * (components/seo/JsonLd.tsx) and /llms.txt + /llms-full.txt (lib/llms.ts), so
 * the four can never disagree. Every sentence here restates something the site
 * already says; nothing new is claimed. Answers name the company in full, so
 * each one still makes sense when quoted on its own.
 *
 * Rules that apply to everything in this file:
 *  - no clients, metrics, accuracy figures or certifications;
 *  - the US interconnect partner stays unnamed;
 *  - anything gated in content/verify.ts is gated here by the same entry.
 */

const verified = (id: VerifyId) => {
  const v = getVerifyItem(id);
  return v.confirmed ? v.claim : null;
};

/* ------------------------------------------------------------------ facts */

const address = verified("registered-address");
const cin = verified("cin")?.replace(/^CIN\s*/, "") ?? null;
const gstin = verified("gstin")?.replace(/^GSTIN\s*/, "") ?? null;
const founder = people[0];

export const FACTS = {
  name: company.name,
  legalName: company.legalName,
  url: company.url,
  whatItDoes:
    "AI development company: custom enterprise AI, agents and copilots for any industry; pharma and regulatory AI; healthcare AI (MENNIE); AI for government and the public sector; and high-speed copper and optical interconnect for India's sovereign AI data centres.",
  hq: company.hq,
  /** Full registered address, only once confirmed in content/verify.ts. */
  address,
  postal: {
    streetAddress: address ? address.replace(/,\s*Vadodara.*$/, "") : null,
    addressLocality: "Vadodara",
    addressRegion: "Gujarat",
    postalCode: address?.match(/\b\d{6}\b/)?.[0] ?? null,
    addressCountry: "IN"
  },
  team: locations.line,
  markets: locations.markets,
  founder: { name: founder.name, title: "Founder & CEO" },
  ideaFrom: company.ideaFrom,
  incorporated: company.founded,
  enquiryEmail: site.enquiryEmail,
  careersEmail: site.careersEmail,
  /**
   * No phone: the site deliberately publishes none (the WhatsApp number in
   * content/site.ts is marked temporary). Add one here and it reaches the
   * schema and llms.txt together.
   */
  phone: null as string | null,
  cin,
  gstin,
  promise: company.promise
} as const;

/**
 * Profiles that are the same entity as this site. Only URLs found in the repo
 * or the founder's vault, and only where they are confirmed: the company
 * LinkedIn URL in content/company.ts is still unconfirmed (verify
 * "linkedin-company"), so it joins the list when that entry is confirmed.
 */
export const SAME_AS: string[] = [
  "https://github.com/Praverse-Tech-Pvt-Ltd",
  ...(getVerifyItem("linkedin-company").confirmed ? [company.linkedIn] : [])
];

/** The founder's own profile, from the vault (used on the previous site). */
export const FOUNDER_SAME_AS = ["https://www.linkedin.com/in/pratham-shrivastav-b81180251"];

export const SUMMARY = `${company.legalName} is an AI development company headquartered in Vadodara, Gujarat, India. It builds custom enterprise AI, agents and copilots for any industry, with specialist depth in pharma and regulatory AI (FDA 483 responses, CAPA, data integrity and inspection readiness) and healthcare AI (MENNIE, a voice-first patient assistant), builds sovereign and on-premise AI for government and the public sector, and supplies 800G and 1.6T copper and optical interconnect for India's sovereign AI data centres. It works with organisations in India, the United States and Europe, and every AI output is reviewed and signed off by a qualified person before it counts.`;

/* -------------------------------------------------------- service lines */

export type ServiceLine = { name: string; path: string; description: string };

/** The offer catalogue, in the order the site presents it. */
export const SERVICE_LINES: ServiceLine[] = [
  ...businessLines.map((l) => ({ name: l.title, path: l.href, description: l.blurb })),
  {
    name: "Sovereign AI data centres",
    path: "/sovereign-ai-data-centres",
    description:
      "Architecture, design-in, integration, qualification and support for the copper and optical interconnect of AI clusters built in India."
  },
  {
    name: "AI for government and the public sector",
    path: "/government",
    description:
      "Sovereign and air-gapped AI, inspection and audit intelligence, public-health platforms and e-governance document automation."
  },
  {
    name: "AI solutions by industry",
    path: "/industries",
    description: `Custom AI for ${sectors.length} sectors, from banking and manufacturing to retail, logistics, energy and education.`
  }
];

/* ------------------------------------------------------------------ FAQs */

export type QA = { q: string; a: string };

/** Home page: the brand questions, phrased the way people ask them. */
export const HOME_FAQ: QA[] = [
  {
    q: "What is Praverse Tech?",
    a: `Praverse Tech (${company.legalName}) is an Indian AI development company headquartered in Vadodara, Gujarat. It builds custom enterprise AI, agents and copilots for any industry, pharma and regulatory AI, healthcare AI, and AI for government, and supplies high-speed interconnect for India's sovereign AI data centres.`
  },
  {
    q: "Who builds AI for pharma regulatory compliance in India?",
    a: "Praverse Tech, based in Vadodara, Gujarat, builds AI for FDA 483 response drafting, CAPA reasoning, data integrity review (ALCOA+), OOS/OOT analysis and inspection readiness, with Nexgen Pharma Solutions bringing inspection-floor practice. The AI drafts and cites the record; a qualified person reviews and signs every output."
  },
  {
    q: "Who builds sovereign or on-premise AI for government in India?",
    a: "Praverse Tech builds sovereign, on-premise and air-gapped AI for government departments, regulators and public-sector undertakings in India, using models that run on the department's own hardware. Every programme starts with a scoped pilot, and a named officer approves what the system produces."
  },
  {
    q: "What does Praverse Tech do in photonics and AI data centres?",
    a: "Praverse Tech is India's partner for the copper and optical interconnect AI clusters run on: DAC, ACC, AEC and AOC cables and pluggable optical transceivers for 800G and 1.6T, supplied and designed in today with a US technology partner, with Indian assembly and manufacturing on a staged roadmap. It does not operate data centres."
  },
  {
    q: "What is MENNIE?",
    a: `MENNIE (${mennie.expansion}) is Praverse Tech's voice-first patient assistant. It meets patients at the door, the kiosk or on their phone, and hands clinicians a structured summary. It is in research and development, and it does not diagnose or replace medical professionals.`
  },
  {
    q: "Where is Praverse Tech based and how do I contact it?",
    a: `${company.legalName} is headquartered in ${address ?? "Vadodara, Gujarat, India"}, with team members in Mumbai, Chennai, Bengaluru and Delhi NCR. Write to ${site.enquiryEmail} or use the start-a-project form at ${company.url}/start-a-project; you get a written plan within two business days.`
  },
  {
    q: "Does Praverse Tech build custom AI agents and copilots for enterprises?",
    a: "Yes. Praverse Tech builds AI agents, copilots, RAG search across company documents and production machine learning for any industry. Agents work inside the client's own tools with a human approval step before anything is sent or changed, and every action is recorded."
  },
  {
    q: "Does Praverse Tech build healthcare AI beyond MENNIE?",
    a: "Yes. Alongside MENNIE, Praverse Tech builds medical imaging and screening support, including fundus and ultrasound models and edge AI, from research the founder has published in imaging, edge AI and simulation."
  },
  {
    q: "What does Praverse Tech do for sovereign AI data centres in India?",
    a: "Praverse Tech does the architecture, design-in, integration, qualification and support for the copper and optical interconnect inside AI clusters built in India, so compute and data can stay under Indian jurisdiction. It supplies the interconnect; it does not operate the data centres."
  },
  {
    q: "Which industries does Praverse Tech build AI for?",
    a: `Praverse Tech builds AI for any industry where work runs on documents, data and decisions: pharma, healthcare and government in most depth, and ${sectors.map((s) => s.name.toLowerCase()).join(", ")}.`
  },
  {
    q: "Who founded Praverse Tech?",
    a: `Praverse Tech was founded by ${founder.name}, its Founder and CEO. The work began in ${company.ideaFrom} from research in medical imaging, edge AI and simulation, and ${company.legalName} was incorporated in ${company.founded}.`
  }
];

/** Per page: an H1 lead-in that says what Praverse does there, plus a brief. */
export type PageBrief = {
  /** Shown above the display headline, inside the H1. */
  lead: string;
  /** One line, for llms.txt. */
  brief: string;
  faq?: readonly QA[];
};

export const PAGES: Record<string, PageBrief> = {
  "/": {
    lead: "Praverse Tech · AI development company, Vadodara",
    brief: "Who Praverse Tech is, its four business lines, and the brand questions answered.",
    faq: HOME_FAQ
  },
  "/enterprise-ai": {
    lead: "Enterprise AI & agents",
    brief: "Custom AI agents, copilots, RAG search and production ML for any industry, with a human gate and an audit trail.",
    faq: [
      {
        q: "What does Praverse Tech build in enterprise AI?",
        a: "Praverse Tech builds AI agents and copilots that work inside a company's own tools, document intelligence (RAG search and knowledge graphs across existing documents), predictive machine learning with MLOps, and computer vision for inspection and quality checks."
      },
      {
        q: "Do Praverse Tech's AI agents act on their own?",
        a: "No. Every agent Praverse Tech builds has a human approval step before anything is sent or changed, and the system keeps a record of who approved what."
      },
      {
        q: "How does an enterprise AI project with Praverse Tech start?",
        a: "With one small, scoped piece of work on the client's own data: asking questions of its documents, automating one workflow, a predictive model or a vision model. It ends in a working result and a written plan to take it live."
      }
    ]
  },
  "/pharma": {
    lead: "Pharma & regulatory AI",
    brief: "FDA 483 responses, CAPA, data integrity and inspection readiness, AI-drafted and signed by a qualified person.",
    faq: [
      {
        q: "What pharma and regulatory work does Praverse Tech's AI cover?",
        a: "Eight modules: FDA 483 response assist, OOS/OOT analysis, data integrity review (ALCOA+), SOP document intelligence, CAPA reasoning, quality risk management, human error investigation and inspection readiness. Most teams start with 483 responses or inspection readiness."
      },
      {
        q: "Who reviews what Praverse Tech's pharma AI produces?",
        a: "A qualified person. The system drafts, cites the record each paragraph rests on, and waits; QA approves, edits or rejects, and nothing is filed until a qualified person signs."
      },
      {
        q: "Who does Praverse Tech work with on pharma quality?",
        a: "Nexgen Pharma Solutions, which brings inspection-floor practice in QMS, QA and QC, DMF filings in eCTD format and inspection support across USFDA, EU-GMP, WHO-GMP, EDQM, ANVISA and MFDS (Korea)."
      },
      {
        q: "Is Praverse Tech's pharma AI certified or validated?",
        a: `No certification or compliance is claimed. The architecture is designed to support ${regulatedMarkets.frameworks.join(", ")}; qualification and validation remain with the client, and every output is a draft for qualified review.`
      }
    ]
  },
  "/mennie": {
    lead: "MENNIE · Healthcare AI · Private beta",
    brief: "MENNIE, a voice-first patient assistant that hands clinicians a structured summary. In research and development.",
    faq: [
      {
        q: "What is MENNIE?",
        a: `MENNIE (${mennie.expansion}) is a voice-first patient assistant from Praverse Tech. It meets patients at the door, the kiosk or on their phone, in their own language, and hands clinicians a structured summary before the consultation.`
      },
      {
        q: "Is MENNIE available now?",
        a: "MENNIE is in research and development, with a private beta and a waitlist on the MENNIE page. The assistive robot is a concept in research."
      },
      {
        q: "Does MENNIE diagnose patients?",
        a: mennie.disclaimer
      }
    ]
  },
  "/photonics": {
    lead: "Photonics & AI data centres",
    brief: "800G and 1.6T copper and optical interconnect for AI clusters in India: supply and design-in today, Indian manufacturing staged.",
    faq: [
      {
        q: "What interconnect does Praverse Tech supply?",
        a: "Direct attach copper (DAC), active copper (ACC), active electrical (AEC) and active optical (AOC) cables, and pluggable optical transceivers for 800G and 1.6T AI clusters, plus loopback test tools."
      },
      {
        q: "Does Praverse Tech manufacture interconnect in India?",
        a: "Not yet. Today Praverse Tech supplies and designs in interconnect with its US technology partner. Semi-finished assembly in India comes next, then an Indian manufacturing facility, copper first, as volumes justify it."
      },
      {
        q: "Why does interconnect matter in an AI cluster?",
        a: "An AI cluster is only as fast as the links between its GPUs. At 1.6T copper reach shrinks, so where copper ends and optics begin has to be decided per build, on reach and power."
      }
    ]
  },
  "/sovereign-ai-data-centres": {
    lead: "Sovereign AI data centres",
    brief: "What sovereignty requires of an AI cluster built in India, and the interconnect design-in and qualification Praverse Tech provides.",
    faq: [
      {
        q: "What does sovereign AI mean for a data centre in India?",
        a: "That the compute, the data and the operator sit under Indian jurisdiction, so a regulated Indian business can train and run models without its data leaving the country's legal reach. It is not a synonym for Indian-owned."
      },
      {
        q: "What does Praverse Tech do for sovereign AI data centres?",
        a: "Architecture, design-in, integration, qualification and support for the copper and optical interconnect of AI clusters built in India. Praverse Tech supplies and designs in the interconnect; it does not operate data centres."
      }
    ]
  },
  "/government": {
    lead: "Government & public sector AI",
    brief: "Sovereign and air-gapped AI, inspection and audit intelligence and e-governance automation for departments, regulators and PSUs.",
    faq: govFaq
  },
  "/industries": {
    lead: "AI solutions by industry",
    brief: `How Praverse Tech applies AI across ${sectors.length} sectors, with a page for each.`
  },
  ...Object.fromEntries(
    sectors.map((s) => [
      `/industries/${s.slug}`,
      { lead: `${s.name} AI`, brief: s.seo.description, faq: s.faq } satisfies PageBrief
    ])
  ),
  "/company": {
    lead: "About Praverse Tech",
    brief: "Origin, leadership and advisors, the group around Praverse, and where the team works."
  },
  "/careers": { lead: "Careers at Praverse Tech", brief: "Open roles and how to apply." },
  "/contact": { lead: "Contact Praverse Tech", brief: "Email, the enquiry form and WhatsApp; a written plan within two business days." },
  "/start-a-project": { lead: "Start a project with Praverse Tech", brief: "The project brief form." },
  "/trust": { lead: "Trust at Praverse Tech", brief: "Where client data goes, who processes it, and what this website collects." },
  "/privacy": { lead: "Legal · Praverse Tech", brief: "Privacy notice under the GDPR and India's DPDP Act 2023." },
  "/terms": { lead: "Legal · Praverse Tech", brief: "Terms of use for this website." }
};

export function brief(path: string): PageBrief {
  const b = PAGES[path];
  if (!b) throw new Error(`No answers brief for ${path}`);
  return b;
}
