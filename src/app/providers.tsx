"use client";

import { BackToTopButton } from "@/components/BackToTopButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTopButton />
    </>
  );
}
