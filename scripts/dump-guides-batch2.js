import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const slugs = [
  'best-christmas-restaurants-sydney',
  'christmas-corporate-catering-box',
  'birthday-memorable-indian-cuisine',
  'grand-palace-christmas-lunch-dinner',
  'weekend-indian-lunch-sydney',
  'sydney-businesses-corporate-catering',
  'catering-boxes-parties-office-lunches',
  'elevate-corporate-events-grand-palace',
  'diwali-party-sydney-grand-palace',
  'best-birthday-venues-sydney-cbd',
  'royal-indian-birthday-dinner-sydney',
  'top-5-indian-dishes-sydney',
  'choose-indian-catering-sydney-event',
];

async function main() {
  for (const slug of slugs) {
    const g = await prisma.guide.findUnique({ where: { slug } });
    if (!g) { console.log(`MISSING: ${slug}`); continue; }
    console.log('='.repeat(80));
    console.log('SLUG:', slug);
    console.log('TITLE:', g.title);
    console.log('TAG:', g.tag);
    console.log('INTRO:', g.intro);
    console.log('CTA:', g.ctaLabel, '->', g.ctaHref);
    console.log('SECTIONS:');
    (g.sections || []).forEach((s, i) => {
      console.log(`  [${i}] heading: ${s.heading}`);
      console.log(`      body: ${JSON.stringify(s.body)}`);
      if (s.bullets) console.log(`      bullets: ${JSON.stringify(s.bullets)}`);
      if (s.bulletItems) console.log(`      bulletItems: ${JSON.stringify(s.bulletItems)}`);
    });
  }
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
