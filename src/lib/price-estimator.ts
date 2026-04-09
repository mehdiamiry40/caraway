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

function getMakeTier(make: string): "high" | "medium" | "low" {
  const lower = make.toLowerCase().trim();
  for (const [tier, makes] of Object.entries(MAKE_TIERS)) {
    if (makes.some((m) => lower.includes(m))) return tier as "high" | "medium" | "low";
  }
  return "medium";
}

/** Condition multipliers */
const CONDITION_MULTIPLIER: Record<string, number> = {
  excellent: 1.0,
  good: 0.75,
  fair: 0.5,
  poor: 0.3,
  "not-running": 0.15,
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

export function estimatePrice(input: EstimateInput): EstimateResult {
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  const makeTier = getMakeTier(input.make);
  const conditionMult = CONDITION_MULTIPLIER[input.condition] ?? 0.5;

  // Base value by age bracket
  let baseValue: number;
  if (age <= 3) baseValue = 8000;
  else if (age <= 6) baseValue = 5500;
  else if (age <= 10) baseValue = 3500;
  else if (age <= 15) baseValue = 2000;
  else if (age <= 20) baseValue = 1200;
  else baseValue = 600;

  // Make tier modifier
  const makeMult = makeTier === "high" ? 1.2 : makeTier === "medium" ? 1.0 : 0.8;

  // Vehicle type modifier
  let typeMult = 1.0;
  if (input.vehicleType === "ute" || input.vehicleType === "4wd") typeMult = 1.3;
  else if (input.vehicleType === "suv") typeMult = 1.15;
  else if (input.vehicleType === "van" || input.vehicleType === "truck") typeMult = 1.2;
  else if (input.vehicleType === "sedan") typeMult = 1.0;
  else if (input.vehicleType === "hatch") typeMult = 0.95;

  const estimated = baseValue * makeMult * conditionMult * typeMult;

  // Create a range (±25%)
  const low = Math.max(100, Math.round(estimated * 0.75 / 50) * 50);
  const high = Math.min(9999, Math.round(estimated * 1.25 / 50) * 50);

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
