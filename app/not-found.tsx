import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHead } from "@/components/pv/kit";
import { navigation } from "@/data/navigation";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "Page not found — Praverse Tech" },
  description: "That page does not exist. Here is where everything else lives.",
  robots: { index: false, follow: true }
};

/**
 * 404.
 *
 * Until now this fell through to the raw Next.js default — unstyled, no
 * navigation, no way back. It is the first impression for anyone following a
 * stale link, an old business card or a mistyped URL, and several real routes
 * from the previous site redirect through here if a redirect is ever missed.
 *
 * So it gets the same page head as everything else and, more importantly, a
 * route out: the full navigation, not a lone "go home" button that forces the
 * visitor to start their search again.
 *
 * Deliberately noindex, follow — the links still pass, the page itself should
 * never appear in a result.
 */
export default function NotFound() {
  const links = [
    ...navigation,
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" }
  ];
  return (
    <>
      <PageHero
        eyebrow="404"
        title={
          <>
            That page is <em>not here</em>.
          </>
        }
        lede="It may have moved during the site rebuild, or the link may be mistyped. Everything that does exist is one click away below."
      />
      <Section tight>
        <SectionHead eyebrow="Everything else" title="Where to go instead." />
        <ul className="nf-links">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="pv-body" style={{ marginTop: 40 }}>
          Looking for something that should be here? Write to{" "}
          <a className="pv-link" href={`mailto:${site.enquiryEmail}`}>
            {site.enquiryEmail}
          </a>{" "}
          and tell us what you expected to find — a broken link is our problem to fix, not yours to
          work around.
        </p>
      </Section>
    </>
  );
}
