import { createHmac, randomInt } from "node:crypto";
import { site, whatsappLink } from "@/content/site";

/**
 * Server-side helpers for /api/enquiry: the reference number, the visitor's
 * confirmation email and the optional CRM webhook.
 *
 * Kept out of the route so the route still reads as "validate, deliver,
 * answer", and so none of this is ever imported by a client component.
 */

/** No 0/O, 1/I/L: a reference gets read aloud and typed into WhatsApp. */
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * PRV-ENQ-YYYYMMDD-XXXX, dated in India time because that is where the
 * team reads it. Four random characters give ~920k per day: collisions are
 * not a practical concern at enquiry volume, and the reference is a label for
 * humans, not a database key.
 */
export function makeReference(prefix = "PRV-ENQ", now = new Date()): string {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replaceAll("-", "");
  let tail = "";
  for (let i = 0; i < 4; i++) tail += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `${prefix}-${ymd}-${tail}`;
}

export type EnquiryKind = "enquiry" | "waitlist";

export type EnquiryRecord = {
  reference: string;
  kind: EnquiryKind;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  topic: string;
  subject: string;
  message: string;
  constraints: string;
  page: string;
  referrer: string;
  timestamp: string;
  utm: Record<string, string>;
};

/** What the visitor is told happens next, in both the email and the form. */
export function nextStepLine(kind: EnquiryKind): string {
  return kind === "waitlist"
    ? "We will write to you personally before MENNIE opens to new hospitals, and sooner if we have questions about your queue."
    : "A person on our team reads it, and you get a written plan within two business days. No pitch deck, no discovery retainer.";
}

function whatsappTextFor(r: Pick<EnquiryRecord, "reference" | "name">): string {
  return `Hello Praverse Tech, this is ${r.name}. I just sent an enquiry from your website (ref ${r.reference}).`;
}

/** The excerpt we echo back. Short on purpose: see confirmationEmail. */
function excerpt(text: string, max = 400): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * The confirmation that goes to the visitor.
 *
 * It restates only a short excerpt of what they wrote, not the whole message:
 * the "to" address is whatever was typed into the form, so echoing arbitrary
 * text in full would make this endpoint a relay for anyone willing to type
 * someone else's address. The rate limit and honeypot cover the rest.
 */
export function confirmationEmail(r: EnquiryRecord): {
  subject: string;
  text: string;
  html: string;
} {
  const wa = whatsappLink(whatsappTextFor(r));
  const waDisplay = `+${site.whatsappNumber}`;
  const firstName = r.name.split(/\s+/)[0] || r.name;
  const summary = excerpt(r.message);
  const next = nextStepLine(r.kind);
  const subject =
    r.kind === "waitlist"
      ? `You're on the MENNIE waitlist — ${r.reference}`
      : `We have your enquiry — ${r.reference}`;

  const rows: [string, string][] = [
    ["Reference", r.reference],
    ["Topic", r.topic],
    r.company ? ["Organisation", r.company] : null,
    summary ? ["You wrote", summary] : null
  ].filter((x): x is [string, string] => x !== null);

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for writing to Praverse Tech. This is a quick note to confirm it reached us.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "What happens next",
    next,
    "",
    `If you want to add anything, reply to this email or message us on WhatsApp (${waDisplay}) and quote ${r.reference}:`,
    wa,
    "",
    "— Praverse Tech",
    "praversetech.com",
    "",
    "You are receiving this because this address was entered in the form on praversetech.com. If that was not you, ignore this email and nothing further will be sent."
  ].join("\n");

  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5b6470;vertical-align:top;white-space:nowrap">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#14181f">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f4f2">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#14181f">
  <p style="margin:0 0 24px;font-weight:600;letter-spacing:-0.01em">Praverse Tech</p>
  <p style="margin:0 0 16px">Hi ${escapeHtml(firstName)},</p>
  <p style="margin:0 0 20px">Thank you for writing to Praverse Tech. This is a quick note to confirm it reached us.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;font-size:14px">${rowHtml}</table>
  <p style="margin:0 0 6px;font-weight:600">What happens next</p>
  <p style="margin:0 0 24px">${escapeHtml(next)}</p>
  <p style="margin:0 0 16px">To add anything, reply to this email or message us on WhatsApp and quote <strong>${escapeHtml(
    r.reference
  )}</strong>.</p>
  <p style="margin:0 0 32px"><a href="${escapeHtml(
    wa
  )}" style="display:inline-block;padding:12px 22px;border-radius:100px;background:#4bd6c4;color:#06201d;text-decoration:none;font-weight:500">Continue on WhatsApp</a></p>
  <p style="margin:0 0 4px">— Praverse Tech</p>
  <p style="margin:0 0 32px"><a href="https://praversetech.com" style="color:#0f7d70">praversetech.com</a></p>
  <p style="margin:0;font-size:12px;color:#7a828c">You are receiving this because this address was entered in the form on praversetech.com. If that was not you, ignore this email and nothing further will be sent.</p>
</div>
</body></html>`;

  return { subject, text, html };
}

/**
 * Optional CRM hand-off.
 *
 * If ENQUIRY_WEBHOOK_URL is set, POSTs the enquiry as JSON. Awaited, but with
 * a hard timeout, and it never throws: a slow or broken Zapier/HubSpot hook
 * must not cost us the enquiry or keep the visitor waiting.
 *
 * Returns "skipped" when no URL is configured, so the route can tell "not
 * configured" apart from "configured and failed".
 */
export async function postToWebhook(
  r: EnquiryRecord,
  timeoutMs = 4000
): Promise<"sent" | "failed" | "skipped"> {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) return "skipped";

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.error("enquiry webhook: ENQUIRY_WEBHOOK_URL is not a valid URL");
    return "failed";
  }
  // Plain http only for local testing; enquiries carry personal data.
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !local) {
    console.error("enquiry webhook: ENQUIRY_WEBHOOK_URL must be https");
    return "failed";
  }

  const body = JSON.stringify({
    reference: r.reference,
    kind: r.kind,
    name: r.name,
    email: r.email,
    company: r.company,
    phone: r.phone,
    role: r.role,
    topic: r.topic,
    subject: r.subject,
    message: r.message,
    constraints: r.constraints,
    page: r.page,
    referrer: r.referrer,
    timestamp: r.timestamp,
    utm_source: r.utm.utm_source ?? "",
    utm_medium: r.utm.utm_medium ?? "",
    utm_campaign: r.utm.utm_campaign ?? "",
    utm_term: r.utm.utm_term ?? "",
    utm_content: r.utm.utm_content ?? "",
    source: "praversetech.com"
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "praversetech.com enquiry webhook"
  };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();
  if (secret) {
    // The shared secret itself, for tools that can only compare a header
    // (Zapier filters, Make, Apps Script), and an HMAC of the body for
    // receivers that can verify one.
    headers["X-Enquiry-Secret"] = secret;
    headers["X-Enquiry-Signature"] = `sha256=${createHmac("sha256", secret)
      .update(body)
      .digest("hex")}`;
  }

  try {
    const res = await fetch(parsed, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
      // Google Apps Script answers POSTs with a 302 to the result.
      redirect: "follow"
    });
    if (!res.ok) {
      console.error(`enquiry webhook: ${res.status} from receiver`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("enquiry webhook failed", error);
    return "failed";
  }
}

/** Resolve to `fallback` if `p` has not settled within `ms`. Never rejects. */
export function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const t = setTimeout(() => resolve(fallback), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      () => {
        clearTimeout(t);
        resolve(fallback);
      }
    );
  });
}
