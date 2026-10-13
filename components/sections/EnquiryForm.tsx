"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
};

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Posts to /api/enquiry, which mails the enquiry over Zoho SMTP.
 *
 * The previous version composed a mailto: link. That loses the message
 * entirely for anyone without a configured mail client, which on a work
 * laptop is most people — they click send, nothing happens, and we never know
 * they tried.
 *
 * On failure it does not just say "error": it gives the address to write to,
 * so a visitor is never left with no route to us.
 */
export function EnquiryForm({
  fields,
  subject,
  submitLabel = "Send",
  note
}: {
  fields: Field[];
  subject: string;
  submitLabel?: string;
  note?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subject })
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error ?? "Something went wrong.");
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        `We could not reach the server. Please email ${site.enquiryEmail} directly.`
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="form-sent" role="status">
        <p className="h3">Thank you — that reached us.</p>
        <p className="body-2" style={{ marginTop: 12 }}>
          You will get a written plan within two business days. If it is urgent,
          write to{" "}
          <a className="link" href={`mailto:${site.enquiryEmail}`}>
            {site.enquiryEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      {fields.map((f) => (
        <div className="field" key={f.name} data-wide={f.type === "textarea"}>
          <label htmlFor={f.name}>
            {f.label}
            {f.required ? (
              <span aria-hidden="true" className="req">
                *
              </span>
            ) : null}
          </label>

          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              rows={5}
              required={f.required}
              placeholder={f.placeholder}
            />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
            />
          )}
        </div>
      ))}

      {/* Honeypot. Hidden from sight and from assistive tech; bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : submitLabel}
        </button>

        <p className="form-note" role="status" aria-live="polite">
          {status === "error" ? (
            <span className="form-error">{error}</span>
          ) : (
            note ?? "We reply within two business days."
          )}
        </p>
      </div>
    </form>
  );
}
