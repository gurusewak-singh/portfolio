/**
 * Premium HTML email templates that match the portfolio's monochrome
 * editorial theme. Designed to render correctly across major email
 * clients (Gmail web/iOS/Android, Apple Mail, Outlook desktop).
 *
 * Constraints we work around:
 *   - Email clients strip <style> blocks aggressively → all styling inline.
 *   - Outlook does not support flexbox → table-based layout.
 *   - No web fonts → fall back to system stack:
 *       Helvetica/Arial   → Outfit-ish body
 *       Georgia           → Syne-ish display
 *       Courier New       → DM Mono-ish accents
 *   - Some clients invert dark themes → we keep both bg + fg explicit.
 *   - No backdrop-filter, no advanced gradients, no CSS variables.
 */

const COLORS = {
  bg: "#000000",
  card: "#0a0a0a",
  cardBorder: "rgba(255,255,255,0.09)",
  innerCard: "#101010",
  innerBorder: "rgba(255,255,255,0.07)",
  textPrimary: "#ffffff",
  textBody: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.45)",
  divider: "rgba(255,255,255,0.06)",
  accent: "#ffffff",
};

const FONTS = {
  body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  display: "Georgia, 'Times New Roman', serif",
  mono: "'SF Mono', Menlo, Consolas, 'Courier New', monospace",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

interface ShellOpts {
  preheader: string;
  eyebrow: string;
  title: string;
  bodyHtml: string;
  /** Optional CTA at the bottom of the email */
  cta?: { label: string; url: string };
}

/**
 * Render the shared shell (wordmark + body + footer). bodyHtml is
 * inserted as-is; callers must escape user-supplied content.
 */
function renderShell({
  preheader,
  eyebrow,
  title,
  bodyHtml,
  cta,
}: ShellOpts): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};color:${COLORS.textBody};">
  <!-- Preheader (hidden from view, shown in inbox preview list) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${COLORS.bg};">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;background-color:${COLORS.card};border:1px solid ${COLORS.cardBorder};border-radius:16px;overflow:hidden;">

          <!-- Wordmark / eyebrow -->
          <tr>
            <td style="padding:32px 36px 22px;border-bottom:1px solid ${COLORS.divider};">
              <p style="margin:0;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.textMuted};">
                ${escapeHtml(eyebrow)}
              </p>
              <h1 style="margin:10px 0 0;font-family:${FONTS.display};font-size:30px;font-weight:800;line-height:1.05;letter-spacing:-0.02em;color:${COLORS.textPrimary};">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 36px 32px;">
              ${bodyHtml}
              ${
                cta
                  ? `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
                <tr>
                  <td style="border-radius:8px;background-color:${COLORS.accent};">
                    <a href="${escapeHtml(cta.url)}" target="_blank"
                       style="display:inline-block;padding:12px 24px;font-family:${FONTS.body};font-size:14px;font-weight:600;color:#000000;text-decoration:none;letter-spacing:0.01em;">
                      ${escapeHtml(cta.label)} &rarr;
                    </a>
                  </td>
                </tr>
              </table>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer / brand -->
          <tr>
            <td style="padding:18px 36px 26px;border-top:1px solid ${COLORS.divider};">
              <p style="margin:0;font-family:${FONTS.display};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${COLORS.textPrimary};">
                Gurusewak<span style="color:${COLORS.textMuted};font-weight:400;">.in</span>
              </p>
              <p style="margin:6px 0 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${COLORS.textMuted};">
                AI / ML Engineer &middot; Portfolio
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.32);">
          Sent from gurusewak.in
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* =============================================================
   Template 1: Contact-form notification (sent TO admin)
   ============================================================= */
export interface ContactNotificationFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function buildContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: ContactNotificationFields): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  const bodyHtml = `
    <p style="margin:0 0 22px;font-family:${FONTS.body};font-size:15px;line-height:1.65;color:${COLORS.textBody};">
      Someone just reached out through your portfolio contact form.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="margin:0 0 18px;background-color:${COLORS.innerCard};border:1px solid ${COLORS.innerBorder};border-radius:10px;">
      <tr>
        <td style="padding:18px 22px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding:9px 16px 9px 0;font-family:${FONTS.mono};font-size:11px;line-height:22px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.textMuted};width:88px;vertical-align:middle;">
                Name
              </td>
              <td style="padding:9px 0;font-family:${FONTS.body};font-size:15px;line-height:22px;color:${COLORS.textPrimary};vertical-align:middle;">
                ${safeName}
              </td>
            </tr>
            <tr>
              <td style="padding:9px 16px 9px 0;font-family:${FONTS.mono};font-size:11px;line-height:22px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.textMuted};vertical-align:middle;">
                Email
              </td>
              <td style="padding:9px 0;font-family:${FONTS.body};font-size:15px;line-height:22px;vertical-align:middle;">
                <a href="mailto:${safeEmail}" style="color:${COLORS.textPrimary};text-decoration:underline;text-decoration-color:${COLORS.textMuted};">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:9px 16px 9px 0;font-family:${FONTS.mono};font-size:11px;line-height:22px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.textMuted};vertical-align:middle;">
                Subject
              </td>
              <td style="padding:9px 0;font-family:${FONTS.body};font-size:15px;line-height:22px;color:${COLORS.textPrimary};vertical-align:middle;">
                ${safeSubject}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="background-color:${COLORS.innerCard};border:1px solid ${COLORS.innerBorder};border-radius:10px;">
      <tr>
        <td style="padding:20px 22px 8px;">
          <p style="margin:0 0 4px;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.textMuted};">
            Message
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 22px 22px;">
          <p style="margin:0;font-family:${FONTS.body};font-size:15px;line-height:1.75;color:${COLORS.textPrimary};white-space:pre-wrap;">${safeMessage}</p>
        </td>
      </tr>
    </table>
  `;

  return renderShell({
    preheader: `New message from ${name}: ${subject}`,
    eyebrow: "Inbox · New message",
    title: "Someone reached out.",
    bodyHtml,
  });
}

/* =============================================================
   Template 2: Reply (sent TO the contact, FROM admin)
   ============================================================= */
export interface ReplyFields {
  toName: string;
  originalSubject: string;
  originalMessage: string;
  replyMessage: string;
  fromName?: string;
  portfolioUrl?: string;
}

export function buildReplyEmail({
  toName,
  originalSubject,
  originalMessage,
  replyMessage,
  fromName = "Gurusewak",
  portfolioUrl = "https://gurusewak.in",
}: ReplyFields): string {
  const safeToName = escapeHtml(toName);
  const safeOriginalSubject = escapeHtml(originalSubject);
  const safeOriginalMessage = escapeHtml(originalMessage);
  const safeReply = escapeHtml(replyMessage);
  const safeFromName = escapeHtml(fromName);

  const bodyHtml = `
    <p style="margin:0 0 18px;font-family:${FONTS.body};font-size:15px;line-height:1.65;color:${COLORS.textPrimary};">
      Hi ${safeToName},
    </p>

    <div style="margin:0 0 26px;font-family:${FONTS.body};font-size:15px;line-height:1.75;color:${COLORS.textPrimary};white-space:pre-wrap;">${safeReply}</div>

    <p style="margin:0 0 4px;font-family:${FONTS.body};font-size:15px;line-height:1.5;color:${COLORS.textPrimary};">
      Best,<br>
      ${safeFromName}
    </p>

    <hr style="border:none;border-top:1px solid ${COLORS.divider};margin:32px 0 22px;">

    <p style="margin:0 0 10px;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.textMuted};">
      In reply to
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="background-color:${COLORS.innerCard};border:1px solid ${COLORS.innerBorder};border-radius:10px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-family:${FONTS.body};font-size:14px;font-weight:600;color:${COLORS.textPrimary};">
            ${safeOriginalSubject}
          </p>
          <p style="margin:0;font-family:${FONTS.body};font-size:13px;line-height:1.7;color:${COLORS.textMuted};white-space:pre-wrap;">${safeOriginalMessage}</p>
        </td>
      </tr>
    </table>
  `;

  return renderShell({
    preheader: `Re: ${originalSubject}`,
    eyebrow: `Reply · From ${fromName}`,
    title: `Re: ${originalSubject}`,
    bodyHtml,
    cta: { label: "View Portfolio", url: portfolioUrl },
  });
}
