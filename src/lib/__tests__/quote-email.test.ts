import { describe, expect, it } from "vitest";
import { buildQuoteEmailContent } from "@/lib/quote-email";
import type { QuoteFormValues } from "@/lib/quote-schema";

const baseValid: QuoteFormValues = {
  name: "Jane Doe",
  phone: "0412345678",
  make: "Toyota",
  model: "Hilux",
  year: 2015,
  condition: "running",
  address: "",
  honeypot: "",
};

describe("buildQuoteEmailContent", () => {
  it("puts make / model / year in the subject line", () => {
    const { subject } = buildQuoteEmailContent(baseValid);
    expect(subject).toBe("New quote request — Toyota Hilux (2015)");
  });

  it("includes every captured field in the plain-text body", () => {
    const { text } = buildQuoteEmailContent({
      ...baseValid,
      address: "12 Example St, Brisbane",
    });
    expect(text).toContain("Jane Doe");
    expect(text).toContain("0412345678");
    expect(text).toContain("Toyota");
    expect(text).toContain("Hilux");
    expect(text).toContain("2015");
    expect(text).toContain("Running");
    expect(text).toContain("12 Example St, Brisbane");
  });

  it("renders an em dash for empty address", () => {
    const { text, html } = buildQuoteEmailContent({ ...baseValid, address: "" });
    expect(text).toMatch(/Address\s+—/);
    expect(html).toContain("—");
  });

  it("escapes HTML special characters in user-supplied values", () => {
    const { html } = buildQuoteEmailContent({
      ...baseValid,
      name: "<script>alert(1)</script>",
      make: "Toy&ota",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Toy&amp;ota");
  });

  it("does not render a marketing-consent row (quote leads are phone-only)", () => {
    const { text } = buildQuoteEmailContent(baseValid);
    expect(text).not.toContain("Marketing consent");
  });
});

describe("buildQuoteEmailContent — quoteAmount handling", () => {
  it("includes an Estimated quote row when quoteAmount is set", () => {
    const { text, html } = buildQuoteEmailContent({
      ...baseValid,
      quoteAmount: 1500,
    });
    expect(text).toContain("Estimated quote");
    expect(text).toContain("$1,500");
    expect(html).toContain("Estimated quote");
    expect(html).toContain("$1,500");
  });

  it("omits the Estimated quote row when quoteAmount is undefined", () => {
    const { text, html } = buildQuoteEmailContent(baseValid);
    expect(text).not.toContain("Estimated quote");
    expect(html).not.toContain("Estimated quote");
  });
});

describe("buildQuoteEmailContent — header injection protection", () => {
  it("strips CRLF from the subject line so injected headers can't break out", () => {
    const { subject } = buildQuoteEmailContent({
      ...baseValid,
      make: "Toyota\r\nBcc: attacker@x",
    });
    // The crucial guarantee: a single-line subject with no CR/LF, so any
    // would-be injected header lands harmlessly inline rather than starting
    // a new SMTP header.
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain("Toyota");
    expect(subject).toContain("Bcc: attacker@x"); // sanitized to a single line
  });
});
