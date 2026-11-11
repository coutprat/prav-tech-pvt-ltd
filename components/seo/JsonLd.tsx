import { businessLines, company, people, portfolio } from "@/content/company";
import { FACTS, FOUNDER_SAME_AS, HOURS, HOME_FAQ, PAGES, SAME_AS, SERVICE_LINES, SUMMARY } from "@/lib/answers";
import { industries } from "@/content/industries";
import { reachLadder, testTools, transceiverFacts } from "@/content/interconnect";
import { site } from "@/content/site";
import { getVerifyItem } from "@/content/verify";
import { getRoute } from "@/lib/routes";
import { getSector, sectors } from "@/content/sectors";
import { govOffers } from "@/content/government";

/**
 * Structured data.
 *
 * Only facts we actually hold, and only facts the visible page already says.
 * No telephone (removed from the site), no aggregateRating, reviews, awards or
 * prices — Google treats invented review or award markup as spam, and we have
 * nothing verified to put there anyway. Anything gated by a [VERIFY] entry on
 * the page is gated by the same entry here, so the markup and the visible page
 * can never disagree.
 *
 * Nothing here may name the US interconnect partner: the site does not, so the
 * markup does not either.
 */

const ORG_ID = `${company.url}/#organization`;
const org = { "@id": ORG_ID };

type Node = Record<string, unknown>;

function Ld({ data }: { data: Node | Node[] }) {
  const body = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      // Serialised here rather than in a string literal so the content layer
      // stays the single source of truth. `<` is escaped so no string in the
      // content can close the script element early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(body).replace(/</g, "\\u003c") }}
    />
  );
}

/* ---------------------------------------------------------- organization */

/**
 * The postal address is gated on the same [VERIFY] entry as the footer.
 * Rendered once, in the root layout; every other node points at it by @id.
 */
export function OrganizationJsonLd() {
  const p = FACTS.postal;

  return (
    <Ld
      data={{
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: company.legalName,
        alternateName: company.name,
        url: company.url,
        logo: `${company.url}/logo.svg`,
        description: SUMMARY,
        // The legal entity's date, which is what schema.org means by this. The
        // 2023 start of the work is a story, not an incorporation.
        foundingDate: String(company.founded),
        identifier: [
          ...(FACTS.cin ? [{ "@type": "PropertyValue", propertyID: "CIN", value: FACTS.cin }] : []),
          ...(FACTS.gstin ? [{ "@type": "PropertyValue", propertyID: "GSTIN", value: FACTS.gstin }] : [])
        ],
        ...(FACTS.gstin ? { taxID: FACTS.gstin } : {}),
        ...(FACTS.phone ? { telephone: FACTS.phone } : {}),
        image: `${company.url}/og/home.jpg`,
        email: site.enquiryEmail,
        slogan: company.tagline,
        ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
        founder: { "@id": `${company.url}/#founder` },
        areaServed: ["IN", "US", "EU"],
        knowsAbout: [
          "Enterprise AI",
          "AI and machine learning development",
          "Custom AI solutions for any industry",
          "Generative AI and LLM application development",
          "Machine learning model development",
          "Computer vision",
          "MLOps",
          "AI agents",
          "AI copilots",
          "Document intelligence",
          "Manufacturing AI",
          "Banking and insurance AI",
          "Retail AI",
          "Logistics AI",
          "Retrieval-augmented generation",
          "Pharmaceutical regulatory AI",
          "FDA 483 response",
          "CAPA",
          "Data integrity",
          "Healthcare AI",
          "Medical imaging AI",
          "AI data-centre interconnect",
          "800G and 1.6T optical transceivers",
          "Sovereign AI data centres in India",
          "AI for government and the public sector",
          ...sectors.map((x) => `AI for ${x.name.toLowerCase()}`)
        ],
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
          addressLocality: p.addressLocality,
          addressRegion: p.addressRegion,
          addressCountry: p.addressCountry,
          // Only emitted once the full registered address is confirmed.
          ...(p.streetAddress ? { streetAddress: p.streetAddress } : {}),
          ...(p.postalCode ? { postalCode: p.postalCode } : {})
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: HOURS.days.map((d) => `https://schema.org/${d}`),
            opens: HOURS.opens,
            closes: HOURS.closes
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${company.name} services`,
          itemListElement: SERVICE_LINES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.description,
              url: `${company.url}${s.path}`,
              provider: org
            }
          }))
        }
      }}
    />
  );
}

/** WebSite and the founder, rendered once in the root layout. */
export function SiteJsonLd() {
  const f = people[0];
  return (
    <Ld
      data={[
        {
          "@type": "WebSite",
          "@id": `${company.url}/#website`,
          url: company.url,
          name: company.name,
          description: SUMMARY,
          inLanguage: "en-IN",
          publisher: org
        },
        {
          "@type": "Person",
          "@id": `${company.url}/#founder`,
          name: f.name,
          jobTitle: FACTS.founder.title,
          worksFor: org,
          sameAs: FOUNDER_SAME_AS
        }
      ]}
    />
  );
}

