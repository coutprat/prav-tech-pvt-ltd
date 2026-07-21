"use client";

import { useState } from "react";

export default function InnovatePage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body = {
      formType: "innovate",
      name: fd.get("Name"),
      email: fd.get("Email"),
      organization: fd.get("Organization"),
      domain: fd.get("Domain"),
      ideaTitle: fd.get("Idea Title"),
      description: fd.get("Description"),
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
          Innovate With Praverse
        </div>
        <h1 className="rv">
          Have an idea worth <span className="grad-text">building?</span>
        </h1>
        <p className="sub rv">
          We welcome collaboration, mentorship, and research proposals — across healthcare AI,
          pharma intelligence, robotics, federated learning, and emerging tech. Tell us what
          you&apos;re thinking.
        </p>
      </header>

      <section className="sec-pad-sm">
        <div className="wrap">
          <div className="innovate-layout">
            {status === "sent" ? (
              <div className="innovate-form rv" style={{ textAlign: "center", padding: "3rem 0" }}>
                <h3>Idea received!</h3>
                <p style={{ marginTop: "0.75rem" }}>
                  Thanks for sharing. We&apos;ll review your submission and get back to you soon.
                </p>
              </div>
            ) : (
              <form className="innovate-form rv" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="inv-name">Your Name</label>
                    <input type="text" id="inv-name" name="Name" required placeholder="Jane Doe" />
                  </div>
                  <div className="field">
                    <label htmlFor="inv-email">Email</label>
                    <input type="email" id="inv-email" name="Email" required placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="inv-org">
                    Organization <span className="opt">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="inv-org"
                    name="Organization"
                    placeholder="University, company, or 'Independent'"
                  />
                </div>
                <div className="field">
                  <label htmlFor="inv-domain">Closest Domain</label>
                  <select id="inv-domain" name="Domain" defaultValue="Healthcare AI / HealthMate">
                    <option>Healthcare AI / HealthMate</option>
                    <option>Pharma &amp; Regulatory AI</option>
                    <option>Vision &amp; Medical Imaging</option>
                    <option>Federated Learning &amp; Edge AI</option>
                    <option>Humanoid Robotics</option>
                    <option>AIoT &amp; Industrial Intelligence</option>
                    <option>Finance Management AI</option>
                    <option>Biochip 2027</option>
                    <option>Photonics 2027</option>
                    <option>Something Else</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="inv-title">Idea Title</label>
                  <input
                    type="text"
                    id="inv-title"
                    name="Idea Title"
                    required
                    placeholder="A short, descriptive title"
                  />
                </div>
                <div className="field">
                  <label htmlFor="inv-desc">Tell us about it</label>
                  <textarea
                    id="inv-desc"
                    name="Description"
                    rows={6}
                    required
                    placeholder="What's the problem, what's your idea, and why does it matter? Be as specific as you can."
                  />
                </div>
                <button type="submit" className="btn btn-grad" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send to Praverse →"}
                </button>
                {status === "error" && (
                  <p className="form-note" style={{ color: "red", marginTop: "0.5rem" }}>
                    Something went wrong. Please try again or email us directly at inquiry@praversetech.com.
                  </p>
                )}
                <p className="form-note">
                  We treat every submission with discretion. If your idea needs an NDA before
                  details, say so in your message and we&apos;ll arrange one.
                </p>
              </form>
            )}

            <aside className="innovate-side rv">
              <div className="card">
                <div className="ico" data-icon="LAB" />
                <h3>Venture Lab</h3>
                <p>
                  Strong ideas can move into Praverse&apos;s Venture Lab — where research gets
                  converted into prototypes and, eventually, products.
                </p>
              </div>
              <div className="card">
                <div className="ico" data-icon="CO" />
                <h3>Collaboration &amp; Mentorship</h3>
                <p>
                  Students, researchers, and early-stage builders are welcome. We&apos;re happy to
                  discuss mentorship even if the idea isn&apos;t fully formed yet.
                </p>
              </div>
              <div className="card">
                <div className="ico" data-icon="SEC" />
                <h3>Confidentiality</h3>
                <p>
                  We treat every submission with discretion. If your idea needs an NDA before
                  details, say so in your message and we&apos;ll arrange one.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
