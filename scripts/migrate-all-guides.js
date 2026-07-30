// One-off script — brings every guide listed on the static /guides index
// into the DB as a real (admin-manageable) row, so the admin guide count
// matches what's shown on the site and all of them can be reordered from
// /admin/guides. Safe to re-run: guides that already exist (by slug) are
// left with their real content untouched — only sortOrder gets refreshed.
// The ones that don't exist yet are created as UNPUBLISHED drafts with a
// short placeholder body (so the public site's behaviour for them doesn't
// change — they still link out to the old WordPress site until someone
// writes the real article and publishes from the admin).
import { prisma } from "../src/db.js";

const GUIDES = [
  { title: "Indian Restaurant Near Wynyard Station Sydney — 1-Minute Walk to The Grand Palace", excerpt: "If you work near Wynyard Station in Sydney CBD, you're just one minute from the finest Indian dining experience in the city.", date: "Jun 26, 2026", tag: "Local", slug: "indian-restaurant-near-wynyard-station-sydney" },
  { title: "Indian Restaurant Near Martin Place Sydney — 5 Minutes from The Grand Palace", excerpt: "Working near Martin Place? The Grand Palace is about a 5-minute walk away in Sydney CBD's George Street dining strip.", date: "Jul 22, 2026", tag: "Local", slug: "indian-restaurant-near-martin-place" },
  { title: "Indian Restaurant Near Town Hall Station Sydney — One Stop from The Grand Palace", excerpt: "Based near Town Hall? The Grand Palace is one train stop up the line at Wynyard, or a straightforward walk up George Street.", date: "Jul 22, 2026", tag: "Local", slug: "indian-restaurant-near-town-hall-station" },
  { title: "Corporate Catering Sydney CBD — Indian Food for Office Lunches & Dinners", excerpt: "Organising catering for a meeting, training session, office lunch, or corporate event? Discover how The Grand Palace delivers premium Indian catering.", date: "Jun 26, 2026", tag: "Catering", slug: "corporate-catering-sydney-cbd" },
  { title: "Best Birthday Venues in Sydney CBD for Groups — 2026 Guide", excerpt: "Choosing the right birthday venue in Sydney CBD takes more than a quick Google search. Here's everything you need to know.", date: "Jun 25, 2026", tag: "Events", slug: "best-birthday-venues-sydney-cbd" },
  { title: "Jain Restaurants in Sydney: No Onion, No Garlic Indian Food Guide 2026", excerpt: "Finding a Jain-friendly restaurant in Sydney is harder than it seems. Here's how The Grand Palace caters to Jain dietary requirements.", date: "Jun 9, 2026", tag: "Dining", slug: "jain-restaurants-sydney" },
  { title: "How to Plan Office Lunch Catering in Sydney", excerpt: "Planning office lunch catering in Sydney can feel overwhelming — especially when you are balancing dietary requirements and tight schedules.", date: "May 13, 2026", tag: "Catering", slug: "how-to-plan-office-lunch-catering-sydney" },
  { title: "Indian Wedding Catering Sydney — Your Complete Planning Guide", excerpt: "Planning the perfect Indian wedding catering in Sydney is one of the most important decisions you'll make. Here's your complete guide.", date: "May 13, 2026", tag: "Events", slug: "indian-wedding-catering-sydney" },
  { title: "Indian Food Delivery Sydney CBD — What to Order", excerpt: "Looking for the best Indian food delivery in Sydney CBD? Whether you are ordering for one or feeding a crowd, here's what to order.", date: "May 8, 2026", tag: "Dining", slug: "indian-food-delivery-sydney-cbd" },
  { title: "Best Restaurant for Birthday Dinner in Sydney", excerpt: "Searching for the best restaurant for a birthday dinner in Sydney? Whether you are planning a surprise or an intimate celebration.", date: "May 8, 2026", tag: "Events", slug: "best-restaurant-birthday-dinner-sydney" },
  { title: "Private Event Venue Hire Sydney CBD", excerpt: "Searching for the perfect private event venue in Sydney CBD for 2026? The Grand Palace offers exclusive hire options for any occasion.", date: "Apr 23, 2026", tag: "Events", slug: "private-event-venue-hire-sydney-cbd" },
  { title: "Best Halal Indian Restaurant Sydney 2026", excerpt: "Searching for a halal Indian restaurant in Sydney? The Grand Palace on George Street, Sydney CBD, is your answer.", date: "Apr 23, 2026", tag: "Dining", slug: "best-halal-indian-restaurant-sydney" },
  { title: "Best Indian Birthday Dinner Sydney 2026 — Where to Celebrate in Style", excerpt: "Planning an Indian birthday dinner in Sydney for 2026? The Grand Palace is where milestones become memories.", date: "Apr 23, 2026", tag: "Events", slug: "indian-birthday-dinner-sydney" },
  { title: "Indian Catering Box Sydney — Office Platters, Party Boxes & Corporate Orders", excerpt: "Need an Indian catering box in Sydney for your office lunch, team meeting or party? Discover our popular catering options.", date: "Apr 23, 2026", tag: "Catering", slug: "indian-catering-box-sydney" },
  { title: "Best Indian Restaurant Near Me in Sydney CBD — The Grand Palace Guide", excerpt: "If you've searched 'Indian restaurant near me' in Sydney CBD, you've likely come across The Grand Palace. Here's everything you need to know.", date: "Apr 22, 2026", tag: "Local", slug: "best-indian-restaurant-near-me-sydney-cbd" },
  { title: "Best 15 Vegan Restaurant in Sydney", excerpt: "Sydney has become a thriving destination for vegan food lovers, offering everything from plant-based fine dining to casual vegan cafes.", date: "Dec 31, 2025", tag: "Dining", slug: "best-vegan-restaurant-sydney" },
  { title: "15 Best Christmas Lunch and Dinner Restaurants in Sydney", excerpt: "Christmas in Sydney is one of the most exciting times of the year, and choosing the right restaurant is key to a perfect celebration.", date: "Dec 8, 2025", tag: "Dining", slug: "best-christmas-restaurants-sydney" },
  { title: "Christmas Corporate Catering Box by The Grand Palace", excerpt: "The festive season is a time of celebration, connection and appreciation — especially in the workplace. Make it memorable.", date: "Nov 5, 2025", tag: "Catering", slug: "christmas-corporate-catering-box" },
  { title: "Make Your Birthday Memorable with Authentic Indian Cuisine and Elegant Ambience", excerpt: "Birthdays are special — they're milestones that deserve celebration, laughter, and an unforgettable setting.", date: "Nov 5, 2025", tag: "Events", slug: "birthday-memorable-indian-cuisine" },
  { title: "Why The Grand Palace is Sydney's Favourite Spot for Christmas Lunch and Dinner", excerpt: "If you're looking to enjoy the most memorable Christmas lunch or dinner, look no further than The Grand Palace.", date: "Oct 31, 2025", tag: "Dining", slug: "grand-palace-christmas-lunch-dinner" },
  { title: "Why The Grand Palace is the Best Spot for a Relaxed Weekend Indian Lunch", excerpt: "After a long week, everyone deserves a little relaxation — and what better way than a leisurely weekend Indian lunch.", date: "Sep 23, 2025", tag: "Dining", slug: "weekend-indian-lunch-sydney" },
  { title: "Why Sydney Businesses Trust The Grand Palace for Corporate Catering", excerpt: "When planning a corporate event, the quality of catering can make or break the experience. Here's why Sydney businesses choose us.", date: "Sep 23, 2025", tag: "Catering", slug: "sydney-businesses-corporate-catering" },
  { title: "Why Our Catering Boxes Are Perfect for Parties, Office Lunches, and More", excerpt: "Finding the right catering solution for parties, office lunches, or team gatherings has never been easier.", date: "Sep 23, 2025", tag: "Catering", slug: "catering-boxes-parties-office-lunches" },
  { title: "Elevate Your Corporate Events with The Grand Palace Catering in Sydney", excerpt: "Corporate Catering in Sydney plays a central role in hosting a successful event. Discover how we elevate every occasion.", date: "Sep 23, 2025", tag: "Catering", slug: "elevate-corporate-events-grand-palace" },
  { title: "Why The Grand Palace is Sydney's Top Choice for Hosting a Memorable Diwali Party", excerpt: "Diwali, the festival of lights, is celebrated with joy and grandeur — and The Grand Palace provides the perfect backdrop.", date: "Sep 22, 2025", tag: "Events", slug: "diwali-party-sydney-grand-palace" },
  { title: "The Best Family Restaurants in Sydney", excerpt: "Finding the perfect spot for a family meal in Sydney is now easier than ever. From large groups to intimate family dinners.", date: "Jul 31, 2025", tag: "Dining", slug: "best-family-restaurants-sydney" },
  { title: "Where to Host a Royal Indian Birthday Dinner in Sydney", excerpt: "Planning a birthday dinner that feels truly special? Hosting it at an Indian fine dining restaurant elevates everything.", date: "Jul 31, 2025", tag: "Events", slug: "royal-indian-birthday-dinner-sydney" },
  { title: "Top 10 Indian Restaurants in Western Sydney You Must Try in 2025", excerpt: "Western Sydney is a vibrant melting pot of cultures, and when it comes to Indian restaurants, there's no shortage of choices.", date: "Jul 30, 2025", tag: "Local", slug: "indian-restaurants-western-sydney" },
  { title: "Best Mocktails & Drinks to Pair with Indian Food", excerpt: "Indian cuisine is known for its layers of flavour. Discover the best mocktails and drinks that complement your meal.", date: "Jul 19, 2025", tag: "Dining", slug: "mocktails-drinks-pair-indian-food" },
  { title: "Best Indian Catering Boxes for Office Lunch & Family in Sydney", excerpt: "In Sydney's vibrant multicultural landscape, food plays a pivotal role in bringing people together — especially at work.", date: "Jul 19, 2025", tag: "Catering", slug: "indian-catering-boxes-office-family-sydney" },
  { title: "Indian Fine Dining near Circular Quay", excerpt: "Circular Quay offers more than scenic views and iconic landmarks — it's also home to some of Sydney's finest dining experiences.", date: "Jun 30, 2025", tag: "Local", slug: "indian-fine-dining-circular-quay" },
  { title: "Top Restaurants for Group Dining in Pyrmont", excerpt: "Pyrmont is one of Sydney's most sought-after dining destinations, especially for group gatherings and corporate events.", date: "Jun 27, 2025", tag: "Dining", slug: "group-dining-restaurants-pyrmont" },
  { title: "Best Indian Food in Surry Hills", excerpt: "Surry Hills is one of Sydney's most dynamic food destinations, and its Indian restaurant scene is particularly impressive.", date: "Jun 26, 2025", tag: "Local", slug: "best-indian-food-surry-hills" },
  { title: "Top Vegetarian-Friendly Restaurants near Chippendale", excerpt: "Chippendale and its surrounding areas have become a popular hub for diverse and inclusive dining options in Sydney.", date: "Jun 26, 2025", tag: "Dining", slug: "vegetarian-restaurants-chippendale" },
  { title: "Best Indian Restaurant in Darling Harbour", excerpt: "Darling Harbour is one of Sydney's most iconic spots, and it's also a great place to experience authentic Indian cuisine.", date: "Jun 24, 2025", tag: "Local", slug: "indian-restaurant-darling-harbour" },
  { title: "How to Choose the Right Indian Catering for Your Sydney Event", excerpt: "Planning a successful event in Sydney requires more than a good guest list — the right catering is essential.", date: "Jun 23, 2025", tag: "Catering", slug: "choose-indian-catering-sydney-event" },
  { title: "Top 5 Indian Dishes You Must Try in Sydney", excerpt: "Explore Sydney's most beloved Indian dishes, curated by dietary preference and flavour profile.", date: "Jun 23, 2025", tag: "Dining", slug: "top-5-indian-dishes-sydney" },
  { title: "18 Best Restaurants in Sydney for Lunch", excerpt: "We know that picking what to have for lunch can be a difficult choice, with so many incredible options across the city.", date: "May 5, 2025", tag: "Dining", slug: "best-restaurants-sydney-lunch" },
  { title: "20 Best Halal Restaurant in Sydney", excerpt: "Sydney is a vibrant melting pot of cultures, and its food scene reflects this beautifully — especially for halal dining.", date: "May 2, 2025", tag: "Dining", slug: "best-halal-restaurant-sydney" },
  { title: "20 Best Indian Restaurant in Sydney", excerpt: "This article is a must read if you are looking for a mouth-watering Indian dining experience anywhere in Sydney.", date: "May 2, 2025", tag: "Dining", slug: "best-indian-restaurant-sydney" },
  { title: "18 Best Group Restaurant in Sydney", excerpt: "Do you want to find the best group restaurant in Sydney? Whether you're planning a birthday, work dinner, or family gathering.", date: "May 2, 2025", tag: "Dining", slug: "best-group-restaurant-sydney" },
  { title: "17 Best Asian Restaurants in Sydney", excerpt: "All around Sydney, you will find a wealth of tradition consisting of traditional Chinese, the spice routes of India, and much more.", date: "May 1, 2025", tag: "Dining", slug: "best-asian-restaurants-sydney" },
  { title: "18 Best Asian Fusion Restaurants In Sydney", excerpt: "Asian fusion dining has taken Sydney by storm — blending bold flavours, inventive techniques, and cultural traditions.", date: "May 1, 2025", tag: "Dining", slug: "best-asian-fusion-restaurants-sydney" },
  { title: "The 25 Best Vegetarian Restaurants in Sydney", excerpt: "Sydney's vegetarian food scene has truly flourished in recent years, with an incredible range of plant-forward dining options.", date: "May 1, 2025", tag: "Dining", slug: "best-vegetarian-restaurants-sydney" },
  { title: "15 Best Corporate Catering Services in Sydney", excerpt: "Planning a corporate event, office lunch, or business meeting in Sydney? The right catering service can elevate everything.", date: "Apr 30, 2025", tag: "Catering", slug: "best-corporate-catering-services-sydney" },
  { title: "25 Best Wedding Caterers in Sydney", excerpt: "Choosing the right caterer is essential to making your wedding day perfect. Sydney offers a diverse range of options.", date: "Apr 30, 2025", tag: "Catering", slug: "best-wedding-caterers-sydney" },
  { title: "15 Best Birthday Party Caterer in Sydney", excerpt: "When it comes to celebrating special moments, choosing the right birthday party caterers in Sydney makes all the difference.", date: "Apr 30, 2025", tag: "Catering", slug: "best-birthday-party-caterer-sydney" },
  { title: "15 Best Mother's Day Restaurant in Sydney", excerpt: "Mother's Day is just around the corner and it's time to start planning how to show your appreciation in the most special way.", date: "Apr 29, 2025", tag: "Events", slug: "best-mothers-day-restaurant-sydney" },
  { title: "20 Best Vivid Restaurant in Sydney", excerpt: "If you're looking for a unique dining experience during Vivid Sydney, then be sure to check out The Grand Palace.", date: "Apr 22, 2025", tag: "Events", slug: "best-vivid-restaurant-sydney" },
];

