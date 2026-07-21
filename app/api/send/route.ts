import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "inquiry@praversetech.com";

function shell(content: string, accentLabel: string, accentColor: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Praverse Tech</title>
</head>
<body style="margin:0;padding:0;background:#0d0d11;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d11;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="padding-bottom:28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size:13px;font-weight:700;letter-spacing:0.18em;color:#3ca2fa;text-transform:uppercase;">PRAVERSE</span>
                <span style="font-size:13px;font-weight:400;letter-spacing:0.18em;color:#4a4a5e;text-transform:uppercase;margin-left:6px;">TECH</span>
              </td>
              <td align="right">
                <span style="display:inline-block;padding:4px 10px;border-radius:4px;background:${accentColor}18;border:1px solid ${accentColor}40;font-size:11px;font-weight:600;letter-spacing:0.1em;color:${accentColor};text-transform:uppercase;">${accentLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body card -->
      <tr>
        <td style="background:#13131a;border:1px solid #22223a;border-radius:12px;overflow:hidden;">
          ${content}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding-top:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px;color:#32324a;letter-spacing:0.04em;">
                This message was submitted via praversetech.com
              </td>
              <td align="right" style="font-size:11px;color:#32324a;letter-spacing:0.04em;">
                Intelligence · Engineered
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function row(label: string, value: string) {
  return `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid #1c1c2e;width:130px;vertical-align:top;">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;color:#4a4a6a;text-transform:uppercase;">${label}</span>
    </td>
    <td style="padding:12px 0 12px 20px;border-bottom:1px solid #1c1c2e;vertical-align:top;">
      <span style="font-size:14px;color:#c8cce8;line-height:1.5;">${value}</span>
    </td>
  </tr>`;
}

function buildContactHtml(fields: Record<string, string>) {
  const content = `
    <!-- Top rule + title -->
    <div style="padding:28px 32px 0;">
      <div style="height:2px;background:linear-gradient(90deg,#3ca2fa,#8b5cf6,transparent);border-radius:2px;margin-bottom:24px;"></div>
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;color:#4a4a6a;text-transform:uppercase;">New Inquiry</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#eef0ff;letter-spacing:-0.02em;line-height:1.2;">${fields.name}</h1>
      <p style="margin:0;font-size:13px;color:#5a5a7a;">${fields.email}</p>
    </div>

    <!-- Fields table -->
    <div style="padding:20px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Company", fields.company || "—")}
        ${row("Inquiry", fields.inquiryType)}
        ${row("Timeline", fields.timeline)}
        ${row("Budget", fields.budget || "—")}
      </table>
    </div>

    <!-- Message block -->
    <div style="margin:24px 32px;background:#0d0d14;border:1px solid #1c1c2e;border-radius:8px;padding:20px 22px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#4a4a6a;text-transform:uppercase;">Message</p>
      <p style="margin:0;font-size:14px;color:#c0c4e0;line-height:1.7;">${fields.message.replace(/\n/g, "<br/>")}</p>
    </div>

    <!-- Reply CTA -->
    <div style="padding:0 32px 28px;">
      <a href="mailto:${fields.email}" style="display:inline-block;padding:10px 22px;background:#3ca2fa;border-radius:6px;font-size:13px;font-weight:600;color:#0d0d11;text-decoration:none;letter-spacing:0.02em;">Reply to ${fields.name.split(" ")[0]} &rarr;</a>
    </div>
  `;
  return shell(content, "Inquiry", "#3ca2fa");
}

function buildInnovateHtml(fields: Record<string, string>) {
  const content = `
    <!-- Top rule + title -->
    <div style="padding:28px 32px 0;">
      <div style="height:2px;background:linear-gradient(90deg,#8b5cf6,#3ca2fa,transparent);border-radius:2px;margin-bottom:24px;"></div>
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;color:#4a4a6a;text-transform:uppercase;">Idea Submission</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#eef0ff;letter-spacing:-0.02em;line-height:1.2;">${fields.ideaTitle}</h1>
      <p style="margin:0;font-size:13px;color:#5a5a7a;">${fields.domain}</p>
    </div>

    <!-- Fields table -->
    <div style="padding:20px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Name", fields.name)}
        ${row("Email", fields.email)}
        ${row("Organization", fields.organization || "—")}
      </table>
    </div>

    <!-- Description block -->
    <div style="margin:24px 32px;background:#0d0d14;border:1px solid #1c1c2e;border-radius:8px;padding:20px 22px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.1em;color:#4a4a6a;text-transform:uppercase;">Description</p>
      <p style="margin:0;font-size:14px;color:#c0c4e0;line-height:1.7;">${fields.description.replace(/\n/g, "<br/>")}</p>
    </div>

    <!-- Reply CTA -->
    <div style="padding:0 32px 28px;">
      <a href="mailto:${fields.email}" style="display:inline-block;padding:10px 22px;background:#8b5cf6;border-radius:6px;font-size:13px;font-weight:600;color:#fff;text-decoration:none;letter-spacing:0.02em;">Reply to ${fields.name.split(" ")[0]} &rarr;</a>
    </div>
  `;
  return shell(content, "Venture Lab", "#8b5cf6");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formType, ...fields } = body as { formType: string } & Record<string, string>;

    let subject = "";
    let html = "";

    if (formType === "contact") {
      subject = `Inquiry from ${fields.name} — ${fields.inquiryType}`;
      html = buildContactHtml(fields);
    } else if (formType === "innovate") {
      subject = `Idea: ${fields.ideaTitle} — ${fields.domain}`;
      html = buildInnovateHtml(fields);
    } else {
      return NextResponse.json({ error: "Unknown form type" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Praverse Tech <noreply@praversetech.com>",
      to: TO,
      replyTo: fields.email,
      subject,
      html,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
