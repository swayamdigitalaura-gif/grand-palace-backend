// One-off content revamp for 7 Guide rows (events/wedding/misc cluster):
//   1. indian-wedding-catering-sydney       — REWRITE (angle: wedding MENUS/dietary)
//   2. wedding-catering-sydney-cbd          — NEW row (angle: wedding VENUE HIRE/logistics)
//   3. private-event-venue-hire-sydney      — REWRITE
//   4. mocktails-drinks-in-indian-food      — REWRITE
//   5. jain-restaurants-in-sydney-no-onion-no-garlic — REWRITE
//   6. guide-to-indian-whisky-in-sydney     — LIGHT TOUCH (already hand-authored, good content)
//   7. find-right-indian-catering-for-event — REWRITE
//
// Content for guides 1,3,4,5,7 substantially rewritten (not scraped verbatim)
// from the raw HTML at vercel-deploy-jade-five.vercel.app/blog-art/guides/<slug>.
// Guide 2 is a full WordPress/Elementor page at thegrandpalace.com.au/guides/
// wedding-catering-sydney-cbd/ that doesn't exist in the Guide table yet.
// Guide 6 already had real hand-authored content from an earlier session;
// this script only adds heroImage/heroImageAlt/quickAnswer/relatedSlugs and
// leaves the core sections/faq untouched.
//
// Real images:
//  - Guides 1 & 3 originally pointed at thegrandpalace.com.au/wp-content/uploads/
//    2025/04/Blog-image-2-*.jpg, which now 404s on the live site — but that
//    exact photo (a banquet hall) was already re-uploaded to Vercel Blob in
//    an earlier migration pass (fix-blog-art-guides-exact.js) and is still
//    live, so we reuse those existing blob URLs instead of re-fetching.
//  - Guide 2's hero is a different real photo (unique og:image on the WP
//    page — TGP-branded glassware on a set table) — freshly uploaded here.
//  - Guide 4 (mocktails) and Guide 5 (Jain) reuse already-blob-hosted images
//    from the same earlier pass (Group-40-2.png / storefront photo — the
//    Jain source image was just the round TGP logo, decorative, so we swap
//    in the real storefront photo instead of a logo).
//  - Guide 6 (whisky) gets a freshly uploaded hero from its WP og:image (a
//    designed promo graphic featuring the three whisky bottles + food).
//  - Guide 7 reuses two already-blob-hosted photos from the earlier pass.
//
// Safe to re-run — upserts by slug.
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

// Already-live blob URLs re-used from the earlier fix-blog-art-guides-exact.js
// migration pass (verified 200 OK before writing this script).
const EXISTING_BLOB = {
  banquetHall1: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/venue-uqjFU619LAYIOzj6oiVO3dEVaSXncs.jpg",
  banquetHall2: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/venue-gBM6Do0i6BSuhM7WSWChkeLQUOW96y.jpg",
  mocktails: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/Group-40-2-4tcAWqlao5cX4yKO7wY70M6gsk6S7o.png",
  storefront: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/grand-palace-storefront-a99RGAYXElJLhDlEnlMviazP91uB7u.jpg",
  cateringSetup: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/image2-1024x684-dc4QZcBqsdi73BNeGTPWyUr3d5NGEj.jpg",
  cateringBanner: "https://booriz1miux5j9vr.public.blob.vercel-storage.com/image1-1-684x1024-FIWsJ9Eeqn2qVRug1cvx08ofWCguNN.jpg",
};

// Fresh images that need uploading (not already in blob storage)
const FRESH_IMAGES = {
  weddingCbdHero: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/04/https___cms.thegrandpalace.com_.au_wp-content_uploads_2022_03_thegrandpalace-2-1024x682-1.jpg",
  whiskyHero: "https://www.thegrandpalace.com.au/wp-content/uploads/2026/07/Your-Complete-Guide-to-Indian-Whisky-in-Sydney.png",
};

