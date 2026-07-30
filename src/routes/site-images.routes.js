import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: all banner/hero images, keyed by slug (e.g. "home-hero")
router.get("/", async (req, res) => {
  const images = await prisma.siteImage.findMany();
  res.json(images);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Upsert by key — the admin UI always knows which key it's editing.
router.put("/:key", async (req, res) => {
  const { label, url } = req.body;
  const image = await prisma.siteImage.upsert({
    where: { key: req.params.key },
    update: { label, url },
    create: { key: req.params.key, label, url },
  });
  res.json(image);
});

router.delete("/:key", async (req, res) => {
  await prisma.siteImage.delete({ where: { key: req.params.key } }).catch(() => {});
  res.status(204).end();
});

export default router;
