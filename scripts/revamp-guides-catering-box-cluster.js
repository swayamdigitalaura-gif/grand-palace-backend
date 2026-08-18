// One-off content revamp for the "Catering Boxes" guide cluster (3 slugs
// that target near-identical keywords and were flagged by the client as at
// risk of keyword cannibalization). The earlier migration pass
// (fix-blog-art-guides-exact.js) copied these 3 pages verbatim from the old
// blog-art deployment with near-duplicate structure between them — this
// script REWRITES all 3 with genuinely distinct search intent/angles:
//
//   1. indian-catering-boxes-in-sydney        -> the PRODUCT itself
//      (what's in the Veg $75 / Non-Veg $85 Platter Box, roll by roll)
//   2. catering-boxes-in-sydney-for-parties    -> PARTY/GROUP SIZING
//      (how many boxes per guest count, veg/non-veg ratio, occasions)
//   3. indian-catering-box-sydney-cbd          -> CBD OFFICE LOGISTICS
//      (pickup cutoffs, CBD delivery, platter box vs full-service catering)
//
// Facts (pricing, roll contents, pickup cutoffs, delivery, full-service
// catering minimums) are taken from the live product page
// palace-art-reimagined-main/src/routes/office-catering.tsx and cross-
// checked against the old source pages at
// https://vercel-deploy-jade-five.vercel.app/blog-art/guides/<slug> — not
// invented. Real content images (skip decorative assets/* chrome) are
// re-uploaded to Vercel Blob and assigned as heroImage / section images.
//
// Safe to re-run — upserts by slug, only touches these 3 rows. Re-uploads
// images each run (fine, blob URLs get random suffixes; old blobs are
// simply orphaned, matching the pattern used elsewhere in this repo).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const TODAY_ISO = "2026-08-11";
const TODAY_DISPLAY = "Aug 11, 2026";

const contact = {
  phone: "(02) 8021 7696",
  email: "bookings@thegrandpalace.com.au",
  address: "Basement, 261 George Street, Sydney NSW 2000",
};

