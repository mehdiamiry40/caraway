import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitForm } from "@/actions/submit-form";
import { quoteFormSchema } from "@/lib/quote-schema";

const baseValid = {
  name: "Jane Doe",
  phone: "0412345678",
  make: "Toyota",
  model: "Hilux",
  year: 2015,
  condition: "running" as const,
  address: "12 George St, Brisbane",
  honeypot: "",
  marketingConsent: false,
};

let warnSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  // Reset cached env module so getEnv() re-reads stubbed values.
  vi.resetModules();
});

afterEach(() => {
  warnSpy.mockRestore();
  errorSpy.mockRestore();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("submitForm — mock mode", () => {
  it("returns success in development when no endpoint is configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    // env.ts's zod schema rejects empty-string URLs, so we need to fully
    // remove QUOTE_ENDPOINT (not just stub it to "") to trigger mock mode.
    const previous = process.env.QUOTE_ENDPOINT;
    delete process.env.QUOTE_ENDPOINT;

    try {
      // Re-import after env stubs so getEnv() picks up cleared QUOTE_ENDPOINT.
      const { submitForm: submitFormFresh } = await import("@/actions/submit-form");

      const result = await submitFormFresh({
        schema: quoteFormSchema,
        data: baseValid,
        endpointEnvVar: "QUOTE_ENDPOINT",
        label: "Quote submission",
      });

      expect(result).toEqual({ success: true });
    } finally {
      if (previous !== undefined) {
        process.env.QUOTE_ENDPOINT = previous;
      }
    }
  }, 10_000);
});

describe("submitForm — schema failures", () => {
  it("returns Invalid form data when the schema rejects", async () => {
    const result = await submitForm({
      schema: quoteFormSchema,
      data: { ...baseValid, name: "" },
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    });

    expect(result.success).toBe(false);
    if (!result.success && "message" in result) {
      expect(result.message).toBe("Invalid form data");
    } else {
      throw new Error("expected schema failure to carry a message");
    }
  });

  it("logs a [honeypot] warning when honeypot is the cause", async () => {
    const result = await submitForm({
      schema: quoteFormSchema,
      data: { ...baseValid, honeypot: "spam payload" },
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    });

    expect(result.success).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
    const warned = warnSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    expect(warned).toContain("[honeypot]");
  });
});

describe("submitForm — unconfigured endpoint in production", () => {
  it("returns { success: false, skipped: true } and emits no error log", async () => {
    vi.stubEnv("NODE_ENV", "production");
    // Intentionally unset the webhook env var — operator is running
    // email-only delivery and expects this to be a quiet skip, not a
    // loud failure.
    const previous = process.env.QUOTE_ENDPOINT;
    delete process.env.QUOTE_ENDPOINT;

    try {
      const { submitForm: submitFormFresh } = await import(
        "@/actions/submit-form"
      );

      const result = await submitFormFresh({
        schema: quoteFormSchema,
        data: baseValid,
        endpointEnvVar: "QUOTE_ENDPOINT",
        label: "Quote submission",
      });

      expect(result.success).toBe(false);
      if (!result.success && "skipped" in result) {
        expect(result.skipped).toBe(true);
      } else {
        throw new Error(
          "expected unconfigured endpoint to return skipped: true",
        );
      }
      // No ops error log — skipped is an intentional config choice.
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      if (previous !== undefined) {
        process.env.QUOTE_ENDPOINT = previous;
      }
    }
  });
});

describe("submitForm — endpoint failures", () => {
  it("fails when the endpoint URL fails the allowlist (e.g. http://evil.com)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/webhook");
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "trusted.example.com");
    vi.resetModules();

    const { submitForm: submitFormFresh } = await import("@/actions/submit-form");

    const result = await submitFormFresh({
      schema: quoteFormSchema,
      data: baseValid,
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    });

    expect(result.success).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("fails when the endpoint responds with HTTP 500", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/webhook");
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "");
    vi.resetModules();

    const fetchMock = vi.fn(async () =>
      new Response("server error", { status: 500 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitForm: submitFormFresh } = await import("@/actions/submit-form");

    const result = await submitFormFresh({
      schema: quoteFormSchema,
      data: baseValid,
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    });

    expect(result.success).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("returns success when the endpoint responds with 200", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/webhook");
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "");
    vi.resetModules();

    const fetchMock = vi.fn(async () =>
      new Response("ok", { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitForm: submitFormFresh } = await import("@/actions/submit-form");

    const result = await submitFormFresh({
      schema: quoteFormSchema,
      data: baseValid,
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    });

    expect(result).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

