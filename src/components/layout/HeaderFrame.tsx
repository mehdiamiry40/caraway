import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-safe pl-safe pr-safe shadow-sm",
      )}
    >
      {children}
    </header>
  );
}
