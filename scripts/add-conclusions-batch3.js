import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Each conclusion is a plain section: { heading: "Conclusion", body: string[] }
// Appended as the LAST entry in `sections`, before FAQ/CTA render.
const conclusions = {
  'best-asian-restaurants-sydney': [
    "Sydney's Asian dining scene spans everything from Cantonese yum cha to Vietnamese pho and Thai street food, and part of the fun is that no two nights out need to look the same.",
    "If it's the spice routes of India you're after, The Grand Palace in the CBD keeps that end of the list covered with tandoor classics and curries made fresh daily.",
    "Wherever you start on this list, booking ahead is worth it — the better spots fill up fast on weekends.",
  ],
  'best-asian-fusion-restaurants-sydney': [
    "Asian fusion works best when a kitchen actually understands the traditions it's blending, rather than just borrowing an ingredient or two for the menu.",
    "That's the standard this list was built against, and it's also where a straightforwardly authentic option like The Grand Palace fits in — a reminder that sometimes the most interesting choice on a fusion night out is the kitchen that isn't fusing anything at all.",
    "Either way, Sydney's range here means there's a table for whatever mood you're in tonight.",
  ],
  'best-vegetarian-restaurants-sydney': [
    "The strongest vegetarian dining in Sydney rarely sets plant-based food apart as an afterthought — it builds full menus around it, the way Indian kitchens like The Grand Palace have always done with dishes such as Paneer Tikka and Dal Makhani.",
    "That's the thread running through this list: real variety, not a single token salad.",
    "Whichever restaurant you choose from it, you're covered for a proper vegetarian meal, not a compromise one.",
  ],
  'best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide': [
    "The short version: if \"best Indian restaurant near me\" in Sydney CBD keeps returning The Grand Palace, it's because the basics actually hold up — a genuinely central George Street location, authentic recipes rather than a simplified menu, and real coverage for vegetarian, vegan and Jain diners.",
    "It's a kitchen built to handle a quick weekday lunch and a full birthday dinner equally well, which is rarer than it sounds.",
    "The best way to judge the rest is to book a table and see for yourself.",
  ],
  'how-to-plan-office-lunch-catering-in-sydney': [
    "Planning office lunch catering comes down to a few decisions made early — box count with a small buffer, an honest veg/non-veg split, and dietary requirements flagged up front rather than sorted out at pickup.",
    "Get those right and Indian catering boxes solve the rest on their own: individually portioned, no shared trays, and food that still tastes good an hour after it's served.",
    "Once you've got your numbers, the next step is simply getting them to us with your date and headcount.",
  ],
  'tgp-is-best-for-a-weekend-indian-lunch': [
    "A weekend lunch is one of the few meals worth building a whole afternoon around, and that's exactly what The Grand Palace's Saturday and Sunday service is set up for — full menu, unhurried pace, and a dining room that suits everyone from a family group to a couple catching up.",
    "If your week has been running on quick weekday meals, this is the one to slow down for.",
    "Weekend tables fill fast, so it's worth locking one in ahead of time rather than leaving it to the day.",
  ],
  'wedding-catering-sydney-cbd': [
    "A wedding venue has to clear a higher bar than most events — real capacity, genuine food-safety credentials, and a kitchen that can serve every guest's diet without singling anyone out — and that's exactly the combination The Grand Palace is built around, whether you host in our George Street dining room or bring our team to your own venue.",
    "HACCP certification and Gold Licensed accreditation aren't details most couples think to check, but they're the ones that matter most on the day itself.",
    "The next step is simply sharing your date and guest count so we can start shaping the details around it.",
  ],
  'jain-restaurants-in-sydney-no-onion-no-garlic': [
    "Genuinely Jain-friendly Indian food isn't about leaving an ingredient off the plate — it's a separate prep process from the ground up, which is precisely why it's so hard to find done properly in Sydney.",
    "The Grand Palace's kitchen is set up for that separation, from Dal Tadka to Paneer Tikka, as long as we know in advance.",
    "If you're planning a Jain meal, the one thing worth doing ahead of time is calling to flag it, so the kitchen can prepare accordingly rather than improvise on the night.",
  ],
  'indian-catering-boxes-in-sydney': [
    "Once you know what's actually inside — five freshly rolled options per box, made to order rather than pulled from a fridge — choosing between the $75 Veg and $85 Non-Veg Platter Box mostly comes down to your group's mix rather than guesswork.",
    "Order both if you're catering a mixed crowd, and lean on us for the split if you're not sure.",
    "From there it's just a matter of getting your order in ahead of your pickup window so everything's made fresh on the day.",
  ],
  'sydney-corporate-catering-at-tgp': [
    "For a Sydney office lunch, the deciding factors are rarely about the food alone — it's whether every diet on the floor is genuinely covered and whether the format actually works at a desk, and Indian catering boxes tick both without extra planning on your end.",
    "Mix vegetarian and non-vegetarian freely within one order, give us 48 hours' notice, and the rest is handled.",
    "If your event calls for table service instead, our dine-in set menus are just as easy to arrange — either way, the next step is getting in touch with your headcount and date.",
  ],
  'business-lunch-sydney-cbd': [
    "A business lunch venue needs to do two things at once — impress without trying too hard, and handle every guest's dietary needs without anyone having to ask twice — and that combination of a genuinely elegant room with full vegetarian, vegan, halal and Jain coverage is what makes The Grand Palace work for client meetings and department lunches alike.",
    "Flexible group sizes, from a two-person meeting to a room of 125, mean the format scales with whatever the occasion calls for.",
    "For anything over ten guests, booking 48 hours ahead keeps the arrangement and menu locked in.",
  ],
  'best-indian-birthday-dinner-sydney-where-to-celebrate-in-style': [
    "At $150 flat, the Celebrate Birthday package earns its price by covering everything that usually takes separate planning — cake, balloons, banner and a team managing the timing — while your set menu is chosen and paid for separately at the table.",
    "It's worth locking in a date you're confident about, since changes are at the restaurant's discretion and the package itself is non-refundable.",
    "Booking two to four weeks ahead — or four to six for a Friday or Saturday night — gives you the best shot at the date you want.",
  ],
  'make-birthday-memorable-with-tgp': [
    "After more than 500 birthdays hosted since 2021, the pattern is consistent — it's rarely the venue's size that people remember, it's walking into a table that's already decorated and a cake moment that lands at the right time, with nothing left for the host to manage.",
    "That's the philosophy behind every Celebrate Birthday package at The Grand Palace, scaled from a table of ten to a room of over a hundred without losing the personal feel.",
    "If your next milestone is coming up, the earlier you get in touch, the more of that detail we can plan around it.",
  ],
};

async function main() {
  for (const [slug, body] of Object.entries(conclusions)) {
    const guide = await prisma.guide.findUnique({ where: { slug } });
    if (!guide) {
      console.log(`MISSING (skipped): ${slug}`);
      continue;
    }
    const sections = Array.isArray(guide.sections) ? guide.sections : [];

    // Skip if a Conclusion section already exists as the last entry (idempotency)
    const last = sections[sections.length - 1];
    if (last && String(last.heading).trim().toLowerCase() === 'conclusion') {
      console.log(`Already has Conclusion (skipped): ${slug}`);
      continue;
    }

    const newSections = [...sections, { heading: 'Conclusion', body }];

    await prisma.guide.update({
      where: { slug },
      data: { sections: newSections },
    });
    console.log(`Updated: ${slug} (sections: ${sections.length} -> ${newSections.length})`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
