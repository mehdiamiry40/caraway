import { describe, expect, it } from "vitest";
import { quoteFormSchema } from "@/lib/quote-schema";

const baseValid = {
  name: "Jane Doe",
  phone: "0412345678",
  make: "Toyota",
  model: "Hilux",
  year: 2015,
  condition: "running" as const,
  honeypot: "",
};

describe("quoteFormSchema — phone parsing", () => {
  it("accepts a plain AU mobile (0412345678)", () => {
    const result = quoteFormSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("0412345678");
    }
  });

  it("accepts AU mobile with spaces and strips them", () => {
    const result = quoteFormSchema.safeParse({
      ...baseValid,
      phone: "04 1234 5678",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("0412345678");
    }
  });

  it("accepts +61 format (+61412345678)", () => {
    const result = quoteFormSchema.safeParse({
      ...baseValid,
      phone: "+61412345678",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+61412345678");
    }
  });

  it("accepts AU mobile with dashes and parens", () => {
    const result = quoteFormSchema.safeParse({
      ...baseValid,
      phone: "(04) 1234-5678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a phone that is too short", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects non-AU-looking phones", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, phone: "5551234567" });
    expect(result.success).toBe(false);
  });
});

describe("quoteFormSchema — honeypot", () => {
  it("rejects submissions with a filled honeypot", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, honeypot: "bot filled me in" });
    expect(result.success).toBe(false);
  });

  it("accepts blank or missing honeypot", () => {
    const withBlank = quoteFormSchema.safeParse({ ...baseValid, honeypot: "" });
    expect(withBlank.success).toBe(true);

    const { honeypot: _honeypot, ...withoutHoneypot } = baseValid;
    void _honeypot;
    const missing = quoteFormSchema.safeParse(withoutHoneypot);
    expect(missing.success).toBe(true);
  });
});

describe("quoteFormSchema — name bounds", () => {
  it("rejects a name shorter than 2 chars", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, name: "A" });
    expect(result.success).toBe(false);
  });

  it("accepts a 2-character name", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, name: "Al" });
    expect(result.success).toBe(true);
  });

  it("rejects a name longer than 200 chars", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, name: "x".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("accepts a name of exactly 200 chars", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, name: "x".repeat(200) });
    expect(result.success).toBe(true);
  });
});

describe("quoteFormSchema — year bounds", () => {
  const currentYear = new Date().getFullYear();

  it("rejects year below 1950", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, year: 1949 });
    expect(result.success).toBe(false);
  });

  it("accepts year exactly 1950", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, year: 1950 });
    expect(result.success).toBe(true);
  });

  it("accepts current year + 1", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, year: currentYear + 1 });
    expect(result.success).toBe(true);
  });

  it("rejects current year + 2", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, year: currentYear + 2 });
    expect(result.success).toBe(false);
  });
});

describe("quoteFormSchema — condition enum", () => {
  it("accepts every value from quoteConditionValues", () => {
    const values = ["running", "needs_work", "not_running", "damaged", "scrap"] as const;
    for (const value of values) {
      const result = quoteFormSchema.safeParse({ ...baseValid, condition: value });
      expect(result.success).toBe(true);
    }
  });

  it("rejects legacy estimator values like 'excellent'", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, condition: "excellent" });
    expect(result.success).toBe(false);
  });

  it("rejects arbitrary strings", () => {
    const result = quoteFormSchema.safeParse({ ...baseValid, condition: "mint" });
    expect(result.success).toBe(false);
  });
});
