import { describe, expect, it } from "vitest";
import { getLeadSentence } from "@/lib/content-summary";

describe("getLeadSentence", () => {
  it("returns the first complete sentence", () => {
    expect(getLeadSentence("A concise lead. More supporting detail follows.")).toBe(
      "A concise lead.",
    );
  });

  it("returns the original content when there is no sentence terminator", () => {
    expect(getLeadSentence("A concise lead")).toBe("A concise lead");
  });
});
