import type { Metadata } from "next";
import Link from "next/link";
import { Headline } from "@/components/ui/Headline";
import { Aurora } from "@/components/ui/Aurora";
import { SectionLabel } from "@/components/ui/primitives";
import { navigation } from "@/data/navigation";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found — Praverse Tech",
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
  return (
    <>
      <section className="page-head" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--acc-ent)", x: 16, y: 28, size: 460 },
            { color: "var(--teal)", x: 84, y: 62, size: 400 }
          ]}
        />
        <div className="wrap">
          <SectionLabel accent="teal">404</SectionLabel>
          <Headline as="h1" className="display">
            That page is not here.
          </Headline>
          <p className="lede" style={{ marginTop: 32, maxWidth: "52ch" }}>
            It may have moved during the site rebuild, or the link may be
            mistyped. Everything that does exist is one click away below.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <SectionLabel accent="line">Everything else</SectionLabel>
          <ul className="nf-links">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/careers">
                <span>Careers</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span>Contact</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>

          <p className="body-2" style={{ marginTop: 40 }}>
            Looking for something that should be here? Write to{" "}
            <a className="link" href={`mailto:${site.enquiryEmail}`}>
              {site.enquiryEmail}
            </a>{" "}
            and tell us what you expected to find — a broken link is our problem
            to fix, not yours to work around.
          </p>
        </div>
      </section>
    </>
  );
}
