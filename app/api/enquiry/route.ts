import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer, { type Transporter } from "nodemailer";
import {
  confirmationEmail,
  makeReference,
  postToWebhook,
  withTimeout,
  type EnquiryRecord
} from "@/lib/enquiry";

/**
 * Enquiry endpoint.
 *
 * Replaces the old mailto: form, which silently lost every message from a
 * visitor without a configured mail client — which on a work laptop is most
 * of them.
 *
 * Runs on Node (nodemailer needs it) and is never cached.
 *
 * On a real submission, in order:
 *   1. a reference (PRV-ENQ-YYYYMMDD-XXXX) is minted;
 *   2. the internal notification email and, if ENQUIRY_WEBHOOK_URL is set,
 *      the CRM webhook go out in parallel;
 *   3. if either of those landed, the visitor gets a confirmation email with
 *      the reference, and the response carries the reference back to the form.
 * If neither landed the enquiry would be lost, so the visitor gets a 502 and
 * the fallback address instead. The confirmation email and the webhook can
 * fail without failing the request.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("A valid email is required").max(200),
  org: z.string().trim().max(160).optional().default(""),
  area: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
  constraints: z.string().trim().max(5000).optional().default(""),
  subject: z.string().trim().max(120).optional().default("Website enquiry"),
  kind: z.enum(["enquiry", "waitlist"]).optional().default("enquiry"),
  phone: z.string().trim().max(40).optional().default(""),
  /** MENNIE waitlist asks for the visitor's role at the hospital. */
  role: z.string().trim().max(80).optional().default(""),
  /** Where the form was submitted from, for the team and the CRM. */
  page: z.string().trim().max(300).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
  utm: z
    .object({
      utm_source: z.string().trim().max(200).optional(),
      utm_medium: z.string().trim().max(200).optional(),
      utm_campaign: z.string().trim().max(200).optional(),
      utm_term: z.string().trim().max(200).optional(),
      utm_content: z.string().trim().max(200).optional()
    })
    .optional()
    .default({}),
  /**
   * Honeypot. Permissive on purpose: rejecting it in the schema would answer
   * a bot with a precise validation error telling it which field gave it
   * away, and would hard-fail a browser that helpfully autofilled it.
   * It is inspected after validation instead.
   */
  website: z.string().max(400).optional().default("")
});

/**
 * In-memory rate limit.
 *
 * Good enough for a low-traffic marketing site on a single region, and it
 * fails open rather than blocking real enquiries. If this ever needs to be
 * reliable across instances, move it to Upstash/Redis — noted in the overview.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // keep the map from growing without bound
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // /start-a-project names its main field "problem"; treat it as the message
  // rather than rejecting the brief for a missing field.
  if (
    body &&
    typeof body === "object" &&
    !("message" in body) &&
    typeof (body as Record<string, unknown>).problem === "string"
  ) {
    body = { ...body, message: (body as Record<string, unknown>).problem };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const reference = makeReference();

  // Honeypot filled → a bot. Answer exactly like a success, reference and
  // all, so it learns nothing, and drop it.
  if (data.website.trim()) {
    return NextResponse.json({ ok: true, reference, confirmationSent: true });
  }

  // Limit actual send attempts, not validation failures: a visitor who
  // mistypes their email twice should not be locked out for a minute.
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in a minute." },
      { status: 429 }
    );
  }

  const utm = Object.fromEntries(
    Object.entries(data.utm).filter((e): e is [string, string] => Boolean(e[1]))
  );

  const record: EnquiryRecord = {
    reference,
    kind: data.kind,
    name: data.name,
    email: data.email,
    company: data.org,
    phone: data.phone,
    role: data.role,
    topic: data.area || data.subject,
    subject: data.subject,
    message: data.message,
    constraints: data.constraints,
    page: data.page,
    referrer: data.referrer,
    timestamp: new Date().toISOString(),
    utm
  };

  // Built lazily so a deploy without SMTP still reaches the webhook.
  let transporter: Transporter | null = null;
  function mailer(): Transporter {
    transporter ??= nodemailer.createTransport({
      host: required("SMTP_HOST"),
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") }
    });
    return transporter;
  }

  const notify = async (): Promise<boolean> => {
    try {
      const lines = [
        `Ref:     ${reference}`,
        `Name:    ${data.name}`,
        `Email:   ${data.email}`,
        data.org ? `Org:     ${data.org}` : null,
        data.phone ? `Phone:   ${data.phone}` : null,
        data.role ? `Role:    ${data.role}` : null,
        data.area ? `Area:    ${data.area}` : null,
        "",
        data.message,
        data.constraints ? `\n\nConstraints:\n${data.constraints}` : null,
        "",
        "—",
        `Sent from praversetech.com${data.page ? ` (${data.page})` : ""}`,
        data.referrer ? `Referrer: ${data.referrer}` : null,
        Object.keys(utm).length
          ? `UTM:      ${Object.entries(utm)
              .map(([k, v]) => `${k}=${v}`)
              .join(" ")}`
          : null,
        "The sender is sent an automatic confirmation quoting this reference."
      ]
        .filter((l) => l !== null)
        .join("\n");

      await mailer().sendMail({
        // Must be a mailbox we own; the visitor's address goes in replyTo so
        // hitting reply works while SPF/DKIM still pass.
        from: `"Praverse website" <${required("SMTP_USER")}>`,
        to: required("ENQUIRY_TO"),
        replyTo: `"${data.name}" <${data.email}>`,
        subject: `[${reference}] ${data.subject} — ${data.name}${data.org ? ` (${data.org})` : ""}`,
        text: lines
      });
      return true;
    } catch (error) {
      // Never leak SMTP detail to the browser; log it for the platform.
      console.error("enquiry send failed", error);
      return false;
    }
  };

  const [notified, webhook] = await Promise.all([notify(), postToWebhook(record)]);

  if (!notified && webhook !== "sent") {
    return NextResponse.json(
      {
        ok: false,
        error: "We could not send that just now. Please email inquiry@praversetech.com directly."
      },
      { status: 502 }
    );
  }

  // The enquiry is safe with us; now tell the visitor. Bounded so a slow SMTP
  // server cannot hold the form, and never allowed to fail the request.
  const confirm = async (): Promise<boolean> => {
    const mail = confirmationEmail(record);
    await mailer().sendMail({
      from: `"Praverse Tech" <${required("SMTP_USER")}>`,
      to: `"${data.name}" <${data.email}>`,
      // Replies land with the team, not in the sending mailbox.
      replyTo: process.env.ENQUIRY_TO ?? required("SMTP_USER"),
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });
    return true;
  };
  const confirmationSent = await withTimeout(
    confirm().catch((error: unknown) => {
      console.error("enquiry confirmation failed", error);
      return false;
    }),
    8000,
    false
  );

  return NextResponse.json({ ok: true, reference, confirmationSent });
}
