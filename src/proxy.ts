import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  getRequestHostname,
  shouldNoindexHostname,
} from "@/lib/noindex";

function withHostRobotsPolicy(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const hostname = getRequestHostname(
    request.headers,
    request.nextUrl.hostname,
  );
  if (shouldNoindexHostname(hostname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export async function proxy(request: NextRequest) {
  if (request.method !== "POST") {
    return withHostRobotsPolicy(NextResponse.next(), request);
  }

  // --- Rate limiting ---
  const rateLimitResult = await rateLimit("forms", getClientIp(request));
  if (!rateLimitResult.success) {
    return withHostRobotsPolicy(
      new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          ).toString(),
        },
      }),
      request,
    );
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
        return withHostRobotsPolicy(
          new NextResponse("Forbidden", { status: 403 }),
          request,
        );
      }
    } catch {
      return withHostRobotsPolicy(
        new NextResponse("Forbidden", { status: 403 }),
        request,
      );
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
          return withHostRobotsPolicy(
            new NextResponse("Forbidden", { status: 403 }),
            request,
          );
        }
      } catch {
        return withHostRobotsPolicy(
          new NextResponse("Forbidden", { status: 403 }),
          request,
        );
      }
    } else {
      // Neither Origin nor Referer present on a POST — reject.
      return withHostRobotsPolicy(
        new NextResponse("Forbidden", { status: 403 }),
        request,
      );
    }
  }

  return withHostRobotsPolicy(NextResponse.next(), request);
}

// Exclude static assets and API routes. Server action POSTs to page routes
// (including "/") still match, so the rate limit and origin check apply.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon\\.svg|favicon\\.ico|images/|fonts/|api/).*)",
  ],
};
