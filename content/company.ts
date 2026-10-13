/**
 * Single source of truth for company facts.
 * Every figure here comes from Section 9 of the redesign brief.
 * Do not add facts that are not in that section. Anything unconfirmed is
 * marked `verify` and must be rendered through <Verify>.
 */

export const company = {
  name: "Praverse Tech",
  legalName: "Praverse Tech Pvt Ltd",
  url: "https://praversetech.com",
  founded: 2023,
  hq: "Vadodara, Gujarat, India",
  markets: "India, US, Europe",
  /** Founder's address. Enquiry + careers routing lives in content/site.ts. */
  email: "pratham@praversetech.com",
  linkedIn: "https://www.linkedin.com/company/praverse-tech",
  tagline: "Engineering human-centred intelligence.",
  oneLiner:
    "Enterprise AI for healthcare, pharma and regulated industries — and the high-speed interconnect layer for India's sovereign AI data centres.",
  principle:
    "AI should not replace experts. It should amplify them. The system drafts. Your team decides.",
  promise: "Tell us the problem. You get a written plan within two business days."
} as const;

export const businessLines = [
  {
    id: "enterprise-ai",
    n: "01",
    href: "/enterprise-ai",
    title: "Enterprise AI & Agents",
    blurb:
      "Agents, copilots, RAG search and production ML inside real workflows.",
    tags: ["Agents", "RAG", "MLOps"],
    motif: "gate" as const
  },
  {
    id: "pharma",
    n: "02",
    href: "/pharma",
    title: "Pharma & Regulatory AI",
    blurb:
      "FDA 483 responses, CAPA, data integrity and inspection readiness — every output expert-reviewed.",
    tags: ["GMP", "21 CFR 211", "ICH"],
    motif: "thread" as const
  },
  {
    id: "mennie",
    n: "03",
    href: "/mennie",
    title: "Healthcare AI",
    blurb: "MENNIE plus imaging and screening support.",
    tags: ["MENNIE", "Imaging", "Edge AI"],
    motif: "wave" as const
  },
  {
    id: "photonics",
    n: "04",
    href: "/photonics",
    title: "Photonics & AI Data Centres",
    blurb:
      "High-speed copper and optical interconnect for India's sovereign AI data centres.",
    tags: ["800G", "1.6T", "India partner"],
    motif: "pulse" as const
  }
] as const;

export const pillars = [
  {
    title: "Evidence-based review",
    body: "Every claim an agent makes points back to the document it came from."
  },
  {
    title: "Audit trails by default",
    body: "Who asked, what was surfaced, who decided — recorded as the system runs."
  },
  {
    title: "Expert judgment first",
    body: "Outputs are drafts. A qualified person signs off before anything counts."
  }
] as const;

export const howWeWork = [
  {
    step: "Discover",
    body: "We sit with the workflow as it actually runs and find where the time goes."
  },
  {
    step: "Design",
    body: "We scope the smallest system that changes the outcome, and write it down."
  },
  {
    step: "Build",
    body: "We build against your data, with review gates in the architecture."
  },
  {
    step: "Deploy & evolve",
    body: "We ship into the workflow, measure, and keep tuning with your team."
  }
] as const;

/* ---------------------------------------------------------------- Enterprise AI */

export const capabilities = [
  {
    title: "Machine learning & applied AI",
    body: "NLP, predictive ML and MLOps built for production, not notebooks."
  },
  {
    title: "AI agents & copilots",
    body: "Agents that work inside your tools, with a human gate before action."
  },
  {
    title: "Document intelligence",
    body: "RAG, knowledge graphs and search across the documents you already have."
  },
  {
    title: "Vision & medical imaging",
    body: "Fundus, ultrasound, inspection and multimodal models."
  },
  {
    title: "Decision intelligence",
    body: "Dashboards and forecasting that explain how they got there."
  },
  {
    title: "Federated & edge AI",
    body: "Privacy-preserving training, on-site inference, DPDP-aware by design."
  }
] as const;

export const agentTypes = [
  {
    title: "Document review",
    body: "Reads long documents and surfaces what a reviewer needs to decide."
  },
  {
    title: "Regulatory & research",
    body: "483 drafting and guidance tracking, with sources attached."
  },
  {
    title: "Data analysis",
    body: "Plain-English questions, explainable answers."
  },
  {
    title: "Knowledge search",
    body: "One question across wikis, drives and tickets."
  }
] as const;

export const agentFlow = [
  "Your data & documents",
  "Praverse agent",
  "Expert review",
  "Action & audit trail"
] as const;

/* ---------------------------------------------------------------------- Pharma */

export const pharmaModules = [
  { title: "FDA 483 response assist", entry: true },
  { title: "OOS/OOT analysis", entry: false },
  { title: "Data integrity review (ALCOA+)", entry: false },
  { title: "Document intelligence (SOPs)", entry: false },
  { title: "CAPA reasoning", entry: false },
  { title: "Quality risk management", entry: false },
  { title: "Human error investigation", entry: false },
  { title: "Inspection readiness", entry: true }
] as const;

