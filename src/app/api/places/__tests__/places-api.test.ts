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
      new Request("https://caraway.au/api/places/session", {
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
      new Request("https://caraway.au/api/places/session", {
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
      new Request("https://caraway.au/api/places/autocomplete?q=brisbane", {
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

describe("places session hardening", () => {
  it("returns 503 when the Places API key is not configured", async () => {
    const { POST } = await loadSessionRoute();

    const res = await POST(
      new Request("https://www.caraway.au/api/places/session", {
        method: "POST",
        headers: { "sec-fetch-site": "same-origin" },
      }),
    );

    expect(res.status).toBe(503);
  });

  it("sets Secure, expiry, and HttpOnly attributes correctly on both cookies", async () => {
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

    const cookies = res.headers.getSetCookie();
    const sessionCookie = cookies.find((c) => c.startsWith("caraway_places_session="));
    const nonceCookie = cookies.find((c) => c.startsWith("caraway_places_nonce="));

    // NODE_ENV is "test" here — anything except local dev must be Secure.
    expect(sessionCookie).toMatch(/Secure/i);
    expect(sessionCookie).toMatch(/Expires=/i);
    expect(sessionCookie).toMatch(/HttpOnly/i);
    expect(sessionCookie).toMatch(/SameSite=lax/i);

    expect(nonceCookie).toMatch(/Secure/i);
    expect(nonceCookie).toMatch(/Expires=/i);
    // The nonce must stay JS-readable so the client can echo it in a header.
    expect(nonceCookie).not.toMatch(/HttpOnly/i);
  });

  it("prefers PLACES_SESSION_SECRET for signing and rejects API-key-signed tokens", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "api-key-1");
    vi.stubEnv("PLACES_SESSION_SECRET", "dedicated-secret");
    const clientIp = "1.2.3.4";
    const userAgent = "Test UA";

    const { POST } = await loadSessionRoute();
    const res = await POST(
      new Request("https://www.caraway.au/api/places/session", {
        method: "POST",
        headers: {
          "sec-fetch-site": "same-origin",
          "user-agent": userAgent,
          "x-forwarded-for": clientIp,
        },
      }),
    );
    const cookies = res.headers.getSetCookie();
    const token = cookies
      .find((c) => c.startsWith("caraway_places_session="))!
      .split(";")[0]
      .split("=")
      .slice(1)
      .join("=");
    const nonce = cookies
      .find((c) => c.startsWith("caraway_places_nonce="))!
      .split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    const { PLACES_NONCE_HEADER, issuePlacesSession } = await import(
      "@/lib/places-session"
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ suggestions: [] }));
    vi.stubGlobal("fetch", fetchMock);

    const { GET } = await loadAutocompleteRoute();
    const okRes = await GET(
      new Request("https://www.caraway.au/api/places/autocomplete?q=brisbane", {
        headers: {
          cookie: `caraway_places_session=${token}; caraway_places_nonce=${nonce}`,
          [PLACES_NONCE_HEADER]: nonce,
          "user-agent": userAgent,
          "x-forwarded-for": clientIp,
        },
      }),
    );
    expect(okRes.status).toBe(200);

    // A token signed with the raw API key must no longer verify once the
    // dedicated secret is configured.
    const forged = await issuePlacesSession({
      secret: "api-key-1",
      clientIp,
      userAgent,
    });
    const forgedRes = await GET(
      new Request("https://www.caraway.au/api/places/autocomplete?q=brisbane", {
        headers: {
          cookie: `caraway_places_session=${forged.token}; caraway_places_nonce=${forged.nonce}`,
          [PLACES_NONCE_HEADER]: forged.nonce,
          "user-agent": userAgent,
          "x-forwarded-for": clientIp,
        },
      }),
    );
    expect(forgedRes.status).toBe(403);
  });
});
