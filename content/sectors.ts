/**
 * Sectors: where Praverse Tech's enterprise AI practice applies.
 *
 * Each entry generates one page at /industries/<slug> and one card on the home
 * page and the /industries hub. These describe what we build and how, not who
 * has bought it: no client names, no results, no invented case studies. Where
 * related work exists it is described generically in `proof`, and only when
 * it is real.
 *
 * The five flagship lines (Enterprise AI, Pharma, MENNIE, Photonics, Sovereign
 * AI data centres) keep their own pages; healthcare, pharma and government
 * cards on the hub link there instead of to a sector page.
 */

export type SectorIcon =
  | "bank"
  | "factory"
  | "cart"
  | "truck"
  | "bolt"
  | "leaf"
  | "cap"
  | "scale"
  | "crane"
  | "tower"
  | "spark"
  | "bed"
  | "cross"
  | "flask"
  | "pillar";

export type Sector = {
  slug: string;
  name: string;
  icon: SectorIcon;
  /** Card line: what we do there, in one sentence. */
  short: string;
  /** Two or three "We build X for Y" services for the card. */
  card: string[];
  /** Page h1 (without the em word) and lede. */
  headline: string;
  em: string;
  lede: string;
  /** Services on the page. */
  services: { title: string; body: string }[];
  /** Concrete use cases, one line each. */
  useCases: string[];
  /** Systems and techniques behind them. */
  systems: string[];
  /** Real related work, described generically. Empty when there is none. */
  proof?: string[];
  /** Flagship lines this sector draws on. */
  lines: { href: string; label: string }[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
};

const ENT = { href: "/enterprise-ai", label: "Enterprise AI & Agents" };
const SOV = {
  href: "/sovereign-ai-data-centres",
  label: "Sovereign AI data centres",
};
const GOV = { href: "/government", label: "Government & public sector" };
const PHA = { href: "/pharma", label: "Pharma & Regulatory AI" };

/** Questions every sector page answers the same way. */
const common = (sector: string) => [
  {
    q: `How does an AI project for ${sector} start?`,
    a: "With one workflow and your own data. You describe the problem in plain language and receive a written plan within two business days: what we would build, what it needs from you, and where it may not work yet.",
  },
  {
    q: "Can it run on our own servers?",
    a: "Yes. We build for on-premise and private-cloud deployment, so sensitive data can stay inside your own network rather than travelling to a third-party service.",
  },
  {
    q: "Who is accountable for what the AI produces?",
    a: "A named person on your side. Our systems draft, check and recommend; anything that is sent, filed or changed waits for a reviewer, and every step is recorded.",
  },
];

export const sectors: Sector[] = [
  {
    slug: "banking-finance-insurance",
    name: "Banking, finance & insurance",
    icon: "bank",
    short:
      "KYC, credit, claims and fraud review that moves faster and stays explainable.",
    card: [
      "KYC and onboarding document checks for banks and NBFCs",
      "Claims triage and fraud-signal review for insurers",
      "Explainable credit-risk and collections models for lenders",
    ],
    headline: "AI for banking, finance and insurance that a",
    em: "regulator can follow",
    lede: "Lenders, insurers and fintechs run on documents and judgement calls. We build systems that read the file, check it against policy and draft the decision — and show their working to the officer who signs it, and to the auditor who asks later.",
    services: [
      {
        title: "KYC and onboarding automation",
        body: "Extraction and cross-checking of identity, address and business documents, with mismatches surfaced for a reviewer instead of silently passed.",
      },
      {
        title: "Claims triage for insurers",
        body: "Claims read, classified and routed on arrival, with missing documents and fraud signals flagged before an adjuster opens the file.",
      },
      {
        title: "Explainable credit and risk models",
        body: "Credit, collections and early-warning models whose every score comes with the factors behind it, so the decision can be defended.",
      },
      {
        title: "Policy and compliance copilots",
        body: "Plain-English questions answered from circulars, policies and product notes, each answer linked to the clause it came from.",
      },
    ],
    useCases: [
      "Loan file pre-screening against credit policy",
      "Bank-statement and financial-statement analysis",
      "Claims document completeness checks",
      "Transaction-pattern and fraud-signal review",
      "Regulatory circular search and change summaries",
      "Customer-service agents with human hand-off",
    ],
    systems: [
      "Document AI and OCR",
      "Retrieval over policy and circulars",
      "Gradient-boosted and explainable ML",
      "Agent workflows with review gates",
      "On-premise deployment",
    ],
    lines: [ENT, SOV],
    faq: [
      {
        q: "Can the models explain an individual decision?",
        a: "Yes. We build credit and risk models so that every output carries the factors that drove it, in language a credit officer can repeat to a customer or an auditor.",
      },
      ...common("a bank, NBFC or insurer"),
    ],
    seo: {
      title: "Banking, Finance & Insurance AI in India",
      description:
        "KYC automation, claims triage, explainable credit-risk models and compliance copilots for banks, NBFCs, insurers and fintechs — built with a human gate.",
    },
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Industry 4.0",
    icon: "factory",
    short:
      "Vision inspection, predictive maintenance and SOP search on the shop floor.",
    card: [
      "Vision-based quality inspection for production lines",
      "Predictive maintenance from machine and sensor data",
      "SOP and work-instruction copilots for operators",
    ],
    headline: "Manufacturing AI that works",
    em: "on the line",
    lede: "Plants already capture images, sensor readings and maintenance logs. We turn them into inspection that never tires, maintenance that arrives before the breakdown, and answers an operator can get without leaving the machine.",
    services: [
      {
        title: "Visual quality inspection",
        body: "Defect detection, counting and measurement from the cameras you have or the ones we specify, with uncertain parts routed to a person.",
      },
      {
        title: "Predictive maintenance",
        body: "Models on vibration, temperature and run-hour data that rank which asset needs attention next, and why.",
      },
      {
        title: "Shop-floor knowledge copilots",
        body: "SOPs, work instructions and troubleshooting guides searchable in plain language, on a tablet or a kiosk at the line.",
      },
      {
        title: "Inventory and production analytics",
        body: "Stock, box and batch tracking with demand and consumption forecasts that planners can read and adjust.",
      },
    ],
    useCases: [
      "Surface-defect and assembly checks",
      "Label, print and packaging verification",
      "Downtime and failure prediction",
      "Batch and quality documentation drafting",
      "Inventory and packaging-material tracking",
      "Operator Q&A over SOPs in local languages",
    ],
    systems: [
      "Computer vision at the edge",
      "Time-series ML",
      "Retrieval over SOPs",
      "Dashboards and alerts",
      "On-site inference",
    ],
    lines: [ENT, PHA],
    faq: [
      {
        q: "Do we need new cameras or sensors?",
        a: "Often not. We start from the images and data you already capture, and specify additional hardware only where the existing signal is not good enough.",
      },
      ...common("a manufacturer"),
    ],
    seo: {
      title: "Manufacturing AI & Industry 4.0 in India",
      description:
        "Vision quality inspection, predictive maintenance, SOP copilots and inventory analytics for Indian manufacturers — deployed on-site, reviewed by your team.",
    },
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & e-commerce",
    icon: "cart",
    short:
      "Forecasting, catalogue and support agents that sell more with less manual work.",
    card: [
      "Demand forecasting and replenishment for retailers",
      "Catalogue enrichment and product-content generation",
      "Customer-support agents for online stores",
    ],
    headline: "Retail AI that knows the",
    em: "shelf and the cart",
    lede: "Retail margins are made in forecasting, catalogue quality and service. We build models and agents that plan stock, write and fix product content, and answer customers — with a person approving anything that changes a price or a promise.",
    services: [
      {
        title: "Demand forecasting and replenishment",
        body: "Store- and SKU-level forecasts with the drivers shown, feeding replenishment suggestions a planner approves.",
      },
      {
        title: "Catalogue and content generation",
        body: "Product titles, descriptions and attributes drafted from supplier data and images, checked for consistency before they go live.",
      },
      {
        title: "Customer-support agents",
        body: "Order, return and product questions answered from your own policies and order data, with clean hand-off to a person.",
      },
      {
        title: "Billing, GST and document automation",
        body: "Invoice, quotation and GST-ready document generation wired into the systems you already use.",
      },
    ],
    useCases: [
      "SKU-level demand and promotion forecasting",
      "Product attribute extraction from images",
      "Review and return-reason analysis",
      "Support-ticket triage and drafted replies",
      "GST invoice and quotation generation",
      "Search and recommendation tuning",
    ],
    systems: [
      "Forecasting ML",
      "Vision and LLM content pipelines",
      "Support agents with retrieval",
      "Document generation",
      "Analytics dashboards",
    ],
    lines: [ENT],
    faq: [
      {
        q: "Will generated product content be published automatically?",
        a: "Only if you choose that. By default drafted content waits in a review queue, and every change is logged with who approved it.",
      },
      ...common("a retailer or online store"),
    ],
    seo: {
      title: "Retail & E-commerce AI Solutions, India",
      description:
        "Demand forecasting, catalogue generation, customer-support agents and GST document automation for retailers and e-commerce brands in India.",
    },
  },
  {
    slug: "logistics-supply-chain",
    name: "Logistics & supply chain",
    icon: "truck",
    short:
      "Document extraction, exception handling and inventory visibility across the chain.",
    card: [
      "Shipping and customs document extraction for forwarders",
      "Exception-handling agents for delayed or mismatched orders",
      "Inventory and route analytics for distributors",
    ],
    headline: "Supply-chain AI for the",
    em: "exceptions",
    lede: "Most logistics cost hides in the exceptions: the mismatched invoice, the missing document, the late container. We build systems that read the paperwork, spot what is off and draft the fix for the person who owns it.",
    services: [
      {
        title: "Logistics document intelligence",
        body: "Bills of lading, invoices, packing lists and e-way bills read and reconciled, with mismatches queued for review.",
      },
      {
        title: "Exception-handling agents",
        body: "Delays, shortages and damage claims detected early, with a drafted response and the evidence attached.",
      },
      {
        title: "Inventory and warehouse analytics",
        body: "Stock, box and pallet tracking with reorder and slow-mover signals a planner can act on.",
      },
      {
        title: "Route and demand analytics",
        body: "Forecasts and route analysis that show the trade-offs, not just a number.",
      },
    ],
    useCases: [
      "Three-way match of PO, invoice and delivery",
      "Customs and shipping document checks",
      "Delay prediction and customer notifications",
      "Warehouse inventory reconciliation",
      "Freight-cost and lane analysis",
      "Supplier communication drafting",
    ],
    systems: [
      "Document AI",
      "Agent workflows",
      "Forecasting ML",
      "Inventory systems",
      "Dashboards",
    ],
    lines: [ENT],
    faq: [...common("a logistics or distribution business")],
    seo: {
      title: "Logistics & Supply Chain AI in India",
      description:
        "Logistics document extraction, exception-handling agents, inventory and route analytics for forwarders, distributors and 3PLs in India.",
    },
  },
  {
    slug: "energy-utilities",
    name: "Energy & utilities",
    icon: "bolt",
    short: "Asset monitoring, anomaly detection and field-report intelligence.",
    card: [
      "Anomaly detection on grid, plant and pipeline data",
      "Field-inspection report search and summarisation",
      "Asset-health scoring for maintenance planning",
    ],
    headline: "Energy AI that watches the",
    em: "assets",
    lede: "Utilities and energy companies run large, ageing, distributed assets and generate more inspection data than anyone can read. We build the models that watch the readings and the copilots that read the reports.",
    services: [
      {
        title: "Anomaly detection",
        body: "Models on SCADA, meter and sensor data that flag unusual behaviour early and rank it by consequence.",
      },
      {
        title: "Field-report intelligence",
        body: "Inspection notes, photos and work orders made searchable and summarised by asset, site or failure mode.",
      },
      {
        title: "Asset-health and maintenance planning",
        body: "Health scores that combine readings, history and inspection findings into a maintenance priority list.",
      },
      {
        title: "Secure, on-site deployment",
        body: "Systems that run inside an operational network, with no data leaving the site unless you allow it.",
      },
    ],
    useCases: [
      "Transformer and substation monitoring",
      "Solar and wind performance analysis",
      "Meter-data anomaly and loss detection",
      "Inspection photo classification",
      "Regulatory and safety document search",
      "Outage-report summarisation",
    ],
    systems: [
      "Time-series ML",
      "Computer vision",
      "Retrieval over reports",
      "Edge and on-premise inference",
    ],
    lines: [ENT, SOV],
    faq: [...common("an energy or utility company")],
    seo: {
      title: "Energy & Utilities AI Solutions, India",
      description:
        "Anomaly detection, asset-health scoring and field-report intelligence for power, renewables and utility operators — deployable inside your own network.",
    },
  },
  {
    slug: "agritech",
    name: "Agriculture & agritech",
    icon: "leaf",
    short:
      "Crop, yield and advisory AI that reaches farmers in their own language.",
    card: [
      "Crop-health and disease detection from field images",
      "Voice and local-language advisory assistants for farmers",
      "Yield and procurement forecasting for agri-businesses",
    ],
    headline: "Agritech AI that",
    em: "reaches the field",
    lede: "Agriculture needs AI that works on a basic phone, in a local language, with patchy connectivity. We build image, voice and forecasting systems for agri-businesses, FPOs and programmes that serve farmers.",
    services: [
      {
        title: "Crop-health detection",
        body: "Disease, pest and stress detection from phone or drone images, with uncertain cases referred to an agronomist.",
      },
      {
        title: "Farmer advisory assistants",
        body: "Voice-first assistants in local languages that answer from approved agronomy content, not the open internet.",
      },
      {
        title: "Yield and procurement forecasting",
        body: "Forecasts that help processors and traders plan procurement, storage and logistics.",
      },
    ],
    useCases: [
      "Leaf-image disease identification",
      "Advisory over IVR, WhatsApp or app",
      "Procurement and price forecasting",
      "Warehouse and cold-chain monitoring",
      "Scheme and subsidy information assistants",
    ],
    systems: [
      "Computer vision on mobile",
      "Voice AI",
      "Forecasting ML",
      "Offline-capable apps",
    ],
    lines: [ENT, GOV],
    faq: [...common("an agri-business or farmer programme")],
    seo: {
      title: "Agritech & Agriculture AI in India",
      description:
        "Crop-health detection, local-language farmer advisory assistants and yield forecasting for agri-businesses, FPOs and farmer programmes in India.",
    },
  },
  {
    slug: "education",
    name: "Education & edtech",
    icon: "cap",
    short:
      "Learning platforms, tutors and content tools that teachers stay in charge of.",
    card: [
      "Learning-management systems with AI course tools",
      "Curriculum-grounded tutoring assistants for students",
      "Assessment drafting and evaluation support for teachers",
    ],
    headline: "Education AI that keeps the",
    em: "teacher in charge",
    lede: "Schools, universities and training teams need AI that answers from the syllabus and helps teachers, not one that replaces judgement. We build learning platforms, tutors and assessment tools grounded in your own material.",
    services: [
      {
        title: "Learning-management platforms",
        body: "Course delivery, progress tracking and certification, with AI tools for building and updating content.",
      },
      {
        title: "Curriculum-grounded tutors",
        body: "Assistants that answer only from approved course material and say when a question is outside it.",
      },
      {
        title: "Assessment support",
        body: "Question banks, rubrics and first-pass evaluation drafted for a teacher to review and finalise.",
      },
      {
        title: "Training for regulated teams",
        body: "Compliance and SOP training with tracked completion, built for audit.",
      },
    ],
    useCases: [
      "Course and module authoring",
      "Student doubt resolution",
      "Answer-sheet first-pass evaluation",
      "Corporate and compliance training",
      "Multilingual content adaptation",
    ],
    systems: [
      "LMS platforms",
      "Retrieval over course content",
      "LLM drafting with review",
      "Web and mobile apps",
    ],
    lines: [ENT],
    faq: [...common("a school, university or training team")],
    seo: {
      title: "Education AI & LMS Development, India",
      description:
        "Learning-management systems, curriculum-grounded AI tutors and assessment tools for schools, universities, edtechs and corporate training teams.",
    },
  },
  {
    slug: "legal-compliance",
    name: "Legal & compliance",
    icon: "scale",
    short:
      "Contract review, research and compliance tracking with every answer cited.",
    card: [
      "Contract review and clause extraction for legal teams",
      "Regulatory-change tracking for compliance functions",
      "Research assistants over case files and matter documents",
    ],
    headline: "Legal AI where every answer",
    em: "cites its source",
    lede: "Legal and compliance work cannot tolerate an answer without a source. We build review and research systems that quote the clause, the circular or the page — and leave the conclusion to the lawyer.",
    services: [
      {
        title: "Contract review",
        body: "Clause extraction, deviation from your playbook and risk flags, each linked to the paragraph it came from.",
      },
      {
        title: "Regulatory-change tracking",
        body: "New circulars and rules summarised and mapped to the policies and controls they affect.",
      },
      {
        title: "Matter and research assistants",
        body: "Search and Q&A across case files, opinions and precedents within your own document store.",
      },
      {
        title: "Audit-ready documentation",
        body: "Drafting of compliance reports and responses with the evidence trail attached.",
      },
    ],
    useCases: [
      "NDA and vendor-contract first review",
      "Obligation and renewal tracking",
      "Due-diligence document review",
      "Policy-to-regulation mapping",
      "Inspection and audit response drafting",
    ],
    systems: [
      "Retrieval with citations",
      "Document AI",
      "LLM drafting with review",
      "Private deployment",
    ],
    lines: [ENT, PHA],
    faq: [...common("a legal or compliance team")],
    seo: {
      title: "Legal & Compliance AI in India",
      description:
        "Contract review, regulatory-change tracking and research assistants for legal and compliance teams — every answer cited, every decision left to a person.",
    },
  },
  {
    slug: "real-estate-construction",
    name: "Real estate & construction",
    icon: "crane",
    short:
      "Project documents, site progress and sales enquiries handled faster.",
    card: [
      "Drawing, BOQ and contract document search for project teams",
      "Site-progress and safety checks from photos",
      "Enquiry and booking assistants for developers",
    ],
    headline: "Construction AI that reads the",
    em: "drawings and the site",
    lede: "Projects drown in drawings, BOQs, contracts and site photos. We build tools that make that paper searchable, check progress and safety from images, and answer buyer enquiries around the clock.",
    services: [
      {
        title: "Project document intelligence",
        body: "Drawings, BOQs, specifications and contracts searchable in plain language, with change tracking.",
      },
      {
        title: "Site progress and safety vision",
        body: "Photo-based progress tracking and PPE or hazard detection, with findings queued for the site engineer.",
      },
      {
        title: "Sales and booking assistants",
        body: "Enquiry handling, site-visit booking and document collection for developers and brokers.",
      },
    ],
    useCases: [
      "BOQ and specification Q&A",
      "Contract clause and variation tracking",
      "Site-photo progress reports",
      "Safety-compliance detection",
      "Lead qualification and visit booking",
    ],
    systems: [
      "Document AI",
      "Computer vision",
      "Booking and CRM integrations",
      "Web and mobile apps",
    ],
    lines: [ENT],
    faq: [...common("a developer or construction company")],
    seo: {
      title: "Real Estate & Construction AI, India",
      description:
        "Project-document search, site-progress and safety vision, and enquiry and booking assistants for developers, contractors and brokers in India.",
    },
  },
  {
    slug: "telecom",
    name: "Telecom & networks",
    icon: "tower",
    short:
      "Network analytics, support automation and the interconnect AI clusters need.",
    card: [
      "Network-fault prediction and ticket triage for operators",
      "Customer-care agents with human hand-off",
      "800G and 1.6T interconnect for AI and data-centre builds",
    ],
    headline: "Telecom AI from the",
    em: "network to the care desk",
    lede: "Operators and network providers sit on huge volumes of alarms, tickets and customer conversations — and are now building AI compute themselves. We build the analytics and agents, and supply the interconnect.",
    services: [
      {
        title: "Network analytics",
        body: "Alarm correlation and fault prediction that cut noise and point engineers at the root cause.",
      },
      {
        title: "Customer-care automation",
        body: "Agents for plan, billing and fault queries, grounded in your own systems and handing off cleanly.",
      },
      {
        title: "AI data-centre interconnect",
        body: "Copper and optical interconnect at 800G and 1.6T for operators building AI and edge compute.",
      },
    ],
    useCases: [
      "Alarm de-duplication and correlation",
      "Ticket classification and routing",
      "Churn-risk analysis",
      "Field-engineer knowledge assistants",
      "Interconnect design-in for GPU clusters",
    ],
    systems: [
      "Time-series ML",
      "Support agents",
      "Retrieval over runbooks",
      "DAC, ACC, AEC, AOC and optics",
    ],
    lines: [
      ENT,
      { href: "/photonics", label: "Photonics & AI Data Centres" },
      SOV,
    ],
    faq: [...common("a telecom operator or network provider")],
    seo: {
      title: "Telecom & Network AI Solutions, India",
      description:
        "Network-fault prediction, customer-care agents and 800G/1.6T AI data-centre interconnect for telecom operators and network providers in India.",
    },
  },
  {
    slug: "media-marketing",
    name: "Media & marketing",
    icon: "spark",
    short:
      "Generative AI for content, campaigns and insight — with brand control.",
    card: [
      "Brand-safe generative content pipelines for marketing teams",
      "Campaign and audience analytics for agencies",
      "Archive search and tagging for media libraries",
    ],
    headline: "Generative AI for media that stays",
    em: "on brand",
    lede: "Generative AI can multiply output, or multiply mistakes. We build content pipelines with your brand rules, approved claims and review steps built in, plus the analytics to see what works.",
    services: [
      {
        title: "Generative content pipelines",
        body: "Copy, images and variants generated from your brand guidelines and approved claims, routed through review.",
      },
      {
        title: "Campaign analytics",
        body: "Performance and audience analysis that explains what moved, not just what happened.",
      },
      {
        title: "Media archive intelligence",
        body: "Tagging, transcription and search across video, audio and image libraries.",
      },
    ],
    useCases: [
      "Ad and social variant generation",
      "Localisation into Indian languages",
      "Video transcription and clip search",
      "Brand-compliance checks before publishing",
      "Competitor and trend monitoring",
    ],
    systems: [
      "LLM and image generation",
      "Review workflows",
      "Speech-to-text",
      "Analytics dashboards",
    ],
    lines: [ENT],
    faq: [...common("a media company, brand or agency")],
    seo: {
      title: "Generative AI for Media & Marketing",
      description:
        "Brand-safe generative content pipelines, campaign analytics and media-archive search for brands, agencies and publishers in India.",
    },
  },
  {
    slug: "hospitality-travel",
    name: "Hospitality & travel",
    icon: "bed",
    short:
      "Booking, guest service and demand forecasting that feel personal at scale.",
    card: [
      "Booking and reservation assistants for hotels and clinics",
      "Multilingual guest-service agents",
      "Demand and pricing forecasts for revenue teams",
    ],
    headline: "Hospitality AI that feels",
    em: "personal at scale",
    lede: "Guests expect instant, accurate answers in their own language. We build booking and service assistants that know your properties and policies, and the forecasting revenue teams use to plan.",
    services: [
      {
        title: "Booking and reservation assistants",
        body: "Availability, booking and change requests handled over web, WhatsApp or voice, integrated with your booking system.",
      },
      {
        title: "Guest-service agents",
        body: "Multilingual answers from your own property information, with requests routed to the right team.",
      },
      {
        title: "Demand and pricing forecasts",
        body: "Occupancy and demand forecasts with the drivers shown, for revenue managers to act on.",
      },
    ],
    useCases: [
      "Reservation and appointment booking",
      "Pre-arrival and concierge requests",
      "Review and feedback analysis",
      "Group and event enquiry handling",
      "Occupancy forecasting",
    ],
    systems: [
      "Booking integrations",
      "Conversational agents",
      "Forecasting ML",
      "Web and mobile apps",
    ],
    lines: [ENT],
    faq: [...common("a hotel, travel or hospitality business")],
    seo: {
      title: "Hospitality & Travel AI in India",
      description:
        "Booking assistants, multilingual guest-service agents and demand forecasting for hotels, travel companies and hospitality groups in India.",
    },
  },
];

/** Hub cards that link to flagship pages instead of a sector page. */
export const flagshipSectors: {
  name: string;
  icon: SectorIcon;
  short: string;
  card: string[];
  href: string;
}[] = [
  {
    name: "Healthcare",
    icon: "cross",
    short:
      "Patient intake, imaging support and clinical documentation — led by MENNIE.",
    card: [
      "Voice-first patient intake for hospitals and clinics",
      "Imaging and screening support at the edge",
      "Clinical documentation drafting for doctors",
    ],
    href: "/mennie",
  },
  {
    name: "Pharma & life sciences",
    icon: "flask",
    short: "FDA 483 responses, CAPA, data integrity and inspection readiness.",
    card: [
      "FDA 483 response drafting for pharma QA teams",
      "CAPA and deviation reasoning support",
      "Data-integrity and inspection-readiness review",
    ],
    href: "/pharma",
  },
  {
    name: "Government & public sector",
    icon: "pillar",
    short:
      "Sovereign, on-premise AI for records, inspections and citizen services.",
    card: [
      "Air-gapped and India-hosted AI deployments",
      "Inspection and audit intelligence for regulators",
      "Document automation for e-governance",
    ],
    href: "/government",
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);
