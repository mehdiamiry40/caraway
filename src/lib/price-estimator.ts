import type { QuoteCondition } from "@/lib/quote-schema";

/** Car makes grouped by demand tier — higher demand = higher price */
const MAKE_TIERS: Record<string, string[]> = {
  high: [
    "toyota", "mazda", "hyundai", "kia", "honda", "mitsubishi",
    "subaru", "suzuki", "nissan", "isuzu",
  ],
  medium: [
    "ford", "holden", "volkswagen", "skoda", "mg",
    "haval", "great wall", "ssangyong", "ldv",
  ],
  low: [
    "bmw", "mercedes", "audi", "volvo", "lexus", "peugeot",
    "citroen", "renault", "fiat", "alfa romeo", "jeep",
    "chrysler", "dodge", "saab", "daewoo", "proton",
  ],
};

type MakeTier = "high" | "medium" | "low";

/**
 * Central pricing configuration. Keep every magic number here so the
 * tuning surface is discoverable and easy to test.
 */
const PRICE_TABLE = {
  /** Base value brackets by vehicle age (years). First matching bracket wins. */
  ageBaseValues: [
    { maxAge: 3, base: 8000 },
    { maxAge: 6, base: 5500 },
    { maxAge: 10, base: 3500 },
    { maxAge: 15, base: 2000 },
    { maxAge: 20, base: 1200 },
    { maxAge: Infinity, base: 600 },
  ] as const,
  /** Multiplier applied based on make-tier (demand). */
  makeMultipliers: {
    high: 1.2,
    medium: 1.0,
    low: 0.8,
  } satisfies Record<MakeTier, number>,
  /** Multiplier applied based on vehicle body type. */
  vehicleTypeMultipliers: {
    ute: 1.3,
    "4wd": 1.3,
    suv: 1.15,
    van: 1.2,
    truck: 1.2,
    sedan: 1.0,
    wagon: 1.0,
    coupe: 1.0,
    hatch: 0.95,
    other: 1.0,
  } as Record<string, number>,
  /** Range spread — low = estimated * (1 - spread), high = estimated * (1 + spread). */
  rangeSpread: 0.25,
  /** Round low/high to nearest this many dollars. */
  rangeRoundTo: 50,
  /** Absolute floor/ceiling on the returned range. */
  minLow: 100,
  maxHigh: 9999,
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
  needs_work: 0.5,
  damaged: 0.3,
  not_running: 0.2,
  scrap: 0.15,
};

export interface EstimateInput {
  make: string;
  year: number;
  condition: string;
  vehicleType: string;
}

export interface EstimateResult {
  low: number;
  high: number;
  factors: string[];
}

function getBaseValueForAge(age: number): number {
  for (const bracket of PRICE_TABLE.ageBaseValues) {
    if (age <= bracket.maxAge) return bracket.base;
  }
  return PRICE_TABLE.ageBaseValues[PRICE_TABLE.ageBaseValues.length - 1].base;
}

export function estimatePrice(input: EstimateInput): EstimateResult {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - input.year);
  const makeTier = getMakeTier(input.make);
  const conditionMult =
    CONDITION_MULTIPLIER[input.condition as QuoteCondition] ?? 0.5;

  const baseValue = getBaseValueForAge(age);
  const makeMult = PRICE_TABLE.makeMultipliers[makeTier];
  const typeMult = PRICE_TABLE.vehicleTypeMultipliers[input.vehicleType] ?? 1.0;

  const estimated = baseValue * makeMult * conditionMult * typeMult;

  const { rangeSpread, rangeRoundTo, minLow, maxHigh } = PRICE_TABLE;
  const low = Math.max(
    minLow,
    Math.round((estimated * (1 - rangeSpread)) / rangeRoundTo) * rangeRoundTo,
  );
  const high = Math.min(
    maxHigh,
    Math.round((estimated * (1 + rangeSpread)) / rangeRoundTo) * rangeRoundTo,
  );

  // Build factors
  const factors: string[] = [];
  if (makeTier === "high") factors.push("High-demand brand — parts are sought after in Brisbane");
  else if (makeTier === "low") factors.push("Specialty brand — limited local parts demand");

  if (age <= 5) factors.push("Late-model vehicle — strong resale potential");
  else if (age >= 20) factors.push("Older vehicle — value mostly from scrap metal and parts");

  if (conditionMult >= 0.75) factors.push("Good condition boosts your offer significantly");
  else if (conditionMult <= 0.3) factors.push("Condition factored in — we still pay cash for non-running cars");

  if (typeMult > 1.1) factors.push("Utes, 4WDs, and SUVs are in high demand across South East QLD");

  return { low, high, factors };
}
