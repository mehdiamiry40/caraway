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

  it("dates every post with visible supplemental FAQs no earlier than rollout", () => {
    const supplementalPosts = blogPosts.filter(
      (post) => getRenderableBlogFaqs(post).length > 0,
    );

    // Guard the rule, not the current tally, so adding a post with FAQs does
    // not require editing this file. The length check only keeps the loop
    // below from passing vacuously.
    expect(supplementalPosts.length).toBeGreaterThan(0);
    for (const post of supplementalPosts) {
      expect(post.updatedAt >= BLOG_FAQ_ROLLOUT_DATE, post.slug).toBe(true);
      expect(getRenderableBlogFaqs(post).length, post.slug).toBeGreaterThan(0);
    }

    // A post that authors its own FAQ section renders no supplemental fields,
    // so the rollout must leave its modification date alone.
    const authoredPost = blogPosts.find(
      (post) => post.slug === "cash-for-cars-vs-private-sale",
    );
    expect(getRenderableBlogFaqs(authoredPost!)).toHaveLength(0);
    expect(authoredPost?.updatedAt).not.toBe(BLOG_FAQ_ROLLOUT_DATE);
    expect(authoredPost!.updatedAt < BLOG_FAQ_ROLLOUT_DATE).toBe(true);

    // Gaining visible FAQs moves the modification date but must not invent a
    // newer review date for the regulated claims.
    const reviewedPost = blogPosts.find(
      (post) => post.slug === "sell-van-brisbane",
    );
    expect(reviewedPost?.updatedAt).toBe(BLOG_FAQ_ROLLOUT_DATE);
    expect(reviewedPost!.reviewedAt! < BLOG_FAQ_ROLLOUT_DATE).toBe(true);

    // A post genuinely updated after the rollout keeps its own later dates.
    const laterUpdatedPost = blogPosts.find(
      (post) => post.slug === "sell-my-ute-brisbane",
    );
    expect(laterUpdatedPost!.updatedAt > BLOG_FAQ_ROLLOUT_DATE).toBe(true);
    expect(laterUpdatedPost?.reviewedAt).toBe(laterUpdatedPost?.updatedAt);
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
