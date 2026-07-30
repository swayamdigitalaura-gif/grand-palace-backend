import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: birthday-package Reserve form submits here directly (AJAX, no mailto).
router.post("/", async (req, res) => {
  const { name, email, mobile, guests, date, time, cake, message } = req.body;
  if (!name || !email || !mobile || !guests || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const enquiry = await prisma.birthdayEnquiry.create({
    data: { name, email, mobile, guests, date, time, cake, message },
  });
  res.status(201).json(enquiry);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

router.get("/", async (req, res) => {
  const enquiries = await prisma.birthdayEnquiry.findMany({ orderBy: { createdAt: "desc" } });
  res.json(enquiries);
});

export default router;
