"use client";

import { useRef, useState, type FormEvent } from "react";
import { Paperclip, X } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { openJobs } from "@/content/jobs";

type Status = "idle" | "sending" | "sent" | "error";

/** Mirrors the server. Rejecting here saves a 5 MB upload over a phone connection. */
const MAX_CV_BYTES = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx";

/**
 * Posts a job application to /api/apply as multipart, because of the CV.
 *
 * The CV is optional on purpose. Plenty of good engineers would rather send a
 * repository than a formatted document, and insisting on a PDF filters for
 * the wrong thing.
 *
 * Nothing is stored: the file is attached to one email to careers@ and
 * dropped. The form says so, because a candidate handing over a CV is handing
 * over personal data and is entitled to know where it lands.
 */
export function ApplyForm({ defaultRole }: { defaultRole?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [cvName, setCvName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onPick() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setCvName(null);
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setError("That CV is over 5 MB. Please send a smaller file, or a link instead.");
      setStatus("error");
      if (fileRef.current) fileRef.current.value = "";
      setCvName(null);
      return;
    }
    setStatus("idle");
    setError("");
    setCvName(file.name);
  }

  function clearCv() {
    if (fileRef.current) fileRef.current.value = "";
    setCvName(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: new FormData(form)
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error ?? "Something went wrong.");
        return;
      }

      setStatus("sent");
      form.reset();
      setCvName(null);
    } catch {
      setStatus("error");
      setError(`We could not reach the server. Please email ${site.careersEmail} directly.`);
    }
  }

  if (status === "sent") {
    return (
      <div className="form-sent" role="status">
        <p className="h3">That reached us.</p>
        <p className="body-2" style={{ marginTop: 12 }}>
          A person reads every application. You will hear back either way — if
          you have not within two weeks, write to{" "}
          <a className="link" href={`mailto:${site.careersEmail}`}>
            {site.careersEmail}
          </a>{" "}
          and chase us.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="ap-name">
          Your name
          <span aria-hidden="true" className="req">
            *
          </span>
        </label>
        <input id="ap-name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="field">
        <label htmlFor="ap-email">
          Email
          <span aria-hidden="true" className="req">
            *
          </span>
        </label>
        <input id="ap-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="field">
        <label htmlFor="ap-role">
          Role
          <span aria-hidden="true" className="req">
            *
          </span>
        </label>
        <select id="ap-role" name="role" required defaultValue={defaultRole ?? ""}>
          <option value="" disabled>
            Choose one
          </option>
          {openJobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ap-location">Where you are</label>
        <input
          id="ap-location"
          name="location"
          type="text"
          placeholder="City, country"
          autoComplete="address-level2"
        />
      </div>

      <div className="field" data-wide="true">
        <label htmlFor="ap-links">Links</label>
        <input
          id="ap-links"
          name="links"
          type="text"
          placeholder="GitHub, portfolio, LinkedIn — whatever shows your work"
        />
      </div>

      <div className="field" data-wide="true">
        <label htmlFor="ap-note">
          Why this role
          <span aria-hidden="true" className="req">
            *
          </span>
        </label>
        <textarea
          id="ap-note"
          name="note"
          rows={5}
          required
          placeholder="What you have built, and what you want to build next. A few sentences is plenty."
        />
      </div>

      {/* ---------------------------------------------------------- CV */}
      <div className="field" data-wide="true">
        <label htmlFor="ap-cv">CV — optional</label>
        <input
          ref={fileRef}
          id="ap-cv"
          name="cv"
          type="file"
          accept={ACCEPT}
          onChange={onPick}
          className="file-input"
        />
        <label className="file-drop" htmlFor="ap-cv">
          <Paperclip size={16} weight="duotone" aria-hidden="true" />
          <span>{cvName ?? "Attach a PDF or Word document, up to 5 MB"}</span>
        </label>
        {cvName ? (
          <button type="button" className="file-clear" onClick={clearCv}>
            <X size={13} weight="bold" aria-hidden="true" /> Remove {cvName}
          </button>
        ) : null}
        <p className="field-help">
          Optional — a link to your work is just as good. Whatever you send is
          emailed to {site.careersEmail} and nothing is stored on this site.
        </p>
      </div>

      {/* Honeypot. Hidden from sight and from assistive tech; bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="ap-website">Website</label>
        <input id="ap-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send application"}
        </button>

        <p className="form-note" role="status" aria-live="polite">
          {status === "error" ? (
            <span className="form-error">{error}</span>
          ) : (
            "A person reads every application."
          )}
        </p>
      </div>
    </form>
  );
}
