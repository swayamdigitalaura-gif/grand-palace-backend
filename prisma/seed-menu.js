import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedMenuType(menuType, dataFile) {
  const categories = JSON.parse(fs.readFileSync(dataFile, "utf8"));

  for (const cat of categories) {
    const category = await prisma.menuCategory.upsert({
      where: { menuType_slug: { menuType, slug: cat.slug } },
      update: {
        label: cat.label,
        tag: cat.tag || null,
        imageUrl: cat.imageUrl || null,
        sortOrder: cat.sortOrder,
      },
      create: {
        menuType,
        slug: cat.slug,
        label: cat.label,
        tag: cat.tag || null,
        imageUrl: cat.imageUrl || null,
        sortOrder: cat.sortOrder,
      },
    });

    // wipe existing items for this category and re-insert (idempotent re-runs)
    await prisma.menuItem.deleteMany({ where: { categoryId: category.id } });

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description || null,
          price: item.price || null,
          badge: item.badge || null,
          imageUrl: item.imageUrl || null,
          sortOrder: item.sortOrder,
          extra: item.extra || undefined,
        },
      });
    }
    console.log(`  ${menuType}/${cat.slug}: ${cat.items.length} items`);
  }
}

async function main() {
  const target = process.argv[2]; // optional: "a-la-carte" | "set-menu" | "beverages"
  const jobs = {
    "a-la-carte": "alacarte-data.json",
    "set-menu": "setmenu-data.json",
    "beverages": "beverages-data.json",
  };

  const dataDir = process.env.MENU_DATA_DIR;
  if (!dataDir) throw new Error("Set MENU_DATA_DIR env var to the folder containing the *-data.json files");

  for (const [menuType, file] of Object.entries(jobs)) {
    if (target && target !== menuType) continue;
    const full = `${dataDir}/${file}`;
    if (!fs.existsSync(full)) {
      console.log(`Skipping ${menuType} — ${file} not found`);
      continue;
    }
    console.log(`Seeding ${menuType} from ${file}...`);
    await seedMenuType(menuType, full);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
