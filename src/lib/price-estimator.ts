import {
  MANUAL_REVIEW_CONDITIONS,
  type QuoteCondition,
} from "@/lib/quote-condition";
import { MAX_PRICE, MIN_PRICE } from "@/lib/site";

/** Car makes grouped by demand tier — higher demand = higher price */
const MAKE_TIERS: Record<string, string[]> = {
  high: [
    "toyota", "mazda", "hyundai", "kia", "honda", "mitsubishi",
    "subaru", "suzuki", "nissan", "isuzu", "gwm", "tesla", "ram",
  ],
  medium: [
    "ford", "holden", "volkswagen", "skoda", "mg",
    "haval", "great wall", "ssangyong", "ldv",
  ],
  low: [
    "bmw", "mercedes", "audi", "volvo", "lexus", "peugeot",
    "citroen", "renault", "fiat", "alfa romeo", "jeep",
    "chrysler", "dodge", "saab", "daewoo", "proton",
    "land rover", "range rover", "lotus", "mini", "byd",
    "polestar", "cupra", "genesis",
  ],
};

type MakeTier = "high" | "medium" | "low";

/**
 * Central pricing configuration. Keep every magic number here so the
 * tuning surface is discoverable and easy to test.
 *
 * Tuned for a scrap-focused buyer: the vast majority of vehicles we
 * collect are bought for their hull/parts value, so base values and
 * spreads are narrow — quotes are capped at $9,999 and depend on vehicle details.
 */
const PRICE_TABLE = {
  /** Base value brackets by vehicle age (years). First matching bracket wins. */
  ageBaseValues: [
    { maxAge: 3, base: 1200 },
    { maxAge: 6, base: 1000 },
    { maxAge: 10, base: 800 },
    { maxAge: 15, base: 600 },
    { maxAge: 20, base: 450 },
    { maxAge: Infinity, base: 350 },
  ] as const,
  /** Multiplier applied based on make-tier (demand). Narrow spread — scrap
   * value doesn't swing much by brand once the car is off the road. */
  makeMultipliers: {
    high: 1.1,
    medium: 1.0,
    low: 0.9,
  } satisfies Record<MakeTier, number>,
  /** Minimum scrap value floor — even a written-off hull has metal value. */
  scrapFloor: 200,
  /** Round the exact quote to the nearest this many dollars. */
  quoteRoundTo: 50,
  /** Absolute floor/ceiling on the returned quote. Sourced from site.ts. */
  minQuote: MIN_PRICE,
  maxQuote: MAX_PRICE,
} as const;

function getMakeTier(make: string): MakeTier {
  const lower = make.toLowerCase().trim();
  for (const [tier, makes] of Object.entries(MAKE_TIERS)) {
    if (makes.some((m) => lower.includes(m))) return tier as MakeTier;
  }
  return "medium";
}

/** Condition multipliers — keys match the Zod quoteConditionValues enum. */
export const CONDITION_MULTIPLIER: Record<QuoteCondition, number> = {
  running: 1.0,
  needs_work: 0.65,
  damaged: 0.3,
  not_running: 0.2,
  scrap: 0.15,
};

export interface EstimateInput {
  make: string;
  model: string;
  year: number;
  condition: string;
}

export type EstimateResult = {
  status: "indicative_estimate";
  /** Scrap/parts-focused indicative amount shown before manual review. */
  quote: number;
  factors: string[];
} | {
  status: "manual_review";
  /** Running vehicles need market inputs this lightweight tool does not collect. */
  quote: null;
  factors: string[];
};

function getBaseValueForAge(age: number): number {
  for (const bracket of PRICE_TABLE.ageBaseValues) {
    if (age <= bracket.maxAge) return bracket.base;
  }
  return PRICE_TABLE.ageBaseValues[PRICE_TABLE.ageBaseValues.length - 1].base;
}

export function estimatePrice(input: EstimateInput): EstimateResult {
  const currentYear = new Date().getFullYear();

  // Input validation guard — bail out with a safe fallback when year is unusable.
  if (
    !Number.isFinite(input.year) ||
    Number.isNaN(input.year) ||
    input.year < 1950 ||
    input.year > currentYear
  ) {
    return {
      status: "manual_review",
      quote: null,
      factors: ["Confirm vehicle details — we'll sharpen this quote on the call"],
    };
  }

  const age = Math.max(0, currentYear - input.year);
  const makeIsEmpty = !input.make || input.make.trim() === "";
  const makeString = [input.make, input.model].filter(Boolean).join(" ");
  const makeTier = makeIsEmpty ? "medium" : getMakeTier(makeString);
  const conditionMult =
    CONDITION_MULTIPLIER[input.condition as QuoteCondition] ?? 0.5;

  if (MANUAL_REVIEW_CONDITIONS.has(input.condition as QuoteCondition)) {
    const factors = [
      "Running vehicles need kilometres, variant, completeness, and resale demand checked",
    ];
    if (makeTier === "high") {
      factors.push("High-demand brand — local resale and parts demand will be reviewed");
    } else if (makeTier === "low") {
      factors.push("Specialty brand — local resale and parts demand will be reviewed");
    }
    if (age <= 5) factors.push("Late-model vehicle — a buyer will assess current market value");
    return { status: "manual_review", quote: null, factors };
  }

  const baseValue = getBaseValueForAge(age);
  const makeMult = PRICE_TABLE.makeMultipliers[makeTier];

  const estimated = baseValue * makeMult * conditionMult;

  const { quoteRoundTo, minQuote, maxQuote, scrapFloor } = PRICE_TABLE;

  // Round to the nearest $50 bucket so quotes feel deliberate and scannable.
  const rounded = Math.round(estimated / quoteRoundTo) * quoteRoundTo;

  // Clamp into the advertised bracket and enforce the scrap-value floor —
  // even a written-off car has hull value.
  const effectiveFloor = Math.max(minQuote, scrapFloor);
  const quote = Math.min(maxQuote, Math.max(effectiveFloor, rounded));

  // Build factors
  const factors: string[] = [];
  if (makeIsEmpty) {
    factors.push("Tell us the make on the call so we can sharpen this quote");
  }
  if (makeTier === "high") factors.push("High-demand brand — parts are sought after in Brisbane");
  else if (makeTier === "low") factors.push("Specialty brand — limited local parts demand");

  if (age <= 5) factors.push("Late-model vehicle — strong resale potential");
  else if (age >= 20) factors.push("Older vehicle — value mostly from scrap metal and parts");

  if (conditionMult >= 0.75) factors.push("Good condition boosts your offer significantly");
  else if (conditionMult <= 0.3) factors.push("Condition factored in — we still pay cash for non-running cars");

  return { status: "indicative_estimate", quote, factors };
}
