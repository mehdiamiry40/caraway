import { describe, expect, it } from "vitest";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";

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

describe("getBodyAfterLead", () => {
  it("returns everything after the lead sentence", () => {
    expect(getBodyAfterLead("A concise lead. More supporting detail follows.")).toBe(
      "More supporting detail follows.",
    );
  });

  it("returns an empty string when the lead is the whole content", () => {
    expect(getBodyAfterLead("A concise lead.")).toBe("");
    expect(getBodyAfterLead("A concise lead")).toBe("");
  });

  it("keeps later sentences intact", () => {
    expect(getBodyAfterLead("One. Two. Three.")).toBe("Two. Three.");
  });

  it("splits on the first terminator regardless of type", () => {
    expect(getBodyAfterLead("Is it worth it? Usually, yes.")).toBe("Usually, yes.");
  });
});
