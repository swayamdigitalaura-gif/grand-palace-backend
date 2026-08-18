import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const slugs = [
  'best-asian-restaurants-sydney',
  'best-asian-fusion-restaurants-sydney',
  'best-vegetarian-restaurants-sydney',
  'best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide',
  'how-to-plan-office-lunch-catering-in-sydney',
  'tgp-is-best-for-a-weekend-indian-lunch',
  'wedding-catering-sydney-cbd',
  'jain-restaurants-in-sydney-no-onion-no-garlic',
  'indian-catering-boxes-in-sydney',
  'sydney-corporate-catering-at-tgp',
  'business-lunch-sydney-cbd',
  'best-indian-birthday-dinner-sydney-where-to-celebrate-in-style',
  'make-birthday-memorable-with-tgp',
];

async function main() {
  for (const slug of slugs) {
    const g = await prisma.guide.findUnique({ where: { slug } });
    if (!g) { console.log(`MISSING: ${slug}`); continue; }
    console.log('='.repeat(80));
    console.log('SLUG:', slug);
    console.log('TITLE:', g.title);
    console.log('TAG:', g.tag, '| guideType:', g.guideType);
    console.log('INTRO:', g.intro);
    console.log('CTA:', g.ctaLabel, '->', g.ctaHref);
    console.log('SECTIONS:');
    (g.sections || []).forEach((s, i) => {
      console.log(`  [${i}] heading: ${s.heading}`);
      console.log(`      body: ${JSON.stringify(s.body)}`);
      if (s.bullets) console.log(`      bullets: ${JSON.stringify(s.bullets)}`);
      if (s.bulletItems) console.log(`      bulletItems: ${JSON.stringify(s.bulletItems)}`);
    });
    console.log('FAQ count:', (g.faq || []).length);
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
