"use client";

import { Printer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function PrintReviewCardButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`${buttonVariants({ size: "lg" })} inline-flex gap-2`}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print card
    </button>
  );
}
