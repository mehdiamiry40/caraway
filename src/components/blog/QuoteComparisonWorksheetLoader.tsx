"use client";

import dynamic from "next/dynamic";

const QuoteComparisonWorksheet = dynamic(() =>
  import("@/components/blog/QuoteComparisonWorksheet").then(
    (module) => module.QuoteComparisonWorksheet,
  ),
);

/**
 * Keep the dynamic import inside a Client Component so unrelated blog posts do
 * not receive the worksheet implementation chunk. SSR remains enabled for the
 * opted-in guide, preserving the worksheet anchor in its initial HTML.
 */
export function QuoteComparisonWorksheetLoader() {
  return <QuoteComparisonWorksheet />;
}
