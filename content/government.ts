/**
 * Government & public sector.
 *
 * A cross-cutting page, not a new line: every offer here is one of the five
 * lines applied to a public-sector buyer. No department, PSU or regulator is
 * named as a client, and no empanelment or certification is claimed; those
 * live in content/verify.ts and appear only once confirmed.
 */

export const govOffers = [
  {
    title: "Sovereign and air-gapped AI",
    body: "Language models, retrieval and agents deployed inside a department's own data centre or an isolated network, with no dependency on a foreign API at run time.",
    line: {
      href: "/sovereign-ai-data-centres",
      label: "Sovereign AI data centres",
    },
  },
  {
    title: "Inspection and audit intelligence for regulators",
    body: "Systems that read inspection reports, observations and responses, check them against the rules and surface what an inspector should look at first — the same engineering as our pharma 483 work.",
    line: { href: "/pharma", label: "Pharma & Regulatory AI" },
  },
  {
    title: "Public-health and patient platforms",
    body: "Voice-first intake and screening support for hospitals, health centres and outreach programmes, built to hand a clinician a structured picture rather than replace one.",
    line: { href: "/mennie", label: "MENNIE" },
  },
  {
    title: "E-governance document automation",
    body: "Applications, case files, certificates and grievances read, classified and routed, with drafted replies waiting for the officer who signs them.",
    line: { href: "/enterprise-ai", label: "Enterprise AI & Agents" },
  },
  {
    title: "Interconnect for national AI compute",
    body: "Copper and optical interconnect at 800G and 1.6T for state and national GPU clusters, supplied and designed in with our US technology partner.",
    line: { href: "/photonics", label: "Photonics & AI Data Centres" },
  },
  {
    title: "Field-staff and chain-of-custody apps",
    body: "Offline-first, geotagged field apps and attendance with face recognition, so a programme can show verified work on the ground rather than activity counts.",
    line: { href: "/enterprise-ai", label: "Enterprise AI & Agents" },
  },
  {
    title: "Planning models for AI infrastructure programmes",
    body: "Technical and financial models for large AI data-centre programmes — power, water, land, phasing and jobs — prepared to the standard an investment committee expects.",
    line: {
      href: "/sovereign-ai-data-centres",
      label: "Sovereign AI data centres",
    },
  },
  {
    title: "Programme-scale integration",
    body: "Multi-department rollouts planned in phases — pilot, evaluation, scale — with the review gates, audit trail and handover documentation a public programme has to show.",
    line: { href: "/start-a-project", label: "Start a project" },
  },
] as const;

/** What a public buyer can rely on, all of it architecture rather than claims. */
export const govPrinciples = [
  {
    title: "A named officer decides",
    body: "Our systems draft, check and recommend. Nothing is sent, filed or changed until a named person approves it, and the approval is recorded.",
  },
  {
    title: "An audit trail by design",
    body: "Who asked, what the system read, what it drafted and who decided — written as the work happens, ready for an RTI, an audit or an inquiry.",
  },
  {
    title: "Deployable on your premises",
    body: "On-premise and air-gapped deployment, so citizen data stays inside the department's own infrastructure.",
  },
  {
    title: "Built in India",
    body: "Designed, engineered and supported from Vadodara, aligned with the Make in India and Atmanirbhar Bharat push for domestic digital and compute capability.",
  },
] as const;

export const govFaq = [
  {
    q: "Can your AI systems run without internet access?",
    a: "Yes. We build for on-premise and air-gapped deployment, using models that run on the department's own hardware, so nothing depends on an external service at run time.",
  },
  {
    q: "How do you handle procurement documents and RFPs?",
    a: "Send the RFP or expression of interest to our enquiry inbox. We respond with a capability statement, a compliance view of the requirements and, where it fits, a proposal.",
  },
  {
    q: "How does a government AI project usually start?",
    a: "With a scoped pilot on one workflow and the department's own data, evaluated against agreed criteria before any wider rollout.",
  },
  {
    q: "Who is accountable for what the AI produces?",
    a: "The officer who approves it. The system drafts and recommends; the decision, and the record of it, stay with a named person.",
  },
] as const;
