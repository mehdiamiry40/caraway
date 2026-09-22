import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { QuoteFormInput } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({ after: vi.fn(), rateLimit: vi.fn() }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.rateLimit }));
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
  it("discards honeypot input before capture or admission", async () => {
    const id = createSubmissionId();
    expect(await submitQuote({ ...quote, honeypot: "spam" }, id)).toEqual({ success: true });
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
