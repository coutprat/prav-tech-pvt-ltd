import { businessLines, company, portfolio } from "@/content/company";
import { reachLadder, testTools, transceiverFacts } from "@/content/interconnect";
import { site } from "@/content/site";
import { getVerifyItem } from "@/content/verify";
import { getRoute } from "@/lib/routes";

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
  const address = getVerifyItem("registered-address");

  return (
    <Ld
      data={{
        "@type": "Organization",
        "@id": ORG_ID,
        name: company.legalName,
        alternateName: company.name,
        url: company.url,
        logo: `${company.url}/logo.svg`,
        description: company.oneLiner,
        // The legal entity's date, which is what schema.org means by this. The
        // 2023 start of the work is a story, not an incorporation.
        foundingDate: String(company.founded),
        email: site.enquiryEmail,
        sameAs: [company.linkedIn],
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
      }}
    />
  );
}

/* ----------------------------------------------------------- breadcrumbs */

function breadcrumb(path: string): Node {
  const page = getRoute(path);
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: getRoute("/").name, item: `${company.url}/` },
      { "@type": "ListItem", position: 2, name: page.name, item: `${company.url}${page.path}` }
    ]
  };
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
  switch (path) {
    case "/enterprise-ai":
      return [
        service(
          path,
          line("enterprise-ai").title,
          "Enterprise AI agents, copilots, RAG search and production ML",
          "Agents, copilots, RAG search and production ML inside real workflows — with a human gate and an audit trail in the architecture.",
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
    case "/photonics":
      return [interconnectProducts()];
    default:
      return [];
  }
}

/**
 * Breadcrumbs plus whatever a page has of its own (a Service, the photonics
 * product list). One line in each page: <PageJsonLd path="/pharma" />.
 */
export function PageJsonLd({ path }: { path: string }) {
  const nodes = [...(path === "/" ? [] : [breadcrumb(path)]), ...pageNodes(path)];
  if (!nodes.length) return null;
  return <Ld data={nodes} />;
}
