import Link from "next/link";
import { cn } from "@/lib/utils";

/** Yellow plate with a car front: the same drawing as public/favicon.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect width="180" height="180" className="fill-cta" />
      <path
        className="fill-ink-deep"
        d="M38 108 L47 72 C49 63 57 57 66 57 L114 57 C123 57 131 63 133 72 L142 108 L142 131 C142 134 140 136 137 136 L128 136 C125 136 123 134 123 131 L123 124 L57 124 L57 131 C57 134 55 136 52 136 L43 136 C40 136 38 134 38 131 Z"
      />
      <path
        className="fill-cta"
        d="M59 75 C60 71 63 69 67 69 L113 69 C117 69 120 71 121 75 L127 96 L53 96 Z"
      />
      <rect x="48" y="104" width="20" height="9" className="fill-cta" />
      <rect x="112" y="104" width="20" height="9" className="fill-cta" />
    </svg>
  );
}

/**
 * Brand lockup for the dark header and footer. The visible words make up the
 * link's accessible name, so it reads "Caraway Cash for Cars".
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        className,
      )}
    >
      <LogoMark className="h-10 w-10 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-rotate-3 motion-reduce:transition-none" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.75rem] font-extrabold uppercase leading-[0.9] tracking-[0.03em] text-on-dark-hi">
          Caraway
        </span>
        <span className="mt-1 text-[0.625rem] font-bold uppercase leading-none tracking-[0.2em] text-cta-bright">
          Cash for Cars
        </span>
      </span>
    </Link>
  );
}
