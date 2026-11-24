import type { ReactNode } from "react";

export function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background pt-safe pl-safe pr-safe">
      {children}
    </header>
  );
}
