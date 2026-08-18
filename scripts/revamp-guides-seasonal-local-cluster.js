// Substantial rewrite of 8 Guide rows that were previously migrated verbatim
// from the old blog-art deployment (vercel-deploy-jade-five.vercel.app).
// Client rejected the verbatim copy; this script replaces it with rewritten,
// de-duplicated copy (guides 2 vs 3 and 7 vs 8 deliberately kept distinct —
// see task notes) and re-uploads the real content photos found on each
// source page (skipping decorative chrome) to Vercel Blob. Facts (address,
// phone, pricing, hours, walking directions) are taken from the source pages
// and, for the Wynyard guide, cross-checked against the hand-written
// palace-art-reimagined-main/src/lib/guidesContent.tsx entry for the same
// slug, which has more precise walking directions (1 min via MetCentre vs
// the old source's "5 minutes"). Safe to re-run — upserts by slug, re-uploads
// images each run (blob URLs get random suffixes; old blobs are orphaned).
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

const ORDER_ONLINE_URL = "https://the-grand-palace-indian-restaurant.square.site/";

// Real content images referenced by these 8 source pages (decorative chrome
// like assets/logo-full.jpg / assets/mandala.png already excluded). Some
// images are reused across multiple source pages in the original site —
// that's the real inventory available, not an extraction error.
const IMAGES = {
  restaurantInterior: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/04/Untitled-1.png",
  diwaliSpread: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/08/sla09455_54709243175_l.jpg",
  christmasBox: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/10/SLA09455.jpg",
  // Blog-image-2-1024x683.jpg (the source page's og:image for this guide) has
  // been removed from the live WordPress media library since the blog-art
  // snapshot was taken — 404s on fetch. Falls back to the restaurant-interior
  // photo, the only other real image available for this guide.
  christmasDining: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/04/Untitled-1.png",
  deliveryDishes: "https://www.thegrandpalace.com.au/wp-content/uploads/2026/04/Best-Indian-Restaurant-Near-Me-in-Sydney-CBD-—-The-Grand-Palace-Guide.jpg",
  officeLunchBox: "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/SLA09455.jpg",
};