export const pharmaPipeline = [
  "Ingest",
  "Analyse",
  "Draft",
  "Review",
  "Archive"
] as const;

export const pharmaStandards = [
  "USFDA 21 CFR 211",
  "ICH Q9",
  "ICH Q10",
  "ALCOA+"
] as const;

export const pharmaDisclaimer =
  "All AI outputs are drafts that need final review by qualified personnel. No diagnosis, compliance guarantee or automated decision-making is implied.";

/**
 * Architecture features mapped to the regimes they are designed to support.
 * Wording is deliberately "designed to support" — this is not a claim of
 * certification or compliance.
 */
export const regulatedMarkets = {
  frameworks: [
    "GDPR",
    "EU AI Act",
    "HIPAA",
    "21 CFR Part 11",
    "India DPDP Act 2023"
  ],
  rows: [
    { feature: "Audit trail", support: [true, true, true, true, true] },
    { feature: "Data residency", support: [true, true, true, false, true] },
    { feature: "Human approval", support: [true, true, false, true, true] },
    { feature: "Access control", support: [true, false, true, true, true] },
    { feature: "Encryption", support: [true, false, true, true, true] },
    { feature: "On-prem / edge option", support: [true, true, true, false, true] }
  ]
} as const;

/* ---------------------------------------------------------------------- MENNIE */

export const mennie = {
  expansion:
    "Medical Empowerment and Neural Navigation Intelligence Engine",
  summary:
    "A voice-first assistant that meets patients at the door, the kiosk or on their phone, and hands clinicians a structured picture.",
  features: [
    {
      title: "Voice-first intake",
      body: "Multilingual, conversational, no form to fill in."
    },
    {
      title: "Doctor matching support",
      body: "Routes the patient to the right specialty and tells them where to go."
    },
    {
      title: "Smart reminders",
      body: "Follow-ups that arrive when they are useful."
    },
    {
      title: "Clinician-ready summaries",
      body: "A structured picture waiting before the consultation starts."
    }
  ],
  hudSteps: [
    {
      tag: "Good morning. How can I help you today?",
      meaning: "Voice-first intake"
    },
    {
      tag: "Cardiology OPD · Level 2 · about 8 min",
      meaning: "Routing to the right specialty"
    },
    {
      tag: "Reminder: follow-up visit on Friday",
      meaning: "Smart reminders"
    },
    {
      tag: "Summary shared with your doctor",
      meaning: "Clinician-ready summary"
    }
  ],
  surfaces: [
    {
      title: "Lobby kiosk",
      body: "Meets the patient at the door and starts the intake."
    },
    {
      title: "Phone",
      body: "The same conversation continues before and after the visit."
    },
    {
      title: "Clinician summary",
      body: "A structured card in the clinician's hands, not a transcript."
    }
  ],
  deployment: [
    { phase: "Phase 1", title: "Private beta", status: "Now" },
    { phase: "Phase 2", title: "Pilot workflows", status: "Next" },
    { phase: "Phase 3", title: "Institutional rollout", status: "Later" }
  ],
  conceptCaption:
    "Concept visualisation. The MENNIE assistive robot is in research and development.",
  disclaimer:
    "MENNIE supports care workflows under clinical oversight. It does not diagnose, treat or replace medical professionals."
} as const;

/* -------------------------------------------------------------------- Research */

export const trackRecord = [
  {
    year: "2023",
    title: "Netra Sakhi",
    body: "Virtual eye-care assistant — real-time edge AI for ophthalmic screening in low-resource settings."
  },
  {
    year: "2023",
    title: "DME detection",
    body: "CNN grading Diabetic Macular Edema from fundus images."
  },
  {
    year: "2024",
    title: "PCOS screening",
    body: "Ultrasound combined with EHR signals."
  },
  { year: "Now", title: "MENNIE", body: "Voice-first patient assistant." }
] as const;

export const publications = [
  { venue: "IEEE Transactions on Medical Imaging", year: "2023" },
  { venue: "Scopus-indexed conference — Netra Sakhi", year: "2023" },
  {
    venue:
      "International Journal of Robotics & Automation — NEAT autonomous-driving simulation",
    year: "2024"
  }
] as const;

export const exploratoryTracks = [
  { title: "Biochip", body: "Organ-on-chip research direction." },
  { title: "Physical AI", body: "Embodied systems and simulation." },
  { title: "AIoT", body: "Sensing and inference at the edge." },
  {
    title: "Federated & secure AI",
    body: "Training without moving the data."
  }
] as const;

/* ------------------------------------------------------------------- Photonics */

export const photonicsChapters = [
  "Copper inside the rack.",
  "Optics across the hall.",
  "400G → 800G → 1.6T."
] as const;

export const reachChart = [
  { label: "DAC", metres: 3, note: "Passive, in-rack" },
  { label: "ACC", metres: 5, note: "Linear redriver" },
  { label: "AEC", metres: 9, note: "Retimer / DSP" },
  { label: "AOC", metres: 100, note: "Active optical" },
  { label: "Single-mode optics", metres: 2000, note: "Across the hall" }
] as const;

