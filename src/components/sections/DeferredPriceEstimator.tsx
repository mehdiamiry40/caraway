"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
    if (visible) return;
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
  }, [visible]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight: 600 }}>
      {visible ? <PriceEstimator /> : null}
    </div>
  );
}
