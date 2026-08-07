import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

type RobotsRule = {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

function rulesArray(
  rules: ReturnType<typeof robots>["rules"],
): RobotsRule[] {
  if (!rules) return [];
  return Array.isArray(rules)
    ? (rules as RobotsRule[])
    : [rules as RobotsRule];
}

describe("robots.txt", () => {
  it("keeps Next render assets crawlable for public search bots", () => {
    const publicRule = rulesArray(robots().rules).find(
      (rule) => rule.userAgent === "*",
    );

    expect(publicRule).toBeDefined();
    expect(publicRule?.allow).toBe("/");
    expect(publicRule?.disallow).toEqual(["/api/", "/private/"]);
    expect(publicRule?.disallow).not.toContain("/_next/");
  });

  it("still blocks configured training crawlers from all content", () => {
    const rules = rulesArray(robots().rules);

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userAgent: "GPTBot", disallow: ["/"] }),
        expect.objectContaining({ userAgent: "ClaudeBot", disallow: ["/"] }),
        expect.objectContaining({ userAgent: "CCBot", disallow: ["/"] }),
      ]),
    );
  });

  it("always advertises the canonical sitemap so crawlers can read host-level noindex headers", () => {
    const output = robots();

    expect(output.sitemap).toBe("https://caraway.au/sitemap.xml");
    expect(output.host).toBe("https://caraway.au");
  });
});
