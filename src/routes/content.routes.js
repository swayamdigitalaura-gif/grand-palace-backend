import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const EDITABLE_FIELDS = [
  "heroKicker", "heroHeadlineTop", "heroHeadlineBottom", "heroSubtext",
  "aboutHeading", "aboutBody",
  "menuSectionHeading", "menuSectionBody", "menuSectionImage",
];

function pickFields(body) {
  const data = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) data[key] = body[key] || null;
  }
  return data;
}

/* ───────── Homepage (legacy PageContent — kept working) ───────── */

router.get("/pages/lookup", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const content = await prisma.pageContent.findUnique({ where: { path } });
  res.json(content ?? null);
});

/* ───────── Generic ContentBlock (all other pages) ───────── */

// Public: all content blocks for a page, returned as a flat { key: value } map
// — this is what each page's loader fetches to override its defaults.
router.get("/blocks/lookup", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const blocks = await prisma.contentBlock.findMany({ where: { path } });
  const map = {};
  for (const b of blocks) map[b.key] = b.value;
  res.json(map);
});

// Public: site-wide theme tokens — fetched once at the root and injected as
// CSS variables. Returns null if unset (page uses styles.css defaults).
router.get("/theme", async (_req, res) => {
  const theme = await prisma.themeSetting.findUnique({ where: { id: "singleton" } });
  res.json(theme ?? null);
});

/* ───────── Admin-only ───────── */
router.use(requireAuth);

// Legacy homepage save.
router.put("/pages", async (req, res) => {
  const { path } = req.body;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const data = pickFields(req.body);
  const content = await prisma.pageContent.upsert({
    where: { path },
    create: { path, ...data },
    update: data,
  });
  res.json(content);
});

// Admin: full block list for a page (includes type, so the editor knows how
// to render each field).
router.get("/blocks", async (req, res) => {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });
  const blocks = await prisma.contentBlock.findMany({ where: { path }, orderBy: { key: "asc" } });
  res.json(blocks);
});

// Admin: bulk upsert of blocks for a page. Body: { path, blocks: [{key,value,type}] }.
router.put("/blocks", async (req, res) => {
  const { path, blocks } = req.body;
  if (!path || !Array.isArray(blocks)) return res.status(400).json({ error: "Missing path or blocks" });
  await prisma.$transaction(
    blocks.map((b) =>
      prisma.contentBlock.upsert({
        where: { path_key: { path, key: b.key } },
        create: { path, key: b.key, value: b.value ?? "", type: b.type || "text" },
        update: { value: b.value ?? "", type: b.type || "text" },
      })
    )
  );
  res.json({ ok: true, count: blocks.length });
});

// Admin: read + save theme tokens.
router.get("/theme/admin", async (_req, res) => {
  const theme = await prisma.themeSetting.findUnique({ where: { id: "singleton" } });
  res.json(theme ?? { id: "singleton" });
});

router.put("/theme", async (req, res) => {
  const { colorSaffron, colorGold, colorPalace, colorCream, fontDisplay, fontBody, baseFontScale } = req.body;
  const theme = await prisma.themeSetting.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", colorSaffron, colorGold, colorPalace, colorCream, fontDisplay, fontBody, baseFontScale },
    update: { colorSaffron, colorGold, colorPalace, colorCream, fontDisplay, fontBody, baseFontScale },
  });
  res.json(theme);
});

export default router;
