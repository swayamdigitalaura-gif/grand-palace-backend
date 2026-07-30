// One-off script — seeds the 11 real Google reviews the client provided as
// screenshots, replacing the generic placeholder testimonials on the
// homepage. Safe to re-run: clears existing reviews first, then re-inserts.
import { prisma } from "../src/db.js";

const REVIEWS = [
  {
    name: "Tyra L", reviewerMeta: "Local Guide · 18 reviews", source: "Google", stars: 5,
    quote: "This was my second visit to The Grand Palace and it was just as good as the first. The food was consistently solid and the service was welcoming and quick. We ordered a mix of dishes to share. The lamb shank masala was a standout, very tender and full of flavour. The cheese butter masala paired really well with the garlic naan, and the pani poori was light and refreshing. The biryani was fragrant with a nice spicy kick, while the dragon chicken curry had a subtle sweetness that balanced it out. They also have a vegetarian and vegan section, which is a nice touch. Overall, a reliable spot for a casual dinner in the city. I'd happily come back again.",
  },
  {
    name: "Rea Patel", reviewerMeta: "Local Guide · 11 reviews", source: "Google", stars: 5,
    quote: "Went here on a Thursday night and there was a lovely warm welcoming. Enjoyed the meal which was authentic and very tasty. We had the non veg banquet which was extremely well priced and the food was presented beautifully. Cannot recommend this place enough and will be coming back!",
  },
  {
    name: "Kailash Kaswan", reviewerMeta: "2 reviews", source: "Google", stars: 5,
    quote: "The place has a warm, casual vibe. Service was quick and the staff were attentive, even when it got busy. Good spot for a family dinner or catching up with friends. Mid-range pricing for Sydney. Portions are generous, so you can easily share. Felt worth it for the quality and quantity.",
  },
  {
    name: "N N", reviewerMeta: "Local Guide · 698 reviews", source: "Google", stars: 5,
    quote: "Great food and ambience. Service was top notch. Probably the one of the best Indian food we had in our trip. They have a separate vegan section as well and very good selection. They have minimum spend notices and probably that working for them. We were surprised at first but the food was so good that we ended up in spending more than that minimum amount.",
  },
  {
    name: "tastysydney", reviewerMeta: "Local Guide · 773 reviews", source: "Google", stars: 5,
    quote: "This restaurant is beautiful, and the food is delicious too. Located conveniently near Wynyard, The Grand Palace is a perfect spot for catch up, corporate lunch/dinner or events. They have great set menu with plenty of food. Extensive menu & vegetarian friendly. Vegan menu are available too. I really enjoyed all the food that I had, especially the Samosa Chaat, Butter Chicken, Masala Fish Curry & Baingan Aloo Masala (eggplant & potato curry). The Daal & the naan were so tasty. Good Ras Malai & Mango Lassi as well. Relaxing atmosphere & really great service.",
  },
  {
    name: "Colleen Scannell", reviewerMeta: "26 reviews", source: "Google", stars: 5,
    quote: "We dined it for the Lunch Special and it came with sooo much food! Such friendly servers who made suggestions for us to try! You cannot go wrong with the butter chicken!! The naan was incredible too! We may even come again for a second time while visiting sydney",
  },
  {
    name: "Shreyasi Dutta", reviewerMeta: "Local Guide · 39 reviews", source: "Google", stars: 5,
    quote: "A nice Indian restaurant in Sydney. Great ambience. Good food. Specially the starters were really good. For a get together in city, it's a really nice place to visit.",
  },
  {
    name: "Sylwia S.A.M", reviewerMeta: "Local Guide · 558 reviews", source: "Google", stars: 5,
    quote: "Where do I begin? I've never been a fan of Indian or spicy cuisine, but this restaurant completely changed my mind. It was truly the best dining experience I've ever had within the Indian cousin market, and I won't be going anywhere else! Thank you so much for looking after our table — the dinner was absolutely exquisite. I'm already salivating just looking at the photos I'm posting! Thank you again, and see you soon!",
  },
  {
    name: "Yolo", reviewerMeta: "Local Guide · 76 reviews", source: "Google", stars: 5,
    quote: "guys this butter chicken was genuinely the best i've had, it was so creamy and so delicious i actually can't get over how good it was. same with their garlic cheese naan, i just kept eating and eating and literally hoped the basket would magically replenish itself. this is lowkey my fave indian restaurant now, i also loved their lamb chops and achari seekh kebab, which were so filled with flavour! the lamb saag was also super good, the lamb was cooked so well and the flavours with the naan and rice so good. all of their curries were so delicious, big love to the grand palace! genuinely kept eating even though i was so full, i even liked their semolina crusted prawns even though i don't usually like prawn",
  },
  {
    name: "Manpreet Kaur", reviewerMeta: "3 reviews", source: "Google", stars: 5,
    quote: "I recently had the pleasure of dining at The Grand Palace, and it was an experience to remember. The Chicken 65 was a spicy and flavorful start to the meal, with just the right amount of kick. The butter naan was soft and pillowy, perfect for scooping up the rich and creamy Malai Kofta. The rice was cooked perfectly and served as a great complement to the other dishes.",
  },
  {
    name: "Bigfella lovestoeat", reviewerMeta: "Local Guide · 143 reviews", source: "Google", stars: 5,
    quote: "Love love LOVE this place, sensational food, beautiful venue, staff so kind & happy! Highly recommended for lovers of authentic Indian food, your Chefs must work so hard, the cuisine is truly amazing! As for the $35 min spend, its a good idea, most of these people complaining must work in an air conditioned office, 9-5 & never worked a day in hospitality in their life! The reason the Palace does this is not greed, it's just paying the rent, bills, taxes & salaries because lunch time trade has died in restaurants as office plebs work from home in their pyjamas & lazily order door dash! Stop whinging people & support this GREAT restaurant.",
  },
];

async function main() {
  await prisma.review.deleteMany({});
  for (let i = 0; i < REVIEWS.length; i++) {
    await prisma.review.create({ data: { ...REVIEWS[i], sortOrder: i, active: true } });
  }
  console.log(`Seeded ${REVIEWS.length} reviews.`);
}

main().finally(() => prisma.$disconnect());
