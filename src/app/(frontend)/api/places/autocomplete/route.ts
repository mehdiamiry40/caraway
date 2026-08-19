import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import {
  PLACES_NONCE_COOKIE,
  PLACES_NONCE_HEADER,
  PLACES_SESSION_COOKIE,
  verifyPlacesSession,
} from "@/lib/places-session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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

function isFirstPartyFetch(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  const mode = request.headers.get("sec-fetch-mode");
  if (!site && !mode) return true;
  if (site !== "same-origin" && site !== "same-site") return false;
  return mode === "cors" || mode === "same-origin";
}

async function hasValidPlacesSession(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = new Map(
    cookieHeader
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, ...rest] = entry.split("=");
        return [name, rest.join("=")];
      }),
  );

  const env = getEnv();
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return false;

  return verifyPlacesSession({
    // Must mirror the issuing route: dedicated secret first, API key fallback.
    secret: env.PLACES_SESSION_SECRET ?? apiKey,
    token: cookies.get(PLACES_SESSION_COOKIE),
    nonce: request.headers.get(PLACES_NONCE_HEADER) ?? cookies.get(PLACES_NONCE_COOKIE),
    clientIp: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? "",
  });
}

export async function GET(request: Request) {
  const rateLimitResult = await rateLimit("places", getClientIp(request));
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "too many requests" },
      {
        status: 429,
        headers: noStoreHeaders({
          "Retry-After": Math.max(
            1,
            Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          ).toString(),
        }),
      },
    );
  }

  // Site-wide circuit breaker: bounds total Google Places spend per minute
  // even against IP-rotating abuse. Returns the generic 503 so the client
  // quietly falls back to manual address entry.
  const globalLimitResult = await rateLimit("places-global", "global");
  if (!globalLimitResult.success) {
    console.error("[places/autocomplete] global circuit breaker tripped");
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  if (!isFirstPartyFetch(request) || !(await hasValidPlacesSession(request))) {
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

  const apiKey = getEnv().GOOGLE_PLACES_API_KEY;
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
      // Google's error bodies can describe the API key's restrictions and
      // quota configuration, so keep them out of routine logs. The status
      // line is enough to alert ops; set DEBUG_PLACES=1 to log the body
      // while actively debugging key/permission errors.
      let detail = "";
      if (process.env.DEBUG_PLACES === "1") {
        try {
          detail = `: ${(await upstream.text()).slice(0, 500)}`;
        } catch {
          /* ignore */
        }
      }
      console.error(
        `[places/autocomplete] upstream ${upstream.status} ${upstream.statusText}${detail}`,
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
