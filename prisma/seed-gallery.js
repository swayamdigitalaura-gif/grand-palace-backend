import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dataDir = process.env.MENU_DATA_DIR;
  if (!dataDir) throw new Error("Set MENU_DATA_DIR env var to the folder containing gallery-data.json");
  const items = JSON.parse(fs.readFileSync(`${dataDir}/gallery-data.json`, "utf8"));

  await prisma.galleryImage.deleteMany({});
  for (const item of items) {
    await prisma.galleryImage.create({ data: item });
  }
  console.log(`Seeded ${items.length} gallery images`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
