import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const securityMocks = vi.hoisted(() => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  getClientIp: () => "203.0.113.10",
  rateLimit: securityMocks.rateLimit,
}));

vi.mock("@/actions/contact", () => ({
  submitContact: vi.fn(),
}));
vi.mock("@/actions/quote", () => ({
  submitQuote: vi.fn(),
}));

import { submitContact } from "@/actions/contact";
import { submitQuote } from "@/actions/quote";
import { GET } from "@/app/api/health/lead-delivery/route";

const mockedSubmitContact = vi.mocked(submitContact);
const mockedSubmitQuote = vi.mocked(submitQuote);

function request(secret = "monitor-secret") {
  return new Request("https://caraway.au/api/health/lead-delivery", {
    headers: { authorization: `Bearer ${secret}` },
  });
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "monitor-secret");
  vi.stubEnv("LEAD_MONITOR_ENABLED", "1");
  mockedSubmitContact.mockReset();
  mockedSubmitQuote.mockReset();
  securityMocks.rateLimit.mockReset();
  securityMocks.rateLimit.mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60_000,
    mode: "distributed",
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/health/lead-delivery", () => {
  it("returns 503 when shared enforcement is unavailable", async () => {
    securityMocks.rateLimit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: 0,
      mode: "unavailable",
    });

    const response = await GET(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "unavailable" });
    expect(mockedSubmitContact).not.toHaveBeenCalled();
    expect(mockedSubmitQuote).not.toHaveBeenCalled();
  });

  it("rejects callers without the cron secret", async () => {
    const response = await GET(new Request("https://caraway.au/api/health/lead-delivery"));

    expect(response.status).toBe(401);
    expect(mockedSubmitContact).not.toHaveBeenCalled();
    expect(mockedSubmitQuote).not.toHaveBeenCalled();
  });

  it("does not deliver when monitoring is disabled", async () => {
    vi.stubEnv("LEAD_MONITOR_ENABLED", "0");

    const response = await GET(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "skipped" });
    expect(mockedSubmitContact).not.toHaveBeenCalled();
    expect(mockedSubmitQuote).not.toHaveBeenCalled();
  });

  it("reports success when both synthetic leads are delivered", async () => {
    mockedSubmitContact.mockResolvedValue({ success: true });
    mockedSubmitQuote.mockResolvedValue({ success: true });

    const response = await GET(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      checks: { quote: true, contact: true },
    });
    expect(mockedSubmitQuote).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Caraway Delivery Monitor" }),
    );
    expect(mockedSubmitContact).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Caraway Delivery Monitor" }),
    );
  });

  it("fails when either public form cannot deliver", async () => {
    mockedSubmitContact.mockResolvedValue({
      success: false,
      message: "delivery unavailable",
    });
    mockedSubmitQuote.mockResolvedValue({ success: true });

    const response = await GET(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "error",
      checks: { quote: true, contact: false },
    });
  });
});
