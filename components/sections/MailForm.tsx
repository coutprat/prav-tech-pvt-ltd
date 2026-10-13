"use client";

import { useState, type FormEvent } from "react";
import { company } from "@/content/company";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
};

/**
 * There is no form backend on this site. The previous build used
 * <form action="mailto:..." method="post">, which most browsers silently drop
 * or mangle. This composes the mailto: URL on submit instead, which actually
 * opens the visitor's mail client with the content filled in.
 *
 * Nothing is transmitted anywhere by this component — the visitor sends the
 * mail themselves, so no data leaves the browser without their action.
 */
export function MailForm({
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
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = fields
      .map((f) => {
        const v = String(data.get(f.name) ?? "").trim();
        return v ? `${f.label}:\n${v}` : null;
      })
      .filter(Boolean)
      .join("\n\n");

    const url = `mailto:${company.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
    setSent(true);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
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

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          {submitLabel}
        </button>
        <p className="form-note" role="status">
          {sent
            ? `If your mail client did not open, write to ${company.email} directly.`
            : note ?? `This opens your email client. Nothing is sent until you send it.`}
        </p>
      </div>
    </form>
  );
}