export const portfolio = [
  {
    title: "DAC",
    sub: "Direct attach copper",
    body: "Passive, in-rack.",
    speeds: "400G · 800G"
  },
  {
    title: "ACC",
    sub: "Active copper cable",
    body: "Linear redriver.",
    speeds: "400G · 800G"
  },
  {
    title: "AEC",
    sub: "Active electrical cable",
    body: "Retimer / DSP.",
    speeds: "800G up to 9 m"
  },
  {
    title: "AOC",
    sub: "Active optical cable",
    body: "Optical reach inside the hall.",
    speeds: "400G · 800G"
  },
  {
    title: "Optical transceivers",
    sub: "Multi-mode and single-mode",
    body: "Pluggable optics across form factors.",
    speeds: "400G · 800G · 1.6T"
  },
  {
    title: "Fibre cable assemblies",
    sub: "Structured fibre",
    body: "Trunks and breakouts for the spine.",
    speeds: "—"
  }
] as const;

export const formFactors = [
  "SFP",
  "QSFP",
  "QSFP112",
  "QSFP-DD",
  "OSFP",
  "OSFP-XD"
] as const;

export const speedRoadmap = [
  { speed: "400G", status: "Installed base" },
  { speed: "800G", status: "Mainstream for AI clusters" },
  { speed: "1.6T", status: "Ramping" },
  { speed: "3.2T", status: "Next" }
] as const;

export const dcCapacity = {
  actuals: [
    { year: "2020", gw: 0.375 },
    { year: "2025", gw: 1.5 }
  ],
  forecasts2030: [
    { source: "Savills", gw: 4.0 },
    { source: "Colliers", gw: 4.5 },
    { source: "Wood Mackenzie", gw: 12.0 }
  ],
  sources:
    "MeitY (2020 and 2025 actuals, Mar 2026); Savills India (Jul 2025); Colliers (May 2025); Wood Mackenzie via IANS (Jul 2026). Forecasts differ widely — treat 2030 as a range."
} as const;

export const whySovereign = [
  {
    title: "Data stays under Indian law",
    body: "Built around the DPDP Act 2023."
  },
  {
    title: "Resilient domestic supply",
    body: "Design-in and qualification happen in India."
  },
  { title: "Engineers and support in India", body: "On the same clock as you." }
] as const;

export const photonicsMilestones = [
  {
    stage: "NOW",
    title: "Supply & design-in",
    body: "Architecture, design-in and integration with our US technology partner."
  },
  {
    stage: "NEXT",
    title: "Indian test & qualification",
    body: "Local testing and qualification capability."
  },
  {
    stage: "LATER",
    title: "Localised assembly",
    body: "Assembly in India as volumes justify it."
  }
] as const;

/* ---------------------------------------------------------------------- People */

export const people = [
  {
    slug: "pratham-shrivastav",
    name: "Pratham Shrivastav",
    role: "Founder & CEO, Praverse Tech Pvt Ltd",
    proof: [
      "Founded Praverse in 2023 to take healthcare AI from research to product.",
      "Peer-reviewed work in imaging, edge AI and simulation.",
      "Leads pharma AI, MENNIE and photonics."
    ]
  },
  {
    slug: "vishal-jajodia",
    name: "Vishal Jajodia",
    role: "Strategic Advisor; Managing Director, SWATI Spentose (V-Group, est. 1952)",
    proof: [
      "30+ years in specialty pharma, formulation to global regulatory strategy.",
      "IDMA-APTAR Innovation of the Year 2022 (Pentosan Polysulfate Sodium).",
      "Advises Praverse on pharma and regulatory direction."
    ]
  },
  {
    slug: "ashwani-shrivastav",
    name: "Ashwani Shrivastav",
    role: "Managing Director, Nexgen Pharma Solutions Pvt Ltd",
    proof: [
      "Pharma quality expert: QMS, QA, QC and DMF filings in eCTD format.",
      "Inspection support across USFDA, EU-GMP, WHO-GMP, EDQM, ANVISA and MFDS (Korea).",
      "Advises Praverse on quality systems."
    ]
  }
] as const;

export const partners = [
  {
    name: "Infraeo Inc. (USA)",
    role: "Technology partner",
    body: "AI-cluster copper and optical interconnect."
  },
  {
    name: "SWATI Spentose",
    role: "Pharma advisory",
    body: "V-Group, est. 1952. USFDA, EU-GMP, PMDA Japan and WHO-GMP approvals; three units in Vapi, Gujarat."
  }
] as const;

export const founderStory = [
  "Praverse started in 2023 with a narrow question: why does so much healthcare AI stop at the paper?",
  "The research was real — screening models that worked on real fundus images, in clinics without reliable power or bandwidth. What was missing was the unglamorous half: the workflow it had to live inside, the reviewer who had to sign it off, the audit trail somebody would ask for two years later.",
  "So the company was built around that half. Everything we ship assumes a qualified person is going to read it, disagree with some of it, and need to show their working. That holds whether the output is a 483 response, a patient summary, or a link budget for a data-centre row."
] as const;
