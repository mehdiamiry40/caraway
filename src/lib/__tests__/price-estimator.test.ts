import { describe, expect, it } from "vitest";
import { estimatePrice } from "@/lib/price-estimator";

const currentYear = new Date().getFullYear();

describe("estimatePrice", () => {
  it("returns a range where low < high", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2015,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(result.low).toBeGreaterThanOrEqual(100);
    expect(result.high).toBeLessThanOrEqual(9999);
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
    expect(toyota.low).toBeGreaterThan(bmw.low);
    expect(toyota.high).toBeGreaterThan(bmw.high);
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
    expect(newer.low).toBeGreaterThan(older.low);
    expect(newer.high).toBeGreaterThan(older.high);
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
    expect(running.low).toBeGreaterThan(scrap.low);
    expect(running.high).toBeGreaterThan(scrap.high);
  });

  it("enforces the absolute low floor ($300) and high ceiling ($9999)", () => {
    const worst = estimatePrice({
      make: "Fiat",
      model: "Punto",
      year: 1985,
      condition: "scrap",
    });
    expect(worst.low).toBeGreaterThanOrEqual(300);

    const best = estimatePrice({
      make: "Toyota",
      model: "Hilux",
      year: currentYear,
      condition: "running",
    });
    expect(best.high).toBeLessThanOrEqual(9999);
    expect(best.low).toBeGreaterThanOrEqual(300);
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
  it("2005 Mazda 3 scrap clears the scrap floor", () => {
    const result = estimatePrice({
      make: "Mazda",
      model: "3",
      year: 2005,
      condition: "scrap",
    });
    expect(result.high).toBeGreaterThanOrEqual(450);
  });

  it("2003 Mitsubishi Magna scrap clears the scrap floor", () => {
    const result = estimatePrice({
      make: "Mitsubishi",
      model: "Magna",
      year: 2003,
      condition: "scrap",
    });
    expect(result.high).toBeGreaterThanOrEqual(400);
  });

  it("2006 Ford Territory running sits in a reasonable range", () => {
    const result = estimatePrice({
      make: "Ford",
      model: "Territory",
      year: 2006,
      condition: "running",
    });
    expect(result.low).toBeGreaterThanOrEqual(800);
    expect(result.high).toBeLessThanOrEqual(2500);
  });

  it("2007 Toyota Camry needs_work sits in the $400-$1500 range", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "Camry",
      year: 2007,
      condition: "needs_work",
    });
    expect(result.low).toBeGreaterThanOrEqual(400);
    expect(result.high).toBeLessThanOrEqual(1500);
  });
});

describe("input validation", () => {
  it("returns a safe fallback for NaN year", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: Number.NaN,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(Number.isFinite(result.low)).toBe(true);
    expect(Number.isFinite(result.high)).toBe(true);
  });

  it("returns a valid range when make is empty", () => {
    const result = estimatePrice({
      make: "",
      model: "",
      year: 2015,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(result.low).toBeGreaterThan(0);
  });

  it("returns a safe fallback for a year in the far future (2030)", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: 2030,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(Number.isFinite(result.low)).toBe(true);
  });

  it("returns a safe fallback for a negative year", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: -5,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(Number.isFinite(result.low)).toBe(true);
  });

  it("returns a valid range when model is empty", () => {
    const result = estimatePrice({
      make: "Toyota",
      model: "",
      year: 2015,
      condition: "running",
    });
    expect(result.low).toBeLessThan(result.high);
    expect(result.low).toBeGreaterThan(0);
  });
});
