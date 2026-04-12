"use client";

/**
 * Root-level error boundary rendered when even the root layout fails.
 * Intentionally uses inline styles: globals.css / font variables from the
 * layout are not guaranteed to have loaded at this point, so Tailwind
 * utility classes may not resolve. Keep this file dependency-free.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-AU">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif", color: "#141518" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#434952", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              We hit an unexpected error loading the page. Please try again.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#1F4E7B",
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
              <a
                href="/"
                style={{
                  padding: "0.75rem 2rem",
                  background: "transparent",
                  color: "#1F4E7B",
                  border: "1px solid #1F4E7B",
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
