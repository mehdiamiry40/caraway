import { SITE_URL } from "@/lib/site";

const CANONICAL_HOSTNAME = new URL(SITE_URL).hostname;

/**
 * Convert an HTTP Host / X-Forwarded-Host value to a comparable hostname.
 * Proxies may append a comma-separated chain and hosts may include a port.
 */
export function normalizeRequestHostname(
  value: string | null | undefined,
): string | null {
  const candidate = value?.split(",", 1)[0]?.trim();
  if (!candidate || /[\s/@?#]/.test(candidate)) return null;

  try {
    return new URL(`https://${candidate}`).hostname
      .toLowerCase()
      .replace(/\.$/, "");
  } catch {
    return null;
  }
}

export function getRequestHostname(
  headers: Pick<Headers, "get">,
  fallbackHostname?: string,
): string | null {
  const rawHost = headers.get("host");
  const rawForwardedHost = headers.get("x-forwarded-host");
  const host = normalizeRequestHostname(rawHost);
  const forwardedHost = normalizeRequestHostname(
    rawForwardedHost,
  );
  const fallback = normalizeRequestHostname(fallbackHostname);

  if (rawHost !== null && !host) return null;
  if (rawForwardedHost !== null && !forwardedHost) return null;

  // Vercel supplies matching Host and X-Forwarded-Host values. A conflict is
  // treated as untrusted rather than allowing a forwarded-header spoof to
  // make a preview URL indexable.
  if (host && forwardedHost && host !== forwardedHost) return null;
  if (host) return host;
  if (forwardedHost && fallback && forwardedHost !== fallback) return null;
  return forwardedHost ?? fallback;
}

/** Only the canonical public hostname may be indexed. */
export function shouldNoindexHostname(hostname: string | null): boolean {
  return hostname !== CANONICAL_HOSTNAME;
}
