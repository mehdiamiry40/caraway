import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { QuoteFormInput } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({ after: vi.fn(), rateLimit: vi.fn(), headers: vi.fn() }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  getClientIp: (await importOriginal<typeof import("@/lib/rate-limit")>()).getClientIp,
  leadRateLimit: mocks.rateLimit,
  outageRateLimit: vi.fn(),
}));
const quote: QuoteFormInput = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running", suburb: "Brisbane", honeypot: "",
};
let submitQuote: typeof import("@/actions/quote").submitQuote;
let store: LeadStore;
beforeEach(async () => {
  vi.resetModules(); vi.stubEnv("NODE_ENV", "test");
  for (const key of ["KV_REST_API_URL", "KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ALLOWED_ENDPOINT_HOSTS", "QUOTE_NOTIFICATION_FROM", "QUOTE_NOTIFICATION_TO"]) vi.stubEnv(key, "");
  vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/quote");
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected network request"); }));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.after.mockReset(); mocks.rateLimit.mockReset().mockResolvedValue({ success: true });
  mocks.headers.mockReset().mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.7" }));
  store = (await import("@/lib/lead-store")).getLeadStore();
  ({ submitQuote } = await import("@/actions/quote"));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("submitQuote capture boundary", () => {
  it("stores normalized fields before success, deduplicates retries, and leaves delivery pending", async () => {
    const id = createSubmissionId();
    expect(await submitQuote({ ...quote, name: " Jane Doe ", phone: "0412 345 678", year: "2015" }, id)).toEqual({ success: true });
    expect(await store.read("quote", id)).toMatchObject({ payload: quote, channels: { webhook: { state: "pending", attempts: 0 } } });
    expect(mocks.after).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.rateLimit).toHaveBeenCalledWith("forms-global", "global");
    expect(await submitQuote(quote, id)).toEqual({ success: true });
    expect(await store.health()).toEqual({ pending: 1, attention: 0 });
  });
  it("requires a submission identifier for valid input", async () => {
    expect(await submitQuote(quote)).toMatchObject({ success: false, message: expect.stringMatching(/refresh/) });
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
  it("does not capture or schedule invalid input", async () => {
    const id = createSubmissionId();
    expect(await submitQuote({ ...quote, name: "" }, id)).toEqual({ success: false, message: "Invalid form data" });
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
  it("saves a valid request whose hidden trap field was filled, labelled as possible spam", async () => {
    const id = createSubmissionId();
    expect(await submitQuote({ ...quote, honeypot: "https://autofilled.example" }, id)).toEqual({ success: true });
    expect(await store.read("quote", id)).toMatchObject({ possibleSpam: true, payload: quote });
    expect(mocks.after).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalled();
  });
  it("refuses an invalid request with a filled trap instead of pretending it worked", async () => {
    const id = createSubmissionId();
    expect(await submitQuote({ ...quote, phone: "123", honeypot: "spam" }, id)).toEqual({ success: false, message: "Invalid form data" });
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
});
