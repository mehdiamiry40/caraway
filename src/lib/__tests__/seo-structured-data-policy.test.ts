import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  organizationSchema,
  publisherSchema,
  serviceSchema,
  websiteSchema,
} from "@/lib/json-ld-schemas";
import {
  BUSINESS,
  BUSINESS_GEO,
  OPENING_HOURS,
  PRICE_RANGE_LABEL,
  SERVICE_AREA_NAMES,
  SITE_URL,
} from "@/lib/site";

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
  it("uses one truthful, exact-name entity typed for a local auto business", () => {
    expect(organizationSchema).toMatchObject({
      "@type": ["Organization", "AutoDealer"],
      "@id": `${SITE_URL}/#organization`,
      name: "Caraway",
    });
    expect(publisherSchema.name).toBe("Caraway");

    // Speculative commerce markup stays out: there is no catalogue, no
    // inventory, and no keyword stuffing on the entity.
    for (const property of ["hasOfferCatalog", "keywords", "makesOffer"]) {
      expect(organizationSchema).not.toHaveProperty(property);
    }

    expect(JSON.stringify(organizationSchema.contactPoint.areaServed)).not.toBe(
      '"AU"',
    );
    expect(organizationSchema.areaServed).toEqual(
      SERVICE_AREA_NAMES.map((name) => ({ "@type": "City", name })),
    );
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

  it("publishes a city-level location and never invents a storefront", () => {
    // Vehicles are collected, not dropped off, so there is no address a
    // customer could visit. Publishing a streetAddress would be a claim the
    // business cannot honour.
    expect(organizationSchema.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Brisbane",
      addressRegion: "QLD",
      addressCountry: "AU",
    });
    expect(organizationSchema.address).not.toHaveProperty("streetAddress");
    expect(organizationSchema.address).not.toHaveProperty("postalCode");

    expect(organizationSchema.geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: BUSINESS_GEO.latitude,
      longitude: BUSINESS_GEO.longitude,
    });
    expect(organizationSchema.priceRange).toBe(PRICE_RANGE_LABEL);
  });

  it("only advertises trading hours that are actually published", () => {
    // OPENING_HOURS is the single source of truth and is empty until the hours
    // on the Google Business Profile are mirrored into it. An empty array must
    // be omitted, not emitted — a parser reads "no hours" as permanently closed.
    if (OPENING_HOURS.length === 0) {
      expect(organizationSchema).not.toHaveProperty(
        "openingHoursSpecification",
      );
      return;
    }

    const spec = (
      organizationSchema as unknown as {
        openingHoursSpecification: Array<Record<string, unknown>>;
      }
    ).openingHoursSpecification;
    expect(spec).toHaveLength(OPENING_HOURS.length);
    for (const entry of spec) {
      expect(entry["@type"]).toBe("OpeningHoursSpecification");
      expect(entry.opens).toMatch(/^\d{2}:\d{2}$/);
      expect(entry.closes).toMatch(/^\d{2}:\d{2}$/);
    }
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

    // AutoDealer (a LocalBusiness subtype) is now carried by the single
    // #organization node. These remain banned: FAQPage/HowTo were retired after
    // Google dropped the rich results, generic LocalBusiness/AutomotiveBusiness
    // would duplicate the entity, and AggregateOffer implies pricing we do not
    // publish.
    for (const type of [
      "FAQPage",
      "HowTo",
      "LocalBusiness",
      "AutomotiveBusiness",
      "AggregateOffer",
    ]) {
      expect(source).not.toContain(`"@type": "${type}"`);
    }
    // A second business node would split the entity across two @ids.
    expect(source).not.toContain(`${SITE_URL}/#business`);
  });
});