/** FAQPage: the questions are rendered on the home page from the same list. */
export function FaqJsonLd() {
  return (
    <Ld
      data={{
        "@type": "FAQPage",
        "@id": `${company.url}/#faq`,
        mainEntity: HOME_FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      }}
    />
  );
}

/* ----------------------------------------------------------- breadcrumbs */

function breadcrumb(path: string): Node {
  // Every ancestor that is itself a canonical route, then the page.
  const parts = path.split("/").filter(Boolean);
  const trail = ["/", ...parts.map((_, i) => `/${parts.slice(0, i + 1).join("/")}`)].map(getRoute);
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name,
      item: `${company.url}${r.path === "/" ? "/" : r.path}`
    }))
  };
}

function faqPage(path: string, items: readonly { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${company.url}${path}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}

/** A sector page: one Service per offer, grouped, plus the page's FAQ. */
function sectorNodes(path: string): Node[] {
  const s = getSector(path.replace("/industries/", ""));
  if (!s) return [];
  return [
    {
      "@type": "Service",
      "@id": `${company.url}${path}#service`,
      name: `AI solutions for ${s.name.toLowerCase()}`,
      serviceType: `${s.name} AI development and consulting`,
      description: s.seo.description,
      url: `${company.url}${path}`,
      provider: org,
      areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
      audience: { "@type": "BusinessAudience", name: s.name },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${s.name} AI services`,
        itemListElement: s.services.map((x) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: x.title, description: x.body, provider: org }
        }))
      }
    }
  ];
}

/* -------------------------------------------------------------- services */

function service(path: string, name: string, serviceType: string, description: string, areaServed: string[]): Node {
  return {
    "@type": "Service",
    "@id": `${company.url}${path}#service`,
    name,
    serviceType,
    description,
    url: `${company.url}${path}`,
    provider: org,
    areaServed
  };
}

const line = (id: (typeof businessLines)[number]["id"]) => businessLines.find((l) => l.id === id)!;

/* ---------------------------------------------------- photonics products */

const prop = (name: string, value: string) => ({ "@type": "PropertyValue", name, value });

function interconnectProducts(): Node {
  const url = `${company.url}/photonics`;
  // The AEC reach is shown on the page through <Verify id="aec-reach">.
  const aecConfirmed = getVerifyItem("aec-reach").confirmed;
  const fact = (head: string) => transceiverFacts.find((f) => f.head === head)?.cells[0];

  const ladder = (medium: string) => reachLadder.find((r) => r.medium === medium);
  const card = (title: string) => portfolio.find((p) => p.title === title);

  const families: { id: string; name: string; card?: (typeof portfolio)[number]; rung?: (typeof reachLadder)[number]; extra?: Node[] }[] = [
    { id: "dac", name: "Direct attach copper (DAC) cables", card: card("DAC"), rung: ladder("DAC") },
    { id: "acc", name: "Active copper cables (ACC)", card: card("ACC"), rung: ladder("ACC") },
    { id: "aec", name: "Active electrical cables (AEC)", card: card("AEC"), rung: aecConfirmed ? ladder("AEC") : undefined },
    { id: "aoc", name: "Active optical cables (AOC)", card: card("AOC"), rung: ladder("AOC") },
    {
      id: "transceivers",
      name: "Pluggable optical transceivers",
      card: card("Optical transceivers"),
      rung: ladder("Pluggable optics"),
      extra: [
        ["Data rates", fact("Data rates")],
        ["Architectures", fact("Architectures")],
        ["Form factors", fact("Form factors")]
      ]
        .filter((x): x is [string, string] => Boolean(x[1]))
        .map(([n, v]) => prop(n, v))
    }
  ];

  const products: Node[] = families.map((f) => {
    const props: Node[] = [];
    if (f.rung) {
      props.push(prop("Built on", f.rung.builtOn));
      // Only real distances: the ladder uses "—" and "Coming" for gaps.
      const r800: string = f.rung.r800;
      const r1600: string = f.rung.r1600;
      if (/\d/.test(r800)) props.push(prop("Reach at 800G", r800));
      if (/\d/.test(r1600)) props.push(prop("Reach at 1.6T", r1600));
    }
    props.push(...(f.extra ?? []));
    const description = [f.card?.sub, f.card?.body, f.rung?.use].filter(Boolean).join(". ").replace(/\.\./g, ".");
    return {
      "@type": "Product",
      "@id": `${url}#${f.id}`,
      name: f.name,
      category: "AI data-centre interconnect",
      description,
      url,
      brand: { "@type": "Brand", name: company.name },
      ...(props.length ? { additionalProperty: props } : {})
    };
  });

  products.push({
    "@type": "Product",
    "@id": `${url}#loopback`,
    name: testTools.title,
    category: "AI data-centre interconnect test equipment",
    description: testTools.body,
    url,
    brand: { "@type": "Brand", name: company.name }
  });

  return {
    "@type": "ItemList",
    "@id": `${url}#interconnect`,
    name: `AI data-centre interconnect supplied by ${company.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((item, i) => ({ "@type": "ListItem", position: i + 1, item }))
  };
}

/* --------------------------------------------------------------- per page */

/** Page-specific nodes, keyed by canonical path. */
function pageNodes(path: string): Node[] {
  if (path.startsWith("/industries/")) return sectorNodes(path);
  switch (path) {
    case "/industries":
      return [
        {
          "@type": "ItemList",
          "@id": `${company.url}/industries#sectors`,
          name: `Industries ${company.name} builds AI for`,
          itemListElement: sectors.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${company.url}/industries/${s.slug}`
          }))
        }
      ];
    case "/government":
      return [
        {
          "@type": "Service",
          "@id": `${company.url}/government#service`,
          name: "AI and digital infrastructure for government and the public sector",
          serviceType: "Sovereign AI, e-governance automation and public-sector AI systems",
          description:
            "Sovereign and air-gapped AI deployments, inspection and audit intelligence, public-health platforms, e-governance document automation and data-centre interconnect for national compute.",
          url: `${company.url}/government`,
          provider: org,
          areaServed: [{ "@type": "Country", name: "India" }],
          audience: { "@type": "GovernmentOrganization", name: "Government departments, regulators and public-sector undertakings" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Public-sector services",
            itemListElement: govOffers.map((x) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: x.title, description: x.body, provider: org }
            }))
          }
        }
      ];
    case "/enterprise-ai":
      return [
        service(
          path,
          line("enterprise-ai").title,
          "AI and machine learning development",
          `Custom AI agents, copilots, RAG search and production ML for ${industries.map((i) => i.name.toLowerCase()).join(", ")} — with a human gate and an audit trail in the architecture.`,
          ["IN", "US", "EU"]
        )
      ];
    case "/pharma":
      return [
        service(
          path,
          line("pharma").title,
          "Pharmaceutical regulatory and quality AI",
          "FDA 483 responses, CAPA, data integrity and inspection readiness. AI-drafted, expert-reviewed, and traceable to the evidence.",
          ["IN", "US", "EU"]
        )
      ];
    case "/sovereign-ai-data-centres":
      return [
        service(
          path,
          "Interconnect for sovereign AI data centres",
          "AI data-centre interconnect architecture, design-in, qualification and support",
          "Architecture, design-in, integration, qualification and support for the copper and optical interconnect of AI clusters built in India. Praverse Tech supplies and designs in the interconnect; it does not operate data centres.",
          ["IN"]
        )
      ];
    case "/mennie":
      return [
        service(
          path,
          "MENNIE, voice-first patient assistant",
          "Healthcare AI: voice-first patient intake and clinician-ready summaries",
          "MENNIE meets patients at the door, the kiosk or on their phone and hands clinicians a structured summary. In research and development; it does not diagnose, treat or replace medical professionals.",
          ["IN"]
        )
      ];
    case "/photonics":
      return [
        service(
          path,
          line("photonics").title,
          "AI data-centre copper and optical interconnect supply and design-in",
          "800G and 1.6T DAC, ACC, AEC and AOC cables and pluggable optical transceivers for AI clusters in India, supplied and designed in today, with Indian manufacturing on a staged roadmap.",
          ["IN"]
        ),
        interconnectProducts()
      ];
    default:
      return [];
  }
}

/**
 * Breadcrumbs plus whatever a page has of its own (a Service, the photonics
 * product list). One line in each page: <PageJsonLd path="/pharma" />.
 */
export function PageJsonLd({ path }: { path: string }) {
  // The home FAQ is emitted by <FaqJsonLd />; every other page's FAQ comes
  // from lib/answers.ts, the same list its visible FAQ section renders.
  const faq = path === "/" ? undefined : PAGES[path]?.faq;
  const nodes = [
    ...(path === "/" ? [] : [breadcrumb(path)]),
    ...pageNodes(path),
    ...(faq?.length ? [faqPage(path, faq)] : [])
  ];
  if (!nodes.length) return null;
  return <Ld data={nodes} />;
}
