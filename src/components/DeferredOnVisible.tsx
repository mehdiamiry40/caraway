"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Gates children behind an IntersectionObserver so heavy below-the-fold
 * components (and their code-split chunks) only mount when the user scrolls
 * near them. Reduces "unused JavaScript" on initial page load per PSI.
 *
 * Uses `rootMargin: "400px"` so the content is ready before it enters the
 * viewport, avoiding perceived pop-in.
 */
export function DeferredOnVisible({
  children,
  minHeight = 400,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
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
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}
