import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: mocks.rateLimit,
}));

import {
  deliverLead,
  isHoneypotHit,
  rejectInvalidLead,
} from "@/actions/lead-delivery";
import type { submitForm } from "@/actions/submit-form";

type WebhookResult = Awaited<ReturnType<typeof submitForm>>;

const webhookOk: WebhookResult = { success: true };
const emailOk = { sent: true };

let warnSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mocks.rateLimit.mockReset();
  mocks.rateLimit.mockResolvedValue({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 60_000,
    mode: "distributed",
  });
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});

function loggedErrors(): string {
  return errorSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
}

describe("deliverLead", () => {
  it("succeeds silently when both channels deliver", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve(webhookOk),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(mocks.rateLimit).toHaveBeenCalledWith("forms-global", "global");
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("does not invoke either channel when the global delivery budget is exhausted", async () => {
    const webhook = vi.fn(() => Promise.resolve(webhookOk));
    const email = vi.fn(() => Promise.resolve(emailOk));
    mocks.rateLimit.mockResolvedValue({
      success: false,
      limit: 100,
      remaining: 0,
      reset: Date.now() + 30_000,
      mode: "distributed",
    });

    const result = await deliverLead({
      logTag: "submit-test",
      webhook,
      email,
    });

    expect(result.success).toBe(false);
    expect(webhook).not.toHaveBeenCalled();
    expect(email).not.toHaveBeenCalled();
    expect(loggedErrors()).toContain("lead delivery admission exhausted");
  });

  it("does not invoke either channel when shared enforcement is unavailable", async () => {
    const webhook = vi.fn(() => Promise.resolve(webhookOk));
    const email = vi.fn(() => Promise.resolve(emailOk));
    mocks.rateLimit.mockResolvedValue({
      success: false,
      limit: 100,
      remaining: 0,
      reset: 0,
      mode: "unavailable",
    });

    const result = await deliverLead({
      logTag: "submit-test",
      webhook,
      email,
    });

    expect(result.success).toBe(false);
    expect(webhook).not.toHaveBeenCalled();
    expect(email).not.toHaveBeenCalled();
    expect(loggedErrors()).toContain("lead delivery admission unavailable");
  });

  it("succeeds but logs when the webhook fails with a message", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve({ success: false, message: "boom" }),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(loggedErrors()).toContain("[submit-test] webhook delivery failed:");
    expect(loggedErrors()).toContain("boom");
  });

  it("treats an intentionally skipped webhook as quiet, not a failure", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve({ success: false, skipped: true }),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("fails quietly when webhook is skipped and email is unconfigured", async () => {
    // skipped webhook + sent:false email both mean "channel not configured",
    // so the lead cannot be delivered but neither channel is an ops error.
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve({ success: false, skipped: true }),
      email: () => Promise.resolve({ sent: false }),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toMatch(/couldn't send/i);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs the rejection reason when the webhook promise rejects with an Error", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.reject(new Error("net down")),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(loggedErrors()).toContain("net down");
  });

  it("stringifies non-Error webhook rejections", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.reject("string reason"),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(loggedErrors()).toContain("string reason");
  });

  it("logs email rejections while the webhook carries the lead", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve(webhookOk),
      email: () => Promise.reject(new Error("resend down")),
    });

    expect(result).toEqual({ success: true });
    expect(loggedErrors()).toContain("[submit-test] email delivery failed:");
    expect(loggedErrors()).toContain("resend down");
  });

  it("fails with the generic message and logs both reasons when both channels reject", async () => {
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.reject(new Error("webhook kaboom")),
      email: () => Promise.reject(new Error("email kaboom")),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toMatch(/couldn't send/i);
    }
    expect(loggedErrors()).toContain("webhook kaboom");
    expect(loggedErrors()).toContain("email kaboom");
  });

  it("falls back to an 'unknown failure' reason for unrecognised webhook shapes", async () => {
    const weird = { success: false } as unknown as WebhookResult;
    const result = await deliverLead({
      logTag: "submit-test",
      webhook: () => Promise.resolve(weird),
      email: () => Promise.resolve(emailOk),
    });

    expect(result).toEqual({ success: true });
    expect(loggedErrors()).toContain("unknown failure");
  });
});

describe("rejectInvalidLead", () => {
  it("swallows honeypot hits with a fake success and a [honeypot] warn", () => {
    const result = rejectInvalidLead("quote", {
      issues: [{ path: ["honeypot"] }],
    });

    expect(result).toEqual({ success: true });
    const warned = warnSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    expect(warned).toContain("[honeypot]");
    expect(warned).toContain("quote spam detected");
  });

  it("returns the generic invalid message for ordinary validation failures", () => {
    const result = rejectInvalidLead("contact", {
      issues: [{ path: ["phone"] }],
    });

    expect(result).toEqual({ success: false, message: "Invalid form data" });
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe("isHoneypotHit", () => {
  it("detects the honeypot path among multiple issues", () => {
    expect(
      isHoneypotHit({ issues: [{ path: ["name"] }, { path: ["honeypot"] }] }),
    ).toBe(true);
  });

  it("returns false when no issue touches the honeypot", () => {
    expect(isHoneypotHit({ issues: [{ path: ["name"] }] })).toBe(false);
  });
});
