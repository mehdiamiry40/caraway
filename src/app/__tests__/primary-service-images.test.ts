import { statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  buildServiceStructuredData,
  generateMetadata,
} from "@/app/[slug]/page";
import {
  getServicePreferredImage,
  services,
  type ServicePage,
} from "@/data/services";
import { SITE_URL } from "@/lib/site";

const targetSlugs = [
  "cash-for-cars-brisbane",
  "car-removal-brisbane",
] as const;

function targetService(slug: (typeof targetSlugs)[number]): ServicePage {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Missing target service: ${slug}`);
  return service;
}

describe("primary service preferred images", () => {
  it("uses one unique, crawlable 1200x630 JPEG on each target", async () => {
    const seenSources = new Set<string>();
    const seenAlts = new Set<string>();

    for (const slug of targetSlugs) {
      const service = targetService(slug);
      const illustratedSections = service.sections.filter(
        (section) => section.image,
      );
      expect(illustratedSections).toHaveLength(1);

      const image = getServicePreferredImage(service);
      expect(image).toBeDefined();
      if (!image) continue;

      expect(image.src).toMatch(/^\/images\/[a-z0-9-]+-v1\.jpg$/);
      expect(image.src).not.toBe("/images/og-card.jpg");
      expect(image.alt.length).toBeGreaterThan(60);
      expect(image.caption.length).toBeGreaterThan(80);
      expect(seenSources.has(image.src)).toBe(false);
      expect(seenAlts.has(image.alt)).toBe(false);
      seenSources.add(image.src);
      seenAlts.add(image.alt);

      const assetPath = join(
        process.cwd(),
        "public",
        image.src.replace(/^\//, ""),
      );
      const file = statSync(assetPath);
      expect(file.size).toBeGreaterThan(50_000);
      expect(file.size).toBeLessThan(250_000);

      const metadata = await sharp(assetPath).metadata();
      expect(metadata).toMatchObject({
        format: "jpeg",
        width: image.width,
        height: image.height,
      });
    }
  });

  it("uses the same target image in metadata and structured data", async () => {
    for (const slug of targetSlugs) {
      const service = targetService(slug);
      const image = getServicePreferredImage(service);
      expect(image).toBeDefined();
      if (!image) continue;

      const canonical = `${SITE_URL}/${slug}`;
      const absoluteImage = `${SITE_URL}${image.src}`;
      const routeMetadata = await generateMetadata({
        params: Promise.resolve({ slug }),
      });

      expect(routeMetadata).toMatchObject({
        openGraph: {
          images: [
            {
              url: image.src,
              width: image.width,
              height: image.height,
              alt: image.alt,
            },
          ],
        },
        twitter: {
          images: [{ url: image.src, alt: image.alt }],
        },
      });

      const structuredData = buildServiceStructuredData(service);
      expect(structuredData).toContainEqual(
        expect.objectContaining({
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          primaryImageOfPage: expect.objectContaining({
            "@type": "ImageObject",
            "@id": `${canonical}#primaryimage`,
            url: absoluteImage,
            contentUrl: absoluteImage,
            width: image.width,
            height: image.height,
            representativeOfPage: true,
          }),
          thumbnailUrl: absoluteImage,
        }),
      );
      expect(structuredData).toContainEqual(
        expect.objectContaining({
          "@type": "Service",
          "@id": `${canonical}#service`,
          image: absoluteImage,
        }),
      );
    }
  });
});
