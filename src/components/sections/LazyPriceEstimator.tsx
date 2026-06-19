"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type Ref } from "react";

const PriceEstimator = dynamic(
  () => import("@/components/sections/PriceEstimator").then((mod) => mod.PriceEstimator),
  {
    ssr: false,
    loading: () => <PriceEstimatorPlaceholder />,
  },
);

export function LazyPriceEstimator() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shouldLoad) return undefined;
    const target = ref.current;
    if (!target || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => setShouldLoad(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) return <PriceEstimator />;

  return <PriceEstimatorPlaceholder sectionRef={ref} />;
}

function PriceEstimatorPlaceholder({
  sectionRef,
}: {
  sectionRef?: Ref<HTMLElement>;
}) {
  return (
    <section
      ref={sectionRef}
      id="price-estimator"
      className="section-y scroll-mt-header relative overflow-hidden border-y border-border bg-secondary"
      aria-label="Instant price estimate"
    >
      <span id="quote-form" className="absolute top-0 scroll-mt-header" aria-hidden="true" />
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Instant valuation</p>
          <h2 className="font-display text-3xl font-bold leading-[1.1] text-primary text-balance sm:text-4xl md:text-[2.5rem]">
            How much is your car worth?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
            The quote tool loads as you reach this section so the first screen stays fast.
          </p>
        </div>
      </div>
    </section>
  );
}
