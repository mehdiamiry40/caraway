import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import {
  applyBlogFaqRolloutDate,
  BLOG_FAQ_ROLLOUT_DATE,
  getRenderableBlogFaqs,
  getRenderableBlogFaqTextBlocks,
  hasAuthoredBlogFaqSection,
} from "@/lib/blog-faqs";

describe("blog FAQ rendering guard", () => {
  it.each([
    "## FAQ",
    "## FAQs",
    "## Frequently asked questions",
    "  ## frequently ASKED questions  ",
    "## FAQ ##",
  ])("recognizes an authored H2 heading: %s", (heading) => {
    expect(hasAuthoredBlogFaqSection(["Introduction", heading])).toBe(true);
  });

  it.each([
    "# FAQ",
    "### FAQ",
    "## FAQ about pricing",
    "## Frequently asked questions for sellers",
    "**FAQ**",
  ])("does not mistake other headings for the authored FAQ guard: %s", (heading) => {
    expect(hasAuthoredBlogFaqSection([heading])).toBe(false);
  });

  it("detects the heading inside a multiline content block", () => {
    expect(
      hasAuthoredBlogFaqSection([
        "Opening paragraph\n\n## Frequently asked questions\n\nAnswer",
      ]),
    ).toBe(true);
  });

  it("suppresses supplemental fields when the body already authors the section", () => {
    expect(
      getRenderableBlogFaqs({
        content: ["## FAQs"],
        faqs: [{ question: "Duplicate question?", answer: "Duplicate answer." }],
      }),
    ).toEqual([]);
  });

  it("trims valid fields and filters malformed or blank runtime entries", () => {
    const source = {
      content: ["Article body"],
      faqs: [
        { question: "  Valid question?  ", answer: "  Valid answer.  " },
        { question: "", answer: "No question." },
        { question: "No answer?", answer: "   " },
        { question: 42, answer: "Wrong question type." },
        null,
        "not an object",
      ],
    };

    expect(getRenderableBlogFaqs(source)).toEqual([
      { question: "Valid question?", answer: "Valid answer." },
    ]);
    expect(getRenderableBlogFaqTextBlocks(source)).toEqual([
      "Frequently asked questions",
      "Valid question?",
      "Valid answer.",
    ]);
  });

  it("gives every live post exactly one FAQ source", () => {
    for (const post of blogPosts) {
      const hasAuthoredSection = hasAuthoredBlogFaqSection(post.content);
      const supplementalFaqs = getRenderableBlogFaqs(post);

      if (hasAuthoredSection) {
        expect(supplementalFaqs, post.slug).toEqual([]);
      } else if (post.faqs?.length) {
        expect(supplementalFaqs.length, post.slug).toBeGreaterThan(0);
      } else {
        expect(supplementalFaqs, post.slug).toEqual([]);
      }
    }
  });

  it("dates only the 22 posts gaining 80 visible supplemental FAQs", () => {
    const supplementalPosts = blogPosts.filter(
      (post) => getRenderableBlogFaqs(post).length > 0,
    );

    expect(supplementalPosts).toHaveLength(22);
    expect(
      supplementalPosts.reduce(
        (count, post) => count + getRenderableBlogFaqs(post).length,
        0,
      ),
    ).toBe(80);
    for (const post of supplementalPosts) {
      expect(post.updatedAt, post.slug).toBe(BLOG_FAQ_ROLLOUT_DATE);
    }

    const authoredPost = blogPosts.find(
      (post) => post.slug === "cash-for-cars-vs-private-sale",
    );
    expect(authoredPost?.updatedAt).toBe("2026-04-26");

    const reviewedPost = blogPosts.find(
      (post) => post.slug === "sell-van-brisbane",
    );
    expect(reviewedPost?.updatedAt).toBe(BLOG_FAQ_ROLLOUT_DATE);
    expect(reviewedPost?.reviewedAt).toBe("2026-08-08");
  });

  it("never rolls a genuinely newer modification date backwards", () => {
    expect(
      applyBlogFaqRolloutDate(
        {
          content: ["Article body"],
          faqs: [{ question: "Question?", answer: "Answer." }],
        },
        "2026-08-11",
      ),
    ).toBe("2026-08-11");
  });

  it("keeps every accordion-bound FAQ free of unsupported markdown", () => {
    const unsupportedMarkdown =
      /(?:\*\*|__|`|!\[|\[[^\]]+\]\([^)]+\)|^\s{0,3}#{1,6}\s|<\/?[a-z][^>]*>)/im;
    const failures = blogPosts.flatMap((post) =>
      getRenderableBlogFaqs(post).flatMap((faq) =>
        [faq.question, faq.answer].flatMap((value) =>
          unsupportedMarkdown.test(value) ? [`${post.slug}: ${value}`] : [],
        ),
      ),
    );

    expect(failures).toEqual([]);
  });
});
