import { breadcrumbListSchema as buildBreadcrumbList } from "@/lib/json-ld-schemas";
import { SITE_URL } from "@/lib/site";

export type BreadcrumbItem = { label: string; href?: string };

/**
 * BreadcrumbList JSON-LD adapter for {label, href} call sites. The last crumb
 * (no href) resolves to `currentPageUrl` because Schema.org expects `item` on
 * every ListItem. Delegates to the single builder in json-ld-schemas so all
 * pages emit an identical shape (@id + numberOfItems included).
 */
export function breadcrumbListSchema(items: BreadcrumbItem[], currentPageUrl: string) {
  return buildBreadcrumbList(
    items.map((bc) => ({
      name: bc.label,
      item: bc.href ? `${SITE_URL}${bc.href}` : currentPageUrl,
    })),
  );
}
