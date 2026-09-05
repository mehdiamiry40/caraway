import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ processPendingLeads: vi.fn() }));
vi.mock("@/lib/lead-processor", () => ({ processPendingLeads: mocks.processPendingLeads }));
import { GET } from "@/app/api/cron/lead-delivery/route";

function request(authorization?: string) {
  return new Request("https://caraway.au/api/cron/lead-delivery", {
    headers: authorization ? { authorization } : {},
  });
}
beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "test-cron-secret");
  mocks.processPendingLeads.mockReset().mockResolvedValue({ processed: 2, failures: 0, pending: 0, attention: 0 });
});
afterEach(() => vi.unstubAllEnvs());

describe("lead recovery cron", () => {
  it.each([undefined, "Basic test-cron-secret", "Bearer wrong-secret", "Bearer wrong-secret-of-a-different-length"])(
    "does not process saved leads for unauthorized credentials: %j", async (authorization) => {
      const response = await GET(request(authorization));
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ status: "unauthorized" });
      expect(mocks.processPendingLeads).not.toHaveBeenCalled();
    },
  );

  it("fails closed when the cron secret is absent", async () => {
    vi.stubEnv("CRON_SECRET", " ");
    expect((await GET(request("Bearer test-cron-secret"))).status).toBe(401);
    expect(mocks.processPendingLeads).not.toHaveBeenCalled();
  });

  it("reports recovered delivery counts without caching or indexing the response", async () => {
    const response = await GET(request("Bearer test-cron-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", processed: 2, failures: 0, pending: 0, attention: 0 });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(mocks.processPendingLeads).toHaveBeenCalledTimes(1);
  });

  it.each([{ failures: 1, attention: 0 }, { failures: 0, attention: 1 }])(
    "signals recovery errors or required reconciliation: %j", async (problem) => {
      mocks.processPendingLeads.mockResolvedValue({ processed: 2, pending: 1, ...problem });
      const response = await GET(request("Bearer test-cron-secret"));
      expect(response.status).toBe(503);
      expect(await response.json()).toMatchObject({ status: "attention", ...problem });
    },
  );

  it("does not disclose storage error details", async () => {
    mocks.processPendingLeads.mockRejectedValue(new Error("redis-token-and-lead-payload"));
    const response = await GET(request("Bearer test-cron-secret"));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
