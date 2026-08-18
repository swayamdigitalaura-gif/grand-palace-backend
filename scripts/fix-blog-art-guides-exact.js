// Redo of add-blog-art-guides.js: the first migration used WebFetch, which
// runs pages through a summarizing model — the saved guide text came back
// PARAPHRASED and captured ZERO real images. This script fetches the RAW
// server-rendered HTML directly via curl-equivalent (node fetch, no JS
// execution / no summarization) from the old blog-art deployment and
// extracts the EXACT visible text and REAL <img src> content photos with a
// cheerio DOM walk, then re-uploads the images to Vercel Blob and upserts
// the 23 Guide rows with verbatim content. Overwrites ONLY these 23 slugs.
// Safe to re-run — upserts by slug, re-uploads images each run (fine, blob
// URLs get random suffixes and old blobs are simply orphaned).
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

const BASE = "https://vercel-deploy-jade-five.vercel.app/blog-art/guides";

const SLUGS = [
  "best-indian-birthday-dinner-sydney-where-to-celebrate-in-style",
  "best-indian-restaurant-near-me-sydney-cbd-the-grand-palace-guide",
  "catering-boxes-in-sydney-for-parties",
  "christmas-corporate-catering-box-by-tgp",
  "corporate-catering-in-sydney-at-tgp",
  "corporate-catering-sydney-cbd",
  "find-right-indian-catering-for-event",
  "how-to-plan-office-lunch-catering-in-sydney",
  "indian-catering-box-sydney-cbd",
  "indian-catering-boxes-in-sydney",
  "indian-food-delivery-sydney-cbd",
  "indian-restaurant-near-wynyard-station-sydney",
  "indian-wedding-catering-sydney",
  "jain-restaurants-in-sydney-no-onion-no-garlic",
  "make-birthday-memorable-with-tgp",
  "mocktails-drinks-in-indian-food",
  "private-event-venue-hire-sydney",
  "restaurant-for-birthday-dinner",
  "sydney-corporate-catering-at-tgp",
  "tgp-is-best-for-a-weekend-indian-lunch",
  "where-to-host-a-royal-indian-birthday-dinner-in-sydney",
  "why-tgp-best-for-christmas-lunch-and-dinner",
  "why-tgp-is-best-for-diwali-party",
];

// Non-content metadata (tag / CTA / related-slug grouping) is organisational,
// not scraped article text, so we classify it with simple keyword heuristics
// rather than trying to scrape it from the page.
function classify(slug) {
  const s = slug;
  let tag = "Dining";
  if (/birthday/.test(s)) tag = "Events";
  else if (/catering|corporate|office-lunch|christmas-corporate/.test(s)) tag = "Catering";
  else if (/wedding|diwali|christmas-lunch|venue-hire|find-right-indian-catering/.test(s)) tag = "Events";
  else if (/restaurant-near|wynyard|jain|mocktail|weekend-indian-lunch/.test(s)) tag = "Dining";

  let ctaLabel = "Book a Table";
  let ctaHref = "/book-a-table";
  if (/birthday/.test(s)) { ctaLabel = "Book Birthday Package"; ctaHref = "/birthday-package"; }
  else if (/catering|corporate|office-lunch/.test(s)) { ctaLabel = "Order Catering"; ctaHref = "/office-catering"; }
  else if (/wedding|venue-hire|find-right-indian-catering/.test(s)) { ctaLabel = "Enquire Now"; ctaHref = "/venue-catering"; }
  else if (/diwali|christmas-lunch/.test(s)) { ctaLabel = "Book a Table"; ctaHref = "/book-a-table"; }

  return { tag, ctaLabel, ctaHref };
}

