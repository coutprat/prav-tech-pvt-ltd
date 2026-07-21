"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ContactPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLDivElement>(null);

  function openForm() {
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body = {
      formType: "contact",
      name: fd.get("Name"),
      email: fd.get("Email"),
      company: fd.get("Company"),
      inquiryType: fd.get("Inquiry Type"),
      timeline: fd.get("Timeline"),
      budget: fd.get("Budget Range"),
      message: fd.get("Message"),
    };
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setStatus(res.ok ? "sent" : "error");
  }

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
          Projects, partnerships, pilots, mentorship, or ideas — we read everything.
        </p>
      </header>

      {/* ── New contact section ── */}
      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="ct-split rv">

            {/* Left: headline + channels */}
            <div className="ct-left">
              <p className="ct-eyebrow">Direct Channels</p>
              <h2 className="ct-headline">
                Every message<br />lands with&nbsp;<span className="grad-text">a human.</span>
              </h2>
              <p className="ct-body">
                We don&apos;t route inquiries through ticket queues. Reach us directly — usually a response within two business days.
              </p>

              <div className="ct-channels">
                <a className="ct-channel" href="mailto:inquiry@praversetech.com">
                  <span className="ct-ch-dot" style={{ background: "var(--cyan)" }} />
                  <span className="ct-ch-inner">
                    <span className="ct-ch-label">Email</span>
                    <span className="ct-ch-val">inquiry@praversetech.com</span>
                  </span>
                  <span className="ct-ch-arrow">↗</span>
                </a>
                <a
                  className="ct-channel"
                  href="https://www.linkedin.com/in/pratham-shrivastav-b81180251/"
                  target="_blank"
                  rel="noopener"
                >
                  <span className="ct-ch-dot" style={{ background: "var(--blue)" }} />
                  <span className="ct-ch-inner">
                    <span className="ct-ch-label">LinkedIn</span>
                    <span className="ct-ch-val">Pratham Shrivastav</span>
                  </span>
                  <span className="ct-ch-arrow">↗</span>
                </a>
                <div className="ct-channel" style={{ cursor: "default" }}>
                  <span className="ct-ch-dot" style={{ background: "var(--violet)" }} />
                  <span className="ct-ch-inner">
                    <span className="ct-ch-label">Office</span>
                    <span className="ct-ch-val">Vadodara, Gujarat, India</span>
                  </span>
                </div>
              </div>

              <button className="btn btn-grad ct-start-btn" onClick={openForm}>
                {formOpen ? "Form open below ↓" : "Start a Project →"}
              </button>
            </div>

            {/* Right: decorative panel */}
            <div className="ct-right" aria-hidden="true">
              <div className="ct-deco-card">
                <div className="ct-deco-row">
                  <span className="ct-deco-dot" />
                  <span className="ct-deco-line" style={{ width: "62%" }} />
                </div>
                <div className="ct-deco-row">
                  <span className="ct-deco-dot ct-deco-dot--cyan" />
                  <span className="ct-deco-line" style={{ width: "45%" }} />
                </div>
                <div className="ct-deco-stat">
                  <span className="ct-deco-big">48h</span>
                  <span className="ct-deco-sub">avg. response time</span>
                </div>
                <div className="ct-deco-row">
                  <span className="ct-deco-dot ct-deco-dot--violet" />
                  <span className="ct-deco-line" style={{ width: "78%" }} />
                </div>
                <div className="ct-deco-row">
                  <span className="ct-deco-dot" />
                  <span className="ct-deco-line" style={{ width: "53%" }} />
                </div>
                <div className="ct-deco-badge">Intelligence · Engineered</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Inquiry form — revealed on "Start a Project" ── */}
      <AnimatePresence>
        {formOpen && (
          <motion.section
            ref={formRef}
            className="sec-pad-sm"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="wrap">
              <div className="sec-head center">
                <span className="kicker">Inquiry Form</span>
                <h2>
                  Send a structured <span className="grad-text">request.</span>
                </h2>
                <p>
                  Share the details and we&apos;ll respond — usually within two business days.
                </p>
              </div>

              {status === "sent" ? (
                <motion.div
                  className="inquiry-form"
                  style={{ textAlign: "center", padding: "3rem 0" }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3>Message sent.</h3>
                  <p style={{ marginTop: "0.75rem", color: "var(--ink-soft)" }}>
                    We&apos;ve received your inquiry and will be in touch shortly.
                  </p>
                </motion.div>
              ) : (
                <form className="inquiry-form" onSubmit={handleSubmit}>
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
                        <option>Pharma &amp; Regulatory AI</option>
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
                      <label htmlFor="budget">
                        Budget Range <span className="opt">optional</span>
                      </label>
                      <input
                        id="budget"
                        name="Budget Range"
                        type="text"
                        placeholder="Pilot / project range"
                      />
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
                    <button
                      className="btn btn-grad"
                      type="submit"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? "Sending…" : "Send Inquiry →"}
                    </button>
                    {status === "error" && (
                      <p className="form-note" style={{ color: "#e05" }}>
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}
                    <p className="form-note">
                      No diagnosis, compliance guarantee, or automated decisioning is implied.
                      Every high-stakes workflow is designed for expert review.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Reach Out cards ── */}
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
                Media inquiries, speaking requests, or anything else — drop us a line and
                we&apos;ll route it appropriately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="cta-box rv">
            <h2>Ready when you are.</h2>
            <p>
              Send a message and we&apos;ll get back to you — usually within a couple of business
              days.
            </p>
            <div className="cta-row">
              <a href="mailto:inquiry@praversetech.com" className="btn btn-white">
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
