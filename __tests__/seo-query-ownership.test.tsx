import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { metadata as homeMetadata, homeStructuredData } from "@/app/page";
import { metadata as locationsMetadata } from "@/app/locations/page";
import { metadata as faqMetadata } from "@/app/faq/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as blogMetadata } from "@/app/blog/page";
import { generateMetadata as generateBlogPageMetadata } from "@/app/blog/page/[page]/page";
import {
  buildBlogPostSeoProps,
  generateMetadata as generateBlogPostMetadata,
} from "@/app/blog/[slug]/metadata";
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
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HomeCashForCars } from "@/components/sections/HomeCashForCars";
import { ServiceSectionContent } from "@/components/templates/ServicePageTemplate";
import { blogPosts } from "@/data/blog-posts";
import {
  getServiceBySlug,
  getServicePreferredImage,
  services,
} from "@/data/services";
import { homeCashSections, homeVehicleLinks } from "@/data/home-content";
import { FOOTER_INTERNAL_RESOURCES } from "@/data/resource-links";
import { suburbs } from "@/data/suburbs";
import { RETIRED_SERVICE_DESTINATIONS } from "@/lib/service-consolidation";
import { BUSINESS, HOME_CONTENT_UPDATED, SITE_URL } from "@/lib/site";

// Head-term ownership map, locked 28 November 2026. "cash for cars Brisbane"
// belongs to another site in the portfolio, so no Caraway page may lead with
// it. Caraway's own head term is "sell my car Brisbane", owned by
// /sell-my-car-brisbane; the homepage supports it with the written-offer
// differentiator.
const CASH_QUERY = /cash[- ]for[- ]cars brisbane/i;
const SELL_MY_CAR_QUERY = /sell my car brisbane/i;
const SELL_MY_CAR_OWNER = "/sell-my-car-brisbane";
const REMOVAL_QUERY = /car removal brisbane/i;
const OLD_UTE_QUERY = /cash for old utes/i;
const FLOODED_CAR_QUERY = /cash for (?:flooded|flood[- ]damaged) cars?/i;
const UNREGISTERED_REMOVAL_QUERY = /unregistered car removal/i;
const SCRAP_REMOVAL_QUERY = /scrap car removals?(?: in)? brisbane/i;
const QLD_SELLER_QUERY =
  /^(?:selling|how to sell) (?:a )?(?:car|vehicle)(?: in)? (?:qld|queensland)\b/i;

function serviceOwnersOf(query: RegExp): string[] {
  return services
    .filter((service) =>
      [service.title, service.h1, service.metaDescription].some((value) =>
        query.test(value),
      ),
    )
    .map((service) => service.slug);
}

interface InternalLink {
  source: string;
  label: string;
  href: string;
}

function textOf(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Internal anchors in server-rendered markup, as visible label and href. */
function anchorsIn(markup: string, source: string): InternalLink[] {
  return [...markup.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (match) => ({ source, href: match[1]!, label: textOf(match[2]!) }),
  );
}

/** Markdown links to internal paths anywhere in a content record. */
function markdownLinksIn(record: unknown, source: string): InternalLink[] {
  return [
    ...JSON.stringify(record).matchAll(/\[([^\]]+)\]\((\/[^)\s]*)\)/g),
  ].map((match) => ({ source, label: match[1]!, href: match[2]! }));
}

/**
 * Every internal link whose anchor text is authored in content data or in the
 * shared homepage and footer components. Anchor text is an ownership signal,
 * so both head-term rules are checked against this one list.
 */
