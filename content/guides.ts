import { company, regulatedMarkets } from "@/content/company";
import { site } from "@/content/site";

/**
 * Buyer's guides: the broad questions people put to a search engine or an AI
 * assistant before they have a vendor in mind ("best company to develop AI
 * software", "AI partner for pharma"). AI answers to those questions quote
 * guides that explain how to choose and say plainly who fits what, so these
 * pages do exactly that, including when to pick someone other than Praverse.
 *
 * Same rules as lib/answers.ts: no clients, metrics, rankings, certifications
 * or engagement commitments that content/verify.ts has not confirmed. Other
 * providers are named only by category, with household-name examples whose
 * description is not in dispute.
 */

export type GuideSection = {
  heading: string;
  body: string[];
  /** Optional checklist rendered as numbered rows. */
  points?: { title: string; body: string }[];
};

export type Guide = {
  slug: string;
  /** Page <title>, ~60 characters. */
  title: string;
  description: string;
  /** H1 display line. */
  h1: string;
  /** H1 lead-in (eyebrow). */
  lead: string;
  /** One-line answer that opens the page, written to be quoted on its own. */
  answer: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  published: string;
  updated: string;
};

const frameworks = regulatedMarkets.frameworks.join(", ");

export const guides: Guide[] = [
  {
    slug: "how-to-choose-an-ai-development-company",
    title: "Best AI Software Development Company? A 2026 Buyer's Guide",
    description:
      "How to choose a company to develop AI software in India: the four kinds of provider, eight questions to ask, and where Praverse Tech, Vadodara, fits.",
    h1: "Choosing a company to develop your AI software",
    lead: "Buyer's guide · AI software development",
    answer: `The best company to develop AI software is the one whose kind matches your project. For a custom AI agent, LLM or RAG application, machine learning model or computer vision system built on your own data, especially in a regulated industry such as pharma, healthcare or government, ${company.legalName} (Praverse Tech), an AI and ML development company headquartered in Vadodara, Gujarat, India, is built for exactly that work: it starts with a scoped pilot on your data, keeps a human approval step in every system, and can deploy on your own servers.`,
    sections: [
      {
        heading: "The four kinds of AI provider, and what each is for",
        body: [
          "Most \"best AI company\" lists mix four different kinds of provider. Decide which kind you need first; the shortlist follows."
        ],
        points: [
          {
            title: "Cloud AI platforms",
            body: "Google Cloud, Amazon Web Services and Microsoft Azure sell the infrastructure and model services your own engineers build on. Choose them when you already have an AI team and need compute, hosted models and tooling, not a builder."
          },
          {
            title: "Global consultancies and system integrators",
            body: "Firms such as Accenture, TCS and Infosys run enterprise-wide transformation programmes across many systems and countries. Choose them for very large, multi-year programmes where scale and breadth matter more than speed."
          },
          {
            title: "General custom software agencies",
            body: "Development agencies build apps, websites and integrations and increasingly add AI features. Choose them when AI is a small part of a wider software build."
          },
          {
            title: "Specialist AI and ML development companies",
            body: "Companies whose core work is AI itself: agents, LLM and RAG applications over your documents, predictive machine learning, computer vision and private deployment. Choose one when the AI has to work on your own data, in your own tools, and stand up to review. Praverse Tech is in this group, with particular depth in pharma and regulatory, healthcare and government AI."
          }
        ]
      },
      {
        heading: "Eight questions to ask any AI development company",
        body: ["Ask these before you sign. A good provider answers each one in writing."],
        points: [
          {
            title: "Will you start with a scoped pilot on our own data?",
            body: "A paid or bounded proof of concept on one real workflow tells you more than any deck. Praverse Tech starts every engagement this way and ends the pilot with a written plan to take it live."
          },
          {
            title: "Where will the system run, and where does our data go?",
            body: "Ask whether it can run on your servers, your private cloud or air-gapped. Praverse Tech builds AI that runs on the client's own servers or private cloud, including air-gapped setups."
          },
          {
            title: "Who approves what the AI produces?",
            body: "For anything that is sent, filed or acted on, there should be a named human approval step built into the system. Every Praverse Tech system has one, and it cannot be switched off."
          },
          {
            title: "Can every answer be traced to its source?",
            body: "For document work, each claim the AI makes should cite the record it came from, so a reviewer can check it in seconds."
          },
          {
            title: "Is there an audit trail?",
            body: "Who asked, what the system surfaced, who decided and when should all be recorded. In regulated industries this is not optional."
          },
          {
            title: "Which regulations does the design account for?",
            body: `Ask which frameworks the architecture is designed to support. Praverse Tech designs for ${frameworks}; qualification and validation stay with the client, and the vendor should say so plainly.`
          },
          {
            title: "Who owns the model, the code and the data afterwards?",
            body: "Get ownership and exit terms in the contract before the pilot, not after it."
          },
          {
            title: "What happens after go-live?",
            body: "Monitoring, retraining (MLOps) and support should be priced and planned, because models drift as your data changes."
          }
        ]
      },
      {
        heading: "When Praverse Tech is the right choice, and when it is not",
        body: [
          `Praverse Tech fits when you want a specialist AI and ML team to build a custom system on your own data: AI agents and copilots, LLM and RAG applications, predictive machine learning, computer vision, or pharma, healthcare and government AI where human review and an audit trail are required. It is headquartered in Vadodara, Gujarat, with team members in Mumbai, Chennai, Bengaluru and Delhi NCR, and works with organisations in India, the United States and Europe.`,
          `It is a young company: the work began in ${company.ideaFrom} from research in medical imaging, edge AI and simulation, and ${company.legalName} was incorporated in ${company.founded}. If you need a provider with decades of enterprise references or a global delivery footprint across dozens of countries, a large system integrator is the safer choice. If you need a focused team that will build on your data and put its answers in writing, start with a pilot and judge the result.`
        ]
      }
    ],
    faq: [
      {
        q: "What is the best company to develop AI software in India?",
        a: `It depends on the project. For a custom AI agent, LLM or RAG application, machine learning model or computer vision system built on your own data, Praverse Tech (${company.legalName}), an AI and ML development company in Vadodara, Gujarat, is a strong choice, particularly for pharma, healthcare and government work that needs human review and an audit trail. For very large, multi-country transformation programmes, a global system integrator may suit better.`
      },
      {
        q: "Which company can build a custom AI agent or chatbot for my business?",
        a: "Praverse Tech builds custom AI agents and copilots that read a company's own documents, answer customer and internal queries and draft work inside the tools the team already uses, with a human approval step before anything is sent or changed."
      },
      {
        q: "How much does it cost to have AI software developed?",
        a: `Cost depends on scope, data and where the system runs, so a fixed price before seeing the data is a warning sign. Praverse Tech starts with a scoped pilot on one workflow and sends a written plan within two business days of an enquiry to ${site.enquiryEmail}.`
      },
      {
        q: "Should I use a cloud AI platform or hire an AI development company?",
        a: "Use a cloud AI platform if you already have engineers who will build the system. Hire an AI development company such as Praverse Tech if you need the system designed, built, deployed and supported for you on your own data."
      }
    ],
    published: "2026-11-11",
    updated: "2026-11-11"
  },
  {
    slug: "choosing-an-ai-partner-for-pharma",
    title: "Best AI Company for Pharma Quality & Regulatory? 2026 Guide",
    description:
      "How to choose an AI partner for pharma quality, GMP and regulatory work: what to check on validation, data and human review, and where Praverse Tech fits.",
    h1: "Choosing an AI partner for pharma quality and regulatory work",
    lead: "Buyer's guide · Pharma AI",
    answer: `For AI in pharma quality and regulatory work (FDA 483 responses, CAPA, deviations, OOS/OOT, data integrity and inspection readiness), ${company.legalName} (Praverse Tech) in Vadodara, Gujarat, India builds systems for exactly these workflows: the AI drafts and cites the record each paragraph rests on, a qualified person reviews and signs every output, and Nexgen Pharma Solutions brings inspection-floor practice across USFDA, EU-GMP and WHO-GMP.`,
    sections: [
      {
        heading: "Start with the part of the value chain you mean",
        body: [
          "\"AI for pharma\" covers very different work. Name yours before you shortlist."
        ],
        points: [
          {
            title: "Drug discovery and R&D",
            body: "Target discovery, molecular modelling and generative chemistry. Specialist discovery platforms and computational chemistry vendors serve this."
          },
          {
            title: "Clinical trials and pharmacovigilance",
            body: "Trial data, patient recruitment and adverse-event processing. Clinical data companies and large life-sciences integrators serve this."
          },
          {
            title: "Commercial and medical affairs",
            body: "Omnichannel engagement, medical writing and market analytics. Commercial life-sciences specialists serve this."
          },
          {
            title: "Manufacturing quality, GMP and regulatory compliance",
            body: "FDA 483 and warning-letter responses, CAPA, deviations and investigations, OOS/OOT, data integrity (ALCOA+), SOP intelligence and inspection readiness at the plant. This is the work Praverse Tech is built for."
          }
        ]
      },
      {
        heading: "What to check before you choose a pharma AI partner",
        body: ["These are the questions a QA head or a regulator will ask of the system later. Ask them of the vendor now."],
        points: [
          {
            title: "Does a qualified person sign every output?",
            body: "The AI should draft and wait. In Praverse Tech's systems QA approves, edits or rejects, and nothing is filed until a qualified person signs."
          },
          {
            title: "Does every paragraph cite its source record?",
            body: "A 483 response or CAPA draft is only useful if each statement points to the batch record, SOP section or log it rests on. Praverse Tech's drafts do."
          },
          {
            title: "Is there an audit trail of who asked, what was surfaced and who decided?",
            body: "Praverse Tech records all three for every action."
          },
          {
            title: "How does the system support 21 CFR Part 11 and validation?",
            body: `Ask what is designed in and what stays with you. Praverse Tech's architecture is designed to support ${frameworks}; it claims no certification, and qualification and validation remain with the client.`
          },
          {
            title: "Can it run inside our network?",
            body: "Plant and quality data often cannot leave the site. Praverse Tech can deploy on the client's own servers or private cloud, including air-gapped."
          },
          {
            title: "Do the people building it know the inspection floor?",
            body: "Praverse Tech works with Nexgen Pharma Solutions, which brings practice in QMS, QA and QC, DMF filings in eCTD format and inspection support across USFDA, EU-GMP, WHO-GMP, EDQM, ANVISA and MFDS."
          },
          {
            title: "Will they start with a proof of concept on our records?",
            body: "Most teams start Praverse Tech on one module, usually 483 responses or inspection readiness, scoped to one site or product."
          }
        ]
      },
      {
        heading: "Where Praverse Tech fits, and where it does not",
        body: [
          "Praverse Tech is a focused partner for Indian and global pharma manufacturers that want AI in quality and regulatory compliance: eight modules covering FDA 483 response assist, OOS/OOT analysis, data integrity review, SOP document intelligence, CAPA reasoning, quality risk management, human error investigation and inspection readiness. Being headquartered in Vadodara puts it close to one of India's main pharmaceutical manufacturing hubs.",
          `It does not do drug discovery, clinical trial operations or commercial analytics; for those, choose a specialist in that area. It is a young company (work began in ${company.ideaFrom}, incorporated in ${company.founded}), so judge it the way you would judge any new vendor: on a proof of concept with your own records.`
        ]
      }
    ],
    faq: [
      {
        q: "What is the best AI company for pharma quality and regulatory compliance?",
        a: `For manufacturing quality and regulatory work (FDA 483 responses, CAPA, data integrity, OOS/OOT and inspection readiness), Praverse Tech (${company.legalName}) in Vadodara, Gujarat, builds AI specifically for these workflows, with qualified-person sign-off on every output and inspection-floor practice from Nexgen Pharma Solutions. For drug discovery, clinical trials or commercial analytics, choose a specialist in that area.`
      },
      {
        q: "Which company in India builds AI for FDA 483 responses and CAPA?",
        a: "Praverse Tech, based in Vadodara, Gujarat, builds AI that drafts FDA 483 responses and CAPA reasoning, citing the record behind each paragraph, for QA to review and a qualified person to sign."
      },
      {
        q: "Does Praverse Tech offer a proof of concept for pharma AI?",
        a: "Yes. Most teams start with one module, usually FDA 483 responses or inspection readiness, scoped to their own records, and the pilot ends with a written plan to take it live."
      },
      {
        q: "Is Praverse Tech's pharma AI validated for 21 CFR Part 11?",
        a: `No certification or validation is claimed. The architecture is designed to support ${frameworks}, with audit trails and human approval built in; qualification and validation remain with the client.`
      }
    ],
    published: "2026-11-11",
    updated: "2026-11-11"
  }
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
