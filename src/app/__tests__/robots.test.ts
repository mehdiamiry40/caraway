import { afterEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";

const ORIGINAL_NOINDEX = process.env.NEXT_PUBLIC_NOINDEX;
const ORIGINAL_VERCEL_ENV = process.env.VERCEL_ENV;

type RobotsRule = {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

function restoreEnv(): void {
  if (ORIGINAL_NOINDEX === undefined) {
    delete process.env.NEXT_PUBLIC_NOINDEX;
  } else {
    process.env.NEXT_PUBLIC_NOINDEX = ORIGINAL_NOINDEX;
  }

  if (ORIGINAL_VERCEL_ENV === undefined) {
    delete process.env.VERCEL_ENV;
  } else {
    process.env.VERCEL_ENV = ORIGINAL_VERCEL_ENV;
  }
}

function productionRobots(): ReturnType<typeof robots> {
  delete process.env.NEXT_PUBLIC_NOINDEX;
  process.env.VERCEL_ENV = "production";
  return robots();
}

function rulesArray(
  rules: ReturnType<typeof robots>["rules"],
): RobotsRule[] {
  if (!rules) return [];
  return Array.isArray(rules)
    ? (rules as RobotsRule[])
    : [rules as RobotsRule];
}

afterEach(restoreEnv);

describe("robots.txt", () => {
  it("keeps Next render assets crawlable for public search bots", () => {
    const publicRule = rulesArray(productionRobots().rules).find(
      (rule) => rule.userAgent === "*",
    );

    expect(publicRule).toBeDefined();
    expect(publicRule?.allow).toBe("/");
    expect(publicRule?.disallow).toEqual(["/api/", "/private/"]);
    expect(publicRule?.disallow).not.toContain("/_next/");
  });

  it("still blocks configured training crawlers from all content", () => {
    const rules = rulesArray(productionRobots().rules);

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userAgent: "GPTBot", disallow: ["/"] }),
        expect.objectContaining({ userAgent: "ClaudeBot", disallow: ["/"] }),
        expect.objectContaining({ userAgent: "CCBot", disallow: ["/"] }),
      ]),
    );
  });
});