// Real source images (wp-content, not decorative chrome), one per guide's
// original hero + the 2 extra found on indian-catering-box-sydney-cbd.
const SOURCE_IMAGES = {
  "indian-catering-boxes-in-sydney": [
    {
      src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/SLA09455.jpg",
      alt: "Indian catering box with fresh rolls, ready for office lunch pickup in Sydney",
    },
  ],
  "catering-boxes-in-sydney-for-parties": [
    {
      src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/08/sla09430_54709136779_l-1.jpg",
      alt: "Indian catering boxes laid out for a party in Sydney",
    },
  ],
  "indian-catering-box-sydney-cbd": [
    {
      src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/07/Best-indian-catering-boxes-for-office-lunch-family-in-sydney-.png",
      alt: "Indian catering box spread ready for pickup by a Sydney CBD office",
    },
    {
      src: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/SLA09445-1-200x300.jpg",
      alt: "Indian catering platter box prepared at The Grand Palace's Sydney CBD kitchen",
    },
  ],
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

function guideRows(images) {
  return [
    // ────────────────────────────────────────────────────────────────
    // 1. PRODUCT ANGLE — what's actually in the box
    // ────────────────────────────────────────────────────────────────
    {
      slug: "indian-catering-boxes-in-sydney",
      title: "Indian Catering Boxes in Sydney — What's Actually in the Platter Box",
      metaTitle: "Indian Catering Boxes Sydney – What's in the Box",
      metaDescription: "See exactly what's inside The Grand Palace's Indian catering boxes in Sydney — Veg ($75) and Non-Veg ($85), five fresh rolls each, halal certified.",
      tag: "Catering",
      publishedDate: "2025-05-01",
      publishedDateDisplay: "May 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "A full breakdown of what's inside The Grand Palace's Indian catering boxes — five fresh rolls per box, veg and non-veg, made to order in Sydney CBD.",
      intro: "Before you order, it helps to know exactly what turns up in the box. The Grand Palace's Indian catering box comes in two versions — a $75 Vegetarian Platter Box and an $85 Non-Vegetarian Platter Box — each holding five different rolls made fresh in our George Street kitchen, not pulled from a fridge. Here's what's in each one, how they're made, and how to choose between them.",
      quickAnswer: "The Grand Palace's Indian catering box comes in two options: a Vegetarian Platter Box ($75) with five rolls — Paneer Tikka, Malai Soya Chaap, Hara Bhara, Samosa Chaat and Mirchi Vada — and a Non-Vegetarian Platter Box ($85) with five halal-certified rolls — Butter Chicken, Rogan Josh, Kadhai Chicken, Chicken 65 and Seekh Kebab. Both are made fresh to order, not pre-packaged, and are collected from our Sydney CBD kitchen or delivered locally.",
      heroImage: images["indian-catering-boxes-in-sydney"][0]?.url,
      heroImageAlt: images["indian-catering-boxes-in-sydney"][0]?.alt,
      quickFacts: [
        { label: "Veg Platter Box", value: "$75 — 5 rolls" },
        { label: "Non-Veg Platter Box", value: "$85 — 5 halal rolls" },
        { label: "Preparation", value: "Made fresh to order, not pre-packaged" },
      ],
      sections: [
        {
          heading: "What's Actually in an Indian Catering Box",
          blockType: "text",
          body: [
            "An Indian catering box, at least the way we make it, is a sharing platter of five individually wrapped rolls — built around the same tandoor, curry and chaat recipes used on our à la carte menu, just formatted for easy serving without plates or cutlery. Nothing is pre-made in bulk or reheated; each order is cooked and rolled fresh on the day.",
            "Two box types cover most groups: a Vegetarian Platter Box for $75 and a Non-Vegetarian Platter Box for $85, both containing five rolls.",
          ],
        },
        {
          heading: "Veg Platter Box — $75",
          blockType: "row",
          bulletItems: [
            { title: "Paneer Tikka Roll", description: "Tandoor-grilled cottage cheese marinated in yoghurt and spices, wrapped with fresh salad and mint chutney." },
            { title: "Malai Soya Chaap Roll", description: "Soya chaap simmered in a creamy malai sauce — a North Indian street food favourite." },
            { title: "Hara Bhara Roll", description: "Spinach and pea patties seasoned with herbs, wrapped with tangy chutneys." },
            { title: "Samosa Chaat Roll", description: "Crisp samosa filling with tamarind chutney and yoghurt, rolled up for easy eating." },
            { title: "Mirchi Vada Roll", description: "A spiced chilli fritter roll with a stuffed potato filling, for anyone who wants some heat." },
          ],
        },
        {
          heading: "Non-Veg Platter Box — $85",
          blockType: "row",
          body: ["All chicken and lamb used in the Non-Veg box is halal certified."],
          bulletItems: [
            { title: "Butter Chicken Roll", description: "Slow-cooked chicken in a rich tomato-butter sauce — the dish most Australians already know and love." },
            { title: "Rogan Josh Roll", description: "Braised lamb in a deep, aromatic Kashmiri sauce." },
            { title: "Kadhai Chicken Roll", description: "Wok-cooked chicken with capsicum and tomato in a bold dry masala." },
            { title: "Chicken 65 Roll", description: "Crispy South Indian fried chicken with a tangy, spiced marinade." },
            { title: "Seekh Kebab Roll", description: "Hand-shaped minced lamb kebabs, grilled and wrapped fresh." },
          ],
        },
        {
          heading: "Veg or Non-Veg — Which One to Choose",
          blockType: "box",
          body: [
            "If your group is mixed, order both — most offices and parties split somewhere between 40% veg and 60% non-veg, though it's worth asking rather than guessing. Vegetarians and anyone avoiding meat for religious reasons are fully covered by the Veg box; halal requirements are covered by both, since all meat used is halal certified.",
          ],
        },
        {
          heading: "How Fresh Is Fresh",
          blockType: "text",
          body: [
            "Nothing in either box is pre-packaged or held in a fridge waiting for an order — rolls are prepared to order using the same ingredients and cooking methods as our dine-in kitchen at Basement, 261 George Street. That's also why we ask for orders ahead of the pickup window rather than promising instant, walk-up boxes.",
          ],
        },
      ],
      pricingTable: {
        title: "Platter Box Pricing",
        note: "Ask about mixed orders if your group has both vegetarian and non-vegetarian guests.",
        rows: [
          { item: "Vegetarian Platter Box (5 rolls)", price: "$75" },
          { item: "Non-Vegetarian Platter Box (5 rolls)", price: "$85" },
        ],
      },
      faq: [
        { q: "What exactly is in the Veg Platter Box?", a: "Five fresh rolls — Paneer Tikka, Malai Soya Chaap, Hara Bhara, Samosa Chaat and Mirchi Vada — for $75." },
        { q: "What exactly is in the Non-Veg Platter Box?", a: "Five halal-certified rolls — Butter Chicken, Rogan Josh, Kadhai Chicken, Chicken 65 and Seekh Kebab — for $85." },
        { q: "Are the boxes made fresh or pre-packaged?", a: "Fresh. Every roll is cooked and wrapped to order in our George Street kitchen, not held in a fridge waiting to be picked up." },
        { q: "How many people does one box serve?", a: "Each box holds 5 rolls — enough as a full meal for 1–2 people, or as part of a larger shared spread for 3–5." },
        { q: "Can I order a mix of veg and non-veg boxes in one order?", a: "Yes — most groups order a mix. Order as many of each as your guest list needs." },
      ],
      relatedSlugs: ["catering-boxes-in-sydney-for-parties", "indian-catering-box-sydney-cbd", "how-to-plan-office-lunch-catering-in-sydney"],
      ctaLabel: "View Platter Box Menu",
      ctaHref: "/office-catering#platters",
      published: true,
      guideType: "normal",
    },

    // ────────────────────────────────────────────────────────────────
    // 2. PARTY / GROUP EVENT ANGLE — sizing, ratios, occasions
    // ────────────────────────────────────────────────────────────────
    {
      slug: "catering-boxes-in-sydney-for-parties",
      title: "Catering Boxes in Sydney for Parties — How Many to Order",
      metaTitle: "Catering Boxes in Sydney for Parties – Sizing Guide",
      metaDescription: "Planning a party in Sydney? Here's how many Indian catering boxes to order, veg/non-veg ratios, and which occasions they suit — from $75 a box.",
      tag: "Events",
      publishedDate: "2025-08-01",
      publishedDateDisplay: "Aug 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "How many Indian catering boxes to order for a party, what occasions they suit, and how to split veg and non-veg — a practical sizing guide.",
      intro: "The hardest part of ordering catering boxes for a party isn't the menu — it's working out how many to order. This guide covers realistic quantities per guest, how to split vegetarian and non-vegetarian boxes, and which parties and occasions our boxes tend to suit best.",
      quickAnswer: "For a party, order roughly one Indian catering box per 1–2 guests if it's the main meal, or one box per 3–5 guests if it's part of a bigger spread with other food. A 40% veg / 60% non-veg split works for most mixed guest lists, though it's worth checking with your host or organiser first. Boxes start at $75 (Veg) and $85 (Non-Veg), and larger party orders should be placed a few days ahead.",
      heroImage: images["catering-boxes-in-sydney-for-parties"][0]?.url,
      heroImageAlt: images["catering-boxes-in-sydney-for-parties"][0]?.alt,
      quickFacts: [
        { label: "Main meal", value: "~1 box per 1–2 guests" },
        { label: "Part of a spread", value: "~1 box per 3–5 guests" },
        { label: "Suggested veg/non-veg split", value: "40% / 60% (adjust to guest list)" },
      ],
      sections: [
        {
          heading: "How Many Boxes to Order for Your Party",
          blockType: "box",
          body: [
            "As a rule of thumb: one box per 1–2 guests if the boxes are the main meal, and one box per 3–5 guests if they're one part of a bigger spread alongside other dishes. For a 20-guest birthday where the boxes are the whole meal, that's roughly 10–15 boxes; for the same 20 guests as part of a wider party spread, 4–6 boxes might be enough.",
          ],
        },
        {
          heading: "Splitting Veg and Non-Veg",
          blockType: "text",
          body: [
            "Rather than guessing, ask your host or check the guest list for vegetarians, vegans, or anyone keeping halal. If you can't check ahead of time, a 40% veg / 60% non-veg split is a safe general starting point — all meat used in the Non-Veg box is halal certified, so it comfortably covers halal guests too.",
          ],
        },
        {
          heading: "Occasions Our Catering Boxes Suit",
          blockType: "row",
          bulletItems: [
            { title: "Birthdays & family celebrations", description: "A no-fuss main course that still feels like a proper spread." },
            { title: "Diwali, Eid & Holi gatherings", description: "Halal-certified boxes that suit mixed cultural guest lists without a separate menu." },
            { title: "School, club & community events", description: "Individually portioned boxes that are easy to hand out to a crowd." },
            { title: "Home entertaining", description: "No cooking and no washing up, with minimal setup for the host." },
          ],
        },
        {
          heading: "What's in Each Box",
          blockType: "text",
          body: [
            "Every box holds five rolls made fresh to order. For the full roll-by-roll breakdown of the Veg ($75) and Non-Veg ($85) boxes, see our [Platter Box guide](/guides/indian-catering-boxes-in-sydney).",
          ],
        },
      ],
      pricingTable: {
        title: "Catering Box Pricing for Parties",
        note: "Order a few days ahead for larger parties so we can plan kitchen prep.",
        rows: [
          { item: "Vegetarian Platter Box (5 rolls)", price: "$75" },
          { item: "Non-Vegetarian Platter Box (5 rolls)", price: "$85" },
        ],
      },
      faq: [
        { q: "How many catering boxes do I need for a 30-person party?", a: "If the boxes are the main meal, plan on roughly 15–20 boxes; if they're part of a bigger spread with other food, 6–10 is usually enough." },
        { q: "Can I mix veg and non-veg boxes in one party order?", a: "Yes — order any combination. A 40/60 veg-to-non-veg split works well for most mixed guest lists." },
        { q: "Are the boxes suitable for cultural celebrations like Diwali or Eid?", a: "Yes — all boxes are halal certified, and the Veg box suits vegetarian and Jain-leaning guests, which makes them an easy fit for Diwali, Eid and Holi gatherings." },
        { q: "How far ahead should I order catering boxes for a party?", a: "For a handful of boxes, a day or two ahead is usually fine; for larger party orders, call a few days in advance so we can plan kitchen prep." },
      ],
      relatedSlugs: ["indian-catering-boxes-in-sydney", "indian-catering-box-sydney-cbd", "best-indian-birthday-dinner-sydney-where-to-celebrate-in-style"],
      ctaLabel: "Order Catering Boxes for Your Party",
      ctaHref: "/office-catering#order",
      published: true,
      guideType: "normal",
    },

    // ────────────────────────────────────────────────────────────────
    // 3. CBD OFFICE/WORKPLACE LOGISTICS ANGLE — pickup, delivery, lead time
    // ────────────────────────────────────────────────────────────────
    {
      slug: "indian-catering-box-sydney-cbd",
      title: "Indian Catering Box Sydney CBD — Pickup, Delivery & Office Ordering",
      metaTitle: "Indian Catering Box Sydney CBD – Pickup & Delivery",
      metaDescription: "Ordering an Indian catering box in Sydney CBD? Pickup cutoff times, CBD delivery, and platter box vs full-service catering for offices, explained.",
      tag: "Catering",
      publishedDate: "2025-07-01",
      publishedDateDisplay: "Jul 1, 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Pickup times, CBD delivery, and how Sydney CBD offices order Indian catering boxes from The Grand Palace's George Street kitchen.",
      intro: "If you're ordering an Indian catering box for a Sydney CBD office, the details that actually matter are pickup cutoffs, delivery options, and how far ahead to book — not just what's on the menu. Here's exactly how it works from our kitchen at Basement, 261 George Street, two minutes from Wynyard Station.",
      quickAnswer: "The Grand Palace's Indian catering boxes are prepared at Basement, 261 George Street — two minutes from Wynyard Station — for CBD pickup or local delivery (additional fee). Order before 5pm for next-day pickup from 12pm, or after 5pm for next-day pickup from 5:30pm; weekends are dinner pickup only, from 5:30pm. For office groups of 20 or more wanting staffed, full-service catering instead of boxes, book 5–7 days ahead.",
      heroImage: images["indian-catering-box-sydney-cbd"][0]?.url,
      heroImageAlt: images["indian-catering-box-sydney-cbd"][0]?.alt,
      quickFacts: [
        { label: "Pickup location", value: "Basement, 261 George St — 2 min from Wynyard Station" },
        { label: "Next-day cutoff", value: "Order before 5pm for 12pm pickup next day" },
        { label: "Full-service catering", value: "Groups of 20+, 5–7 days notice recommended" },
      ],
      sections: [
        {
          heading: "Where to Pick Up in Sydney CBD",
          blockType: "text",
          body: [
            `Boxes are collected from ${contact.address} — about two minutes' walk from Wynyard Station, making it an easy pickup for anyone working nearby.`,
          ],
        },
        {
          heading: "Pickup Times & Ordering Cutoffs",
          blockType: "box",
          body: [
            `Order before 5:00pm and your boxes are ready for pickup from 12:00pm the next day. Order after 5:00pm and they're ready from 5:30pm the next day instead. On weekends, pickup is dinner-only, from 5:30pm. If you need an earlier pickup than these windows, call ${contact.phone} directly to check what's possible.`,
          ],
        },
        {
          heading: "CBD Delivery",
          blockType: "text",
          body: [
            `Local CBD delivery is available for an additional fee, arranged directly with our team rather than through the online order form. For a handful of boxes, pickup is usually simpler; for a bigger office order where nobody wants to leave the building, delivery is worth arranging — contact us at ${contact.phone} or ${contact.email} to set it up.`,
          ],
        },
        {
          heading: "Platter Boxes vs Full-Service Office Catering",
          blockType: "row",
          bulletItems: [
            { title: "Platter Boxes", description: "Order online, pick a pickup or delivery slot, and collect — no staff on site, no setup. Best for smaller teams and quick turnarounds." },
            { title: "Full-Service Catering", description: "Our team comes to your office, sets up, serves, and cleans up — built for groups of 20 or more, with 5–7 days' notice recommended (2–3 weeks for 100+ guests)." },
          ],
          image: images["indian-catering-box-sydney-cbd"][1]?.url,
          imageAlt: images["indian-catering-box-sydney-cbd"][1]?.alt,
        },
        {
          heading: "How Sydney CBD Offices Order",
          blockType: "text",
          body: [
            "Ordering a platter box for the office is a short process: choose your quantity of Veg ($75) and Non-Veg ($85) boxes, pick a pickup or delivery slot, pay securely online, and collect from George Street. For anything bigger than boxes can comfortably cover, ask about full-service catering instead.",
          ],
        },
      ],
      faq: [
        { q: "What time do I need to order by for next-day pickup?", a: "Order before 5:00pm for pickup from 12:00pm the next day. Orders placed after 5:00pm are ready from 5:30pm the next day instead." },
        { q: "Is delivery available for catering boxes in Sydney CBD?", a: `Yes — local CBD delivery is available for an additional fee. Call ${contact.phone} or email ${contact.email} to arrange it.` },
        { q: "How close is pickup to Wynyard Station?", a: `About two minutes' walk — we're at ${contact.address}.` },
        { q: "Do you offer full-service catering for larger CBD offices, not just boxes?", a: "Yes — for groups of 20 or more we offer full-service catering with staff on site, recommended 5–7 days ahead (2–3 weeks for events over 100 guests)." },
      ],
      relatedSlugs: ["indian-catering-boxes-in-sydney", "catering-boxes-in-sydney-for-parties", "corporate-catering-sydney-cbd"],
      ctaLabel: "Order Office Platter Boxes",
      ctaHref: "/office-catering#order",
      published: true,
      guideType: "normal",
    },
  ];
}

async function main() {
  console.log("Uploading real content images to Vercel Blob...");
  const images = {};
  for (const [slug, list] of Object.entries(SOURCE_IMAGES)) {
    images[slug] = [];
    for (const img of list) {
      const url = await uploadImage(img.src);
      images[slug].push({ url, alt: img.alt });
      console.log(`  [${slug}] uploaded ${img.src.split("/").pop()} -> ${url}`);
    }
  }

  const guides = guideRows(images);

  for (const g of guides) {
    const { slug, ...data } = g;
    await prisma.guide.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
    console.log(`Upserted guide: ${slug}`);
  }

  console.log(`\nDone — ${guides.length} guides upserted.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
