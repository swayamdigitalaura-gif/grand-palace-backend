// Birthday cluster revamp (5 guides): where-to-host-a-royal-indian-birthday-dinner-in-sydney,
// best-indian-birthday-dinner-sydney-where-to-celebrate-in-style, restaurant-for-birthday-dinner,
// best-birthday-venues-sydney-cbd, make-birthday-memorable-with-tgp.
//
// The client flagged this cluster as at risk of keyword cannibalization — all 5 titles/slugs
// circle "birthday dinner in Sydney" — so each guide here is deliberately written around a
// distinct search intent instead of being a reworded copy of the others:
//   1. where-to-host-a-royal-indian-birthday-dinner-in-sydney  -> milestone/"royal" elevated
//      birthdays (18th-50th), decor, private/semi-private group bookings
//   2. best-indian-birthday-dinner-sydney-where-to-celebrate-in-style -> the $150 Celebrate
//      Birthday PACKAGE itself: exact inclusions, cake choices, pricing
//   3. restaurant-for-birthday-dinner -> PRACTICAL step-by-step booking/planning guide
//   4. best-birthday-venues-sydney-cbd -> choosing a birthday VENUE generally in Sydney CBD
//      (comparison-style: what to check, why TGP fits) -- was an unpublished draft stub,
//      now fully written and published
//   5. make-birthday-memorable-with-tgp -> what makes a birthday dinner MEMORABLE/personal
//      (ambience, small touches, food, real guest reviews)
//
// All facts (package price, cake sizes, set menu prices, group cap, address, milestones,
// reviews) are pulled from the live /birthday-package route
// (palace-art-reimagined-main/src/routes/birthday-package.tsx), not the old scraped source.
// Real content photos are migrated from the old blog-art deployment
// (vercel-deploy-jade-five.vercel.app/blog-art/guides/<slug>) and re-uploaded to Vercel Blob.
// Safe to re-run -- upserts by slug, re-uploads images each run (blob URLs get random
// suffixes; old blobs are simply orphaned).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

const TODAY_ISO = "2026-08-11";
const TODAY_DISPLAY = "Aug 11, 2026";

const contact = {
  phone: "(02) 8021 7696",
  phoneTel: "+61280217696",
  email: "bookings@thegrandpalace.com.au",
  address: "Basement, 261 George Street, Sydney NSW 2000",
};

