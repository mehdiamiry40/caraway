import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  limit: vi.fn(),
  redisConstructorError: false,
}));

vi.mock("@upstash/redis", () => ({
  Redis: class Redis {
    constructor(_config: unknown) {
      if (mocks.redisConstructorError) throw new Error("redis init failed");
    }
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
  mocks.redisConstructorError = false;
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

  it("keeps ordinary distributed quota exhaustion distinct from unavailability", async () => {
    mocks.limit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: 456,
      pending: Promise.resolve(),
    });
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("forms", "203.0.113.1")).resolves.toEqual({
      success: false,
      limit: 10,
      remaining: 0,
      reset: 456,
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

  it("fails closed when distributed enforcement is missing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", undefined);
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", undefined);
    const { rateLimit } = await import("@/lib/rate-limit");

    const result = await rateLimit("chat-global", "global");

    expect(result).toMatchObject({
      success: false,
      mode: "unavailable",
    });
  });

  it("fails closed when a distributed check times out in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.limit.mockResolvedValue({
      success: true,
      limit: 120,
      remaining: 119,
      reset: 0,
      reason: "timeout",
      pending: Promise.resolve(),
    });
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("chat-global", "global")).resolves.toMatchObject({
      success: false,
      mode: "unavailable",
    });
  });

  it("fails closed when distributed initialization throws in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.redisConstructorError = true;
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("forms-global", "global")).resolves.toMatchObject({
      success: false,
      mode: "unavailable",
    });
  });

  it("fails closed when the distributed check throws in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.limit.mockRejectedValue(new Error("redis unavailable"));
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("forms-global", "global")).resolves.toMatchObject({
      success: false,
      mode: "unavailable",
    });
  });

  it("keeps the documented local fallback in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", undefined);
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", undefined);
    const { rateLimit } = await import("@/lib/rate-limit");

    await expect(rateLimit("forms-global", "global")).resolves.toMatchObject({
      success: true,
      limit: 100,
      mode: "local",
    });
  });
});
