import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list all published pages (for a "What's On" index, etc.)
router.get("/", async (req, res) => {
  const pages = await prisma.sitePage.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(pages);
});

// Public: get one page by slug — this is what a dynamic route like
// /whats-on/$slug fetches to render via WhatsOnSimpleTemplate.
router.get("/:slug", async (req, res) => {
  const page = await prisma.sitePage.findUnique({ where: { slug: req.params.slug } });
  if (!page || !page.published) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Admin: list every page including unpublished drafts
router.get("/admin/all", async (req, res) => {
  const pages = await prisma.sitePage.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(pages);
});

router.post("/", async (req, res) => {
  const page = await prisma.sitePage.create({ data: req.body });
  res.status(201).json(page);
});

router.patch("/:id", async (req, res) => {
  const page = await prisma.sitePage.update({ where: { id: req.params.id }, data: req.body });
  res.json(page);
});

router.delete("/:id", async (req, res) => {
  await prisma.sitePage.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
