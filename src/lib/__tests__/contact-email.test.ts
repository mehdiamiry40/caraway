import { describe, expect, it } from "vitest";
import { buildContactEmailContent } from "@/lib/contact-email";
import type { ContactFormValues } from "@/lib/quote-schema";

const baseValid: ContactFormValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "0412345678",
  message: "Hi, I'd like a quote for my 2012 Mazda 3.",
  honeypot: "",
  marketingConsent: false,
};

describe("buildContactEmailContent", () => {
  it("puts the sender name in the subject line", () => {
    const { subject } = buildContactEmailContent(baseValid);
    expect(subject).toBe("New contact message — Jane Doe");
  });

  it("includes every captured field in the plain-text body", () => {
    const { text } = buildContactEmailContent({
      ...baseValid,
      marketingConsent: true,
    });
    expect(text).toContain("Jane Doe");
    expect(text).toContain("jane@example.com");
    expect(text).toContain("0412345678");
    expect(text).toContain("Hi, I'd like a quote for my 2012 Mazda 3.");
    expect(text).toContain("opted in");
  });

  it("renders an em dash for empty phone", () => {
    const { text } = buildContactEmailContent({ ...baseValid, phone: "" });
    expect(text).toMatch(/Phone\s+—/);
  });

  it("escapes HTML special characters in user-supplied values", () => {
    const { html } = buildContactEmailContent({
      ...baseValid,
      name: "<script>alert(1)</script>",
      message: "hello & goodbye",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("hello &amp; goodbye");
  });

  it("preserves line breaks in the message body as <br> tags in html", () => {
    const { html } = buildContactEmailContent({
      ...baseValid,
      message: "line one\nline two",
    });
    expect(html).toContain("line one<br>line two");
  });

  it("reports 'no' when marketing consent is not given", () => {
    const { text } = buildContactEmailContent(baseValid);
    expect(text).toMatch(/Marketing consent\s+no/);
  });
});

describe("buildContactEmailContent — header injection protection", () => {
  it("strips CRLF from the subject line so injected headers can't break out", () => {
    const { subject } = buildContactEmailContent({
      ...baseValid,
      name: "Jane Doe\r\nBcc: attacker@x",
    });
    // The crucial guarantee: a single-line subject with no CR/LF, so any
    // would-be injected header lands harmlessly inline rather than starting
    // a new SMTP header.
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain("Jane Doe");
    expect(subject).toContain("Bcc: attacker@x"); // sanitized to a single line
  });
});
