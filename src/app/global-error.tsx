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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif", color: "#1a1a2e" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              We hit an unexpected error loading the page. Please try again.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.75rem 2rem",
                background: "#1a4a4a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
