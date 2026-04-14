import { SITE_URL } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

/** BreadcrumbList JSON-LD: last crumb must have a URL (Schema.org expects `item` on every ListItem). */
export function breadcrumbListSchema(items: BreadcrumbItem[], currentPageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    "@id": `${currentPageUrl}#breadcrumbs`,
    numberOfItems: items.length,
    itemListElement: items.map((bc, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: bc.label,
      item: bc.href ? `${SITE_URL}${bc.href}` : currentPageUrl,
    })),
  };
}
