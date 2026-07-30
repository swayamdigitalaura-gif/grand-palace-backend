import nodemailer from "nodemailer";

// SMTP config from env. Defaults suit Gmail / Google Workspace (the
// "app password" flow). If bookings@ is hosted elsewhere, only SMTP_HOST /
// SMTP_PORT need changing — nothing else here does.
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_NAME = process.env.MAIL_FROM_NAME || "The Grand Palace Indian Restaurant";
export const BOOKINGS_EMAIL = process.env.BOOKINGS_EMAIL || "bookings@thegrandpalace.com.au";

export function isMailConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS);
}

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

// Never throws — email must never break a payment webhook or a form submit.
// Returns true/false so callers can log without special handling.
export async function sendMail({ to, subject, html, replyTo }) {
  if (!isMailConfigured()) {
    console.warn("[mailer] SMTP not configured — skipping email:", subject);
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo,
    });
    return true;
  } catch (err) {
    console.error("[mailer] send failed:", err.message);
    return false;
  }
}

/* ─────────────────────────── HTML templates ─────────────────────────── */

const BRAND = { gold: "#c8860a", palace: "#1a0e00", cream: "#fdf6e8" };
const LOGO_URL = "https://palace-art-reimagined-main.vercel.app/email-logo.png";

// Public-facing contact details shown in every email footer. Deliberately
// hardcoded to the real business details — independent of the SMTP/notification
// address (which is a test inbox for now).
const CONTACT = {
  phoneDisplay: "(02) 8021 7696",
  phoneTel: "+61280217696",
  email: "bookings@thegrandpalace.com.au",
  address: "Basement, 261 George Street, Sydney NSW 2000",
  // Google Maps directions — opens with the recipient's current location as
  // the start point and the restaurant as the destination.
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("The Grand Palace Indian Restaurant, 261 George Street, Sydney NSW 2000"),
};

function shell(innerHtml, { preheader = "" } = {}) {
  // Header intentionally uses a LIGHT background, not the brand's near-black
  // palace colour — Gmail's mobile app dark-mode filter doesn't reliably
  // honour color-scheme meta tags and was re-darkening/washing out a dark
  // header into an unreadable double-box. A light banner can't be mangled
  // that way since it renders the same whether dark mode touches it or not.
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<style>body,table,td,div,p{-webkit-text-size-adjust:100%;}</style>
</head>
<body style="margin:0;padding:0;background:#f4efe4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2a2118;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4efe4" style="background:#f4efe4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr><td bgcolor="${BRAND.cream}" style="background-color:${BRAND.cream};padding:24px 32px;text-align:center;border-bottom:3px solid ${BRAND.gold};">
          <img src="${LOGO_URL}" width="72" height="72" alt="The Grand Palace" style="display:block;margin:0 auto 10px;width:72px;height:72px;" />
          <div style="color:${BRAND.gold};font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">Sydney CBD &middot; Grand Indian Dining</div>
          <div style="color:${BRAND.palace};font-size:26px;font-weight:700;margin-top:6px;">The Grand Palace</div>
        </td></tr>
        <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:32px;">${innerHtml}</td></tr>
        <tr><td bgcolor="#faf6ee" style="background:#faf6ee;padding:24px 32px;text-align:center;border-top:1px solid #eee5d5;">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};font-weight:600;margin-bottom:12px;">Get in touch</div>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
            <td style="padding:0 10px;font-size:13px;">
              <a href="tel:${CONTACT.phoneTel}" style="color:#4a3f30;text-decoration:none;font-weight:600;">📞 ${CONTACT.phoneDisplay}</a>
            </td>
            <td style="color:#cbb98f;">|</td>
            <td style="padding:0 10px;font-size:13px;">
              <a href="mailto:${CONTACT.email}" style="color:#4a3f30;text-decoration:none;font-weight:600;">✉️ Email us</a>
            </td>
          </tr></table>
          <div style="margin-top:12px;font-size:13px;">
            <a href="${CONTACT.mapsUrl}" style="color:#4a3f30;text-decoration:none;line-height:1.6;">
              📍 ${CONTACT.address}<br>
              <span style="color:${BRAND.gold};font-weight:600;font-size:12px;">Get directions →</span>
            </a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function detailsTable(rows) {
  const trs = rows
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v], i) =>
        `<tr style="background:${i % 2 ? "#ffffff" : "#faf6ee"};">
          <td style="padding:10px 14px;font-size:13px;color:#8a7a60;">${k}</td>
          <td style="padding:10px 14px;font-size:13px;color:#2a2118;font-weight:600;text-align:right;">${escapeHtml(String(v))}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee5d5;border-radius:10px;overflow:hidden;">${trs}</table>`;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── Birthday: customer confirmation (full summary) ── */
