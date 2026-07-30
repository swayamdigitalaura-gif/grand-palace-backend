-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'Dining',
    "publishedDate" TEXT NOT NULL,
    "publishedDateDisplay" TEXT NOT NULL,
    "updatedDate" TEXT NOT NULL,
    "updatedDateDisplay" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "quickAnswer" TEXT,
    "quickFacts" JSONB,
    "comparisonTable" JSONB,
    "sections" JSONB NOT NULL,
    "pricingTable" JSONB,
    "externalLinks" JSONB,
    "faq" JSONB NOT NULL,
    "relatedSlugs" JSONB NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");
