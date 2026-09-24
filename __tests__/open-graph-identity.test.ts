import { describe, expect, it } from "vitest";
import type { Metadata } from "next";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as accessibilityMetadata } from "@/app/accessibility/page";
import { metadata as blogMetadata } from "@/app/blog/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as faqMetadata } from "@/app/faq/page";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";
import { metadata as locationsMetadata } from "@/app/locations/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as resourceMetadata } from "@/app/resources/queensland-vehicle-data/page";
import { metadata as servicesMetadata } from "@/app/services/page";
import { metadata as siteMapMetadata } from "@/app/site-map/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import { generateMetadata as categoryMetadata } from "@/app/blog/category/[category]/page";
import { generateMetadata as pagedMetadata } from "@/app/blog/page/[page]/page";
import { generateMetadata as serviceMetadata } from "@/app/[slug]/page";
import { generateMetadata as locationMetadata } from "@/app/locations/[slug]/page";

function expectOpenGraphIdentity(metadata: Metadata) {
  const openGraph = metadata.openGraph as {
    siteName?: string;
    locale?: string;
  };
  expect(openGraph.siteName).toBe("Caraway");
  expect(openGraph.locale).toBe("en_AU");
}

describe("Open Graph identity", () => {
  it("keeps identity fields on every static indexable route type", () => {
    for (const metadata of [
      homeMetadata,
      aboutMetadata,
      accessibilityMetadata,
      blogMetadata,
      contactMetadata,
      faqMetadata,
      howItWorksMetadata,
      locationsMetadata,
      privacyMetadata,
      resourceMetadata,
      servicesMetadata,
      siteMapMetadata,
      termsMetadata,
    ]) {
      expectOpenGraphIdentity(metadata);
    }
  });

  it("keeps identity fields on dynamic indexable route types", async () => {
    const metadata = await Promise.all([
      categoryMetadata({ params: Promise.resolve({ category: "guides" }) }),
      pagedMetadata({ params: Promise.resolve({ page: "2" }) }),
      serviceMetadata({
        params: Promise.resolve({ slug: "cash-for-cars-brisbane" }),
      }),
      locationMetadata({ params: Promise.resolve({ slug: "toowong" }) }),
    ]);

    metadata.forEach(expectOpenGraphIdentity);
  });

  it("avoids repeating the brand in title-template inputs", () => {
    expect(aboutMetadata.title).toEqual({
      absolute: "About Caraway — Brisbane Vehicle Buyer",
    });
    expect(contactMetadata.title).toEqual({
      absolute: "Contact Caraway | Phone, Email and Quote Enquiries",
    });
    expect(howItWorksMetadata.title).toBe(
      "How Our Vehicle Buying Process Works",
    );
  });
});
