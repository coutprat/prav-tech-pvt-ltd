import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact - Praverse Tech"
};

export default function ContactPage() {
  return (
    <main>
      <header className="page-hero">
        <div className="eyebrow rv">
          <span className="pulse" />
          Get in Touch
        </div>
        <h1 className="rv">
          Talk to <span className="grad-text">Praverse.</span>
        </h1>
        <p className="sub rv">
          Projects, partnerships, pilots, mentorship, or ideas — we read everything. Reach out
          through whichever channel works best for you.
        </p>
      </header>

      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-card rv">
              <span className="lbl">Email</span>
              <a className="val" href="mailto:pratham@praversetech.com">
                pratham@praversetech.com
              </a>
              <p>Best for project inquiries, HealthMate waitlist, and collaboration proposals.</p>
            </div>
            <div className="contact-card rv">
              <span className="lbl">Phone</span>
              <a className="val" href="tel:+919313247264">
                +91 93132 47264
              </a>
              <p>For direct conversations about enterprise engagements.</p>
            </div>
            <div className="contact-card rv">
              <span className="lbl">LinkedIn</span>
              <a
                className="val"
                href="https://www.linkedin.com/in/pratham-shrivastav-b81180251/"
                target="_blank"
                rel="noopener"
              >
                Pratham Shrivastav
              </a>
              <p>Connect with the founder for updates and announcements.</p>
            </div>
            <div className="contact-card rv">
              <span className="lbl">Office</span>
              <span className="val">Vadodara, Gujarat, India</span>
              <p>TOWER 2 – 413 &amp; 420, Prince Cube, Nayaran Garden, Gotri, Vadodara. Also present in Bangalore, Hyderabad, Pune, Mumbai, and Chennai.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="sec-head center rv">
            <span className="kicker">Inquiry Form</span>
            <h2>
              Send a structured <span className="grad-text">request.</span>
            </h2>
            <p>
              Share the problem, domain, and timeline. The form opens your email client with the
              details ready to send to Praverse.
            </p>
          </div>

          <form
            className="inquiry-form rv"
            action="mailto:pratham@praversetech.com"
            method="post"
            encType="text/plain"
          >
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="Name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="Email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="company">Company / Organization</label>
                <input id="company" name="Company" type="text" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="domain">Inquiry Type</label>
                <select id="domain" name="Inquiry Type" defaultValue="Enterprise AI / ML">
                  <option>Enterprise AI / ML</option>
                  <option>HealthMate / Healthcare AI</option>
                  <option>Pharma & Regulatory AI</option>
                  <option>Research Collaboration</option>
                  <option>Venture Lab / Idea</option>
                  <option>Press / General</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="timeline">Timeline</label>
                <select id="timeline" name="Timeline" defaultValue="Exploring">
                  <option>Exploring</option>
                  <option>0-3 months</option>
                  <option>3-6 months</option>
                  <option>6+ months</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="budget">Budget Range <span className="opt">optional</span></label>
                <input id="budget" name="Budget Range" type="text" placeholder="Pilot / project range" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="message">What should we help you build?</label>
              <textarea
                id="message"
                name="Message"
                rows={6}
                placeholder="Tell us about the workflow, data, users, constraints, and desired outcome."
                required
              />
            </div>
            <div className="inquiry-actions">
              <button className="btn btn-grad" type="submit">
                Send Inquiry →
              </button>
              <p className="form-note">
                No diagnosis, compliance guarantee, or automated decisioning is implied. Every
                high-stakes workflow is designed for expert review.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="sec-head center rv">
            <span className="kicker">Reach Out</span>
            <h2>
              What are you <span className="grad-text">looking for?</span>
            </h2>
          </div>
          <div className="cap-grid">
            <div className="card rv">
              <div className="ico" data-icon="PX" />
              <h3>Partnerships &amp; Pilots</h3>
              <p>
                Enterprise teams exploring AI/ML systems for healthcare, pharma, robotics, or
                industrial domains.
              </p>
            </div>
            <div className="card rv">
              <div className="ico" data-icon="IX" />
              <h3>Ideas &amp; Collaboration</h3>
              <p>
                Researchers, founders, or builders with an idea worth exploring together — see also
                our <a href="/innovate">Venture Lab</a>.
              </p>
            </div>
            <div className="card rv">
              <div className="ico" data-icon="PR" />
              <h3>Press &amp; General</h3>
              <p>
                Media inquiries, speaking requests, or anything else — drop us a line and we&apos;ll
                route it appropriately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="cta-box rv">
            <h2>Ready when you are.</h2>
            <p>Send a message and we&apos;ll get back to you — usually within a couple of business days.</p>
            <div className="cta-row">
              <a href="mailto:pratham@praversetech.com" className="btn btn-white">
                Start a Conversation →
              </a>
              <Link href="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
