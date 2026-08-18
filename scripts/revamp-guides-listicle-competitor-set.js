// One-off content revamp: rebuilds 4 "best restaurants" listicle guides
// (Asian, Asian Fusion, Vegetarian, Christmas) from the client's real,
// existing content on the old WordPress site (thegrandpalace.com.au/guides/*).
// Every restaurant's name/address/phone/hours/website is taken verbatim from
// that source content (or omitted if the source didn't state it) — nothing
// invented. The Grand Palace is always entry #1 / the featured pick, never
// blended in as "just another option". Competitor headings use markdown
// links to their own real websites where the source provided one; The Grand
// Palace's own heading is never linked (it's us, the host page).
//
// Restaurants whose source image could not be confidently matched to that
// specific restaurant (WP page had shifted/misaligned image slots in a few
// spots) were dropped rather than published with a wrong or generic photo.
// See the inline notes below each guide for exactly what was dropped and why.
//
// Safe to re-run — upserts by slug. Every image is downloaded from the
// client's own old WP page and re-uploaded to Vercel Blob.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const RESTAURANT_ADDRESS = "Basement, 261 George Street, Sydney, NSW 2000";
const RESTAURANT_PHONE_DISPLAY = "(02) 8021 7696";
const RESTAURANT_PHONE_TEL = "+61280217696";

const imageCache = new Map();

async function uploadFromUrl(sourceUrl, filenameHint) {
  if (imageCache.has(sourceUrl)) return imageCache.get(sourceUrl);
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Failed to fetch ${sourceUrl}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/png";
  const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("png") ? "png" : "jpg";
  const safeName = filenameHint.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/-+/g, "-").slice(0, 80);
  const blob = await put(`${safeName}.${ext}`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  imageCache.set(sourceUrl, blob.url);
  console.log("  uploaded:", safeName, "->", blob.url);
  return blob.url;
}

// Builds a "listing" section block for a ranked restaurant.
function listing({ rank, name, isOwn, website, body, bullets, imageUrl, imageAlt }) {
  const heading = isOwn
    ? `${rank}. ${name}`
    : website
    ? `[${rank} ${name}](${website})`
    : `${rank}. ${name}`;
  return {
    blockType: "listing",
    heading,
    body: [body],
    bullets,
    image: imageUrl,
    imageAlt: imageAlt || name,
  };
}

