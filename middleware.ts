import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  // --- Rate limiting ---
  const rateLimitResult = await rateLimit("forms", getClientIp(request));
  if (!rateLimitResult.success) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: {
        "Retry-After": Math.max(
          1,
          Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        ).toString(),
      },
    });
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
