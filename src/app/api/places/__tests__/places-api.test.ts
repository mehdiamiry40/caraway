import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

async function loadSessionRoute() {
  vi.resetModules();
  return import("@/app/api/places/session/route");
}

async function loadAutocompleteRoute() {
  vi.resetModules();
  return import("@/app/api/places/autocomplete/route");
}

describe("places session route", () => {
  it("issues Places session cookies only when requested first-party", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    const { POST } = await loadSessionRoute();

    const res = await POST(
      new Request("https://www.caraway.au/api/places/session", {
        method: "POST",
        headers: {
          "sec-fetch-site": "same-origin",
          "user-agent": "Test UA",
          "x-forwarded-for": "1.2.3.4",
        },
      }),
    );

    expect(res.status).toBe(204);
    expect(res.headers.getSetCookie().join("\n")).toContain(
      "caraway_places_session=",
    );
    expect(res.headers.getSetCookie().join("\n")).toContain(
      "caraway_places_nonce=",
    );
  });

  it("rejects session minting without first-party request evidence", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-key");
    const { POST } = await loadSessionRoute();

    const res = await POST(
      new Request("https://www.caraway.au/api/places/session", {
        method: "POST",
      }),
    );

    expect(res.status).toBe(403);
  });
});

describe("places autocomplete route", () => {
  it("accepts a valid signed session when Fetch Metadata headers are absent", async () => {
    const secret = "test-key";
    const clientIp = "1.2.3.4";
    const userAgent = "Test UA";
    vi.stubEnv("GOOGLE_PLACES_API_KEY", secret);

    const { issuePlacesSession, PLACES_NONCE_HEADER } = await import(
      "@/lib/places-session"
    );
    const session = await issuePlacesSession({
      secret,
      clientIp,
      userAgent,
    });
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        suggestions: [
          {
            placePrediction: {
              placeId: "abc123",
              text: { text: "Brisbane QLD, Australia" },
            },
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await loadAutocompleteRoute();
    const res = await GET(
      new Request("https://www.caraway.au/api/places/autocomplete?q=brisbane", {
        headers: {
          cookie: `caraway_places_session=${session.token}; caraway_places_nonce=${session.nonce}`,
          [PLACES_NONCE_HEADER]: session.nonce,
          "user-agent": userAgent,
          "x-forwarded-for": clientIp,
        },
      }),
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    await expect(res.json()).resolves.toEqual({
      suggestions: [
        {
          placeId: "abc123",
          mainText: "Brisbane QLD, Australia",
          secondaryText: "",
          fullText: "Brisbane QLD, Australia",
        },
      ],
    });
  });
});
