"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Mounts a window-level `unhandledrejection` listener that forwards
 * unhandled promise rejections to Sentry. React's error boundaries
 * only catch render-phase errors, so this closes the gap for async
 * failures (e.g. fetch() rejections not awaited by a component).
 */
export function ErrorInstrumentation(): null {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const error =
        reason instanceof Error
          ? reason
          : new Error(
              typeof reason === "string" ? reason : "Unhandled promise rejection",
            );
      Sentry.captureException(error, {
        tags: { source: "unhandledrejection" },
      });
    };
    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  return null;
}
