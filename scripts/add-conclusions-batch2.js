// One-off script: append a topic-specific "Conclusion" section to the end of the
// `sections` array for 13 /guides/$slug rows that were missing one.
//
// Each conclusion is bespoke to that guide's actual topic (not a reused generic
// blurb) and every section object it touches keeps a body: string[] array intact,
// per the SSR crash risk documented for this Guide model.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const conclusions = {
  "best-christmas-restaurants-sydney": {
    heading: "Conclusion",
    body: [
      "With so many restaurants competing for your Christmas booking, the ones worth choosing are the ones that treat the day as more than a regular service — festive menus, a genuine group-friendly setup, and staff who aren't rushing you through the sitting. The Grand Palace makes that list as one of the few Indian fine-dining options in the CBD built around a proper Christmas lunch and dinner experience rather than a standard menu with tinsel added.",
      "Whichever restaurant you land on from this list, book early — Christmas Day and Christmas Eve sittings across Sydney fill months in advance.",
    ],
  },
  "christmas-corporate-catering-box": {
    heading: "Conclusion",
    body: [
      "A good Christmas corporate catering box does two jobs at once: it takes the logistics off your plate and gives the team something worth looking forward to at the end of a long year. The Grand Palace's boxes are built to travel well, feed a range of tastes and dietary needs, and land on time without you having to chase a caterer during the busiest week of the year.",
      "If you're organising an office celebration, get your order in early — December calendars fill up fast, and a rushed booking is the easiest way to end up with a disappointing spread.",
    ],
  },
  "birthday-memorable-indian-cuisine": {
    heading: "Conclusion",
    body: [
      "A birthday worth remembering usually comes down to two things: food that actually impresses the table, and a setting that feels a step above the everyday. Authentic Indian cuisine delivers on the first with bold, layered flavours guests don't get every week, and The Grand Palace's ambience delivers on the second, giving the celebration a sense of occasion without needing a separate venue hire.",
      "For your next birthday, pairing the two is a simple way to turn a dinner reservation into an evening people actually talk about afterwards.",
    ],
  },
  "grand-palace-christmas-lunch-dinner": {
    heading: "Conclusion",
    body: [
      "Between the festive menu, the central CBD setting, and a team used to hosting groups over the holiday period, it's easy to see why so many Sydneysiders return to The Grand Palace for Christmas lunch and dinner year after year. It's the kind of booking that takes the pressure off hosting at home while still feeling like a proper celebration.",
      "Christmas sittings are limited and go quickly, so if you're planning to celebrate here this year, it's worth locking in your table sooner rather than later.",
    ],
  },
  "weekend-indian-lunch-sydney": {
    heading: "Conclusion",
    body: [
      "A weekend lunch should feel unhurried — good food, a relaxed pace, and no reason to watch the clock. That's the experience The Grand Palace is built around, with a menu suited to lingering over rather than rushing through, in a setting that doesn't feel like a weeknight dinner service squeezed into a Saturday afternoon.",
      "If your weekends usually default to the same few spots, a slow Indian lunch is an easy change worth making.",
    ],
  },
  "sydney-businesses-corporate-catering": {
    heading: "Conclusion",
    body: [
      "Corporate catering succeeds or fails on the details businesses can't easily see in advance — consistency, punctuality, and a menu that works for a mixed group of guests and dietary needs. It's those details, more than any single dish, that have made The Grand Palace a repeat choice for Sydney businesses rather than a one-off booking.",
      "If you're evaluating caterers for an upcoming event, it's worth asking any provider the same questions this guide raises before you commit.",
    ],
  },
  "catering-boxes-parties-office-lunches": {
    heading: "Conclusion",
    body: [
      "Whether it's a birthday party, a team lunch, or a casual office gathering, the appeal of a good catering box is the same: restaurant-quality food with none of the setup or cleanup. The Grand Palace's catering boxes are designed around that flexibility, scaling from a small team lunch to a full party spread without losing the flavour or presentation of a sit-down meal.",
      "For your next gathering, it's worth ordering ahead so the box arrives exactly when and where you need it.",
    ],
  },
  "elevate-corporate-events-grand-palace": {
    heading: "Conclusion",
    body: [
      "Corporate catering shapes how an event is remembered as much as the agenda or venue does, and it's often the first thing guests comment on afterwards. The Grand Palace's approach — professional service, a menu built for groups, and reliable execution — is what turns catering from a logistics checkbox into something that actually elevates the event.",
      "For your next corporate function in Sydney, it's worth treating the catering choice with the same care as the venue itself.",
    ],
  },
  "diwali-party-sydney-grand-palace": {
    heading: "Conclusion",
    body: [
      "Diwali deserves a setting that matches its scale — warm lighting, a menu full of festive dishes and sweets, and an atmosphere that feels celebratory rather than routine. The Grand Palace brings all three together, making it a natural choice for Sydneysiders who want to mark the festival of lights without hosting the cooking and cleanup themselves.",
      "If you're planning this year's Diwali celebration, it's worth booking early — the festival period is one of the busiest on the calendar.",
    ],
  },
  "best-birthday-venues-sydney-cbd": {
    heading: "Conclusion",
    body: [
      "A genuine birthday venue comes down to the four things this guide covers: a clear, fixed-price package rather than a vague promise, an honest group capacity, an upfront minimum spend, and a kitchen that can actually handle a mixed-dietary table. Judged against those criteria, The Grand Palace holds up well — a transparent $150 package with cake, decorations and a song, seating from 2 to 125 guests, and a central George Street location that's easy for guests to reach.",
      "It won't be the right fit for every celebration, particularly if you need a fully enclosed private room, but for a straightforward, well-organised birthday in the CBD, it's worth comparing against whatever else is on your shortlist.",
    ],
  },
  "royal-indian-birthday-dinner-sydney": {
    heading: "Conclusion",
    body: [
      "An Indian fine-dining setting brings something a standard restaurant birthday often can't — rich, layered flavours paired with an elegance that makes the evening feel like a genuine occasion rather than just another dinner out. That combination is exactly what makes The Grand Palace a fitting choice for hosting a birthday that guests will still be talking about after the candles are blown out.",
      "If you're planning a birthday dinner that should feel a little more special, it's worth booking a table built around that experience.",
    ],
  },
  "top-5-indian-dishes-sydney": {
    heading: "Conclusion",
    body: [
      "From rich, slow-cooked curries to lighter vegetarian classics, the dishes in this list showcase just how varied Indian cuisine can be — there's a reason each has earned its place among Sydney diners' favourites. Trying them side by side is the best way to understand why Indian food has such a loyal following across the city.",
      "The Grand Palace's menu features all five, prepared the traditional way, so it's a good place to start if you're working through this list.",
    ],
  },
  "choose-indian-catering-sydney-event": {
    heading: "Conclusion",
    body: [
      "Choosing the right Indian catering for a Sydney event really comes down to three things this guide has walked through: understanding what your specific event demands, accounting for your guests' dietary and cultural preferences, and picking a serving format — plated, buffet, or live stations — that suits the occasion and venue.",
      "The Grand Palace works through all three with every client, tailoring the menu, format, and service style so the catering fits the event rather than the other way around.",
      "Whatever you're planning next — a wedding, a corporate function, or a family celebration — starting with those three questions will make choosing the right caterer considerably easier.",
    ],
  },
};

async function main() {
  const slugs = Object.keys(conclusions);
  for (const slug of slugs) {
    const guide = await prisma.guide.findUnique({ where: { slug } });
    if (!guide) {
      console.log(`SKIP (not found): ${slug}`);
      continue;
    }

    const sections = Array.isArray(guide.sections) ? guide.sections : [];

    // Safety check: every existing section must already have a body array.
    // If one doesn't, stop rather than risk writing back a malformed array.
    const bad = sections.find((s) => !Array.isArray(s.body));
    if (bad) {
      console.error(`ABORT ${slug}: existing section missing body[] ->`, bad.heading);
      continue;
    }

    // Skip if a Conclusion already exists as the last section (idempotency).
    const last = sections[sections.length - 1];
    if (last && last.heading === "Conclusion") {
      console.log(`SKIP (already has Conclusion): ${slug}`);
      continue;
    }

    const newSections = [...sections, conclusions[slug]];

    await prisma.guide.update({
      where: { slug },
      data: { sections: newSections },
    });

    console.log(`UPDATED: ${slug} -> sections now ${newSections.length}`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
