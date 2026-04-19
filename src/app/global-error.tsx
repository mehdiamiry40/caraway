"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary rendered when even the root layout fails.
 * Intentionally uses inline styles: globals.css / font variables from the
 * layout are not guaranteed to have loaded at this point, so Tailwind
 * utility classes may not resolve. Keep this file dependency-free.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      "[error-boundary]",
      JSON.stringify({
        digest: error.digest,
        message: error.message,
        name: error.name,
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
    );
  }, [error]);

  return (
    <html lang="en-AU">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif", color: "#27170A", background: "#FFFBF5" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#5D3C1D", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              We hit an unexpected error loading the page. Please try again.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#C2410C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Root layout is broken at this point; next/link may not work */}
              <a
                href="/"
                style={{
                  padding: "0.75rem 2rem",
                  background: "transparent",
                  color: "#C2410C",
                  border: "1px solid #C2410C",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
