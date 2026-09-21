import { describe, expect, it } from "vitest";
import { normalizeExpectedPrice } from "@/lib/quote-validation-rules";

describe("normalizeExpectedPrice", () => {
  it("treats a missing or blank entry as not supplied", () => {
    for (const value of [undefined, null, "", "  ", "$", " $ , "]) {
      expect(normalizeExpectedPrice(value)).toBeUndefined();
    }
  });

  it("passes a number straight through", () => {
    expect(normalizeExpectedPrice(3500)).toBe(3500);
    expect(normalizeExpectedPrice(0)).toBe(0);
  });

  it("strips a leading dollar sign, thousands separators and padding", () => {
    for (const value of ["3500", "$3500", "3,500", "$3,500", " $3,500 "]) {
      expect(normalizeExpectedPrice(value)).toBe(3500);
    }
  });

  it("returns NaN for text the caller must reject", () => {
    for (const value of ["about 3500", "3500 or best offer", true, {}, []]) {
      expect(normalizeExpectedPrice(value)).toBeNaN();
    }
  });
});
