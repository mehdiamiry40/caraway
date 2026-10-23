/**
 * Content-Security-Policy for Caraway.
 *
 * Production HTML is prerendered, so script-src lists the sha256 of every
 * inline script instead of a per-request nonce. A nonce would make each
 * response unique and force `Cache-Control: private, no-cache, no-store`.
 * `'strict-dynamic'` is intentionally absent from that production policy:
 * browsers that understand it ignore `'self'`, and Next's parser-inserted
 * `/_next/static` scripts would be blocked. Development still uses a nonce
 * and `'strict-dynamic'` because those inline scripts change on every edit.
 *
 * Next.js reads a nonce from the first directive whose name starts with
 * `script-src`, so `script-src` stays before `script-src-attr`.
 *
 * Style attributes in React cannot carry a nonce or hash. A nonce in
 * style-src would make browsers ignore 'unsafe-inline' and block those
 * attributes, so styles keep 'unsafe-inline' for attributes only. Inline
 * <style> elements stay disallowed in browsers that understand style-src-elem.
 */

const NONCE_PATTERN = /^[A-Za-z0-9+/_-]+={0,2}$/;
const SCRIPT_HASH_PATTERN = /^sha256-[A-Za-z0-9+/]{43}=$/;

export const CSP_SCRIPT_HASH_PLACEHOLDER = `sha256-${"A".repeat(43)}=`;

export function isPlaceholderScriptHash(hash: string): boolean {
  const bare = hash.trim().replace(/^'/, "").replace(/'$/, "");
  return bare === CSP_SCRIPT_HASH_PLACEHOLDER || /^sha256-A{43}=$/.test(bare);
}

export function assertScriptHashToken(hash: string): string {
  const bare = hash.trim().replace(/^'/, "").replace(/'$/, "");
  if (!SCRIPT_HASH_PATTERN.test(bare)) {
    throw new Error(`CSP script hash is not a sha256 source: ${hash}`);
  }
  if (isPlaceholderScriptHash(bare)) {
    throw new Error(
      "CSP script hash is a placeholder. The production build must hash the prerendered inline scripts before it publishes headers.",
    );
  }
  return bare;
}

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
  scriptHashes?: readonly string[];
  mode?: ContentSecurityPolicyMode;
}): string {
  const mode = options?.mode ?? contentSecurityPolicyMode();
  const nonce = options?.nonce;
  const scriptHashes = options?.scriptHashes ?? [];
  const development = mode === "development";
  const scriptSources = ["'self'"];

  if (nonce && scriptHashes.length > 0) {
    throw new Error("CSP cannot combine a nonce with script hashes");
  }

  if (nonce) {
    if (!NONCE_PATTERN.test(nonce)) {
      throw new Error("CSP nonce contains characters Next.js will ignore");
    }
    scriptSources.push(`'nonce-${nonce}'`, "'strict-dynamic'");
  } else if (scriptHashes.length > 0) {
    for (const hash of [...new Set(scriptHashes)].sort()) {
      scriptSources.push(`'${assertScriptHashToken(hash)}'`);
    }
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