function clean(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function liText($, el) {
  const $li = $(el).clone();
  $li.find("svg").remove();
  const first = $li.children().first();
  if (first.length && clean(first.text()).length <= 2) first.remove();
  return clean($li.text());
}

function isContentP($, el) {
  const style = ($(el).attr("style") || "");
  const cls = ($(el).attr("class") || "");
  if (/rgba\(20,\s*12,\s*4,/.test(style)) return true;
  if (/oklch\(20%\s*\.02\s*60\)/.test(style)) return true;
  if (/\bcontent-p\b|\bintro-text\b/.test(cls)) return true;
  // 3rd "bare tag" template: no style / no class at all on <p>, styled purely
  // via the external stylesheet. Safe because header/footer/CTA/FAQ/author-bio
  // paragraphs in that template always carry an explicit style attribute —
  // isExcludedAncestor() also independently filters header/footer/faq/bio.
  if (!style.trim() && !cls.trim()) return true;
  return false;
}

function isExcludedAncestor($, el) {
  const $el = $(el);
  if ($el.closest("header").length || $el.closest("footer").length) return true;
  if ($el.closest(".author-bio").length) return true;
  if ($el.closest(".faq-item, .faq-grid").length) return true;
  if ($el.closest('div[style*="linear-gradient"]').length) return true; // mini CTA banners
  const text = clean($el.text());
  if (/Nirav Shah/.test(text) || /Hospitality Professional/.test(text)) return true;
  return false;
}

function extractFAQ($) {
  const faqs = [];
  $(".faq-item").each((i, el) => {
    const q = clean($(el).find(".faq-q").first().text());
    const a = clean($(el).find(".faq-a").first().text());
    if (q && a) faqs.push({ q, a });
  });
  if (faqs.length) return faqs;

  const h2 = $("h2").filter((i, el) => /Frequently Asked Questions/i.test($(el).text())).first();
  if (h2.length) {
    let grid = h2.next(".grid");
    if (!grid.length) grid = h2.parent().find(".grid").first();
    grid.children("div").each((i, el) => {
      const ps = $(el).find("p");
      if (ps.length >= 2) {
        const q = clean($(ps[0]).text());
        const a = clean($(ps[1]).text());
        if (q && a) faqs.push({ q, a });
      }
    });
  }
  return faqs;
}

function extractMeta($, html) {
  const title = clean($("title").first().text());
  const metaDescription = clean($('meta[name="description"]').attr("content") || "");
  const ogDescription = clean($('meta[property="og:description"]').attr("content") || "");
  let datePublished = null, dateModified = null, authorName = null;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).contents().text());
      const graph = json["@graph"] || [json];
      for (const node of graph) {
        if (node["@type"] === "Article") {
          datePublished = node.datePublished || datePublished;
          dateModified = node.dateModified || dateModified;
          authorName = node.author?.name || authorName;
        }
      }
    } catch (e) { /* ignore parse errors */ }
  });
  return { title, metaDescription, ogDescription, datePublished, dateModified, authorName };
}

