import { describe, expect, it } from "vitest";
import { estimatePrice } from "@/lib/price-estimator";
import { MAX_PRICE, MIN_PRICE } from "@/lib/site";

const currentYear = new Date().getFullYear();

describe("estimatePrice", () => {
  it("returns a single exact quote within the advertised bracket", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2015,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThanOrEqual(MIN_PRICE);
    expect(result.quote).toBeLessThanOrEqual(MAX_PRICE);
  });

  it("rounds quotes to the nearest $50 so they feel deliberate", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2015,
      condition: "running",
    });
    expect(result.quote % 50).toBe(0);
  });

  it("ranks high-tier makes (Toyota) above low-tier makes (BMW) for identical specs", () => {
    const toyota = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2018,
      condition: "running",
    });
    const bmw = estimatePrice({
      make: "BMW",
      model: "3 Series",
      year: 2018,
      condition: "running",
    });
    expect(toyota.quote).toBeGreaterThan(bmw.quote);
  });

  it("ranks newer cars above older cars for the same make and condition", () => {
    const newer = estimatePrice({
      make: "Mazda",
      model: "3",
      year: currentYear - 2,
      condition: "running",
    });
    const older = estimatePrice({
      make: "Mazda",
      model: "3",
      year: currentYear - 18,
      condition: "running",
    });
    expect(newer.quote).toBeGreaterThan(older.quote);
  });

  it("values running condition above scrap for identical year/make", () => {
    const running = estimatePrice({
      make: "Honda",
      model: "Civic",
      year: 2012,
      condition: "running",
    });
    const scrap = estimatePrice({
      make: "Honda",
      model: "Civic",
      year: 2012,
      condition: "scrap",
    });
    expect(running.quote).toBeGreaterThan(scrap.quote);
  });

  it("enforces the absolute low floor ($200) and high ceiling ($9999)", () => {
    const worst = estimatePrice({
      make: "Fiat",
      model: "Punto",
      year: 1985,
      condition: "scrap",
    });
    expect(worst.quote).toBeGreaterThanOrEqual(MIN_PRICE);

    const best = estimatePrice({
      make: "Toyota",
      model: "Hilux",
      year: currentYear,
      condition: "running",
    });
    expect(best.quote).toBeLessThanOrEqual(MAX_PRICE);
    expect(best.quote).toBeGreaterThanOrEqual(MIN_PRICE);
  });

  it("includes relevant factor explanations", () => {
    const lateModelHighTier = estimatePrice({
      make: "Toyota",
      model: "Hilux",
      year: currentYear - 2,
      condition: "running",
    });
    expect(lateModelHighTier.factors.length).toBeGreaterThan(0);
    expect(
      lateModelHighTier.factors.some((f) => f.toLowerCase().includes("high-demand")),
    ).toBe(true);
    expect(
      lateModelHighTier.factors.some((f) => f.toLowerCase().includes("late-model")),
    ).toBe(true);

    const old = estimatePrice({
      make: "Holden",
      model: "Commodore",
      year: 1998,
      condition: "scrap",
    });
    expect(old.factors.some((f) => f.toLowerCase().includes("older vehicle"))).toBe(true);
  });
});

describe("canonical Brisbane market anchors", () => {
  it("2005 Mazda 3 scrap lands at the scrap-value floor", () => {
    const result = estimatePrice({
      make: "Mazda",
      model: "3",
      year: 2005,
      condition: "scrap",
    });
    expect(result.quote).toBeGreaterThanOrEqual(200);
    expect(result.quote).toBeLessThanOrEqual(350);
  });

  it("2003 Mitsubishi Magna scrap lands at the scrap-value floor", () => {
    const result = estimatePrice({
      make: "Mitsubishi",
      model: "Magna",
      year: 2003,
      condition: "scrap",
    });
    expect(result.quote).toBeGreaterThanOrEqual(200);
    expect(result.quote).toBeLessThanOrEqual(350);
  });

  it("2006 Ford Territory running sits in a reasonable range", () => {
    const result = estimatePrice({
      make: "Ford",
      model: "Territory",
      year: 2006,
      condition: "running",
    });
    expect(result.quote).toBeGreaterThanOrEqual(350);
    expect(result.quote).toBeLessThanOrEqual(700);
  });

  it("2007 Toyota Camry needs_work sits in the $200-$500 band", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2007,
      condition: "needs_work",
    });
    expect(result.quote).toBeGreaterThanOrEqual(200);
    expect(result.quote).toBeLessThanOrEqual(500);
  });
});

describe("input validation", () => {
  it("returns a safe fallback quote for NaN year", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: Number.NaN,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThanOrEqual(MIN_PRICE);
    expect(result.quote).toBeLessThanOrEqual(MAX_PRICE);
  });

  it("returns a valid quote when make is empty", () => {
    const result = estimatePrice({
      make: "",
      model: "",
      year: 2015,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThan(0);
  });

  it("returns a safe fallback for a year in the far future (2030)", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: 2030,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThanOrEqual(MIN_PRICE);
  });

  it("returns a safe fallback for a negative year", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: -5,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThanOrEqual(MIN_PRICE);
  });

  it("returns a valid quote when model is empty", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: 2015,
      condition: "running",
    });
    expect(Number.isFinite(result.quote)).toBe(true);
    expect(result.quote).toBeGreaterThan(0);
  });
});
