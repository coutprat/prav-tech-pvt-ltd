/**
 * Industries Praverse Tech builds for.
 *
 * These describe where the work applies, not who has bought it: no client
 * names, no results. The same list renders on the Enterprise AI page and feeds
 * the structured data and llms.txt, so the visible page and the markup agree.
 */
export const industries = [
  {
    name: "Healthcare & life sciences",
    use: "Patient intake, imaging support, clinical documentation and pharma regulatory work."
  },
  {
    name: "Manufacturing & industrial",
    use: "Visual inspection, predictive maintenance, quality documentation and SOP search."
  },
  {
    name: "Banking, finance & insurance",
    use: "Document review, KYC and claims triage, and explainable forecasting."
  },
  {
    name: "Retail & e-commerce",
    use: "Demand forecasting, catalogue and support copilots, and customer-service agents."
  },
  {
    name: "Logistics & supply chain",
    use: "Document extraction, route and inventory analytics, and exception-handling agents."
  },
  {
    name: "Energy & utilities",
    use: "Asset monitoring, anomaly detection and field-report search."
  },
  {
    name: "Education & training",
    use: "Knowledge assistants, content search and learner-support copilots."
  },
  {
    name: "Government & public sector",
    use: "Privacy-preserving, on-site AI for records, case files and citizen services."
  },
  {
    name: "Legal & professional services",
    use: "Contract review, research assistants and knowledge search across matter files."
  }
] as const;