function toIso(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

async function main() {
  let created = 0, touched = 0;
  for (let i = 0; i < GUIDES.length; i++) {
    const g = GUIDES[i];
    const existing = await prisma.guide.findUnique({ where: { slug: g.slug } });
    if (existing) {
      await prisma.guide.update({ where: { slug: g.slug }, data: { sortOrder: i } });
      touched++;
      continue;
    }
    await prisma.guide.create({
      data: {
        slug: g.slug,
        title: g.title,
        metaTitle: g.title,
        metaDescription: g.excerpt,
        tag: g.tag,
        publishedDate: toIso(g.date),
        publishedDateDisplay: g.date,
        updatedDate: toIso(g.date),
        updatedDateDisplay: g.date,
        excerpt: g.excerpt,
        intro: g.excerpt,
        sections: [{ heading: g.title, body: [g.excerpt], blockType: "text" }],
        faq: [],
        relatedSlugs: [],
        ctaLabel: "Book a Table",
        ctaHref: "/book-a-table",
        published: false, // draft — keeps current external-link behaviour on the site until written + published
        sortOrder: i,
      },
    });
    created++;
  }
  console.log(`Created ${created} new draft guides, updated sortOrder on ${touched} existing guides.`);
}

main().finally(() => prisma.$disconnect());
