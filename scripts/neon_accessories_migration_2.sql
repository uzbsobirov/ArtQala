-- Run this in Neon's SQL Editor AFTER neon_accessories_migration.sql (which you
-- already ran). This follow-up reworks Accessory scoping from painting
-- Category to a simple product-type tag, and extends the same
-- accessories/final-price pattern to ServiceRequest (Services page).

-- The old category-based scoping is replaced by "product_types" below.
DROP TABLE IF EXISTS "_AccessoryCategories";

-- AlterTable
ALTER TABLE "Accessory" ADD COLUMN "product_types" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable (same accessory-snapshot / internal final-price pattern as Inquiry)
ALTER TABLE "ServiceRequest" ADD COLUMN "selected_accessories" TEXT;
ALTER TABLE "ServiceRequest" ADD COLUMN "final_price" DOUBLE PRECISION;
