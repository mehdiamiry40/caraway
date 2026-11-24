import {
  LOGO_BAR_PATH,
  LOGO_SUBLINE_PATH,
  LOGO_WORDMARK_PATH,
} from "./logo-paths";

/** What every `<Logo>` points at. */
export const LOGO_ARTWORK_ID = "caraway-logo";

/**
 * The logo's outlines, drawn once per document. The root layout renders this;
 * every `<Logo>` on the page points at it.
 *
 * The outlines are 14 KB. Drawn inside `<Logo>` they would be written into
 * each page's RSC payload twice (header and footer), and a page view
 * prefetches a few dozen of those. The layout is sent once and kept across
 * navigations, so the outlines live here instead.
 *
 * The wordmark takes the `color` of the `<svg>` that uses it, which is how
 * one drawing serves both the white header and the blue footer.
 *
 * Keep this file free of client components: the layout imports it, and
 * anything client-side it pulled in would be loaded on every route.
 */
export function LogoArtwork() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute"
    >
      <defs>
        <g id={LOGO_ARTWORK_ID} transform="translate(4 32.32)">
          <path className="fill-plate" d={LOGO_BAR_PATH} />
          <path className="fill-plate-foreground" d={LOGO_SUBLINE_PATH} />
          <path fill="currentColor" d={LOGO_WORDMARK_PATH} />
        </g>
      </defs>
    </svg>
  );
}
