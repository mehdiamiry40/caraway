import retiredBlogDestinations from "../data/retired-blog-destinations.json";

type DestinationPath = `/${string}`;

for (const [slug, destination] of Object.entries(retiredBlogDestinations)) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid retired blog slug: ${slug}`);
  }
  if (!destination.startsWith("/") || destination.endsWith("/")) {
    throw new Error(`Invalid retired blog destination for ${slug}: ${destination}`);
  }
}

/**
 * Search Console-backed blog consolidation contract.
 *
 * The JSON file is the single source used by the application, Next.js
 * redirects, tests, and the standalone content-integrity script. Every value
 * must be a final live path so canonical blog retirements resolve in one hop.
 */
export const RETIRED_BLOG_DESTINATIONS = retiredBlogDestinations as Readonly<
  Record<keyof typeof retiredBlogDestinations, DestinationPath>
>;

export type RetiredBlogSlug = keyof typeof RETIRED_BLOG_DESTINATIONS;

export const RETIRED_BLOG_SLUGS = Object.freeze(
  Object.keys(RETIRED_BLOG_DESTINATIONS) as RetiredBlogSlug[],
);

const retiredBlogSlugSet = new Set<string>(RETIRED_BLOG_SLUGS);

export function isRetiredBlogSlug(slug: string): slug is RetiredBlogSlug {
  return retiredBlogSlugSet.has(slug);
}
