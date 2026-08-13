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
    expect(manifest.description).toContain("vehicle-specific quotes");
    expect(manifest.description).toContain(
      "Pickup is included when Caraway buys",
    );
    expect(manifest.description).toMatch(/subject to .*access.*availability/i);
  });

  it("does not publish unsupported global promises", () => {
    expect(`${manifest.name} ${manifest.description}`).not.toMatch(
      /fair quotes|free removal|payment on (?:pickup|collection)/i,
    );
  });
});