const guides = [
  // 1 — Diwali (Events, dine-in)
  {
    slug: "why-tgp-is-best-for-diwali-party",
    title: "Why The Grand Palace Is Sydney's Top Choice for a Diwali Party",
    metaTitle: "Diwali Party Venue Sydney CBD — The Grand Palace",
    metaDescription: "Host your Diwali party at The Grand Palace, Sydney CBD — halal-certified Indian menus, groups of 20–300, Gold Licensed, 1 minute from Wynyard Station.",
    tag: "Events",
    publishedDate: "2026-04-10",
    publishedDateDisplay: "Apr 10, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "Diwali deserves more than a home-cooked dinner — The Grand Palace hosts family, community and corporate Diwali celebrations in the heart of Sydney CBD.",
    intro: `Diwali is about togetherness as much as it's about food, and finding a Sydney CBD venue that can genuinely host that — large groups, a proper festive menu, and a room that feels like an occasion — narrows the list quickly. The Grand Palace, in the basement at ${contact.address}, has become the regular choice for Sydney's Indian community, corporate teams and families looking for exactly that combination.`,
    quickAnswer: "The Grand Palace hosts Diwali parties for groups of 20 to 300 in its Sydney CBD dining room, one minute from Wynyard Station, with halal-certified set menus from $40 per person and a full Gold Licence for festive drinks. Catering boxes are also available separately for home or office Diwali gatherings.",
    quickFacts: [
      { label: "Group size", value: "20–300 guests" },
      { label: "Set menus", value: "$40pp or $55pp" },
      { label: "Advance booking", value: "2–4 weeks recommended in Diwali season" },
    ],
    heroImage: IMAGES.restaurantInterior,
    heroImageAlt: "Elegant basement dining room at The Grand Palace, set up for a Diwali celebration in Sydney CBD",
    sections: [
      {
        heading: "A Diwali Venue Built for the Whole Celebration",
        body: [
          "Diwali groups at The Grand Palace range from intimate family dinners to large community and corporate bookings, and the room is set up to handle both without feeling stretched either way.",
        ],
        bullets: [
          "Capacity for 20–300 guests, from a family table to a full community event",
          "Fully halal-certified menu, so every guest can dine without a second thought",
          "Gold Licensed venue — wine, beer and cocktails available for the toast",
          "Set menus at $40pp or $55pp covering entrées, mains and accompaniments",
          "1-minute walk from Wynyard Station, easy for guests arriving from across Sydney",
        ],
        blockType: "row",
      },
      {
        heading: "Planning Your Booking",
        body: [
          "Diwali is one of the busiest periods of the year at The Grand Palace, so a little advance planning goes a long way.",
        ],
        bullets: [
          "Book 2–4 weeks ahead to secure your preferred date and time",
          "Decide between the $40pp or $55pp set menu early, or discuss a custom group menu",
          "Flag vegetarian, vegan or allergy requirements at the time of booking",
          "If you're also celebrating at home or the office, catering boxes can be ordered alongside your dine-in booking",
        ],
      },
      {
        heading: "Diwali Catering Boxes for Home or Office",
        body: [
          "Not every Diwali celebration happens at a restaurant table. For families and offices celebrating elsewhere, The Grand Palace's catering boxes bring the same kitchen's food to your own gathering.",
        ],
        bulletItems: [
          { title: "Vegetarian Box — $75", description: "5 freshly made Indian rolls, prepared the same day — a good fit for vegetarian guests and mixed groups alike." },
          { title: "Non-Vegetarian Box — $85", description: "5 freshly made rolls using fully halal-certified meat, rich and festive." },
        ],
        image: IMAGES.diwaliSpread,
        imageAlt: "Freshly prepared Indian catering rolls from The Grand Palace, ready for a Diwali gathering",
      },
      {
        heading: "Family and Corporate Diwali Groups",
        body: [
          "For families, the minimum charge of $35 per adult and $25 per child (ages 5–10) keeps a multi-generational Diwali dinner accessible without cutting corners on the menu.",
          "For corporate teams, hosting Diwali is an increasingly common way to mark cultural diversity in the workplace — the private dining capacity and Gold Licence make it straightforward to run a proper end-of-day celebration rather than an office morning tea.",
        ],
      },
      {
        heading: "How to Book",
        body: [
          `Call ${contact.phone} or email ${contact.email} for group Diwali bookings — our team can talk through menu format and timing directly. Standard table bookings can also be made through our online booking form.`,
        ],
        blockType: "box",
      },
    ],
    faq: [
      { q: "How far ahead should I book a Diwali party at The Grand Palace?", a: "2–4 weeks is recommended — Diwali is one of our busiest periods of the year and preferred dates fill quickly." },
      { q: "Can The Grand Palace host a large Diwali celebration?", a: "Yes — we accommodate groups from 20 up to 300 guests, from an intimate family dinner to a large community event." },
      { q: "Is the Diwali menu halal certified?", a: "Yes, the entire menu is halal-certified, so every guest at your Diwali celebration can dine with confidence." },
      { q: "Can I order Diwali catering instead of dining in?", a: `Yes — Vegetarian ($75) and Non-Vegetarian ($85) catering boxes of 5 freshly made rolls are available to order separately for home or office Diwali gatherings. Call ${contact.phone} to arrange.` },
    ],
    relatedSlugs: ["why-tgp-best-for-christmas-lunch-and-dinner", "catering-boxes-in-sydney-for-parties", "best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide"],
    ctaLabel: "Book Your Diwali Table",
    ctaHref: "/book-a-table",
  },

  // 2 — Christmas corporate catering box (Catering, pickup boxes for office)
  {
    slug: "christmas-corporate-catering-box-by-tgp",
    title: "Christmas Corporate Catering Boxes — Office Christmas Parties, Sorted",
    metaTitle: "Christmas Corporate Catering Boxes Sydney CBD | TGP",
    metaDescription: "Halal-certified Christmas catering boxes for Sydney offices — Veg $75, Non-veg $85, 5 rolls each, fresh same-day pickup from 261 George Street. Order ahead.",
    tag: "Catering",
    publishedDate: "2026-05-15",
    publishedDateDisplay: "May 15, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "No dine-in booking, no cleanup — The Grand Palace's Christmas catering boxes bring restaurant-quality Indian food straight to your office party.",
    intro: "Office Christmas catering has one hard requirement: food that satisfies a genuinely mixed team — vegetarians, halal-observant colleagues, and everyone in between — without anyone getting the sad side salad. The Grand Palace's Christmas catering box format was built around exactly that problem: two clearly priced, fully halal-certified boxes that arrive ready to open on a boardroom table.",
    quickAnswer: "For Christmas office catering in Sydney CBD, The Grand Palace's platter boxes are $75 (vegetarian) and $85 (non-vegetarian), each with 5 freshly made Indian rolls, fully halal certified, with pickup from 261 George Street. Orders of 10 or more boxes need 24 hours' notice.",
    quickFacts: [
      { label: "Veg Platter Box", value: "$75 — 5 rolls" },
      { label: "Non-Veg Platter Box", value: "$85 — 5 rolls" },
      { label: "Advance notice", value: "24 hrs+ for orders of 10 or more boxes" },
    ],
    heroImage: IMAGES.christmasBox,
    heroImageAlt: "Christmas corporate catering platter box from The Grand Palace, ready for office pickup",
    sections: [
      {
        heading: "A Catering Format Built for the Office, Not the Dining Room",
        body: [
          `Each box is prepared fresh on the day of collection at our ${contact.address} kitchen — this is a pickup catering box, not a dine-in booking, so there's no serving staff, table setting or cleanup to plan around. Open the box, lay the rolls out, done.`,
        ],
        bullets: [
          "100% halal certified across both box options",
          "Prepared fresh on the day, not pre-packaged or frozen",
          "Transparent pricing — Veg $75, Non-Veg $85, no hidden charges",
          "Bulk ordering from 5 boxes up to 200+ for larger teams",
        ],
      },
      {
        heading: "Veg Platter Box ($75) — What's Inside",
        body: [],
        bulletItems: [
          { title: "Paneer Tikka Roll", description: "Smoky tandoor-grilled cottage cheese, wrapped with fresh herbs and green chutney." },
          { title: "Malai Soya Chaap Roll", description: "Soya chaap marinated in a rich malai (cream) sauce — mild and creamy." },
          { title: "Hara Bhara Roll", description: "Spinach, peas and spiced vegetables — a lighter, herbaceous option." },
          { title: "Samosa Chaat Roll", description: "The classic samosa reworked into roll form, with tangy tamarind chutney." },
          { title: "Mirchi Vada Roll", description: "A stuffed chilli roll for anyone at the table who wants some heat." },
        ],
      },
      {
        heading: "Non-Veg Platter Box ($85) — What's Inside",
        body: ["All meat used across the Non-Veg box is halal certified."],
        bulletItems: [
          { title: "Butter Chicken Roll", description: "Slow-cooked chicken in a rich, velvety butter masala sauce." },
          { title: "Rogan Josh Roll", description: "Aromatic slow-cooked lamb in a Kashmiri-style sauce." },
          { title: "Kadhai Chicken Roll", description: "Wok-cooked chicken with capsicum, tomato and whole spices." },
          { title: "Chicken 65 Roll", description: "Crispy South Indian-style spiced fried chicken." },
          { title: "Seekh Kebab Roll", description: "Tandoor-grilled minced lamb or chicken skewers, wrapped fresh." },
        ],
      },
      {
        heading: "Mixing Boxes for a Diverse Team",
        body: [
          "You can order any combination of Veg and Non-Veg boxes in the one order — most Sydney CBD offices mix and match based on their team's split.",
        ],
        bullets: [
          `Lead time: 24 hours' notice for orders of 10 or more boxes; call ahead in peak December weeks`,
          "Bulk orders: comfortably scale from a 5-box team lunch to a 200+ box office event",
          `Dietary questions: call ${contact.phone} for allergen information before ordering`,
        ],
        blockType: "box",
      },
      {
        heading: "Ordering for Your Office Christmas Party",
        body: [],
        bullets: [
          "Count your team and work out roughly 1 box per 2–3 people",
          "Decide the Veg/Non-Veg split for your order",
          `Call ${contact.phone} or email ${contact.email} to place the order`,
          `Confirm your collection time from ${contact.address}`,
        ],
      },
    ],
    faq: [
      { q: "How much do Christmas corporate catering boxes cost?", a: "Veg boxes are $75 and Non-Veg boxes are $85, each with 5 freshly made rolls." },
      { q: "How far ahead do I need to order for a large office party?", a: "Orders of 10 or more boxes need at least 24 hours' notice. In peak December weeks, ordering a few days ahead is safer." },
      { q: "Are the Christmas catering boxes halal?", a: "Yes — all meat used in the Non-Veg box is halal certified, and the format works well for mixed-dietary offices." },
      { q: "Can I order a mix of veg and non-veg boxes for my team?", a: "Yes — order any combination of Veg ($75) and Non-Veg ($85) boxes in a single order." },
    ],
    relatedSlugs: ["why-tgp-best-for-christmas-lunch-and-dinner", "how-to-plan-office-lunch-catering-in-sydney", "catering-boxes-in-sydney-for-parties"],
    ctaLabel: "Order Christmas Catering Boxes",
    ctaHref: "/office-catering",
  },

  // 3 — Christmas lunch & dinner (Events, dine-in)
  {
    slug: "why-tgp-best-for-christmas-lunch-and-dinner",
    title: "Why The Grand Palace Is Sydney's Best Choice for Christmas Lunch & Dinner",
    metaTitle: "Christmas Lunch & Dinner Restaurant Sydney CBD | TGP",
    metaDescription: "The Grand Palace is open Christmas Day for lunch and dinner in Sydney CBD — Indian fine dining, set menus from $40pp. Book 3–4 weeks ahead.",
    tag: "Events",
    publishedDate: "2026-04-10",
    publishedDateDisplay: "Apr 10, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "Skip the traditional roast — The Grand Palace is open Christmas Day for a sit-down Indian lunch and dinner in the heart of Sydney CBD.",
    intro: `The Grand Palace stays open through Christmas Day, serving lunch and dinner to families, friends and colleagues who want something other than the usual roast. It's a genuine dine-in booking — table service, full menu, festive room — at ${contact.address}.`,
    quickAnswer: "The Grand Palace is open for dine-in Christmas lunch (12pm–3pm) and dinner (5pm–10pm) at its Sydney CBD dining room, with set menus from $40 per person and full à la carte. A 10% public holiday surcharge applies on the day, and tables typically sell out 3–4 weeks in advance.",
    quickFacts: [
      { label: "Christmas lunch", value: "12:00pm – 3:00pm" },
      { label: "Christmas dinner", value: "5:00pm – 10:00pm" },
      { label: "Public holiday surcharge", value: "10% on Christmas Day" },
    ],
    heroImage: IMAGES.christmasDining,
    heroImageAlt: "Festively set dining room at The Grand Palace, Sydney CBD, on Christmas Day",
    sections: [
      {
        heading: "Yes, We're Open on Christmas Day",
        body: [
          "The Grand Palace trades as normal on Christmas Day for both lunch and dinner. A 10% public holiday surcharge applies, and given how quickly Christmas Day tables fill, booking ahead isn't optional if you want a specific time.",
        ],
        blockType: "box",
      },
      {
        heading: "An Indian Christmas Feast Instead of the Usual Roast",
        body: [
          "For families and groups who'd rather not do turkey and gravy again, a proper Indian fine dining Christmas is a genuine change of pace — bold, warming flavours in a dining room set up to feel like an occasion, not a fallback.",
        ],
        bullets: [
          "Set menus from $40pp for straightforward group dining",
          "Vegetarian, vegan, Jain and gluten-free options across the menu",
          "Suits family gatherings, friend groups and corporate Christmas dinners alike",
        ],
      },
      {
        heading: "What's on the Christmas Menu",
        body: ["The full menu runs on Christmas Day, spanning starters through to dessert."],
        bullets: [
          "Starters — Paneer Tikka, Seekh Kebab, Samosa Chaat, Hara Bhara Kebab",
          "Mains — Butter Chicken, Dal Makhani, Rogan Josh, Kadhai Paneer",
          "Biryani & breads — Chicken Biryani, Vegetable Biryani, Garlic Naan, Laccha Paratha",
          "Desserts & drinks — Gulab Jamun, Kheer, Kulfi, Mango Lassi",
        ],
      },
      {
        heading: "Booking Early Matters",
        body: [
          `Christmas is one of our busiest dining days of the year — we recommend booking 3–4 weeks ahead to lock in your preferred lunch or dinner time. Book online, call ${contact.phone}, or email ${contact.email} for larger groups.`,
        ],
      },
    ],
    faq: [
      { q: "Is The Grand Palace open on Christmas Day?", a: "Yes — for both lunch (12pm–3pm) and dinner (5pm–10pm). A 10% public holiday surcharge applies on the day." },
      { q: "How far ahead should I book Christmas lunch or dinner?", a: "3–4 weeks ahead is recommended — Christmas Day tables at The Grand Palace typically sell out well before December." },
      { q: "What's on the Christmas Day menu?", a: "The full à la carte menu runs as normal, plus set menus from $40pp, spanning starters, mains, biryani, breads and desserts." },
      { q: "Can The Grand Palace seat a large family or corporate Christmas group?", a: "Yes — the dining room suits family gatherings and corporate Christmas dinners, and set menus simplify ordering for larger tables." },
    ],
    relatedSlugs: ["christmas-corporate-catering-box-by-tgp", "why-tgp-is-best-for-diwali-party", "tgp-is-best-for-a-weekend-indian-lunch"],
    ctaLabel: "Book Your Christmas Table",
    ctaHref: "/book-a-table",
  },

  // 4 — Best Indian restaurant near me (Local)
  {
    slug: "best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide",
    title: "Best Indian Restaurant Near Me in Sydney CBD — The Grand Palace Guide",
    metaTitle: "Best Indian Restaurant Near Me Sydney CBD | TGP Guide",
    metaDescription: "Searching for the best Indian restaurant near you in Sydney CBD? The Grand Palace at 261 George Street — authentic menu, dietary flexibility, open daily.",
    tag: "Local",
    publishedDate: "2026-04-01",
    publishedDateDisplay: "Apr 1, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "A practical guide to finding and visiting Sydney CBD's full-service Indian restaurant — The Grand Palace at 261 George Street.",
    intro: `"Best Indian restaurant near me" in Sydney CBD tends to lead back to the same place: The Grand Palace, at ${contact.address}. Here's what's actually behind that — location, menu, dietary coverage, and the occasions it suits — so you can judge for yourself rather than take our word for it.`,
    quickAnswer: "The Grand Palace at Basement, 261 George Street is Sydney CBD's full-service Indian restaurant — about 5 minutes from Wynyard Station, open daily for lunch and dinner, with set menus from $40 per person and vegetarian, vegan, halal and Jain options across the menu.",
    quickFacts: [
      { label: "From Wynyard Station", value: "~5 minutes walk (George Street exit, south)" },
      { label: "From Circular Quay", value: "~8 minutes walk" },
      { label: "From Martin Place", value: "~10 minutes walk" },
    ],
    heroImage: IMAGES.restaurantInterior,
    heroImageAlt: "Interior of The Grand Palace, an Indian restaurant on George Street, Sydney CBD",
    sections: [
      {
        heading: "Where to Find The Grand Palace",
        body: [`${contact.address} — in the CBD's financial and business district, accessible by multiple bus routes along George Street.`],
        bullets: [
          "~5 minutes walk from Wynyard Station (George Street exit, walk south)",
          "~8 minutes walk from Circular Quay",
          "~10 minutes walk from Martin Place",
        ],
        address: contact.address,
      },
      {
        heading: "What Actually Sets It Apart",
        body: [],
        bulletItems: [
          { title: "Authentic Recipes", description: "Traditional Indian spice blends and cooking techniques, not a simplified tourist menu." },
          { title: "A Proper Dining Room", description: "An elegantly designed interior suited to everything from a work lunch to a birthday dinner." },
          { title: "Full Menu, Every Day", description: "Lunch (12–3pm) and dinner (5pm+) daily. Set menus from $40pp, à la carte, and catering boxes." },
          { title: "Genuine Dietary Coverage", description: "Vegetarian and vegan dishes throughout, Jain (no onion/garlic) on request, gluten-free guidance available." },
        ],
      },
      {
        heading: "What Regulars Order",
        body: [],
        bullets: [
          "Tandoor — Paneer Tikka, Seekh Kebab, Tandoori Chicken",
          "Curries — Butter Chicken, Dal Makhani, Rogan Josh",
          "Specials — Chicken Biryani, catering boxes, set menus from $40pp",
        ],
      },
      {
        heading: "Occasions It Suits",
        body: [],
        bullets: [
          "Birthday dinners — $150 birthday package with a personalised cake",
          "Corporate lunches — set menus, catering boxes, group bookings",
          "Family gatherings — a menu broad enough for the whole table",
          "Date night — a proper fine-dining setting",
          "Weekend lunch — relaxed service, every Saturday and Sunday",
        ],
      },
    ],
    faq: [
      { q: "What is the best Indian restaurant in Sydney CBD?", a: `The Grand Palace at ${contact.address} — a full-service Indian fine dining restaurant open daily, roughly 5 minutes from Wynyard Station.` },
      { q: "Where exactly is The Grand Palace?", a: `${contact.address} — about 5 minutes from Wynyard Station and 8 minutes from Circular Quay.` },
      { q: "What makes it stand out from other Indian restaurants nearby?", a: "Authentic recipes, a proper dining room, a full menu daily for lunch and dinner, genuine dietary flexibility, and dedicated packages for birthdays and events." },
      { q: "How do I book?", a: `Book online, or call ${contact.phone}. Booking ahead is recommended for dinner and weekend lunch.` },
    ],
    relatedSlugs: ["indian-restaurant-near-wynyard-station-sydney", "indian-food-delivery-sydney-cbd", "tgp-is-best-for-a-weekend-indian-lunch"],
    ctaLabel: "Book a Table",
    ctaHref: "/book-a-table",
  },

  // 5 — Indian food delivery (Dining, order-online CTA)
  {
    slug: "indian-food-delivery-sydney-cbd",
    title: "Indian Food Delivery Sydney CBD — Ordering from The Grand Palace",
    metaTitle: "Indian Food Delivery Sydney CBD | The Grand Palace",
    metaDescription: "Order Indian food online for pickup at The Grand Palace, Sydney CBD, with CBD delivery available on request. Best dishes, catering boxes, how to order.",
    tag: "Dining",
    publishedDate: "2026-04-20",
    publishedDateDisplay: "Apr 20, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "Ordering Indian food from The Grand Palace works differently to an app-based delivery service — here's how pickup, online ordering and CBD delivery actually work.",
    intro: `Worth being upfront about: The Grand Palace isn't set up like a food-delivery app. Orders go through our own online ordering system for pickup at ${contact.address}, with CBD delivery arranged directly for an added fee rather than instant app-based delivery. Here's exactly how it works, and what to order.`,
    quickAnswer: "The Grand Palace takes orders online for pickup from 261 George Street, one minute from Wynyard Station, with CBD delivery available on request for an added fee. Catering boxes ($75 veg / $85 non-veg) are the simplest option for office team orders.",
    quickFacts: [
      { label: "Location", value: "1 minute walk from Wynyard Station" },
      { label: "Ordering", value: "Online (Square) for pickup, or call ahead" },
      { label: "CBD delivery", value: "Available on request, additional fee applies" },
    ],
    heroImage: IMAGES.deliveryDishes,
    heroImageAlt: "Indian dishes from The Grand Palace prepared for pickup order, Sydney CBD",
    sections: [
      {
        heading: "How Ordering Actually Works",
        body: [
          "Most orders are placed online for pickup, with the kitchen preparing everything fresh during lunch and dinner service. If you need it brought to you, CBD delivery can be arranged directly with our team for an additional fee — it isn't an instant on-demand delivery service.",
        ],
        bullets: [
          "Halal certified — the full menu is prepared to strict halal standards",
          "Central location — one minute from Wynyard Station, easy for pickup",
          "Catering boxes for offices — pre-packaged Veg ($75) and Non-Veg ($85) boxes",
          "Online ordering via our Square site, with pickup during lunch and dinner hours",
        ],
      },
      {
        heading: "Best Dishes to Order",
        body: ["These hold up well for pickup and travel, and cover the range of what the kitchen does best."],
        bulletItems: [
          { title: "Butter Chicken", description: "Tender chicken in a velvety tomato, cream and butter sauce — mild and universally popular." },
          { title: "Dal Makhani", description: "Slow-cooked black lentils and kidney beans in a rich, buttery sauce." },
          { title: "Lamb Biryani", description: "Fragrant basmati rice layered with slow-cooked lamb and caramelised onions — a meal on its own." },
          { title: "Paneer Tikka", description: "Yoghurt-and-spice marinated cottage cheese, tandoor-grilled." },
          { title: "Seekh Kebab", description: "Hand-shaped minced lamb kebabs, grilled on skewers." },
        ],
      },
      {
        heading: "Worth Adding to the Order",
        body: [],
        bullets: [
          "Samosa — crisp pastry filled with spiced potato and peas",
          "Aloo Tikki — pan-fried potato patties with cumin and chaat masala",
          "Garlic Naan — order generously for a group",
          "Papadums with chutney — mint, tamarind and mango",
        ],
      },
      {
        heading: "Catering Boxes for Office Orders",
        body: [
          "For a team order, catering boxes remove the guesswork — no plates, no serving equipment, just rolls ready to eat.",
        ],
        bullets: [
          "Vegetarian Box — $75 (5 rolls: Paneer Tikka, Malai Soya Chaap, Hara Bhara, Samosa Chaat, Mirchi Vada)",
          "Non-Vegetarian Box — $85 (5 rolls: Butter Chicken, Rogan Josh, Kadhai Chicken, Chicken 65, Seekh Kebab)",
          "Order at least 24 hours ahead; 48 hours for 10+ boxes",
        ],
      },
      {
        heading: "How to Place an Order",
        body: [],
        bullets: [
          `Order online at [the-grand-palace-indian-restaurant.square.site](${ORDER_ONLINE_URL}) for pickup, or to ask about CBD delivery`,
          `Call ${contact.phone} during lunch (12–3pm) or dinner (5–10pm)`,
          `Email ${contact.email} for large or corporate orders`,
          `Walk in to ${contact.address} during service hours`,
        ],
      },
    ],
    faq: [
      { q: "Does The Grand Palace deliver in Sydney CBD?", a: "Orders are primarily online for pickup. CBD delivery can be arranged directly with our team for an additional fee — it isn't an on-demand app delivery service." },
      { q: "What are the best dishes to order?", a: "Butter Chicken, Dal Makhani, Lamb Biryani, Paneer Tikka and Seekh Kebab are the most popular, and all hold up well for pickup." },
      { q: "Can I order catering boxes for the office?", a: "Yes — Veg ($75) and Non-Veg ($85) boxes with 5 rolls each, ordered at least 24 hours ahead (48 hours for 10+ boxes)." },
      { q: "How do I place an order?", a: `Order online via our Square site, call ${contact.phone}, or email ${contact.email} for larger orders.` },
    ],
    relatedSlugs: ["how-to-plan-office-lunch-catering-in-sydney", "best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide", "indian-restaurant-near-wynyard-station-sydney"],
    ctaLabel: "Order Online",
    ctaHref: ORDER_ONLINE_URL,
  },

  // 6 — Near Wynyard Station (Local)
  {
    slug: "indian-restaurant-near-wynyard-station-sydney",
    title: "Indian Restaurant Near Wynyard Station, Sydney CBD — The Grand Palace",
    metaTitle: "Indian Restaurant Near Wynyard Station Sydney | TGP",
    metaDescription: "The Grand Palace is a 1-minute walk from Wynyard Station via the MetCentre — Indian fine dining at 261 George Street, Sydney CBD, open daily.",
    tag: "Local",
    publishedDate: "2026-06-26",
    publishedDateDisplay: "Jun 26, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "Working near Wynyard Station? The Grand Palace's basement dining room is a 1-minute walk away via the MetCentre.",
    intro: `If you're near Wynyard Station and want a proper sit-down Indian lunch or dinner rather than a food court, The Grand Palace is about as close as it gets — a 1-minute walk via the MetCentre to the basement dining room at ${contact.address}.`,
    quickAnswer: "The Grand Palace is a 1-minute walk from Wynyard Station: exit toward George Street, walk through the MetCentre, and take the stairs or lift down to the basement dining room at 261 George Street. It's open for lunch daily from 12pm and dinner from 5pm.",
    quickFacts: [
      { label: "Distance from Wynyard Station", value: "1-minute walk via the MetCentre" },
      { label: "Lunch hours", value: "12:00pm – 3:00pm, daily" },
      { label: "Dinner hours", value: "5:00pm – 10:00pm (Sun–Thu), 5:00pm – 10:30pm (Fri–Sat)" },
    ],
    heroImage: IMAGES.restaurantInterior,
    heroImageAlt: "The Grand Palace basement dining room near Wynyard Station, Sydney CBD",
    sections: [
      {
        heading: "Getting Here from Wynyard Station",
        body: [
          "Exit Wynyard Station toward George Street and walk through the MetCentre shopping concourse — the basement entrance at 261 George Street is roughly a minute's walk from the station concourse, with lift access available. Coming off the Bridge Street Light Rail instead, it's the same short walk in the other direction.",
          "Driving or arriving by taxi/rideshare: Wilson Parking on York Street and the Secure Parking station at Wynyard are both a few minutes' walk away.",
        ],
      },
      {
        heading: "Opening Hours",
        body: [],
        bullets: [
          "Lunch — Monday to Sunday, 12:00pm – 3:00pm",
          "Dinner — Sunday to Thursday, 5:00pm – 10:00pm",
          "Dinner — Friday and Saturday, 5:00pm – 10:30pm",
        ],
        blockType: "row",
      },
      {
        heading: "Why CBD Workers Choose TGP Near Wynyard",
        body: [],
        bullets: [
          "Steps from your commute — genuinely convenient for work lunches and after-work dinners",
          "Full vegetarian menu alongside the non-veg range",
          "Catering boxes for the office from $75 (veg) / $85 (non-veg)",
          "Birthday and event packages if you're celebrating near the Wynyard precinct",
        ],
      },
      {
        heading: "Good to Know Before You Book",
        body: [
          "The dining room seats up to 125 guests across five private dining spaces, so it comfortably handles anything from a two-person lunch to a larger after-work group. The venue is fully licensed (no BYO), a card surcharge applies, and a 10% surcharge applies on public holidays. Minimum charge is $35 per adult and $25 for children aged 5–10.",
        ],
      },
    ],
    faq: [
      { q: "How far is The Grand Palace from Wynyard Station?", a: "About a 1-minute walk via the MetCentre exit onto George Street — one of the closest sit-down Indian restaurants to the station." },
      { q: "Is it open for a quick weekday lunch near Wynyard?", a: "Yes — lunch runs seven days a week, 12:00pm to 3:00pm." },
      { q: "Can I book a table for a large group near Wynyard Station?", a: "Yes — the venue holds up to 125 guests across five private dining rooms, with set menus from $40pp for groups." },
      { q: "Is there parking near The Grand Palace?", a: "Wilson Parking on York Street and Secure Parking near Wynyard Station are both a short walk away." },
    ],
    relatedSlugs: ["best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide", "how-to-plan-office-lunch-catering-in-sydney", "tgp-is-best-for-a-weekend-indian-lunch"],
    ctaLabel: "Book a Table",
    ctaHref: "/book-a-table",
  },

  // 7 — Office lunch catering planning guide (Catering, procurement angle)
  {
    slug: "how-to-plan-office-lunch-catering-in-sydney",
    title: "How to Plan Office Lunch Catering in Sydney — A Practical Guide",
    metaTitle: "Office Lunch Catering Sydney — Planning Guide | TGP",
    metaDescription: "Planning office lunch catering in Sydney CBD? How to size the order, manage dietary needs, budget per person, and book — with real TGP box pricing.",
    tag: "Catering",
    publishedDate: "2026-05-08",
    publishedDateDisplay: "May 8, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "A practical planning guide for whoever's ordering the team lunch — quantities, dietary needs, realistic costs, and how to book with The Grand Palace.",
    intro: "Ordering office lunch catering usually falls to one person juggling a budget, a deadline, and a team with genuinely different dietary needs. This is the practical version of that process — how much to order, how to handle dietary requirements without a dozen back-and-forth emails, and what it actually costs.",
    quickAnswer: "Office lunch catering from The Grand Palace runs on catering boxes — $75 vegetarian, $85 non-vegetarian, minimum 10 boxes with 48 hours' notice — sized at one box per person, with a 5–10% buffer for larger teams. For smaller or ad-hoc team lunches, dine-in set menus from $40 per person are the simpler option.",
    quickFacts: [
      { label: "Minimum order", value: "10 boxes" },
      { label: "Notice required", value: "48 hours" },
      { label: "Cost per box", value: "$75 (veg) / $85 (non-veg)" },
    ],
    heroImage: IMAGES.officeLunchBox,
    heroImageAlt: "Office lunch catering boxes from The Grand Palace, ready for pickup, Sydney CBD",
    sections: [
      {
        heading: "Why Indian Food Solves the Office Catering Problem",
        body: [
          "A team lunch usually needs to work for vegetarians, halal-observant colleagues and everyone else in a single order — Indian food handles that without anyone getting a compromise meal, and it travels and reheats far better than most cuisines.",
        ],
        bullets: [
          "Vegetarian-rich menu covers multiple dietary needs in one order",
          "Individually portioned boxes — hygienic and easy to distribute without a kitchen",
          "Holds its quality well between pickup and serving",
        ],
      },
      {
        heading: "How Many Boxes to Order",
        body: [
          "One box per person is the standard for a team lunch — each TGP box is a complete meal. Add a 5–10% buffer for groups over 50 or working lunches where people tend to eat more. If you're not sure of the split, 40% veg / 60% non-veg is a reasonable starting point for most Sydney offices, though it's worth checking with the team directly if you can.",
        ],
      },
      {
        heading: "Handling Dietary Requirements",
        body: [
          "Flag these clearly when you order, rather than after the fact:",
        ],
        bullets: [
          "Vegetarian — boxes are kept fully separate from non-veg items",
          "Jain — available on request (no onion, garlic or root vegetables)",
          "Spice level — let the kitchen know if some dishes need to run milder",
          "Allergies — nuts, dairy and gluten should be flagged at the time of ordering",
        ],
      },
      {
        heading: "What It Actually Costs",
        body: ["For budgeting purposes, here's roughly where Sydney office catering sits by tier:"],
        bullets: [
          "Budget (sandwiches, pizza) — $10–18 per person",
          "Mid-range (Asian, Mediterranean boxes) — $20–35 per person",
          "Premium, restaurant-quality (TGP boxes) — $75–85 per box, comfortably feeding 1–2 people",
        ],
      },
      {
        heading: "Ordering Step by Step",
        body: [],
        bullets: [
          `Contact us — call ${contact.phone} or email ${contact.email} with date, time and rough group size`,
          "Confirm quantities and the veg/non-veg split",
          "Communicate dietary requirements up front",
          "Receive confirmation of cost, timing and pickup details",
          `Collect from ${contact.address}`,
        ],
      },
    ],
    faq: [
      { q: "How far in advance do I need to order?", a: "A minimum of 48 hours' notice is required for catering box orders." },
      { q: "How many boxes should I order for my team?", a: "One box per person for a standard team lunch, with a 5–10% buffer for larger groups (50+)." },
      { q: "Can I mix vegetarian and non-vegetarian boxes?", a: "Yes — order any combination based on your team's preferences, in a single order." },
      { q: "What dietary accommodations are available?", a: "Vegetarian, Jain (no onion/garlic/root vegetables), spice-level adjustments, and allergy-aware preparation when flagged in advance." },
    ],
    relatedSlugs: ["indian-catering-box-sydney-cbd", "corporate-catering-sydney-cbd", "christmas-corporate-catering-box-by-tgp"],
    ctaLabel: "Order Office Catering",
    ctaHref: "/office-catering",
  },

  // 8 — Weekend Indian lunch (Dining, personal dine-in angle)
  {
    slug: "tgp-is-best-for-a-weekend-indian-lunch",
    title: "Why The Grand Palace Is Best for a Weekend Indian Lunch in Sydney CBD",
    metaTitle: "Best Weekend Indian Lunch Sydney CBD | The Grand Palace",
    metaDescription: "A relaxed weekend Indian lunch in Sydney CBD — The Grand Palace serves its full menu 12pm–3pm daily, with set menus for groups from $40pp.",
    tag: "Dining",
    publishedDate: "2026-06-01",
    publishedDateDisplay: "Jun 1, 2026",
    updatedDate: TODAY_ISO,
    updatedDateDisplay: TODAY_DISPLAY,
    excerpt: "A weekend lunch is for lingering, not rushing back to a desk — The Grand Palace's full menu and unhurried pace make it a proper Saturday or Sunday outing.",
    intro: `A weekday lunch is about speed; a weekend lunch shouldn't be. The Grand Palace, at ${contact.address}, runs the full menu at a relaxed pace on Saturdays and Sundays — the kind of lunch worth planning around rather than squeezing in.`,
    quickAnswer: "For a relaxed sit-down Indian lunch on a Saturday or Sunday in Sydney CBD, The Grand Palace serves its full lunch menu from 12pm to 3pm daily, with set menus at $40 and $55 per person for groups, in a dining room near Wynyard and Circular Quay.",
    quickFacts: [
      { label: "Weekend lunch hours", value: "12:00pm – 3:00pm, Saturday & Sunday" },
      { label: "Set menus", value: "$40pp or $55pp" },
      { label: "Location", value: "Near Wynyard Station and Circular Quay" },
    ],
    heroImage: IMAGES.restaurantInterior,
    heroImageAlt: "Relaxed weekend lunch setting at The Grand Palace, Sydney CBD",
    sections: [
      {
        heading: "A Lunch Worth Lingering Over",
        body: [
          "Weekends are the one time a lunch doesn't have to be timed against a meeting — the full menu is available, the pace is unhurried, and the dining room works just as well for a family table as it does for two people catching up.",
        ],
        bullets: [
          "Full lunch menu — starters, mains, biryanis and desserts, not a trimmed weekday version",
          "Set menus at $40pp or $55pp, useful for groups who don't want to order dish by dish",
          "A short walk from Wynyard Station and Circular Quay",
        ],
      },
      {
        heading: "What's on the Weekend Lunch Menu",
        body: [],
        bullets: [
          "Starters — Paneer Tikka, Seekh Kebab, Samosa Chaat, Hara Bhara Kebab",
          "Main curries — Butter Chicken, Dal Makhani, Rogan Josh, Kadhai Paneer",
          "Breads & rice — Garlic Naan, Laccha Paratha, Vegetable Biryani, Chicken Biryani",
          "Desserts & drinks — Gulab Jamun, Mango Lassi, Kulfi, Kheer",
        ],
      },
      {
        heading: "Who It Suits",
        body: [],
        bullets: [
          "Family gatherings — a broad enough menu for every age at the table",
          "Friends catching up — no need to rush the conversation",
          "A date lunch — an intimate, atmospheric setting for a weekend afternoon",
          "Visitors exploring Circular Quay, The Rocks or Darling Harbour looking for a proper sit-down meal nearby",
        ],
      },
      {
        heading: "Booking a Weekend Table",
        body: [
          `Weekend tables — Saturdays especially — fill quickly, so booking ahead is worth doing. Book online, call ${contact.phone}, or email ${contact.email} for a larger group.`,
        ],
      },
    ],
    faq: [
      { q: "Is The Grand Palace open for lunch on weekends?", a: "Yes — the full lunch menu runs 12:00pm to 3:00pm, seven days a week including Saturday and Sunday." },
      { q: "Do I need to book ahead for weekend lunch?", a: "It's recommended, particularly on Saturdays, as weekend tables fill quickly." },
      { q: "Are there set menu options for a group weekend lunch?", a: "Yes — set menus at $40pp or $55pp are available and simplify ordering for a larger table." },
      { q: "Is it suitable for a family lunch with kids?", a: "Yes — the menu spans mild to spicy dishes, and it's a comfortable setting for multigenerational family groups." },
    ],
    relatedSlugs: ["best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide", "indian-restaurant-near-wynyard-station-sydney", "how-to-plan-office-lunch-catering-in-sydney"],
    ctaLabel: "Book Weekend Lunch",
    ctaHref: "/book-a-table",
  },
];

