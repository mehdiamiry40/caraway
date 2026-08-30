import { describe, expect, it } from "vitest";
import { buildSuburbStructuredData } from "@/app/locations/[slug]/page";
import { suburbs } from "@/data/suburbs";
import { CONTENT_DEPLOY_DATE, SITE_URL } from "@/lib/site";

describe("location structured data", () => {
  it("connects every location WebPage to its breadcrumb and Service entities", () => {
    for (const suburb of suburbs) {
      const canonical = `${SITE_URL}/locations/${suburb.slug}`;
      const nodes = buildSuburbStructuredData(suburb);
      const webPage = nodes.find((node) => node["@type"] === "WebPage");
      const service = nodes.find((node) => node["@type"] === "Service");

      expect(nodes.map((node) => node["@type"])).toEqual([
        "BreadcrumbList",
        "WebPage",
        "Service",
      ]);
      expect(webPage).toMatchObject({
        "@id": `${canonical}#webpage`,
        url: canonical,
        breadcrumb: { "@id": `${canonical}#breadcrumbs` },
        mainEntity: { "@id": `${canonical}#service` },
        dateModified: suburb.updatedAt ?? CONTENT_DEPLOY_DATE,
        primaryImageOfPage: {
          "@id": `${canonical}#primaryimage`,
          url: `${SITE_URL}/images/tow-truck-hero.webp`,
        },
      });
      expect(service).toMatchObject({
        "@id": `${canonical}#service`,
        url: canonical,
        provider: { "@id": `${SITE_URL}/#organization` },
      });
    }
  });
});
