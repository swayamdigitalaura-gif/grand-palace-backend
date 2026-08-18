// One-off fix: the "best-halal-restaurant-sydney" guide was missing 10 real
// competitor restaurants that exist on the original source page
// (thegrandpalace.com.au/guides/best-halal-restaurant-in-sydney/), had a
// broken/inaccurate title ("20 Best Halal Restaurant in Sydney" when only
// 5 entries existed), and had no Conclusion section.
//
// This script:
//  1. Downloads each new restaurant's real photo from the source site and
//     re-uploads it to Vercel Blob (so we don't hotlink their WP media).
//  2. Keeps the 4 existing, already-correct competitor entries untouched
//     (Ipoh on York, Neptune Palace, Mecca Bah, Jounieh) and inserts the
//     10 missing ones from the source in their original source order.
//  3. Renumbers every listing entry 1-15 (The Grand Palace stays #1).
//  4. Fixes title/metaTitle/metaDescription to accurately reflect 15 total
//     restaurants.
//  5. Appends a genuine Conclusion section as the last entry in `sections`.
//
// Note on count: the source page itself lists 15 entries (Grand Palace +
// 14 named competitors), but two of those 14 ("Lal Qila restaurant" and
// "Lal Qila Darling Harbour") are the exact same restaurant at the exact
// same address/phone/website, just posted twice — merged here into one
// listing. Ipoh on York (already in our DB, not on the source page at all,
// a different cuisine to everything on the source list) was kept per
// instructions not to remove correct existing content. Net result: 15
// total restaurant entries, matching the source's real distinct count.
//
// Safe to re-run: it re-uploads images each run (new blob URLs) and
// overwrites the same fields, so only run once normally.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const SOURCE_BASE = "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/";

async function uploadImage(filename, blobName) {
  const url = SOURCE_BASE + filename;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const blob = await put(blobName, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/png",
  });
  return blob.url;
}

