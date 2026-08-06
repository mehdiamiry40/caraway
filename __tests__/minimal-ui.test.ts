import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("minimal public UI", () => {
  it("keeps the homepage focused on the quote decision", () => {
    const homepage = source("src/views/HomeBelowFold.tsx");

    expect(homepage).toContain("<PriceEstimator />");
    expect(homepage).toContain("<HowItWorks />");
    expect(homepage).toContain("<WhyUs />");
    expect(homepage).toContain("<FAQ />");
    expect(homepage).toContain("<FinalCTA />");

    expect(homepage).not.toContain("<TrustBadges />");
    expect(homepage).not.toContain("<Stats />");
    expect(homepage).not.toContain("<SellerSituations />");
    expect(homepage).not.toContain("<ServiceAreas />");
    expect(homepage).not.toContain("<SellingSafelySection />");
  });

  it("uses a single-level primary navigation", () => {
    const header = source("src/components/layout/Header.tsx");
    const mobileMenu = source("src/components/layout/MobileMenuClient.tsx");

    expect(header).not.toContain("ServicesDropdownClient");
    expect(header).not.toContain("Open today");
    expect(mobileMenu).not.toContain("ChevronDown");
    expect(mobileMenu).not.toContain("<details className=\"group/services\"");
  });
});
