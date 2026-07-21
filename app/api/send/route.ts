import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "inquiry@praversetech.com";

function shell(content: string, badge: string, badgeColor: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0d0d11;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d11;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:28px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><span style="font-size:13px;font-weight:700;letter-spacing:.18em;color:#3ca2fa;text-transform:uppercase;">PRAVERSE</span><span style="font-size:13px;font-weight:400;letter-spacing:.18em;color:#3a3a52;text-transform:uppercase;margin-left:6px;">TECH</span></td>
          <td align="right"><span style="display:inline-block;padding:4px 10px;border-radius:4px;background:${badgeColor}18;border:1px solid ${badgeColor}40;font-size:11px;font-weight:600;letter-spacing:.1em;color:${badgeColor};text-transform:uppercase;">${badge}</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#13131a;border:1px solid #22223a;border-radius:12px;overflow:hidden;">${content}</td></tr>
      <tr><td style="padding-top:24px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:11px;color:#2a2a3e;letter-spacing:.04em;">Submitted via praversetech.com</td>
          <td align="right" style="font-size:11px;color:#2a2a3e;letter-spacing:.04em;">Intelligence &middot; Engineered</td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #1c1c2e;width:130px;vertical-align:top;"><span style="font-size:11px;font-weight:600;letter-spacing:.1em;color:#44446a;text-transform:uppercase;">${label}</span></td>
    <td style="padding:12px 0 12px 20px;border-bottom:1px solid #1c1c2e;vertical-align:top;"><span style="font-size:14px;color:#c8cce8;line-height:1.5;">${value}</span></td>
  </tr>`;
}

function msgBlock(label: string, text: string) {
  return `<div style="margin:24px 32px;background:#0d0d14;border:1px solid #1c1c2e;border-radius:8px;padding:20px 22px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:.1em;color:#44446a;text-transform:uppercase;">${label}</p>
    <p style="margin:0;font-size:14px;color:#c0c4e0;line-height:1.7;">${text.replace(/\n/g, "<br/>")}</p>
  </div>`;
}

function replyBtn(email: string, firstName: string, color: string) {
  return `<div style="padding:0 32px 28px;"><a href="mailto:${email}" style="display:inline-block;padding:10px 22px;background:${color};border-radius:6px;font-size:13px;font-weight:600;color:${color === "#3ca2fa" ? "#0d0d11" : "#fff"};text-decoration:none;letter-spacing:.02em;">Reply to ${firstName} &rarr;</a></div>`;
}

function buildContactHtml(f: Record<string, string>) {
  const content = `
    <div style="padding:28px 32px 0;">
      <div style="height:2px;background:linear-gradient(90deg,#06b6d4,#3b82f6,transparent);border-radius:2px;margin-bottom:24px;"></div>
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.12em;color:#44446a;text-transform:uppercase;">General Message</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#eef0ff;letter-spacing:-.02em;line-height:1.2;">${f.name}</h1>
      <p style="margin:0;font-size:13px;color:#55556a;">${f.email}</p>
    </div>
    <div style="padding:20px 32px 0;"><table width="100%" cellpadding="0" cellspacing="0">
      ${row("Subject", f.subject)}
      ${f.phone ? row("Phone", f.phone) : ""}
    </table></div>
    ${msgBlock("Message", f.message)}
    ${replyBtn(f.email, f.name.split(" ")[0], "#3ca2fa")}`;
  return shell(content, "Contact", "#3ca2fa");
}

function buildProjectHtml(f: Record<string, string>) {
  const content = `
    <div style="padding:28px 32px 0;">
      <div style="height:2px;background:linear-gradient(90deg,#8b5cf6,#3ca2fa,transparent);border-radius:2px;margin-bottom:24px;"></div>
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.12em;color:#44446a;text-transform:uppercase;">Project Brief</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#eef0ff;letter-spacing:-.02em;line-height:1.2;">${f.name}</h1>
      <p style="margin:0;font-size:13px;color:#55556a;">${f.email}</p>
    </div>
    <div style="padding:20px 32px 0;"><table width="100%" cellpadding="0" cellspacing="0">
      ${row("Company", f.company || "—")}
      ${row("Inquiry", f.inquiryType)}
      ${row("Timeline", f.timeline)}
      ${row("Budget", f.budget || "—")}
    </table></div>
    ${msgBlock("What to build", f.message)}
    ${replyBtn(f.email, f.name.split(" ")[0], "#8b5cf6")}`;
  return shell(content, "Project Brief", "#8b5cf6");
}

function buildInnovateHtml(f: Record<string, string>) {
  const content = `
    <div style="padding:28px 32px 0;">
      <div style="height:2px;background:linear-gradient(90deg,#8b5cf6,#3ca2fa,transparent);border-radius:2px;margin-bottom:24px;"></div>
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.12em;color:#44446a;text-transform:uppercase;">Idea Submission</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#eef0ff;letter-spacing:-.02em;line-height:1.2;">${f.ideaTitle}</h1>
      <p style="margin:0;font-size:13px;color:#55556a;">${f.domain}</p>
    </div>
    <div style="padding:20px 32px 0;"><table width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", f.name)}
      ${row("Email", f.email)}
      ${row("Organization", f.organization || "—")}
    </table></div>
    ${msgBlock("Description", f.description)}
    ${replyBtn(f.email, f.name.split(" ")[0], "#8b5cf6")}`;
  return shell(content, "Venture Lab", "#8b5cf6");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formType, ...fields } = body as { formType: string } & Record<string, string>;

    let subject = "";
    let html = "";

    if (formType === "contact") {
      subject = `Message from ${fields.name} — ${fields.subject}`;
      html = buildContactHtml(fields);
    } else if (formType === "project") {
      subject = `Project Brief from ${fields.name} — ${fields.inquiryType}`;
      html = buildProjectHtml(fields);
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
