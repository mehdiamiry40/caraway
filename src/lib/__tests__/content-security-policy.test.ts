import { describe, expect, it } from "vitest";
import {
  buildContentSecurityPolicy,
  createCspNonce,
} from "@/lib/content-security-policy";

const DISALLOWED_HOSTS = [
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://ad.doubleclick.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

function directive(policy: string, name: string): string {
  return (
    policy
      .split(";")
      .map((part) => part.trim())
      .find((part) => part === name || part.startsWith(`${name} `)) ?? ""
  );
}

/** Mirrors next/dist/server/app-render/get-script-nonce-from-header.js */
function nonceFromPolicy(policy: string): string | undefined {
  const directives = policy.split(";").map((part) => part.trim());
  const script =
    directives.find((part) => part.startsWith("script-src")) ??
    directives.find((part) => part.startsWith("default-src"));
  if (!script) return undefined;
  for (const source of script.split(/\s+/).slice(1)) {
    const match = source
      .trim()
      .match(/^'nonce-([A-Za-z0-9+/_-]+={0,2})'$/);
    if (match) return match[1];
  }
  return undefined;
}

describe("content security policy", () => {
  it("builds a production document policy around a nonce and strict-dynamic", () => {
    const nonce = createCspNonce();
    const policy = buildContentSecurityPolicy({ nonce, mode: "production" });

    expect(nonceFromPolicy(policy)).toBe(nonce);
    expect(directive(policy, "script-src")).toBe(
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    );
    expect(directive(policy, "script-src")).not.toContain("'unsafe-inline'");
    expect(directive(policy, "script-src")).not.toContain("'unsafe-eval'");
    expect(directive(policy, "script-src-attr")).toBe("script-src-attr 'none'");
    expect(directive(policy, "default-src")).toBe("default-src 'self'");
    expect(directive(policy, "object-src")).toBe("object-src 'none'");
    expect(directive(policy, "base-uri")).toBe("base-uri 'self'");
    expect(directive(policy, "form-action")).toBe("form-action 'self'");
    expect(directive(policy, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(policy, "frame-src")).toBe("frame-src 'none'");
    expect(directive(policy, "connect-src")).toBe("connect-src 'self'");
    expect(directive(policy, "font-src")).toBe("font-src 'self'");
    expect(directive(policy, "img-src")).toBe("img-src 'self' data: blob:");
    expect(directive(policy, "style-src-elem")).toBe("style-src-elem 'self'");
    expect(directive(policy, "style-src-attr")).toBe(
      "style-src-attr 'unsafe-inline'",
    );
    expect(policy).toContain("upgrade-insecure-requests");
    expect(policy).not.toMatch(/\*/);

    for (const host of DISALLOWED_HOSTS) {
      expect(policy).not.toContain(host);
    }
  });

  it("keeps the development exceptions required to boot Next and Vercel debug scripts", () => {
    const nonce = createCspNonce();
    const policy = buildContentSecurityPolicy({
      nonce,
      mode: "development",
    });

    expect(nonceFromPolicy(policy)).toBe(nonce);
    expect(directive(policy, "script-src")).toContain("'unsafe-eval'");
    expect(directive(policy, "script-src")).toContain(
      "https://va.vercel-scripts.com",
    );
    expect(directive(policy, "script-src")).not.toContain("'unsafe-inline'");
    expect(directive(policy, "connect-src")).toBe("connect-src 'self'");
    expect(directive(policy, "frame-ancestors")).toBe("frame-ancestors *");
    expect(policy).not.toContain("upgrade-insecure-requests");
  });

  it("rejects a nonce Next.js would fail to parse", () => {
    expect(() =>
      buildContentSecurityPolicy({ nonce: "bad nonce", mode: "production" }),
    ).toThrow(/nonce/i);
  });
});
