import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QueenslandVehicleDataPage, {
  RESOURCE_HEADING,
  metadata,
  vehicleDataStructuredData,
} from "@/app/resources/queensland-vehicle-data/page";
import {
  BRISBANE_DATA_DOWNLOAD,
  BRISBANE_REUSE_THUMBNAIL,
  FUEL_DATA_DOWNLOAD,
  VEHICLE_DATA_SOCIAL_IMAGE,
  VEHICLE_DATA_BUILD_SCRIPT,
  VEHICLE_DATA_ROUTE,
  VEHICLE_DATA_SOURCE_MANIFEST,
} from "@/data/queensland-vehicle-data";
import {
  SITE_URL,
  VEHICLE_DATA_CONTENT_PUBLISHED,
  VEHICLE_DATA_CONTENT_UPDATED,
} from "@/lib/site";

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
    expect(metadata.openGraph?.images).toEqual([
      {
        url: VEHICLE_DATA_SOCIAL_IMAGE.src,
        width: VEHICLE_DATA_SOCIAL_IMAGE.width,
        height: VEHICLE_DATA_SOCIAL_IMAGE.height,
        alt: VEHICLE_DATA_SOCIAL_IMAGE.alt,
        type: "image/png",
      },
    ]);
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.images).toEqual([
      {
        url: VEHICLE_DATA_SOCIAL_IMAGE.src,
        alt: VEHICLE_DATA_SOCIAL_IMAGE.alt,
      },
    ]);
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

  it("publishes citation-ready changes from the final two source years", () => {
    expect(markup).toContain("Change in the published records, 2023–2024");
    expect(markup).toContain("+88,927");
    expect(markup).toContain("+2.8%");
    expect(markup).toContain("3,178,051 → 3,266,978");
    expect(markup).toContain("+21,417");
    expect(markup).toContain("+93.2%");
    expect(markup).toContain("22,981 → 44,398");
    expect(markup).toContain("+31,359");
    expect(markup).toContain("+39.6%");
    expect(markup).toContain("79,245 → 110,604");
    expect(markup).toContain("source cleansing");
    expect(markup).toContain("not sales, market share, demand, removals");
    expect(markup).toContain("BEV/PHEV classifications");
  });

  it("publishes both CSV downloads, the source manifest, and safe external links", () => {
    for (const path of [
      FUEL_DATA_DOWNLOAD,
      BRISBANE_DATA_DOWNLOAD,
      VEHICLE_DATA_SOURCE_MANIFEST,
      VEHICLE_DATA_BUILD_SCRIPT,
      VEHICLE_DATA_SOCIAL_IMAGE.src,
      BRISBANE_REUSE_THUMBNAIL.src,
    ]) {
      expect(markup).toContain(`href="${path}"`);
    }
    expect(markup).toContain("Download all 11 fuel types (CSV)");
    expect(markup).toContain("Download 186 suburb rows (CSV)");
    expect(markup).toContain("Download source manifest (JSON)");
    expect(markup).toContain("Download the source-audited build script");
    expect(markup).toContain("Editorial preview images");
    expect(markup).toContain("Download Queensland fuel-trends graphic (PNG, 1200 × 630)");
    expect(markup).toContain(
      "Download historical Brisbane suburb-snapshot graphic (PNG, 800 × 800)",
    );
    expect(markup).toContain("historical 10 October 2022");
    expect(markup).toContain("not a current fleet estimate");
    for (const image of [VEHICLE_DATA_SOCIAL_IMAGE, BRISBANE_REUSE_THUMBNAIL]) {
      expect(markup).toContain(`href="${image.src}" download=""`);
    }
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
      datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
      dateModified: VEHICLE_DATA_CONTENT_UPDATED,
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#primaryimage`,
        url: `${SITE_URL}${VEHICLE_DATA_SOCIAL_IMAGE.src}`,
        contentUrl: `${SITE_URL}${VEHICLE_DATA_SOCIAL_IMAGE.src}`,
        width: VEHICLE_DATA_SOCIAL_IMAGE.width,
        height: VEHICLE_DATA_SOCIAL_IMAGE.height,
        caption: VEHICLE_DATA_SOCIAL_IMAGE.alt,
      },
      thumbnailUrl: `${SITE_URL}${VEHICLE_DATA_SOCIAL_IMAGE.src}`,
      hasPart: [
        { "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#queensland-fuel-dataset` },
        { "@id": `${SITE_URL}${VEHICLE_DATA_ROUTE}#brisbane-suburb-dataset` },
      ],
    });
    expect(fuelDataset).toMatchObject({
      datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
      dateModified: VEHICLE_DATA_CONTENT_UPDATED,
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
      datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
      dateModified: VEHICLE_DATA_CONTENT_UPDATED,
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