function authoredInternalLinks(): InternalLink[] {
  return [
    ...anchorsIn(renderToStaticMarkup(<Hero />), "home hero"),
    ...anchorsIn(renderToStaticMarkup(<HomeCashForCars />), "home explainer"),
    ...anchorsIn(renderToStaticMarkup(<Footer />), "footer"),
    ...homeVehicleLinks.map((link) => ({ source: "home specialist pages", ...link })),
    ...FOOTER_INTERNAL_RESOURCES.map((link) => ({
      source: "internal resources",
      ...link,
    })),
    ...services.flatMap((service) => [
      ...service.sections.flatMap((section) =>
        section.supportLink
          ? [{ source: `service/${service.slug}`, ...section.supportLink }]
          : [],
      ),
      ...markdownLinksIn(service, `service/${service.slug}`),
    ]),
    ...suburbs.flatMap((suburb) => [
      ...(suburb.internalLinks ?? []).map((link) => ({
        source: `location/${suburb.slug}`,
        ...link,
      })),
      ...markdownLinksIn(suburb, `location/${suburb.slug}`),
    ]),
    ...blogPosts.flatMap((post) => markdownLinksIn(post, `blog/${post.slug}`)),
  ];
}

/**
 * Realigning a page's query ownership must record an honest modification date,
 * and anything carrying regulated claims must be reviewed in the same pass.
 *
 * The specific calendar day is incidental to that rule, so assert the rule.
 * Pinning the literal date only guarantees this file needs editing the next
 * time the page legitimately changes.
 */
