import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendMail, enquiryCustomerEmail, enquiryBookingsEmail } from "../lib/mailer.js";

const router = Router();

const VALID_TYPES = [
  "contact",
  "events",
  "office-catering",
  "venue-catering",
  "venue-for-hire",
  "birthday",
];

// ── Public: standard single-submit forms (Contact, Events, Catering, etc.) ──
// One row per submission. `data` carries any type-specific extra fields.
router.post("/", async (req, res) => {
  const { type, name, email, phone, subject, message, data } = req.body;
  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid or missing enquiry type" });
  }
  const enquiry = await prisma.enquiry.create({
    data: {
      type,
      status: "new",
      name: name || null,
      email: email || null,
      phone: phone || null,
      subject: subject || null,
      message: message || null,
      data: data ?? undefined,
    },
  });

  // Notify bookings@ of the new enquiry, and acknowledge to the customer if
  // they left an email. Non-blocking: sendMail never throws, and we respond
  // to the form regardless so a mail hiccup can't fail the submission.
  await sendMail(enquiryBookingsEmail({ name, email, phone, type, subject, message, data }));
  if (email) await sendMail(enquiryCustomerEmail({ name, email, type, subject }));

  res.status(201).json(enquiry);
});

// ── Public: progressive tracking for multi-step forms (Birthday wizard) ──
// Upserts by sessionId so a lead is captured the moment the first field is
// typed, then updated on every change/step. `status` is "in-progress" until
// the visitor completes payment, when the client sends "completed".
router.post("/track", async (req, res) => {
  const { sessionId, type, name, email, phone, subject, message, step, status, data } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid or missing enquiry type" });
  }

  const fields = {
    type,
    name: name || null,
    email: email || null,
    phone: phone || null,
    subject: subject || null,
    message: message || null,
    step: step || null,
    status: status || "in-progress",
    data: data ?? undefined,
  };

  const enquiry = await prisma.enquiry.upsert({
    where: { sessionId },
    create: { sessionId, ...fields },
    update: fields,
  });
  res.status(200).json({ id: enquiry.id });
});

// ── Admin-only from here ─────────────────────────────────────────
router.use(requireAuth);

// List, optionally filtered by ?type= and/or ?status=. Newest first.
router.get("/", async (req, res) => {
  const { type, status } = req.query;
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  const enquiries = await prisma.enquiry.findMany({ where, orderBy: { updatedAt: "desc" } });
  res.json(enquiries);
});

// Counts per type — used to badge the admin tabs.
router.get("/counts", async (_req, res) => {
  const grouped = await prisma.enquiry.groupBy({ by: ["type"], _count: { _all: true } });
  const counts = {};
  for (const g of grouped) counts[g.type] = g._count._all;
  res.json(counts);
});

router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  const enquiry = await prisma.enquiry.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(enquiry);
});

router.delete("/:id", async (req, res) => {
  await prisma.enquiry.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
