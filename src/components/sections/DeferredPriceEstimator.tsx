"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionVisibility } from "@/hooks/use-intersection-visibility";

const PriceEstimator = dynamic(
  () =>
    import("@/components/sections/PriceEstimator").then(
      (mod) => mod.PriceEstimator,
    ),
  { ssr: false },
);

/**
 * Client wrapper that defers the PriceEstimator chunk until the user
 * scrolls within 400 px of it. Because the `dynamic()` call lives inside
 * a "use client" file with `ssr: false`, the form's JS (react-hook-form,
 * zod, @hookform/resolvers, lucide icons) is excluded from the initial
 * page bundle entirely — only fetched on-demand.
 */
export function DeferredPriceEstimator() {
  const [ref, visible] = useIntersectionVisibility<HTMLDivElement>({
    rootMargin: "400px",
  });

  return (
    <div ref={ref}>
      {visible ? (
        <PriceEstimator />
      ) : (
        <section className="section-y bg-secondary/70">
          <div className="site-container">
            <div className="text-center mb-8 sm:mb-12">
              <Skeleton className="h-10 w-80 mx-auto mb-3" />
              <Skeleton className="h-5 w-96 max-w-full mx-auto" />
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-xl border border-border/60 shadow-[0_20px_44px_-32px_hsl(var(--shadow-color)/0.42)] p-6 sm:p-8">
                <Skeleton className="h-6 w-48 mb-6 rounded-xl" />
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-12 w-32 ml-auto rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
