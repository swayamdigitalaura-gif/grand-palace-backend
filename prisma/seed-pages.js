import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dataDir = process.env.MENU_DATA_DIR;
  if (!dataDir) throw new Error("Set MENU_DATA_DIR env var to the folder containing pages-data.json");
  const pages = JSON.parse(fs.readFileSync(`${dataDir}/pages-data.json`, "utf8"));

  for (const page of pages) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
    console.log(`  ${page.slug}`);
  }
  console.log(`Seeded ${pages.length} pages`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
