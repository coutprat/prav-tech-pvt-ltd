export const navigation = [
  { label: "Enterprise AI", href: "/enterprise-ai" },
  { label: "Pharma AI", href: "/pharma" },
  { label: "MENNIE", href: "/mennie" },
  { label: "Photonics", href: "/photonics" },
  { label: "Research", href: "/research" },
  { label: "Company", href: "/company" }
] as const;

/** Footer-only links: real pages that are deliberately out of the main nav. */
export const footerNav = {
  work: [
    { label: "Enterprise AI", href: "/enterprise-ai" },
    { label: "Pharma AI", href: "/pharma" },
    { label: "MENNIE", href: "/mennie" },
    { label: "Photonics", href: "/photonics" }
  ],
  company: [
    { label: "Company", href: "/company" },
    { label: "Research", href: "/research" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Start a project", href: "/start-a-project" }
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" }
  ]
} as const;
