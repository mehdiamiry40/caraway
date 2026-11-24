import type { ReactNode } from "react";

/**
 * The header sits in the page flow. On phones it scrolls away with the page.
 * From lg up it is sticky with a negative offset the height of the white bar,
 * so the white bar scrolls off and only the green navigation bar stays stuck.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <header className="relative z-50 bg-card pt-safe pl-safe pr-safe lg:sticky lg:top-[calc(var(--header-top-h)*-1)]">
      {children}
    </header>
  );
}
