import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const slugs = [
"best-indian-birthday-dinner-sydney-where-to-celebrate-in-style",
"best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide",
"catering-boxes-in-sydney-for-parties",
"christmas-corporate-catering-box-by-tgp",
"corporate-catering-in-sydney-at-tgp",
"corporate-catering-sydney-cbd",
"find-right-indian-catering-for-event",
"how-to-plan-office-lunch-catering-in-sydney",
"indian-catering-box-sydney-cbd",
"indian-catering-boxes-in-sydney",
"indian-food-delivery-sydney-cbd",
"indian-restaurant-near-wynyard-station-sydney",
"indian-wedding-catering-sydney",
"jain-restaurants-in-sydney-no-onion-no-garlic",
"make-birthday-memorable-with-tgp",
"mocktails-drinks-in-indian-food",
"private-event-venue-hire-sydney",
"restaurant-for-birthday-dinner",
"sydney-corporate-catering-at-tgp",
"tgp-is-best-for-a-weekend-indian-lunch",
"where-to-host-a-royal-indian-birthday-dinner-in-sydney",
"why-tgp-best-for-christmas-lunch-and-dinner",
"why-tgp-is-best-for-diwali-party"
];
const rows = await prisma.guide.findMany({ where: { slug: { in: slugs } }, select: { slug: true, title: true, published: true, createdAt: true, updatedAt: true } });
console.log("Found", rows.length, "of", slugs.length);
console.log(JSON.stringify(rows, null, 2));
const missing = slugs.filter(s => !rows.find(r => r.slug === s));
console.log("MISSING:", JSON.stringify(missing, null, 2));
await prisma.$disconnect();
