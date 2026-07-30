-- AlterTable
ALTER TABLE "MenuCategory" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "menuLabel" TEXT;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
