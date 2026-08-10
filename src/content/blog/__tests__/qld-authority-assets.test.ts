import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildBlogPostSeoProps } from "@/app/blog/[slug]/metadata";
import { QldVehicleSaleRecordBuilder } from "@/components/blog/QldVehicleSaleRecordBuilder";
import { blogPosts } from "@/data/blog-posts";

describe("Queensland authority assets", () => {
  it("keeps the sale-record builder on the established paperwork guide", () => {
    const paperwork = blogPosts.find(
      (post) => post.slug === "what-paperwork-to-sell-a-car-qld",
    );

    expect(paperwork?.interactiveTool).toBe(
      "qld-vehicle-sale-record-builder",
    );
    expect(paperwork?.content.join(" ")).toContain(
      "printable two-copy handover record",
    );
    expect(paperwork?.content.join(" ")).toContain(
      "check whether a permit is required",
    );
    expect(paperwork?.content.join(" ")).toContain(
      "when NEVDIS data is available",
    );
    expect(paperwork?.content.join(" ")).toContain(
      "not a complete vehicle-history or ownership check",
    );
    expect(paperwork).toMatchObject({
      title: "Selling a Car in QLD: Paperwork & Seller Steps",
      metaDescription:
        "How to sell a car in QLD: compare registered transfers, cancellations and unregistered sales, then check certificates, TMR steps and seller records.",
      updatedAt: "2026-08-11",
      reviewedAt: "2026-08-11",
    });
    expect(paperwork?.content[0]).toMatch(/^Selling a car in Queensland/);
    expect(paperwork?.content.join(" ")).toContain(
      "For a registered transfer, TMR recommends that every seller complete Part B of the Vehicle Registration Transfer Application (F3520)",
    );
    expect(paperwork?.content.join(" ")).toContain(
      "have the buyer sign it on the day of sale, even if they intend to transfer the registration online",
    );
    expect(paperwork?.content).toContain(
      "## Seller-side transfer notification — a step many sellers miss",
    );
    expect(paperwork?.content.join(" ")).not.toContain("Disposal notice");
    expect(paperwork?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/buying/rules/selling",
        "https://www.qld.gov.au/transport/registration/transfer/rego",
        "https://www.qld.gov.au/transport/buying/unregistered/uvp",
      ]),
    );
  });

  it("server-renders the stable builder anchor and keeps BlogPosting schema", () => {
    const markup = renderToStaticMarkup(
      createElement(QldVehicleSaleRecordBuilder),
    );
    expect(markup).toContain('id="qld-vehicle-sale-record-builder"');
    expect(markup).toContain("Private, local-only tool");
    expect(markup).toContain("not submitted to Caraway");

    const paperwork = blogPosts.find(
      (post) => post.slug === "what-paperwork-to-sell-a-car-qld",
    );
    expect(paperwork).toBeDefined();
    if (!paperwork) return;

    const { articleSchema } = buildBlogPostSeoProps(paperwork);
    expect(articleSchema["@type"]).toBe("BlogPosting");
    expect(JSON.stringify(articleSchema)).not.toMatch(
      /Calculator|FAQPage|Product/,
    );
  });

  it("source-reviews the unregistered-street-parking guidance", () => {
    const parking = blogPosts.find(
      (post) => post.slug === "park-unregistered-car-street-qld",
    );
    const content = parking?.content.join(" ") ?? "";

    expect(parking?.reviewedAt).toBe("2026-08-07");
    expect(parking?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/buying/unregistered/uvp",
        "https://www.brisbane.qld.gov.au/transport-and-parking/parking/illegally-parked-and-unmanaged-vehicles",
        "https://www.brisbane.qld.gov.au/content/dam/brisbanecitycouncil/corpwebsite/laws-and-permits-/documents/health-safety-and-amenity-local-law-2021.pdf",
      ]),
    );
    expect(parking?.sources?.map((source) => source.url)).not.toContain(
      "https://www.qld.gov.au/transport/safety/rules/road/report/abandoned-vehicle",
    );
    expect(content).toContain(
      "Brisbane City Council says its Health, Safety and Amenity Local Law 2021",
    );
    expect(content).toContain("There is not one permit rule for every journey");
    expect(content).toContain("must be transported");
    expect(content).not.toContain("There are two legitimate ways");
    expect(content).not.toContain("Queensland Government says it is an offence");
    expect(content).not.toMatch(/demerit points/i);
  });
});
