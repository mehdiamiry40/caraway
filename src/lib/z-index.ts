/**
 * Centralised z-index scale. Keep every stacking context documented here so
 * there's one source of truth when deciding where a new layer belongs.
 *
 * The Tailwind classes referenced below are kept as-is in markup (Tailwind
 * can't interpolate arbitrary values at build time from a runtime constant),
 * but any component doing inline `style={{ zIndex }}` should import from
 * this module instead of hardcoding a number.
 */
export const Z_INDEX = {
  /** Fixed-position "Back to top" FAB (Tailwind: z-40). */
  backToTop: 40,
  /** Sticky site header (Tailwind: z-50). */
  header: 50,
  /** Mobile drawer + modal backdrop (Tailwind: z-[100]). */
  mobileDrawer: 100,
} as const;

export type ZIndexLayer = keyof typeof Z_INDEX;
