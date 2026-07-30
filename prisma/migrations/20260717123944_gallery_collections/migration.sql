-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "collection" TEXT NOT NULL DEFAULT 'gallery-page';

-- CreateIndex
CREATE INDEX "GalleryImage_collection_idx" ON "GalleryImage"("collection");
