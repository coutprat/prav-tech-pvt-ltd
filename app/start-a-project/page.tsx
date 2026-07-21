"use client";

import { useState } from "react";
import Link from "next/link";

export default function StartAProjectPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "project",
        name: fd.get("Name"),
        email: fd.get("Email"),
        company: fd.get("Company"),
        inquiryType: fd.get("Inquiry Type"),
        timeline: fd.get("Timeline"),
        budget: fd.get("Budget Range"),
        message: fd.get("Message"),
      }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <main>
      <header className="page-hero">
        <div className="eyebrow rv">
          <span className="pulse" />
          Start a Project
        </div>
        <h1 className="rv">
          Tell us what you&apos;re <span className="grad-text">building.</span>
        </h1>
        <p className="sub rv">
          Share the problem, domain, and timeline. We&apos;ll get back with a plan within two business days.
        </p>
      </header>

      <section className="sec-pad-sm">
        <div className="wrap">
          {status === "sent" ? (
            <div className="inquiry-form" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-m)", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "16px" }}>Brief received</p>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", marginBottom: "14px" }}>We&apos;ll be in touch.</h2>
              <p style={{ color: "var(--ink-soft)", maxWidth: "44ch", margin: "0 auto 32px", lineHeight: "1.7" }}>
                Your project brief has been sent to the Praverse team. Expect a response within two business days.
              </p>
              <Link href="/" className="btn btn-grad">Back to Home →</Link>
            </div>
          ) : (
            <form className="inquiry-form rv" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="Name" type="text" autoComplete="name" required placeholder="Your full name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="Email" type="email" autoComplete="email" required placeholder="you@company.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="company">Company / Organization</label>
                  <input id="company" name="Company" type="text" autoComplete="organization" placeholder="Where do you work?" />
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
                <button className="btn btn-grad" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send Project Brief →"}
                </button>
                {status === "error" && (
                  <p className="form-note" style={{ color: "#e05" }}>
                    Something went wrong. Email us directly at inquiry@praversetech.com.
                  </p>
                )}
                <p className="form-note">
                  No diagnosis, compliance guarantee, or automated decisioning is implied. Every
                  high-stakes workflow is designed for expert review.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
