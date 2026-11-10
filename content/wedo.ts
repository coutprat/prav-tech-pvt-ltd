/**
 * "We build X for Y" — the specialised offers on each line's page and on the
 * home page.
 *
 * Sourced from the founder's project record (the Praverse Brain vault,
 * November 2026). `backed` marks an offer with real built or in-development
 * work behind it; those are described generically, because most of that work
 * is client work under confidentiality. No client, product or figure from that
 * work is named here, and nothing claims validation, certification or a
 * deployment the record does not show.
 */

export type WeDo = {
  /** Reads as "We build …". */
  title: string;
  /** For whom, and what changes for them. */
  body: string;
  /** Status as the record shows it, for the small tag under the offer. */
  backed?: "Built" | "In use" | "In development" | "Pilot stage" | "Research";
};

export const weDo: Record<"ent" | "pha" | "men" | "pho" | "sov", WeDo[]> = {
  ent: [
    {
      title: "evidence-linked document Q&A for teams buried in records",
      body: "Every answer points to the page it came from, and the system says “not found” instead of guessing. Built for archives of tens of thousands of pages.",
      backed: "Built",
    },
    {
      title:
        "private language models, fine-tuned on your data and hosted where you choose",
      body: "Open-weight models adapted to your domain and served on your own hardware or a GPU cloud you pick — including clouds in India.",
      backed: "Built",
    },
    {
      title: "operations suites that retire the spreadsheets",
      body: "Attendance with face-recognition punch-in, leave, payroll, expenses, invoicing and client records in one console for the people who run the business.",
      backed: "In use",
    },
    {
      title: "GST-ready billing, challan and document generation",
      body: "Invoices, quotations, delivery challans and proformas with the CGST, SGST and IGST split, HSN codes and financial-year numbering done right.",
      backed: "In use",
    },
    {
      title: "AI agents with a human approval on every outgoing action",
      body: "Agents that read, plan and draft at machine speed, and queue anything that would send, file or change something for a named person.",
    },
    {
      title: "evaluation harnesses and release gates for AI",
      body: "Frozen test sets, control questions and go/no-go criteria, so you know whether a model is ready before your users find out.",
      backed: "Built",
    },
  ],
  pha: [
    {
      title:
        "AI that turns FDA inspection history into answers a QA team can verify",
      body: "Fifteen-plus years of 483 observations, warning letters and inspection reports, searchable in plain language, every answer traceable to the source page.",
      backed: "In development",
    },
    {
      title: "root-cause and CAPA reference tools",
      body: "The precedent record returned verbatim, with anything AI-assisted clearly labelled, so investigators reason from evidence rather than from a summary.",
      backed: "In development",
    },
    {
      title: "submission-readiness tooling for ANDA and DMF teams",
      body: "Dosage-form checklists, gap analysis against agency deficiency patterns, and doer–reviewer–approver workflows with a full audit trail.",
      backed: "In development",
    },
    {
      title: "compliant field-force apps for medical representatives",
      body: "Consent-gated call capture, AI-assisted call notes, adverse-event routing and a manager command centre — with privacy enforced inside the database itself.",
      backed: "In development",
    },
    {
      title:
        "patient-support and pharmacovigilance apps for specialty therapies",
      body: "Dose reminders, refills, safety reporting that works offline, and data hosted in India — built without a word of medical advice.",
      backed: "Pilot stage",
    },
    {
      title: "Part 11-aware QMS foundations",
      body: "Document control, quality events and training designed against enterprise QMS benchmarks and a 21 CFR Part 11 / GAMP 5 validation plan.",
      backed: "In development",
    },
  ],
  men: [
    {
      title:
        "voice-first patient intake that hands the clinician a structured summary",
      body: "Patients speak in their own words; the doctor receives complaints, history and red flags in a form they can read in seconds.",
      backed: "In development",
    },
    {
      title: "triage routing with hard-coded emergency overrides",
      body: "Rules, not a language model, decide the red flags, so an emergency is never left to a probability.",
      backed: "In development",
    },
    {
      title:
        "hospital navigation assistants grounded in each hospital’s own data",
      body: "Departments, timings and directions answered from the hospital’s own master data, so the assistant never invents a ward.",
      backed: "In development",
    },
    {
      title: "digital-therapeutic and adherence apps",
      body: "Symptom diaries, trigger tracking, reminders and clinician-sent questionnaires for chronic conditions.",
      backed: "Pilot stage",
    },
    {
      title: "on-premise healthcare AI stacks",
      body: "Speech, language models and retrieval packaged to run inside a hospital’s own infrastructure, on Kubernetes.",
    },
    {
      title: "edge-deployable biosignal models",
      body: "Compact models for signals such as EEG, small enough to run on an edge device beside the patient.",
      backed: "Research",
    },
  ],
  pho: [
    {
      title: "interconnect plans for 800G and 1.6T AI clusters",
      body: "Reach, medium and form factor chosen per link — DAC, ACC, AEC, AOC or pluggable optics — with our US technology partner.",
    },
    {
      title: "design-in and qualification support in India",
      body: "Help taking an interconnect bill of materials from evaluation samples to a supported deployment.",
    },
    {
      title: "sizing tools for cluster interconnect, power and cooling",
      body: "Models that show what a GPU build needs before the purchase order, not after.",
    },
  ],
  sov: [
    {
      title: "AI that runs inside India",
      body: "Inference hosted on Indian GPU infrastructure for engagements that require it, so sensitive data does not leave the country.",
      backed: "Built",
    },
    {
      title: "open-weight model stacks you own",
      body: "Models fine-tuned and served on your hardware, with no dependency on a foreign API at run time.",
      backed: "Built",
    },
    {
      title: "technical and financial models for AI data-centre programmes",
      body: "Power, water, land, phasing and jobs modelled to investment grade, for sponsors and planners of large AI compute programmes.",
    },
    {
      title: "the interconnect inside the build",
      body: "Copper and optical links at 800G and 1.6T, designed in and supported for clusters built in India.",
    },
  ],
};
