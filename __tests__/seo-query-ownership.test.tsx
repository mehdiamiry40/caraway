import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { metadata as homeMetadata, homeStructuredData } from "@/app/page";
import { metadata as locationsMetadata } from "@/app/locations/page";
import { metadata as faqMetadata } from "@/app/faq/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as blogMetadata } from "@/app/blog/page";
import { generateMetadata as generateBlogPageMetadata } from "@/app/blog/page/[page]/page";
import { metadata as howItWorksMetadata } from "@/app/how-it-works/page";
import {
  metadata as vehicleDataMetadata,
  RESOURCE_HEADING,
} from "@/app/resources/queensland-vehicle-data/page";
import {
  buildServiceStructuredData,
  generateMetadata as generateServiceMetadata,
} from "@/app/[slug]/page";
import {
  metadata as servicesMetadata,
  SERVICE_HUB_HEADING,
} from "@/app/services/page";
import { Hero } from "@/components/sections/Hero";
import { ServiceSectionContent } from "@/components/templates/ServicePageTemplate";
import { blogPosts } from "@/data/blog-posts";
import {
  getServiceBySlug,
  getServicePreferredImage,
  services,
} from "@/data/services";
import { SITE_URL } from "@/lib/site";

const CASH_QUERY = /cash for cars brisbane/i;
const REMOVAL_QUERY = /car removal brisbane/i;
const OLD_UTE_QUERY = /cash for old utes/i;
const FLOODED_CAR_QUERY = /cash for (?:flooded|flood[- ]damaged) cars?/i;
const UNREGISTERED_REMOVAL_QUERY = /unregistered car removal/i;
const SCRAP_REMOVAL_QUERY = /scrap car removals?(?: in)? brisbane/i;

