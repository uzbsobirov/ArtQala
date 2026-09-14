// A painting's Category is a subject-matter tag (Nature, Portraits, ...).
// For accessory scoping we care about the physical PRODUCT TYPE instead —
// the top-level category it belongs to (Kartina, Kulolchilik, ...). A
// top-level category (no parent) is already its own product type.
export function effectiveProductType(category?: { slug: string; parent?: { slug: string } | null } | null): string | null {
  if (!category) return null;
  return category.parent?.slug ?? category.slug;
}
