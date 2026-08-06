import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("Lumus-inspired Caraway homepage", () => {
  it("keeps the full homepage content while applying the new design scope", () => {
    const home = source("src/views/Home.tsx");
    const belowFold = source("src/views/HomeBelowFold.tsx");

    expect(home).toContain("lumus-home");
    for (const section of [
      "TrustBadges",
      "PriceEstimator",
      "HowItWorks",
      "WhyUs",
      "ServiceAreas",
      "SellerSituations",
      "Stats",
      "SellingSafelySection",
      "FAQ",
      "FinalCTA",
    ]) {
      expect(belowFold).toContain(`<${section} />`);
    }
  });

  it("uses editorial hierarchy and a single-level navigation", () => {
    const hero = source("src/components/sections/Hero.tsx");
    const header = source("src/components/layout/Header.tsx");
    const menu = source("src/components/layout/MobileMenuClient.tsx");
    const styles = source("src/app/globals.css");

    expect(hero).toContain("Cash for cars.");
    expect(hero).toContain('rounded-[1.75rem]');
    expect(header).not.toContain("ServicesDropdownClient");
    expect(menu).not.toContain("ChevronDown");
    expect(styles).toContain(".lumus-home");
  });
});
