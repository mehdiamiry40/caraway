"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // mount-only observer
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <PriceEstimator />
      ) : (
        <section className="section-y bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <Skeleton className="h-10 w-80 mx-auto mb-3" />
              <Skeleton className="h-5 w-96 max-w-full mx-auto" />
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg border border-border/60 shadow-md p-6 sm:p-8">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-12 w-32 ml-auto rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
