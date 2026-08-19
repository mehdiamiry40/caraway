import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import {
  issuePlacesSession,
  PLACES_NONCE_COOKIE,
  PLACES_SESSION_COOKIE,
} from "@/lib/places-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  };
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

function isFirstPartyRequest(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site === "same-origin" || site === "same-site") return true;
  if (site) return false;

  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") ?? requestUrl.host;

  for (const source of [request.headers.get("origin"), request.headers.get("referer")]) {
    if (!source) continue;
    try {
      if (new URL(source).host === host) return true;
    } catch {
      continue;
    }
  }

  return false;
}

export async function POST(request: Request) {
  const env = getEnv();
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  if (!isFirstPartyRequest(request)) {
    return NextResponse.json(
      { error: "forbidden" },
      { status: 403, headers: noStoreHeaders() },
    );
  }

  const session = await issuePlacesSession({
    // Prefer the dedicated signing secret; fall back to the API key so
    // existing deploys keep working until PLACES_SESSION_SECRET is set.
    secret: env.PLACES_SESSION_SECRET ?? apiKey,
    clientIp: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? "",
  });
  const expires = new Date(session.expiresAt);
  const response = new NextResponse(null, { status: 204, headers: noStoreHeaders() });

  // Secure everywhere except local dev, where the site runs over plain http.
  const secureCookies = process.env.NODE_ENV !== "development";
  response.cookies.set({
    name: PLACES_SESSION_COOKIE,
    value: session.token,
    expires,
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
  });
  response.cookies.set({
    name: PLACES_NONCE_COOKIE,
    value: session.nonce,
    expires,
    httpOnly: false,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
  });

  return response;
}
