-- Run this once in Neon's SQL Editor (console.neon.tech -> your project -> SQL Editor)
-- to bring production in sync with the new "Accessories" feature.

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable (implicit many-to-many join table between Accessory and Category)
CREATE TABLE "_AccessoryCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccessoryCategories_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE INDEX "_AccessoryCategories_B_index" ON "_AccessoryCategories"("B");

-- AddForeignKey
ALTER TABLE "_AccessoryCategories" ADD CONSTRAINT "_AccessoryCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AccessoryCategories" ADD CONSTRAINT "_AccessoryCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable (new optional columns on Inquiry — existing rows get NULL, harmless)
ALTER TABLE "Inquiry" ADD COLUMN "selected_accessories" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN "final_price" DOUBLE PRECISION;
