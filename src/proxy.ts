import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  buildContentSecurityPolicy,
  contentSecurityPolicyMode,
  createCspNonce,
} from "@/lib/content-security-policy";
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

function documentContentSecurityPolicy(): { nonce: string; policy: string } {
  const nonce = createCspNonce();
  return { nonce, policy: buildContentSecurityPolicy({ nonce }) };
}

function withDocumentCsp(
  response: NextResponse,
  request: NextRequest,
  policy: string,
): NextResponse {
  response.headers.set("Content-Security-Policy", policy);
  return withHostRobotsPolicy(response, request);
}

function nextWithDocumentCsp(request: NextRequest): NextResponse {
  const { nonce, policy } = documentContentSecurityPolicy();
  const requestHeaders = new Headers(request.headers);
  // Overwrite any client-supplied values so the rendered nonce matches this response.
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return withDocumentCsp(response, request, policy);
}

function finishWithDocumentCsp(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  // Rejection bodies are plain text, so they do not need inline-script hashes.
  return withDocumentCsp(
    response,
    request,
    buildContentSecurityPolicy({ mode: contentSecurityPolicyMode() }),
  );
}

export async function proxy(request: NextRequest) {
  if (request.method !== "POST") {
    // Production documents get their script hashes from the build headers.
    // A second per-request policy would be enforced as well and would block
    // the prerendered inline scripts.
    if (process.env.NODE_ENV === "production") {
      return withHostRobotsPolicy(NextResponse.next(), request);
    }
    return nextWithDocumentCsp(request);
  }

  // --- Rate limiting ---
  const rateLimitResult = await rateLimit("forms", getClientIp(request));
  if (!rateLimitResult.success) {
    const unavailable = rateLimitResult.mode === "unavailable";
    return finishWithDocumentCsp(
      new NextResponse(
        unavailable ? "Service unavailable" : "Too many requests",
        {
          status: unavailable ? 503 : 429,
          headers: unavailable
            ? undefined
            : {
                "Retry-After": Math.max(
                  1,
                  Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
                ).toString(),
              },
        },
      ),
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
        return finishWithDocumentCsp(
          new NextResponse("Forbidden", { status: 403 }),
          request,
        );
      }
    } catch {
      return finishWithDocumentCsp(
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
          return finishWithDocumentCsp(
            new NextResponse("Forbidden", { status: 403 }),
            request,
          );
        }
      } catch {
        return finishWithDocumentCsp(
          new NextResponse("Forbidden", { status: 403 }),
          request,
        );
      }
    } else {
      // Neither Origin nor Referer present on a POST — reject.
      return finishWithDocumentCsp(
        new NextResponse("Forbidden", { status: 403 }),
        request,
      );
    }
  }

  return nextWithDocumentCsp(request);
}

// Exclude static assets, API routes, and Vercel's first-party analytics intake.
// Server action POSTs to page routes (including "/") still match, so the form
// rate limit and origin check apply only to requests owned by the application.
export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|_next/data|_vercel/insights/|favicon\\.svg|favicon\\.ico|images/|fonts/|api/).*)",
      // Development prefetches must not receive their own nonce. Production
      // CSP is a static hash policy on the route, shared with the document.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