async function main() {
  console.log("Downloading + re-uploading restaurant images to Vercel Blob...");

  const [
    nawazUrl,
    cairoUrl,
    lalQilaUrl,
    sultansUrl,
    pashaUrl,
    dragonUrl,
    ekushUrl,
    ogaloUrl,
    tasteTurkeyUrl,
    biryaniUrl,
  ] = await Promise.all([
    uploadImage("Nawaz-Flavour-of-India-2.png", "nawaz-flavour-of-india.png"),
    uploadImage("Cairo-Takeaway-1.png", "cairo-takeaway.png"),
    uploadImage("Lal-Qila-Darling-Harbour.png", "lal-qila-darling-harbour.png"),
    uploadImage("The-Sultans-Table.png", "the-sultans-table.png"),
    uploadImage("Pashas-Turkish-Restaurant.png", "pashas-turkish-restaurant.png"),
    uploadImage("Dragon-House-Indian-Chinese-Halal-Restaurant.png", "dragon-house-halal.png"),
    uploadImage("Ekush-Halal-Restaurant-Lakemba.png", "ekush-halal-restaurant-lakemba.png"),
    uploadImage("Ogalo-City-Sydney.png", "ogalo-city-sydney.png"),
    uploadImage("Taste-of-Turkey.png", "taste-of-turkey.png"),
    uploadImage("Indian-Biryani-Restaurant-Rockdale.png", "indian-biryani-restaurant-rockdale.png"),
  ]);

  console.log("All images uploaded:");
  console.log({ nawazUrl, cairoUrl, lalQilaUrl, sultansUrl, pashaUrl, dragonUrl, ekushUrl, ogaloUrl, tasteTurkeyUrl, biryaniUrl });

  const existing = await prisma.guide.findUnique({ where: { slug: "best-halal-restaurant-sydney" } });
  if (!existing) throw new Error("Guide not found: best-halal-restaurant-sydney");

  const sections = existing.sections;

  // Locate existing entries by heading text (these 4 stay untouched, just renumbered).
  const introSection = sections.find((s) => s.heading === "What to actually check when a menu says 'halal'");
  const grandPalace = sections.find((s) => s.heading.startsWith("1. The Grand Palace"));
  const ipoh = sections.find((s) => s.heading.startsWith("2. Ipoh on York"));
  const neptune = sections.find((s) => s.heading.startsWith("3. Neptune Palace"));
  const meccaBah = sections.find((s) => s.heading.startsWith("4. Mecca Bah"));
  const jounieh = sections.find((s) => s.heading.startsWith("5. Jounieh"));

  if (!introSection || !grandPalace || !ipoh || !neptune || !meccaBah || !jounieh) {
    throw new Error("Could not locate one or more expected existing sections — aborting to avoid data loss.");
  }

  // New restaurants sourced from thegrandpalace.com.au/guides/best-halal-restaurant-in-sydney/
  const nawaz = {
    heading: "[Nawaz Flavour of India — Darling Harbour](https://www.nawazflavourofindia.com.au/)",
    body: [
      "A Darling Harbour Indian restaurant serving since 1990, known for a long-standing, consistent menu of North Indian classics rather than a trend-driven one.",
    ],
    bullets: [
      "Best for: a long-established, no-frills Indian dinner in Darling Harbour",
      "Dietary options: vegetarian, vegan and gluten-free options alongside halal",
      "Address: 30 Lime Street, Darling Harbour NSW 2000",
    ],
    image: nawazUrl,
    imageAlt: "Nawaz Flavour of India restaurant, Darling Harbour, Sydney",
  };

  const cairo = {
    heading: "[Cairo Takeaway — Glebe](http://www.cairotakeaway.com/)",
    body: [
      "A casual Egyptian eatery in Glebe serving authentic street food, including falafel, koshari and ful medames made from traditional recipes.",
    ],
    bullets: [
      "Best for: an inexpensive, authentic Egyptian halal meal",
      "Dietary options: vegetarian, vegan and gluten-free options alongside halal",
      "Address: 142a Glebe Point Rd, Glebe NSW 2037",
    ],
    image: cairoUrl,
    imageAlt: "Cairo Takeaway Egyptian restaurant, Glebe, Sydney",
  };

  const lalQila = {
    heading: "[Lal Qila — Darling Harbour](https://www.lalqila.com.au/)",
    body: [
      "A Mughlai and Pakistani restaurant in Darling Harbour with royal-court-inspired décor, known for kebabs, curries and biryanis served in a grander, occasion-friendly setting.",
    ],
    bullets: [
      "Best for: a special-occasion Mughlai/Pakistani dinner with families or groups",
      "Menu highlights: Nawabi Murgh Tikka, Sultani Nalli, Naramdil Gala Seekh",
      "Address: 30 Lime St, Darling Harbour NSW 2000",
    ],
    image: lalQilaUrl,
    imageAlt: "Lal Qila restaurant, Darling Harbour, Sydney",
  };

  const sultans = {
    heading: "[The Sultan's Table — Enmore](http://www.thesultanstable.com.au/)",
    body: [
      "A Turkish restaurant on Enmore Road serving traditional mezes, kebabs and desserts, open late most nights of the week.",
    ],
    bullets: [
      "Best for: a late-night Turkish dinner in the inner west",
      "Address: 179 Enmore Rd, Enmore NSW 2042",
    ],
    image: sultansUrl,
    imageAlt: "The Sultan's Table Turkish restaurant, Enmore, Sydney",
  };

  const pasha = {
    heading: "[Pasha's Turkish Restaurant — Newtown](http://www.pashas.com.au/)",
    body: [
      "A long-standing Newtown Turkish restaurant known for northern-western Turkish cuisine and a traditional dining atmosphere.",
    ],
    bullets: [
      "Best for: a sit-down Turkish dinner with table service",
      "Address: 490/492 King St, Newtown NSW 2042",
    ],
    image: pashaUrl,
    imageAlt: "Pasha's Turkish Restaurant, Newtown, Sydney",
  };

  const dragon = {
    heading: "[Dragon House Indian Chinese Halal Restaurant — Parramatta](https://www.dragon-house.com.au/)",
    body: [
      "A Parramatta restaurant specialising in Indo-Chinese cooking — Indian spices with Chinese cooking techniques — with a fully halal-certified menu.",
    ],
    bullets: [
      "Best for: Indo-Chinese fusion halal food in Western Sydney",
      "Address: 38-40 George St, Parramatta NSW 2150",
    ],
    image: dragonUrl,
    imageAlt: "Dragon House Indian Chinese Halal Restaurant, Parramatta, Sydney",
  };

  const ekush = {
    heading: "[Ekush Halal Restaurant — Lakemba](http://www.ekush.com.au/)",
    body: [
      "A Lakemba restaurant serving Bangladeshi and South Asian dishes in a homely, no-frills setting, with both traditional and contemporary options on the menu.",
    ],
    bullets: [
      "Best for: Bangladeshi halal home-style cooking",
      "Address: 3/157-171 Haldon St, Lakemba NSW 2195",
    ],
    image: ekushUrl,
    imageAlt: "Ekush Halal Restaurant, Lakemba, Sydney",
  };

  const ogalo = {
    heading: "[Ogalo City — Sydney CBD](https://www.ogalo.com.au/)",
    body: [
      "A casual, fast-food-style halal restaurant in the CBD offering bigger portions at lower price points than a typical sit-down venue.",
    ],
    bullets: [
      "Best for: a quick, budget-friendly halal lunch in the CBD",
      "Address: b/127 Liverpool St, Sydney NSW 2000",
    ],
    image: ogaloUrl,
    imageAlt: "Ogalo City halal restaurant, Sydney CBD",
  };

  const tasteOfTurkey = {
    heading: "[Taste of Turkey — Newtown](http://www.tasteofturkey.com.au/)",
    body: [
      "A Turkish restaurant on Enmore Road built around quality, ethically sourced ingredients, serving classics like Adana shish and karışık pide.",
    ],
    bullets: [
      "Best for: ingredient-focused Turkish grill dishes",
      "Menu highlights: Etli Güveç, Chicken Shish, Adana Shish",
      "Address: 88/90 Enmore Rd, Newtown NSW 2042",
    ],
    image: tasteTurkeyUrl,
    imageAlt: "Taste of Turkey restaurant, Newtown, Sydney",
  };

  const biryani = {
    heading: "[Indian Biryani Restaurant — Rockdale](http://www.indianbiryanirestaurant.com.au/)",
    body: [
      "A Rockdale restaurant focused specifically on Hyderabadi biryani, built around recipes aimed at replicating that regional style rather than a general Indian menu.",
    ],
    bullets: [
      "Best for: Hyderabadi-style biryani specifically",
      "Menu highlights: Chicken 65, Mutton Khorma, Hyderabadi Paya",
      "Address: 544 Princes Hwy, Rockdale NSW 2216",
    ],
    image: biryaniUrl,
    imageAlt: "Indian Biryani Restaurant, Rockdale, Sydney",
  };

  // Final restaurant order: Grand Palace first, then Ipoh (existing, not on
  // source page), then the rest following the source page's own order.
  const orderedRestaurants = [
    grandPalace,
    ipoh,
    nawaz,
    cairo,
    lalQila,
    sultans,
    pasha,
    meccaBah,
    dragon,
    ekush,
    ogalo,
    jounieh,
    tasteOfTurkey,
    neptune,
    biryani,
  ];

  // Renumber headings 1-15. Existing headings look like "N. Name — Suburb";
  // new headings look like "[Name — Suburb](url)" — normalize both to
  // "N. Name — Suburb" / "[N. Name — Suburb](url)".
  const renumbered = orderedRestaurants.map((section, idx) => {
    const n = idx + 1;
    let heading = section.heading;
    if (heading.startsWith("[")) {
      // "[Name — Suburb](url)" -> "[N. Name — Suburb](url)"
      heading = heading.replace(/^\[/, `[${n}. `);
    } else {
      // "N. Name — Suburb" -> replace leading number
      heading = heading.replace(/^\d+\.\s*/, `${n}. `);
    }
    return { ...section, heading };
  });

  const conclusion = {
    heading: "Conclusion",
    body: [
      "Halal dining in Sydney is no longer a narrow category — it now spans Indian, Malaysian, Turkish, Lebanese, Egyptian, Bangladeshi and Indo-Chinese kitchens right across the CBD and inner and outer suburbs, with certification standards that vary from restaurant to restaurant. The one thing worth checking before you book anywhere is whether that certification covers the whole menu or just a few dishes.",
      "For a fully halal-certified Indian meal in the heart of the CBD, [The Grand Palace](/menu) keeps its entire non-vegetarian menu certified, with vegetarian, vegan and Jain options built in alongside it — making it a reliable choice for mixed groups where everyone at the table has different dietary needs.",
    ],
  };

  const newSections = [
    introSection,
    ...renumbered,
    conclusion,
  ];

  const updated = await prisma.guide.update({
    where: { slug: "best-halal-restaurant-sydney" },
    data: {
      title: "15 Best Halal Restaurants in Sydney — The Grand Palace Guide",
      metaTitle: "15 Best Halal Restaurants in Sydney | The Grand Palace",
      metaDescription:
        "15 genuinely halal-certified restaurants across Sydney, from Indian and Malaysian to Turkish and Lebanese — including where The Grand Palace's fully halal-certified menu fits in.",
      sections: newSections,
    },
  });

  console.log("Updated guide. Total restaurant entries:", renumbered.length);
  console.log(renumbered.map((s) => s.heading));
  console.log("Last section (should be Conclusion):", updated.sections[updated.sections.length - 1].heading);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
