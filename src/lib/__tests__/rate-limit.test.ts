import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  limit: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class Redis {
    constructor(_config: unknown) {}
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class Ratelimit {
    static slidingWindow(limit: number, window: string) {
      return { limit, window };
    }

    limit = mocks.limit;

    constructor(_config: unknown) {}
  },
}));

beforeEach(() => {
  vi.resetModules();
  mocks.limit.mockReset();
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("rateLimit", () => {
  it("uses the distributed result when Redis responds", async () => {
    mocks.limit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 123,
      pending: Promise.resolve(),
    });
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("forms", "203.0.113.1")).resolves.toEqual({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 123,
      mode: "distributed",
    });
  });

  it("falls back locally when the distributed check times out", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.limit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 123,
      reason: "timeout",
      pending: Promise.resolve(),
    });
    const { rateLimit } = await import("@/lib/rate-limit");

    const result = await rateLimit("forms", "203.0.113.2");

    expect(result.mode).toBe("local");
    expect(result.success).toBe(true);
  });
});
