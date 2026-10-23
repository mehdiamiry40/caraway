/**
 * Document Content-Security-Policy for Caraway.
 *
 * HTML responses get a per-request nonce from the proxy so production
 * script-src can drop 'unsafe-inline'. Next.js reads the nonce from the
 * request's script-src directive, so `script-src` must appear before
 * `script-src-attr` (`script-src-attr`.startsWith("script-src")).
 *
 * Style attributes in React cannot carry a nonce. A nonce in style-src would
 * make browsers ignore 'unsafe-inline' and block those attributes, so styles
 * keep 'unsafe-inline' for attributes only. Inline <style> elements stay
 * disallowed in browsers that understand style-src-elem.
 */

const NONCE_PATTERN = /^[A-Za-z0-9+/_-]+={0,2}$/;

export const NON_DOCUMENT_CSP_SOURCES = [
  "/_next/static/(.*)",
  "/_next/image",
  "/_next/image/(.*)",
  "/_next/data/(.*)",
  "/_vercel/insights/(.*)",
  "/favicon.svg",
  "/favicon.ico",
  "/images/(.*)",
  "/fonts/(.*)",
  "/api/(.*)",
] as const;

export type ContentSecurityPolicyMode = "development" | "production";

export function contentSecurityPolicyMode(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): ContentSecurityPolicyMode {
  return nodeEnv === "production" ? "production" : "development";
}

export function createCspNonce(): string {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  if (!NONCE_PATTERN.test(nonce)) {
    throw new Error("Generated CSP nonce is not acceptable to Next.js");
  }
  return nonce;
}

export function buildContentSecurityPolicy(options?: {
  nonce?: string;
  mode?: ContentSecurityPolicyMode;
}): string {
  const mode = options?.mode ?? contentSecurityPolicyMode();
  const nonce = options?.nonce;
  const development = mode === "development";
  const scriptSources = ["'self'"];

  if (nonce) {
    if (!NONCE_PATTERN.test(nonce)) {
      throw new Error("CSP nonce contains characters Next.js will ignore");
    }
    scriptSources.push(`'nonce-${nonce}'`, "'strict-dynamic'");
  }
  if (development) {
    // React's dev overlay reconstructs server stacks with eval.
    // Vercel Analytics and Speed Insights load their debug scripts from this host.
    scriptSources.push("'unsafe-eval'", "https://va.vercel-scripts.com");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "style-src-elem 'self'",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    development ? "frame-ancestors *" : "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  if (!development) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}
