import { Router } from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Public: list gallery images, optionally filtered by category.
// Defaults to the "gallery-page" collection (the public /gallery page) when no
// ?collection= is given, so existing callers don't need to change.
router.get("/", async (req, res) => {
  const where = {
    collection: req.query.collection || "gallery-page",
    ...(req.query.category ? { category: req.query.category } : {}),
  };
  const images = await prisma.galleryImage.findMany({ where, orderBy: { sortOrder: "asc" } });
  res.json(images);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Upload a photo file -> returns its public URL, to be saved onto a
// GalleryImage row or a MenuItem/SitePage imageUrl field.
router.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const blob = await put(req.file.originalname, req.file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: req.file.mimetype,
  });
  res.status(201).json({ url: blob.url });
});

router.post("/", async (req, res) => {
  const { collection, category, url, alt, sortOrder } = req.body;
  const image = await prisma.galleryImage.create({
    data: { collection: collection || "gallery-page", category, url, alt, sortOrder: sortOrder ?? 0 },
  });
  res.status(201).json(image);
});

router.patch("/:id", async (req, res) => {
  const image = await prisma.galleryImage.update({ where: { id: req.params.id }, data: req.body });
  res.json(image);
});

router.delete("/:id", async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
