import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { metadata as homeMetadata, homeStructuredData } from "@/app/page";
import { metadata as locationsMetadata } from "@/app/locations/page";
import { metadata as faqMetadata } from "@/app/faq/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as blogMetadata } from "@/app/blog/page";
import { generateMetadata as generateBlogPageMetadata } from "@/app/blog/page/[page]/page";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";
import { generateMetadata as generateServiceMetadata } from "@/app/[slug]/page";
import {
  metadata as servicesMetadata,
  SERVICE_HUB_HEADING,
} from "@/app/services/page";
import { Hero } from "@/components/sections/Hero";
import { ServiceSectionContent } from "@/components/templates/ServicePageTemplate";
import { blogPosts } from "@/data/blog-posts";
import { getServiceBySlug, services } from "@/data/services";
import { SITE_URL } from "@/lib/site";

const CASH_QUERY = /cash for cars brisbane/i;
const REMOVAL_QUERY = /car removal brisbane/i;

describe("primary SEO query ownership", () => {
  it("keeps the homepage as a brand hub instead of a competing exact-match page", () => {
    const title = (homeMetadata.title as { absolute: string }).absolute;
    const openGraphTitle = String(homeMetadata.openGraph?.title ?? "");
    const hero = renderToStaticMarkup(<Hero />);
    const h1 = hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    const webPageName = String(homeStructuredData[0]?.name ?? "");

    expect(title).not.toMatch(CASH_QUERY);
    expect(openGraphTitle).not.toMatch(CASH_QUERY);
    expect(h1).not.toMatch(CASH_QUERY);
    expect(webPageName).not.toMatch(CASH_QUERY);
    expect(homeMetadata.keywords).toBeUndefined();
  });

  it("keeps the location hub from competing with the primary cash query", () => {
    expect(String(locationsMetadata.title ?? "")).not.toMatch(CASH_QUERY);
    expect(String(locationsMetadata.openGraph?.title ?? "")).not.toMatch(CASH_QUERY);
  });

  it("keeps the service hub neutral instead of competing with either owner", () => {
    expect(String(servicesMetadata.title ?? "")).not.toMatch(CASH_QUERY);
    expect(String(servicesMetadata.title ?? "")).not.toMatch(REMOVAL_QUERY);
    expect(String(servicesMetadata.openGraph?.title ?? "")).not.toMatch(
      CASH_QUERY,
    );
    expect(String(servicesMetadata.openGraph?.title ?? "")).not.toMatch(
      REMOVAL_QUERY,
    );
    expect(SERVICE_HUB_HEADING).not.toMatch(CASH_QUERY);
    expect(SERVICE_HUB_HEADING).not.toMatch(REMOVAL_QUERY);
  });

  it("keeps supporting hubs and paginated indexes from claiming either exact query", async () => {
    const pageTwoMetadata = await generateBlogPageMetadata({
      params: Promise.resolve({ page: "2" }),
    });

    for (const metadata of [
      faqMetadata,
      contactMetadata,
      blogMetadata,
      pageTwoMetadata,
      howItWorksMetadata,
    ]) {
      for (const query of [CASH_QUERY, REMOVAL_QUERY]) {
        expect(String(metadata.title ?? "")).not.toMatch(query);
        expect(String(metadata.openGraph?.title ?? "")).not.toMatch(query);
        expect(String(metadata.twitter?.title ?? "")).not.toMatch(query);
      }
    }
  });

  it("keeps blog titles from claiming either unmodified primary query", () => {
    for (const post of blogPosts) {
      expect(post.title, post.slug).not.toMatch(CASH_QUERY);
      expect(post.title, post.slug).not.toMatch(REMOVAL_QUERY);
    }
  });

  it("assigns cash for cars Brisbane to one self-canonical service page", async () => {
    const service = getServiceBySlug("cash-for-cars-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "cash-for-cars-brisbane" }),
    });

    expect(service).toBeDefined();
    expect(service?.title).toMatch(CASH_QUERY);
    expect(service?.h1).toMatch(CASH_QUERY);
    expect(`${SITE_URL}/${service?.slug}`).toBe(
      "https://caraway.au/cash-for-cars-brisbane",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/cash-for-cars-brisbane",
    );
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(service?.h1);
    expect(
      services.filter((item) => /^Cash for Cars Brisbane\b/i.test(item.h1)),
    ).toHaveLength(1);
  });

  it("assigns car removal Brisbane to one surviving service page", async () => {
    const service = getServiceBySlug("car-removal-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "car-removal-brisbane" }),
    });

    expect(service).toBeDefined();
    expect(service?.title).toMatch(REMOVAL_QUERY);
    expect(service?.h1).toMatch(REMOVAL_QUERY);
    expect(getServiceBySlug("unwanted-cars-brisbane")).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/car-removal-brisbane",
    );
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(service?.h1);
    expect(
      services.filter((item) => /^Car Removal Brisbane\b/i.test(item.h1)),
    ).toHaveLength(1);
  });

  it("links both primary service pages to the canonical Queensland paperwork checklist", () => {
    const expected =
      "/blog/what-paperwork-to-sell-a-car-qld#at-a-glance-queensland-seller-paperwork-checklist";

    for (const slug of ["cash-for-cars-brisbane", "car-removal-brisbane"]) {
      const service = getServiceBySlug(slug);
      const checklistLinks =
        service?.sections
          .map((section) => section.supportLink?.href)
          .filter((href): href is string => href !== undefined) ?? [];

      expect(checklistLinks, slug).toContain(expected);

      const section = service?.sections.find(
        (candidate) => candidate.supportLink?.href === expected,
      );
      expect(section, slug).toBeDefined();
      const markup = renderToStaticMarkup(
        <ServiceSectionContent section={section!} />,
      );
      expect(markup, slug).toContain(`href="${expected}"`);
      expect(markup, slug).toContain(
        "Open the Queensland seller paperwork checklist",
      );
    }
  });

  it("links both primary service pages to the three-quote comparison worksheet", () => {
    const expected =
      "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#compare-three-vehicle-buyer-quotes";

    for (const slug of ["cash-for-cars-brisbane", "car-removal-brisbane"]) {
      const service = getServiceBySlug(slug);
      const section = service?.sections.find(
        (candidate) => candidate.supportLink?.href === expected,
      );

      expect(section, slug).toBeDefined();
      const markup = renderToStaticMarkup(
        <ServiceSectionContent section={section!} />,
      );
      expect(markup, slug).toContain(`href="${expected}"`);
      expect(markup, slug).toMatch(/Compare (?:three written vehicle-buyer quotes|pickup costs and effective net offers)/);
    }

    const worksheetPost = blogPosts.find(
      (post) => post.slug === "how-to-get-the-best-cash-for-cars-price-brisbane",
    );
    expect(worksheetPost?.interactiveTool).toBe("quote-comparison-worksheet");
  });
});
