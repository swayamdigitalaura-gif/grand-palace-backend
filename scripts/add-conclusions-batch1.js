// Adds a topic-specific "Conclusion" section to the end of the `sections` array for a batch
// of 13 /guides/$slug pages that the client flagged as missing a conclusion near the end of
// the content (before the FAQ/CTA blocks).
//
// Each conclusion is written specifically for that guide's topic (not a reused generic
// paragraph) and is purely additive: every existing section in `sections` is preserved
// exactly as-is (including its `body` array, `bullets`/`bulletItems`/`items`, `image`,
// `blockType`, etc.) and the new Conclusion section is appended as the last array entry.
//
// IMPORTANT: the new Conclusion section always includes a `body: string[]` array. A section
// with `bulletItems`/`bullets` but no `body` field has previously crashed the guide page's
// server-side render (blank page) — this script never produces that shape.
//
// Safe to re-run: if a guide's last section is already a "Conclusion" heading, it is
// replaced in place rather than duplicated.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONCLUSIONS = {
  "mocktails-drinks-pair-indian-food": [
    "The right drink does more than quench thirst next to a curry — a cooling lassi, a citrus-forward mocktail or a lightly spiced chai can balance heat, cut richness and bring out flavours a plain glass of water never will. Whether you're drawn to something fruity and refreshing or a classic Indian favourite, pairing it thoughtfully turns a good meal into a memorable one.",
    "Next time you're at The Grand Palace, ask our team for a drink recommendation to match whatever you're ordering — book a table and taste the pairing for yourself.",
  ],
  "indian-catering-boxes-office-family-sydney": [
    "Whether you're feeding a busy office floor or a family gathering at home, a well-put-together Indian catering box takes the guesswork out of the meal — a mix of curries, rice, breads and sides that suits different tastes and dietary needs without anyone missing out. It's an easy way to bring proper Indian flavour to a workday lunch or a weekend get-together without anyone having to cook.",
    "The Grand Palace's catering boxes are built with exactly that in mind — get in touch to put one together for your next office lunch or family occasion.",
  ],
  "how-to-plan-office-lunch-catering-sydney": [
    "Good office lunch catering comes down to a few basics done properly: know your headcount and dietary needs upfront, choose a menu with enough variety that nobody's stuck with the same fallback dish, and pick a caterer close enough to the office that delivery is never the weak link. Get those right and catering stops being a weekly hassle and becomes something your team actually looks forward to.",
    "The Grand Palace handles all of it from its George Street kitchen — reach out to set up your next office lunch order.",
  ],
  "corporate-catering-sydney-cbd": [
    "A good regular lunch spot for the office comes down to three things: it's close enough that no one dreads picking it up, the menu has enough range that it doesn't get old, and there's one point of contact so booking it isn't a fresh negotiation every time. The Grand Palace's George Street location, rotating Indian menu and dedicated team cover all three, whether your group prefers a sit-down set menu or a catering box delivered to the desk.",
    "If you're ready to make it your office's standing order, call (02) 8021 7696 or email bookings@thegrandpalace.com.au to set it up.",
  ],
  "best-restaurant-birthday-dinner-sydney": [
    "A birthday dinner worth remembering usually comes down to the same few things: a room with the right atmosphere, food that suits the whole group, and service that takes the pressure off the host. The Grand Palace in Sydney CBD is built around exactly that combination, with birthday-friendly seating and a menu that works for everyone at the table.",
    "Book a table for your next birthday dinner and let us handle the details.",
  ],
  "private-event-venue-hire-sydney-cbd": [
    "Hiring a private event venue in Sydney CBD comes down to finding a space that suits the size and tone of your event, in a location your guests can actually get to easily. The Grand Palace's central George Street address, flexible seating and full-service kitchen make it a practical choice for anything from a small private dinner to a larger function.",
    "Book a table to start planning your next private event with us.",
  ],
  "indian-birthday-dinner-sydney": [
    "An Indian birthday dinner is at its best when the food, the room and the occasion all come together rather than competing for attention — that's the balance The Grand Palace aims for with every celebration it hosts. From the menu to the setting, everything is designed to make a milestone birthday feel like exactly that.",
    "Book a table to celebrate your next Indian birthday dinner with us in 2026.",
  ],
  "where-to-host-a-royal-indian-birthday-dinner-in-sydney": [
    "A \"royal\" birthday isn't really about one grand gesture — it's the basement arrival, an age-appropriate setup, the $150 package's cake and decorations already in place, and a room sized to fit the group, all working together without the host having to chase any of it. Whether it's an 18th with friends or a 50th with the whole family, The Grand Palace's birthday package flexes to the milestone rather than forcing every age into the same format.",
    "View the birthday package to see which setup fits your celebration.",
  ],
  "indian-restaurant-near-martin-place": [
    "For anyone working around Martin Place, having a proper Indian restaurant just five minutes away means lunch or an after-work dinner doesn't require a long detour — The Grand Palace's George Street location was built with exactly that commute in mind. Whether it's a quick weekday lunch or a longer dinner after a big day at the office, it's close enough to be a genuine regular option rather than an occasional trip.",
    "Book a table next time you're near Martin Place and want something better than the usual lunch spot.",
  ],
  "indian-restaurant-near-town-hall-station": [
    "If you're based near Town Hall, The Grand Palace is close enough — one stop up the line to Wynyard or a short walk up George Street — to be a realistic lunch or dinner option rather than something reserved for special occasions. That short trip is worth it for a proper sit-down Indian meal instead of settling for whatever's nearest.",
    "Book a table and make the short trip up from Town Hall next time you're after real Indian food.",
  ],
  "jain-restaurants-sydney": [
    "Finding genuinely Jain-friendly Indian food in Sydney shouldn't mean settling for a plain dish with the onion and garlic picked out — it should mean a kitchen that understands the dietary requirement and cooks accordingly. That's the standard The Grand Palace holds itself to for Jain guests, so the meal feels considered rather than adapted at the last minute.",
    "Book a table and let our team know your requirements when you arrive, and we'll take care of the rest.",
  ],
  "indian-catering-box-sydney": [
    "Whatever the occasion — an office lunch, a team meeting or a family gathering — the right Indian catering box comes down to variety, portion sizes that actually match the headcount, and food that still tastes good once it's plated up on-site. The Grand Palace's catering boxes are put together with all three in mind, so you're not choosing between convenience and quality.",
    "Book a table or get in touch to order your next catering box from us.",
  ],
  "best-indian-restaurant-near-me-sydney-cbd": [
    "When you search \"Indian restaurant near me\" in Sydney CBD, what you're really after is somewhere close, reliable, and genuinely good — not just the nearest pin on the map. The Grand Palace on George Street aims to be that answer every time, whether you're stopping in for a quick lunch or a proper sit-down dinner.",
    "Book a table and see why it keeps coming up in that search.",
  ],
};

async function main() {
  const slugs = Object.keys(CONCLUSIONS);
  for (const slug of slugs) {
    const guide = await prisma.guide.findUnique({ where: { slug } });
    if (!guide) {
      console.error(`MISSING guide for slug: ${slug}`);
      continue;
    }

    const sections = Array.isArray(guide.sections) ? [...guide.sections] : [];
    const conclusionSection = {
      heading: "Conclusion",
      body: CONCLUSIONS[slug],
    };

    const last = sections[sections.length - 1];
    if (last && last.heading === "Conclusion") {
      // Re-run safety: replace existing conclusion in place instead of duplicating.
      sections[sections.length - 1] = conclusionSection;
    } else {
      sections.push(conclusionSection);
    }

    await prisma.guide.update({
      where: { slug },
      data: { sections },
    });

    console.log(`Updated ${slug} — sections: ${sections.length} (last: "${sections[sections.length - 1].heading}")`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
