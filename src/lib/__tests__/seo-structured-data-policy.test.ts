import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  organizationSchema,
  publisherSchema,
  serviceSchema,
  websiteSchema,
} from "@/lib/json-ld-schemas";
import { BUSINESS, SITE_URL } from "@/lib/site";

function productionSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "__tests__" ? [] : productionSourceFiles(absolutePath);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

describe("SEO structured-data policy", () => {
  it("uses one truthful, exact-name organization without a storefront address", () => {
    expect(organizationSchema).toMatchObject({
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Caraway",
    });
    expect(publisherSchema.name).toBe("Caraway");

    for (const property of [
      "address",
      "geo",
      "serviceArea",
      "priceRange",
      "hasOfferCatalog",
      "keywords",
    ]) {
      expect(organizationSchema).not.toHaveProperty(property);
    }

    expect(JSON.stringify(organizationSchema.contactPoint.areaServed)).not.toBe(
      '"AU"',
    );
    expect(organizationSchema.areaServed).toEqual([
      { "@type": "City", name: "Brisbane" },
    ]);
    expect(organizationSchema.contactPoint.areaServed).toEqual(
      organizationSchema.areaServed,
    );
    expect(organizationSchema.contactPoint).not.toHaveProperty(
      "hoursAvailable",
    );
    expect(organizationSchema.sameAs).toContain(BUSINESS.abrUrl);
    expect(organizationSchema.sameAs).toContain(
      "https://www.google.com/maps?cid=2357564394766220919",
    );
  });

  it("keeps the WebSite entity brand-led and free of meta-keyword fields", () => {
    expect(websiteSchema).toMatchObject({
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Caraway",
    });
    expect(websiteSchema).not.toHaveProperty("keywords");
    expect(websiteSchema).not.toHaveProperty("alternateName");
  });

  it("builds service entities without product prices or inventory status", () => {
    const schema = serviceSchema({
      id: `${SITE_URL}/car-removal-brisbane#service`,
      url: `${SITE_URL}/car-removal-brisbane`,
      name: "Car Removal Brisbane",
      description: "Vehicle collection across Greater Brisbane.",
      serviceType: "Car removal",
    });

    expect(schema.provider).toEqual({
      "@id": `${SITE_URL}/#organization`,
    });
    expect(schema).not.toHaveProperty("offers");
    expect(JSON.stringify(schema)).not.toMatch(
      /AggregateOffer|InStock|lowPrice|highPrice/,
    );
  });

  it("does not reintroduce retired or misleading schema types", () => {
    const source = productionSourceFiles(path.join(process.cwd(), "src"))
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n");

    for (const type of [
      "FAQPage",
      "HowTo",
      "LocalBusiness",
      "AutomotiveBusiness",
      "AggregateOffer",
    ]) {
      expect(source).not.toContain(`"@type": "${type}"`);
    }
    expect(source).not.toContain('"@type": "OpeningHoursSpecification"');
    expect(source).not.toContain(`${SITE_URL}/#business`);
  });
});