// Real content images. The old blog-art source (vercel-deploy-jade-five.vercel.app) mirrored
// these from www.thegrandpalace.com.au/wp-content/uploads/... but most of those wp-content
// paths now 404 (site since reorganised) except the two 2025/10 ones. For the 404'd ones we
// pull the same real birthday photos from the frontend's own local asset set instead
// (palace-art-reimagined-main/src/assets), which are genuine restaurant/cake photos already
// used on the live /birthday-package page — not stock or invented images.
const ASSETS_DIR = "D:/claude project/The Grand Palace 2.0/palace-art-reimagined-main/src/assets";
const SOURCE_IMAGES = {
  royal: { kind: "local", path: `${ASSETS_DIR}/gallery/BdayCelebration_015.JPG`, filename: "BdayCelebration_015.JPG", contentType: "image/jpeg" },
  ferreroA: { kind: "local", path: `${ASSETS_DIR}/cake-ferrero-rocher.jpeg`, filename: "cake-ferrero-rocher.jpeg", contentType: "image/jpeg" },
  vanillaA: { kind: "local", path: `${ASSETS_DIR}/cake-vanilla-raspberry.jpeg`, filename: "cake-vanilla-raspberry.jpeg", contentType: "image/jpeg" },
  ferreroB: { kind: "local", path: `${ASSETS_DIR}/gallery/BdayCelebration_012.JPG`, filename: "BdayCelebration_012.JPG", contentType: "image/jpeg" },
  vanillaB: { kind: "local", path: `${ASSETS_DIR}/gallery/BdayCelebration_009.jpg`, filename: "BdayCelebration_009.jpg", contentType: "image/jpeg" },
  celebrationA: { kind: "remote", src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/10/BdayCelebration_006-1024x768.jpg" },
  celebrationB: { kind: "remote", src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/10/BdayCelebration_016-768x1024.jpeg" },
};

async function uploadRemoteImage(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Image fetch failed: ${src} (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = decodeURIComponent(src.split("/").pop().split("?")[0]);
  const contentType = res.headers.get("content-type") || undefined;
  const blob = await put(filename, buffer, { access: "public", addRandomSuffix: true, contentType });
  return blob.url;
}

async function uploadLocalImage({ path, filename, contentType }) {
  const buffer = await readFile(path);
  const blob = await put(filename, buffer, { access: "public", addRandomSuffix: true, contentType });
  return blob.url;
}

async function buildGuides() {
  const img = {};
  for (const [key, def] of Object.entries(SOURCE_IMAGES)) {
    img[key] = def.kind === "remote" ? await uploadRemoteImage(def.src) : await uploadLocalImage(def);
    console.log(`  uploaded ${key} -> ${img[key]}`);
  }

  return [
    // 1 — ROYAL / MILESTONE ELEVATED BIRTHDAYS ---------------------------------
    {
      slug: "where-to-host-a-royal-indian-birthday-dinner-in-sydney",
      title: "Where to Host a Royal Indian Birthday Dinner in Sydney",
      metaTitle: "Royal Indian Birthday Dinner Venue in Sydney CBD",
      metaDescription: "Planning a milestone birthday that should feel like a royal occasion? See how The Grand Palace hosts 18th–50th birthdays with decor, cake, and groups up to 125.",
      tag: "Events",
      publishedDate: "2025-09-01",
      publishedDateDisplay: "Sep 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "For a milestone birthday that should feel like a genuine occasion, here's how The Grand Palace turns a basement dining room into a royal setting for 18th to 50th celebrations.",
      intro: "Not every birthday needs a grand setting — but the milestone ones usually do. An 18th, a 21st, a 30th, a 50th: these are the birthdays people plan around, invite the whole family to, and remember years later. This guide is about what actually makes a birthday dinner feel elevated rather than just booked, and how The Grand Palace in Sydney CBD approaches milestone celebrations differently depending on the occasion.",
      quickAnswer: "For a milestone birthday dinner that feels like a genuine occasion, look for a venue with a distinctive setting (not just a spare function room), a package that handles decor and cake without you coordinating vendors, and the flexibility to seat both a small family table and a 100+ guest celebration. The Grand Palace's basement dining room at 261 George Street does all three, hosting groups from 2 to 125 guests with décor, cake, and a dedicated set menu built in.",
      quickFacts: [
        { label: "Group size", value: "2 to 125 guests, lunch or dinner" },
        { label: "Milestones hosted", value: "18th, 21st, 30th, 40th, 50th and beyond" },
        { label: "Since 2021", value: "500+ birthdays hosted at TGP" },
      ],
      heroImage: img.royal,
      heroImageAlt: "Guests celebrating a birthday dinner at The Grand Palace, Sydney CBD",
      sections: [
        {
          heading: "A Basement Dining Room Built for a Grand Entrance",
          body: [
            "The Grand Palace sits below street level at 261 George Street, and that basement setting is deliberate. Guests descend into a warmly lit, richly detailed dining room that feels removed from the everyday George Street bustle above — the kind of arrival that sets a milestone birthday apart from a Tuesday-night dinner out.",
            "That sense of occasion matters more for a milestone birthday than a regular meal. A 21st or a 50th is a date people build the evening around, and the room needs to carry that weight before a single dish has arrived.",
          ],
        },
        {
          heading: "Milestone Birthdays, Handled Differently at Every Age",
          body: ["Every milestone birthday has a different mood, and TGP's birthday package is flexible enough to suit each one:"],
          blockType: "box",
          bulletItems: [
            { title: "18th Birthday", description: "A vibrant, high-energy night for groups of 10–30, with the full birthday package and a menu that suits a younger crowd." },
            { title: "21st Birthday", description: "Semi-private seating sections keep the celebration together while the rest of the room carries on around it — popular for the 'big 21.'" },
            { title: "30th Birthday", description: "The Birthday Shine set menu ($55pp) is the most-booked choice at this age — a step up in dishes for a milestone that deserves it." },
            { title: "40th Birthday", description: "Table, cake, and decorations are all ready before your group arrives — no last-minute coordinating for the host." },
            { title: "50th Birthday", description: "Large family celebrations up to 125 guests, an easy 3-minute walk from Wynyard Station for guests travelling from across Sydney." },
          ],
        },
        {
          heading: "What 'Royal' Actually Looks Like on the Night",
          body: [
            "Beyond the setting, the $150 Celebrate Birthday package is what turns a booking into an occasion: an 8-inch cake (Ferrero Rocher or Vanilla Raspberry, serving up to 14 guests), 25 balloons arranged at the table before you arrive, a birthday banner with curtains and table props, and a birthday song from the team. None of it needs to be organised separately — it's simply there when your group sits down.",
          ],
        },
        {
          heading: "Private and Semi-Private Group Bookings",
          body: [
            "For larger milestone celebrations, The Grand Palace can seat groups of up to 125 across lunch or dinner service, with semi-private table configurations available so a bigger party still feels like its own event rather than scattered tables in a busy room. Set menus (Sparkle at $40pp, Shine at $55pp) simplify ordering for a big group and keep the bill predictable.",
          ],
        },
        {
          heading: "Find Us",
          body: [`${contact.address}, roughly 3 minutes' walk from Wynyard Station. Lunch daily 12–3pm; dinner Sun–Thu 5–10pm, Fri–Sat 5–10:30pm.`],
          blockType: "row",
          bullets: ["Basement, 261 George Street", "3 min walk from Wynyard Station", "Lunch 12–3pm · Dinner from 5pm"],
        },
      ],
      faq: [
        { q: "Does The Grand Palace host milestone birthdays like 18ths, 21sts and 50ths?", a: "Yes — the venue regularly hosts every milestone from 18th to 50th and beyond, with the same $150 birthday package (cake, balloons, banner, song) adaptable to groups from 2 to 125 guests." },
        { q: "Can you seat a large birthday group privately?", a: "Semi-private table configurations are available for larger groups so your celebration stays together, though The Grand Palace doesn't offer a fully enclosed private room." },
        { q: "How many guests can a milestone birthday dinner accommodate?", a: "Up to 125 guests across lunch or dinner service. Larger groups should book with as much notice as possible, ideally 4–6 weeks ahead for weekend dates." },
        { q: "What's included for a 'royal' birthday celebration?", a: "The $150 Celebrate Birthday package: an 8-inch cake serving up to 14, 25 balloons, a birthday banner with curtains and table props, and a birthday song, paired with a Sparkle ($40pp) or Shine ($55pp) set menu." },
      ],
      relatedSlugs: ["best-indian-birthday-dinner-sydney-where-to-celebrate-in-style", "make-birthday-memorable-with-tgp", "private-event-venue-hire-sydney"],
      ctaLabel: "View Birthday Package",
      ctaHref: "/birthday-package",
      guideType: "normal",
      published: true,
    },

    // 2 — THE PACKAGE / DEAL ITSELF ---------------------------------------------
    {
      slug: "best-indian-birthday-dinner-sydney-where-to-celebrate-in-style",
      title: "Best Indian Birthday Dinner in Sydney: Inside the $150 Celebrate Birthday Package",
      metaTitle: "Best Indian Birthday Dinner Sydney – $150 Package",
      metaDescription: "See exactly what's included in The Grand Palace's $150 Celebrate Birthday package in Sydney CBD — cake, decorations, set menus from $40pp, and how to book.",
      tag: "Events",
      publishedDate: "2025-08-01",
      publishedDateDisplay: "Aug 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "A line-by-line look at what's actually in The Grand Palace's $150 Celebrate Birthday package — cake, decor, set menus, and what it doesn't cover — so there are no surprises on the night.",
      intro: "\"Birthday package\" can mean very different things depending on the restaurant — sometimes it's just a free slice of cake, sometimes it's a genuine celebration setup. Here's exactly what's inside The Grand Palace's $150 Celebrate Birthday package, what it costs on top of your food, and how the pricing works so you can decide if it's right for your night.",
      quickAnswer: "The Grand Palace's Celebrate Birthday package is $150 flat and includes an 8-inch cake (Ferrero Rocher or Vanilla Raspberry, serving up to 14), 25 balloons, a birthday banner with curtains and table props, and a birthday song — billed separately from your food, which is ordered from the Sparkle ($40pp) or Shine ($55pp) set menu, or à la carte.",
      quickFacts: [
        { label: "Package price", value: "$150 flat, per booking" },
        { label: "Cake included", value: "8-inch, 1.4kg, serves up to 14" },
        { label: "Set menus", value: "Sparkle $40pp · Shine $55pp" },
      ],
      heroImage: img.ferreroA,
      heroImageAlt: "Ferrero Rocher birthday cake included in The Grand Palace's Celebrate Birthday package",
      sections: [
        {
          heading: "What's Actually Inside the $150 Celebrate Birthday Package",
          body: ["The package is a flat fee covering the celebration setup, kept separate from whatever your group orders to eat:"],
          blockType: "box",
          bulletItems: [
            { title: "Birthday Cake", description: "An 8-inch cake, freshly baked and included in the price — no bakery run required beforehand." },
            { title: "Balloon Setup", description: "25 balloons fully arranged at your table before your group arrives." },
            { title: "Birthday Banner", description: "A banner with curtains and festive table props, set up on arrival." },
            { title: "Birthday Song", description: "Sung by the team at the celebration moment." },
            { title: "Dedicated Team", description: "The event team manages the setup and timing so the host doesn't have to." },
            { title: "Set Menu Access", description: "The package pairs with the Birthday Sparkle ($40pp) or Birthday Shine ($55pp) set menu." },
          ],
        },
        {
          heading: "Choosing Your Cake",
          body: [
            "Two cakes are available with the package, both 8 inches, 1.4kg, and sized to serve up to around 14 guests: Ferrero Rocher, a rich chocolate-hazelnut cake, or Vanilla Raspberry, a lighter fresh-fruit option. You pick one when you book — no extra charge either way.",
            "{{image:" + img.vanillaA + "}}",
          ],
        },
        {
          heading: "Pairing the Package with a Set Menu",
          body: ["Set menus are ordered and paid at the restaurant on the day, separately from the $150 package:"],
          blockType: "row",
          bullets: [
            "Birthday Sparkle ($40pp) — 1 veg + 1 non-veg entrée and curry, dessert: Gulab Jamun",
            "Birthday Shine ($55pp) — 2 veg + 2 non-veg entrée and curry, dessert: Ras Malai or Kulfi",
            "Both include dal, rice, breads, salad and papadum",
          ],
        },
        {
          heading: "What the Package Doesn't Cover",
          body: [
            "A few things worth knowing before you book: the $150 package is non-refundable, it's billed separately from your dine-in bill, and any date changes are at the restaurant's discretion — so it's worth locking in a date you're confident about. Minimum spend applies on top ($35 per adult, $25 for children aged 5–10).",
          ],
        },
        {
          heading: "How to Book and Pay",
          body: [
            `Booking runs through a short online form on the Celebrate Birthday page: your details and guest count, then your cake choice, then a summary with secure payment via NowBookIt to confirm the $150 package. Set menus are chosen and paid for separately at the restaurant. We recommend booking 2–4 weeks ahead, or 4–6 weeks ahead for a Friday or Saturday evening. You can also call ${contact.phone} or email ${contact.email} directly.`,
          ],
        },
      ],
      pricingTable: {
        title: "Celebrate Birthday Pricing",
        note: "Minimum charge $35/adult · $25 children 5–10, in addition to set menu or à la carte ordering.",
        rows: [
          { item: "Celebrate Birthday Package", price: "$150", note: "Cake, balloons, banner, song — flat fee" },
          { item: "Birthday Sparkle set menu", price: "$40pp" },
          { item: "Birthday Shine set menu", price: "$55pp" },
        ],
      },
      faq: [
        { q: "What exactly does the $150 birthday package include?", a: "An 8-inch cake (Ferrero Rocher or Vanilla Raspberry, serves up to 14), 25 balloons, a birthday banner with curtains and table props, and a birthday song from the team — as a flat fee separate from your food order." },
        { q: "Is the birthday package refundable?", a: "No — the $150 package is non-refundable, and date changes are at the restaurant's discretion, so it's worth confirming your date before paying." },
        { q: "Do I need to also pay for a set menu?", a: "Yes — the $150 package covers the celebration setup only. Food is ordered separately, either from the Sparkle ($40pp) or Shine ($55pp) set menu, or à la carte." },
        { q: "Can I choose between cake flavours?", a: "Yes — Ferrero Rocher or Vanilla Raspberry, both 8-inch cakes serving up to 14 guests, at no extra cost." },
      ],
      relatedSlugs: ["where-to-host-a-royal-indian-birthday-dinner-in-sydney", "restaurant-for-birthday-dinner", "make-birthday-memorable-with-tgp"],
      ctaLabel: "Book the Birthday Package",
      ctaHref: "/birthday-package",
      guideType: "normal",
      published: true,
    },

    // 3 — PRACTICAL PLANNING -----------------------------------------------------
    {
      slug: "restaurant-for-birthday-dinner",
      title: "How to Book a Birthday Dinner Restaurant in Sydney CBD: A Planning Guide",
      metaTitle: "Book a Birthday Dinner Restaurant in Sydney CBD",
      metaDescription: "A practical, step-by-step guide to booking a birthday dinner in Sydney CBD — group sizes, timing, cake arrangements and set menus at The Grand Palace.",
      tag: "Events",
      publishedDate: "2025-09-01",
      publishedDateDisplay: "Sep 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Booking a birthday dinner shouldn't take a dozen phone calls. Here's a practical, step-by-step guide to planning one at The Grand Palace in Sydney CBD — from group size to payment.",
      intro: "Planning a birthday dinner usually comes down to five decisions: group size, date and time, cake, menu, and payment. Get those sorted early and everything else falls into place. This is a practical walkthrough of how to book a birthday dinner at The Grand Palace in Sydney CBD, in the order you'll actually need to make each decision.",
      quickAnswer: "To book a birthday dinner at The Grand Palace: confirm your guest count (up to 125), pick a date 2–4 weeks out (4–6 weeks for a Friday or Saturday), choose your cake and set menu when you fill in the online Reserve form, then confirm and pay the $150 package securely via NowBookIt. Larger groups (30+) should book with extra notice.",
      quickFacts: [
        { label: "Booking window", value: "2–4 weeks ahead · 4–6 weeks for Fri/Sat" },
        { label: "Group size", value: "Up to 125 guests" },
        { label: "Service times", value: "Lunch 12–3pm · Dinner from 5pm" },
      ],
      heroImage: img.vanillaA,
      heroImageAlt: "Vanilla raspberry birthday cake ready for a booking at The Grand Palace, Sydney CBD",
      sections: [
        {
          heading: "Step 1: Decide Your Group Size and Format",
          body: [
            "Start with headcount — it shapes everything else. The Grand Palace can seat anywhere from an intimate table of 2 up to 125 guests, across lunch or dinner. For groups over roughly 20, semi-private seating configurations help keep everyone together rather than split across the room, and it's worth mentioning your group size upfront when you enquire so the team can plan the layout.",
            "{{image:" + img.royal + "}}",
          ],
        },
        {
          heading: "Step 2: Pick Your Date and Time",
          body: [
            "Lunch runs daily 12pm–3pm; dinner is 5pm–10pm Sunday to Thursday and 5pm–10:30pm Friday and Saturday. Weeknight bookings generally need 2–4 weeks' notice, but Friday and Saturday evenings are the most popular birthday slots and typically book out 4–6 weeks in advance — the earlier you lock in a weekend date, the more flexibility you'll have.",
          ],
        },
        {
          heading: "Step 3: Sort the Cake and Décor Upfront",
          body: [
            "There's no need to source your own cake or decorations — the $150 Celebrate Birthday package covers an 8-inch cake (choose Ferrero Rocher or Vanilla Raspberry), 25 balloons, a banner with curtains, and table props, all set up before your group arrives. You select the cake flavour as part of the online booking flow, so decide ahead of time if your birthday guest has a preference.",
          ],
        },
        {
          heading: "Step 4: Choose a Set Menu for the Table",
          body: ["Set menus simplify ordering for a group and are ordered and paid for at the restaurant, separate from the $150 package:"],
          blockType: "row",
          bullets: [
            "Birthday Sparkle — $40pp, 1 veg + 1 non-veg entrée & curry",
            "Birthday Shine — $55pp, 2 veg + 2 non-veg entrée & curry",
            "Vegan, gluten-friendly and halal options available on both",
          ],
        },
        {
          heading: "Step 5: Confirm and Pay",
          body: [
            "The online Reserve form takes about two minutes: your details and guest count, then cake selection, then a summary screen where you confirm and pay the $150 package securely via NowBookIt. Remember the package is non-refundable and billed separately from your dine-in bill, and date changes are at the restaurant's discretion — so it's worth being confident on your date before paying. Prefer to talk it through first? Call " + contact.phone + " or email " + contact.email + ".",
          ],
        },
      ],
      faq: [
        { q: "How far in advance should I book a birthday dinner in Sydney CBD?", a: "2–4 weeks ahead for weeknights, and 4–6 weeks ahead for Friday or Saturday evenings, which are the most popular birthday slots. Larger groups (30+) should give as much notice as possible." },
        { q: "Can I choose the birthday cake when I book?", a: "Yes — cake selection (Ferrero Rocher or Vanilla Raspberry) is part of the online booking flow, before you confirm and pay the $150 package." },
        { q: "What's the largest group The Grand Palace can seat for a birthday?", a: "Up to 125 guests, across lunch or dinner service, with semi-private table configurations available for larger bookings." },
        { q: "Can dietary requirements be accommodated for a group?", a: "Yes — both set menus (Sparkle $40pp and Shine $55pp) can accommodate vegetarian, vegan, gluten-friendly and halal requirements; let the team know when booking." },
      ],
      relatedSlugs: ["where-to-host-a-royal-indian-birthday-dinner-in-sydney", "make-birthday-memorable-with-tgp", "private-event-venue-hire-sydney"],
      ctaLabel: "Start Your Booking",
      ctaHref: "/birthday-package",
      guideType: "normal",
      published: true,
    },

    // 4 — CHOOSING A VENUE GENERALLY IN SYDNEY CBD -------------------------------
    {
      slug: "best-birthday-venues-sydney-cbd",
      title: "Best Birthday Venues in Sydney CBD: What to Actually Look For",
      metaTitle: "Best Birthday Venues Sydney CBD – What to Look For",
      metaDescription: "Comparing birthday venues in Sydney CBD? Here's what actually matters — package inclusions, group capacity, location — and where The Grand Palace fits in.",
      tag: "Events",
      publishedDate: "2025-09-01",
      publishedDateDisplay: "Sep 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Sydney CBD has no shortage of restaurants that say they'll 'do something special' for a birthday. Here's what to actually check before you book one, and where The Grand Palace fits.",
      intro: "Most Sydney CBD restaurants will tell you they can handle a birthday. Far fewer have a genuine package built for it — cake sorted, decorations arranged, a menu that scales to a group, without you coordinating three separate vendors. This guide covers what's actually worth checking when comparing birthday venues in the CBD, using The Grand Palace as a working example of what a proper package looks like.",
      quickAnswer: "When comparing birthday venues in Sydney CBD, check whether the venue has a dedicated birthday package (versus a vague 'we can arrange something'), how many guests it can realistically seat, how central and transport-accessible it is, and whether the minimum spend and package costs are stated upfront. The Grand Palace at 261 George Street covers all four with a $150 package, seating for 2–125 guests, and a location a few minutes from Wynyard Station.",
      quickFacts: [
        { label: "Minimum spend", value: "$35/adult · $25 child (5–10)" },
        { label: "Location", value: "261 George Street, opposite Bridge St Light Rail" },
        { label: "Nearby parking", value: "Wilson Parking (Clarence St), Secure Parking (Erskine St)" },
      ],
      heroImage: img.vanillaB,
      heroImageAlt: "Vanilla raspberry cake at a birthday dinner venue in Sydney CBD",
      sections: [
        {
          heading: "What to Actually Check Before Booking a Birthday Venue",
          body: ["A few questions separate a venue with a real birthday offering from one that's improvising on the night:"],
          blockType: "box",
          bulletItems: [
            { title: "Is there a stated package, or a vague promise?", description: "'We'll sort something out' isn't the same as a fixed-price package with named inclusions like cake, decor, and a song." },
            { title: "What's the actual group capacity?", description: "Ask for a real number, not 'as many as you like' — capacity affects whether your group gets its own space or scattered tables." },
            { title: "Is the minimum spend stated upfront?", description: "Some venues only mention minimum spend once you're at the table. Ask before booking." },
            { title: "Can the kitchen handle a mixed-dietary group?", description: "A birthday table is rarely all one diet — vegetarian, vegan, and gluten-friendly options should be standard, not a special request." },
          ],
        },
        {
          heading: "Location Matters More Than You'd Think",
          body: [
            "For a birthday, half your guests are usually travelling from somewhere else in Sydney — so a central, easy-to-find venue removes one more thing that can go wrong on the night. The Grand Palace sits at Basement, 261 George Street, opposite the Bridge Street Light Rail stop and roughly a 3-minute walk from Wynyard Station, with Circular Quay and the Opera House about 10 minutes on foot. For guests driving in, Wilson Parking on Clarence Street and Secure Parking on Erskine Street are both close by.",
            "{{image:" + img.ferreroB + "}}",
          ],
        },
        {
          heading: "Group Capacity and Flexible Formats",
          body: [
            "The Grand Palace seats groups from an intimate table of 2 up to 125 guests, across both lunch (12–3pm) and dinner (from 5pm) service — a wider range than most CBD restaurants offer without moving into a private function-room booking. That flexibility matters if your birthday group is still growing RSVPs a week out.",
          ],
        },
        {
          heading: "Where The Grand Palace Fits In",
          body: [
            "For a birthday specifically, The Grand Palace's advantage over a general CBD restaurant is that the celebration is a built-in package rather than a favour: $150 covers a cake, balloons, banner, and birthday song, paired with the Sparkle ($40pp) or Shine ($55pp) set menu. It won't suit every occasion — there's no fully enclosed private room — but for a straightforward, well-organised Indian fine-dining birthday in the CBD, it's a strong, transparently priced option.",
          ],
        },
      ],
      faq: [
        { q: "What should I compare when choosing a birthday venue in Sydney CBD?", a: "A stated package with clear inclusions, real group capacity, transparent minimum spend, and dietary flexibility. Vague promises to 'arrange something' on the night are a red flag." },
        { q: "Is The Grand Palace central for guests coming from across Sydney?", a: "Yes — it's at 261 George Street, opposite Bridge Street Light Rail, about 3 minutes from Wynyard Station and 10 minutes on foot from Circular Quay." },
        { q: "What's the minimum spend at The Grand Palace?", a: "$35 per adult and $25 per child (aged 5–10), in addition to any birthday package or set menu cost." },
        { q: "Does The Grand Palace have private function rooms for birthdays?", a: "There's no fully enclosed private room, but semi-private table configurations are available for larger groups, and the venue seats up to 125 guests." },
        { q: "How does the price compare to other CBD birthday venues?", a: "The $150 package plus a $40 or $55pp set menu is transparently priced upfront — worth comparing directly against any venue that only quotes 'from' pricing or requires a phone call to get a number." },
      ],
      relatedSlugs: ["make-birthday-memorable-with-tgp", "restaurant-for-birthday-dinner", "private-event-venue-hire-sydney"],
      ctaLabel: "Compare & Book",
      ctaHref: "/birthday-package",
      guideType: "normal",
      published: true,
    },

    // 5 — MEMORABLE / PERSONALISED TOUCHES ---------------------------------------
    {
      slug: "make-birthday-memorable-with-tgp",
      title: "What Makes a Birthday Dinner Memorable? Inside a Celebration at The Grand Palace",
      metaTitle: "Make Your Birthday Memorable at The Grand Palace",
      metaDescription: "From a basement dining room to a cake made just for you — what actually makes a birthday dinner memorable at The Grand Palace in Sydney CBD, in guests' own words.",
      tag: "Events",
      publishedDate: "2025-10-01",
      publishedDateDisplay: "Oct 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "It's rarely one big thing that makes a birthday dinner memorable — it's the room, the small touches already set up on arrival, and food people are still talking about weeks later.",
      intro: "Ask someone what made their last birthday dinner memorable and they rarely mention the venue's square footage — it's the small things: walking into a table that's already decorated, a cake that arrives at exactly the right moment, food that's genuinely worth talking about afterwards. Since 2021, The Grand Palace has hosted more than 500 birthdays in its Sydney CBD dining room, and this is what the team has learned actually makes those nights stick.",
      quickAnswer: "A memorable birthday dinner usually comes down to atmosphere, personal touches handled before guests arrive, and food worth remembering — not extravagance. At The Grand Palace, that means a warmly lit basement dining room, a table already set with balloons, banner and cake before you sit down, and a tandoor-cooked Indian menu that regularly gets called out in guest reviews.",
      heroImage: img.celebrationA,
      heroImageAlt: "A birthday celebration dinner underway at The Grand Palace, Sydney CBD",
      sections: [
        {
          heading: "A Room That Sets the Mood Before the Food Arrives",
          body: [
            "The Grand Palace's basement setting at 261 George Street does a lot of the emotional work before a single dish reaches the table. Warm lighting, rich detailing, and acoustics suited to actual conversation mean guests notice the shift the moment they walk in — it doesn't feel like a regular Tuesday dinner. Since opening in 2021, the restaurant has hosted more than 500 birthday celebrations, from quiet family dinners to full-room parties.",
          ],
        },
        {
          heading: "The Small Touches That Make It Feel Personal",
          body: ["What guests remember afterwards is rarely the venue itself — it's what was already done for them:"],
          blockType: "box",
          bulletItems: [
            { title: "Everything's set up before you arrive", description: "Balloons, banner, table props and cake are ready at the table — no last-minute assembly in front of guests." },
            { title: "The cake moment is handled", description: "Presented by the team with a birthday song, at the point in the meal that suits your group." },
            { title: "A dedicated team on the night", description: "The event team manages timing so the host can actually sit down and enjoy the celebration instead of running it." },
          ],
        },
        {
          heading: "Food People Actually Remember",
          body: [
            "{{image:" + img.celebrationB + "}}",
            "The tandoor oven is central to the kitchen, producing the charred edges and smoky depth that define good Indian cooking. Birthday groups choose between the Sparkle ($40pp) or Shine ($55pp) set menus — both built around dishes like Butter Chicken, Dal Makhani and Paneer Tikka, with vegan, gluten-friendly and halal options so a mixed-dietary table isn't an afterthought.",
          ],
        },
        {
          heading: "Every Milestone Gets Its Own Feel",
          body: [
            "An 18th plays out differently to a 50th, and the venue is used to that — the same $150 package flexes from a lively young group of ten to a multi-generational family table of over a hundred, without losing what makes it feel personal to that particular birthday.",
          ],
        },
        {
          heading: "What Past Guests Have Said",
          body: [],
          blockType: "box",
          bulletItems: [
            { title: "Riya Sharma", description: "\"Everything was perfect. Celebrating my birthday here made it so easy with cake, décor, and banner included.\"" },
            { title: "Rajesh Mehta", description: "\"The Celebrate Birthday package covered everything, and the team managed it beautifully.\"" },
            { title: "Emily Johnson", description: "\"It was a fantastic experience. Celebrating my birthday here made everything simple with cake and décor included.\"" },
          ],
        },
      ],
      faq: [
        { q: "What actually makes a birthday dinner feel memorable, rather than just booked?", a: "Usually a distinctive setting, personal touches (cake, decor) already handled before guests arrive, and food genuinely worth talking about — not extravagance for its own sake." },
        { q: "How many birthdays has The Grand Palace hosted?", a: "Over 500 since opening in 2021, ranging from small family dinners to full-room celebrations of up to 125 guests." },
        { q: "Is the cake presentation handled by the restaurant?", a: "Yes — the cake is presented at the table by the team with a birthday song, timed to suit your group rather than interrupting the meal." },
        { q: "Can the menu suit a group with different dietary needs?", a: "Yes — both set menus include vegetarian and non-vegetarian dishes, with vegan, gluten-friendly and halal options available on request." },
      ],
      relatedSlugs: ["where-to-host-a-royal-indian-birthday-dinner-in-sydney", "best-indian-birthday-dinner-sydney-where-to-celebrate-in-style", "best-birthday-venues-sydney-cbd"],
      ctaLabel: "Plan Your Celebration",
      ctaHref: "/birthday-package",
      guideType: "normal",
      published: true,
    },
  ];
}

async function main() {
  console.log("Uploading real content images to Vercel Blob...");
  const guides = await buildGuides();

  const results = [];
  for (const g of guides) {
    const { slug, ...data } = g;
    try {
      await prisma.guide.upsert({ where: { slug }, create: { slug, ...data }, update: data });
      console.log(`OK   ${slug}`);
      results.push({ slug, ok: true });
    } catch (e) {
      console.log(`FAIL ${slug} — ${e.message}`);
      results.push({ slug, ok: false, error: e.message });
    }
  }

  console.log("\n=== SUMMARY ===");
  results.forEach((r) => console.log(r.ok ? `OK   ${r.slug}` : `FAIL ${r.slug} — ${r.error}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
