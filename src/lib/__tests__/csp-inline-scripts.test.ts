import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CSP_SCRIPT_HASH_PLACEHOLDER,
  decodeHtmlEntities,
  extractInlineScripts,
  hashInlineScript,
  inlineScriptHashes,
  isPlaceholderScriptHash,
} from "@/lib/csp-inline-scripts";

describe("inline script hashes", () => {
  it("hashes the decoded script body and ignores external scripts", () => {
    const html = [
      '<script src="/_next/static/chunk.js" async=""></script>',
      "<script>(self.__next_f=self.__next_f||[]).push([0])</script>",
      '<script type="application/ld+json">{"name":"A &amp; B"}</script>',
      "<script>   </script>",
    ].join("");

    expect(extractInlineScripts(html)).toEqual([
      "(self.__next_f=self.__next_f||[]).push([0])",
      '{"name":"A & B"}',
      "   ",
    ]);
    expect(inlineScriptHashes(html)).toEqual(
      [
        "(self.__next_f=self.__next_f||[]).push([0])",
        '{"name":"A & B"}',
        "   ",
      ]
        .map(hashInlineScript)
        .sort(),
    );
  });

  it("pins sha256 base64 the way CSP script-src expects it", () => {
    const source = "console.log(1)";
    const digest = createHash("sha256").update(source, "utf8").digest("base64");
    expect(hashInlineScript(source)).toBe(`sha256-${digest}`);
    expect(hashInlineScript(source)).toMatch(/^sha256-[A-Za-z0-9+/]{43}=$/);
  });

  it("decodes the character references browsers hash", () => {
    expect(decodeHtmlEntities("&#65;&#x42;&quot;&apos;&lt;&gt;&amp;")).toBe("AB\"'<>&");
  });

  it("recognises only the all-A placeholder hash", () => {
    expect(isPlaceholderScriptHash(CSP_SCRIPT_HASH_PLACEHOLDER)).toBe(true);
    expect(isPlaceholderScriptHash(`'${CSP_SCRIPT_HASH_PLACEHOLDER}'`)).toBe(true);
    expect(isPlaceholderScriptHash(hashInlineScript("AAAA"))).toBe(false);
  });
});