function expectHonestOwnershipDates(entity: {
  updatedAt?: string;
  reviewedAt?: string;
}) {
  expect(entity.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(Number.isNaN(Date.parse(entity.updatedAt!))).toBe(false);
  expect(entity.updatedAt! <= new Date().toISOString().slice(0, 10)).toBe(true);
  if (entity.reviewedAt !== undefined) {
    expect(entity.reviewedAt).toBe(entity.updatedAt);
  }
}

describe("primary SEO query ownership", () => {
  it("leads the homepage with the written-offer differentiator, not cash for cars Brisbane", () => {
    const title = (homeMetadata.title as { absolute: string }).absolute;
    const openGraphTitle = String(homeMetadata.openGraph?.title ?? "");
    const twitterTitle = String(homeMetadata.twitter?.title ?? "");
    const description = String(homeMetadata.description ?? "");
    const hero = renderToStaticMarkup(<Hero />);
    const h1 = textOf(hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
    const [webPage, service] = homeStructuredData;
    const webPageName = String(webPage?.name ?? "");

    expect(title).toBe(
      "Written Offer to Sell Your Car in Brisbane | Pickup Included | Caraway",
    );
    expect(openGraphTitle).toBe(title);
    expect(twitterTitle).toBe(title);
    expect(h1).toBe(
      "A Written Offer to Sell Your Car in Brisbane, without the runaround.",
    );
    expect(webPageName).toBe(
      "Written Offer to Sell Your Car in Brisbane | Caraway",
    );

    // The title, H1, and schema name all lead with the differentiator and
    // stay clear of both exact head terms: the one Caraway does not own, and
    // the one its own service page owns.
    for (const value of [title, h1, webPageName]) {
      expect(value).toMatch(/^(?:A )?Written Offer to Sell Your Car in Brisbane/);
      expect(value).not.toMatch(CASH_QUERY);
      expect(value).not.toMatch(SELL_MY_CAR_QUERY);
    }

    // Nothing the homepage publishes about itself claims the exact query.
    for (const value of [
      description,
      String(homeMetadata.openGraph?.description ?? ""),
      String(webPage?.description ?? ""),
      String(service?.name ?? ""),
    ]) {
      expect(value).not.toBe("");
      expect(value).not.toMatch(CASH_QUERY);
    }

    // The description carries the remaining on-site differentiators.
    expect(description).toMatch(/human-reviewed written offer/i);
    expect(description).toMatch(/running or not/i);
    expect(description).toMatch(/pickup is included when we buy/i);
    expect(description).toContain(BUSINESS.phoneDisplay);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(homeMetadata.keywords).toBeUndefined();
    // Ownership is expressed through titles and links only. The homepage's
    // self-canonical is rendered in the page JSX (see src/app/page.tsx), so
    // its metadata must not introduce a canonical pointing anywhere else.
    expect(homeMetadata.alternates).toBeUndefined();

    // The retitle is a real modification, recorded on the page and no
    // earlier than the day the ownership map was locked.
    expect(HOME_CONTENT_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(HOME_CONTENT_UPDATED >= "2026-11-28").toBe(true);
    expect(webPage?.dateModified).toBe(HOME_CONTENT_UPDATED);

    // No service page competes for the exact cash query either, and the
    // retired exact-match service URL still folds into the homepage in one hop.
    expect(serviceOwnersOf(CASH_QUERY)).toEqual([]);
    expect(getServiceBySlug("cash-for-cars-brisbane")).toBeUndefined();
    expect(RETIRED_SERVICE_DESTINATIONS["cash-for-cars-brisbane"]).toBe("/");
  });

  it("keeps /sell-my-car-brisbane as the single owner of sell my car Brisbane", async () => {
    const service = getServiceBySlug("sell-my-car-brisbane");
    const metadata = await generateServiceMetadata({
      params: Promise.resolve({ slug: "sell-my-car-brisbane" }),
    });
    const homeTitle = (homeMetadata.title as { absolute: string }).absolute;

    expect(service).toBeDefined();
    // The root layout's title template appends " | Caraway".
    expect(service?.title).toBe(
      "Sell My Car Brisbane | Direct Vehicle-Buyer Quote",
    );
    expect(service?.h1).toMatch(/^Sell My Car Brisbane\b/);
    expect(metadata.title).toBe(service?.title);
    expect(String(metadata.openGraph?.title ?? "")).toBe(service?.title);
    expect(String(metadata.twitter?.title ?? "")).toBe(service?.title);
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}${SELL_MY_CAR_OWNER}`,
    );

    expect(serviceOwnersOf(SELL_MY_CAR_QUERY)).toEqual([
      "sell-my-car-brisbane",
    ]);
    expect(homeTitle).not.toContain(service!.title);

    for (const suburb of suburbs) {
      for (const value of [suburb.title, suburb.h1, suburb.metaDescription]) {
        expect(value, suburb.slug).not.toMatch(SELL_MY_CAR_QUERY);
      }
    }
    for (const post of blogPosts) {
      expect(post.title, post.slug).not.toMatch(SELL_MY_CAR_QUERY);
    }
  });

  it("does not present any page as the owner of cash for cars Brisbane in link text", () => {
    const links = authoredInternalLinks();

    // Guard the collector itself: an empty list would pass vacuously.
    expect(links.length).toBeGreaterThan(100);
    expect(links.some(({ source }) => source === "footer")).toBe(true);
    expect(links.some(({ source }) => source.startsWith("blog/"))).toBe(true);

    expect(
      links.filter(({ label }) => CASH_QUERY.test(label)),
    ).toEqual([]);

    // The explainer's label under its heading is not a link, but it is the
    // most prominent homepage text after the H1.
    expect(textOf(renderToStaticMarkup(<HomeCashForCars />))).not.toMatch(
      CASH_QUERY,
    );
  });

  it("points sell my car Brisbane link text at its owner page", () => {
    const links = authoredInternalLinks();
    const sellMyCarLinks = links.filter(({ label }) =>
      SELL_MY_CAR_QUERY.test(label),
    );

    expect(
      sellMyCarLinks.filter(({ href }) => href !== SELL_MY_CAR_OWNER),
    ).toEqual([]);

    // The homepage, the footer on every page, and the supporting service,
    // location, and blog pages all send the exact anchor to the owner.
    const sources = new Set(sellMyCarLinks.map(({ source }) => source));
    for (const source of [
      "home specialist pages",
      "footer",
      "service/sell-toyota-hilux-brisbane",
      "location/toowong",
      "location/logan",
    ]) {
      expect(sources, source).toContain(source);
    }
    expect([...sources].some((source) => source.startsWith("blog/"))).toBe(
      true,
    );

    // Every location page reaches the owner, through its related services or
    // through an explicit link where it has no such related service.
    for (const suburb of suburbs) {
      const hrefs = [
        ...suburb.relatedServices.map((slug) => `/${slug}`),
        ...(suburb.internalLinks ?? []).map(({ href }) => href),
      ];
      expect(hrefs, suburb.slug).toContain(SELL_MY_CAR_OWNER);
    }
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
      "[cash-for-cars buyer in Brisbane](/)",
    );
    expect(post?.relatedServices).toContain("sell-my-car-brisbane");
    expectHonestOwnershipDates(post!);
  });

  it("assigns generic Queensland seller intent to the established paperwork guide", async () => {
    const owners = blogPosts.filter((post) =>
      [post.title, post.metaDescription].some((value) =>
        QLD_SELLER_QUERY.test(value),
      ),
    );
    const post = owners[0];

    expect(owners.map(({ slug }) => slug)).toEqual([
      "what-paperwork-to-sell-a-car-qld",
    ]);
    expect(post).toBeDefined();
    if (!post) return;

    const metadata = await generateBlogPostMetadata({
      params: Promise.resolve({ slug: post.slug }),
    });
    const { articleSchema } = buildBlogPostSeoProps(post);

    expect(post.title).toBe(
      "Selling a Car in QLD: Paperwork & Documents Checklist",
    );
    expect(post.metaDescription).toBe(
      "Selling a car in QLD? Paperwork to gather before and on sale day: authority to sell, safety and gas certificates, finance payout and a signed sale record.",
    );
    expect(post.content[0]).toMatch(/^Selling a car in Queensland/);
    expect(post.title).not.toMatch(CASH_QUERY);
    expect(post.title).not.toMatch(REMOVAL_QUERY);
    expect(post.metaDescription).not.toMatch(CASH_QUERY);
    expect(post.metaDescription).not.toMatch(REMOVAL_QUERY);
    expect(metadata).toMatchObject({
      title: post.title,
      description: post.metaDescription,
      alternates: { canonical: post.canonicalUrl },
      openGraph: {
        url: post.canonicalUrl,
        title: post.title,
        description: post.metaDescription,
        modifiedTime: post.updatedAt,
      },
      twitter: {
        title: post.title,
        description: post.metaDescription,
      },
    });
    expect(articleSchema).toMatchObject({
      headline: post.title,
      description: post.metaDescription,
      dateModified: post.updatedAt,
      citation: expect.arrayContaining([
        "https://www.qld.gov.au/transport/buying/rules/selling",
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
      ]),
    });
    expectHonestOwnershipDates(post);
    expect(post.interactiveTool).toBe("qld-vehicle-sale-record-builder");
    expect(post.content.join(" ")).toContain(
      "[cash-for-cars buyer in Brisbane](/)",
    );
    expect(post.content.join(" ")).toContain(
      "[included-pickup terms](/car-removal-brisbane)",
    );
    expect(post.relatedServices).toEqual(
      expect.arrayContaining([
        "sell-my-car-brisbane",
        "car-removal-brisbane",
      ]),
    );
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
    expectHonestOwnershipDates(service!);
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
    expectHonestOwnershipDates(service!);
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
    expectHonestOwnershipDates(service!);
    expect(service?.reviewedAt).toBeUndefined();
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
    for (const slug of ["car-removal-brisbane"]) {
      const service = getServiceBySlug(slug)!;
      const expectedUpdatedAt = "2026-10-18";
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

  it("links the homepage and removal page to the canonical Queensland paperwork checklist", () => {
    const expected =
      "/blog/what-paperwork-to-sell-a-car-qld#at-a-glance-queensland-seller-paperwork-checklist";

    expect(
      homeCashSections.map((section) => section.supportLink?.href),
    ).toContain(expected);

    for (const slug of ["car-removal-brisbane"]) {
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

  it("links the removal page to the three-quote comparison worksheet", () => {
    const expected =
      "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#compare-three-vehicle-buyer-quotes";

    for (const slug of ["car-removal-brisbane"]) {
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
