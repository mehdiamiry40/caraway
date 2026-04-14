"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Observes the given element and flips to `true` the first time it
 * enters the viewport, then disconnects. Once `true`, it stays `true` —
 * intended for "reveal on scroll" / lazy-mount patterns, not for
 * continuous in-view tracking.
 *
 * Lazily initializes to `true` in the rare case where a client browser
 * has no IntersectionObserver support, so content is still shown. SSR
 * renders `false` to match modern-browser hydration.
 */
export function useIntersectionVisibility<T extends Element>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // Options are intentionally captured on mount only — callers pass
    // a literal and we don't want to resubscribe when it re-identifies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
