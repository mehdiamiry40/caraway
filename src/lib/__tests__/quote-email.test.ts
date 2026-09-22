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
  suburb: "",
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
      suburb: "West End",
      details: "180,000 km; rolls and steers; narrow driveway.",
    });
    expect(text).toContain("Jane Doe");
    expect(text).toContain("0412345678");
    expect(text).toContain("Toyota");
    expect(text).toContain("Hilux");
    expect(text).toContain("2015");
    expect(text).toContain("Running");
    expect(text).toContain("West End");
    expect(text).toContain(
      "Vehicle/access details: 180,000 km; rolls and steers; narrow driveway.",
    );
  });

  it("renders an em dash for an empty suburb", () => {
    const { text, html } = buildQuoteEmailContent({ ...baseValid, suburb: "" });
    expect(text).toMatch(/Suburb:\s+—/);
    expect(html).toContain("—");
  });

  it("omits the optional details row when no details were supplied", () => {
    const { text, html } = buildQuoteEmailContent(baseValid);
    expect(text).not.toContain("Vehicle/access details");
    expect(html).not.toContain("Vehicle/access details");
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

  it("carries no marketing-consent row — the quote flow never collected it", () => {
    const { text, html } = buildQuoteEmailContent(baseValid);
    expect(text).not.toMatch(/Marketing consent/i);
    expect(html).not.toMatch(/Marketing consent/i);
  });
});

describe("buildQuoteEmailContent — no automated quote", () => {
  it("never reports an estimated amount — offers are made by a person", () => {
    const { text, html } = buildQuoteEmailContent(baseValid);
    expect(text).not.toMatch(/Estimated quote/i);
    expect(html).not.toMatch(/Estimated quote/i);
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

describe("buildQuoteEmailContent — expected price", () => {
  it("formats a supplied amount as whole Australian dollars", () => {
    const { text, html } = buildQuoteEmailContent({
      ...baseValid,
      expectedPrice: 3500,
    });
    expect(text).toMatch(/Expected price: \$3,500$/m);
    expect(html).toContain("$3,500");
  });

  it("marks the row as not supplied when the seller left it blank", () => {
    const { text, html } = buildQuoteEmailContent(baseValid);
    expect(text).toMatch(/Expected price: Not supplied$/m);
    expect(html).toContain("Not supplied");
  });

  it("renders a zero asking price rather than treating it as missing", () => {
    const { text } = buildQuoteEmailContent({ ...baseValid, expectedPrice: 0 });
    expect(text).toMatch(/Expected price: \$0$/m);
  });
});
