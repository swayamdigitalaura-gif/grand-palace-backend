// Follow-up patch for fix-blog-art-guides-exact.js: 6 of the 23 guides
// reference source photos on the OLD thegrandpalace.com.au WordPress media
// library that have since been deleted (confirmed 404 even with a browser
// user-agent — not an extraction bug, the files are genuinely gone). Those
// same real photos (same cakes / same birthday shoot / same venue) already
// exist locally in the frontend's asset folder and are used elsewhere on the
// live site, so we upload those as the real image for the affected guides
// rather than leaving them with zero photos. Safe to re-run.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();
const ASSETS = "D:/claude project/The Grand Palace 2.0/palace-art-reimagined-main/src/assets";

const PATCHES = {
  "best-indian-birthday-dinner-sydney-where-to-celebrate-in-style": [
    { file: "birthday-015.jpg", alt: "Birthday celebration at The Grand Palace Sydney" },
    { file: "cake-ferrero-rocher.jpeg", alt: "Birthday cake at The Grand Palace Indian Restaurant" },
  ],
  "indian-wedding-catering-sydney": [
    { file: "venue.jpg", alt: "Event and wedding catering venue at The Grand Palace" },
  ],
  "private-event-venue-hire-sydney": [
    { file: "venue.jpg", alt: "Private event venue at The Grand Palace" },
  ],
  "restaurant-for-birthday-dinner": [
    { file: "cake-vanilla-raspberry.jpeg", alt: "Birthday cake at The Grand Palace" },
    { file: "birthday-015.jpg", alt: "Birthday celebration at The Grand Palace Sydney" },
  ],
  "where-to-host-a-royal-indian-birthday-dinner-in-sydney": [
    { file: "birthday-015.jpg", alt: "Birthday celebration at The Grand Palace Sydney" },
  ],
  "why-tgp-best-for-christmas-lunch-and-dinner": [
    { file: "hero-events-spread.jpg", alt: "Festive food spread at The Grand Palace" },
  ],
};

async function uploadLocal(file) {
  const buffer = await readFile(`${ASSETS}/${file}`);
  const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  const blob = await put(file, buffer, { access: "public", addRandomSuffix: true, contentType });
  return blob.url;
}

async function main() {
  for (const [slug, images] of Object.entries(PATCHES)) {
    const guide = await prisma.guide.findUnique({ where: { slug } });
    if (!guide) { console.log(`SKIP ${slug} — not found`); continue; }
    const sections = guide.sections;
    let idx = 0;
    for (const img of images) {
      if (idx >= sections.length) break;
      const url = await uploadLocal(img.file);
      sections[idx].image = url;
      sections[idx].imageAlt = img.alt;
      console.log(`  ${slug} [section ${idx}] -> ${url}`);
      idx++;
    }
    await prisma.guide.update({ where: { slug }, data: { sections } });
    console.log(`OK ${slug} — ${images.length} image(s) patched`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
