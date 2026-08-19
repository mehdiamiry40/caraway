import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/(frontend)/api/health/route";

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

function stubProductionEnv(values: Record<string, string | undefined>) {
  vi.stubEnv("VERCEL_ENV", "production");

  for (const key of [...Object.keys(webhookEnv), ...Object.keys(emailEnv)]) {
    vi.stubEnv(key, values[key]);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/health", () => {
  it("reports ok when webhook delivery is available without email failover", async () => {
    stubProductionEnv(webhookEnv);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      fullyRedundant: false,
      distributedRateLimit: false,
      leadMonitorEnabled: false,
    });
  });

  it("reports ok when email delivery is available without webhook failover", async () => {
    stubProductionEnv(emailEnv);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      fullyRedundant: false,
      distributedRateLimit: false,
      leadMonitorEnabled: false,
    });
  });

  it("reports full redundancy when both channels serve both forms", async () => {
    stubProductionEnv({ ...webhookEnv, ...emailEnv });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      fullyRedundant: true,
      distributedRateLimit: false,
      leadMonitorEnabled: false,
    });
  });

  it("returns an error when either form has no delivery channel", async () => {
    stubProductionEnv({ CONTACT_ENDPOINT: webhookEnv.CONTACT_ENDPOINT });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: "error",
      fullyRedundant: false,
      distributedRateLimit: false,
      leadMonitorEnabled: false,
    });
  });
});
