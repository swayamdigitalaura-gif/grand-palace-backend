import { Router } from "express";
import multer from "multer";
import { put } from "@vercel/blob";
import { handleUpload } from "@vercel/blob/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(requireAuth);

// Generic image upload used by every admin image field (menu items/categories,
// gallery photos, site banners, page hero images). Stores on Vercel Blob so it
// works from Vercel's serverless filesystem, not just local dev.
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const blob = await put(req.file.originalname, req.file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: req.file.mimetype,
  });
  res.status(201).json({ url: blob.url });
});

// Vercel serverless functions cap the request body at ~4.5MB, so anything
// bigger than that (most phone-camera photos) fails when routed through the
// endpoint above. This issues a short-lived upload token instead, and the
// browser then PUTs the file bytes straight to Blob storage, bypassing our
// function entirely.
router.post("/client-token", async (req, res) => {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
          "video/mp4", "video/webm", "video/quicktime",
        ],
        addRandomSuffix: true,
      }),
    });
    res.json(jsonResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
