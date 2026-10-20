"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { site, whatsappLink } from "@/content/site";

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

type Sent = {
  reference: string | null;
  confirmationSent: boolean;
  name: string;
  email: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * Prefill from ?topic=<slug>&note=<text>, e.g. links from the Photonics
 * reach-finder to /start-a-project. Read from window.location in an effect so
 * the page stays statically rendered. The topic selects the first option of
 * the first select field that starts with it ("photonics" → "Photonics",
 * "pharma" → "Pharma AI"); unknown topics are ignored. The note goes into the
 * first textarea, and only if the visitor has not typed there already.
 */
function prefillFromQuery(form: HTMLFormElement, fields: Field[]) {
  let q: URLSearchParams;
  try {
    q = new URLSearchParams(window.location.search);
  } catch {
    return;
  }

  const topic = norm(q.get("topic") ?? "");
  const select = fields.find((f) => f.type === "select" && f.options?.length);
  if (topic && select?.options) {
    const match = select.options.find((o) => norm(o).startsWith(topic));
    const el = form.elements.namedItem(select.name);
    if (match && el instanceof HTMLSelectElement && !el.value) el.value = match;
  }

  const note = (q.get("note") ?? "").trim().slice(0, 4000);
  const area = fields.find((f) => f.type === "textarea");
  if (note && area) {
    const el = form.elements.namedItem(area.name);
    if (el instanceof HTMLTextAreaElement && !el.value) el.value = note;
  }
}

/** UTM tags on the page the form is on, so the CRM knows where a lead came from. */
function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const q = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = q.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
  } catch {
    // no window.location in some embedded contexts; UTM is a nice-to-have
  }
  return out;
}

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
  note,
  kind = "enquiry",
  nextStep = "You will get a written plan within two business days."
}: {
  fields: Field[];
  subject: string;
  submitLabel?: string;
  note?: string;
  /** Picks the wording of the confirmation email. */
  kind?: "enquiry" | "waitlist";
  /** The promise restated in the success panel. */
  nextStep?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [sent, setSent] = useState<Sent | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Once, on mount: fields are uncontrolled, so this writes to the DOM and
  // the visitor can edit or clear whatever was prefilled.
  useEffect(() => {
    if (formRef.current) prefillFromQuery(formRef.current, fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

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
        body: JSON.stringify({
          ...data,
          subject,
          kind,
          page: window.location.pathname,
          referrer: document.referrer.slice(0, 500),
          utm: readUtm()
        })
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        reference?: string;
        confirmationSent?: boolean;
      };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error ?? "Something went wrong.");
        return;
      }

      setSent({
        reference: json.reference ?? null,
        confirmationSent: json.confirmationSent ?? false,
        name: String(data.name ?? ""),
        email: String(data.email ?? "")
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError(`We could not reach the server. Please email ${site.enquiryEmail} directly.`);
    }
  }

  if (status === "sent") {
    const ref = sent?.reference ?? null;
    const waText = ref
      ? `Hello Praverse Tech, this is ${sent?.name || "me"}. I just sent an enquiry from your website (ref ${ref}).`
      : site.whatsappMessage;

    return (
      <div className="form-sent" role="status">
        <p className="h3">Thank you — that reached us.</p>
        {ref ? (
          <p className="body-2" style={{ marginTop: 12 }}>
            Your reference is{" "}
            <strong className="mono" style={{ whiteSpace: "nowrap" }}>
              {ref}
            </strong>
            .
          </p>
        ) : null}
        <p className="body-2" style={{ marginTop: 12 }}>
          {sent?.confirmationSent ? (
            <>
              Check your inbox — we&rsquo;ve sent a confirmation
              {sent.email ? <> to {sent.email}</> : null}.{" "}
            </>
          ) : ref ? (
            <>Keep this reference: the confirmation email is running late. </>
          ) : null}
          {nextStep}
        </p>
        <div className="form-actions" style={{ marginTop: 20 }}>
          <a
            className="btn btn-primary"
            href={whatsappLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue on WhatsApp
          </a>
          <a
            className="btn btn-ghost"
            href={`mailto:${site.enquiryEmail}${ref ? `?subject=${encodeURIComponent(ref)}` : ""}`}
          >
            Email {site.enquiryEmail}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate={false}>
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
            (note ?? "We reply within two business days.")
          )}
        </p>
      </div>
    </form>
  );
}
