import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { sendMail, isMailConfigured, BOOKINGS_EMAIL } from "../lib/mailer.js";

const router = Router();
router.use(requireAuth);

// Admin-only: sends a plain test email to confirm SMTP creds work.
router.post("/", async (req, res) => {
  if (!isMailConfigured()) {
    return res.status(400).json({ ok: false, error: "SMTP not configured (SMTP_USER / SMTP_PASS missing)" });
  }
  const to = req.body?.to || BOOKINGS_EMAIL;
  const ok = await sendMail({
    to,
    subject: "Test email — The Grand Palace website",
    html: `<p style="font-family:sans-serif">This is a test email from The Grand Palace website backend. If you're reading this, SMTP is working. ✅</p>`,
  });
  res.json({ ok, to });
});

export default router;
