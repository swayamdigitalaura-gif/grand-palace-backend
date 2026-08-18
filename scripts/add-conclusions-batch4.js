// One-off content addition: append a Conclusion section to 13 existing Guide
// rows that were missing one. Purely additive — reads each guide's current
// `sections` array, appends { heading: "Conclusion", body: [...] } as the
// LAST entry, and writes the array back unchanged otherwise.
//
// Every existing section is preserved exactly as read from the DB (including
// sections with an empty body: [] array, e.g. row/box layout sections) — no
// section is stripped of its `body` field, per the known SSR-crash bug where
// a section missing `body` entirely blanks the live page.
//
// Safe to re-run: if a guide's last section is already literally named
// "Conclusion" it is skipped rather than duplicated.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Conclusion text is deliberately distinct per guide and ties back to that
// guide's specific topic/CTA rather than a reused generic closer.
const CONCLUSIONS = {
  "corporate-catering-in-sydney-at-tgp": [
    "Whether it's a single reserved section for a confidential board dinner or the full venue for a 300-guest launch, the right corporate dining setting says something about the business hosting it — and that's the gap The Grand Palace is built to fill in Sydney CBD.",
    "From the room itself through to a menu designed to be talked about afterwards, every element is set up to make client entertaining feel deliberate rather than default. Get in touch with your date and guest numbers to start planning your next corporate booking.",
  ],
  "indian-restaurant-near-wynyard-station-sydney": [
    "For anyone working around Wynyard, the appeal is straightforward: a genuine sit-down Indian dining room barely a minute's walk from the station concourse, with the seating capacity and licensing to handle everything from a quick lunch to a larger after-work group.",
    "Between the short walk, nearby parking options and flexible dining spaces, The Grand Palace makes it easy to swap a food-court lunch for a proper meal without eating into your break. Check the opening hours above and book your table before you head down.",
  ],
  "indian-wedding-catering-sydney": [
    "A wedding menu has to do two jobs at once — deliver the generous, celebratory food Indian weddings are known for, while genuinely covering every dietary need on a mixed guest list — and that's exactly what The Grand Palace's wedding catering is built around.",
    "From the main reception down to the smaller pre-wedding dinners, every course is planned so no guest ends up with an afterthought plate. Reach out with your guest numbers and dietary requirements to start building your wedding menu.",
  ],
  "restaurant-for-birthday-dinner": [
    "Five decisions — group size, date, cake, menu, and payment — are really all that stand between you and a booked birthday dinner, and working through them in this order keeps the process simple rather than overwhelming.",
    "With the $150 Celebrate Birthday package handling the cake and décor and set menus simplifying the food for the table, most of the planning is already done for you. Start your online booking whenever you're ready to lock in the date.",
  ],
  "why-tgp-best-for-christmas-lunch-and-dinner": [
    "Staying open through lunch and dinner on Christmas Day, with table service and the full menu running as normal, is what sets The Grand Palace apart from venues that scale back or close entirely for the holiday.",
    "For anyone after a genuine change from the usual roast — or simply somewhere reliable to gather on the day — booking 3–4 weeks ahead is the one step that matters most given how quickly Christmas Day tables fill. Lock in your lunch or dinner slot now.",
  ],
  "christmas-corporate-catering-box-by-tgp": [
    "Office Christmas catering only works if it actually suits the whole team, and the Veg and Non-Veg box format — fully halal-certified, mix-and-match, ready to open straight on the boardroom table — was designed to solve that without anyone getting the sad side salad.",
    "No serving staff, no cleanup, just fresh rolls collected same-day from George Street. Place your order ahead of your office party to make sure your preferred pickup slot is still available.",
  ],
  "indian-catering-box-sydney-cbd": [
    "For a CBD office order, the logistics matter more than the menu itself — and between the George Street pickup point two minutes from Wynyard, clear same-day and next-day cutoffs, and delivery arranged directly with the team, The Grand Palace's catering box process is built to be predictable.",
    "Whether you're grabbing a handful of boxes on the walk back to the office or arranging delivery for a bigger team, ordering ahead of the stated cutoff is the one thing to get right. Get your Veg and Non-Veg box quantities sorted and place your order online.",
  ],
  "mocktails-drinks-in-indian-food": [
    "The right drink doesn't just accompany an Indian meal — it changes how the chilli, richness and spice actually land on the palate, which is why pairing is worth the same attention as the food itself.",
    "From the signature mocktail list through to traditional soda and lassi options, The Grand Palace's fully halal drinks menu is built to match that range without a drop of alcohol. Browse the full menu and pick your pairing before you book your table.",
  ],
  "catering-boxes-in-sydney-for-parties": [
    "Getting the quantity right comes down to two questions: are the boxes the main meal or one part of a wider spread, and roughly what's the vegetarian-to-non-vegetarian split among your guests — everything else in planning a catering box order follows from those answers.",
    "With halal-certified meat across the Non-Veg box and five fresh rolls in every box regardless of size, the format scales comfortably from a small birthday to a much larger party. Work out your guest count and place your order for the date you need.",
  ],
  "why-tgp-is-best-for-diwali-party": [
    "Diwali is as much about the room and the company as it is about the food, and The Grand Palace's combination of private dining capacity, a proper festive menu and Gold Licence is what keeps Sydney's Indian community, families and corporate teams coming back year after year.",
    "Whether you're gathering the extended family at a table or celebrating at the office with catering boxes, booking early matters most during what's consistently one of the venue's busiest periods. Call or email the team to lock in your Diwali booking.",
  ],
  "indian-food-delivery-sydney-cbd": [
    "The Grand Palace's ordering process trades instant app-based delivery for something more reliable — food cooked fresh for pickup at George Street, with CBD delivery arranged directly for anyone who needs it brought to them.",
    "Between the dishes that travel well, the option to add catering boxes for team orders, and a straightforward online ordering flow, getting a proper Indian meal to your desk or door is simpler than it might first seem. Place your order online whenever you're ready to eat.",
  ],
  "find-right-indian-catering-for-event": [
    "Choosing the right Indian caterer really comes down to six checks — understanding your event, knowing your guest list's dietary needs, picking a serving format, verifying experience and credentials, confirming tastings and customisation, and reviewing operational logistics — and working through them in order takes most of the guesswork out of the decision.",
    "The Grand Palace has catered hundreds of events across exactly this range from its Gold Licensed George Street venue, from intimate dinners to large-scale functions. Get in touch with your event details and let the team talk you through menu options and tastings.",
  ],
  "private-event-venue-hire-sydney": [
    "A private event venue should feel like part of the occasion, not a beige room borrowed for the night — and that's the difference The Grand Palace's palace-inspired dining room and genuinely memorable menu are designed to make.",
    "From intimate celebrations through to large-scale functions, the venue is set up to host the full range without losing that atmosphere. Enquire about your event to check availability and start planning your booking.",
  ],
};

async function main() {
  const slugs = Object.keys(CONCLUSIONS);
  const results = [];

  for (const slug of slugs) {
    const guide = await prisma.guide.findUnique({ where: { slug } });
    if (!guide) {
      console.log(`SKIP (not found): ${slug}`);
      continue;
    }

    const sections = Array.isArray(guide.sections) ? guide.sections : [];

    const last = sections[sections.length - 1];
    if (last && last.heading === "Conclusion") {
      console.log(`SKIP (already has Conclusion): ${slug}`);
      continue;
    }

    // Preserve every existing section exactly as-is; only append the new one.
    const updatedSections = [
      ...sections,
      {
        heading: "Conclusion",
        body: CONCLUSIONS[slug],
      },
    ];

    await prisma.guide.update({
      where: { slug },
      data: { sections: updatedSections },
    });

    results.push(slug);
    console.log(`OK: ${slug} — appended Conclusion (${updatedSections.length} sections total)`);
  }

  console.log(`\nDone. Updated ${results.length}/${slugs.length} guides.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
