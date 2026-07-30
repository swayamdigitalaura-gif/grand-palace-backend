import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: all toggles, keyed by slug (e.g. "lunch-special")
router.get("/", async (req, res) => {
  const toggles = await prisma.siteToggle.findMany();
  res.json(toggles);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

router.put("/:key", async (req, res) => {
  const { label, active } = req.body;
  const toggle = await prisma.siteToggle.upsert({
    where: { key: req.params.key },
    update: { label, active },
    create: { key: req.params.key, label, active: active ?? true },
  });
  res.json(toggle);
});

export default router;
