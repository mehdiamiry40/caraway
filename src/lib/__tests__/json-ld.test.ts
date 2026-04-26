import { describe, expect, it } from "vitest";
import { escapeJsonForScript, findSuspiciousMarkup } from "@/lib/json-ld";

describe("escapeJsonForScript", () => {
  it("escapes </script> sequences (case-insensitive)", () => {
    expect(escapeJsonForScript('"</script>"')).toBe('"<\\/script>"');
    expect(escapeJsonForScript('"</SCRIPT>"')).toBe('"<\\/SCRIPT>"');
    expect(escapeJsonForScript('"</ScRiPt>"')).toBe('"<\\/ScRiPt>"');
  });

  it("escapes HTML comment openers so the script body cannot be commented out", () => {
    expect(escapeJsonForScript('"<!-- "')).toBe('"<\\!-- "');
  });

  it("escapes U+2028 and U+2029 (valid in JSON, invalid in JS string literals)", () => {
    const input = `"line1 line2 line3"`;
    expect(escapeJsonForScript(input)).toBe(`"line1\\u2028line2\\u2029line3"`);
  });

  it("leaves benign JSON untouched", () => {
    const json = JSON.stringify({ "@type": "Organization", name: "Caraway" });
    expect(escapeJsonForScript(json)).toBe(json);
  });
});

describe("findSuspiciousMarkup", () => {
  it("returns no hits for benign schema.org data", () => {
    const data = {
      "@type": "Organization",
      name: "Caraway",
      address: { streetAddress: "123 Smith St" },
      sameAs: ["https://example.com"],
    };
    expect(findSuspiciousMarkup(data)).toEqual([]);
  });

  it("flags <script> tags in any nested string", () => {
    const data = {
      "@type": "Organization",
      description: 'Hello <script>alert(1)</script>',
    };
    const hits = findSuspiciousMarkup(data, "data[0]");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain("description");
  });

  it("flags suspicious tags inside arrays", () => {
    const data = {
      sameAs: ["https://example.com", "<iframe src=evil></iframe>"],
    };
    const hits = findSuspiciousMarkup(data);
    expect(hits.some((h) => h.includes("sameAs[1]"))).toBe(true);
  });

  it("flags <object>, <embed>, <style> as well as <script>/<iframe>", () => {
    expect(findSuspiciousMarkup({ a: "<object>" })).toHaveLength(1);
    expect(findSuspiciousMarkup({ a: "<embed>" })).toHaveLength(1);
    expect(findSuspiciousMarkup({ a: "<style>" })).toHaveLength(1);
  });
});
