import type { Metadata } from "next";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Open_Sans: () => ({ variable: "--font-open-sans" }),
  Barlow: () => ({ variable: "--font-barlow" }),
}));
import { metadata as rootMetadata } from "@/app/layout";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as accessibilityMetadata } from "@/app/accessibility/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as faqMetadata } from "@/app/faq/page";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";
import {
  generateMetadata as generateLocationMetadata,
} from "@/app/locations/[slug]/page";
import { metadata as locationsMetadata } from "@/app/locations/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as servicesMetadata } from "@/app/services/page";
import { metadata as siteMapMetadata } from "@/app/site-map/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import {
  generateMetadata as generateServiceMetadata,
} from "@/app/[slug]/page";
import { services } from "@/data/services";
import { suburbs } from "@/data/suburbs";
import { SHARED_PICKUP_IMAGE_ALT } from "@/lib/site";

const CASH_QUERY = /cash for cars brisbane/i;
const REMOVAL_QUERY = /car removal brisbane/i;
const PRIMARY_QUERIES = /cash for cars brisbane|car removal brisbane/i;
const SHARED_IMAGE_PATHS = [
  "/og.png",
  "/images/og-card.jpg",
  "/images/tow-truck-hero.webp",
] as const;
const SHARED_IMAGE_DIMENSIONS = new Map([
  ["/og.png", { width: 1200, height: 630 }],
  ["/images/og-card.jpg", { width: 1200, height: 630 }],
  ["/images/tow-truck-hero.webp", { width: 800, height: 800 }],
]);

function socialImages(metadata: Metadata): Array<{
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}> {
  return [metadata.openGraph?.images, metadata.twitter?.images].flatMap(
    (value) => {
      if (!value) return [];
      const images = Array.isArray(value) ? value : [value];
      return images.flatMap((image) => {
        if (typeof image !== "object" || image === null || !("url" in image)) {
          return [];
        }
        const url = image.url instanceof URL ? image.url.href : image.url;
        if (typeof url !== "string") return [];
        return [
          {
            url,
            ...(typeof image.alt === "string" ? { alt: image.alt } : {}),
            ...(typeof image.width === "number" ? { width: image.width } : {}),
            ...(typeof image.height === "number"
              ? { height: image.height }
              : {}),
          },
        ];
      });
    },
  );
}

function imageAlts(metadata: Metadata): string[] {
  return socialImages(metadata).flatMap((image) =>
    image.alt ? [image.alt] : [],
  );
}

function isSharedImage(url: string): boolean {
  return SHARED_IMAGE_PATHS.some((path) => url.endsWith(path));
}

function expectSharedImageContract(
  image: ReturnType<typeof socialImages>[number],
  context?: string,
): void {
  const path = SHARED_IMAGE_PATHS.find((candidate) =>
    image.url.endsWith(candidate),
  );
  expect(path, context).toBeDefined();
  expect(image.alt, context).toBe(SHARED_PICKUP_IMAGE_ALT);

  if (image.width !== undefined || image.height !== undefined) {
    expect(
      { width: image.width, height: image.height },
      context,
    ).toEqual(SHARED_IMAGE_DIMENSIONS.get(path!));
  }
}

describe("social-image alt query ownership", () => {
  it("matches shared metadata dimensions to the checked-in image files", async () => {
    for (const path of SHARED_IMAGE_PATHS) {
      const metadata = await sharp(
        join(process.cwd(), "public", path.replace(/^\//, "")),
      ).metadata();
      expect(
        { width: metadata.width, height: metadata.height },
        path,
      ).toEqual(SHARED_IMAGE_DIMENSIONS.get(path));
    }
  });

  it("describes the shared flatbed image literally on neutral static pages", () => {
    const staticMetadata = [
      rootMetadata,
      homeMetadata,
      aboutMetadata,
      accessibilityMetadata,
      contactMetadata,
      faqMetadata,
      howItWorksMetadata,
      locationsMetadata,
      privacyMetadata,
      servicesMetadata,
      siteMapMetadata,
      termsMetadata,
    ];

    for (const metadata of staticMetadata) {
      const images = socialImages(metadata);
      expect(images.length).toBeGreaterThan(0);
      for (const image of images) expectSharedImageContract(image);
    }
  });

  it("keeps every location-page image alt descriptive and query-neutral", async () => {
    for (const suburb of suburbs) {
      const metadata = await generateLocationMetadata({
        params: Promise.resolve({ slug: suburb.slug }),
      });
      const images = socialImages(metadata);

      expect(images, suburb.slug).toHaveLength(2);
      for (const { alt } of images) {
        expect(alt, suburb.slug).not.toMatch(PRIMARY_QUERIES);
      }
      for (const image of images) {
        expectSharedImageContract(image, suburb.slug);
      }
    }
  });

  it("keeps primary-query image alt text exclusive to its rightful owner", async () => {
    const neutralMetadata = [
      rootMetadata,
      homeMetadata,
      aboutMetadata,
      accessibilityMetadata,
      contactMetadata,
      faqMetadata,
      howItWorksMetadata,
      locationsMetadata,
      privacyMetadata,
      servicesMetadata,
      siteMapMetadata,
      termsMetadata,
    ];

    for (const metadata of neutralMetadata) {
      for (const alt of imageAlts(metadata)) {
        expect(alt).not.toMatch(PRIMARY_QUERIES);
      }
    }

    for (const service of services) {
      const metadata = await generateServiceMetadata({
        params: Promise.resolve({ slug: service.slug }),
      });
      const images = socialImages(metadata);
      expect(images, service.slug).toHaveLength(2);

      for (const image of images) {
        if (isSharedImage(image.url)) {
          expectSharedImageContract(image, service.slug);
        }
        const alt = image.alt ?? "";
        if (service.slug !== "cash-for-cars-brisbane") {
          expect(alt, service.slug).not.toMatch(CASH_QUERY);
        }
        if (service.slug !== "car-removal-brisbane") {
          expect(alt, service.slug).not.toMatch(REMOVAL_QUERY);
        }
      }
    }
  });
});
