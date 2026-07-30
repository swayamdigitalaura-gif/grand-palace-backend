import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list published guides (for the /guides index to merge with its
// static list, and to know which slugs are backend-driven now).
router.get("/", async (req, res) => {
  const guides = await prisma.guide.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json(guides);
});

// Public: get one guide by slug — /guides/$slug fetches this first and only
// falls back to the bundled static guide data if nothing is found here.
router.get("/:slug", async (req, res) => {
  const guide = await prisma.guide.findUnique({ where: { slug: req.params.slug } });
  if (!guide || !guide.published) return res.status(404).json({ error: "Guide not found" });
  res.json(guide);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Admin: list every guide including unpublished drafts
router.get("/admin/all", async (req, res) => {
  const guides = await prisma.guide.findMany({ orderBy: { sortOrder: "asc" } });
  res.json(guides);
});

router.post("/", async (req, res) => {
  try {
    const guide = await prisma.guide.create({ data: req.body });
    res.status(201).json(guide);
  } catch (err) {
    console.error("Guide create failed:", err.message);
    const message = err.code === "P2002" ? "A guide with that URL slug already exists." : "Could not save guide.";
    res.status(400).json({ error: message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const guide = await prisma.guide.update({ where: { id: req.params.id }, data: req.body });
    res.json(guide);
  } catch (err) {
    console.error("Guide update failed:", err.message);
    res.status(400).json({ error: "Could not save guide." });
  }
});

router.delete("/:id", async (req, res) => {
  await prisma.guide.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
