import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory token bucket for rate limiting.
// Keyed by client IP, resets every 60s, 10 requests allowed per window.
// Note: This is per-instance state and resets on cold starts — sufficient
// as defence-in-depth in front of form endpoints, not a replacement for a
// distributed rate limiter.
const buckets = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  // --- Rate limiting ---
  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
  } else {
    bucket.count += 1;
    if (bucket.count > MAX_REQUESTS) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "Retry-After": Math.max(1, Math.ceil((bucket.reset - now) / 1000)).toString(),
        },
      });
    }
  }

  // Opportunistic cleanup to keep the map bounded.
  if (buckets.size > 5000) {
    for (const [key, value] of buckets.entries()) {
      if (value.reset < now) buckets.delete(key);
    }
  }

  // --- Origin validation ---
  // Prefer explicit SITE_URL, otherwise fall back to the request host.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const siteUrl = process.env.SITE_URL?.trim();

  if (origin) {
    try {
      const originUrl = new URL(origin);
      let ok = false;
      if (siteUrl) {
        try {
          const site = new URL(siteUrl);
          if (site.host === originUrl.host) ok = true;
        } catch {
          // ignore malformed SITE_URL, fall through to host check
        }
      }
      if (!ok && host && originUrl.host === host) {
        ok = true;
      }
      if (!ok) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } catch {
      return new NextResponse("Forbidden", { status: 403 });
    }
  } else {
    // No Origin header — fall back to Referer for CSRF validation.
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        let ok = false;
        if (siteUrl) {
          try {
            const site = new URL(siteUrl);
            if (site.host === refererUrl.host) ok = true;
          } catch {
            // ignore malformed SITE_URL, fall through to host check
          }
        }
        if (!ok && host && refererUrl.host === host) {
          ok = true;
        }
        if (!ok) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      } catch {
        return new NextResponse("Forbidden", { status: 403 });
      }
    } else {
      // Neither Origin nor Referer present on a POST — reject.
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

// Exclude static assets and API routes. Server action POSTs to page routes
// (including "/") still match, so the rate limit and origin check apply.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon\\.svg|favicon\\.ico|images/|fonts/|api/).*)",
  ],
};
