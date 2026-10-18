import { topicLabel, type FileMeta, type TopicId } from "../../app/(frontend)/enquire/enquire";

export type EnquiryEmailData = {
  reference: string;
  topic: TopicId;
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  message: string;
  files?: (FileMeta & { url?: string })[] | null;
};

const BRAND = "#6E1218";
const INK = "#2f2f2f";
const MUTED = "#757575";
const CREAM = "#F1EDE3";

function escape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function multiline(value: string) {
  return escape(value).replace(/\r?\n/g, "<br />");
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${CREAM};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e3e3dc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:${INK};">
<tr><td style="padding:20px 28px;border-bottom:3px solid ${BRAND};">
<span style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND};font-weight:600;">Thimark</span>
</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;font-weight:600;">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:16px 28px;background:#fafaf7;border-top:1px solid #ecece6;font-size:12px;color:${MUTED};">
Thimark Technocreations (Pvt) Ltd · No. 379/D, Maharanugegoda, Kadawatha, Sri Lanka · +94 112 051 944
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function row(label: string, value: string) {
  return `<tr>
<td style="padding:8px 0;width:110px;vertical-align:top;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">${label}</td>
<td style="padding:8px 0;font-size:15px;line-height:1.5;">${value}</td>
</tr>`;
}

export function teamNotificationEmail(data: EnquiryEmailData, adminUrl: string) {
  const topic = topicLabel(data.topic);
  const files = data.files ?? [];
  const fileList = files.length
    ? files
        .map((file) =>
          file.url
            ? `<a href="${escape(file.url)}" style="color:${BRAND};">${escape(file.name)}</a>`
            : escape(file.name),
        )
        .join("<br />")
    : "None";

  const body = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Reference", `<strong>${escape(data.reference)}</strong>`)}
${row("Topic", escape(topic))}
${row("Name", escape(data.name))}
${data.company ? row("Company", escape(data.company)) : ""}
${row("Email", `<a href="mailto:${escape(data.email)}" style="color:${BRAND};">${escape(data.email)}</a>`)}
${row("Phone", `<a href="tel:${escape(data.phone.replace(/[^\d+]/g, ""))}" style="color:${BRAND};">${escape(data.phone)}</a>`)}
${row("Files", fileList)}
</table>
<div style="margin:20px 0;padding:16px 18px;background:#fafaf7;border-left:3px solid ${BRAND};font-size:15px;line-height:1.6;">${multiline(data.message)}</div>
<a href="${escape(adminUrl)}" style="display:inline-block;padding:12px 20px;background:${BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Open in CMS</a>
<p style="margin:16px 0 0;font-size:13px;color:${MUTED};">Reply to this email to answer ${escape(data.name)} directly.</p>`;

  return {
    subject: `New enquiry ${data.reference} · ${topic} · ${data.name}`,
    html: layout(`New ${topic.toLowerCase()} enquiry`, body),
    text: [
      `New enquiry ${data.reference}`,
      `Topic: ${topic}`,
      `Name: ${data.name}`,
      data.company ? `Company: ${data.company}` : "",
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Files: ${files.map((file) => file.name).join(", ") || "None"}`,
      "",
      data.message,
      "",
      `Open in CMS: ${adminUrl}`,
    ]
      .filter((line) => line !== "")
      .join("\n"),
  };
}

export function acknowledgementEmail(data: EnquiryEmailData) {
  const body = `
<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Dear ${escape(data.name)},</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Thank you for contacting Thimark. We have received your enquiry and our engineering team will review the requirement and reply shortly.</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;">Your reference is <strong>${escape(data.reference)}</strong>. Please quote it in any follow-up.</p>
<div style="padding:16px 18px;background:#fafaf7;border-left:3px solid ${BRAND};font-size:14px;line-height:1.6;color:${MUTED};">${multiline(data.message)}</div>`;

  return {
    subject: `We received your enquiry · ${data.reference}`,
    html: layout("Enquiry received", body),
    text: `Dear ${data.name},\n\nThank you for contacting Thimark. We have received your enquiry and will reply shortly.\n\nReference: ${data.reference}\n\n${data.message}`,
  };
}