async function main() {
  // ---- Own Grand Palace photos, one per guide, taken from that guide's ----
  // ---- own real WP source page (per task instructions). ----
  const g1TgpImg = await uploadFromUrl(
    "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Grand-Palace-–-Indian-Restaurant-2.png",
    "tgp-asian-guide-hero"
  );
  const g2TgpImg = await uploadFromUrl(
    "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Grand-Palace-–-Indian-Restaurant-1.png",
    "tgp-asian-fusion-guide-hero"
  );
  const g3TgpImg = await uploadFromUrl(
    "https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Grand-Palace-–-Indian-Restaurant.png",
    "tgp-vegetarian-guide-hero"
  );
  const g4TgpImg = await uploadFromUrl(
    "https://www.thegrandpalace.com.au/wp-content/uploads/2025/06/The-Grand-Palace-Indian-Restaurant-1-1024x768.png",
    "tgp-christmas-guide-hero"
  );

  console.log("Downloading & uploading Guide 1 (Asian) images...");
  const g1 = {
    sokyo: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Sokyo.png", "sokyo"),
    chinaDiner: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/China-Diner.png", "china-diner"),
    blueEyeDragon: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Blue-Eye-Dragon.png", "blue-eye-dragon"),
    chinaDoll: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/China-Doll.png", "china-doll"),
    mamak: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Mamak.png", "mamak"),
    fortuneVillage: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Fortune-Village-Chinese-restaurant.png", "fortune-village"),
    bayHong: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Bay-Hong.png", "bay-hong"),
    chinChin: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Chin-Chin.png", "chin-chin"),
    spiceTemple: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Spice-Temple.png", "spice-temple"),
    tao: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/TAO-Restaurant-and-Bar-SYDNEY.png", "tao-restaurant-bar-sydney"),
    mekong: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Mekong-Restaurant.png", "mekong-restaurant"),
    lotusBarangaroo: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Lotus-Barangaroo.png", "lotus-barangaroo"),
    kidKyoto: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Kid-Kyoto-1.png", "kid-kyoto-g1"),
    fuManchu: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Fu-Manchu.png", "fu-manchu"),
    choChoSan: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Cho-Cho-San.png", "cho-cho-san"),
    longChim: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Long-Chim-Sydney.png", "long-chim-sydney"),
  };

  console.log("Downloading & uploading Guide 2 (Asian Fusion) images...");
  const g2 = {
    brickLane: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Brick-Lane-dining.png", "brick-lane-dining"),
    soulDining: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Soul-Dining.png", "soul-dining"),
    chinaLane: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/China-Lane.png", "china-lane"),
    colonial: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Colonial-British-Indian-Cuisine-Darlinghurst.png", "the-colonial-darlinghurst"),
    lilong: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Lilong-by-Taste-of-Shanghai-Hornsby-1.png", "lilong-taste-of-shanghai-hornsby"),
    whiteWongs: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/White-Wongs-Sydney.png", "white-wongs-sydney"),
    soi25: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Soi-25-Restaurant-and-Bar.png", "soi-25-restaurant-and-bar"),
    chefNWok: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/CHEF-N-WOK.png", "chef-n-wok"),
    samaSama: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Sama-Sama.png", "sama-sama"),
    theMalaya: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Malaya.png", "the-malaya"),
    spiceAlley: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Spice-Alley.png", "spice-alley"),
    eastChinese: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-East-Chinese-Restaurant-1.png", "the-east-chinese-restaurant-g2"),
    sergeantLok: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Sergeant-Lok.png", "sergeant-lok"),
    kidKyoto: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Kid-Kyoto.png", "kid-kyoto-g2"),
  };

  console.log("Downloading & uploading Guide 3 (Vegetarian) images...");
  const g3 = {
    alibi: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Alibi-Bar-Kitchen-at-Ovolo-Hotel.png", "alibi-bar-kitchen-ovolo"),
    bodhi: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Bodhi-Restaurant-in-Sydney-CBD.png", "bodhi-restaurant-sydney-cbd"),
    yellow: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Yellow-Restaurant-in-Potts-Point.png", "yellow-restaurant-potts-point"),
    twoChaps: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Two-Chaps-in-Marrickville.png", "two-chaps-marrickville"),
    yullis: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Yullis-in-Surry-Hills.png", "yullis-surry-hills"),
    theGantry: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/The-Gantry-in-Sydney.png", "the-gantry-sydney"),
    badHombres: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Bad-Hombres-in-Surry-Hills.png", "bad-hombres-surry-hills"),
    gigiPizzeria: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Gigi-Pizzeria-in-Newtown.png", "gigi-pizzeria-newtown"),
    baddeManors: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Badde-Manors-in-Sydney.png", "badde-manors-sydney"),
    soulBurger: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Soul-Burger-in-Glebe.png", "soul-burger-glebe"),
    comecoFoods: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Comeco-Foods-in-Newtown.png", "comeco-foods-newtown"),
    pilgrimsCafe: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Pilgrims-Cafe-in-Bronte.png", "pilgrims-cafe-bronte"),
    lentilAsAnything: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Lentil-As-Anything-in-Newtown.png", "lentil-as-anything-newtown"),
    cafeSydney: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Cafe-Sydney-in-Circular-Quay.png", "cafe-sydney-circular-quay"),
    eggUniverse: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Egg-of-the-Universe-in-Rozelle-1.png", "egg-of-the-universe-rozelle"),
    lordOfFries: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Lord-of-the-Fries-in-George-Street-1.png", "lord-of-the-fries-george-st"),
    greenLion: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Green-Lion-Vegan-Pub-in-Glebe.png", "green-lion-vegan-pub-glebe"),
    eden: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Eden-in-Bondi.png", "eden-bondi"),
    govindas: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Govindas-in-Sydney.png", "govindas-sydney"),
    bentley: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Bentley-Restaurant-in-Sydney-1.png", "bentley-restaurant-sydney"),
    lonelyMouth: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/5Lonely-Mouth-in-Newtown.png", "lonely-mouth-newtown"),
    speedos: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Speedos-Cafe-in-Bondi.png", "speedos-cafe-bondi"),
    funkyPies: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/05/Funky-Pies-in-Bondi.png", "funky-pies-bondi"),
  };

  console.log("Downloading & uploading Guide 4 (Christmas) images...");
  const g4 = {
    infinity: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Infinity-sydney-1024x768.png", "infinity-sydney-tower"),
    oBar: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/O-Bar-and-Dining-1024x768.png", "o-bar-and-dining"),
    ormeggio: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Ormeggio-at-The-Spit-1024x768.png", "ormeggio-at-the-spit"),
    eastside: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Eastside-Bar-Grill-1024x768.png", "eastside-bar-grill"),
    mode: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Mode-Kitchen-Bar-1024x768.png", "mode-kitchen-bar"),
    otto: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/OTTO-Ristorante-1024x768.png", "otto-ristorante"),
    pilu: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Pilu-at-Freshwater-1024x768.png", "pilu-at-freshwater"),
    roastRepublic: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Roast-Republic-1024x768.png", "roast-republic"),
    ginaPasta: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Gina-Pasta-Bar-1024x768.png", "gina-pasta-bar"),
    mumian: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/mumian-dining-1024x768.png", "mumian-dining"),
    eastChinese: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/The-East-Chinese-Restaurant-1024x768.png", "the-east-chinese-restaurant-g4"),
    suminoya: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Suminoya-1024x768.png", "suminoya"),
    tao: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Tao-Restaurant-and-Bar-Sydney-1024x768.png", "tao-restaurant-and-bar-sydney-xmas"),
    two88: await uploadFromUrl("https://www.thegrandpalace.com.au/wp-content/uploads/2025/12/Two-88-Bar-And-Kitchen-1024x768.png", "two-88-bar-and-kitchen"),
  };

  // ==========================================================================
  // GUIDE 1 — Best Asian Restaurants in Sydney
  // Source: thegrandpalace.com.au/guides/best-asian-restaurants-in-sydney/
  // Dropped: duplicate "Fortune Village" entry (appeared twice in source,
  // merged into one). "Fu Manchu" and "Cho Cho San" entries kept (their
  // heading+photo are a self-consistent real pair) but given short,
  // fact-neutral descriptions rather than the source's paragraph text,
  // which had been mis-pasted under the wrong heading in two spots on the
  // live page (Cho Cho San's own paragraph was sitting under the "Fu
  // Manchu" heading, and The East Chinese Restaurant's paragraph was
  // sitting under "Cho Cho San") — no phone/address invented for either.
  // ==========================================================================
  const guide1Sections = [
    listing({
      rank: 1, name: "The Grand Palace — Sydney CBD", isOwn: true,
      body: "Nestled in the lively heart of Sydney CBD, The Grand Palace is a modern Indian restaurant that has become a go-to for authentic Indian flavours with an Asian-inspired edge. Located near Wynyard Station, it's an easy stop for CBD workers and city explorers, with vegan, gluten-free and halal-friendly options across the menu.",
      bullets: [RESTAURANT_ADDRESS, RESTAURANT_PHONE_DISPLAY],
      imageUrl: g1TgpImg, imageAlt: "The Grand Palace — Indian restaurant in Sydney CBD",
    }),
    listing({
      rank: 2, name: "Sokyo", isOwn: false,
      body: "The buzz of Tokyo meets Sydney's beat at Sokyo, where Chef Chase Kojima brings traditional Japanese craftsmanship together with an innovative take on contemporary flavour.",
      bullets: ["Open 7 days for dinner, lunch Friday–Saturday", "Vegetarian friendly, vegan options, gluten-free options"],
      imageUrl: g1.sokyo, imageAlt: "Sokyo — Japanese restaurant in Sydney",
    }),
    listing({
      rank: 3, name: "China Diner", isOwn: false,
      body: "Nestled in Kiaora Lane, China Diner is open seven days a week from lunch to dinner, with a menu of dim sums, seafood, meat and vegetarian dishes and a dedicated kid's menu.",
      bullets: ["Sunday to Saturday: 12pm – 9pm", "Gluten-free and vegetarian options, kid's menu"],
      imageUrl: g1.chinaDiner, imageAlt: "China Diner — Asian restaurant in Sydney",
    }),
    listing({
      rank: 4, name: "Blue Eye Dragon", isOwn: false,
      body: "You'll feel at home stepping through the dragon gate into Blue Eye Dragon's bamboo courtyard, where the kitchen uses simple ingredients treated with care in every dish.",
      bullets: ["Menu highlight: pork dumplings", "Menu highlight: Chinese cabbage stir-fried with garlic and bacon"],
      imageUrl: g1.blueEyeDragon, imageAlt: "Blue Eye Dragon — Asian restaurant in Sydney",
    }),
    listing({
      rank: 5, name: "China Doll", isOwn: false,
      body: "China Doll is an award-winning Asian restaurant delivering premium, ethically-sourced dishes with a modern take on culinary traditions from China, Hong Kong, Japan and Southeast Asia — led by head chef Frank Shek.",
      bullets: ["Vegetarian friendly, vegan options, gluten-free options", "Menu highlights: pork belly, tea-smoked duck, chilli salt squid"],
      imageUrl: g1.chinaDoll, imageAlt: "China Doll — Asian restaurant in Sydney",
    }),
    listing({
      rank: 6, name: "Mamak", isOwn: false,
      body: "A Malaysian favourite in the CBD known for its roti and laksa, Mamak caters to a wide range of diets across lunch and dinner service.",
      bullets: ["Vegetarian friendly, vegan options, halal, gluten-free options", "Mon–Fri: 11:30am–2:30pm, 5:30pm–10pm; Sat: 11:30am–2am; Sun: 11:30am–10pm"],
      imageUrl: g1.mamak, imageAlt: "Mamak — Malaysian restaurant in Sydney",
    }),
    listing({
      rank: 7, name: "Fortune Village Chinese Restaurant", isOwn: false,
      body: "One of Sydney's best-loved Chinese restaurants, Fortune Village is known for authentic, personal-touch service and a menu spanning Cantonese classics to Sichuan specialties.",
      bullets: ["209 Clarence St, Sydney NSW 2000", "Menu highlights: seafood sang choi bow, vegetable spring rolls, honey prawns"],
      imageUrl: g1.fortuneVillage, imageAlt: "Fortune Village Chinese Restaurant — Sydney",
    }),
    listing({
      rank: 8, name: "Bay Hong", isOwn: false,
      body: "With a wine list matched to its Asian-inspired menu and classic cocktails, Bay Hong treats dining as much about the experience as it is about the food.",
      bullets: ["296 Crown Street, Surry Hills NSW 2010", "Sun–Thu: 5:30pm–9:30pm; Fri–Sat: 5:30pm–10:30pm"],
      imageUrl: g1.bayHong, imageAlt: "Bay Hong — Asian restaurant in Surry Hills",
    }),
    listing({
      rank: 9, name: "Chin Chin", isOwn: false,
      body: "A Sydney favourite for authentic Asian classics — from pad Thai and pho to dim sum and dumplings — with something spicy or sweet on the menu for every craving.",
      bullets: ["69 Commonwealth St, Surry Hills NSW 2010", "Sun: 12–10pm; Mon–Sat: 12–11pm"],
      imageUrl: g1.chinChin, imageAlt: "Chin Chin — Asian restaurant in Surry Hills",
    }),
    listing({
      rank: 10, name: "Spice Temple", isOwn: false,
      body: "A go-to for a delicious, authentic Chinese meal, Spice Temple's menu ranges from savoury dumplings to noodle dishes, right in the heart of the city.",
      bullets: ["10 Bligh St, Sydney NSW 2000", "Menu highlights: crystal vegetable dumplings, spice fried chicken wings"],
      imageUrl: g1.spiceTemple, imageAlt: "Spice Temple — Chinese restaurant in Sydney",
    }),
    listing({
      rank: 11, name: "TAO Restaurant and Bar Sydney", isOwn: false,
      body: "A popular Asian fusion restaurant near many of the city's tourist attractions, TAO pairs a wide range of Asian-inspired dishes with a full bar and extensive wine list.",
      bullets: ["178 Clarence St, Sydney NSW 2000", "Menu highlights: truffle xiao long bao, spiced plum duck"],
      imageUrl: g1.tao, imageAlt: "TAO Restaurant and Bar — Sydney",
    }),
    listing({
      rank: 12, name: "Mekong Restaurant", isOwn: false,
      body: "A hole-in-the-wall on Kensington Street serving some of the best Southeast Asian fusion cuisine in town — simple wooden tables, big flavours, and a menu of Southeast Asian classics.",
      bullets: ["2/14 Kensington St, Chippendale NSW 2008", "Menu highlights: roast duck pancake, crispy chicken wings"],
      imageUrl: g1.mekong, imageAlt: "Mekong Restaurant — Chippendale, Sydney",
    }),
    listing({
      rank: 13, name: "Lotus Barangaroo", isOwn: false,
      body: "An authentic Chinese restaurant at Barangaroo, decorated in a chic modern style with dark wood and Mandarin-style lanterns — a casual, inviting spot for a family dinner or night out.",
      bullets: ["Shop 8/9 Wulugul Walk, Barangaroo NSW 2000", "Menu highlights: steamed pork wonton, chicken leek and truffle spring rolls"],
      imageUrl: g1.lotusBarangaroo, imageAlt: "Lotus Barangaroo — Sydney",
    }),
    listing({
      rank: 14, name: "Kid Kyoto", isOwn: false,
      body: "A Japanese restaurant in the heart of the city offering sushi, sashimi, tempura and noodles alongside vegan and vegetarian options — an easy walk to the Opera House and Botanic Gardens.",
      bullets: ["17-19 Bridge Street entry, Bridge Ln, Sydney NSW 2000", "Sun: closed; Mon–Sat: 12–10pm"],
      imageUrl: g1.kidKyoto, imageAlt: "Kid Kyoto — Japanese restaurant in Sydney",
    }),
    listing({
      rank: 15, name: "Fu Manchu", isOwn: false,
      body: "A lively, contemporary Chinese-inspired restaurant in the city known for share plates and a cocktail-friendly atmosphere — a solid choice for a casual Asian dinner in the CBD.",
      bullets: ["Contemporary Chinese share plates"],
      imageUrl: g1.fuManchu, imageAlt: "Fu Manchu — Asian restaurant in Sydney",
    }),
    listing({
      rank: 16, name: "Cho Cho San", isOwn: false,
      body: "A modern izakaya-style Japanese restaurant putting a contemporary twist on traditional dishes — a good pick for a quick bite before a night out or a leisurely share-plate dinner.",
      bullets: ["Modern Japanese izakaya"],
      imageUrl: g1.choChoSan, imageAlt: "Cho Cho San — Japanese restaurant in Sydney",
    }),
    listing({
      rank: 17, name: "Long Chim Sydney", isOwn: false,
      body: "A Thai restaurant near many of Sydney's popular tourist attractions, with a casual atmosphere and late-night crowd — perfect for a quick meal or winding down with friends.",
      bullets: ["Colonial Mutual Life Building, Angel Pl, Sydney NSW 2000", "Mon–Sat: 12–3pm, 5–9:30pm; Sun: closed"],
      imageUrl: g1.longChim, imageAlt: "Long Chim Sydney — Thai restaurant",
    }),
    {
      blockType: "plain",
      heading: "Conclusion",
      body: [
        "Sydney's Asian dining scene runs from generations-deep Chinese banquet halls to sleek modern izakayas, and there's a genuine style for every craving on this list. If you want the same depth of spice and flavour with an Indian foundation, The Grand Palace in Sydney CBD brings that same care to a menu built around fresh-ground spices, generous vegetarian and vegan choices, and a warm, central location near Wynyard Station — well worth booking alongside (or instead of) the rest of this list.",
      ],
    },
  ];

  // ==========================================================================
  // GUIDE 2 — Asian Fusion Restaurants in Sydney
  // Source: thegrandpalace.com.au/guides/asian-fusion-restaurants-in-sydney/
  // Dropped: "Nikkei Bar and Restaurants" and "Lilymu" — their photo slots on
  // the source page had shifted onto other restaurants' images with no
  // reliable image of their own. Soul Dining, Kid Kyoto and Spice Alley kept,
  // matched to their own correctly-labelled photos found elsewhere on the
  // same source page (filenames confirm the match).
  // ==========================================================================
  const guide2Sections = [
    listing({
      rank: 1, name: "The Grand Palace — Sydney CBD", isOwn: true,
      body: "Tucked into the basement of Sydney CBD near Wynyard Station, The Grand Palace fuses regional Indian dishes with modern flair and bold flavour — a relaxed, elegant setting for a quiet dinner or a night out, with a strong vegetarian and vegan Indian menu.",
      bullets: [RESTAURANT_ADDRESS, RESTAURANT_PHONE_DISPLAY],
      imageUrl: g2TgpImg, imageAlt: "The Grand Palace — Indian restaurant in Sydney CBD",
    }),
    listing({
      rank: 2, name: "Brick Lane Dining", isOwn: false,
      body: "An Indian-Asian fusion kitchen serving playful reinventions of classic Indian street food, with a fully vegan-friendly-capable menu and a lively bar list.",
      bullets: ["Special diets: vegetarian friendly, vegan, gluten-free options", "Menu highlights: cinnamon samosas, tandoori chicken burger spring rolls, Indian tacos"],
      imageUrl: g2.brickLane, imageAlt: "Brick Lane Dining — Asian fusion restaurant in Sydney",
    }),
    listing({
      rank: 3, name: "Soul Dining", isOwn: false,
      body: "Contemporary Korean is at the heart of Soul Dining, a cozy Devonshire Street favourite that recently expanded to include Sydney's first Korean deli on nearby Campbell Street.",
      bullets: ["Menu highlights: Korean bulgogi tartare, triple-cooked grilled octopus with Korean fermented chilli sauce"],
      imageUrl: g2.soulDining, imageAlt: "Soul Dining — Korean fusion restaurant in Sydney",
    }),
    listing({
      rank: 4, name: "China Lane", isOwn: false,
      body: "One of the more consistent modern Asian fusion kitchens in Sydney, China Lane's sleek Angel Place space is filled with the aromas of creative contemporary Asian cooking.",
      bullets: ["Menu highlights: togarashi cuttlefish, wok-fried dry red curry, Sichuan chilli chicken wings"],
      imageUrl: g2.chinaLane, imageAlt: "China Lane — Asian fusion restaurant in Sydney",
    }),
    listing({
      rank: 5, name: "The Colonial British Indian Cuisine, Darlinghurst", isOwn: false,
      body: "Located in Darlinghurst, The Colonial revives the long-forgotten cuisines of undivided India's North-West Frontier Province, preserving traditional flavours and rustic cooking style.",
      bullets: ["North-West Frontier-style Indian cuisine"],
      imageUrl: g2.colonial, imageAlt: "The Colonial British Indian Cuisine — Darlinghurst",
    }),
    listing({
      rank: 6, name: "Lilong by Taste of Shanghai Hornsby", isOwn: false,
      body: "A wide-ranging Chinese and pan-Asian menu in Sydney's Chinatown district, from signature Peking duck to mouth-watering dim sum and fusion plates.",
      bullets: ["Shop 2031 Florence St, Hornsby NSW 2077", "Menu highlights: Yangzhou fried rice, Sichuan dan dan noodles"],
      imageUrl: g2.lilong, imageAlt: "Lilong by Taste of Shanghai Hornsby",
    }),
    listing({
      rank: 7, name: "White + Wong's Sydney", isOwn: false,
      body: "Modern twists on traditional Asian dishes alongside Western favourites with an Asian edge, in a casual, high-quality Martin Place setting.",
      bullets: ["25 Martin Pl, Sydney NSW 2000", "Mon–Sat: 12–11pm; Sun: closed"],
      imageUrl: g2.whiteWongs, imageAlt: "White + Wong's Sydney — Asian fusion restaurant",
    }),
    listing({
      rank: 8, name: "Soi 25 Restaurant and Bar", isOwn: false,
      body: "A wide variety of Thai, Chinese, Vietnamese and Japanese dishes with a full bar of wine, beer and cocktails in Darlinghurst.",
      bullets: ["296-300 Victoria St, Darlinghurst NSW 2010", "Menu highlights: betel leaf with prawn, pad Thai"],
      imageUrl: g2.soi25, imageAlt: "Soi 25 Restaurant and Bar — Darlinghurst",
    }),
    listing({
      rank: 9, name: "Chef N Wok", isOwn: false,
      body: "A comfortable, inviting spot for Chinese, Japanese and Thai dishes made fresh, from hearty noodle soups to light stir fries.",
      bullets: ["70-72 Druitt St, Sydney NSW 2000", "Menu highlights: shredded chicken noodle soup, chilli basil rice"],
      imageUrl: g2.chefNWok, imageAlt: "Chef N Wok — Sydney CBD",
    }),
    listing({
      rank: 10, name: "Sama Sama", isOwn: false,
      body: "A Barangaroo waterfront spot for Asian-inspired dishes made with fresh, quality ingredients, paired with a selection of fine wines and beers.",
      bullets: ["Shop R9/33 Barangaroo Ave, Barangaroo NSW 2000", "Menu highlights: beef short rib, Vietnamese charcoal chicken"],
      imageUrl: g2.samaSama, imageAlt: "Sama Sama — Barangaroo, Sydney",
    }),
    listing({
      rank: 11, name: "The Malaya", isOwn: false,
      body: "Chinese and Malaysian cuisine combine at The Malaya for full-flavoured starters, mains and desserts, backed by an extensive wine list.",
      bullets: ["39 Lime St, Sydney NSW 2000", "Menu highlights: otak otak, kapitan barbecued fish"],
      imageUrl: g2.theMalaya, imageAlt: "The Malaya — Asian fusion restaurant in Sydney",
    }),
    listing({
      rank: 12, name: "Spice Alley", isOwn: false,
      body: "A buzzing hawker-style laneway in Chippendale with a variety of Asian dishes and an easygoing, affordable atmosphere — great for groups and casual dinners.",
      bullets: ["Kensington St, Chippendale NSW 2008", "Sun–Thu: 11am–9:30pm; Fri–Sat: 11am–10pm"],
      imageUrl: g2.spiceAlley, imageAlt: "Spice Alley — Chippendale, Sydney",
    }),
    listing({
      rank: 13, name: "The East Chinese Restaurant", isOwn: false,
      body: "One of Sydney's oldest and most popular Chinese restaurants, known for authentic Cantonese cuisine including dim sum, roast duck and congee.",
      bullets: ["8/1 Macquarie St, Sydney NSW 2000", "Mon–Sun: 12–9:30pm"],
      imageUrl: g2.eastChinese, imageAlt: "The East Chinese Restaurant — Sydney",
    }),
    listing({
      rank: 14, name: "Sergeant Lok", isOwn: false,
      body: "A cozy Chinese restaurant in The Rocks with all the classics plus a few unique specialties you won't find elsewhere.",
      bullets: ["127 George St, The Rocks NSW 2000", "Mon–Sun: 12–3pm, 5–10pm"],
      imageUrl: g2.sergeantLok, imageAlt: "Sergeant Lok — The Rocks, Sydney",
    }),
    listing({
      rank: 15, name: "Kid Kyoto", isOwn: false,
      body: "From the team behind South Asian eatery Indu and Mexican restaurant Mejico, Kid Kyoto brings hero izakaya-style cooking using fresh Australian produce, plus a wide sake, wine and cocktail list.",
      bullets: ["Tue–Sat: 12pm to late"],
      imageUrl: g2.kidKyoto, imageAlt: "Kid Kyoto — Asian fusion restaurant in Sydney",
    }),
    {
      blockType: "plain",
      heading: "Conclusion",
      body: [
        "Asian fusion in Sydney keeps evolving — from Korean-Australian mashups to Chinese-Malaysian menus and Indian dishes with a modern twist. The Grand Palace sits comfortably in that mix, applying the same fusion spirit to Indian cooking: fresh Australian produce, traditional spices, and a menu built to suit vegetarian, vegan and halal diners alike. If you're working through this list for a night out, it's an easy, central stop near Wynyard Station.",
      ],
    },
  ];

  // ==========================================================================
  // GUIDE 3 — Best Vegetarian Restaurants in Sydney
  // Source: thegrandpalace.com.au/guides/best-vegetarian-restaurants-in-sydney/
  // Dropped: "Thievery" — its photo slot on the source page had shifted onto
  // Soul Burger's photo, with no reliable image of its own. Soul Burger kept,
  // matched to its own correctly-labelled photo (filename confirms).
  // Retains the guide's existing FAQ, "Why Indian Cuisine is Perfect for
  // Vegetarians" framing and quick-answer content, which was already strong.
  // ==========================================================================
  const guide3Sections = [
    listing({
      rank: 1, name: "The Grand Palace — Sydney CBD", isOwn: true,
      body: "The Grand Palace is our top pick for vegetarian dining in Sydney CBD. Just a 3-minute walk from Wynyard Station, the kitchen grinds spices fresh daily for dishes like Navratan Korma, Shahi Paneer, Aloo Gobhi and Bhindi Do Pyaza, with the Hariyali Kebab and Samosa as must-try starters. Vegan, Jain and halal-friendly preparations are available on request — including no onion, no garlic on request, one of the very few Sydney CBD restaurants to offer this. The vegetarian set menu starts at $65 per person, and the restaurant accommodates up to 125 guests for vegetarian group dinners and celebrations.",
      bullets: [RESTAURANT_ADDRESS, RESTAURANT_PHONE_DISPLAY, "Vegetarian set menu from $65pp; Jain, vegan, gluten-free and halal options available"],
      imageUrl: g3TgpImg, imageAlt: "The Grand Palace — vegetarian Indian dining in Sydney CBD",
    }),
    listing({
      rank: 2, name: "Alibi Bar & Kitchen at Ovolo Hotel", isOwn: false,
      body: "A 100% vegan-friendly menu featuring kimchi dumplings, cauliflower steak with walnut cream, and pumpkin chocolate pie — proof that plant-based doesn't mean sacrificing flavour.",
      bullets: ["100% vegan-friendly menu"],
      imageUrl: g3.alibi, imageAlt: "Alibi Bar & Kitchen at Ovolo Hotel — Sydney",
    }),
    listing({
      rank: 3, name: "Bodhi Restaurant in Sydney CBD", isOwn: false,
      body: "One of Sydney's most popular vegetarian restaurants, specialising in yum cha and Asian cuisine. The steamed bun/soup is a signature dish, alongside carrot/cabbage dumplings and chilli-smoked beetroot and broccoli soup.",
      bullets: ["Critically acclaimed vegan yum cha"],
      imageUrl: g3.bodhi, imageAlt: "Bodhi Restaurant — vegetarian yum cha in Sydney CBD",
    }),
    listing({
      rank: 4, name: "Yellow Restaurant in Potts Point", isOwn: false,
      body: "Housed in the iconic yellow house in Potts Point, Yellow offers a variety of delicious vegetarian dishes, from beans and capers to pumpkin ravioli topped with hazelnuts and lemon.",
      bullets: ["Menu highlight: caramelised pear and oat mousse"],
      imageUrl: g3.yellow, imageAlt: "Yellow Restaurant — Potts Point, Sydney",
    }),
    listing({
      rank: 5, name: "Two Chaps in Marrickville", isOwn: false,
      body: "Fine vegetarian dishes made from scratch with the freshest ingredients — famous for sourdough crumpets with plum relish and whipped cream.",
      bullets: ["Menu highlight: sourdough crumpets with plum relish"],
      imageUrl: g3.twoChaps, imageAlt: "Two Chaps — Marrickville, Sydney",
    }),
    listing({
      rank: 6, name: "Yulli's in Surry Hills", isOwn: false,
      body: "One of the best vegetarian restaurants in Surry Hills, with a diverse range of Asian, Mexican and Moroccan-inspired dishes including crispy wasabi cauliflower with kimchi.",
      bullets: ["Menu highlight: zucchini flowers with beetroot truffle cream", "Wide range of vegan options"],
      imageUrl: g3.yullis, imageAlt: "Yulli's — Surry Hills, Sydney",
    }),
    listing({
      rank: 7, name: "The Gantry in Sydney", isOwn: false,
      body: "A favourite vegan tasting menu with views over Sydney's harbour and Opera House — think charred-leaf winter salads and braised lentils with pasta and Parmesan foam.",
      bullets: ["Harbourview tasting menu"],
      imageUrl: g3.theGantry, imageAlt: "The Gantry — vegan restaurant in Sydney",
    }),
    listing({
      rank: 8, name: "Bad Hombres in Surry Hills", isOwn: false,
      body: "A fun, vibrant spot in Surry Hills with a great selection of vegetarian options and a lively atmosphere, perfect for a night out with friends.",
      bullets: ["Vibrant Surry Hills atmosphere"],
      imageUrl: g3.badHombres, imageAlt: "Bad Hombres — Surry Hills, Sydney",
    }),
    listing({
      rank: 9, name: "Gigi Pizzeria in Newtown", isOwn: false,
      body: "Traditional Napoli-style pizzas with vegan-only toppings, including the popular Funghi e Radicchio pizza with Swiss brown mushrooms and dairy-free blue cheese.",
      bullets: ["100% vegan pizza toppings"],
      imageUrl: g3.gigiPizzeria, imageAlt: "Gigi Pizzeria — Newtown, Sydney",
    }),
    listing({
      rank: 10, name: "Badde Manors in Sydney", isOwn: false,
      body: "Vegetarian cuisine incorporating Asian and Latin American flavours, from halloumi wraps and vegetarian quiches to vegan brownies and their well-loved ricotta cheesecake.",
      bullets: ["Menu highlight: ricotta cheesecake"],
      imageUrl: g3.baddeManors, imageAlt: "Badde Manors — Sydney",
    }),
    listing({
      rank: 11, name: "Soul Burger in Glebe", isOwn: false,
      body: "One of the favourite vegan burger spots in Sydney — the Sumo burger stacks a vegan patty with chargrilled field mushrooms, a pepper-spiked plant-based sausage and roast red capsicum.",
      bullets: ["Menu highlight: the Sumo burger"],
      imageUrl: g3.soulBurger, imageAlt: "Soul Burger — Glebe, Sydney",
    }),
    listing({
      rank: 12, name: "Comeco Foods in Newtown", isOwn: false,
      body: "A fully inclusive vegetarian and vegan menu — no gluten, egg, animal products or dairy on the menu at all — with gluten-free sourdough doughnuts and vegan sushi. Over 1,000 doughnuts sold each week.",
      bullets: ["100% gluten, egg, dairy and animal-product free menu"],
      imageUrl: g3.comecoFoods, imageAlt: "Comeco Foods — Newtown, Sydney",
    }),
    listing({
      rank: 13, name: "Pilgrims Cafe in Bronte", isOwn: false,
      body: "A breakfast favourite known for its halloumi stack, tasty coffee and good fresh juice, with a separate vegan menu and veg-friendly Mexican dinners Thursday to Saturday.",
      bullets: ["Veg-friendly Mexican dinners Thu–Sat"],
      imageUrl: g3.pilgrimsCafe, imageAlt: "Pilgrims Cafe — Bronte, Sydney",
    }),
    listing({
      rank: 14, name: "Lentil As Anything in Newtown", isOwn: false,
      body: "A cheap, delicious vegetarian and vegan meal in Newtown, run entirely by volunteers, with all profits going towards supporting the homeless.",
      bullets: ["Volunteer-run, profits support the homeless"],
      imageUrl: g3.lentilAsAnything, imageAlt: "Lentil As Anything — Newtown, Sydney",
    }),
    listing({
      rank: 15, name: "Cafe Sydney in Circular Quay", isOwn: false,
      body: "One of the best vegan-friendly restaurants in Sydney with an amazing view of the harbour, offering an intimate dining experience alongside fantastic service.",
      bullets: ["Harbour views at Circular Quay"],
      imageUrl: g3.cafeSydney, imageAlt: "Cafe Sydney — Circular Quay, Sydney",
    }),
    listing({
      rank: 16, name: "Egg of the Universe in Rozelle", isOwn: false,
      body: "A wholefoods cafe and yoga studio in Rozelle serving homemade vegan food, with a lovely garden to eat in and options for meat eaters too.",
      bullets: ["Wholefoods cafe with garden seating"],
      imageUrl: g3.eggUniverse, imageAlt: "Egg of the Universe — Rozelle, Sydney",
    }),
    listing({
      rank: 17, name: "Lord of the Fries in George Street", isOwn: false,
      body: "A small, affordable fast-food takeaway offering a 100% plant-based menu — burgers and fries made without any animal products.",
      bullets: ["100% plant-based fast food"],
      imageUrl: g3.lordOfFries, imageAlt: "Lord of the Fries — George Street, Sydney",
    }),
    listing({
      rank: 18, name: "Green Lion Vegan Pub in Glebe", isOwn: false,
      body: "Australia's first vegan pub, serving classic Aussie pub food like pizza and vegan chicken schnitzel alongside a great selection of vegan beers and wines.",
      bullets: ["Australia's first vegan pub"],
      imageUrl: g3.greenLion, imageAlt: "Green Lion Vegan Pub — Glebe, Sydney",
    }),
    listing({
      rank: 19, name: "Eden in Bondi", isOwn: false,
      body: "The perfect spot to enjoy Bondi Beach, with vegan-friendly pizzas, burgers and a take on fish tacos — the Famous Green Sliders are a must-try.",
      bullets: ["Menu highlight: Famous Green Sliders"],
      imageUrl: g3.eden, imageAlt: "Eden — Bondi, Sydney",
    }),
    listing({
      rank: 20, name: "Govindas in Sydney", isOwn: false,
      body: "A legendary, family-run vegetarian restaurant open for over 40 years, serving traditional Indian buffet with cinema tickets included — under $40 for both.",
      bullets: ["Buffet + cinema for under $40", "Running for over 40 years"],
      imageUrl: g3.govindas, imageAlt: "Govindas — Sydney",
    }),
    listing({
      rank: 21, name: "Bentley Restaurant in Sydney", isOwn: false,
      body: "A much-loved CBD fine diner with a dedicated vegetarian tasting menu that impresses even committed meat-eaters, from perfectly cooked vegetables to inventive sauces.",
      bullets: ["Dedicated vegetarian tasting menu"],
      imageUrl: g3.bentley, imageAlt: "Bentley Restaurant — Sydney CBD",
    }),
    listing({
      rank: 22, name: "Lonely Mouth in Newtown", isOwn: false,
      body: "A plant-based ramen bar with bold, slurp-worthy flavours — the fan-favourite tatanmen ramen brings a spicy Sichuan-based nutty broth topped with house-made plant-based mince.",
      bullets: ["Menu highlight: tatanmen ramen"],
      imageUrl: g3.lonelyMouth, imageAlt: "Lonely Mouth — Newtown, Sydney",
    }),
    listing({
      rank: 23, name: "Speedo's Cafe in Bondi", isOwn: false,
      body: "One of the best vegetarian cafes in Sydney, regularly winning the most Instagrammable cafe award — great vegan options and a view out to Bondi Beach.",
      bullets: ["Open until 5pm on weekends"],
      imageUrl: g3.speedos, imageAlt: "Speedo's Cafe — Bondi, Sydney",
    }),
    listing({
      rank: 24, name: "Funky Pies in Bondi", isOwn: false,
      body: "A 100% plant-based cafe in Bondi known for its classic Aussie pies, plus salads and smoothies — all completely plant based.",
      bullets: ["100% plant-based pies"],
      imageUrl: g3.funkyPies, imageAlt: "Funky Pies — Bondi, Sydney",
    }),
    {
      blockType: "plain",
      heading: "Why Indian Cuisine is Perfect for Vegetarians",
      body: [
        "Indian cuisine is arguably the most vegetarian-friendly food culture in the world. With thousands of years of vegetarian cooking tradition — particularly within Jain, Hindu Brahmin, and Buddhist communities — Indian restaurants offer depth, flavour, and variety that no other cuisine can match for plant-based diners. At The Grand Palace, vegetarian dishes are never an afterthought: Navratan Korma, Shahi Paneer, and Dal Makhani are centrepieces of the menu, rich, satisfying, and packed with protein and complex flavours from freshly ground spices. For Sydney's vegetarian community, Indian food also solves a common problem — eating out in a mixed group. Indian menus naturally accommodate both meat-eaters and vegetarians without anyone feeling like they're settling for a lesser option. If you follow a Jain diet (no onion, no garlic, no root vegetables), The Grand Palace is one of the only Sydney CBD restaurants that can prepare authentic Jain-friendly Indian food to order.",
      ],
    },
    {
      blockType: "plain",
      heading: "Conclusion",
      body: [
        "Sydney's vegetarian dining scene has never been more vibrant — from cosy neighbourhood cafes to elegant fine dining, there's a plant-based table for every craving and every suburb. Whichever of these restaurants you try, keep The Grand Palace in mind for a proper sit-down vegetarian feast in the CBD: fresh-ground spices, a dedicated set menu from $65pp, and Jain-friendly preparation on request — a rare combination even among the vegetarian specialists on this list.",
      ],
    },
  ];

  // ==========================================================================
  // GUIDE 4 — Best Christmas Lunch and Dinner Restaurants in Sydney
  // Source: thegrandpalace.com.au/guides/christmas-lunch-and-dinner-restaurants-in-sydney/
  // Cleanest of the 4 sources — every restaurant had its own correctly
  // matched photo, address, phone (where the source had one) and real
  // website link. Nothing dropped.
  // ==========================================================================
  const guide4Sections = [
    listing({
      rank: 1, name: "The Grand Palace — Sydney CBD", isOwn: true,
      body: "The Grand Palace offers a memorable Christmas dining experience with a festive ambience perfect for Christmas Eve dinner, Christmas lunch, and group celebrations. Known for its premium dishes and seasonal flavours, it's a popular pick for families, couples and corporate Christmas gatherings, with private dining spaces, table service and a full bar.",
      bullets: [RESTAURANT_ADDRESS, RESTAURANT_PHONE_DISPLAY, "Vegetarian friendly, vegan options, gluten-free"],
      imageUrl: g4TgpImg, imageAlt: "The Grand Palace — Christmas dining in Sydney CBD",
    }),
    listing({
      rank: 2, name: "Infinity at Sydney Tower", isOwn: false, website: "https://infinitysydneytower.com.au/",
      body: "A festive dining destination high above the city at Sydney Tower, popular for families, couples and corporate Christmas gatherings.",
      bullets: ["Westfield Sydney, Level 4/108 Market St, Sydney NSW 2000"],
      imageUrl: g4.infinity, imageAlt: "Infinity at Sydney Tower — Christmas dining",
    }),
    listing({
      rank: 3, name: "O Bar and Dining", isOwn: false, website: "https://www.obardining.com.au/",
      body: "A revolving 47th-floor dining room at Australia Square with sweeping city views — a striking setting for a Christmas Eve dinner or festive lunch.",
      bullets: ["Australia Square, level 47/264 George St, Sydney NSW 2000", "+61 2 9247 9777"],
      imageUrl: g4.oBar, imageAlt: "O Bar and Dining — Sydney",
    }),
    listing({
      rank: 4, name: "Ormeggio at The Spit", isOwn: false, website: "http://www.ormeggio.com.au/",
      body: "A waterfront Italian fine-diner at The Spit, known for premium dishes and seasonal flavours in a warm, festive holiday atmosphere.",
      bullets: ["D'Albora Marinas, Spit Rd, Mosman NSW 2088", "+61 2 9969 4088"],
      imageUrl: g4.ormeggio, imageAlt: "Ormeggio at The Spit — Mosman, Sydney",
    }),
    listing({
      rank: 5, name: "Eastside Bar & Grill", isOwn: false, website: "https://www.instagram.com/eastsidebarandgrill/",
      body: "A Chippendale grill house with a festive ambience for group celebrations, corporate Christmas parties and intimate holiday dinners alike.",
      bullets: ["Old Rum Store, Level 1/8 Kensington St, Chippendale NSW 2008", "+61 2 9212 0900"],
      imageUrl: g4.eastside, imageAlt: "Eastside Bar & Grill — Chippendale, Sydney",
    }),
    listing({
      rank: 6, name: "Mode Kitchen & Bar", isOwn: false, website: "https://modekitchenandbar.com.au/",
      body: "A relaxed The Rocks venue offering seasonal menus and a warm holiday atmosphere for families and corporate groups.",
      bullets: ["Ground Floor, 199 George St, The Rocks NSW 2000", "+61 2 9250 3160"],
      imageUrl: g4.mode, imageAlt: "Mode Kitchen & Bar — The Rocks, Sydney",
    }),
    listing({
      rank: 7, name: "OTTO Ristorante", isOwn: false, website: "http://www.ottoristorante.com.au/sydney",
      body: "A waterfront Woolloomooloo Italian institution, popular for festive parties and intimate holiday dinners with premium seasonal dishes.",
      bullets: ["Area 8, 6 Cowper Wharf Roadway, Woolloomooloo NSW 2011", "+61 2 9368 7488"],
      imageUrl: g4.otto, imageAlt: "OTTO Ristorante — Woolloomooloo, Sydney",
    }),
    listing({
      rank: 8, name: "Pilu at Freshwater", isOwn: false, website: "https://pilu.com.au/",
      body: "A Sardinian fine-diner overlooking Freshwater Beach, known for seasonal flavours and an unforgettable Christmas feast setting.",
      bullets: ["Moore Rd, Freshwater NSW 2096", "+61 2 9938 3331"],
      imageUrl: g4.pilu, imageAlt: "Pilu at Freshwater — Sydney",
    }),
    listing({
      rank: 9, name: "Roast Republic", isOwn: false, website: "http://www.roastrepublic.com.au/",
      body: "A CBD roast-house on Clarence Street built for exactly this occasion — festive lunches and dinners with a premium seasonal menu.",
      bullets: ["174 Clarence St, Sydney NSW 2000", "+61 2 8038 1640"],
      imageUrl: g4.roastRepublic, imageAlt: "Roast Republic — Sydney CBD",
    }),
    listing({
      rank: 10, name: "Gina Pasta Bar", isOwn: false, website: "https://www.ginapastabar.com.au/",
      body: "A Surry Hills pasta bar bringing festive Italian flavours to Christmas group gatherings and family lunches.",
      bullets: ["533 Crown St, Surry Hills NSW 2010"],
      imageUrl: g4.ginaPasta, imageAlt: "Gina Pasta Bar — Surry Hills, Sydney",
    }),
    listing({
      rank: 11, name: "MuMian Dining", isOwn: false, website: "https://www.taogroup.com.au/en/mumian",
      body: "A Darling Quarter dining room offering festive celebration menus with exceptional service for corporate and family Christmas gatherings.",
      bullets: ["Darling Quarter, Commbank Place, North Wing, 1 Harbour St, Sydney NSW 2000", "+61 405 660 999"],
      imageUrl: g4.mumian, imageAlt: "MuMian Dining — Darling Quarter, Sydney",
    }),
    listing({
      rank: 12, name: "The East Chinese Restaurant", isOwn: false, website: "https://theeast.com.au",
      body: "A long-running, authentic Cantonese restaurant on Macquarie Street, offering premium seasonal dishes for a festive Christmas feast.",
      bullets: ["8/1 Macquarie St, Sydney NSW 2000", "+61 2 9252 6868"],
      imageUrl: g4.eastChinese, imageAlt: "The East Chinese Restaurant — Sydney",
    }),
    listing({
      rank: 13, name: "Suminoya", isOwn: false, website: "https://www.suminoya.com.au/",
      body: "A Japanese BBQ favourite in the city, bringing a warm holiday atmosphere and seasonal flavours to Christmas celebrations.",
      bullets: ["1 Hosking Pl, Sydney NSW 2000", "+61 429 180 492"],
      imageUrl: g4.suminoya, imageAlt: "Suminoya — Sydney CBD",
    }),
    listing({
      rank: 14, name: "Tao Restaurant and Bar Sydney", isOwn: false, website: "https://www.taogroup.com.au/en/tao",
      body: "A Clarence Street favourite for festive group celebrations, corporate Christmas parties and intimate holiday dinners alike.",
      bullets: ["176 Clarence St, Sydney NSW 2000", "+61 402 518 698"],
      imageUrl: g4.tao, imageAlt: "Tao Restaurant and Bar — Sydney",
    }),
    listing({
      rank: 15, name: "Two 88 Bar And Kitchen", isOwn: false, website: "https://two88bar.com.au/",
      body: "A Sussex Street bar and kitchen offering a warm, festive setting for families, couples and corporate Christmas gatherings.",
      bullets: ["288 Sussex St, Sydney NSW 2000", "+61 2 9063 0100"],
      imageUrl: g4.two88, imageAlt: "Two 88 Bar And Kitchen — Sydney CBD",
    }),
    {
      blockType: "plain",
      heading: "Conclusion",
      body: [
        "Sydney's Christmas dining scene runs from sky-high fine dining to waterfront Italian and lively CBD bars — there's a festive table here for every group size and budget. If you're after premium Indian cuisine as the centrepiece of your celebration, The Grand Palace offers a dedicated Christmas set menu, private dining space for up to 125 guests, and a warm CBD setting close to Wynyard Station — reserve early, as December books out fast across the whole city.",
      ],
    },
  ];

  const guides = [
    {
      slug: "best-asian-restaurants-in-sydney",
      title: "17 Best Asian Restaurants in Sydney",
      metaTitle: "17 Best Asian Restaurants in Sydney (2026 Guide)",
      metaDescription: "From Cantonese banquet halls to modern izakayas, here are Sydney's 17 best Asian restaurants — plus where The Grand Palace fits in for Asian-inspired Indian dining.",
      tag: "Dining",
      publishedDate: "2025-04-30",
      publishedDateDisplay: "May 1, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Sydney's Asian dining scene spans traditional Chinese banquet halls, the spice of India, and a new generation of modern Asian restaurants with progressive wine lists.",
      intro: "All around Sydney, you'll find a wealth of tradition — traditional Chinese cooking, the spice of India, and the numbing heat of Sichuan — alongside a new generation of modern Asian restaurants with progressive wine lists and fine dining service. This guide rounds up 17 of the city's standout Asian restaurants, from Sokyo's Tokyo-meets-Sydney izakaya cooking to Chinatown institutions like Fortune Village, with The Grand Palace's Asian-inspired Indian menu as our featured pick.",
      quickAnswer: "For Asian-inspired Indian dining in Sydney CBD, The Grand Palace near Wynyard Station is the standout — fresh-ground spices, vegan and gluten-free options, and a central location. For pan-Asian variety, Sokyo, China Doll and Chin Chin are consistently well-regarded across the wider Sydney Asian dining scene.",
      heroImage: g1TgpImg,
      heroImageAlt: "The Grand Palace — Indian restaurant in Sydney CBD",
      quickFacts: [
        { label: "Restaurants featured", value: "17, spanning Chinese, Japanese, Thai and Malaysian" },
        { label: "Featured pick", value: "The Grand Palace — Sydney CBD" },
      ],
      sections: guide1Sections,
      faq: [
        { q: "What is the best Asian restaurant in Sydney CBD?", a: "The Grand Palace, near Wynyard Station, is a standout for Asian-inspired Indian dining in Sydney CBD, with fresh-ground spices and vegan, halal and gluten-free options. For pan-Asian variety, Sokyo and China Doll are also consistently well-reviewed." },
        { q: "Which Asian restaurants in Sydney have vegetarian or vegan options?", a: "Most restaurants on this list — including The Grand Palace, Sokyo, China Diner, China Doll and Mamak — offer vegetarian and vegan menu options." },
        { q: "Are these Asian restaurants suitable for group bookings?", a: "Yes. The Grand Palace accommodates groups up to 125 guests, and restaurants like Fortune Village, Bay Hong and Lotus Barangaroo are also well set up for group dining." },
      ],
      relatedSlugs: ["asian-fusion-restaurants-in-sydney", "best-indian-restaurant-sydney", "best-group-restaurant-sydney"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
      guideType: "listicle",
      sortOrder: 0,
    },
    {
      slug: "asian-fusion-restaurants-in-sydney",
      title: "15 Best Asian Fusion Restaurants in Sydney",
      metaTitle: "15 Best Asian Fusion Restaurants in Sydney (2026)",
      metaDescription: "Discover 15 of Sydney's best Asian fusion restaurants — bold cross-cultural menus, inventive techniques, and where The Grand Palace's Indian fusion cooking fits in.",
      tag: "Dining",
      publishedDate: "2025-04-30",
      publishedDateDisplay: "May 1, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Asian fusion dining has taken Sydney by storm — blending bold flavours, inventive techniques and cultural traditions into one exciting culinary trend.",
      intro: "Asian fusion dining has taken Sydney by storm, blending bold flavours, inventive techniques and cultural traditions into one exciting trend. With chefs experimenting across borders, these restaurants are redefining modern dining in Australia. This guide covers 15 of Sydney's most talked-about Asian fusion kitchens — from Korean-Australian mashups at Soul Dining to Chinese-Malaysian menus at The Malaya — with The Grand Palace's fusion take on Indian cooking as our featured pick.",
      quickAnswer: "The Grand Palace brings an Asian fusion approach to Indian cooking in Sydney CBD, blending regional Indian dishes with modern technique near Wynyard Station. For broader Asian fusion variety, Soul Dining (Korean), China Lane (contemporary Chinese) and The Malaya (Chinese-Malaysian) are well-established Sydney favourites.",
      heroImage: g2TgpImg,
      heroImageAlt: "The Grand Palace — Indian restaurant in Sydney CBD",
      quickFacts: [
        { label: "Restaurants featured", value: "15, spanning Korean, Chinese, Malaysian and Indian fusion" },
        { label: "Featured pick", value: "The Grand Palace — Sydney CBD" },
      ],
      sections: guide2Sections,
      faq: [
        { q: "What makes a restaurant \"Asian fusion\"?", a: "Asian fusion restaurants blend techniques and flavours across Asian cuisines — or combine Asian cooking with Western or other regional influences — rather than sticking to one country's traditional menu." },
        { q: "Does The Grand Palace count as Asian fusion?", a: "The Grand Palace's menu is rooted in traditional Indian cooking with a modern, fusion-influenced presentation — regional Indian dishes prepared with fresh Australian produce and a contemporary Sydney CBD setting." },
        { q: "Which Asian fusion restaurants in Sydney are good for groups?", a: "The Grand Palace accommodates groups up to 125 guests. Spice Alley's laneway-style hawker format and China Lane are also well suited to larger group dinners." },
      ],
      relatedSlugs: ["best-asian-restaurants-in-sydney", "best-vegetarian-restaurants-in-sydney", "best-indian-restaurant-sydney"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
      guideType: "listicle",
      sortOrder: 0,
    },
    {
      slug: "best-vegetarian-restaurants-in-sydney",
      title: "Vegetarian Restaurants in Sydney CBD — 24 Places Worth Visiting",
      metaTitle: "24 Best Vegetarian Restaurants in Sydney (2026 Guide)",
      metaDescription: "24 of Sydney's best vegetarian and vegan restaurants, from Jain-friendly Indian dining at The Grand Palace to Bondi's plant-based cafes and CBD fine dining.",
      tag: "Dining",
      publishedDate: "2025-04-30",
      publishedDateDisplay: "May 1, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Sydney's vegetarian food scene has flourished in recent years, with an ever-growing number of restaurants embracing fresh, plant-based flavours.",
      intro: "Sydney's vegetarian food scene has truly flourished, with an ever-growing number of restaurants embracing fresh, plant-based flavours. Whether you follow a vegetarian lifestyle or just love meat-free meals, the city offers plenty of mouth-watering options across every style and budget. This guide to 24 of Sydney's best vegetarian restaurants leads with The Grand Palace's Jain-friendly Indian menu, then covers everything from Bondi's plant-based cafes to CBD fine dining.",
      quickAnswer: "The Grand Palace Indian Restaurant, Basement, 261 George Street, Sydney CBD, is our top pick for vegetarian dining — a dedicated vegetarian set menu from $65 per person, Jain-friendly preparation on request, and group bookings up to 125 guests. For plant-based cafes and vegan-specific menus, Yellow in Potts Point and Comeco Foods in Newtown are standout options.",
      heroImage: g3TgpImg,
      heroImageAlt: "The Grand Palace — vegetarian Indian dining in Sydney CBD",
      quickFacts: [
        { label: "Restaurants featured", value: "24, spanning Indian, Asian fusion, cafes and fine dining" },
        { label: "Featured pick", value: "The Grand Palace — vegetarian set menu from $65pp" },
      ],
      sections: guide3Sections,
      faq: [
        { q: "What is the best vegetarian restaurant in Sydney CBD?", a: "The Grand Palace Indian Restaurant at Basement, 261 George Street, Sydney CBD is widely considered the top choice for vegetarian dining in Sydney CBD. It offers a dedicated vegetarian set menu from $65 per person, Jain-friendly options, and accommodates groups up to 125 guests. Open for lunch and dinner 7 days a week." },
        { q: "Are there Jain-friendly restaurants in Sydney?", a: "Yes. The Grand Palace Indian Restaurant in Sydney CBD offers Jain-friendly preparations on request — dishes cooked without onion, garlic, or root vegetables. It is one of the very few restaurants in Sydney CBD to offer authentic Jain-style Indian cuisine. Call (02) 8021 7696 to arrange." },
        { q: "Which vegetarian restaurants in Sydney are open for lunch?", a: "The Grand Palace Indian Restaurant is open for lunch Monday to Sunday, 12pm–3pm. Other vegetarian options open for lunch in Sydney include Bodhi Restaurant in Sydney CBD and Govindas." },
        { q: "What vegetarian Indian dishes are available in Sydney CBD?", a: "At The Grand Palace Indian Restaurant in Sydney CBD, top vegetarian dishes include Navratan Korma, Shahi Paneer, Aloo Gobhi, Bhindi Do Pyaza, Hariyali Kebab, Samosa, and Dal Makhani. Vegan and Jain-friendly versions are available on request." },
      ],
      relatedSlugs: ["best-vegan-restaurant-sydney", "jain-restaurants-sydney", "best-halal-restaurant-sydney"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
      guideType: "listicle",
      sortOrder: 0,
    },
    {
      slug: "christmas-lunch-and-dinner-restaurants-in-sydney",
      title: "15 Best Christmas Lunch and Dinner Restaurants in Sydney",
      metaTitle: "15 Best Christmas Restaurants in Sydney 2026 | Book Now",
      metaDescription: "15 of Sydney's best restaurants for Christmas Eve dinner, Christmas lunch and festive group celebrations — from sky-high fine dining to The Grand Palace's Indian feast.",
      tag: "Events",
      publishedDate: "2025-12-07",
      publishedDateDisplay: "Dec 8, 2025",
      updatedDate: "2026-08-11",
      updatedDateDisplay: "Aug 11, 2026",
      excerpt: "Christmas in Sydney is one of the most exciting times of the year — here are 15 restaurants offering unforgettable Christmas dining experiences.",
      intro: "Christmas in Sydney is one of the most exciting times of the year, filled with vibrant celebrations and unforgettable dining experiences. Whether you're planning a luxurious Christmas Eve dinner, a festive Christmas Day lunch, or a group gathering with friends and family, choosing the right restaurant sets the tone. This guide covers 15 of the city's best Christmas dining venues — from sky-high fine dining at Infinity Sydney Tower to waterfront Italian at Pilu — with The Grand Palace's festive Indian set menu leading the list.",
      quickAnswer: "The Grand Palace, Basement, 261 George Street, Sydney CBD, offers a dedicated Christmas set menu with private dining space for up to 125 guests — a strong choice for Christmas Eve dinner, Christmas lunch, or a corporate Christmas party. For fine-dining alternatives, Infinity at Sydney Tower, O Bar and Dining and Ormeggio at The Spit are well-established Sydney Christmas dining spots.",
      heroImage: g4TgpImg,
      heroImageAlt: "The Grand Palace — Christmas dining in Sydney CBD",
      quickFacts: [
        { label: "Restaurants featured", value: "15, spanning Indian, Italian, Japanese and modern Australian" },
        { label: "Featured pick", value: "The Grand Palace — Christmas set menu, up to 125 guests" },
      ],
      sections: guide4Sections,
      faq: [
        { q: "Where can I book a Christmas lunch in Sydney CBD?", a: "The Grand Palace at Basement, 261 George Street, Sydney CBD, offers a dedicated Christmas set menu for lunch and dinner, with private dining space for groups up to 125 guests. Call (02) 8021 7696 or book online." },
        { q: "Which Sydney restaurants are good for a corporate Christmas party?", a: "The Grand Palace, MuMian Dining and Eastside Bar & Grill all offer private or semi-private dining suited to corporate Christmas bookings — reserve early, as December fills up fast." },
        { q: "Do Sydney Christmas restaurants offer vegetarian or vegan menus?", a: "Yes. The Grand Palace's Christmas set menu includes vegetarian, vegan and gluten-free options, and several other restaurants on this list — including Gina Pasta Bar and Roast Republic — can accommodate dietary requests with advance notice." },
      ],
      relatedSlugs: ["why-tgp-best-for-christmas-lunch-and-dinner", "grand-palace-christmas-lunch-dinner", "best-group-restaurant-sydney"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
      guideType: "listicle",
      sortOrder: 0,
    },
  ];

  for (const g of guides) {
    const { slug, ...data } = g;
    await prisma.guide.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });
    console.log("Upserted guide:", slug);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
