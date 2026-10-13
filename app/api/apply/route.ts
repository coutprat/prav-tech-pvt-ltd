import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { jobs } from "@/content/jobs";

/**
 * Job application endpoint.
 *
 * Takes multipart/form-data rather than JSON, because of the CV. The file is
 * validated, held in memory, attached to one email to careers@ and then
 * dropped — nothing is written to disk and nothing is stored. That is a
 * deliberate choice: a CV is personal data under both the DPDP Act and the
 * GDPR, and the safest store is the one that does not exist. The privacy
 * policy says the same thing, so the two cannot drift apart.
 *
 * The CV is optional. Plenty of good engineers would rather send a repository
 * link than a formatted document, and demanding a PDF filters for the wrong
 * thing.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 5 MB. A CV that does not fit is a CV with images in it. */
const MAX_CV_BYTES = 5 * 1024 * 1024;

const ALLOWED_CV = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"]
]);

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("A valid email is required").max(200),
  role: z.string().trim().min(1, "Pick a role").max(80),
  location: z.string().trim().max(120).optional().default(""),
  links: z.string().trim().max(600).optional().default(""),
  note: z
    .string()
    .trim()
    .min(10, "Tell us a little about why this role")
    .max(4000),
  /** Honeypot — see the enquiry route for why this is permissive. */
  website: z.string().max(400).optional().default("")
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
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

/** Keep a filename safe to put in a mail header. */
function safeName(name: string): string {
  return name.replace(/[^\w.\- ]+/g, "_").slice(0, 80);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    location: form.get("location") ?? "",
    links: form.get("links") ?? "",
    note: form.get("note"),
    website: form.get("website") ?? ""
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot filled → a bot. Answer 200 so it learns nothing.
  if (data.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  // The role has to be one we actually advertise, so the endpoint cannot be
  // used to send arbitrary subject lines into the careers inbox.
  const job = jobs.find((j) => j.id === data.role);
  if (!job) {
    return NextResponse.json(
      { ok: false, error: "That role is no longer open." },
      { status: 400 }
    );
  }

  // Validate the CV before the rate limit, so a rejected file does not burn an
  // attempt, and before touching SMTP.
  let attachment: { filename: string; content: Buffer } | null = null;
  const cv = form.get("cv");
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { ok: false, error: "That CV is over 5 MB. Please send a smaller file or a link." },
        { status: 400 }
      );
    }
    const ext = ALLOWED_CV.get(cv.type);
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "Please attach a PDF or Word document, or send a link instead." },
        { status: 400 }
      );
    }
    attachment = {
      filename: `${safeName(data.name)} — CV.${ext}`,
      content: Buffer.from(await cv.arrayBuffer())
    };
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many applications. Please try again in a minute." },
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
      `Role:     ${job.title} (${job.id})`,
      `Name:     ${data.name}`,
      `Email:    ${data.email}`,
      data.location ? `Location: ${data.location}` : null,
      data.links ? `Links:    ${data.links}` : null,
      `CV:       ${attachment ? "attached" : "not attached"}`,
      "",
      data.note,
      "",
      "—",
      "Sent from the careers page on praversetech.com"
    ]
      .filter((l) => l !== null)
      .join("\n");

    await transporter.sendMail({
      from: `"Praverse careers" <${required("SMTP_USER")}>`,
      to: process.env.CAREERS_TO ?? required("ENQUIRY_TO"),
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `Application — ${job.title} — ${data.name}`,
      text: lines,
      attachments: attachment ? [attachment] : undefined
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("application send failed", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not send that just now. Please email careers@praversetech.com directly."
      },
      { status: 502 }
    );
  }
}
