import { describe, expect, it } from "vitest";
import { estimatePrice, type EstimateResult } from "@/lib/price-estimator";
import { MAX_PRICE, MIN_PRICE } from "@/lib/site";

const currentYear = new Date().getFullYear();

function expectIndicative(result: EstimateResult): asserts result is Extract<EstimateResult, { status: "indicative_estimate" }> {
  expect(result.status).toBe("indicative_estimate");
  expect(result.quote).not.toBeNull();
}

describe("estimatePrice", () => {
  it.each(["running", "needs_work"])(
    "routes %s vehicles to a buyer assessment instead of inventing a market quote",
    (condition) => {
      const result = estimatePrice({
        make: "Toyota",
        model: "Corolla",
        year: 2018,
        condition,
      });

      expect(result.status).toBe("manual_review");
      expect(result.quote).toBeNull();
      expect(result.factors.join(" ")).toContain("kilometres");
    },
  );

  it.each(["damaged", "not_running", "scrap"])(
    "returns a rounded indicative scrap/parts estimate for %s vehicles",
    (condition) => {
      const result = estimatePrice({
        make: "Toyota",
        model: "Camry",
        year: 2015,
        condition,
      });

      expectIndicative(result);
      expect(result.quote).toBeGreaterThanOrEqual(MIN_PRICE);
      expect(result.quote).toBeLessThanOrEqual(MAX_PRICE);
      expect(result.quote % 50).toBe(0);
    },
  );

  it("ranks high-demand makes above specialty makes for identical scrap inputs", () => {
    const toyota = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2018,
      condition: "damaged",
    });
    const bmw = estimatePrice({
      make: "BMW",
      model: "3 Series",
      year: 2018,
      condition: "damaged",
    });
    expectIndicative(toyota);
    expectIndicative(bmw);
    expect(toyota.quote).toBeGreaterThan(bmw.quote);
  });

  it("ranks newer damaged vehicles above older damaged vehicles", () => {
    const newer = estimatePrice({
      make: "Mazda",
      model: "3",
      year: currentYear - 2,
      condition: "damaged",
    });
    const older = estimatePrice({
      make: "Mazda",
      model: "3",
      year: currentYear - 18,
      condition: "damaged",
    });
    expectIndicative(newer);
    expectIndicative(older);
    expect(newer.quote).toBeGreaterThan(older.quote);
  });

  it("keeps canonical scrap-value anchors near the floor", () => {
    for (const input of [
      { make: "Mazda", model: "3", year: 2005, condition: "scrap" },
      { make: "Mitsubishi", model: "Magna", year: 2003, condition: "scrap" },
    ]) {
      const result = estimatePrice(input);
      expectIndicative(result);
      expect(result.quote).toBeGreaterThanOrEqual(200);
      expect(result.quote).toBeLessThanOrEqual(350);
    }
  });

  it("includes relevant factor explanations", () => {
    const lateModel = estimatePrice({
      make: "Toyota",
      model: "Hilux",
      year: currentYear - 2,
      condition: "damaged",
    });
    expect(lateModel.factors.some((factor) => factor.toLowerCase().includes("high-demand"))).toBe(true);
    expect(lateModel.factors.some((factor) => factor.toLowerCase().includes("late-model"))).toBe(true);

    const old = estimatePrice({
      make: "Holden",
      model: "Commodore",
      year: 1998,
      condition: "scrap",
    });
    expect(old.factors.some((factor) => factor.toLowerCase().includes("older vehicle"))).toBe(true);
  });

  it.each([Number.NaN, -5, currentYear + 1])(
    "routes invalid manufacture year %s to manual review",
    (year) => {
      const result = estimatePrice({
        make: "Toyota",
        model: "Corolla",
        year,
        condition: "damaged",
      });
      expect(result.status).toBe("manual_review");
      expect(result.quote).toBeNull();
    },
  );
});
