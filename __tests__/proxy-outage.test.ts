import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// The request proxy is the first of three places an enquiry passes. With the
// counter store configured but failing it must keep letting form posts
// through, against the smaller per-instance allowance, instead of answering
// 503 to every visitor for as long as the store is down.
const mocks = vi.hoisted(() => ({ limit: vi.fn() }));
vi.mock("@upstash/redis", () => ({ Redis: class Redis {} }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class Ratelimit {
    static slidingWindow(limit: number, window: string) {
      return { limit, window };
    }
    limit = mocks.limit;
  },
}));

function post(ip: string) {
  return new NextRequest(new URL("http://localhost/"), {
    method: "POST",
    headers: { "x-forwarded-for": ip, host: "localhost", origin: "http://localhost" },
  });
}

beforeEach(() => {
  vi.resetModules();
  mocks.limit.mockReset().mockRejectedValue(new Error("redis unavailable"));
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  vi.stubEnv("KV_REST_API_URL", undefined);
  vi.stubEnv("KV_REST_API_TOKEN", undefined);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("proxy during a counter store outage", () => {
  it("lets a sender's form posts through up to the outage allowance, then answers 429", async () => {
    const { proxy } = await import("../src/proxy");

    for (let attempt = 0; attempt < 4; attempt++) {
      expect((await proxy(post("203.0.113.9"))).status).toBe(200);
    }
    const refused = await proxy(post("203.0.113.9"));
    expect(refused.status).toBe(429);
    expect(refused.headers.get("Retry-After")).not.toBeNull();
    expect((await proxy(post("203.0.113.10"))).status).toBe(200);
  });

  it("still enforces the origin check", async () => {
    const { proxy } = await import("../src/proxy");
    const crossSite = new NextRequest(new URL("http://localhost/"), {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.11", host: "localhost", origin: "https://evil.example" },
    });
    expect((await proxy(crossSite)).status).toBe(403);
  });
});
