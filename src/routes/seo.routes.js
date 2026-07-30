import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://palace-art-reimagined-main.vercel.app/sitemap.xml`;

// ── Public: consumed by the frontend on every request/page render ──────────

// Single-page SEO override lookup — used by a page's loader to decide
// whether to override its own hardcoded meta.
router.get("/pages/lookup", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const setting = await prisma.seoSetting.findUnique({ where: { path } });
  res.json(setting ?? null);
});

// Single active redirect lookup — used by request middleware on every
// request. Cheap indexed lookup, not a full-table fetch.
router.get("/redirects/lookup", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const redirect = await prisma.redirect.findFirst({ where: { fromPath: path, active: true } });
  res.json(redirect ?? null);
});

// All active redirects + all SeoSetting paths — used to build sitemap.xml
// (so redirected/overridden pages are handled correctly) without needing
// admin auth (sitemap.xml is a public crawlable endpoint).
router.get("/sitemap-data", async (_req, res) => {
  const [redirects, pages] = await Promise.all([
    prisma.redirect.findMany({ where: { active: true }, select: { fromPath: true } }),
    prisma.seoSetting.findMany({ select: { path: true, updatedAt: true } }),
  ]);
  res.json({ redirects, pages });
});

// Site-wide config (robots.txt content, header/footer injected code).
router.get("/config", async (_req, res) => {
  const config = await prisma.siteSeoConfig.findUnique({ where: { id: "singleton" } });
  res.json(config ?? { id: "singleton", robotsTxt: DEFAULT_ROBOTS_TXT, headerCode: null, footerCode: null });
});

// ── Admin-only from here ────────────────────────────────────────────────
router.use(requireAuth);

router.get("/pages", async (_req, res) => {
  const pages = await prisma.seoSetting.findMany({ orderBy: { path: "asc" } });
  res.json(pages);
});

router.put("/pages", async (req, res) => {
  const { path, metaTitle, metaDescription, focusKeywords, ogImage, canonicalUrl, schema, headTags } = req.body;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const setting = await prisma.seoSetting.upsert({
    where: { path },
    create: { path, metaTitle, metaDescription, focusKeywords, ogImage, canonicalUrl, schema, headTags },
    update: { metaTitle, metaDescription, focusKeywords, ogImage, canonicalUrl, schema, headTags },
  });
  res.json(setting);
});

router.delete("/pages", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  await prisma.seoSetting.deleteMany({ where: { path } });
  res.status(204).end();
});

router.get("/redirects", async (_req, res) => {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
  res.json(redirects);
});

router.post("/redirects", async (req, res) => {
  const { fromPath, toPath, statusCode } = req.body;
  if (!fromPath || !toPath) return res.status(400).json({ error: "fromPath and toPath are required" });
  if (fromPath === toPath) return res.status(400).json({ error: "fromPath and toPath cannot be the same" });
  try {
    const redirect = await prisma.redirect.create({
      data: { fromPath, toPath, statusCode: statusCode ?? 301 },
    });
    res.status(201).json(redirect);
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "A redirect from this path already exists" });
    throw err;
  }
});

router.patch("/redirects/:id", async (req, res) => {
  const { fromPath, toPath, statusCode, active } = req.body;
  const redirect = await prisma.redirect.update({
    where: { id: req.params.id },
    data: { fromPath, toPath, statusCode, active },
  });
  res.json(redirect);
});

router.delete("/redirects/:id", async (req, res) => {
  await prisma.redirect.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

router.put("/config", async (req, res) => {
  const { robotsTxt, headerCode, footerCode } = req.body;
  const config = await prisma.siteSeoConfig.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", robotsTxt, headerCode, footerCode },
    update: { robotsTxt, headerCode, footerCode },
  });
  res.json(config);
});

export default router;
