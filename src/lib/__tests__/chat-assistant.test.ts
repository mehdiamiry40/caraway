import { describe, expect, it } from "vitest";

import {
  CHAT_INSTRUCTIONS,
  CHAT_MODEL,
  getChatEstimate,
  getChatVisitorId,
} from "@/lib/chat-assistant";

describe("Caraway chat assistant", () => {
  it("uses GPT-5.6 Luna through Vercel AI Gateway", () => {
    expect(CHAT_MODEL).toBe("openai/gpt-5.6-luna");
  });

  it("routes running vehicles to manual review", () => {
    const estimate = getChatEstimate({
      make: "Toyota",
      model: "Corolla",
      year: new Date().getFullYear() - 5,
      condition: "running",
    });

    expect(estimate.amount).toBeNull();
    expect(estimate.displayAmount).toBe("Manual review needed");
    expect(estimate.status).toBe("manual_review");
    expect(estimate.disclaimer).toContain("buyer will review");
  });

  it("uses the deterministic estimator for damaged-vehicle amounts", () => {
    const estimate = getChatEstimate({
      make: "Toyota",
      model: "Corolla",
      year: new Date().getFullYear() - 5,
      condition: "damaged",
    });

    expect(estimate.amount).toBeTypeOf("number");
    expect(estimate.displayAmount).toMatch(/^\$/);
    expect(estimate.status).toBe("indicative_estimate");
    expect(estimate.disclaimer).toContain("confirmed offer");
  });

  it("explicitly forbids invented quotes and personal-data collection", () => {
    expect(CHAT_INSTRUCTIONS).toContain(
      "Never calculate, guess, or invent a dollar amount yourself.",
    );
    expect(CHAT_INSTRUCTIONS).toContain(
      "Do not collect names, phone numbers, addresses, IDs",
    );
  });

  it("creates a stable opaque visitor identifier", () => {
    const first = getChatVisitorId("203.0.113.1", "Test browser");
    const second = getChatVisitorId("203.0.113.1", "Test browser");
    const other = getChatVisitorId("203.0.113.2", "Test browser");

    expect(first).toBe(second);
    expect(first).not.toBe(other);
    expect(first).toMatch(/^[a-f0-9]{32}$/);
    expect(first).not.toContain("203.0.113.1");
  });
});