function isoToDisplay(iso) {
  if (!iso) return null;
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

async function extractGuide(slug) {
  const url = `${BASE}/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed for ${slug}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const meta = extractMeta($, html);
  const h1 = clean($("h1").first().text());

  // Real content images: absolute wp-content URLs only (skip assets/* chrome)
  const imageUrls = [];
  $("img").each((i, el) => {
    const src = $(el).attr("src") || "";
    if (/^https:\/\/www\.thegrandpalace\.com\.au\/wp-content\/uploads\//.test(src)) {
      const alt = clean($(el).attr("alt") || "");
      if (!imageUrls.find((x) => x.src === src)) imageUrls.push({ src, alt });
    }
  });

  // Walk h2 / p / li / table / .highlight-box in document order
  const sections = [];
  const introParagraphs = [];
  let current = null;
  let stop = false;

  const nodes = $("h2, h3, p, li, table, .highlight-box").toArray();
  for (const el of nodes) {
    if (stop) break;
    const $el = $(el);
    const tag = el.tagName.toLowerCase();

    if (isExcludedAncestor($, el) && tag !== "h2" && tag !== "h3") continue;

    if (tag === "h2" || tag === "h3") {
      const headingText = clean($el.text());
      if (/Frequently Asked Questions/i.test(headingText)) { stop = true; break; }
      if (/^About the Author$/i.test(headingText) || /^More from The Grand Palace$/i.test(headingText)) {
        // skip this boilerplate heading, but don't start a bogus section for it
        current = current; // no-op, keep accumulating into whatever came before (nothing should follow it anyway)
        continue;
      }
      if (current) sections.push(current);
      current = { heading: headingText, body: [], bullets: [] };
      continue;
    }

    if (tag === "p") {
      if (!isContentP($, el)) continue;
      const text = clean($el.text());
      if (!text) continue;
      if (current) current.body.push(text);
      else introParagraphs.push(text);
      continue;
    }

    if (tag === "li") {
      const $ul = $el.closest("ul");
      if (!$ul.length) continue;
      const ulStyle = $ul.attr("style") || "";
      const ulClass = $ul.attr("class") || "";
      const isBreadcrumb = $el.closest("ol").length > 0 || /gap-1\.5/.test($ul.attr("class") || "") && $ul.closest("nav, .flex.items-center.text-\\[12px\\]").length;
      if (isBreadcrumb) continue;
      const liStyle = $el.attr("style") || "";
      const liClass = $el.attr("class") || "";
      const bareTemplate = !ulStyle.trim() && !ulClass.trim() && !liStyle.trim() && !liClass.trim();
      const looksLikeContent = /rgba\(20,\s*12,\s*4,/.test(ulStyle) || /bullet-list/.test(ulClass) || /rgba\(20,\s*12,\s*4,/.test(liStyle) || bareTemplate;
      if (!looksLikeContent) continue;
      const text = liText($, el);
      if (!text) continue;
      if (current) current.bullets.push(text);
      continue;
    }

    if (tag === "table") {
      const rows = [];
      $el.find("tbody tr").each((i, tr) => {
        const cells = $(tr).find("td").map((j, td) => clean($(td).text())).get();
        if (cells.length) rows.push(cells.join(" — "));
      });
      if (current) current.body.push(...rows);
      continue;
    }

    if (tag === "div") { // .highlight-box
      const text = clean($el.text());
      if (text && current) current.body.push(text);
      continue;
    }
  }
  if (current) sections.push(current);

  // drop empty sections
  const cleanSections = sections
    .map((s) => ({
      heading: s.heading,
      body: s.body.filter(Boolean),
      ...(s.bullets.length ? { bullets: s.bullets.filter(Boolean) } : {}),
    }))
    .filter((s) => s.heading && (s.body.length || (s.bullets && s.bullets.length)));

  const faq = extractFAQ($);

  return {
    slug,
    h1,
    metaTitle: meta.title,
    metaDescription: meta.metaDescription,
    excerpt: meta.ogDescription || meta.metaDescription,
    intro: introParagraphs.join("\n\n"),
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    sections: cleanSections,
    faq,
    imageUrls,
  };
}

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
  const results = [];
  for (const slug of SLUGS) {
    process.stdout.write(`Processing ${slug} ... `);
    try {
      const extracted = await extractGuide(slug);
      const { tag, ctaLabel, ctaHref } = classify(slug);

      // Upload real images, assign to sections in order (first available slot)
      const uploadedImages = [];
      for (const img of extracted.imageUrls) {
        try {
          const blobUrl = await uploadImage(img.src);
          uploadedImages.push({ url: blobUrl, alt: img.alt });
        } catch (e) {
          console.warn(`\n  [image upload failed] ${img.src}: ${e.message}`);
        }
      }
      let imgIdx = 0;
      for (const section of extracted.sections) {
        if (imgIdx < uploadedImages.length) {
          section.image = uploadedImages[imgIdx].url;
          section.imageAlt = uploadedImages[imgIdx].alt || extracted.h1;
          imgIdx++;
        }
      }

      const todayIso = new Date().toISOString().slice(0, 10);
      const publishedDate = extracted.datePublished ? extracted.datePublished.slice(0, 10) : todayIso;
      const updatedDate = extracted.dateModified ? extracted.dateModified.slice(0, 10) : todayIso;

      const data = {
        title: extracted.h1,
        metaTitle: extracted.metaTitle,
        metaDescription: extracted.metaDescription,
        tag,
        publishedDate,
        publishedDateDisplay: isoToDisplay(publishedDate) || publishedDate,
        updatedDate,
        updatedDateDisplay: isoToDisplay(updatedDate) || updatedDate,
        excerpt: extracted.excerpt,
        intro: extracted.intro,
        sections: extracted.sections,
        faq: extracted.faq,
        relatedSlugs: [],
        ctaLabel,
        ctaHref,
        published: true,
        guideType: "normal",
      };

      await prisma.guide.upsert({
        where: { slug },
        create: { slug, ...data },
        update: data,
      });

      console.log(`OK — ${extracted.sections.length} sections, ${uploadedImages.length} images, ${extracted.faq.length} FAQs`);
      results.push({ slug, ok: true, sections: extracted.sections.length, images: uploadedImages.length, faqs: extracted.faq.length });
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
      results.push({ slug, ok: false, error: e.message });
    }
  }

  console.log("\n=== SUMMARY ===");
  for (const r of results) {
    if (r.ok) console.log(`OK   ${r.slug} — sections:${r.sections} images:${r.images} faqs:${r.faqs}`);
    else console.log(`FAIL ${r.slug} — ${r.error}`);
  }
  const okCount = results.filter((r) => r.ok).length;
  console.log(`\n${okCount}/${results.length} succeeded.`);
  const noImages = results.filter((r) => r.ok && r.images === 0).map((r) => r.slug);
  if (noImages.length) console.log(`No real images found for: ${noImages.join(", ")}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
