"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "contact",
        name: fd.get("Name"),
        email: fd.get("Email"),
        phone: fd.get("Phone"),
        subject: fd.get("Subject"),
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

      {/* ── Direct channels ── */}
      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-card rv">
              <span className="lbl">Email</span>
              <a className="val" href="mailto:inquiry@praversetech.com">
                inquiry@praversetech.com
              </a>
              <p>Best for project inquiries, partnership proposals, and general collaboration.</p>
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
              <span className="val">Vadodara, Gujarat</span>
              <p>TOWER 2 – 413 &amp; 420, Prince Cube, Nayaran Garden, Gotri, Vadodara. Also present in Bangalore, Hyderabad, Pune, Mumbai, and Chennai.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Simple contact form ── */}
      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="sec-head center rv">
            <span className="kicker">Send a Message</span>
            <h2>
              What&apos;s on your <span className="grad-text">mind?</span>
            </h2>
            <p>
              For a detailed project brief, use{" "}
              <Link href="/start-a-project" style={{ color: "var(--cyan)", textDecoration: "underline" }}>
                Start a Project
              </Link>
              . This form is for everything else.
            </p>
          </div>

          {status === "sent" ? (
            <div className="ct-simple-form" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <p className="ct-sent-label">Message sent</p>
              <h3 className="ct-sent-title">We&apos;ll be in touch.</h3>
              <p className="ct-sent-body">
                Thanks for reaching out. We read every message and usually reply within a day or two.
              </p>
            </div>
          ) : (
            <form className="ct-simple-form rv" onSubmit={handleSubmit}>

              {/* Name + Email */}
              <div className="form-row">
                <div className="field">
                  <label htmlFor="ct-name">Name</label>
                  <input id="ct-name" name="Name" type="text" autoComplete="name" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="ct-email">Email</label>
                  <input id="ct-email" name="Email" type="email" autoComplete="email" required placeholder="you@example.com" />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="form-row">
                <div className="field">
                  <label htmlFor="ct-phone">Contact Number <span className="opt">optional</span></label>
                  <input id="ct-phone" name="Phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="field">
                  <label htmlFor="ct-subject">Subject</label>
                  <input id="ct-subject" name="Subject" type="text" required placeholder="What's this about?" />
                </div>
              </div>

              {/* Message */}
              <div className="field">
                <label htmlFor="ct-message">Message</label>
                <textarea
                  id="ct-message"
                  name="Message"
                  rows={5}
                  placeholder="Say anything — we read everything."
                  required
                />
              </div>

              <div className="ct-simple-actions">
                <button className="btn btn-grad" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
                {status === "error" && (
                  <p className="form-note" style={{ color: "#e05", marginTop: 0 }}>
                    Something went wrong. Email us at inquiry@praversetech.com.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

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
                Researchers, founders, or builders with an idea worth exploring — see also our{" "}
                <a href="/innovate">Venture Lab</a>.
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

      {/* ── CTA ── */}
      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="cta-box rv">
            <h2>Ready to build something?</h2>
            <p>Start a structured project brief and we&apos;ll respond with a plan.</p>
            <div className="cta-row">
              <Link href="/start-a-project" className="btn btn-white">
                Start a Project →
              </Link>
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
