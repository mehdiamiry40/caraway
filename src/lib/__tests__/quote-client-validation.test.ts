import { describe, expect, it } from "vitest";

import {
  quoteFormResolver,
  validateQuoteFormForClient,
} from "@/lib/quote-client-validation";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/quote-schema";

const baseValid = {
  name: "Jane Doe",
  phone: "0412345678",
  make: "Toyota",
  model: "Hilux",
  year: 2015,
  condition: "running",
  suburb: "Brisbane",
} satisfies Record<string, unknown>;

function firstServerMessages(input: Record<string, unknown>) {
  const result = quoteFormSchema.safeParse(input);
  if (result.success) return {};

  const messages: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && messages[field] === undefined) {
      messages[field] = issue.message;
    }
  }
  return messages;
}

function clientMessages(input: Record<string, unknown>) {
  const result = validateQuoteFormForClient(input as QuoteFormInput);
  if (result.success) return {};

  return Object.fromEntries(
    Object.entries(result.errors).map(([field, error]) => [
      field,
      error?.message,
    ]),
  );
}

const parityCases: Array<[string, Record<string, unknown>]> = [
  ["valid minimal form", baseValid],
  [
    "valid normalized form",
    {
      ...baseValid,
      name: "  Jane\r\nDoe  ",
      phone: "(04) 1234-5678",
      make: "  Toy\r\nota  ",
      model: "  Hi\r\nlux  ",
      year: "2015",
      suburb: "  West\r\nEnd  ",
      details: "  Rolls and steers.\r\nNarrow driveway.  ",
      honeypot: "   ",
      ignoredBySchema: "discard me",
    },
  ],
  ["all required values missing", {}],
  [
    "blank required strings",
    { ...baseValid, name: "", phone: "", make: "", model: "", suburb: "" },
  ],
  ["name too long", { ...baseValid, name: "x".repeat(201) }],
  ["invalid phone", { ...baseValid, phone: "5551234567" }],
  ["make too long", { ...baseValid, make: "x".repeat(201) }],
  ["model too long", { ...baseValid, model: "x".repeat(201) }],
  ["blank year", { ...baseValid, year: "" }],
  ["non-numeric year", { ...baseValid, year: "not-a-year" }],
  ["year below range", { ...baseValid, year: 1949 }],
  [
    "year above range",
    { ...baseValid, year: new Date().getFullYear() + 2 },
  ],
  ["unknown condition", { ...baseValid, condition: "mint" }],
  ["suburb too short", { ...baseValid, suburb: "a" }],
  ["suburb too long", { ...baseValid, suburb: "x".repeat(101) }],
  ["details too long", { ...baseValid, details: "x".repeat(2001) }],
  ["filled honeypot", { ...baseValid, honeypot: "bot" }],
  ["blank expected price", { ...baseValid, expectedPrice: "" }],
  ["whitespace expected price", { ...baseValid, expectedPrice: "   " }],
  ["expected price supplied", { ...baseValid, expectedPrice: "3500" }],
  ["expected price with $ and commas", { ...baseValid, expectedPrice: "$3,500" }],
  ["expected price as a number", { ...baseValid, expectedPrice: 3500 }],
  ["zero expected price", { ...baseValid, expectedPrice: "0" }],
  ["non-numeric expected price", { ...baseValid, expectedPrice: "about 3500" }],
  ["fractional expected price", { ...baseValid, expectedPrice: "3500.50" }],
  ["negative expected price", { ...baseValid, expectedPrice: "-1" }],
  ["expected price at the limit", { ...baseValid, expectedPrice: "1000000" }],
  ["expected price above the limit", { ...baseValid, expectedPrice: "1000001" }],
];

describe("quote client validation parity", () => {
  it.each(parityCases)("matches server acceptance and first messages: %s", (_, input) => {
    const server = quoteFormSchema.safeParse(input);
    const client = validateQuoteFormForClient(input as QuoteFormInput);

    expect(client.success).toBe(server.success);
    if (server.success && client.success) {
      expect(client.data).toEqual(server.data);
      return;
    }

    expect(clientMessages(input)).toEqual(firstServerMessages(input));
  });

  it("adapts successful normalized data and failures to React Hook Form", async () => {
    const valid = await quoteFormResolver(baseValid as QuoteFormInput, undefined, {
      fields: {},
      shouldUseNativeValidation: false,
    });
    expect(valid.errors).toEqual({});
    expect(valid.values).toEqual(
      expect.objectContaining({
        year: 2015,
        honeypot: "",
      }),
    );

    const invalid = await quoteFormResolver(
      { ...baseValid, phone: "123" } as QuoteFormInput,
      undefined,
      { fields: {}, shouldUseNativeValidation: false },
    );
    expect(invalid.values).toEqual({});
    expect(invalid.errors.phone?.message).toBe(
      "Enter a valid Australian phone number",
    );
  });
});
