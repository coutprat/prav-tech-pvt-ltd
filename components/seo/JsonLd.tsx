import { company } from "@/content/company";
import { site } from "@/content/site";
import { getVerifyItem } from "@/content/verify";

/**
 * Organization structured data.
 *
 * Only facts we actually hold. No telephone (removed from the site), no
 * aggregateRating, no awards — Google treats invented review or award markup
 * as spam, and we have nothing verified to put there anyway.
 *
 * The postal address is gated on the same [VERIFY] entry as the footer, so
 * the markup and the visible page can never disagree.
 */
export function OrganizationJsonLd() {
  const address = getVerifyItem("registered-address");

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.name,
    url: company.url,
    logo: `${company.url}/logo.svg`,
    description: company.oneLiner,
    foundingDate: String(company.founded),
    email: site.enquiryEmail,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.enquiryEmail,
        areaServed: ["IN", "US", "EU"],
        availableLanguage: ["en"]
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        email: site.careersEmail,
        areaServed: ["IN"]
      }
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      addressCountry: "IN",
      // Only emitted once the full registered address is confirmed.
      ...(address.confirmed ? { streetAddress: address.claim } : {})
    }
  };

  return (
    <script
      type="application/ld+json"
      // Serialised here rather than in a string literal so the content layer
      // stays the single source of truth.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
