import type { ReactNode } from "react";

export function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-ink pt-safe pl-safe pr-safe shadow-[0_1px_0_hsl(var(--on-dark-hi)/0.08)]">
      {children}
    </header>
  );
}
