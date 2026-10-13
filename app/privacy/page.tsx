import type { Metadata } from "next";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Praverse Tech Pvt Ltd handles personal data, under the GDPR and India's DPDP Act 2023."
};

/**
 * This describes what the site actually does today: it sets no cookies, runs
 * no analytics, and has no form backend — enquiry forms compose an email in
 * the visitor's own mail client. If any of that changes, this page and the
 * cookie position must change with it.
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
            {company.legalName} (&ldquo;Praverse&rdquo;, &ldquo;we&rdquo;) respects your
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
            <strong>No cookies and no analytics.</strong> This site sets no
            cookies, embeds no advertising or analytics trackers, and does not
            profile visitors. Fonts are served from our own domain, so loading a
            page does not call out to a third-party font service. Because we set
            no non-essential cookies, there is no consent banner to click
            through.
          </p>
          <p>
            <strong>Enquiry forms.</strong> The forms on this site have no
            backend. When you submit one, your browser opens your own email
            client with the message pre-filled. Nothing is transmitted to us
            until you choose to send that email. If you never send it, we never
            receive it.
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
            If we add analytics, a hosted form backend, or any other processing,
            we will update this page before turning it on.
          </p>
        </div>
      </div>
    </section>
  );
}
