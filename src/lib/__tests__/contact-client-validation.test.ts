import { describe, expect, it } from "vitest";

import {
  contactFormResolver,
  validateContactFormForClient,
} from "@/lib/contact-client-validation";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/quote-schema";

const baseValid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Please call me about my car.",
} satisfies Record<string, unknown>;

function firstServerMessages(input: Record<string, unknown>) {
  const result = contactFormSchema.safeParse(input);
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
  const result = validateContactFormForClient(input as ContactFormInput);
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
      email: "  jane+car@example.com  ",
      phone: "(04) 1234-5678",
      message: "  A message with\nmultiple lines.  ",
      honeypot: "   ",
      marketingConsent: true,
      ignoredBySchema: "discard me",
    },
  ],
  ["all required values missing", {}],
  ["blank required strings", { ...baseValid, name: "", email: "", message: "" }],
  ["name too long", { ...baseValid, name: "x".repeat(201) }],
  ["invalid email", { ...baseValid, email: "not-an-email" }],
  [
    "email too long",
    { ...baseValid, email: `${"a".repeat(309)}@example.com` },
  ],
  ["invalid optional phone", { ...baseValid, phone: "5551234567" }],
  ["message too short", { ...baseValid, message: "four" }],
  ["message too long", { ...baseValid, message: "x".repeat(5001) }],
  ["filled honeypot", { ...baseValid, honeypot: "bot" }],
  ["invalid consent type", { ...baseValid, marketingConsent: "yes" }],
];

describe("contact client validation parity", () => {
  it.each(parityCases)(
    "matches server acceptance and first messages: %s",
    (_, input) => {
      const server = contactFormSchema.safeParse(input);
      const client = validateContactFormForClient(input as ContactFormInput);

      expect(client.success).toBe(server.success);
      if (server.success && client.success) {
        expect(client.data).toEqual(server.data);
        return;
      }

      expect(clientMessages(input)).toEqual(firstServerMessages(input));
    },
  );

  it("adapts normalized data and failures to React Hook Form", async () => {
    const valid = await contactFormResolver(
      baseValid as ContactFormInput,
      undefined,
      { fields: {}, shouldUseNativeValidation: false },
    );
    expect(valid.errors).toEqual({});
    expect(valid.values).toEqual(
      expect.objectContaining({
        phone: "",
        honeypot: "",
        marketingConsent: false,
      }),
    );

    const invalid = await contactFormResolver(
      { ...baseValid, email: "invalid" } as ContactFormInput,
      undefined,
      { fields: {}, shouldUseNativeValidation: false },
    );
    expect(invalid.values).toEqual({});
    expect(invalid.errors.email?.message).toBe("Enter a valid email address");
  });
});
