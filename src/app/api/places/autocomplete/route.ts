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
 *   → 400 { error: "missing query" } when q is empty/too short
 *   → 503 { error: "places unavailable" } when the upstream call fails
 *     or the API key is missing (caller should fall back to plain input)
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json(
      { suggestions: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "query too long" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("[places/autocomplete] GOOGLE_PLACES_API_KEY is not set");
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
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
    });

    if (!upstream.ok) {
      console.error(
        `[places/autocomplete] upstream ${upstream.status} ${upstream.statusText}`,
      );
      return NextResponse.json(
        { error: "places unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
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
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[places/autocomplete] fetch failed:", error);
    return NextResponse.json(
      { error: "places unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
