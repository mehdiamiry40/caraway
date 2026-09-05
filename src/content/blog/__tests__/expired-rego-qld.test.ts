import { describe, expect, it } from "vitest";
import { post } from "@/content/blog/posts/expired-rego-qld";

describe("expired registration CTP guidance", () => {
  it("qualifies the grace period in the article and the standalone FAQ", () => {
    const body = post.content.join("\n");
    const faq = post.faqs?.find(({ question }) => question.includes("still insured"))?.answer;

    expect(faq).toBeDefined();
    for (const text of [body, faq!]) {
      expect(text).toMatch(/section 23/i);
      expect(text).toMatch(/30 days/);
      expect(text).toMatch(/exceptions/i);
      expect(text).toMatch(/not permission to drive/i);
      expect(text).toMatch(/CTP insurer or (?:the Motor Accident Insurance Commission \()?MAIC/);
      expect(text).toMatch(/does not retrospectively/);
      expect(text).not.toMatch(/cover ends (?:when|with)|not for CTP/i);
    }
    expect(body).toContain("ending earlier on renewal or the grant of an unregistered vehicle permit");
    expect(body).toContain("Cancellation and special-plate exceptions");
    expect(post.sources).toContainEqual({
      title: "Queensland legislation — Motor Accident Insurance Act 1994, section 23",
      url: "https://www.legislation.qld.gov.au/view/whole/html/inforce/current/act-1994-009#sec.23",
    });
  });
});
