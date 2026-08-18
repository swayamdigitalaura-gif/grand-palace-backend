// Content revamp for the "Corporate/Lunch" guide cluster.
//
// Guides 1-3 below (corporate-catering-in-sydney-at-tgp, sydney-corporate-
// catering-at-tgp, corporate-catering-sydney-cbd) previously targeted nearly
// identical "corporate catering Sydney" keywords with near-duplicate content.
// This script rewrites each with a distinct search intent so they stop
// cannibalising each other:
//   1. corporate-catering-in-sydney-at-tgp  -> private dining / client
//      entertainment (the venue-booking angle: board dinners, product
//      launches, reserved sections, Gold Licensed bar)
//   2. sydney-corporate-catering-at-tgp     -> catering box logistics (the
//      ordering angle: box contents, minimum order, delivery to office)
//   3. corporate-catering-sydney-cbd        -> everyday/recurring team
//      lunches (the CBD-location + standing-order angle)
// Guide 4 (business-lunch-sydney-cbd) is a new row — it never existed in the
// Guide table. It was migrated from the live WordPress page (not blog-art)
// and is about client business lunches / private dining for up to 125 guests.
//
// Real content images (no stock/decorative chrome) were identified from the
// raw source HTML and are re-uploaded to Vercel Blob here, same pattern as
// fix-blog-art-guides-exact.js. Safe to re-run — upserts by slug only for
// these 4 slugs, re-uploads images each run (old blobs are simply orphaned).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const contact = {
  phone: "(02) 8021 7696",
  whatsapp: "+61 422 984 570",
  email: "bookings@thegrandpalace.com.au",
  address: "Basement, 261 George Street, Sydney NSW 2000",
};