function serviceOwnersOf(query: RegExp): string[] {
  return services
    .filter((service) =>
      [service.title, service.h1, service.metaDescription].some((value) =>
        query.test(value),
      ),
    )
    .map((service) => service.slug);
}

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
      vehicleDataMetadata,
    ]) {
      for (const query of [CASH_QUERY, REMOVAL_QUERY]) {
        expect(String(metadata.title ?? "")).not.toMatch(query);
        expect(String(metadata.openGraph?.title ?? "")).not.toMatch(query);
        expect(String(metadata.twitter?.title ?? "")).not.toMatch(query);
      }
    }

    expect(RESOURCE_HEADING).not.toMatch(CASH_QUERY);
    expect(RESOURCE_HEADING).not.toMatch(REMOVAL_QUERY);
  });

  it("keeps blog titles from claiming either unmodified primary query", () => {
    for (const post of blogPosts) {
      expect(post.title, post.slug).not.toMatch(CASH_QUERY);
      expect(post.title, post.slug).not.toMatch(REMOVAL_QUERY);
    }
  });

  it("assigns the observed old-ute query to one supporting article", () => {
    const owners = blogPosts.filter((post) => OLD_UTE_QUERY.test(post.title));
    const post = owners[0];

    expect(owners.map(({ slug }) => slug)).toEqual(["sell-my-ute-brisbane"]);
    expect(post?.metaDescription).toMatch(/cash for an old ute in brisbane/i);
    expect(post?.title).not.toMatch(CASH_QUERY);
    expect(post?.title).not.toMatch(REMOVAL_QUERY);
    expect(post?.content.join(" ")).toContain(
      "[cash-for-cars buyer in Brisbane](/cash-for-cars-brisbane)",
    );
    expect(post?.relatedServices).toContain("cash-for-cars-brisbane");
    expect(post?.updatedAt).toBe("2026-08-11");
  });

  it("assigns the observed flooded-car query to the existing damaged-car owner", async () => {
    const service = getServiceBySlug("damaged-cars-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "damaged-cars-brisbane" }),
    });
    const floodSection = service?.sections.find(
      ({ heading }) => heading === "Flood, Fire, and Mechanical Damage",
    );

    expect(service).toBeDefined();
    expect(serviceOwnersOf(FLOODED_CAR_QUERY)).toEqual([
      "damaged-cars-brisbane",
    ]);
    expect(
      blogPosts
        .filter((post) =>
          [post.title, post.metaDescription].some((value) =>
            FLOODED_CAR_QUERY.test(value),
          ),
        )
        .map(({ slug }) => slug),
    ).toEqual([]);
    expect(service?.title).toMatch(FLOODED_CAR_QUERY);
    expect(service?.metaDescription).toMatch(FLOODED_CAR_QUERY);
    expect(String(metadata.description ?? "")).toMatch(FLOODED_CAR_QUERY);
    expect(service?.h1).toBe("Sell a Damaged Car in Brisbane");
    expect(service?.title).not.toMatch(CASH_QUERY);
    expect(service?.title).not.toMatch(REMOVAL_QUERY);
    expect(String(metadata.openGraph?.title ?? "")).toMatch(
      FLOODED_CAR_QUERY,
    );
    expect(String(metadata.twitter?.title ?? "")).toMatch(
      FLOODED_CAR_QUERY,
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/damaged-cars-brisbane",
    );
    expect(floodSection?.supportLink).toEqual({
      href: "/blog/sell-flood-damaged-car-brisbane#document-the-water-exposure",
      label: "Review flood-damage safety, insurer, and sale steps",
    });
    const floodSectionMarkup = renderToStaticMarkup(
      <ServiceSectionContent section={floodSection!} />,
    );
    expect(floodSectionMarkup).toContain(
      'href="/blog/sell-flood-damaged-car-brisbane#document-the-water-exposure"',
    );
    expect(service?.updatedAt).toBe("2026-08-11");
    expect(service?.reviewedAt).toBe("2026-08-11");
  });

  it("assigns unregistered-car removal intent to one narrow service owner", async () => {
    const service = getServiceBySlug("unregistered-cars-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "unregistered-cars-brisbane" }),
    });
    const movementSection = service?.sections.find(
      ({ heading }) => heading === "Collection From Private Property",
    );
    const removalService = getServiceBySlug("car-removal-brisbane");
    const contextualInboundLink = removalService?.sections.find(
      ({ supportLink }) =>
        supportLink?.href === "/unregistered-cars-brisbane",
    );

    expect(service).toBeDefined();
    expect(serviceOwnersOf(UNREGISTERED_REMOVAL_QUERY)).toEqual([
      "unregistered-cars-brisbane",
    ]);
    expect(
      blogPosts
        .filter((post) =>
          [post.title, post.metaDescription].some((value) =>
            UNREGISTERED_REMOVAL_QUERY.test(value),
          ),
        )
        .map(({ slug }) => slug),
    ).toEqual([]);
    expect(service?.title).toMatch(UNREGISTERED_REMOVAL_QUERY);
    expect(service?.h1).toMatch(UNREGISTERED_REMOVAL_QUERY);
    expect(service?.metaDescription).toMatch(UNREGISTERED_REMOVAL_QUERY);
    expect(String(metadata.description ?? "")).toMatch(
      UNREGISTERED_REMOVAL_QUERY,
    );
    expect(String(metadata.openGraph?.title ?? "")).toMatch(
      UNREGISTERED_REMOVAL_QUERY,
    );
    expect(String(metadata.twitter?.title ?? "")).toMatch(
      UNREGISTERED_REMOVAL_QUERY,
    );
    expect(service?.title).not.toMatch(REMOVAL_QUERY);
    expect(service?.h1).not.toMatch(REMOVAL_QUERY);
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/unregistered-cars-brisbane",
    );
    expect(movementSection?.supportLink).toEqual({
      href: "/blog/park-unregistered-car-street-qld#moving-an-unregistered-vehicle-check-the-exact-journey",
      label: "Check Queensland movement rules for an unregistered vehicle",
    });
    expect(contextualInboundLink?.supportLink?.label).toBe(
      "Review unregistered-vehicle quote, document, and pickup requirements",
    );
    expect(
      renderToStaticMarkup(
        <ServiceSectionContent section={contextualInboundLink!} />,
      ),
    ).toContain('href="/unregistered-cars-brisbane"');
    expect(service?.updatedAt).toBe("2026-08-11");
    expect(service?.reviewedAt).toBe("2026-08-11");
  });

  it("assigns measured scrap-car removal intent to one narrow service owner", async () => {
    const service = getServiceBySlug("scrap-car-removal-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "scrap-car-removal-brisbane" }),
    });
    const collectionSection = service?.sections.find(
      ({ heading }) => heading === "Purchase and Collection Are Separate Checks",
    );

    expect(service).toBeDefined();
    expect(serviceOwnersOf(SCRAP_REMOVAL_QUERY)).toEqual([
      "scrap-car-removal-brisbane",
    ]);
    expect(
      blogPosts
        .filter((post) =>
          [post.title, post.metaDescription].some((value) =>
            SCRAP_REMOVAL_QUERY.test(value),
          ),
        )
        .map(({ slug }) => slug),
    ).toEqual([]);

    for (const value of [
      service?.title,
      service?.h1,
      service?.metaDescription,
    ]) {
      expect(value).toMatch(SCRAP_REMOVAL_QUERY);
      expect(value).not.toMatch(REMOVAL_QUERY);
    }

    expect(String(metadata.description ?? "")).toBe(service?.metaDescription);
    expect(String(metadata.openGraph?.title ?? "")).toBe(service?.title);
    expect(String(metadata.twitter?.title ?? "")).toBe(service?.title);
    expect(metadata.alternates?.canonical).toBe(
      "https://caraway.au/scrap-car-removal-brisbane",
    );
    expect(service?.serviceType).toBe(
      "End-of-life vehicle assessment and buying service",
    );
    expect(collectionSection?.supportLink).toEqual({
      href: "/car-removal-brisbane",
      label: "See Brisbane collection and access details",
    });
    expect(service?.relatedServices).toContain("car-removal-brisbane");
    expect(service?.updatedAt).toBe("2026-08-11");
    expect(service?.reviewedAt).toBeUndefined();
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
    const preferredImage = getServicePreferredImage(service!);
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: preferredImage?.src,
        alt: preferredImage?.alt,
      }),
    ]);
    expect(serviceOwnersOf(CASH_QUERY)).toEqual(["cash-for-cars-brisbane"]);
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
    const preferredImage = getServicePreferredImage(service!);
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: preferredImage?.src,
        alt: preferredImage?.alt,
      }),
    ]);
    expect(serviceOwnersOf(REMOVAL_QUERY)).toEqual(["car-removal-brisbane"]);
  });

  it("connects each primary WebPage, breadcrumb, and Service entity without unsupported rich-result claims", () => {
    for (const slug of ["cash-for-cars-brisbane", "car-removal-brisbane"]) {
      const service = getServiceBySlug(slug)!;
      const expectedUpdatedAt =
        slug === "car-removal-brisbane" ? "2026-08-11" : "2026-08-09";
      const canonical = `${SITE_URL}/${slug}`;
      const data = buildServiceStructuredData(service);
      const preferredImage = getServicePreferredImage(service)!;
      const absoluteImage = `${SITE_URL}${preferredImage.src}`;
      const breadcrumb = data[0] as Record<string, unknown>;
      const webPage = data[1] as Record<string, unknown>;
      const serviceEntity = data[2] as Record<string, unknown>;
      const serialized = JSON.stringify(data);

      expect(service.updatedAt).toBe(expectedUpdatedAt);
      expect(data.map((node) => node["@type"])).toEqual([
        "BreadcrumbList",
        "WebPage",
        "Service",
      ]);
      expect(breadcrumb).toMatchObject({
        "@id": `${canonical}#breadcrumbs`,
        numberOfItems: 3,
      });
      expect(breadcrumb.itemListElement).toEqual([
        expect.objectContaining({ position: 1, name: "Home", item: `${SITE_URL}/` }),
        expect.objectContaining({ position: 2, name: "Services", item: `${SITE_URL}/services` }),
        expect.objectContaining({ position: 3, name: service.h1, item: canonical }),
      ]);
      expect(webPage).toMatchObject({
        "@id": `${canonical}#webpage`,
        url: canonical,
        dateModified: service.updatedAt,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumbs` },
        mainEntity: { "@id": `${canonical}#service` },
        inLanguage: "en-AU",
        primaryImageOfPage: expect.objectContaining({
          "@type": "ImageObject",
          url: absoluteImage,
        }),
      });
      expect(serviceEntity).toMatchObject({
        "@id": `${canonical}#service`,
        url: canonical,
        serviceType: service.serviceType,
        image: absoluteImage,
      });
      expect(serialized).not.toMatch(/FAQPage|aggregateRating|"offers"|"address"/i);
    }
  });

  it("describes the removal target as purchase and collection rather than general towing", () => {
    const service = getServiceBySlug("car-removal-brisbane")!;
    const serviceEntity = buildServiceStructuredData(service)[2] as Record<
      string,
      unknown
    >;

    expect(service.serviceType).toBe(
      "Vehicle purchase and collection service",
    );
    expect(serviceEntity.serviceType).toBe(service.serviceType);
    expect(serviceEntity.serviceType).not.toBe("Vehicle removal service");
  });

  it("renders useful pre-quote and access checklists as semantic lists", () => {
    const cases = [
      ["cash-for-cars-brisbane", "How to Request a Cash-for-Cars Quote", 6, "approximate kilometres"],
      ["car-removal-brisbane", "Access Details to Confirm Before Booking", 5, "overhead clearance"],
    ] as const;

    for (const [slug, heading, count, distinctiveText] of cases) {
      const section = getServiceBySlug(slug)?.sections.find(
        (candidate) => candidate.heading === heading,
      );
      expect(section, slug).toBeDefined();
      expect(section?.checklistItems).toHaveLength(count);

      const markup = renderToStaticMarkup(
        <ServiceSectionContent section={section!} />,
      );
      expect(markup, slug).toContain("<ul");
      expect(markup.match(/<li/g), slug).toHaveLength(count);
      expect(markup, slug).toContain(distinctiveText);
    }
  });

  it("links removal logistics to the detailed towing and pickup guides", () => {
    const service = getServiceBySlug("car-removal-brisbane")!;
    const links = service.sections
      .map((section) => section.supportLink?.href)
      .filter(Boolean);

    expect(links).toContain(
      "/blog/tow-truck-cost-brisbane#when-a-vehicle-sale-can-include-pickup",
    );
    expect(links).toContain(
      "/blog/preparing-your-car-for-pickup#plates-rego-and-tow-truck-access",
    );
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
