import { NextResponse } from "next/server";

/**
 * Server-side proxy for Google Places API (New) autocomplete.
 *
 * Why proxy instead of calling Google directly from the browser?
 * - The API key stays out of the client bundle (no NEXT_PUBLIC_).
 * - We can apply our own input validation and AU country restriction.
 * - The browser only talks to our own origin, so CSP stays tight
 *   (no need to allow places.googleapis.com in connect-src).
 *
 * Contract:
 *   GET /api/places/autocomplete?q=<query>
 *   → 200 { suggestions: [{ placeId, mainText, secondaryText, fullText }] }
 *   → 400 { error: "query too long" } when q exceeds the max length
 *   → 503 { error: "places unavailable" } when the upstream call fails,
 *     times out, or the API key is missing. The response body is
 *     intentionally generic; debug details are only written to server
 *     logs (caller should fall back to plain input).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:autocomplete";
const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 200;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const buckets = new Map<string, { count: number; reset: number }>();

export interface AutocompleteSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

interface PlacesResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    };
  }>;
}

function noStoreHeaders(extra: Record<string, string> = {}) {
  return {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
    ...extra,
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

function rateLimitResponse(request: Request): NextResponse | null {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
  } else {
    bucket.count += 1;
    if (bucket.count > MAX_REQUESTS) {
      return NextResponse.json(
        { error: "too many requests" },
        {
          status: 429,
          headers: noStoreHeaders({
            "Retry-After": Math.max(1, Math.ceil((bucket.reset - now) / 1000)).toString(),
          }),
        },
      );
    }
  }

  if (buckets.size > 5000) {
    for (const [key, value] of buckets.entries()) {
      if (value.reset < now) buckets.delete(key);
    }
  }

  return null;
}

function isAllowedCaller(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const allowedHosts = new Set([requestUrl.host]);
  const host = request.headers.get("host");
  if (host) allowedHosts.add(host);

  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl) {
    try {
      allowedHosts.add(new URL(siteUrl).host);
    } catch {
      // Ignore malformed SITE_URL and fall back to request host checks.
    }
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  for (const source of [origin, referer]) {
    if (!source) continue;
    try {
      if (allowedHosts.has(new URL(source).host)) return true;
    } catch {
      // Malformed URL on one header (e.g. Origin) must not skip a valid Referer.
      continue;
    }
  }

  return false;
}

export async function GET(request: Request) {
  const limited = rateLimitResponse(request);
  if (limited) return limited;

  if (!isAllowedCaller(request)) {
    return NextResponse.json(
      { error: "forbidden" },
      { status: 403, headers: noStoreHeaders() },
    );
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json(
      { suggestions: [] },
      { headers: noStoreHeaders() },
    );
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "query too long" },
      { status: 400, headers: noStoreHeaders() },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("[places/autocomplete] GOOGLE_PLACES_API_KEY is not set");
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  try {
    const upstream = await fetch(PLACES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: query,
        includedRegionCodes: ["au"],
        languageCode: "en",
      }),
      // Avoid Next.js caching personal queries.
      cache: "no-store",
      // Bail out if the upstream is slow/unreachable so the route
      // can't hang the caller indefinitely.
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok) {
      // Read the upstream body so the browser can see exactly what
      // Google rejected — essential for debugging key/permission errors.
      let upstreamBody = "";
      try {
        upstreamBody = await upstream.text();
      } catch {
        /* ignore */
      }
      console.error(
        `[places/autocomplete] upstream ${upstream.status} ${upstream.statusText}: ${upstreamBody.slice(0, 500)}`,
      );
      return NextResponse.json(
        { error: "places unavailable" },
        { status: 503, headers: noStoreHeaders() },
      );
    }

    const data = (await upstream.json()) as PlacesResponse;
    const suggestions: AutocompleteSuggestion[] = (data.suggestions ?? [])
      .map((s) => {
        const p = s.placePrediction;
        if (!p?.placeId) return null;
        const mainText = p.structuredFormat?.mainText?.text ?? p.text?.text ?? "";
        const secondaryText = p.structuredFormat?.secondaryText?.text ?? "";
        const fullText = p.text?.text ?? `${mainText}${secondaryText ? `, ${secondaryText}` : ""}`;
        if (!fullText) return null;
        return { placeId: p.placeId, mainText, secondaryText, fullText };
      })
      .filter((s): s is AutocompleteSuggestion => s !== null);

    return NextResponse.json(
      { suggestions },
      { headers: noStoreHeaders() },
    );
  } catch (error) {
    console.error("[places/autocomplete] fetch failed:", error);
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }
}
