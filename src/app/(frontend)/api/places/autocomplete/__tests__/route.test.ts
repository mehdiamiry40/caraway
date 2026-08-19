import { beforeEach, describe, expect, it, vi } from "vitest";
import { issuePlacesSession, PLACES_NONCE_HEADER, PLACES_SESSION_COOKIE } from "@/lib/places-session";

vi.mock("@/lib/env", () => ({
  getEnv: () => ({
    GOOGLE_PLACES_API_KEY: "places-test-secret",
  }),
}));

type RouteModule = typeof import("../route");

async function loadRoute(): Promise<RouteModule["GET"]> {
  vi.resetModules();
  const mod = (await import("../route")) as RouteModule;
  return mod.GET;
}

function request(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/places/autocomplete?q=George%20Street", {
    method: "GET",
    headers,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("/api/places/autocomplete", () => {
  it("forbids direct API access without browser fetch metadata or a Places session", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const GET = await loadRoute();

    const res = await GET(request());

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ error: "forbidden" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("forbids same-origin requests that do not have a valid issued session", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const GET = await loadRoute();

    const res = await GET(
      request({
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "x-forwarded-for": "203.0.113.10",
        "user-agent": "Vitest Browser",
      }),
    );

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ error: "forbidden" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("allows an issued session and forwards only the typed query to Google", async () => {
    const session = await issuePlacesSession({
      secret: "places-test-secret",
      clientIp: "203.0.113.10",
      userAgent: "Vitest Browser",
      now: Date.now(),
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          suggestions: [
            {
              placePrediction: {
                placeId: "place-1",
                text: { text: "George Street, Brisbane QLD, Australia" },
                structuredFormat: {
                  mainText: { text: "George Street" },
                  secondaryText: { text: "Brisbane QLD, Australia" },
                },
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    const GET = await loadRoute();

    const res = await GET(
      request({
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "x-forwarded-for": "203.0.113.10",
        "user-agent": "Vitest Browser",
        [PLACES_NONCE_HEADER]: session.nonce,
        cookie: `${PLACES_SESSION_COOKIE}=${session.token}`,
      }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      suggestions: [
        {
          placeId: "place-1",
          mainText: "George Street",
          secondaryText: "Brisbane QLD, Australia",
          fullText: "George Street, Brisbane QLD, Australia",
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      input: "George Street",
      includedRegionCodes: ["au"],
      languageCode: "en",
    });
  });
});
