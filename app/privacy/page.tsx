import type { Metadata } from "next";
import { site } from "@/content/site";
import { brief } from "@/lib/answers";
import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { Verify } from "@/components/ui/Verify";
import { PageHero, Section } from "@/components/pv/kit";
import { company } from "@/content/company";
import "./legal.css";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "How Praverse Tech handles personal data under the GDPR and India's DPDP Act 2023. No cookies, no advertising trackers, no profiling.",
  path: '/privacy'
});

/** Section ids and headings, shared by the contents list and the text. */
const TOC = [
  { id: "responsible", title: "Who is responsible" },
  { id: "collects", title: "What this website collects" },
  { id: "use", title: "What we do with what you send us" },
  { id: "retention", title: "How long we keep it" },
  { id: "processed", title: "Where it is processed" },
  { id: "rights", title: "Your rights" },
  { id: "changes", title: "Changes" }
] as const;

type Id = (typeof TOC)[number]["id"];

function Part({ id, children }: { id: Id; children: ReactNode }) {
  const i = TOC.findIndex((t) => t.id === id);
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>
        <span className="lg-n" aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        {TOC[i].title}
      </h2>
      {children}
    </section>
  );
}

/**
 * This describes what the site actually does today: no cookies, cookieless
 * speed measurement only, and an enquiry form that posts to our own endpoint
 * and is relayed by email. If any of that changes — in particular if anything
 * starts setting cookies — this page and the consent position must change
 * with it.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageJsonLd path="/privacy" />

      <PageHero
        accent="white"
        eyebrow={brief("/privacy").lead}
        title="Privacy"
        lede={
          <>
            {company.legalName}{" "}
            (&ldquo;Praverse&rdquo;, &ldquo;we&rdquo;) respects your
            privacy. This page explains what we collect through this website, why,
            and what you can ask us to do about it.
          </>
        }
      />

      <Section accent="white">
        <div className="lg-layout">
          <nav className="lg-toc" aria-label="Contents">
            <p className="lg-toc-h">Contents</p>
            <ol>
              {TOC.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="lg-doc">
            <Part id="responsible">
              <p>
                {company.legalName}, <Verify id="registered-address" />.{" "}
                <Verify id="cin" />. For any privacy question, or to exercise the
                rights below, write to{" "}
                <a href={`mailto:${site.enquiryEmail}`}>{site.enquiryEmail}</a>
                .
              </p>
            </Part>

            <Part id="collects">
              <p>
                <strong>No cookies and no advertising trackers.</strong> This site
                sets no cookies, embeds no advertising trackers, and does not build
                a profile of you or follow you across other sites. Fonts are served
                from our own domain, so loading a page does not call out to a
                third-party font service. Because we set no non-essential cookies,
                there is no consent banner to click through.
              </p>
              <p>
                <strong>Speed measurement.</strong> We use Vercel Speed Insights to
                see how quickly pages actually load for real visitors. It is
                cookieless: it records page performance timings and coarse context
                such as route, country and device type, and it does not set
                identifiers or track you between sites. We use it only to find slow
                pages.
              </p>
              <p>
                <strong>Page measurement.</strong> We also use Vercel Web Analytics
                to count page views, so we can tell which pages people actually
                read. It is cookieless and sets no identifier on your device: it
                records the page, the referring site, and coarse context such as
                country, browser and device type. It does not record your IP
                address, does not build a profile, and cannot follow you to any
                other website. We use it to decide what to write and what to fix —
                nothing else, and we do not sell or share it.
              </p>
              <p>
                <strong>Enquiry and waitlist forms.</strong> When you submit a form,
                the details you enter — typically your name, work email,
                organisation and what you write in the message — are sent to our
                server and emailed to our enquiry mailbox, which is hosted on Zoho
                Mail. They are not stored in a separate database and are not shared
                with anyone else. Each form also carries a hidden anti-spam field
                and a short per-address rate limit; your IP address is used in
                memory for that check and is not written to disk.
              </p>
              <p>
                Enquiry correspondence lives in that mailbox for as long as the
                conversation is useful and for a reasonable period afterwards for
                our records, and you can ask us to delete it sooner. CVs sent to our
                careers address are kept only for the role you applied for unless
                you tell us to keep them on file.
              </p>
              <p>
                <strong>Server logs.</strong> Our hosting provider records standard
                technical request data such as IP address, user agent and the page
                requested, for security and reliability. These logs are not used to
                build a profile of you.
              </p>
            </Part>

            <Part id="use">
              <p>
                If you email us or join a waitlist, we process the details you
                provide — typically your name, work email, organisation and whatever
                you tell us about your problem — in order to reply and, if it goes
                further, to scope the work. Our lawful basis under the GDPR is
                legitimate interest in responding to a business enquiry you
                initiated, or the steps leading to a contract. Under the DPDP Act
                2023 we process it for the purpose you provided it for.
              </p>
              <p>
                We do not sell personal data, and we do not share it for anyone
                else&rsquo;s marketing.
              </p>
            </Part>

            <Part id="retention">
              <p>
                Enquiry correspondence is kept for as long as the commercial
                relationship is live, and for a reasonable period afterwards for our
                records. You can ask us to delete it sooner.
              </p>
            </Part>

            <Part id="processed">
              <p>
                We are based in India and work with clients in India, the US and
                Europe, so correspondence may be processed in those regions. Where
                data covered by the GDPR is transferred outside the EEA, we rely on
                appropriate safeguards for that transfer.
              </p>
            </Part>

            <Part id="rights">
              <p>
                Subject to the law that applies to you, you can ask us to give you a
                copy of your personal data, correct it, delete it, restrict or object
                to how we use it, or provide it in a portable form. Under the DPDP
                Act 2023 you may also nominate another person to exercise these
                rights on your behalf, and you may raise a grievance with us before
                approaching the Data Protection Board of India. Under the GDPR you
                can complain to your local supervisory authority.
              </p>
              <p>
                To exercise any of these, email{" "}
                <a href={`mailto:${site.enquiryEmail}`}>{site.enquiryEmail}</a>
                . We will respond within the period the applicable law allows.
              </p>
            </Part>

            <Part id="changes">
              <p>
                If we add cookie-based analytics, a CRM, or any other processing, we
                will update this page before turning it on.
              </p>
            </Part>
          </article>
        </div>
      </Section>
    </>
  );
}
