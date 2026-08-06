import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("Lumus-matched Caraway homepage", () => {
  it("keeps the full homepage content within the redesign scope", () => {
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

  it("matches the defining Lumus homepage composition", () => {
    const hero = source("src/components/sections/Hero.tsx");
    const header = source("src/components/layout/Header.tsx");
    const services = source("src/components/sections/TrustBadges.tsx");
    const styles = source("src/app/globals.css");

    expect(hero).toContain('picture className="absolute inset-0"');
    expect(hero).toContain("border-t border-on-dark-hi/90");
    expect(hero).toContain("sm:border-r");
    expect(header).toContain("ServicesDropdownClient");
    expect(header).toContain("bg-primary text-on-dark-hi");
    expect(services).toContain("lg:grid-cols-4");
    expect(services).toContain("View all services");
    expect(styles).toContain("--radius-sm: 0.125rem");
  });
});
