export { quoteConditionValues } from "@/lib/quote-validation-rules";
import { quoteConditionValues } from "@/lib/quote-validation-rules";

export type QuoteCondition = (typeof quoteConditionValues)[number];

export const CONDITION_LABELS: Record<QuoteCondition, string> = {
  running: "Running — drives well, no major issues",
  needs_work: "Needs work — runs but has issues",
  not_running: "Not running — won't start or drive",
  damaged: "Damaged — accident, flood, or major fault",
  scrap: "Scrap — written off or end of life",
};

export const MANUAL_REVIEW_CONDITIONS = new Set<QuoteCondition>([
  "running",
  "needs_work",
]);
