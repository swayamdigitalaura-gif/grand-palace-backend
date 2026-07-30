import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: active reviews only, ordered for display.
router.get("/", async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json(reviews);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Admin: every review, including inactive ones.
router.get("/admin/all", async (req, res) => {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  res.json(reviews);
});

router.post("/", async (req, res) => {
  try {
    const { name, quote, stars, source, reviewerMeta, active, sortOrder } = req.body;
    const review = await prisma.review.create({
      data: {
        name, quote,
        stars: stars ?? 5,
        source: source || null,
        reviewerMeta: reviewerMeta || null,
        active: active ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error("Review create failed:", err.message);
    res.status(400).json({ error: "Could not save review." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const review = await prisma.review.update({ where: { id: req.params.id }, data: req.body });
    res.json(review);
  } catch (err) {
    console.error("Review update failed:", err.message);
    res.status(400).json({ error: "Could not save review." });
  }
});

router.delete("/:id", async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
