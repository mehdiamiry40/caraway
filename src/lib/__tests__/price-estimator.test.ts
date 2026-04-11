import { describe, expect, it } from "vitest";
import { estimatePrice } from "@/lib/price-estimator";

const currentYear = new Date().getFullYear();

describe("estimatePrice", () => {
  it("returns a range where low < high", () => {
    const result = estimatePrice({
      make: "Toyota",
      year: 2015,
      condition: "running",
      vehicleType: "sedan",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(result.low).toBeGreaterThanOrEqual(100);
    expect(result.high).toBeLessThanOrEqual(9999);
  });

  it("ranks high-tier makes (Toyota) above low-tier makes (BMW) for identical specs", () => {
    const toyota = estimatePrice({
      make: "Toyota",
      year: 2018,
      condition: "running",
      vehicleType: "sedan",
    });
    const bmw = estimatePrice({
      make: "BMW",
      year: 2018,
      condition: "running",
      vehicleType: "sedan",
    });
    expect(toyota.low).toBeGreaterThan(bmw.low);
    expect(toyota.high).toBeGreaterThan(bmw.high);
  });

  it("ranks newer cars above older cars for the same make and condition", () => {
    const newer = estimatePrice({
      make: "Mazda",
      year: currentYear - 2,
      condition: "running",
      vehicleType: "sedan",
    });
    const older = estimatePrice({
      make: "Mazda",
      year: currentYear - 18,
      condition: "running",
      vehicleType: "sedan",
    });
    expect(newer.low).toBeGreaterThan(older.low);
    expect(newer.high).toBeGreaterThan(older.high);
  });

  it("values running condition above scrap for identical year/make", () => {
    const running = estimatePrice({
      make: "Honda",
      year: 2012,
      condition: "running",
      vehicleType: "sedan",
    });
    const scrap = estimatePrice({
      make: "Honda",
      year: 2012,
      condition: "scrap",
      vehicleType: "sedan",
    });
    expect(running.low).toBeGreaterThan(scrap.low);
    expect(running.high).toBeGreaterThan(scrap.high);
  });

  it("applies a bigger multiplier to utes/4WDs than sedans", () => {
    const ute = estimatePrice({
      make: "Toyota",
      year: 2015,
      condition: "running",
      vehicleType: "ute",
    });
    const fourWd = estimatePrice({
      make: "Toyota",
      year: 2015,
      condition: "running",
      vehicleType: "4wd",
    });
    const sedan = estimatePrice({
      make: "Toyota",
      year: 2015,
      condition: "running",
      vehicleType: "sedan",
    });
    expect(ute.low).toBeGreaterThan(sedan.low);
    expect(ute.high).toBeGreaterThan(sedan.high);
    expect(fourWd.low).toBeGreaterThan(sedan.low);
    expect(fourWd.high).toBeGreaterThan(sedan.high);
  });

  it("enforces the absolute low floor ($100) and high ceiling ($9999)", () => {
    const worst = estimatePrice({
      make: "Fiat",
      year: 1985,
      condition: "scrap",
      vehicleType: "hatch",
    });
    expect(worst.low).toBeGreaterThanOrEqual(100);

    const best = estimatePrice({
      make: "Toyota",
      year: currentYear,
      condition: "running",
      vehicleType: "ute",
    });
    expect(best.high).toBeLessThanOrEqual(9999);
    expect(best.low).toBeGreaterThanOrEqual(100);
  });

  it("includes relevant factor explanations", () => {
    const lateModelHighTierUte = estimatePrice({
      make: "Toyota",
      year: currentYear - 2,
      condition: "running",
      vehicleType: "ute",
    });
    expect(lateModelHighTierUte.factors.length).toBeGreaterThan(0);
    expect(
      lateModelHighTierUte.factors.some((f) => f.toLowerCase().includes("high-demand")),
    ).toBe(true);
    expect(
      lateModelHighTierUte.factors.some((f) => f.toLowerCase().includes("late-model")),
    ).toBe(true);
    expect(
      lateModelHighTierUte.factors.some((f) =>
        f.toLowerCase().includes("ute") || f.toLowerCase().includes("4wd"),
      ),
    ).toBe(true);

    const old = estimatePrice({
      make: "Holden",
      year: 1998,
      condition: "scrap",
      vehicleType: "sedan",
    });
    expect(old.factors.some((f) => f.toLowerCase().includes("older vehicle"))).toBe(true);
  });
});
