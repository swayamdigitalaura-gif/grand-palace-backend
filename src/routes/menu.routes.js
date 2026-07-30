import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list every menu type that exists (built-in + any admin-created ones),
// with a friendly label for each — used to render the tabs in the admin Menu
// section and can be used to build public nav too.
router.get("/", async (req, res) => {
  const categories = await prisma.menuCategory.findMany({
    select: { menuType: true, menuLabel: true },
    orderBy: { menuType: "asc" },
  });
  const byType = new Map();
  for (const c of categories) {
    if (!byType.has(c.menuType) || c.menuLabel) byType.set(c.menuType, c.menuLabel || byType.get(c.menuType) || c.menuType);
  }
  res.json([...byType.entries()].map(([menuType, label]) => ({ menuType, label })));
});

// Public: get full menu (active categories + active items only) for a given menu type
// e.g. GET /api/menu/a-la-carte
router.get("/:menuType", async (req, res) => {
  const categories = await prisma.menuCategory.findMany({
    where: { menuType: req.params.menuType, active: true },
    orderBy: { sortOrder: "asc" },
    include: { items: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
  });
  res.json(categories);
});

// ── Admin-only from here ──────────────────────────────────────────
router.use(requireAuth);

// Admin: same as the public route but includes inactive categories/items too,
// so the admin panel can show and toggle them.
router.get("/admin/:menuType", async (req, res) => {
  const categories = await prisma.menuCategory.findMany({
    where: { menuType: req.params.menuType },
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  res.json(categories);
});

router.post("/:menuType/categories", async (req, res) => {
  const { slug, label, tag, imageUrl, active, sortOrder, menuLabel } = req.body;
  const category = await prisma.menuCategory.create({
    data: { menuType: req.params.menuType, menuLabel, slug, label, tag, imageUrl, active: active ?? true, sortOrder: sortOrder ?? 0 },
  });
  res.status(201).json(category);
});

router.patch("/categories/:id", async (req, res) => {
  const category = await prisma.menuCategory.update({ where: { id: req.params.id }, data: req.body });
  res.json(category);
});

router.delete("/categories/:id", async (req, res) => {
  await prisma.menuCategory.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

router.post("/categories/:categoryId/items", async (req, res) => {
  const { name, description, price, badge, imageUrl, active, sortOrder, extra } = req.body;
  const item = await prisma.menuItem.create({
    data: { categoryId: req.params.categoryId, name, description, price, badge, imageUrl, active: active ?? true, sortOrder: sortOrder ?? 0, extra },
  });
  res.status(201).json(item);
});

router.patch("/items/:id", async (req, res) => {
  const item = await prisma.menuItem.update({ where: { id: req.params.id }, data: req.body });
  res.json(item);
});

router.delete("/items/:id", async (req, res) => {
  await prisma.menuItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