async function uploadImage(src, filenameHint) {
  const res = await fetch(src, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Image fetch failed: ${src} (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || undefined;
  const blob = await put(filenameHint, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

async function buildGuides() {
  const weddingCbdHeroUrl = await uploadImage(FRESH_IMAGES.weddingCbdHero, "wedding-catering-cbd-hero.jpg");
  console.log("Uploaded wedding-catering-sydney-cbd hero:", weddingCbdHeroUrl);
  const whiskyHeroUrl = await uploadImage(FRESH_IMAGES.whiskyHero, "indian-whisky-sydney-hero.png");
  console.log("Uploaded whisky hero:", whiskyHeroUrl);

  return [
    // ============================================================
    // 1. indian-wedding-catering-sydney — MENUS / DISHES / DIETARY
    // ============================================================
    {
      slug: "indian-wedding-catering-sydney",
      title: "Indian Wedding Catering in Sydney — Menus & Dietary Options",
      metaTitle: "Indian Wedding Catering Sydney — Menus & Dietary",
      metaDescription: "Authentic Indian wedding catering in Sydney CBD — set menus from $40pp, halal-certified dishes, and full vegetarian, vegan and Jain options for every guest.",
      tag: "Catering",
      publishedDate: "2026-08-10",
      publishedDateDisplay: "10 Aug 2026",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Authentic Indian wedding menus for Sydney celebrations — halal-certified, with full vegetarian, vegan and Jain accommodation for every guest at your table.",
      intro: "Choosing the menu is one of the biggest decisions in planning an Indian wedding — it's the part guests remember longest. The Grand Palace builds wedding menus around the richness and variety Indian celebrations are known for, from tandoor classics to slow-cooked curries, while making sure every dietary requirement at the table is genuinely covered, not just tolerated.",
      quickAnswer: "The Grand Palace offers two set wedding menus — $40pp and $55pp — spanning curries, tandoor dishes, biryanis, breads and desserts, plus à la carte dining for smaller wedding events. Vegetarian, vegan and Jain (no onion, garlic or root vegetables) requirements are accommodated with advance notice, and the whole menu is halal certified.",
      heroImage: EXISTING_BLOB.banquetHall1,
      heroImageAlt: "Long banquet table set with floral centrepieces for a wedding reception at The Grand Palace, Sydney CBD",
      quickFacts: [
        { label: "Set Menu — Classic", value: "$40 per person" },
        { label: "Set Menu — Premium", value: "$55 per person" },
        { label: "Dietary", value: "Vegetarian, vegan & Jain accommodated" },
        { label: "Certification", value: "Fully halal certified" },
      ],
      sections: [
        {
          heading: "Why Indian Food Suits a Wedding Feast",
          body: [
            "Indian weddings have always been built around spectacular, generous food — it's part of the tradition, not an afterthought. That same range of curries, tandoor-grilled meats, biryanis and desserts translates naturally to Sydney celebrations, and it happens to solve one of the hardest parts of wedding catering: keeping a mixed guest list happy.",
          ],
          bullets: [
            "Wide variety — curries, tandoor dishes, biryanis, fresh breads and desserts in one feast",
            "Naturally inclusive — the cuisine already accommodates vegetarian, vegan and Jain eaters without feeling like an afterthought",
            "Traditional preparation — real spice blends and slow-cooked techniques, not shortcuts",
            "Menus flex to your budget, guest count and the formality of the occasion",
          ],
          blockType: "text",
        },
        {
          heading: "Wedding Menu Options",
          body: [],
          bulletItems: [
            { title: "Set Menu — $40pp", description: "A curated selection of our most popular dishes, ideal for a seated wedding dinner where consistency across every table matters." },
            { title: "Set Menu — $55pp", description: "A more expansive menu with premium dishes and extra courses, suited to milestone weddings where you want to go all out." },
            { title: "À La Carte", description: "Available for weddings hosted at our restaurant. Talk to our team about building a custom menu around your event." },
          ],
          blockType: "row",
        },
        {
          heading: "Dietary Accommodations for Wedding Guests",
          body: [
            "A wedding guest list is rarely uniform, and dietary diversity is the rule rather than the exception. Our kitchen is set up to handle it without splitting your menu into an afterthought \"special\" plate.",
          ],
          bullets: [
            "Vegetarian — a full range of meat-free dishes prepared with the same care as the non-vegetarian menu",
            "Jain — no onion, garlic or root vegetables, prepared separately; flag it when you book",
            "Allergen awareness — tell our team about any serious allergies at booking, not on the day",
            "Spice level — every dish can be adjusted milder or bolder for different guests",
          ],
          blockType: "text",
        },
        {
          heading: "Pre-Wedding Dinners & Engagement Celebrations",
          body: [
            "The Grand Palace also suits the smaller gatherings that lead up to the wedding day — engagement dinners, the night-before family dinner, and post-wedding lunches. The $40pp set menu in particular works well here: a curated, no-fuss experience for a group that doesn't need the full à la carte treatment.",
          ],
          blockType: "text",
        },
        {
          heading: "Booking Wedding Catering",
          body: [],
          bullets: [
            `Contact us — call ${contact.phone} or email ${contact.email} with your date and approximate guest count`,
            "Discuss your menu — share your wedding style and any dietary requirements across the guest list",
            "Confirm the booking — we'll send a proposal covering menu options and pricing",
            "Finalise details — confirm final numbers and any late changes closer to the date",
          ],
          blockType: "box",
        },
      ],
      faq: [
        { q: "What Indian wedding menu options does The Grand Palace offer?", a: "Two set menus — $40pp and $55pp — covering curries, tandoor dishes, biryanis, breads and desserts, plus à la carte dining for weddings held at the restaurant." },
        { q: "Can you cater for Jain guests at a wedding?", a: "Yes. We prepare Jain meals with no onion, garlic or root vegetables — just flag it when booking so the kitchen can prepare it separately." },
        { q: "Is the wedding menu halal certified?", a: "Yes, fully halal certified, so it suits multicultural guest lists without a separate menu." },
        { q: "How far ahead should I book wedding catering?", a: "We recommend 2–4 weeks' notice. For larger weddings or a heavily customised menu, book earlier so we can plan properly." },
      ],
      relatedSlugs: ["wedding-catering-sydney-cbd", "best-wedding-caterers-sydney", "find-right-indian-catering-for-event"],
      ctaLabel: "Enquire About Wedding Catering",
      ctaHref: "/venue-catering",
      guideType: "normal",
      published: true,
    },

    // ============================================================
    // 2. wedding-catering-sydney-cbd — VENUE HIRE / LOGISTICS (NEW)
    // ============================================================
    {
      slug: "wedding-catering-sydney-cbd",
      title: "Wedding Venue Hire Sydney CBD — The Grand Palace, Up to 125 Guests",
      metaTitle: "Wedding Venue Sydney CBD — Up to 125 Guests",
      metaDescription: "Book The Grand Palace, Sydney CBD as your wedding venue — seats up to 125 guests, HACCP certified and Gold Licensed, plus catering at your own venue.",
      tag: "Events",
      publishedDate: TODAY_ISO,
      publishedDateDisplay: TODAY_DISPLAY,
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "The Grand Palace's Basement restaurant at 261 George Street seats up to 125 guests for wedding receptions — HACCP certified, Gold Licensed, with external venue catering also available.",
      intro: "Booking a wedding venue in Sydney CBD comes down to two questions: can the space actually hold your guest list, and can the kitchen back it up with proper food-safety credentials. The Grand Palace answers both — a palace-inspired dining room that seats up to 125 guests, backed by HACCP certification and a Gold Licensed catering accreditation, with the option to bring our team to an external venue instead.",
      quickAnswer: "The Grand Palace at Basement, 261 George Street seats up to 125 guests for wedding receptions in-house, is HACCP certified and Gold Licensed, and also provides external venue catering for weddings held elsewhere in Sydney. Book by calling ahead with your date and guest count — earlier for larger weddings.",
      heroImage: weddingCbdHeroUrl,
      heroImageAlt: "Table set with TGP-branded wine glasses and Indian dishes at The Grand Palace's private dining room, Sydney CBD",
      quickFacts: [
        { label: "Restaurant capacity", value: "Up to 125 guests" },
        { label: "Certification", value: "HACCP certified · Gold Licensed" },
        { label: "External catering", value: "Available at your chosen venue" },
        { label: "Location", value: "Basement, 261 George Street — near Wynyard Station" },
      ],
      sections: [
        {
          heading: "Why Book The Grand Palace as Your Wedding Venue",
          body: [
            "Venue credentials matter more for a wedding than almost any other event — this is the one day you can't afford a food-safety shortcut. The Grand Palace is HACCP certified, the internationally recognised food safety standard, and holds a Gold Licensed catering accreditation — neither of which is common among Sydney wedding venues.",
          ],
          bullets: [
            "HACCP certified — internationally recognised food safety standard",
            "Gold Licensed catering accreditation",
            "Fully halal-certified menu — every guest genuinely covered",
            "Palace-inspired interior — warm lighting and rich décor built for wedding photography",
          ],
          blockType: "text",
        },
        {
          heading: "Venue Options — At Our Restaurant or Yours",
          body: [],
          bulletItems: [
            { title: "At The Grand Palace, Sydney CBD", description: "Our Basement restaurant at 261 George Street seats up to 125 guests, a short walk from Wynyard Station and near Circular Quay. Nearby parking is available at Wilson Parking and Secure Parking." },
            { title: "External Venue Catering", description: "Holding your wedding somewhere else? We bring our kitchen team, service staff and professional coordination directly to your chosen venue instead." },
          ],
          blockType: "row",
        },
        {
          heading: "How Many Guests Can We Seat?",
          body: [
            "The restaurant comfortably seats up to 125 guests for a wedding reception or post-ceremony dinner — enough for a proper reception without losing the intimate, elegant feel that makes it work for smaller wedding parties too. For larger celebrations beyond that capacity, our team can talk through external venue catering options instead.",
          ],
          blockType: "text",
        },
        {
          heading: "Dietary Requirements — Every Guest Included",
          body: [
            "Share your guest list's dietary requirements when you book and we'll make sure every plate served is appropriate for every guest — vegetarian, vegan, Jain and allergen-specific needs are all handled as standard, not a special request.",
          ],
          blockType: "text",
        },
        {
          heading: "Booking Your Wedding Venue",
          body: [],
          bullets: [
            `Contact us — call ${contact.phone} or email ${contact.email} with your date and guest count`,
            "Choose your format — dine in at our restaurant or book external catering at your venue",
            "Confirm the details — menu, dietary requirements and final guest numbers",
          ],
          blockType: "box",
        },
      ],
      faq: [
        { q: "How many guests can The Grand Palace's restaurant hold for a wedding?", a: "Up to 125 guests at our Basement restaurant, 261 George Street, Sydney CBD." },
        { q: "What does HACCP certified mean for my wedding catering?", a: "HACCP is the internationally recognised food safety standard — it means our kitchen follows strict, audited processes for handling and preparing food, which matters most on the one day you can't risk getting it wrong." },
        { q: "Can The Grand Palace cater my wedding at a different venue?", a: "Yes — we provide external venue catering, bringing our kitchen team and service staff to your chosen location if you're not hosting at our restaurant." },
        { q: "How far in advance should I book the venue?", a: "We recommend at least 2–4 weeks' notice, and earlier for larger weddings or if you want a fully customised menu." },
      ],
      relatedSlugs: ["indian-wedding-catering-sydney", "private-event-venue-hire-sydney", "best-wedding-caterers-sydney"],
      ctaLabel: "Enquire About Venue Hire",
      ctaHref: "/venue-for-hire",
      guideType: "normal",
      published: true,
    },

    // ============================================================
    // 3. private-event-venue-hire-sydney
    // ============================================================
    {
      slug: "private-event-venue-hire-sydney",
      title: "Private Event Venue Hire in Sydney CBD — The Grand Palace",
      metaTitle: "Private Event Venue Hire Sydney CBD | TGP",
      metaDescription: "Hire The Grand Palace's elegant Sydney CBD dining room for birthdays, corporate events, engagements and private celebrations. Set menus from $40pp.",
      tag: "Events",
      publishedDate: TODAY_ISO,
      publishedDateDisplay: TODAY_DISPLAY,
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "A private event venue in Sydney CBD with real character — The Grand Palace hosts birthdays, corporate functions, engagements and special occasions, set menus from $40pp.",
      intro: "Most Sydney CBD function rooms feel the same — beige, generic, borrowed for the night. If you want a private event venue with an actual atmosphere, plus food your guests will still be talking about afterward, The Grand Palace at Basement, 261 George Street is built for exactly that.",
      quickAnswer: "The Grand Palace hires out its Sydney CBD dining room for birthdays, corporate functions, engagement parties and other private events, with set menus from $40pp and dietary accommodations for vegetarian, vegan and Jain guests. Contact the team with your date and guest count to check availability.",
      heroImage: EXISTING_BLOB.banquetHall2,
      heroImageAlt: "The Grand Palace's private dining room set up for an event in Sydney CBD",
      quickFacts: [
        { label: "Set menus from", value: "$40 per person" },
        { label: "Location", value: "Basement, 261 George Street, Sydney CBD" },
        { label: "Best for", value: "Birthdays · corporate · engagements · special occasions" },
      ],
      sections: [
        {
          heading: "Events We Host",
          body: [],
          bulletItems: [
            { title: "Birthday Celebrations", description: "Milestone birthdays, surprise parties and intimate dinners — including our $150 birthday package option." },
            { title: "Corporate Functions", description: "Team celebrations, client entertainment, end-of-year dinners and milestone corporate events." },
            { title: "Engagement Parties", description: "Celebrate an engagement in a romantic, elegant setting with an authentic Indian dining experience." },
            { title: "Special Occasions", description: "Anniversaries, farewells, family reunions and any occasion that deserves more than a generic function room." },
          ],
          blockType: "row",
        },
        {
          heading: "Why Choose The Grand Palace for a Private Event",
          body: [],
          bullets: [
            "One of the most distinctive Indian dining spaces in Sydney CBD, not a converted function room",
            "Genuinely authentic Indian fine dining that guests remember",
            "Customisable menus from $40pp, with vegetarian, vegan and Jain accommodation",
            "Central CBD location — easy for guests arriving by train, bus or taxi",
            "A dedicated events team that handles the details so you don't have to",
          ],
          blockType: "text",
        },
        {
          heading: "Booking Your Private Event",
          body: [],
          bullets: [
            `Contact us — call ${contact.phone} or email ${contact.email} with your date and guest count`,
            "Discuss your requirements — our team helps plan the menu and event setup",
            "Confirm your booking — secure the date with a deposit and we take it from there",
          ],
          blockType: "box",
        },
      ],
      faq: [
        { q: "Can I hire The Grand Palace for a private event?", a: `Yes — we host birthdays, corporate functions, engagements and other private events. Call ${contact.phone} to discuss.` },
        { q: "What's the minimum spend for a private event?", a: "Set menus start from $40 per person, with a premium $55pp option. Contact our team for group-specific pricing." },
        { q: "How many guests can you accommodate?", a: `Contact our team on ${contact.phone} with your guest count — we host groups of various sizes and can advise on the best setup.` },
        { q: "Can you accommodate dietary requirements for a private event?", a: "Yes — vegetarian, vegan and Jain (no onion/garlic) requirements are all accommodated with advance notice." },
      ],
      relatedSlugs: ["private-event-venue-hire-sydney-cbd", "best-birthday-venues-sydney-cbd", "find-right-indian-catering-for-event"],
      ctaLabel: "Enquire About Your Event",
      ctaHref: "/venue-for-hire",
      guideType: "normal",
      published: true,
    },

    // ============================================================
    // 4. mocktails-drinks-in-indian-food
    // ============================================================
    {
      slug: "mocktails-drinks-in-indian-food",
      title: "Best Mocktails to Pair with Indian Food — The Grand Palace, Sydney",
      metaTitle: "Best Mocktails to Pair with Indian Food | Sydney CBD",
      metaDescription: "From Aam Panna Soda to Mango Lassi — the best non-alcoholic drinks to pair with Indian food, all served at The Grand Palace, Sydney CBD.",
      tag: "Dining",
      publishedDate: "2025-04-01",
      publishedDateDisplay: "1 Apr 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Indian food is built on contrasts — heat and cool, rich and sharp. Here's how to pair it right with the mocktails and traditional drinks on the menu at The Grand Palace.",
      intro: "Indian food thrives on contrast — chilli heat against cooling yoghurt, rich curries against sharp citrus. Getting the drink right isn't just an extra, it changes how the meal actually tastes. Here's what to order alongside your food at The Grand Palace, a fully halal venue that pours no alcohol but doesn't skimp on flavour.",
      quickAnswer: "For spicy or rich Indian dishes, go cooling — Mango Lassi, Aam Panna Soda or a Cucumber Mint Cooler all tame heat and cut through cream-based curries. For lighter starters and tandoor dishes, the Virgin Mojito or Tropical Spa mocktail works well. All drinks at The Grand Palace are halal and non-alcoholic.",
      heroImage: EXISTING_BLOB.mocktails,
      heroImageAlt: "Drinks poured into TGP-branded glassware at The Grand Palace Indian Restaurant, Sydney CBD",
      sections: [
        {
          heading: "Why Drink Pairing Matters with Indian Food",
          body: [
            "Indian cooking is built on contrasts — heat and cool, rich and sharp, earthy and bright. A well-matched drink amplifies those contrasts instead of getting lost next to them.",
          ],
          bullets: [
            "Cool the heat — creamy lassi and mango-based drinks tame chilli",
            "Cut through richness — citrus-forward drinks cut through butter chicken or korma",
            "Refresh the palate — mint and cucumber mocktails reset your palate between dishes",
            "Echo the spice — jeera soda and chaas complement Indian spicing rather than fighting it",
          ],
          blockType: "text",
        },
        {
          heading: "Signature Mocktails",
          body: [],
          bulletItems: [
            { title: "Tropical Spa", description: "A bright, floral-noted fruit blend — one of the most photographed drinks on the menu. Pairs with the Tandoori Mixed Platter and Prawn Malai Curry." },
            { title: "Virgin Mojito (4 flavours)", description: "Classic, Strawberry, Lychee or Mango — fresh mint, lime and soda in every version. Pairs with Paneer Tikka, Butter Chicken and Seekh Kebab." },
            { title: "Virgin Blueberry Mule", description: "A ginger-forward twist on a Moscow Mule — blueberry, ginger beer and lime. The ginger cuts nicely through Lamb Rogan Josh or Chicken Tikka Masala." },
            { title: "Blue Pacific Paradise", description: "Vibrant, tropical and a genuine conversation starter on the table. Pairs with Dal Makhani, Malai Kofta or Vegetable Biryani." },
            { title: "Cucumber Mint Cooler", description: "Light and cooling — the go-to palate cleanser on warmer Sydney nights or alongside heavily spiced dishes." },
            { title: "Aam Panna Soda", description: "A refined take on the North Indian summer classic — raw mango, cumin, black salt and a touch of chilli over soda. Pairs with chaat, chole bhature and samosas." },
          ],
          blockType: "row",
        },
        {
          heading: "Classic Drinks & Traditional Favourites",
          body: [
            "Beyond the mocktail list, The Grand Palace pours a full range of soft drinks and traditional Indian beverages: Coke, Sprite and Lemon Lime & Bitters for something familiar; Soda Lime, Lime Mint Soda and Jeera (cumin) Soda for a more traditional pairing with dal and biryani; and three styles of lassi — Mango, Rose and Salty — India's classic cooling drink.",
          ],
          blockType: "text",
        },
      ],
      faq: [
        { q: "What drinks pair best with spicy Indian food?", a: "Cooling drinks work best — Mango Lassi, Aam Panna Soda, Cucumber Mint Cooler and Rose Lassi all help balance chilli heat." },
        { q: "Does The Grand Palace serve mocktails?", a: "Yes — Tropical Spa, Virgin Mojito (4 flavours), Virgin Blueberry Mule, Blue Pacific Paradise, Cucumber Mint Cooler and Aam Panna Soda are all on the menu." },
        { q: "Is Mango Lassi available at The Grand Palace?", a: "Yes, along with Rose Lassi and Salty Lassi — all pair well with rich curries and biryani." },
        { q: "Does The Grand Palace serve alcohol?", a: "No — The Grand Palace is a fully halal-certified venue and serves no alcohol. Every drink on the menu, including all mocktails, is non-alcoholic." },
      ],
      relatedSlugs: ["guide-to-indian-whisky-in-sydney", "best-indian-restaurant-sydney", "top-5-indian-dishes-sydney"],
      ctaLabel: "View Full Menu",
      ctaHref: "/menu",
      guideType: "normal",
      published: true,
    },

    // ============================================================
    // 5. jain-restaurants-in-sydney-no-onion-no-garlic
    // ============================================================
    {
      slug: "jain-restaurants-in-sydney-no-onion-no-garlic",
      title: "Jain Restaurants in Sydney — No Onion, No Garlic Indian Food",
      metaTitle: "Jain Restaurants Sydney — No Onion No Garlic",
      metaDescription: "Looking for genuine Jain food in Sydney? The Grand Palace prepares no onion, no garlic Indian dishes with advance notice at its Sydney CBD kitchen.",
      tag: "Dining",
      publishedDate: "2025-10-01",
      publishedDateDisplay: "1 Oct 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Most Sydney Indian restaurants build their base flavour on onion and garlic, which makes genuine Jain dining hard to find. Here's how The Grand Palace handles it properly.",
      intro: "Onion and garlic are the base of most Indian cooking, which is exactly why a genuinely Jain-friendly restaurant in Sydney is hard to find — a kitchen has to prepare dishes separately, not just leave an ingredient out on request. The Grand Palace's kitchen is set up to do this properly, with advance notice.",
      quickAnswer: "The Grand Palace, Sydney CBD prepares Jain-style dishes (no onion, garlic or, for stricter diets, root vegetables) across starters, mains, breads and desserts — Paneer Tikka, Dal Tadka, Aloo Gobi, Jeera Rice and more. Notify the team when booking so the kitchen can prepare it separately.",
      heroImage: EXISTING_BLOB.storefront,
      heroImageAlt: "The Grand Palace Indian Restaurant storefront on George Street, Sydney CBD",
      sections: [
        {
          heading: "What Is Jain Food?",
          body: [
            "Jain cuisine follows the principles of Jainism, which centres on non-violence (ahimsa) toward all living beings. In practice, that shapes what's on the plate.",
          ],
          bullets: [
            "No onion or garlic — believed to harm micro-organisms in the soil when harvested",
            "No root vegetables for stricter Jains — carrots, potatoes, beetroot and radish are traditionally avoided",
            "Always vegetarian or vegan — no meat, poultry or seafood",
            "Some also avoid leeks, spring onions and shallots, depending on level of practice",
          ],
          blockType: "text",
        },
        {
          heading: "Why Most Sydney Restaurants Can't Do Jain Properly",
          body: [
            "The problem isn't willingness, it's process. Onion and garlic form the base of most Indian gravies, so a kitchen without separate prep or a genuine understanding of Jain principles can't guarantee a truly Jain meal — \"no garlic on request\" often still means cross-contamination from a shared base sauce. Our kitchen team prepares Jain orders with entirely separate ingredients and process when given advance notice.",
          ],
          blockType: "text",
        },
        {
          heading: "What Jain Diners Can Order",
          body: [
            "With advance notice, our kitchen prepares a genuine range of Jain-friendly dishes:",
          ],
          bullets: [
            "Starters — Paneer Tikka (no onion in the marinade), Hara Bhara Kebab, Papadi/Papad, mint and coriander chutneys",
            "Mains — Dal Tadka, Aloo Gobi, Paneer in a tomato-based gravy, Palak Paneer, all made without onion or garlic",
            "Breads — Plain Naan, Butter Roti/Chapati, Laccha Paratha",
            "Rice & desserts — Jeera Rice, plain Basmati, Gulab Jamun, Kheer",
          ],
          blockType: "row",
        },
        {
          heading: "Tips for Jain Diners Eating Out in Sydney",
          body: [],
          bullets: [
            "Call ahead, not just at the table — the kitchen needs time to prepare separately",
            "Be specific about your level of practice — no onion/garlic only, or root vegetables too",
            "Ask whether the kitchen uses separate prep, not just a substitution on your plate",
            "When in doubt, simple dishes — plain dal, paneer, breads and rice — are the safest bet",
          ],
          blockType: "text",
        },
        {
          heading: "Booking a Jain Meal",
          body: [`Notify our team at the time of booking that you need a Jain meal. Call ${contact.phone} or email ${contact.email}.`],
          blockType: "box",
        },
      ],
      faq: [
        { q: "Are there Jain-friendly restaurants in Sydney CBD?", a: "The Grand Palace at 261 George Street, Sydney CBD offers customised Jain menus, no onion and no garlic, when notified in advance." },
        { q: "What can Jain diners order at The Grand Palace?", a: "Paneer Tikka, Dal Tadka, Aloo Gobi, Palak Paneer, Jeera Rice and plain breads can all be prepared Jain-style with advance notice." },
        { q: "Can I request no onion, no garlic at an Indian restaurant?", a: `Yes — call ${contact.phone} or email ${contact.email} ahead of your visit and our kitchen will prepare your dishes separately.` },
        { q: "Does the vegetarian menu work for Jain diners?", a: "Our vegetarian menu can be adapted for Jain requirements — our kitchen is experienced with the customisation. Just tell us when booking." },
      ],
      relatedSlugs: ["jain-restaurants-sydney", "best-vegetarian-restaurants-sydney", "best-vegan-restaurant-sydney"],
      ctaLabel: "View Menu",
      ctaHref: "/menu",
      guideType: "normal",
      published: true,
    },

    // ============================================================
    // 6. guide-to-indian-whisky-in-sydney — LIGHT TOUCH
    //    (core content already good; add hero image + quickAnswer +
    //    relatedSlugs, trim stray trailing whitespace, keep sections/faq)
    // ============================================================
    {
      slug: "guide-to-indian-whisky-in-sydney",
      // title/metaTitle/metaDescription/intro/sections/faq intentionally
      // left as-is except trimming stray trailing newlines — see LIGHT_TOUCH
      // merge logic in main().
      lightTouch: true,
      excerpt: "India's finest single malts — Amrut, Rampur and Indri — poured alongside authentic Indian food at The Grand Palace, Sydney CBD.",
      quickAnswer: "The Grand Palace, Basement 261 George Street, is the only Sydney CBD Indian restaurant pouring all three of India's most awarded whiskies — Amrut Fusion, Rampur Double Cask and Indri Triple Cask — from $18 a glass, alongside a full Indian menu.",
      heroImage: whiskyHeroUrl,
      heroImageAlt: "Bottles of Rampur, Indri and Amrut Indian whisky served with tandoori dishes at The Grand Palace, Sydney CBD",
      relatedSlugs: ["mocktails-drinks-in-indian-food", "best-indian-restaurant-sydney", "top-5-indian-dishes-sydney"],
    },

    // ============================================================
    // 7. find-right-indian-catering-for-event
    // ============================================================
    {
      slug: "find-right-indian-catering-for-event",
      title: "How to Choose the Right Indian Catering in Sydney for Your Event",
      metaTitle: "How to Choose Indian Catering in Sydney",
      metaDescription: "A practical 6-step guide to choosing Indian catering in Sydney — event type, guest dietary needs, serving formats, caterer credentials and more.",
      tag: "Catering",
      publishedDate: "2025-06-01",
      publishedDateDisplay: "1 June 2025",
      updatedDate: TODAY_ISO,
      updatedDateDisplay: TODAY_DISPLAY,
      excerpt: "Your choice of caterer shapes the whole event. Here's a practical, step-by-step way to choose the right Indian caterer in Sydney — and where The Grand Palace fits in.",
      intro: "The venue and guest list get most of the planning attention, but the caterer is what guests actually remember afterward. Indian cuisine's range — vegetarian, non-vegetarian, regional, mild to bold — makes it a strong fit for Sydney's multicultural events, provided you choose the right partner. Here's how to do that properly.",
      quickAnswer: "Match the caterer to your event type, confirm they can handle your guests' full range of dietary needs in one menu (vegetarian, vegan, Jain, halal), pick a serving format that suits your event size, and check their credentials — food safety certification, a track record, and licensing where relevant. The Grand Palace covers all of this from 20-guest private dinners to 300-guest weddings.",
      heroImage: EXISTING_BLOB.cateringSetup,
      heroImageAlt: "Indian catering buffet setup with chafing dishes ready for a private event in Sydney",
      sections: [
        {
          heading: "1. Understand the Nature of Your Event",
          body: ["Every event type comes with different expectations, so start here:"],
          bullets: [
            "Weddings — elaborate menus, multiple courses, presentation, halal and Jain options",
            "Corporate events — professionalism, timeliness, clear dietary labelling, buffet or box formats",
            "Birthdays & anniversaries — interactive stations, vibrant dishes, personal touches",
            "Private gatherings — drop-off meals, smaller buffets, customisable menus",
          ],
          blockType: "text",
        },
        {
          heading: "2. Know Your Guest List's Preferences",
          body: ["Good catering is about inclusivity as much as taste:"],
          bullets: [
            "Vegetarian and vegan guests — dal tadka, baingan masala, paneer tikka, vegetable biryani",
            "Jain and gluten-free needs — careful ingredient choices, separate preparation",
            "Elderly guests and children — milder options like khichdi, soft rotis and gently spiced curries",
            "Halal requirements — a fully halal-certified menu covers this without a separate plan",
          ],
          blockType: "text",
        },
        {
          heading: "3. Choose the Right Serving Format",
          body: [],
          bulletItems: [
            { title: "Plated service", description: "Best for formal dinners, weddings and pre-arranged courses." },
            { title: "Buffet service", description: "Suits mid-to-large events where variety and pacing matter." },
            { title: "Live food stations", description: "Chaat, dosa, tandoori kebabs and dessert stations for an interactive event." },
            { title: "Individual catering boxes", description: "The simplest option for office lunches and casual events." },
          ],
          blockType: "row",
        },
        {
          heading: "4. Check the Caterer's Experience and Credentials",
          body: [
            "Look for years of experience across event types, food safety certification, a real portfolio of past events, and relevant licensing. The Grand Palace has catered hundreds of events from a Gold Licensed venue at Basement, 261 George Street.",
          ],
          blockType: "text",
        },
        {
          heading: "5. Ask About Tastings and Customisation",
          body: [
            "A good caterer offers tasting sessions before the event, custom menu planning around your theme and guest profile, and thematic menus (regional Indian, fusion, or occasion-specific for Diwali, Eid, Christmas).",
          ],
          blockType: "text",
        },
        {
          heading: "6. Review Logistics and Operational Capacity",
          body: [
            "Even a great menu falls flat with poor execution. Confirm on-time delivery and setup, professional serving staff, equipment provision and cleanup, and scalability from small dinners to large functions.",
          ],
          blockType: "text",
        },
        {
          heading: "Why Clients Choose The Grand Palace",
          body: [],
          bullets: [
            "Tailored menus across event types and cultural preferences",
            "Scalable from 20-guest private dinners to 300-guest weddings",
            "Gold Licensed venue with full halal certification",
            "Vegetarian, vegan, Jain, gluten-free and halal all accommodated in one menu",
          ],
          image: EXISTING_BLOB.cateringBanner,
          imageAlt: "Chafing dishes of freshly prepared Indian catering food set up for a Sydney event",
          blockType: "text",
        },
      ],
      faq: [
        { q: "What events can Indian catering suit?", a: "Weddings, corporate functions, birthdays, private dinners and cultural events. The Grand Palace caters from 20 to 300 guests." },
        { q: "Does The Grand Palace offer halal catering?", a: "Yes, fully halal certified, and able to accommodate vegetarian, vegan, Jain and gluten-free requirements within the same event." },
        { q: "What's the minimum charge for event catering?", a: "$35 per adult and $25 for children aged 5–10. Contact the team to discuss a custom package for your event." },
        { q: "What catering formats are available?", a: "Plated service, buffet service, live food stations, and individual catering boxes — all customisable to your event and guest count." },
      ],
      relatedSlugs: ["indian-wedding-catering-sydney", "corporate-catering-in-sydney-at-tgp", "private-event-venue-hire-sydney"],
      ctaLabel: "Enquire Now",
      ctaHref: "/venue-catering",
      guideType: "normal",
      published: true,
    },
  ];
}

async function main() {
  const guides = await buildGuides();

  for (const guideData of guides) {
    const { slug, lightTouch, ...data } = guideData;
    process.stdout.write(`Upserting ${slug} ... `);

    if (lightTouch) {
      // Guide 6: merge onto the existing row, trim stray whitespace on the
      // fields the earlier session left with trailing newlines, and only
      // add what's genuinely missing.
      const existing = await prisma.guide.findUnique({ where: { slug } });
      if (!existing) throw new Error(`Expected existing row for ${slug} (light-touch guide) but none found`);
      const update = {
        title: (existing.title || "").trim(),
        metaTitle: (existing.metaTitle || "").trim(),
        metaDescription: (existing.metaDescription || "").trim(),
        excerpt: existing.excerpt || data.excerpt,
        quickAnswer: existing.quickAnswer || data.quickAnswer,
        heroImage: data.heroImage,
        heroImageAlt: data.heroImageAlt,
        relatedSlugs: (existing.relatedSlugs && existing.relatedSlugs.length) ? existing.relatedSlugs : data.relatedSlugs,
        updatedDate: TODAY_ISO,
        updatedDateDisplay: TODAY_DISPLAY,
      };
      await prisma.guide.update({ where: { slug }, data: update });
      console.log("OK (light touch)");
      continue;
    }

    await prisma.guide.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
    console.log("OK");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