// Cache so identical source images used by multiple guides (e.g. the shared
// restaurant-interior photo) are only downloaded/uploaded once per run.
const uploadCache = new Map();

async function uploadImage(src) {
  if (uploadCache.has(src)) return uploadCache.get(src);
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
  uploadCache.set(src, blob.url);
  return blob.url;
}

async function main() {
  const results = [];
  for (const guide of guides) {
    const { slug, ...data } = guide;
    process.stdout.write(`Processing ${slug} ... `);
    try {

      // Replace source wp-content URLs with freshly uploaded Blob URLs.
      let imagesUploaded = 0;
      if (data.heroImage) {
        data.heroImage = await uploadImage(data.heroImage);
        imagesUploaded++;
      }
      for (const section of data.sections) {
        if (section.image) {
          section.image = await uploadImage(section.image);
          imagesUploaded++;
        }
      }

      await prisma.guide.upsert({
        where: { slug },
        create: { slug, ...data },
        update: data,
      });

      console.log(`OK — ${data.sections.length} sections, ${imagesUploaded} images, ${data.faq.length} FAQs`);
      results.push({ slug, ok: true });
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
      results.push({ slug, ok: false, error: e.message });
    }
  }

  console.log("\n=== SUMMARY ===");
  for (const r of results) {
    console.log(r.ok ? `OK   ${r.slug}` : `FAIL ${r.slug} — ${r.error}`);
  }
  const okCount = results.filter((r) => r.ok).length;
  console.log(`\n${okCount}/${results.length} succeeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