export function birthdayCustomerEmail({ name, email, mobile, guests, date, time, cake, amountPaid }) {
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:22px;color:${BRAND.palace};">Your birthday celebration is booked! 🎉</h1>
     <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a3f30;">
       Thank You, ${escapeHtml(name || "Guest")} — Your payment has been received for Birthday Celebration at
       The Grand Palace - Indian Restaurant. Here is your booking summary:
     </p>
     ${detailsTable([
       ["Guest name", name],
       ["Date", date],
       ["Time", time],
       ["Number of guests", guests],
       ["Cake", cake],
       ["Package", "TGP Celebrate Birthday"],
       ["Amount paid", amountPaid ? `A$${amountPaid}` : null],
     ])}
     <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#4a3f30;">
       Our team will be in touch to finalise the details. If you need to change anything, just reply to this
       email or call us on <strong>(02) 8021 7696</strong>.
     </p>
     <p style="margin:16px 0 0;font-size:14px;color:#4a3f30;">We can't wait to celebrate with you!</p>`,
    { preheader: "Your birthday booking at The Grand Palace is confirmed." }
  );
  return { to: email, subject: "Your Birthday Celebration is Booked — The Grand Palace", html };
}

/* ── Birthday: internal notification to bookings@ ── */
export function birthdayBookingsEmail({ name, email, mobile, guests, date, time, cake, message, amountPaid, stripeSessionId }) {
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:20px;color:${BRAND.palace};">New Birthday Booking — Paid ✅</h1>
     <p style="margin:0 0 20px;font-size:14px;color:#4a3f30;">A birthday package payment has just been completed.</p>
     ${detailsTable([
       ["Name", name],
       ["Email", email],
       ["Mobile", mobile],
       ["Date", date],
       ["Time", time],
       ["Guests", guests],
       ["Cake", cake],
       ["Message", message],
       ["Amount paid", amountPaid ? `A$${amountPaid}` : null],
       ["Stripe session", stripeSessionId],
     ])}`,
    { preheader: `New paid birthday booking — ${name || "guest"}` }
  );
  return { to: BOOKINGS_EMAIL, subject: `New Birthday Booking (Paid) — ${name || "Guest"}`, html, replyTo: email || undefined };
}

/* ── Catering order: customer confirmation (full summary) ── */
export function cateringCustomerEmail({ name, email, vegQty, nonVegQty, pickupDate, pickupTime, delivery, amountPaid }) {
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:22px;color:${BRAND.palace};">Your Platter Box order is confirmed! 🎉</h1>
     <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a3f30;">
       Thank you, ${escapeHtml(name || "Guest")} — your payment has been received for a TGP Platter Box order.
       Here is your order summary:
     </p>
     ${detailsTable([
       ["Veg Platter Box", vegQty && Number(vegQty) > 0 ? `× ${vegQty}` : null],
       ["Non-Veg Platter Box", nonVegQty && Number(nonVegQty) > 0 ? `× ${nonVegQty}` : null],
       ["Fulfilment", delivery === "delivery" ? "CBD Delivery (fee arranged separately)" : "Pickup — 261 George St"],
       ["Pickup date", pickupDate],
       ["Pickup time", pickupTime],
       ["Amount paid", amountPaid ? `A$${amountPaid}` : null],
     ])}
     <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#4a3f30;">
       Your order will be ready as per the pickup slot above. If you need to change anything, just reply to this
       email or call us on <strong>(02) 8021 7696</strong>.
     </p>`,
    { preheader: "Your Platter Box order at The Grand Palace is confirmed." }
  );
  return { to: email, subject: "Your Platter Box Order is Confirmed — The Grand Palace", html };
}

