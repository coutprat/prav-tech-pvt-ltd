import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

/**
 * Enquiry endpoint.
 *
 * Replaces the old mailto: form, which silently lost every message from a
 * visitor without a configured mail client — which on a work laptop is most
 * of them.
 *
 * Runs on Node (nodemailer needs it) and is never cached.
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot filled → a bot. Answer 200 so it learns nothing, and drop it.
  if (data.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Limit actual send attempts, not validation failures: a visitor who
  // mistypes their email twice should not be locked out for a minute.
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: required("SMTP_HOST"),
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") }
    });

    const lines = [
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      data.org ? `Org:     ${data.org}` : null,
      data.area ? `Area:    ${data.area}` : null,
      "",
      data.message,
      data.constraints ? `\n\nConstraints:\n${data.constraints}` : null,
      "",
      "—",
      `Sent from praversetech.com`
    ]
      .filter((l) => l !== null)
      .join("\n");

    await transporter.sendMail({
      // Must be a mailbox we own; the visitor's address goes in replyTo so
      // hitting reply works while SPF/DKIM still pass.
      from: `"Praverse website" <${required("SMTP_USER")}>`,
      to: required("ENQUIRY_TO"),
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `${data.subject} — ${data.name}${data.org ? ` (${data.org})` : ""}`,
      text: lines
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never leak SMTP detail to the browser; log it for the platform.
    console.error("enquiry send failed", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send that just now. Please email inquiry@praversetech.com directly."
      },
      { status: 502 }
    );
  }
}
