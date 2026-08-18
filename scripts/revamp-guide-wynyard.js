// One-off content revamp for the Wynyard Station local guide, replacing the
// existing DB row with the client-approved copy from wynyard-content-doc.html
// (Part A). No hero image — content doc explicitly says none is needed.
// Safe to re-run — upserts by slug.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TODAY_ISO = "2026-08-18";
const TODAY_DISPLAY = "Aug 18, 2026";

const guide = {
  slug: "indian-restaurant-near-wynyard-station-sydney",
  title: "Indian Restaurant Near Wynyard Station, Sydney CBD — The Grand Palace",
  metaTitle: "Indian Restaurant Near Wynyard Station Sydney | The Grand Palace",
  metaDescription:
    "The Grand Palace is the closest authentic Indian restaurant to Wynyard Station — a 90-second walk via MetCentre. HACCP certified, halal meat, open daily. Call (02) 8021 7696 or book online.",
  tag: "Local",
  publishedDate: "2026-06-26",
  publishedDateDisplay: "Jun 26, 2026",
  updatedDate: TODAY_ISO,
  updatedDateDisplay: TODAY_DISPLAY,
  excerpt:
    "The Grand Palace is the closest authentic Indian restaurant to Wynyard Station in Sydney CBD — a 90-second walk via the MetCentre exit on George Street.",
  intro:
    "If you're near Wynyard Station and craving proper Indian food, you don't need to go far. The Grand Palace sits in the basement at 261 George Street, about a 90-second walk from the station via the MetCentre exit — close enough for a working lunch, easy enough for a relaxed dinner after work.",
  quickAnswer:
    "The Grand Palace Indian Restaurant is the closest authentic Indian restaurant to Wynyard Station in Sydney CBD — a 90-second walk via the MetCentre exit on George Street.\n\nOpen daily for lunch from 12:00pm and dinner from 5:00pm. HACCP certified kitchen, halal-certified meats, and a full vegetarian menu including Jain options. Book online or call (02) 8021 7696.",
  quickFacts: [
    { label: "Address", value: "Basement, 261 George Street, Sydney NSW 2000" },
    { label: "Phone", value: "(02) 8021 7696" },
    { label: "Email", value: "bookings@thegrandpalace.com.au" },
    { label: "Lunch", value: "Monday – Sunday: 12:00pm – 3:00pm" },
    { label: "Dinner", value: "Sun – Thu: 5:00pm – 10:00pm · Fri – Sat: 5:00pm – 10:30pm" },
    { label: "Distance", value: "90 seconds from Wynyard Station via MetCentre exit" },
    { label: "Certified", value: "HACCP Certified · Gold Catering Licence · Halal Certified Meats" },
  ],
  sections: [
    {
      heading: "How to Get Here from Wynyard Station",
      blockType: "text",
      body: [
        "### Step-by-Step Walking Directions\n1. Exit Wynyard Station via the **MetCentre exit** (George Street side)\n2. Walk through the **MetCentre shopping arcade** — approximately 30 seconds, covered\n3. Exit onto **George Street**, turn **left (south)**\n4. Walk approximately **50 metres** along George Street\n5. Look for the entrance at **261 George Street** — basement level\n6. Take the stairs or lift **down to the Basement**\n7. The Grand Palace entrance is directly ahead",
        "### Train Lines at Wynyard\nWynyard Station is served by all main Sydney train lines — **T1, T2, T3, T4, and T8**. From most inner-city stops, the journey to Wynyard is under 10 minutes.",
        "### By Bus\nMultiple bus routes stop on York Street and Clarence Street, within a 2-minute walk. Services run frequently throughout the day and evening.",
        "### By Car\nPaid parking is available at Wilson Parking on York Street and Secure Parking near Wynyard — both within a short walk. Street parking on George Street is metered.",
      ],
    },
    {
      heading: "About the Venue",
      blockType: "text",
      body: [
        "The Grand Palace occupies a full basement level beneath 261 George Street — a warm, richly decorated Indian dining room in the heart of Sydney CBD. The underground setting creates a calm, enclosed atmosphere that feels a world away from the busy streets above.",
        "The kitchen is **HACCP certified** — meeting Australia's highest food safety standards. The restaurant holds a **Gold Catering Licence** and serves **halal-certified meats** across the entire menu. The venue is also available for **private hire** for corporate events, birthday celebrations, and wedding catering.",
        "### Dietary Options Available",
      ],
      bullets: [
        "Halal certified meats — all meats on the menu",
        "Full vegetarian menu — extensive selection, clearly labelled",
        "Vegan options — available across the menu",
        "Jain-friendly dishes — no onion, no garlic, on request",
        "Gluten-conscious options — available, please ask staff",
      ],
    },
    {
      heading: "Perfect For",
      blockType: "row",
      body: [
        "The Grand Palace suits a wide range of occasions — all within 90 seconds of Wynyard Station.",
      ],
      items: [
        "💼 Business Lunch\nQuiet, professional setting for client lunches and team meals. Private dining available for groups. HACCP certified kitchen.",
        "🌙 After-Work Dinner\nOpen until 10pm weekdays, 10:30pm on Friday and Saturday. Fully licensed bar. No BYO.",
        "🎂 Birthday Celebration\nDedicated [birthday packages](/birthday-package) available. Private dining spaces can be arranged.",
        "👥 Group Dining\nVenue accommodates up to 125 guests. Advance booking recommended for groups.",
        "🏢 Corporate Events\nIn-venue corporate dining and [external office catering](/office-catering) both available. Fully licensed, HACCP certified.",
        "🕌 Halal Dining\nFully halal-certified meats. One of the few fine dining Indian restaurants in Sydney CBD with full halal certification.",
      ],
    },
    {
      heading: "Why Choose The Grand Palace Near Wynyard",
      blockType: "box",
      body: [
        "If you are looking for an Indian restaurant near Wynyard Station, The Grand Palace offers something rare in Sydney CBD — an authentic, HACCP-certified kitchen with halal-certified meats, a full vegetarian menu, and a dining room that works as well for a business lunch as it does for a birthday celebration.",
        "At just a **90-second walk from Wynyard** via the MetCentre, it is the most conveniently located Indian restaurant for workers, visitors, and locals across the CBD. Whether you are planning ahead or looking for somewhere to eat today, the team at The Grand Palace is ready to welcome you.",
        "Book your table online, call **(02) 8021 7696**, or simply walk in — open daily for lunch from 12:00pm and dinner from 5:00pm.",
      ],
    },
  ],
  faq: [
    {
      q: "How far is The Grand Palace from Wynyard Station?",
      a: "About a 90-second walk via the MetCentre exit on George Street — approximately 50 metres from the station exit to the restaurant entrance at Basement, 261 George Street.",
    },
    {
      q: "Do I need a reservation?",
      a: "Reservations are recommended, particularly on Friday and Saturday evenings and for groups of 6 or more. Walk-ins are welcome subject to availability. Book online at thegrandpalace.com.au/book-a-table or call (02) 8021 7696.",
    },
    {
      q: "Is The Grand Palace halal certified?",
      a: "Yes — The Grand Palace serves halal-certified meats across the entire menu. The restaurant also offers a full vegetarian menu and Jain-friendly dishes (no onion, no garlic) on request.",
    },
    {
      q: "What are the opening hours?",
      a: "Lunch: Monday to Sunday, 12:00pm to 3:00pm. Dinner: Sunday to Thursday 5:00pm to 10:00pm, Friday and Saturday 5:00pm to 10:30pm. The kitchen closes 30 minutes before the restaurant's closing time.",
    },
    {
      q: "Is The Grand Palace suitable for a business lunch?",
      a: "Yes — the restaurant has a calm, professional atmosphere suited to business lunches and client meals. Private dining is available for group bookings. Contact the team at bookings@thegrandpalace.com.au to arrange.",
    },
    {
      q: "Can large groups dine at The Grand Palace?",
      a: "Yes — the venue accommodates up to 125 guests. For groups, advance booking is strongly recommended. Contact the team directly to discuss arrangements.",
    },
    {
      q: "Is there parking nearby?",
      a: "Wilson Parking on York Street and Secure Parking near Wynyard are both within a short walk. Street parking on George Street is metered. The restaurant does not offer parking validation.",
    },
    {
      q: "Does The Grand Palace have vegetarian and vegan options?",
      a: "Yes — a full vegetarian menu is available. Vegan and gluten-conscious options are also offered. Jain cuisine (no onion, no garlic) is available on request. Please inform staff of dietary requirements when booking or on arrival.",
    },
    {
      q: "Can I order food for delivery from near Wynyard?",
      a: "Yes — The Grand Palace offers online ordering for delivery within the CBD. Order at thegrandpalace.com.au/whats-on/order-online. Office catering is also available for corporate teams.",
    },
    {
      q: "How do I get to The Grand Palace from Circular Quay?",
      a: "Walk south on George Street for approximately 12 minutes, or take any T-line train one stop from Circular Quay to Wynyard Station, then follow the MetCentre exit directions above — total journey under 5 minutes.",
    },
  ],
  externalLinks: null,
  relatedSlugs: [
    "indian-restaurant-near-martin-place",
    "indian-restaurant-near-town-hall-station",
    "corporate-catering-sydney-cbd",
  ],
  ctaLabel: "Book a Table",
  ctaHref: "/book-a-table",
  guideType: "normal",
};

async function main() {
  const { slug, ...data } = guide;
  process.stdout.write(`Processing ${slug} ... `);
  await prisma.guide.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
  console.log(`OK — ${data.sections.length} sections, ${data.faq.length} FAQs`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
