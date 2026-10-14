import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Headline } from "@/components/ui/Headline";
import { Aurora } from "@/components/ui/Aurora";
import { SectionLabel, Disclaimer } from "@/components/ui/primitives";
import { Verify, isWithheld } from "@/components/ui/Verify";
import { siteFacts, subProcessors } from "@/content/trust";
import { site } from "@/content/site";
import { company } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Trust",
  description:
    "Where your data goes, who processes it, and what this website does and does not collect. Written for the security review, not for marketing.",
  path: "/trust",
  og: "company"
});

/**
 * The page a buyer's security team reads.
 *
 * Every enterprise, pharma and data-centre buyer runs the same checklist
 * before a pilot: where is data processed, who are your sub-processors, will
 * you sign a DPA, what happens when something goes wrong. Today those
 * questions get answered in an email thread after someone is already
 * interested — which is the expensive moment to discover a gap.
 *
 * Split deliberately in two. The first half is about this website and is
 * checkable from outside: headers, cookies, what is stored. The second half is
 * about engagements, which are policy commitments rather than facts about a
 * website, so every one of them is gated behind <Verify> and is simply absent
 * until the owner confirms it. A trust page that overstates is worse than none.
 */
const ENGAGEMENT = [
  {
    id: "dpa" as const,
    head: "Data processing agreement",
    ask: "Will you sign a DPA before we share anything?"
  },
  {
    id: "client-data-training" as const,
    head: "Your data is not training anyone else's model",
    ask: "Is our data used to train models we do not own?"
  },
  {
    id: "data-residency" as const,
    head: "Data residency",
    ask: "Can this stay inside India?"
  }
];

export default function TrustPage() {
  const engagementReady = ENGAGEMENT.filter((e) => !isWithheld(e.id));

  return (
    <>
      <section className="page-head" style={{ position: "relative" }}>
        <Aurora
          blobs={[
            { color: "var(--teal)", x: 16, y: 30, size: 460 },
            { color: "var(--acc-ent)", x: 84, y: 60, size: 400 }
          ]}
        />
        <div className="wrap">
          <SectionLabel accent="teal">Trust</SectionLabel>
          <Headline as="h1" className="display">
            Answers for your security review.
          </Headline>
          <p className="lede" style={{ marginTop: 32, maxWidth: "58ch" }}>
            Where data goes, who touches it, and what this site does and does
            not collect. Written to be read by the person who has to sign off on
            us, not by someone who already likes us.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ this website */}
      <section className="section-tight">
        <div className="wrap">
          <SectionLabel accent="line">This website</SectionLabel>
          <Headline onScroll>Checkable from outside.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "62ch" }}>
            Everything in this section can be verified without taking our word
            for it — run a header scan, open developer tools, read the source.
          </p>

          <ol className="trust-list">
            {siteFacts.map((f, i) => (
              <li key={f.head}>
                <span className="trust-n mono">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{f.head}</h3>
                  <p>{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------- sub-processors */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Sub-processors</SectionLabel>
          <Headline onScroll>Everyone who touches it.</Headline>
          <p className="body-2" style={{ marginTop: 18, maxWidth: "62ch" }}>
            The complete list for this website. If we engage with you, any
            additional processor is named in the contract before work starts.
          </p>

          <div className="trust-table-wrap" tabIndex={0} role="region" aria-label="Sub-processors">
            <table className="trust-table">
              <thead>
                <tr>
                  <th scope="col">Processor</th>
                  <th scope="col">Why</th>
                  <th scope="col">Where</th>
                  <th scope="col">What reaches them</th>
                </tr>
              </thead>
              <tbody>
                {subProcessors.map((sp) => (
                  <tr key={sp.name}>
                    <th scope="row">{sp.name}</th>
                    <td>{sp.purpose}</td>
                    <td>{sp.region}</td>
                    <td>{sp.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- engagements */}
      <section className="section">
        <div className="wrap">
          <SectionLabel accent="line">In an engagement</SectionLabel>
          <Headline onScroll>The three questions you are going to ask.</Headline>

          {engagementReady.length > 0 ? (
            <ol className="trust-list" style={{ marginTop: 40 }}>
              {engagementReady.map((e, i) => (
                <li key={e.id}>
                  <span className="trust-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{e.head}</h3>
                    <p>
                      <Verify id={e.id} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <>
              <p className="lede" style={{ marginTop: 24, maxWidth: "62ch" }}>
                These are commitments rather than facts about a website, so they
                are not published until they are formally agreed internally:
              </p>
              <ul className="trust-asks">
                {ENGAGEMENT.map((e) => (
                  <li key={e.id}>
                    <span className="mono">{e.head}</span>
                    <span>&ldquo;{e.ask}&rdquo;</span>
                  </li>
                ))}
              </ul>
              <Disclaimer>
                We would rather answer these properly in writing, for your
                specific engagement, than post a paragraph here that your legal
                team would have to re-negotiate anyway. Ask us and you get a
                written answer, not a brochure.
              </Disclaimer>
            </>
          )}

          <p className="body-2" style={{ marginTop: 36 }}>
            <Link className="link" href="/contact">
              Ask us directly →
            </Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- disclosure */}
      <section className="section section-alt">
        <div className="wrap wrap-narrow" style={{ paddingInline: 0 }}>
          <SectionLabel>Reporting a problem</SectionLabel>
          <Headline onScroll>Found something? Tell us.</Headline>
          <div className="prose">
            <p>
              If you believe you have found a security problem in this site or
              anything we have built, write to{" "}
              <a
                className="link"
                href={`mailto:${isWithheld("security-contact") ? site.enquiryEmail : "security@praversetech.com"}`}
              >
                <Verify id="security-contact" />
              </a>{" "}
              with enough detail to reproduce it.
            </p>
            <p>
              We will acknowledge it, tell you what we found, and tell you when
              it is fixed. We will not threaten you, and we will credit you if
              you want to be credited. Please give us a reasonable window before
              publishing, and do not access anyone else&rsquo;s data while
              testing.
            </p>
            <p>
              {company.legalName} is registered in India. Our privacy notice is
              at <Link className="link" href="/privacy">/privacy</Link> and our
              terms at <Link className="link" href="/terms">/terms</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
