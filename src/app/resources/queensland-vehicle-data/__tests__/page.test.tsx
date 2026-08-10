import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QueenslandVehicleDataPage, {
  RESOURCE_HEADING,
  metadata,
  vehicleDataStructuredData,
} from "@/app/resources/queensland-vehicle-data/page";
import {
  BRISBANE_DATA_DOWNLOAD,
  FUEL_DATA_DOWNLOAD,
  VEHICLE_DATA_BUILD_SCRIPT,
  VEHICLE_DATA_ROUTE,
  VEHICLE_DATA_SOURCE_MANIFEST,
} from "@/data/queensland-vehicle-data";
import { SITE_URL, VEHICLE_DATA_CONTENT_UPDATED } from "@/lib/site";

vi.mock("next/navigation", () => ({
  usePathname: () => "/resources/queensland-vehicle-data",
}));

const markup = renderToStaticMarkup(<QueenslandVehicleDataPage />);

describe("Queensland vehicle-data resource page", () => {
  it("is self-canonical, indexable, and socially described as a data resource", () => {
    const twitter = metadata.twitter as {
      card?: string;
      images?: unknown;
    };
    expect(metadata.alternates?.canonical).toBe(VEHICLE_DATA_ROUTE);
    expect(metadata.robots).toBeUndefined();
    expect(String(metadata.title)).toContain("Queensland Vehicle Data");
    expect(String(metadata.openGraph?.title)).toContain("Queensland Vehicle Data");
    expect(String(metadata.twitter?.title)).toContain("Queensland Vehicle Data");
    expect(metadata.openGraph?.url).toBe(VEHICLE_DATA_ROUTE);
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(twitter.card).toBe("summary");
    expect(twitter.images).toBeUndefined();
    expect(metadata.description).toMatch(/2006–2024/);
    expect(metadata.description).toMatch(/2022 snapshot/);
  });

  it("renders one neutral H1, accessible chart and exact table fallbacks", () => {
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toContain(RESOURCE_HEADING);
    expect(markup).toContain('role="img"');
    expect(markup).toContain("fuel-trend-chart-title");
    expect(markup.match(/<table\b/g)).toHaveLength(3);
    expect(markup).toContain("Historical snapshot — not current");
    expect(markup).toContain("1,176,619");
    expect(markup).toContain("View all 186 unambiguous suburb rows");
    expect(markup).toContain("Cross-LGA-ambiguous rows excluded");
  });

  it("publishes both CSV downloads, the source manifest, and safe external links", () => {
    for (const path of [
      FUEL_DATA_DOWNLOAD,
      BRISBANE_DATA_DOWNLOAD,
      VEHICLE_DATA_SOURCE_MANIFEST,
      VEHICLE_DATA_BUILD_SCRIPT,
    ]) {
      expect(markup).toContain(`href="${path}"`);
    }
    expect(markup).toContain("Download all 11 fuel types (CSV)");
    expect(markup).toContain("Download 186 suburb rows (CSV)");
    expect(markup).toContain("Download source manifest (JSON)");
    expect(markup).toContain("Download the source-audited build script");
    expect(markup).toContain("--output-root /path/to/caraway");
    expect(markup).toContain("Bulwer, Cowan Cowan, Kooringal, Moreton Bay");
    expect(markup).toContain("alternative same-name or postcode-mismatch");
    expect(markup).toContain("(opens in a new tab)");
    expect(markup).toContain('rel="noopener noreferrer"');
  });

  it("emits one CollectionPage and two independently scoped Dataset nodes", () => {
    expect(vehicleDataStructuredData.map((node) => node["@type"])).toEqual([
      "BreadcrumbList",
      "CollectionPage",
      "Dataset",
      "Dataset",
    ]);

    const collection = vehicleDataStructuredData[1];
    const fuelDataset = vehicleDataStructuredData[2];
    const brisbaneDataset = vehicleDataStructuredData[3];
    expect(collection).toMatchObject({
      "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#webpage`,
      url: `${SITE_URL}${VEHICLE_DATA_ROUTE}`,
      datePublished: VEHICLE_DATA_CONTENT_UPDATED,
      dateModified: VEHICLE_DATA_CONTENT_UPDATED,
      hasPart: [
        { "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#queensland-fuel-dataset` },
        { "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#brisbane-suburb-dataset` },
      ],
    });
    expect(fuelDataset).toMatchObject({
      temporalCoverage: "2006/2024",
      spatialCoverage: { "@type": "Place", name: "Queensland" },
      license: "https://creativecommons.org/licenses/by/4.0/",
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}${FUEL_DATA_DOWNLOAD}`,
      },
    });
    expect(brisbaneDataset).toMatchObject({
      temporalCoverage: "2022-10-10/2022-10-10",
      spatialCoverage: {
        "@type": "Place",
        name: "186 unambiguous suburb and postcode rows associated with Brisbane City",
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}${BRISBANE_DATA_DOWNLOAD}`,
      },
    });
    expect(String(fuelDataset.description).length).toBeGreaterThanOrEqual(50);
    expect(String(brisbaneDataset.description).length).toBeGreaterThanOrEqual(50);
  });

  it("avoids unsupported commercial, review, and local-business schema", () => {
    const serialized = JSON.stringify(vehicleDataStructuredData);
    expect(serialized).not.toMatch(
      /FAQPage|Service|LocalBusiness|AutomotiveBusiness|aggregateRating|Review|Offer/i,
    );
    expect(serialized).not.toMatch(/cash for cars brisbane|car removal brisbane/i);
  });
});
