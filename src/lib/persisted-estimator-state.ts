import { quoteConditionValues, type QuoteCondition } from "@/lib/quote-condition";

export type Step = 1 | 2 | 3;

// Persisted state intentionally excludes PII (name, phone, address) so that
// only Step 1 vehicle inputs survive a refresh; Step 3 contact details are
// never written to sessionStorage.
export type PersistedState = {
  step?: Step;
  make?: string;
  model?: string;
  year?: string;
  condition?: QuoteCondition | "";
};

// Validate the shape of a sessionStorage payload before applying it to React
// state. Without this, a corrupted entry (manual edit, unrelated payload at
// the same key, schema change across deploys) would write garbage into state
// via an unchecked type assertion.
export function parsePersistedState(raw: string): PersistedState | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  const v = value as Record<string, unknown>;
  const out: PersistedState = {};
  if (v.step === 1 || v.step === 2 || v.step === 3) out.step = v.step;
  if (typeof v.make === "string") out.make = v.make;
  if (typeof v.model === "string") out.model = v.model;
  if (typeof v.year === "string") out.year = v.year;
  if (
    v.condition === "" ||
    (typeof v.condition === "string" &&
      (quoteConditionValues as readonly string[]).includes(v.condition))
  ) {
    out.condition = v.condition as QuoteCondition | "";
  }
  return out;
}
