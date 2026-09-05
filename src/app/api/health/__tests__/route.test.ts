import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

const webhookEnv = {
  CONTACT_ENDPOINT: "https://hooks.example.com/contact",
  QUOTE_ENDPOINT: "https://hooks.example.com/quote",
};

const emailEnv = {
  RESEND_API_KEY: "re_test",
  CONTACT_NOTIFICATION_FROM: "Caraway Contact <contact@caraway.au>",
  CONTACT_NOTIFICATION_TO: "info@caraway.au",
  QUOTE_NOTIFICATION_FROM: "Caraway Quotes <quotes@caraway.au>",
  QUOTE_NOTIFICATION_TO: "info@caraway.au",
};

const distributedEnv = {
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "test-token",
};

const marketplaceDistributedEnv = {
  KV_REST_API_URL: "https://marketplace-redis.example.com",
  KV_REST_API_TOKEN: "marketplace-test-token",
};

function stubProductionEnv(values: Record<string, string | undefined>) {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", "production");

  for (const key of [
    ...Object.keys(webhookEnv),
    ...Object.keys(emailEnv),
    ...Object.keys(distributedEnv),
    ...Object.keys(marketplaceDistributedEnv),
  ]) {
    vi.stubEnv(key, values[key]);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/health", () => {
  it("reports ok when webhook delivery is available without email failover", async () => {
    stubProductionEnv({ ...webhookEnv, ...distributedEnv });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      checkType: "configuration",
      fullyRedundant: false,
      distributedRateLimitConfigured: true,
      leadCaptureConfigured: true,
      leadMonitorEnabled: false,
    });
  });

  it("reports ok when email delivery is available without webhook failover", async () => {
    stubProductionEnv({ ...emailEnv, ...distributedEnv });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      checkType: "configuration",
      fullyRedundant: false,
      distributedRateLimitConfigured: true,
      leadCaptureConfigured: true,
      leadMonitorEnabled: false,
    });
  });

  it("accepts the Vercel Marketplace distributed limiter settings", async () => {
    stubProductionEnv({ ...emailEnv, ...marketplaceDistributedEnv });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      distributedRateLimitConfigured: true,
      leadCaptureConfigured: true,
    });
  });

  it("reports full redundancy when both channels serve both forms", async () => {
    stubProductionEnv({ ...webhookEnv, ...emailEnv, ...distributedEnv });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      checkType: "configuration",
      fullyRedundant: true,
      distributedRateLimitConfigured: true,
      leadCaptureConfigured: true,
      leadMonitorEnabled: false,
    });
  });

  it("returns an error when either form has no delivery channel", async () => {
    stubProductionEnv({
      CONTACT_ENDPOINT: webhookEnv.CONTACT_ENDPOINT,
      ...distributedEnv,
    });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: "error",
      checkType: "configuration",
      fullyRedundant: false,
      distributedRateLimitConfigured: true,
      leadCaptureConfigured: true,
      leadMonitorEnabled: false,
    });
  });

  it("returns an error when production lacks distributed enforcement", async () => {
    stubProductionEnv(emailEnv);

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: "error",
      checkType: "configuration",
      fullyRedundant: false,
      distributedRateLimitConfigured: false,
      leadCaptureConfigured: false,
      leadMonitorEnabled: false,
    });
  });

  it.each(["preview", undefined])(
    "requires distributed enforcement for deployed runtime %s",
    async (vercelEnv) => {
      stubProductionEnv(emailEnv);
      vi.stubEnv("VERCEL_ENV", vercelEnv);

      const response = await GET();

      expect(response.status).toBe(503);
      await expect(response.json()).resolves.toMatchObject({
        status: "error",
        checkType: "configuration",
        distributedRateLimitConfigured: false,
        leadCaptureConfigured: false,
      });
    },
  );

  it("rejects malformed distributed limiter configuration", async () => {
    stubProductionEnv({
      ...emailEnv,
      UPSTASH_REDIS_REST_URL: "not-a-valid-url",
      UPSTASH_REDIS_REST_TOKEN: "test-token",
    });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "error",
      checkType: "configuration",
      distributedRateLimitConfigured: false,
      leadCaptureConfigured: false,
    });
  });
});
