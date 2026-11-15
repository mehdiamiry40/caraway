import { describe, expect, it } from "vitest";
import { DeliveryFailure, failureCode, providerFailureCode } from "@/lib/delivery-failure";

describe("delivery failure codes", () => {
  it("joins a provider's error name and HTTP status", () => {
    expect(providerFailureCode({ name: "validation_error", statusCode: 422 })).toBe("validation_error_422");
    expect(providerFailureCode({ name: "rate_limit_exceeded", statusCode: 429 })).toBe("rate_limit_exceeded_429");
    expect(providerFailureCode({ name: "application_error", statusCode: null })).toBe("application_error");
  });

  it.each([
    [{ name: "The inbox@example.com domain is not verified", statusCode: 403 }, "provider_error_403"],
    [{ name: "x".repeat(200), statusCode: 500 }, "provider_error_500"],
    [{ name: "validation_error\r\nforged log line", statusCode: 422 }, "provider_error_422"],
    [{ name: 42, statusCode: "422" }, "provider_error"],
    [{ statusCode: 99_999 }, "provider_error"],
    [{}, "provider_error"],
  ])("never passes provider-supplied text through: %j", (error, expected) => {
    expect(providerFailureCode(error)).toBe(expected);
  });

  it("classifies thrown errors without using their message", () => {
    expect(failureCode(new DeliveryFailure("anything", "http_502"))).toBe("http_502");
    expect(failureCode(new DOMException("The operation timed out.", "TimeoutError"))).toBe("timeout");
    expect(failureCode(new DOMException("Aborted.", "AbortError"))).toBe("aborted");
    expect(failureCode(new TypeError("fetch failed: https://hooks.example.com/secret-path"))).toBe("request_failed");
    expect(failureCode("0412345678")).toBe("request_failed");
    expect(failureCode(undefined)).toBe("request_failed");
  });

  it("refuses a code that is not from the fixed vocabulary", () => {
    expect(new DeliveryFailure("m", "Jane Doe <jane@example.com>").code).toBe("unrecognised");
    expect(failureCode(Object.assign(new Error("m"), { name: "DeliveryFailure", code: "has spaces" }))).toBe("unrecognised");
    expect(failureCode(Object.assign(new Error("m"), { name: "DeliveryFailure", code: 7 }))).toBe("request_failed");
  });
});
