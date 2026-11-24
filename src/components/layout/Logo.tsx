import Link from "next/link";
import { cn } from "@/lib/utils";
import { LOGO_ARTWORK_ID } from "./LogoArtwork";

/**
 * Brand lockup: "Caraway" on a yellow plate bar that holds "CASH FOR CARS".
 * The lettering is outlines, not text, so the link carries the name its
 * visible words used to give it: "Caraway Cash for Cars". `tone="dark"` is
 * the white wordmark for the blue footer.
 *
 * The drawing itself is `<LogoArtwork />`, which the root layout renders
 * once; this only points at it. Without it in the document the link is empty.
 *
 * The viewBox is the artboard without its padding, so the artwork fills the
 * box: 44px tall on phones and 48px from lg up, the height of the mark this
 * replaced. Keep those two heights, or the header and footer move.
 */
export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";
  return (
    <Link
      href="/"
      prefetch={false}
      aria-label="Caraway Cash for Cars"
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        onDark ? "focus-visible:ring-offset-primary" : "focus-visible:ring-offset-background",
        className,
      )}
    >
      <svg
        viewBox="4 4 151.12 48"
        aria-hidden="true"
        focusable="false"
        className={cn(
          "h-11 w-auto shrink-0 lg:h-12",
          onDark ? "text-on-dark-hi" : "text-primary",
        )}
      >
        <use href={`#${LOGO_ARTWORK_ID}`} />
      </svg>
    </Link>
  );
}
