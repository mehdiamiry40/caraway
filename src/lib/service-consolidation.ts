/**
 * Search Console-backed service consolidation (August 2026).
 *
 * These pages either duplicated a stronger service intent or had no search
 * demand after a full discovery window. Keep this map shared by Next.js
 * redirects and relationship normalization so internal links never rely on
 * a redirect and every retired URL resolves directly to a live page.
 */
export const RETIRED_SERVICE_DESTINATIONS = {
  "unwanted-cars-brisbane": "/car-removal-brisbane",
  "used-cars-brisbane": "/sell-my-car-brisbane",
  "old-cars-brisbane": "/scrap-car-removal-brisbane",
  "junk-cars-brisbane": "/scrap-car-removal-brisbane",
  "accident-cars-brisbane": "/damaged-cars-brisbane",
  "insurance-write-off-cars-brisbane": "/damaged-cars-brisbane",
  "sell-toyota-corolla-brisbane": "/cash-for-cars-brisbane",
  "sell-holden-commodore-brisbane": "/cash-for-cars-brisbane",
  "sell-ford-falcon-brisbane": "/cash-for-cars-brisbane",
  "sell-ford-ranger-brisbane": "/cash-for-cars-brisbane",
  "sell-toyota-landcruiser-brisbane": "/cash-for-cars-brisbane",
} as const;

export type RetiredServiceSlug = keyof typeof RETIRED_SERVICE_DESTINATIONS;

export function canonicalServiceSlug(slug: string): string {
  const destination =
    RETIRED_SERVICE_DESTINATIONS[slug as RetiredServiceSlug];

  return destination?.slice(1) ?? slug;
}