/* ── Catering order: internal notification to bookings@ ── */
export function cateringBookingsEmail({ name, email, mobile, vegQty, nonVegQty, pickupDate, pickupTime, delivery, message, amountPaid, stripeSessionId }) {
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:20px;color:${BRAND.palace};">New Platter Box Order — Paid ✅</h1>
     <p style="margin:0 0 20px;font-size:14px;color:#4a3f30;">A platter box order payment has just been completed.</p>
     ${detailsTable([
       ["Name", name],
       ["Email", email],
       ["Mobile", mobile],
       ["Veg Platter Box", vegQty && Number(vegQty) > 0 ? `× ${vegQty}` : null],
       ["Non-Veg Platter Box", nonVegQty && Number(nonVegQty) > 0 ? `× ${nonVegQty}` : null],
       ["Fulfilment", delivery === "delivery" ? "CBD Delivery" : "Pickup"],
       ["Pickup date", pickupDate],
       ["Pickup time", pickupTime],
       ["Message", message],
       ["Amount paid", amountPaid ? `A$${amountPaid}` : null],
       ["Stripe session", stripeSessionId],
     ])}`,
    { preheader: `New paid platter box order — ${name || "guest"}` }
  );
  return { to: BOOKINGS_EMAIL, subject: `New Platter Box Order (Paid) — ${name || "Guest"}`, html, replyTo: email || undefined };
}

/* ── Generic enquiry: customer acknowledgement ── */
export function enquiryCustomerEmail({ name, email, type, subject: subj }) {
  const typeLabel = { contact: "enquiry", events: "event enquiry", "office-catering": "catering enquiry", "venue-catering": "catering enquiry", "venue-for-hire": "venue hire enquiry", birthday: "birthday enquiry" }[type] || "enquiry";
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:22px;color:${BRAND.palace};">We've received your ${typeLabel} ✦</h1>
     <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4a3f30;">
       Thank you, ${escapeHtml(name || "there")}. We've received your ${escapeHtml(subj || typeLabel)} and our team
       will be in touch within 24–48 hours.
     </p>
     <p style="margin:0;font-size:14px;line-height:1.6;color:#4a3f30;">
       For anything urgent, call us on <strong>(02) 8021 7696</strong>.
     </p>`,
    { preheader: "Thanks for contacting The Grand Palace — we'll be in touch soon." }
  );
  return { to: email, subject: "We've received your enquiry — The Grand Palace", html };
}

/* ── Generic enquiry: internal notification to bookings@ ── */
export function enquiryBookingsEmail({ name, email, phone, type, subject: subj, message, data }) {
  const extraRows = data && typeof data === "object"
    ? Object.entries(data).map(([k, v]) => [k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), v])
    : [];
  const html = shell(
    `<h1 style="margin:0 0 8px;font-size:20px;color:${BRAND.palace};">New ${escapeHtml(type || "enquiry")} enquiry</h1>
     ${detailsTable([
       ["Name", name],
       ["Email", email],
       ["Phone", phone],
       ["Subject", subj],
       ["Message", message],
       ...extraRows,
     ])}`,
    { preheader: `New ${type} enquiry from ${name || "website"}` }
  );
  return { to: BOOKINGS_EMAIL, subject: `New ${type || "website"} enquiry — ${name || "Guest"}`, html, replyTo: email || undefined };
}
