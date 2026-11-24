import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface WebManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
}

describe("web manifest claims", () => {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "public", "site.webmanifest"), "utf8"),
  ) as WebManifest;

  it("uses the same qualified vehicle-buyer positioning as the live site", () => {
    expect(manifest).toMatchObject({
      name: "Caraway — Brisbane Vehicle Buyer",
      short_name: "Caraway",
      start_url: "/",
    });
    expect(manifest.description).toContain("free quote for your car");
    expect(manifest.description).toContain("Free towing when Caraway buys");
    expect(manifest.description).toMatch(
      /access and availability can affect pickup/i,
    );
  });

  it("does not publish unsupported global promises", () => {
    expect(`${manifest.name} ${manifest.description}`).not.toMatch(
      /fair quotes|free removal|payment on (?:pickup|collection)/i,
    );
    // "Free towing" must always carry the purchase condition.
    expect(manifest.description).not.toMatch(
      /free towing(?! when Caraway buys)/i,
    );
  });
});
