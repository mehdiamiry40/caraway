/**
 * Validate that an outbound endpoint URL is safe to fetch.
 *
 * - Must be https (no plaintext, no file://, no data:, etc.)
 * - Must not use non-standard ports (only default 443 allowed)
 * - Must not target loopback, link-local, or well-known private ranges
 *   (basic SSRF hardening — this is not a full private IP check).
 * - Optionally restricted to an allowlist via ALLOWED_ENDPOINT_HOSTS
 *   (comma-separated host names). When unset, any public https host is allowed.
 *
 * NOTE: We intentionally skip DNS-resolution checks. The endpoint URL comes
 * from a server-side env var set by the operator, not from user input. The
 * hostname allowlist + HTTPS-only + port restriction + redirect: 'error'
 * provide sufficient SSRF hardening for this threat model.
 */
export function validateEndpoint(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }

  if (u.protocol !== "https:") return false;

  // Block non-standard ports — only default 443 allowed for HTTPS.
  // Non-standard ports (8080, 9200, etc.) could enable internal service scanning.
  if (u.port !== "" && u.port !== "443") return false;

  // URL.hostname returns IPv6 addresses with brackets (e.g. "[::1]").
  const rawHostname = u.hostname.toLowerCase();
  const hostname =
    rawHostname.startsWith("[") && rawHostname.endsWith("]")
      ? rawHostname.slice(1, -1)
      : rawHostname;

  const blockedHosts = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254", // AWS/GCP instance metadata
    "metadata.google.internal",
  ]);
  if (blockedHosts.has(hostname)) return false;

  // Block RFC1918 and link-local ranges by prefix match.
  if (hostname.startsWith("10.")) return false;
  if (hostname.startsWith("192.168.")) return false;
  if (hostname.startsWith("169.254.")) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;

  // Block IPv6 Unique Local Addresses (fc00::/7 — fc00 and fd00 prefixes).
  if (/^f[cd][0-9a-f]{2}:/i.test(hostname)) return false;
  // Block IPv6 link-local range (fe80::/10).
  if (/^fe[89ab][0-9a-f]:/i.test(hostname)) return false;

  const allowlistRaw = process.env.ALLOWED_ENDPOINT_HOSTS?.trim();
  if (allowlistRaw) {
    const allowed = allowlistRaw
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    if (!allowed.includes(hostname)) return false;
  }

  return true;
}
