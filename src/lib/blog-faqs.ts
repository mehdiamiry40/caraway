export interface RenderableBlogFaq {
  question: string;
  answer: string;
}

/** Date supplemental FAQ fields first became visible article content. */
export const BLOG_FAQ_ROLLOUT_DATE = "2026-08-10";

interface BlogFaqSource {
  content?: readonly unknown[];
  faqs?: unknown;
}

const AUTHORED_FAQ_HEADING =
  /^##[ \t]+(?:faqs?|frequently[ \t]+asked[ \t]+questions)[ \t]*#*[ \t]*$/i;

/**
 * Detect an authored level-two FAQ section in the article body. These headings
 * already introduce visible answers, so supplemental FAQ fields must not be
 * rendered as a second section.
 */
export function hasAuthoredBlogFaqSection(
  content: readonly unknown[] | undefined,
): boolean {
  if (!Array.isArray(content)) return false;

  return content.some(
    (block) =>
      typeof block === "string" &&
      block
        .split(/\r?\n/)
        .some((line) => AUTHORED_FAQ_HEADING.test(line.trim())),
  );
}

/**
 * Return supplemental FAQs that can be rendered safely. Authored body sections
 * take precedence, and malformed or blank runtime data is ignored.
 */
export function getRenderableBlogFaqs(
  source: BlogFaqSource,
): RenderableBlogFaq[] {
  if (hasAuthoredBlogFaqSection(source.content) || !Array.isArray(source.faqs)) {
    return [];
  }

  return source.faqs.flatMap((faq) => {
    if (!faq || typeof faq !== "object") return [];

    const record = faq as Record<string, unknown>;
    const question =
      typeof record.question === "string" ? record.question.trim() : "";
    const answer =
      typeof record.answer === "string" ? record.answer.trim() : "";

    return question && answer ? [{ question, answer }] : [];
  });
}

/** Plain blocks for read-time and BlogPosting word-count calculations. */
export function getRenderableBlogFaqTextBlocks(
  source: BlogFaqSource,
): string[] {
  const faqs = getRenderableBlogFaqs(source);
  if (faqs.length === 0) return [];

  return [
    "Frequently asked questions",
    ...faqs.flatMap(({ question, answer }) => [question, answer]),
  ];
}

/**
 * Keep modification signals honest when supplemental fields become visible,
 * without moving genuinely newer article dates backwards.
 */
export function applyBlogFaqRolloutDate(
  source: BlogFaqSource,
  currentUpdatedAt: string,
): string {
  return getRenderableBlogFaqs(source).length > 0 &&
    currentUpdatedAt < BLOG_FAQ_ROLLOUT_DATE
    ? BLOG_FAQ_ROLLOUT_DATE
    : currentUpdatedAt;
}
