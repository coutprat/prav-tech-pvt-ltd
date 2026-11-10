import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PrismMark } from "@/components/pv/LineVisuals";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Verify, isWithheld } from "@/components/ui/Verify";
import { CtaBand, Figure, Note, PageHero, Rows, Section, SectionHead } from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import { siteFacts, subProcessors } from "@/content/trust";
import { site } from "@/content/site";
import { company } from "@/content/company";
import "./trust.css";

export const metadata: Metadata = pageMeta({
  title: "Trust",
  description:
    "Where your data goes, who processes it, and what this website does and does not collect. Written for the security review, not for marketing.",
  path: "/trust",
  og: "trust"
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

const nn = (i: number) => String(i + 1).padStart(2, "0");
const zoho = subProcessors.find((sp) => sp.name === "Zoho Mail");

export default function TrustPage() {
  const engagementReady = ENGAGEMENT.filter((e) => !isWithheld(e.id));

  return (
    <>
      <PageJsonLd path="/trust" />

      <PageHero
        accent="white"
        visual={<PrismMark />}
        eyebrow="Trust"
        title={
          <>
            Answers for your <em>security review</em>.
          </>
        }
        lede="Where data goes, who touches it, and what this site does and does not collect. Written to be read by the person who has to sign off on us, not by someone who already likes us."
        meta={[
          "No cookies",
          "No database behind the forms",
          `${subProcessors.length} sub-processors, all named`
        ]}
      />

      {/* ------------------------------------------------------ this website */}
      <Section accent="white">
        <SectionHead
          index="01"
          eyebrow="This website"
          title={
            <>
              Checkable <em>from outside</em>.
            </>
          }
          lede="Everything in this section can be verified without taking our word for it — run a header scan, open developer tools, read the source."
        />
        <Rows
          items={siteFacts.map((f, i) => ({
            k: nn(i),
            title: f.head,
            body: <p>{f.body}</p>
          }))}
        />
      </Section>

      {/* --------------------------------------------- what happens to a form */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="02"
          eyebrow="What you send us"
          title={
            <>
              Validated, emailed, <em>and dropped</em>.
            </>
          }
          lede="The whole path an enquiry or a job application takes through this site. There is no step after the last one."
        />
        <Figure
          n="01"
          title="The path of a form submission"
          caption="Drawn from the facts on this page. What you type reaches one mailbox and nowhere else; nothing is written to a database or a file store on the way."
        >
          <Flow
            nodes={[
              {
                k: "Sent",
                title: "You submit a form",
                body: "An enquiry, or an application with a CV attached."
              },
              {
                k: "Validated",
                title: "Checked before it goes anywhere",
                body: "A submission that does not validate stops here."
              },
              {
                k: "Emailed",
                title: "Delivered through Zoho Mail",
                body: zoho ? `To our mailbox, hosted in ${zoho.region}.` : "To our mailbox."
              },
              {
                k: "Dropped",
                title: "Nothing kept on this site",
                body: "No database, no file storage. A CV is held in memory just long enough to attach it to one email."
              }
            ]}
          />
        </Figure>
      </Section>

      {/* ---------------------------------------------------- sub-processors */}
      <Section accent="white">
        <SectionHead
          index="03"
          eyebrow="Sub-processors"
          title={
            <>
              Everyone who <em>touches it</em>.
            </>
          }
          lede="The complete list for this website. If we engage with you, any additional processor is named in the contract before work starts."
        />
        <div className="tr-table-wrap" tabIndex={0} role="region" aria-label="Sub-processors">
          <table className="tr-table">
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
                  <td data-label="Why">{sp.purpose}</td>
                  <td data-label="Where">{sp.region}</td>
                  <td data-label="What reaches them">{sp.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ------------------------------------------------------- engagements */}
      <Section tone="raised" accent="white">
        <SectionHead
          index="04"
          eyebrow="In an engagement"
          title={
            <>
              The three questions <em>you are going to ask</em>.
            </>
          }
          lede={
            engagementReady.length > 0
              ? undefined
              : "These are commitments rather than facts about a website, so they are not published until they are formally agreed internally:"
          }
        />

        {engagementReady.length > 0 ? (
          <Rows
            items={engagementReady.map((e, i) => ({
              k: nn(i),
              title: e.head,
              body: (
                <p>
                  <Verify id={e.id} />
                </p>
              )
            }))}
          />
        ) : (
          <>
            <Rows
              items={ENGAGEMENT.map((e, i) => ({
                k: nn(i),
                title: e.head,
                body: <p>&ldquo;{e.ask}&rdquo;</p>
              }))}
            />
            <Note>
              We would rather answer these properly in writing, for your specific engagement, than
              post a paragraph here that your legal team would have to re-negotiate anyway. Ask us
              and you get a written answer, not a brochure.
            </Note>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------- disclosure */}
      <Section accent="white">
        <SectionHead
          index="05"
          eyebrow="Reporting a problem"
          title={
            <>
              Found something? <em>Tell us</em>.
            </>
          }
        />
        <div className="tr-prose pv-body">
          <p>
            If you believe you have found a security problem in this site or anything we have
            built, write to{" "}
            <a
              href={`mailto:${isWithheld("security-contact") ? site.enquiryEmail : "security@praversetech.com"}`}
            >
              <Verify id="security-contact" />
            </a>{" "}
            with enough detail to reproduce it.
          </p>
          <p>
            We will acknowledge it, tell you what we found, and tell you when it is fixed. We will
            not threaten you, and we will credit you if you want to be credited. Please give us a
            reasonable window before publishing, and do not access anyone else&rsquo;s data while
            testing.
          </p>
          <p>
            {company.legalName} is registered in India. Our privacy notice is at{" "}
            <Link href="/privacy">/privacy</Link> and our terms at{" "}
            <Link href="/terms">/terms</Link>.
          </p>
        </div>
      </Section>

      <CtaBand
        title={
          <>
            A question this page <em>does not answer</em>?
          </>
        }
        body="Ask us directly. You get a written answer, not a brochure."
        primary={{ href: "/contact", label: "Ask us directly" }}
        secondary={null}
      />
    </>
  );
}
