/**
 * Search Console-backed location consolidation (August 2026).
 *
 * Every destination is either a retained location page that now covers the
 * source area or the expanded /locations regional guide. Keep this mapping
 * shared so route redirects and relationship normalization cannot drift.
 */
export const RETIRED_LOCATION_DESTINATIONS = {
  "north-brisbane": "/locations",
  "south-brisbane": "/locations/moorooka",
  ipswich: "/locations",
  chermside: "/locations",
  indooroopilly: "/locations/toowong",
  carindale: "/locations/capalaba",
  sunnybank: "/locations/moorooka",
  "mount-gravatt": "/locations/moorooka",
  caboolture: "/locations/redcliffe",
  "browns-plains": "/locations/logan",
  "bayside-brisbane": "/locations/capalaba",
  "north-lakes": "/locations/redcliffe",
  "the-gap": "/locations/kenmore",
  bulimba: "/locations",
  hawthorne: "/locations",
  ascot: "/locations",
  clayfield: "/locations",
  "everton-park": "/locations",
  stafford: "/locations",
  nundah: "/locations",
  "new-farm": "/locations",
  paddington: "/locations/toowong",
  newstead: "/locations",
  wynnum: "/locations/capalaba",
  manly: "/locations/capalaba",
  rocklea: "/locations/moorooka",
} as const;

export type RetiredLocationSlug = keyof typeof RETIRED_LOCATION_DESTINATIONS;

export function canonicalLocationSlug(slug: string): string | null {
  const destination =
    RETIRED_LOCATION_DESTINATIONS[slug as RetiredLocationSlug];
  if (!destination) return slug;

  const match = destination.match(/^\/locations\/([^/]+)$/);
  return match?.[1] ?? null;
}
