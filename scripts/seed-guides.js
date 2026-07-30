// One-off seed: migrates the 3 already-built dining guides (vegan, halal,
// Chippendale-vegetarian listicles) from the frontend's static guidesContent.tsx
// into the Guide table, so they become admin-editable. Safe to re-run —
// upserts by slug.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";

const prisma = new PrismaClient();

async function uploadStorefrontImage() {
  const filePath = "D:/claudeproject/The Grand Palace 2.0/palace-art-reimagined-main/src/assets/grand-palace-storefront.jpg";
  const buffer = await readFile(filePath);
  const blob = await put("grand-palace-storefront.jpg", buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/jpeg",
  });
  return blob.url;
}

async function main() {
  const storefrontUrl = await uploadStorefrontImage();
  console.log("Uploaded storefront image:", storefrontUrl);

  const grandPalaceImage = { image: storefrontUrl, imageAlt: "The Grand Palace Indian Restaurant storefront on George Street, Sydney CBD" };

  const guides = [
    {
      slug: "best-vegan-restaurant-sydney",
      title: "Best 15 Vegan Restaurant in Sydney",
      metaTitle: "Best Vegan Restaurant in Sydney | The Grand Palace",
      metaDescription: "Looking for vegan-friendly Indian food in Sydney CBD? The Grand Palace serves dedicated vegan dishes across starters, curries and biryanis — here's what to order and what to check before you book.",
      tag: "Dining",
      publishedDate: "2025-12-31",
      publishedDateDisplay: "Dec 31, 2025",
      updatedDate: "2026-07-27",
      updatedDateDisplay: "Jul 27, 2026",
      excerpt: "Sydney has become a thriving destination for vegan food lovers, offering everything from plant-based fine dining to casual vegan cafes.",
      intro: "Vegan dining in Sydney has moved well beyond salads and smoothie bowls — plant-based eaters now expect the same depth of flavour, feature-for-feature, as everyone else at the table. Below is a genuine cross-section of the city's standout vegan and vegan-friendly kitchens: fully plant-based fine diners, neighbourhood cafés, a vegan pub, and a proper Indian menu with vegan dishes built in from the start. Each listing covers what it's best for, its stand-out features, and its dietary flexibility — including where we, [The Grand Palace](/menu), fit into that picture, and what to actually check before you book anywhere.",
      quickAnswer: "For a full sit-down vegan Indian meal in Sydney CBD, The Grand Palace serves a dedicated line of vegan dishes across starters, curries, rice and biryani, available lunch and dinner, daily. For fully plant-based fine dining, Yellow in Potts Point is Sydney's best-known option; for casual and inner-west dining, Yulli's, Gigi Pizzeria, Miss Sina and Mama B's at the Chippo Hotel are well-regarded choices.",
      quickFacts: [
        { label: "Vegan dishes at The Grand Palace", value: "Lunch and dinner, every day" },
        { label: "Dietary flexibility", value: "Vegan, vegetarian, gluten-friendly, halal — all on one menu" },
      ],
      comparisonTable: {
        title: "Compare at a Glance",
        note: "The Grand Palace runs a mixed halal Indian menu with a dedicated vegan selection; the rest of the list is fully vegan kitchens.",
        rows: [
          { name: "The Grand Palace", area: "Sydney CBD", style: "Indian fine dining", dietary: "Vegan dishes + halal, vegetarian menu", goodForGroups: true, highlight: true },
          { name: "Yellow", area: "Potts Point", style: "Vegan fine dining", dietary: "Fully vegan, GF options", goodForGroups: false },
          { name: "Towzen", area: "Sydney CBD", style: "Japanese-inspired", dietary: "Fully vegan", goodForGroups: false },
          { name: "Gigi Pizzeria", area: "Newtown", style: "Vegan pizzeria", dietary: "Fully vegan, GF bases", goodForGroups: false },
          { name: "Yulli's", area: "Surry Hills", style: "Small plates / bar", dietary: "Plant-based menu, GF options", goodForGroups: true },
          { name: "Miss Sina", area: "Marrickville", style: "Vegan bakery & café", dietary: "Fully vegan", goodForGroups: false },
          { name: "Mama B's (Chippo Hotel)", area: "Chippendale", style: "Vegan pub food", dietary: "Fully vegan", goodForGroups: true },
          { name: "Little Turtle", area: "Enmore", style: "Vegan Thai", dietary: "Fully vegan", goodForGroups: false },
          { name: "Golden Lotus", area: "Newtown", style: "Vegan Vietnamese, BYO", dietary: "Fully vegan", goodForGroups: false },
        ],
      },
      sections: [
        { heading: "What actually makes a restaurant vegan-friendly", body: ["A single 'vegan option' bolted onto an otherwise meat-and-dairy-heavy menu isn't the same as a kitchen that treats plant-based dining as standard. The difference worth checking for: dishes clearly labelled vegan across every course (not just entrées), a kitchen willing to adjust standard dishes on request, and enough range that a group with mixed dietary needs can still share plates comfortably. The list below includes both fully vegan venues and mixed-menu restaurants — like ours — that take vegan dining seriously rather than treating it as an afterthought."] },
        { heading: "1. The Grand Palace — Sydney CBD", ...grandPalaceImage, body: ["Our own kitchen, in the basement at 261 George Street, keeps a proper spread of vegan dishes across starters, lentil and vegetable curries, rice and biryani, drawing on North Indian vegetarian cooking that's naturally plant-based once dairy and ghee are removed. It's best suited to a group booking or a proper sit-down meal rather than a quick solo lunch."], bullets: ["Best for: a full multi-course vegan Indian meal, including group set menu banquets", "Try: Chana Masala, Dal Tadka (vegan preparation), Baingan Bharta, Vegetable Biryani", "Features: palace-inspired dining room, five private dining spaces, seats up to 125", "Dietary options: vegan, vegetarian, halal, gluten-friendly and Jain (no onion/no garlic) on request", "[Book a table](/book-a-table) or [view the full menu](/menu)"] },
        { heading: "2. Yellow — Potts Point", bannerIcon: "fine-dining", body: ["An award-winning, fully vegan fine diner known for its seasonal, produce-driven multi-course tasting menu — a genuine plant-based degustation rather than a vegetable side-dish approach."], bullets: ["Best for: a special-occasion vegan fine dining experience", "Features: seasonal tasting menu, wine and non-alcoholic pairing options, nature-inspired dining room", "Dietary options: fully vegan menu, with gluten-free adaptations available — worth confirming any allergies when booking"] },
        { heading: "3. Towzen — Sydney CBD", bannerIcon: "ramen", body: ["A fully vegan restaurant with roots in Kyoto-style cooking, known for dishes like its Truffle Ramen made with a walnut-mylk broth — a good option if you want vegan food that doesn't taste like a substitution."], bullets: ["Best for: modern, Japanese-influenced vegan cooking", "Features: Kyoto-inspired small plates and ramen, central CBD location", "Dietary options: fully vegan menu"] },
        { heading: "4. Gigi Pizzeria — Newtown", bannerIcon: "pizza", body: ["A vegan pizzeria that's also a certified member of the Associazione Verace Pizza Napoletana, meaning the wood-fired, Napoletana-style bases are held to the same standard as traditional Italian pizzerias — just entirely plant-based. It's popular enough that they don't take bookings, so an early arrival helps on weekends."], bullets: ["Best for: casual vegan pizza night", "Features: wood-fired Napoletana-style pizza, no reservations (walk-in only)", "Dietary options: fully vegan menu, with gluten-free bases available"] },
        { heading: "5. Yulli's — Surry Hills", bannerIcon: "smallplates", body: ["One of Sydney's longer-running vegetarian and vegan-friendly restaurants, with a globally-inspired small-plates menu that's popular for relaxed group dinners."], bullets: ["Best for: a casual vegan-friendly group dinner in Surry Hills", "Features: eclectic small-plates sharing menu, relaxed bar-restaurant atmosphere", "Dietary options: fully plant-based dishes throughout, with a separate gluten-free menu"] },
        { heading: "6. Miss Sina — Marrickville", bannerIcon: "bakery", body: ["A fully vegan bakery and café known for brunch dishes and baked goods, including German-inspired pastries and its well-known cinnamon scrolls."], bullets: ["Best for: vegan brunch and bakery treats", "Features: fresh-baked pastries daily, casual café setting", "Dietary options: fully vegan menu throughout"] },
        { heading: "7. Mama B's at the Chippo Hotel — Chippendale", bannerIcon: "pub", body: ["Sydney's first fully vegan pub bistro, serving plant-based takes on classic pub food inside the Chippo Hotel — itself Australia's first all-vegan pub, including the bar."], bullets: ["Best for: vegan pub food with a proper pub atmosphere", "Features: classic pub-food menu (burgers, bangers and mash, loaded fries) made fully plant-based, full bar", "Dietary options: fully vegan kitchen and bar"] },
        { heading: "8. Little Turtle — Enmore", bannerIcon: "thai", body: ["A popular, fully vegan Thai kitchen known for reworking classic Thai dishes into plant-based versions without losing the flavour balance the cuisine is known for."], bullets: ["Best for: vegan Thai food", "Features: cosy, stylish dining room; classic Thai dishes reworked plant-based", "Dietary options: fully vegan menu"] },
        { heading: "9. Golden Lotus — Newtown", bannerIcon: "vietnamese", body: ["A budget-friendly, BYO Vietnamese restaurant directly across from Newtown Station, easily spotted by its pink 'Veganism Is Magic' neon sign. A solid pick if you want a quick, inexpensive vegan meal rather than a sit-down occasion."], bullets: ["Best for: a quick, inexpensive vegan Vietnamese meal", "Features: BYO, casual walk-in dining, right next to Newtown Station", "Dietary options: fully vegan menu"] },
        { heading: "Wrapping up", body: ["Sydney's vegan scene spans a genuinely wide range — from a five-course tasting menu at Yellow to a quick pub feed at Mama B's, with a lot of ground in between. For a full sit-down Indian meal with proper depth across starters, curries and biryani — and the option to bring a group with mixed dietary needs to the same table — [The Grand Palace](/menu) remains our recommendation, with [set menu banquets](/set-menu) making group ordering simple."] },
      ],
      faq: [
        { q: "Does The Grand Palace have a dedicated vegan menu?", a: "Yes — vegan dishes are clearly marked across starters, curries, rice and biryani, and the kitchen can adjust select standard dishes to remove dairy and ghee on request." },
        { q: "What's the best vegan restaurant in Sydney for a group booking?", a: "It depends on the group — for a full sit-down Indian meal with a shared vegan set menu, The Grand Palace's group banquets work well; for a fully plant-based menu across the whole table, Yulli's or Mama B's at the Chippo Hotel are solid casual options." },
        { q: "Is Indian food naturally vegan-friendly?", a: "A lot of it is — dishes built around lentils, chickpeas and vegetables are traditionally plant-based. The main things to check are ghee (clarified butter) and cream, which most Indian kitchens, including ours, can substitute out on request." },
        { q: "Which of these restaurants are fully vegan, versus vegan-friendly?", a: "Yellow, Towzen, Gigi Pizzeria, Miss Sina, Mama B's, Little Turtle and Golden Lotus are fully vegan kitchens. Yulli's is vegetarian-based with extensive vegan options. The Grand Palace is a mixed halal Indian menu with a dedicated vegan selection rather than an all-vegan kitchen." },
      ],
      externalLinks: [
        { label: "More vegan dining recommendations across Sydney", href: "https://www.sydney.com/articles/the-best-vegan-restaurants-in-sydney", source: "Sydney.com — official Destination NSW tourism guide" },
      ],
      relatedSlugs: ["best-halal-restaurant-sydney", "vegetarian-restaurants-chippendale", "jain-restaurants-sydney"],
      ctaLabel: "View the Menu",
      ctaHref: "/menu",
    },
    {
      slug: "best-halal-restaurant-sydney",
      title: "20 Best Halal Restaurant in Sydney",
      metaTitle: "Best Halal Restaurant in Sydney | The Grand Palace",
      metaDescription: "Searching for a genuinely halal-certified restaurant in Sydney CBD? The Grand Palace uses halal-certified meat across its entire non-vegetarian menu — here's what to check and what to order.",
      tag: "Dining",
      publishedDate: "2025-05-02",
      publishedDateDisplay: "May 2, 2025",
      updatedDate: "2026-07-27",
      updatedDateDisplay: "Jul 27, 2026",
      excerpt: "Sydney is a vibrant melting pot of cultures, and its food scene reflects this beautifully — especially for halal dining.",
      intro: "\"Halal-friendly\" and \"halal-certified\" get used interchangeably online, but they're not the same thing — one means some menu items happen to avoid pork, the other means a verified supply chain and kitchen process. Below is a genuine cross-section of Sydney CBD's halal dining scene — from certified Indian and Malaysian kitchens to Turkish and Lebanese options — including where [The Grand Palace](/menu) fits in, and what to actually check before you book anywhere.",
      quickAnswer: "The Grand Palace is a fully halal-certified Indian restaurant in Sydney CBD, with certified meat across the entire non-vegetarian menu. For other cuisines, Ipoh on York (Malaysian hawker-style) and Neptune Palace (Malaysian/Cantonese) are well-known halal-certified options in the CBD, alongside Mecca Bah (Middle Eastern, Darling Harbour) and Jounieh (Lebanese, Walsh Bay).",
      quickFacts: [
        { label: "Certification", value: "Halal-certified across our full non-vegetarian menu" },
        { label: "Also accommodates", value: "Vegetarian, vegan, gluten-friendly and Jain requests" },
      ],
      comparisonTable: {
        title: "Compare at a Glance",
        note: "All restaurants below use halal-certified meat. The Grand Palace's certification covers our entire non-vegetarian menu.",
        rows: [
          { name: "The Grand Palace", area: "Sydney CBD", style: "Indian fine dining", dietary: "Halal-certified + vegetarian, vegan", goodForGroups: true, highlight: true },
          { name: "Ipoh on York", area: "Sydney CBD", style: "Malaysian hawker-style", dietary: "Halal-certified", goodForGroups: false },
          { name: "Neptune Palace", area: "Circular Quay", style: "Malaysian & Cantonese", dietary: "Halal-certified", goodForGroups: true },
          { name: "Mecca Bah", area: "Darling Harbour", style: "Middle Eastern", dietary: "Halal-certified", goodForGroups: true },
          { name: "Jounieh", area: "Walsh Bay", style: "Lebanese", dietary: "Halal-certified", goodForGroups: true },
        ],
      },
      sections: [
        { heading: "What to actually check when a menu says 'halal'", body: ["Ask three things: is the meat sourced from a certified halal supplier, is it prepared separately from non-halal ingredients, and does the certification cover the whole menu or just some dishes? A restaurant can be broadly Muslim-friendly without every dish being certified — worth clarifying if it matters to your group. The list below mixes certified kitchens across several cuisines so you can compare."] },
        { heading: "1. The Grand Palace — Sydney CBD", ...grandPalaceImage, body: ["In the basement at 261 George Street, our entire non-vegetarian menu uses halal-certified meat from certified suppliers, with no pork or alcohol used in food preparation — not a handful of halal-labelled dishes on an otherwise mixed menu."], bullets: ["Try: Murgh Afghani Tikka, Butter Chicken, Kashmiri Rogan Josh, Chicken Tikka Masala", "For groups: [set menu banquets](/set-menu) from $65 per person, built around halal mains with vegetarian sides", "Also accommodates: vegetarian, vegan, gluten-friendly and Jain (no onion/no garlic) requests — see our [Jain dining guide](/guides/jain-restaurants-sydney)", "[Book a table](/book-a-table) or [view the full menu](/menu)"] },
        { heading: "2. Ipoh on York — Sydney CBD", bannerIcon: "malaysian", body: ["A halal-certified Malaysian food hall in the heart of the CBD, popular with office workers at lunchtime for laksa, char kway teow and chicken rice."], bullets: ["Best for: a quick halal Malaysian lunch in the CBD"] },
        { heading: "3. Neptune Palace — Sydney CBD", bannerIcon: "fine-dining", body: ["A long-running halal-certified Malaysian and Cantonese restaurant with an extensive menu, known for its murtabak — spiced beef mince wrapped in roti canai."], bullets: ["Best for: a bigger group Malaysian/Cantonese menu"] },
        { heading: "4. Mecca Bah — Darling Harbour", bannerIcon: "middleeastern", body: ["A halal-certified Middle Eastern and Mediterranean restaurant at King Street Wharf, Darling Harbour, known for mezze platters and tagines with waterfront views."], bullets: ["Best for: halal Middle Eastern dining with a harbour view"] },
        { heading: "5. Jounieh — Walsh Bay", bannerIcon: "lebanese", body: ["A Lebanese restaurant in Walsh Bay with waterfront views, offering a more refined take on Lebanese dining than the typical casual grill house."], bullets: ["Best for: a sit-down Lebanese dinner with a view"] },
      ],
      faq: [
        { q: "Is The Grand Palace fully halal certified, or just some dishes?", a: "The entire non-vegetarian menu uses halal-certified meat from certified suppliers — it's not limited to a handful of dishes. No pork or alcohol is used in food preparation." },
        { q: "What halal options are there in Sydney CBD besides Indian food?", a: "Malaysian (Ipoh on York, Neptune Palace), Middle Eastern (Mecca Bah) and Lebanese (Jounieh) are all well-regarded halal-certified options within or near the CBD." },
        { q: "Do I need to request halal specifically when booking at The Grand Palace?", a: "No — the entire non-vegetarian menu is halal-certified by default. You only need to flag additional dietary needs, like Jain or gluten-free preparation." },
      ],
      externalLinks: [
        { label: "Sydney dining and food precincts", href: "https://www.sydney.com/", source: "Destination NSW — official Sydney tourism site" },
      ],
      relatedSlugs: ["best-halal-indian-restaurant-sydney", "best-vegan-restaurant-sydney", "jain-restaurants-sydney"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
    },
    {
      slug: "vegetarian-restaurants-chippendale",
      title: "Top Vegetarian-Friendly Restaurants near Chippendale",
      metaTitle: "Vegetarian-Friendly Indian Restaurant near Chippendale | The Grand Palace",
      metaDescription: "Based near Chippendale and after proper sit-down vegetarian Indian food? The Grand Palace in Sydney CBD is a short trip away, with a full vegetarian and vegan menu.",
      tag: "Dining",
      publishedDate: "2025-06-26",
      publishedDateDisplay: "Jun 26, 2025",
      updatedDate: "2026-07-27",
      updatedDateDisplay: "Jul 27, 2026",
      excerpt: "Chippendale and its surrounding areas have become a popular hub for diverse and inclusive dining options in Sydney.",
      intro: "Chippendale has built a strong reputation for its own café, small-bar and hawker-alley dining scene, with a genuinely good spread of vegetarian options within walking distance. Below is an honest look at the standout vegetarian-friendly spots in and around Chippendale — including [The Grand Palace](/menu), a short trip north in Sydney CBD, for when you want a full multi-course vegetarian Indian menu rather than a single plant-based special.",
      quickAnswer: "For casual vegetarian dining right in Chippendale, Spice Alley and Andiamo Trattoria are both local options within walking distance. For a full sit-down vegetarian Indian meal, The Grand Palace in Sydney CBD is roughly a 20-minute walk or a short trip via Central Station, with vegetarian dishes served across the whole menu, lunch and dinner, daily.",
      quickFacts: [
        { label: "Distance from Chippendale to The Grand Palace", value: "~2.5km — short train, taxi or rideshare trip via Central" },
        { label: "Vegetarian & vegan dishes", value: "Available across the full menu, lunch and dinner" },
      ],
      comparisonTable: {
        title: "Compare at a Glance",
        note: "Mina Maria's main restaurant is in Newtown, with a smaller counter in Chippendale itself — everything else listed is directly in or immediately around Chippendale.",
        rows: [
          { name: "The Grand Palace", area: "Sydney CBD", style: "Indian fine dining", dietary: "Vegetarian, vegan, halal, GF", goodForGroups: true, highlight: true },
          { name: "Spice Alley", area: "Chippendale", style: "Asian hawker laneway", dietary: "Vegetarian-friendly stalls", goodForGroups: true },
          { name: "Mina Maria", area: "Newtown (Chippendale counter)", style: "Vegan café", dietary: "Fully vegan", goodForGroups: false },
          { name: "Andiamo Trattoria", area: "Chippendale", style: "Vegetarian Italian", dietary: "Vegetarian + vegan menu", goodForGroups: true },
          { name: "Hari's Vegetarian", area: "Haymarket", style: "Vegetarian Indian-style", dietary: "Fully vegetarian/vegan", goodForGroups: false },
        ],
      },
      sections: [
        { heading: "1. The Grand Palace — Sydney CBD", ...grandPalaceImage, body: ["The most direct route from Chippendale is via Central Station, followed by a walk north up George Street toward Wynyard — our basement entrance at 261 George Street is on the way. By car or rideshare it's usually well under 10 minutes outside peak traffic. It's a different kind of meal to a quick vegetarian bite: a full multi-course Indian menu, better suited to a group dinner or a slower weekend lunch."], bullets: ["Try: Shahi Paneer, Paneer Butter Masala, Dal Makhani, Vegetable Biryani", "For groups: [set menu banquets](/set-menu) from $65 per person include a dedicated vegetarian tier", "Also accommodates: vegan, gluten-friendly and halal requests on the same menu", "[Book a table](/book-a-table), [view the menu](/menu) or see our [location and directions](/contact)"] },
        { heading: "2. Spice Alley — Chippendale", bannerIcon: "ramen", body: ["An open-air hawker-style laneway right in Chippendale, with a rotating line-up of Asian food stalls — a good option if you want to graze across a few different vegetarian dishes casually rather than sit down to a set menu."], bullets: ["Best for: casual, walk-up vegetarian street food in Chippendale itself"] },
        { heading: "3. Mina Maria — Newtown, with a Chippendale counter", bannerIcon: "bakery", body: ["Mina Maria's main plant-based restaurant is on King Street in Newtown; it also runs a smaller retail counter in Chippendale, inside The Old Rum Store on Kensington Street. Worth knowing which location you're heading to before you go."], bullets: ["Best for: vegan café food, if you don't mind the short trip to the Newtown restaurant"] },
        { heading: "4. Andiamo Trattoria — Chippendale", bannerIcon: "pizza", body: ["A vegetarian and vegan-friendly Italian spot in the heart of Chippendale, popular for its relaxed atmosphere and service."], bullets: ["Best for: vegetarian Italian in Chippendale"] },
        { heading: "5. Hari's Vegetarian — Haymarket", bannerIcon: "smallplates", body: ["A relaxed vegan and vegetarian restaurant with a strong Indian-leaning menu — curries, dal, salads and quick bites — in Haymarket, a short trip from Chippendale."], bullets: ["Best for: casual vegan/vegetarian Indian-style food"] },
      ],
      faq: [
        { q: "How far is The Grand Palace from Chippendale?", a: "About 2.5km — roughly a 20-minute walk, a short trip via Central Station, or under 10 minutes by car or rideshare outside peak traffic." },
        { q: "Is there vegetarian food within walking distance of Chippendale itself?", a: "Yes — Spice Alley and Andiamo Trattoria are both vegetarian-friendly options right in Chippendale. Mina Maria's main restaurant is a short trip away in Newtown, though it has a small retail counter in Chippendale too." },
        { q: "Where should I go from Chippendale for a full vegetarian Indian menu, not just a couple of dishes?", a: "The Grand Palace in Sydney CBD — vegetarian dishes span starters, paneer and lentil curries, biryani and breads, with vegan and gluten-friendly options clearly marked throughout, plus set menu banquets for groups." },
      ],
      externalLinks: [
        { label: "Getting around Sydney CBD and Central", href: "https://transportnsw.info/", source: "Transport for NSW" },
      ],
      relatedSlugs: ["best-vegan-restaurant-sydney", "best-halal-restaurant-sydney", "indian-restaurant-near-town-hall-station"],
      ctaLabel: "Book a Table",
      ctaHref: "/book-a-table",
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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
