import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { company } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "How Praverse Tech handles personal data under the GDPR and India's DPDP Act 2023. No cookies, no analytics trackers.",
  path: '/privacy'
});

/**
 * This describes what the site actually does today: no cookies, cookieless
 * speed measurement only, and an enquiry form that posts to our own endpoint
 * and is relayed by email. If any of that changes — in particular if anything
 * starts setting cookies — this page and the consent position must change
 * with it.
 */
export default function PrivacyPage() {
  return (
    <section className="page-head">
      <div className="wrap-narrow" style={{ paddingInline: 0 }}>
        <SectionLabel>Legal</SectionLabel>
        <Headline as="h1" className="h2">
          Privacy
        </Headline>

        <div className="prose">
          <p className="lede">
            {company.legalName}{" "}
            (&ldquo;Praverse&rdquo;, &ldquo;we&rdquo;) respects your
            privacy. This page explains what we collect through this website, why,
            and what you can ask us to do about it.
          </p>

          <h2>Who is responsible</h2>
          <p>
            {company.legalName}, <Verify id="registered-address" />.{" "}
            <Verify id="cin" />. For any privacy question, or to exercise the
            rights below, write to{" "}
            <a className="link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            .
          </p>

          <h2>What this website collects</h2>
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

          <h2>What we do with what you send us</h2>
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

          <h2>How long we keep it</h2>
          <p>
            Enquiry correspondence is kept for as long as the commercial
            relationship is live, and for a reasonable period afterwards for our
            records. You can ask us to delete it sooner.
          </p>

          <h2>Where it is processed</h2>
          <p>
            We are based in India and work with clients in India, the US and
            Europe, so correspondence may be processed in those regions. Where
            data covered by the GDPR is transferred outside the EEA, we rely on
            appropriate safeguards for that transfer.
          </p>

          <h2>Your rights</h2>
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
            <a className="link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            . We will respond within the period the applicable law allows.
          </p>

          <h2>Changes</h2>
          <p>
            If we add cookie-based analytics, a CRM, or any other processing, we
            will update this page before turning it on.
          </p>
        </div>
      </div>
    </section>
  );
}
