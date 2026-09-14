export interface BreadcrumbEntry {
  name: string;
  path: string; // site-relative, e.g. "/gallery" or "/gallery/abc123"
}

// Home is always position 1 — callers only pass the trail after it.
export function buildBreadcrumbJsonLd(trail: BreadcrumbEntry[], siteUrl: string) {
  const items: BreadcrumbEntry[] = [{ name: 'Home', path: '/' }, ...trail];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