async function uploadImage(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Image fetch failed: ${src} (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = decodeURIComponent(src.split("/").pop().split("?")[0]);
  const contentType = res.headers.get("content-type") || undefined;
  const blob = await put(filename, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

async function main() {
  console.log("Uploading images to Vercel Blob...");
  const [
    g1Hero, g1Section,
    g2Hero,
    g3Hero,
    g4Hero, g4Section,
  ] = await Promise.all([
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/09/1000058285.jpg"),
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/09/Untitled-design-13-1.png"),
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/SLA09455.jpg"),
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/06/image2-1024x684.jpg"),
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/https___cms.thegrandpalace.com_.au_wp-content_uploads_2023_05_tgp-mv-1024x683-1.jpg"),
    uploadImage("https://www.thegrandpalace.com.au/wp-content/uploads/2025/09/Group-192-1024x513.png"),
  ]);
  console.log("Images uploaded.");

  const guides = [
    // ------------------------------------------------------------------
    // 1. Private dining / client entertainment angle
    // ------------------------------------------------------------------
    {
      slug: "corporate-catering-in-sydney-at-tgp",
      title: "Private Corporate Dining in Sydney CBD — Client Entertainment at The Grand Palace",
      metaTitle: "Corporate Dining & Client Lunches Sydney CBD | TGP",
      metaDescription: "Host client dinners, executive lunches or a product launch in a private dining room at The Grand Palace, Sydney CBD — Gold Licensed, halal-certified, up to 300 guests.",
      tag: "Catering",
      publishedDate: "2025-09-01",
      publishedDateDisplay: "Sep 1, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "When client entertainment is the point, not just the fuel, The Grand Palace's reserved dining sections and Gold Licensed bar give Sydney CBD businesses a setting worth booking.",
      intro: "Not every corporate event calls for a catering box at a desk. Client dinners, board meetings and product launches need a room that reflects well on your business — and that's what The Grand Palace, at Basement, 261 George Street, is built for. This guide covers how we host corporate entertaining, from a single reserved table to a 300-guest function.",
      quickAnswer: "For corporate entertaining that needs to impress — client dinners, board dinners, product launches — The Grand Palace offers reserved dining sections at Basement, 261 George Street, a Gold Licensed bar, and set menus from $40–$55 per person, accommodating groups from 20 up to 300 guests.",
      quickFacts: [
        { label: "Group size", value: "20–300 guests" },
        { label: "Set menus", value: "$40pp / $55pp" },
        { label: "Bar", value: "Gold Licensed — wine, beer, cocktails" },
        { label: "Location", value: "1 min walk from Wynyard Station" },
      ],
      sections: [
        {
          heading: "Why Businesses Choose The Grand Palace to Entertain Clients",
          body: [
            "A restaurant that's fine for a solo lunch isn't automatically right for a client dinner. The room, the service and the food all say something about the business that booked it. The Grand Palace's palace-inspired dining room, central George Street address and genuinely authentic Indian menu are why Sydney companies keep coming back for the meetings that matter.",
          ],
          bullets: [
            "Central CBD address — 1 minute from Wynyard Station, a short walk from Circular Quay",
            "Fully halal-certified kitchen — no guest is left choosing around the menu",
            "Gold Licensed bar — wine, beer and cocktails can be part of the evening",
            "A dining room built to impress, not a function-centre backdrop",
          ],
        },
        {
          heading: "Reserved Sections for Confidential Meetings & Board Dinners",
          blockType: "box",
          body: [
            "For conversations that need privacy — board dinners, sensitive client discussions, executive functions — we set aside a reserved section of the restaurant rather than seating your group in the general room. It's a lighter-touch option than hiring the whole venue, suited to smaller groups who still need the room to themselves.",
          ],
        },
        {
          heading: "Occasions We Host",
          blockType: "row",
          items: [
            "Client dinners & business development events",
            "Product launches & brand events",
            "Board meetings & executive dinners",
            "End-of-year and Christmas functions",
            "Cultural and diversity celebrations — Diwali, Eid and more",
            "Team milestones and project wrap parties",
          ],
        },
        {
          heading: "The Menu: Dishes That Start Conversations",
          image: g1Section,
          imageAlt: "A corporate catering spread of Indian dishes plated at The Grand Palace, Sydney CBD",
          body: ["Our set menus are built around dishes guests actually talk about afterwards — not the safest option on a buffet."],
          bulletItems: [
            { title: "Butter Chicken", description: "Slow-cooked in a rich tomato and cream sauce — the dish every guest already trusts." },
            { title: "Dal Makhani", description: "Black lentils simmered overnight for a deep, restaurant-signature flavour." },
            { title: "Tandoori Mixed Grill", description: "Charred meats straight from the clay tandoor, carved and served at the table." },
            { title: "Lamb Biryani", description: "Fragrant basmati layered with slow-cooked lamb and whole spices." },
            { title: "Vegetarian selection", description: "Paneer Tikka Masala, Palak Paneer and Mixed Vegetable Korma, so no guest is an afterthought." },
          ],
        },
        {
          heading: "Booking Your Corporate Event",
          body: [
            `Call ${contact.phone} or email ${contact.email} with your date, guest numbers and whether you need a reserved section or the full venue. We'll confirm your set menu, dietary requirements and, if needed, drinks arrangements before the day.`,
          ],
        },
      ],
      heroImage: g1Hero,
      heroImageAlt: "Corporate guests seated at a reserved dining table at The Grand Palace, Sydney CBD",
      faq: [
        { q: "Can The Grand Palace host a private client dinner?", a: `Yes — we reserve dining sections for board dinners and client entertaining, or hire the full venue for larger functions, at ${contact.address}.` },
        { q: "What's the minimum spend for a corporate booking?", a: `The minimum charge is $35 per adult and $25 for children aged 5–10. Call ${contact.phone} to discuss a custom corporate package.` },
        { q: "Is alcohol available for corporate events?", a: "Yes — The Grand Palace is a Gold Licensed venue, so wine, beer and cocktails can be included in your event." },
        { q: "How large a group can you accommodate?", a: "We host corporate groups from 20 up to 300 guests, from a reserved section for a board dinner to a full-venue product launch." },
      ],
      relatedSlugs: ["sydney-corporate-catering-at-tgp", "corporate-catering-sydney-cbd", "business-lunch-sydney-cbd"],
      ctaLabel: "Enquire About Private Dining",
      ctaHref: "/venue-for-hire",
      published: true,
      guideType: "normal",
    },

    // ------------------------------------------------------------------
    // 2. Catering box logistics / delivered platters angle
    // ------------------------------------------------------------------
    {
      slug: "sydney-corporate-catering-at-tgp",
      title: "Indian Corporate Catering Boxes Delivered to Your Sydney CBD Office",
      metaTitle: "Corporate Catering Boxes Sydney CBD | The Grand Palace",
      metaDescription: "Order halal-certified Indian catering boxes for your Sydney office — veg $75, non-veg $85, minimum 10 boxes. No cooking, no plating, ready to serve.",
      tag: "Catering",
      publishedDate: "2025-09-01",
      publishedDateDisplay: "Sep 1, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Skip the kitchen setup — order restaurant-quality Indian catering boxes straight to your Sydney CBD office for team lunches, meetings and events.",
      intro: "If you're the one organising Friday's team lunch or catering for a meeting, what you actually need is simple: food that arrives ready to eat, covers every diet on the floor, and doesn't need a plan B. The Grand Palace's catering boxes are built for exactly that — ordered in bulk, delivered or collected, and served straight from the box.",
      quickAnswer: "The Grand Palace's corporate catering boxes are $75 (vegetarian, 5 rolls) and $85 (non-vegetarian, 5 rolls), ordered in a minimum of 10 with 48 hours' notice, and arrive ready to serve with no cooking, plating or cleanup required.",
      quickFacts: [
        { label: "Vegetarian Box", value: "$75 — 5 rolls" },
        { label: "Non-Vegetarian Box", value: "$85 — 5 rolls" },
        { label: "Minimum order", value: "10 boxes" },
        { label: "Notice required", value: "48 hours" },
      ],
      sections: [
        {
          heading: "Why Catering Boxes Work for Office Lunches",
          image: g2Hero,
          imageAlt: "Vegetarian and non-vegetarian Indian catering boxes packed for a Sydney office order",
          body: [
            "Indian food is one of the few cuisines that genuinely covers a mixed office in a single order — vegetarian, vegan, halal and Jain guests all get a real dish, not a side salad. Each box is individually portioned, so there's no shared tray, no serving spoons, and no washing up afterwards.",
          ],
        },
        {
          heading: "Vegetarian Box — $75",
          bulletItems: [
            { title: "Paneer Tikka Roll", description: "Smoky tandoori paneer with mint chutney and fresh vegetables." },
            { title: "Malai Soya Chaap Roll", description: "Creamy soya chaap cooked in a rich malai sauce." },
            { title: "Hara Bhara Roll", description: "Spinach, peas and spiced vegetables in a vibrant green roll." },
            { title: "Samosa Chaat Roll", description: "The classic samosa reimagined with tamarind chutney and yoghurt." },
            { title: "Mirchi Vada Roll", description: "A stuffed chilli fritter roll for guests who like real heat." },
          ],
        },
        {
          heading: "Non-Vegetarian Box — $85",
          body: ["All chicken and lamb used in our boxes is halal certified."],
          bulletItems: [
            { title: "Butter Chicken Roll", description: "Slow-cooked chicken in our signature tomato and butter sauce." },
            { title: "Rogan Josh Roll", description: "Slow-braised lamb in a deeply spiced Kashmiri sauce." },
            { title: "Kadhai Chicken Roll", description: "Wok-cooked chicken with capsicum, onion and tomato." },
            { title: "Chicken 65 Roll", description: "Crispy South Indian-style spiced fried chicken." },
            { title: "Seekh Kebab Roll", description: "Hand-rolled minced lamb kebab, grilled and wrapped fresh." },
          ],
        },
        {
          heading: "Ordering Logistics for Sydney Offices",
          blockType: "box",
          body: [
            "Orders are a minimum of 10 boxes, and we ask for 48 hours' notice so everything is prepared fresh on the day, not pre-packed the night before. You can mix vegetarian and non-vegetarian boxes freely within one order — most offices split somewhere around 40% veg / 60% non-veg, but tell us your team's actual mix rather than guessing.",
          ],
          bullets: [
            `Call ${contact.phone} or email ${contact.email} with your headcount and date`,
            "Confirm your veg/non-veg split and any dietary flags (Jain, gluten-free, allergies)",
            "Collect from George Street, 1 minute from Wynyard Station, or discuss delivery with our team",
          ],
        },
        {
          heading: "Prefer to Dine In Instead?",
          body: [
            "If your event calls for table service rather than boxes at the desk — a client lunch, a bigger function — The Grand Palace also runs dine-in set menus from $40 per person at the restaurant. Get in touch and we'll point you the right way."],
        },
      ],
      heroImage: g2Hero,
      heroImageAlt: "Vegetarian and non-vegetarian Indian catering boxes packed for a Sydney office order",
      faq: [
        { q: "What's the minimum order for catering boxes?", a: "10 boxes per order, with 48 hours' notice so everything can be prepared fresh." },
        { q: "Can I mix vegetarian and non-vegetarian boxes?", a: "Yes — order any combination of Veg ($75) and Non-Veg ($85) boxes within the same order." },
        { q: "Are the boxes halal?", a: "Yes, all meat used in our non-vegetarian boxes is fully halal certified." },
        { q: "How do I place an order?", a: `Call ${contact.phone} or email ${contact.email} with your date, headcount and dietary requirements.` },
      ],
      relatedSlugs: ["indian-catering-box-sydney-cbd", "how-to-plan-office-lunch-catering-in-sydney", "corporate-catering-sydney-cbd"],
      ctaLabel: "Order Catering Boxes",
      ctaHref: "/office-catering",
      published: true,
      guideType: "normal",
    },

    // ------------------------------------------------------------------
    // 3. Everyday / recurring team lunches angle
    // ------------------------------------------------------------------
    {
      slug: "corporate-catering-sydney-cbd",
      title: "Corporate Catering Sydney CBD — A Reliable Lunch Spot Near Martin Place & Wynyard",
      metaTitle: "Corporate Catering Sydney CBD — Team Lunches | TGP",
      metaDescription: "The Grand Palace serves Sydney CBD offices near Martin Place, Circular Quay and Wynyard with dependable Indian corporate lunches — dine-in or catering boxes.",
      tag: "Catering",
      publishedDate: "2026-08-10",
      publishedDateDisplay: "Aug 10, 2026",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "For Sydney CBD offices that want a dependable weekly lunch option rather than a one-off event caterer, The Grand Palace's George Street location and daily lunch service make it easy.",
      intro: "Most corporate catering guides are written for the once-a-year product launch. This one is for the office that just wants somewhere good to send its lunch order every week without re-deciding from scratch each time. The Grand Palace, at Basement, 261 George Street, is close enough to Martin Place, Circular Quay and Wynyard to become exactly that.",
      quickAnswer: "For Sydney CBD teams near Martin Place, Circular Quay or Wynyard who want a repeatable lunch option rather than a one-off booking, The Grand Palace offers dine-in set menus from $40pp (Monday–Sunday, 12pm–3pm) and catering boxes from $75, so the same order can become your team's regular spot.",
      quickFacts: [
        { label: "Lunch service", value: "Mon–Sun, 12pm–3pm" },
        { label: "Set menu", value: "From $40pp" },
        { label: "From Martin Place", value: "~10 min walk" },
        { label: "Catering boxes", value: "From $75 (min 10)" },
      ],
      sections: [
        {
          heading: "A CBD Location Built for Regular Office Lunches",
          body: [
            "A caterer you use once a year can be anywhere. One your team orders from every week needs to actually be close by. The Grand Palace sits centrally enough on George Street that it works for most of the CBD's business core, not just one corner of it.",
          ],
          bullets: [
            "~5 minutes' walk from Wynyard Station (George Street exit, walk south)",
            "~8 minutes' walk from Circular Quay",
            "~10 minutes' walk from Martin Place",
            "Multiple bus routes along George Street",
          ],
        },
        {
          heading: "Why Indian Food Suits a Recurring Office Order",
          body: [
            "The problem with reordering from the same place every week is usually variety and dietary fatigue — someone always ends up with the same side salad. Indian cuisine avoids that because the menu itself is naturally broad: curries, tandoor dishes, biryanis and vegetarian mains that rotate easily without anyone being stuck with the same fallback option twice in a row.",
          ],
        },
        {
          heading: "Two Ways to Make TGP Your Regular Lunch Spot",
          blockType: "row",
          items: [
            "Dine-in set menu — $40–55pp, full table service, Mon–Sun 12pm–3pm",
            "Catering boxes — $75 (veg) / $85 (non-veg), min 10, delivered or collected",
            "One point of contact — the same team handles your order whichever format you choose",
          ],
        },
        {
          heading: "Setting Up a Standing Weekly or Monthly Order",
          blockType: "box",
          image: g3Hero,
          imageAlt: "Indian corporate catering spread served by The Grand Palace, Sydney CBD",
          body: [
            `If your office wants to make this a regular thing rather than re-booking from scratch each time, talk to our team about it directly — call ${contact.phone} or email ${contact.email}. Nominate one contact on your side, agree a day and headcount, and confirm your team's dietary list once so it doesn't need repeating on every order.`,
          ],
        },
      ],
      heroImage: g3Hero,
      heroImageAlt: "Indian corporate catering spread served by The Grand Palace, Sydney CBD",
      faq: [
        { q: "How close is The Grand Palace to Martin Place?", a: `About a 10-minute walk from ${contact.address} — also close to Circular Quay (~8 min) and Wynyard (~5 min).` },
        { q: "Can we set up a recurring weekly lunch order?", a: `Yes — talk to our team on ${contact.phone} about a standing order; we'll keep your dietary list on file so you don't need to repeat it each time.` },
        { q: "What are your lunch hours?", a: "Monday to Sunday, 12pm to 3pm, for both dine-in and catering box collection." },
        { q: "Can you handle a mixed-diet office?", a: "Yes — vegetarian, non-vegetarian, Jain (no onion/garlic) and halal requirements are all accommodated in the same order." },
      ],
      relatedSlugs: ["corporate-catering-in-sydney-at-tgp", "sydney-corporate-catering-at-tgp", "indian-restaurant-near-wynyard-station-sydney"],
      ctaLabel: "Book Your Team Lunch",
      ctaHref: "/book-a-table",
      published: true,
      guideType: "normal",
    },

    // ------------------------------------------------------------------
    // 4. NEW — business lunch / client entertaining, migrated from WP
    // ------------------------------------------------------------------
    {
      slug: "business-lunch-sydney-cbd",
      title: "Business Lunch Sydney CBD: Impress Clients at The Grand Palace",
      metaTitle: "Business Lunch Sydney CBD – Impress Clients | TGP",
      metaDescription: "Host your next client lunch at The Grand Palace, Sydney CBD — palace-inspired private dining for up to 125 guests, HACCP-certified, steps from Wynyard Station.",
      tag: "Catering",
      publishedDate: "2026-08-11",
      publishedDateDisplay: "Aug 11, 2026",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Sydney CBD's finest venue for a client business lunch — palace-inspired private dining, HACCP-certified catering, and every dietary requirement covered.",
      intro: "Choosing the right venue for a business lunch in Sydney CBD can be the difference between a deal made and a deal missed. At The Grand Palace — Basement, 261 George Street — clients get authentic Indian fine dining in a room that actually commands attention, with capacity for up to 125 guests and flexible group arrangements for anything from a two-person meeting to a department gathering.",
      quickAnswer: "The Grand Palace at Basement, 261 George Street is Sydney CBD's premier business lunch venue — a palace-inspired dining room seating up to 125 guests, open for lunch daily 12pm–3pm, a short walk from Wynyard Station, with HACCP-certified catering and full dietary coverage for client entertaining.",
      quickFacts: [
        { label: "Capacity", value: "Up to 125 guests" },
        { label: "Lunch hours", value: "Mon–Sun, 12pm–3pm" },
        { label: "From Wynyard Station", value: "Short walk" },
        { label: "Certification", value: "HACCP · Gold Licensed" },
      ],
      sections: [
        {
          heading: "Why The Grand Palace Is Sydney CBD's Business Lunch Venue",
          blockType: "row",
          items: [
            "Location — a short walk from Wynyard Station, easy for guests from the financial district or Barangaroo, with Wilson Parking and Secure Parking nearby for those driving.",
            "Atmosphere — a palace-inspired interior with warm lighting and rich décor that signals you value quality, not a sterile hotel dining room.",
            "Coordination — HACCP-certified and Gold Licensed, with an events team managing table setup, timing and dietary requirements end to end.",
          ],
        },
        {
          heading: "Group Dining and Private Rooms for Corporate Lunches",
          image: g4Section,
          imageAlt: "Business lunch dining setup at The Grand Palace, Sydney CBD",
          body: [
            "The Grand Palace offers flexible group dining for corporate lunches of any size, from a small executive meeting to a larger department gathering — our events team tailors the arrangement to your group. For a fully private setup, we also offer venue hire for corporate groups of up to 125 guests, configured for formal dining, banquet seating, or a mix of both. Weekend venue hire is available on request.",
          ],
        },
        {
          heading: "Every Dietary Requirement Covered",
          body: ["A client lunch will always include guests with different dietary needs. Our menu covers all of the following without anyone needing to ask twice:"],
          bulletItems: [
            { title: "Vegetarian", description: "A full range of vegetarian curries, tandoor dishes and breads." },
            { title: "Vegan", description: "Plant-based mains available across the menu." },
            { title: "Gluten-Free", description: "Gluten-free options identified and accommodated on request." },
            { title: "Halal", description: "All meat used is fully halal certified." },
            { title: "No Onion / Garlic", description: "Jain-style preparation available on request." },
          ],
        },
        {
          heading: "Booking Your Business Lunch",
          blockType: "box",
          body: [
            "We're open for lunch Monday to Sunday, 12pm to 3pm. For group bookings of 10 or more guests, reserve at least 48 hours ahead to secure your table arrangement and confirm menu selections.",
            `Call ${contact.phone}, email ${contact.email}, or WhatsApp ${contact.whatsapp} to book.`,
          ],
        },
      ],
      heroImage: g4Hero,
      heroImageAlt: "Elegant palace-inspired dining room at The Grand Palace Indian Restaurant, Sydney CBD",
      faq: [
        { q: "Is The Grand Palace suitable for business lunches in Sydney CBD?", a: `Yes. At ${contact.address}, we offer private dining for up to 125 guests, corporate group menus and professional event coordination, open for lunch 7 days a week, 12pm to 3pm.` },
        { q: "Can The Grand Palace accommodate private dining for corporate groups?", a: `Yes — venue hire for corporate groups up to 125 guests, with our events team handling table setup, dietary requirements, menu selection and timing. Call ${contact.phone} for details.` },
        { q: "What dietary options are available for corporate groups?", a: "Vegetarian, vegan, gluten-free and halal-certified options across the menu, plus no-onion/no-garlic preparation on request. Let us know when booking." },
        { q: "Where is The Grand Palace located?", a: `${contact.address} — a short walk from Wynyard Station and near Circular Quay, with Wilson Parking and Secure Parking nearby.` },
        { q: "How do I book a business lunch?", a: `Call ${contact.phone}, email ${contact.email}, or WhatsApp ${contact.whatsapp}. Groups of 10 or more should book at least 48 hours ahead.` },
      ],
      relatedSlugs: ["corporate-catering-in-sydney-at-tgp", "private-event-venue-hire-sydney", "corporate-catering-sydney-cbd"],
      ctaLabel: "Book a Business Lunch",
      ctaHref: "/book-a-table",
      published: true,
      guideType: "normal",
    },
  ];

  for (const g of guides) {
    const { slug, ...data } = g;
    await prisma.guide.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
    console.log(`Upserted: ${slug}`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
