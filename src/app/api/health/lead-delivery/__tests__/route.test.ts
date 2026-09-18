import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submissionIssuedAt } from "@/lib/submission-id";
import type { ChannelState } from "@/lib/lead-store";

const mocks = vi.hoisted(() => ({
  rateLimit: vi.fn(), submitContact: vi.fn(), submitQuote: vi.fn(), processLead: vi.fn(), read: vi.fn(),
}));
vi.mock("@/lib/rate-limit", () => ({ getClientIp: () => "203.0.113.10", rateLimit: mocks.rateLimit }));
vi.mock("@/actions/contact", () => ({ submitContact: mocks.submitContact }));
vi.mock("@/actions/quote", () => ({ submitQuote: mocks.submitQuote }));
vi.mock("@/lib/lead-processor", () => ({ processLead: mocks.processLead }));
vi.mock("@/lib/lead-store", () => ({ getLeadStore: () => ({ read: mocks.read }) }));
import { GET } from "@/app/api/health/lead-delivery/route";

const NOW = Date.parse("2026-09-05T10:00:00Z");
function request(secret = "monitor-secret") {
  return new Request("https://caraway.au/api/health/lead-delivery", { headers: { authorization: `Bearer ${secret}` } });
}
function record(webhook: ChannelState = "accepted", email: ChannelState = "accepted") {
  return { channels: {
    webhook: { state: webhook },
    email: { state: email, ...(email === "accepted" ? { providerId: "provider-confirmation" } : {}) },
  } };
}
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(NOW);
  vi.stubEnv("CRON_SECRET", "monitor-secret"); vi.stubEnv("LEAD_MONITOR_ENABLED", "1");
  mocks.submitContact.mockReset().mockResolvedValue({ success: true });
  mocks.submitQuote.mockReset().mockResolvedValue({ success: true });
  mocks.processLead.mockReset().mockResolvedValue(undefined);
  mocks.read.mockReset().mockResolvedValue(record());
  mocks.rateLimit.mockReset().mockResolvedValue({ success: true, reset: NOW + 30_000, mode: "distributed" });
});
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("lead delivery monitor", () => {
  it.each([
    ["unavailable", 503, "unavailable"], ["distributed", 429, "rate_limited"],
  ])("does not capture or process when admission is %s", async (mode, status, bodyStatus) => {
    mocks.rateLimit.mockResolvedValue({ success: false, mode, reset: NOW + 30_000 });
    const response = await GET(request());
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ status: bodyStatus });
    if (status === 429) expect(response.headers.get("Retry-After")).toBe("30");
    expect(mocks.submitQuote).not.toHaveBeenCalled(); expect(mocks.submitContact).not.toHaveBeenCalled();
    expect(mocks.processLead).not.toHaveBeenCalled();
  });

  it("rejects an invalid cron secret before capturing leads", async () => {
    expect((await GET(request("wrong-secret"))).status).toBe(401);
    expect(mocks.submitQuote).not.toHaveBeenCalled(); expect(mocks.submitContact).not.toHaveBeenCalled();
    expect(mocks.processLead).not.toHaveBeenCalled();
  });

  it("does not capture or process when monitoring is disabled", async () => {
    vi.stubEnv("LEAD_MONITOR_ENABLED", "0");
    const response = await GET(request());
    expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ status: "skipped" });
    expect(mocks.submitQuote).not.toHaveBeenCalled(); expect(mocks.submitContact).not.toHaveBeenCalled();
    expect(mocks.processLead).not.toHaveBeenCalled();
  });

  it("verifies saved provider state after processing before reporting delivery success", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", checks: { quote: true, contact: true } });
    for (const [kind, capture] of [["quote", mocks.submitQuote], ["contact", mocks.submitContact]] as const) {
      const id = capture.mock.calls[0][1];
      expect(mocks.processLead).toHaveBeenCalledWith(kind, id, expect.objectContaining({ read: mocks.read }));
      expect(mocks.read).toHaveBeenCalledWith(kind, id);
      expect(capture).toHaveBeenCalledWith(expect.objectContaining({ name: "Caraway Delivery Monitor" }), id);
    }
    expect(mocks.processLead.mock.invocationCallOrder[0]).toBeLessThan(mocks.read.mock.invocationCallOrder[0]);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("does not treat successful capture alone as provider delivery", async () => {
    mocks.read.mockResolvedValue(record("pending", "pending"));
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "error", checks: { quote: false, contact: false } });
    expect(mocks.submitQuote).toHaveBeenCalledTimes(1); expect(mocks.submitContact).toHaveBeenCalledTimes(1);
  });

  it.each(["retry", "manual", "sending"] as const)("flags a configured quote channel in %s even when email is accepted", async (state) => {
    mocks.read.mockImplementation(async (kind: string) => kind === "quote" ? record(state, "accepted") : record());
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ checks: { quote: false, contact: true } });
  });

  it("ignores deliberately disabled channels but never treats all-disabled records as delivered", async () => {
    mocks.read.mockResolvedValue(record("disabled", "accepted"));
    expect((await GET(request())).status).toBe(200);
    mocks.read.mockResolvedValue(record("disabled", "disabled"));
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ checks: { quote: false, contact: false } });
  });

  it("reports a missing saved record as delivery failure", async () => {
    mocks.read.mockImplementation(async (kind: string) => kind === "quote" ? null : record());
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ checks: { quote: false, contact: true } });
  });

  it("does not verify a failed capture and reports processor or read failures safely", async () => {
    mocks.submitContact.mockResolvedValue({ success: false });
    mocks.processLead.mockRejectedValue(new Error("provider-secret"));
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "error", checks: { quote: false, contact: false } });
    expect(mocks.processLead).toHaveBeenCalledTimes(1); expect(mocks.read).not.toHaveBeenCalled();
    mocks.submitContact.mockResolvedValue({ success: true }); mocks.processLead.mockResolvedValue(undefined);
    mocks.read.mockRejectedValue(new Error("storage-secret"));
    const readFailure = await GET(request());
    expect(readFailure.status).toBe(503);
    expect(await readFailure.json()).toMatchObject({ checks: { quote: false, contact: false } });
  });

  it("uses stable daily identifiers and payloads so repeated monitor runs deduplicate", async () => {
    await GET(request());
    const firstQuote = mocks.submitQuote.mock.calls[0];
    const firstContact = mocks.submitContact.mock.calls[0];
    vi.setSystemTime(NOW + 60_000);
    await GET(request());
    expect(mocks.submitQuote.mock.calls[1]).toEqual(firstQuote);
    expect(mocks.submitContact.mock.calls[1]).toEqual(firstContact);
    expect(firstQuote[1]).not.toBe(firstContact[1]);
    expect(submissionIssuedAt(firstQuote[1])).toBe(Date.parse("2026-09-05T00:00:00Z"));
    vi.setSystemTime(NOW + 86_400_000);
    await GET(request());
    expect(mocks.submitQuote.mock.calls[2][1]).not.toBe(firstQuote[1]);
    expect(mocks.submitContact.mock.calls[2][1]).not.toBe(firstContact[1]);
  });

  it("binds monitor IDs to the private secret so public date and kind cannot determine them", async () => {
    await GET(request());
    const firstQuoteId = mocks.submitQuote.mock.calls[0][1];
    const firstContactId = mocks.submitContact.mock.calls[0][1];
    vi.stubEnv("CRON_SECRET", "a-different-private-secret");
    await GET(request("a-different-private-secret"));
    expect(mocks.submitQuote.mock.calls[1][1]).not.toBe(firstQuoteId);
    expect(mocks.submitContact.mock.calls[1][1]).not.toBe(firstContactId);
    expect(submissionIssuedAt(mocks.submitQuote.mock.calls[1][1])).toBe(submissionIssuedAt(firstQuoteId));
    vi.stubEnv("CRON_SECRET", "monitor-secret");
    await GET(request());
    expect(mocks.submitQuote.mock.calls[2][1]).toBe(firstQuoteId);
    expect(mocks.submitContact.mock.calls[2][1]).toBe(firstContactId);
  });
});
