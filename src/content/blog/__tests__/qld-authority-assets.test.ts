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
      title: "Selling a Car in QLD: Paperwork & Documents Checklist",
      metaDescription:
        "Selling a car in QLD? Paperwork to gather before and on sale day: authority to sell, safety and gas certificates, finance payout and a signed sale record.",
    });
    // A rewrite must be reviewed in the same pass: the review date covers the
    // modification date rather than trailing it.
    expect(paperwork?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(paperwork?.reviewedAt).toBe(paperwork?.updatedAt);
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
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
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

  it("keeps the dedicated transfer guide aligned with current F3520 advice", () => {
    const transfer = blogPosts.find(
      (post) => post.slug === "how-to-transfer-car-ownership-qld",
    );
    const content = transfer?.content.join(" ") ?? "";

    expect(transfer?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(transfer?.reviewedAt).toBe(transfer?.updatedAt);
    expect(content).toContain(
      "Even if the seller intends to transfer the registration online, TMR recommends that every seller complete Part B of the Vehicle Registration Transfer Application (F3520)",
    );
    expect(content).toContain("have the buyer sign it on the day of sale");
    expect(content).toContain(
      "For an in-person transfer, both parties sign F3520, the buyer lodges Part A, and the seller keeps Part B",
    );
    // TMR split its transfer guidance into a seller page and a buyer page;
    // the guide cites both rather than the hub the old URLs now redirect to.
    expect(transfer?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/transfer/buyer-transfer",
      ]),
    );
  });

  it("keeps the late-transfer guide to what TMR's seller and fine pages say", () => {
    const late = blogPosts.find(
      (post) => post.slug === "buyer-not-transferred-rego-qld",
    );
    const text = [
      ...(late?.content ?? []),
      ...(late?.faqs ?? []).map((faq) => faq.answer),
    ].join(" ");

    // Corrected and re-reviewed in the same pass.
    expect(late?.reviewedAt).toBe(late?.updatedAt);
    expect(text).toContain(
      "TMR says the seller should lodge Part B in person or transfer the registration online",
    );
    // The seller page no longer offers email or post for Part B, and sends
    // sellers to My registrations or 13 74 68 to check the record.
    expect(text).not.toMatch(/by email|by post|email, post/i);
    expect(text).not.toContain("13 23 80");
    expect(text).toContain("13 74 68");
    // The fine page is about a sale before the offence, inside 28 days.
    expect(text).toContain("sold or disposed of before the offence");
    expect(text).not.toMatch(/before the fine was issued/i);
    expect(text).toContain("State Penalties Enforcement Registry");
    expect(late?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/transfer/buyer-transfer",
        "https://www.legislation.qld.gov.au/view/whole/html/inforce/current/sl-2021-0113",
      ]),
    );
  });

  it("does not state a joint-signature rule TMR's transfer pages do not contain", () => {
    const joint = blogPosts.find(
      (post) => post.slug === "car-registered-two-names-qld",
    );
    const text = [
      joint?.metaDescription ?? "",
      joint?.excerpt ?? "",
      ...(joint?.content ?? []),
      ...(joint?.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
    ].join(" ");

    expect(joint?.reviewedAt).toBe(joint?.updatedAt);
    // Neither the seller page nor the buyer page says how many registered
    // operators sign, so the guide sends the reader to the form and to TMR
    // instead of asserting a rule in either direction.
    expect(text).not.toMatch(
      /two (?:disposer )?signatures|disposer or disposers|needs both of them on the form|every registered operator on the transfer/i,
    );
    expect(text).toContain("how a jointly registered vehicle is signed for");
    expect(text).toContain(
      "transferred free of charge into the name of the surviving registered operator",
    );
    expect(joint?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/transfer/buyer-transfer",
        "https://www.qld.gov.au/transport/registration/certificate",
        "https://www.qld.gov.au/transport/registration/transfer/deceased-estate",
      ]),
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

  it("keeps recovered-stolen-vehicle guidance qualified and source-backed", () => {
    const recovered = blogPosts.find(
      (post) => post.slug === "stolen-car-recovered-qld",
    );
    const content = recovered?.content.join(" ") ?? "";

    expect(recovered?.reviewedAt).toBe("2026-08-13");
    expect(recovered?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.police.qld.gov.au/stolen-vehicles",
        "https://www.police.qld.gov.au/initiatives/towing-motor-vehicles-scheme",
        "https://www.police.qld.gov.au/initiatives/towing-of-motor-vehicles-scheme/towing-of-motor-vehicles-scheme-faqs",
        "https://www.police.qld.gov.au/initiatives/towing-motor-vehicles-scheme/towing-reimbursement-form",
        "https://www.qld.gov.au/transport/vehicle-safety/written-off-vehicles/how-scheme-works",
        "https://www.ppsr.gov.au/searching/do-used-car-or-vehicle-search/concerned-used-car-search-result",
      ]),
    );
    expect(content).toContain(
      "do not place every insurer-assessed loss on the written-off vehicle register",
    );
    expect(content).toContain(
      "If a search still reports the vehicle as stolen after recovery",
    );
    expect(content).toContain(
      "does not cover storage after two business days following release",
    );
    expect(content).toContain(
      "remain active, meaning it has not been withdrawn",
    );
    expect(content).not.toMatch(/Most turn up|almost none/i);
    expect(content).not.toMatch(/rarely comes back the way it left/i);
    expect(content).not.toContain("Toowong car park");
    expect(content).not.toContain(
      "A stolen car recovered in poor shape starts costing money the day",
    );
  });

  it("keeps the number-plate guide to the plate forms TMR's seller page lists", () => {
    const plates = blogPosts.find(
      (post) => post.slug === "number-plates-when-selling-car-qld",
    );
    const text = [
      ...(plates?.content ?? []),
      ...(plates?.faqs ?? []).map((faq) => faq.answer),
    ].join(" ");
    const sourceUrls = plates?.sources?.map((source) => source.url) ?? [];

    // Corrected and re-reviewed in the same pass.
    expect(plates?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(plates?.reviewedAt).toBe(plates?.updatedAt);
    // The seller page no longer lists plate situations the online service
    // cannot handle. It names a form for each choice instead.
    expect(text).not.toMatch(/cannot be handled online/i);
    expect(text).toContain("Personalised Number Plate Transfer Application (F2963)");
    expect(text).toContain(
      "Remove and/or Attach Personalised/Customised Number Plate Application (F2964)",
    );
    expect(text).toContain(
      "Cancel Personalised/Customised Number Plate Application (F5339)",
    );
    expect(text).toContain(
      "standard number plates must be attached before the registration transfer can be processed",
    );
    // Customised plates cannot be sold; left on the vehicle they become
    // standard plates when it is transferred.
    expect(text).toContain(
      "Customised plates left on the vehicle become standard plates when it is transferred",
    );
    expect(sourceUrls).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/numberplate/customised-plates/about",
        "https://www.qld.gov.au/transport/registration/numberplate/personalised-plates/buying",
        "https://www.qld.gov.au/transport/registration/cancel",
      ]),
    );
    // The number plate page above those two is a list of links, so it backs
    // none of the statements in the guide.
    expect(sourceUrls).not.toContain(
      "https://www.qld.gov.au/transport/registration/numberplate",
    );
  });

  it("keeps the unpaid-tolls guide in step with TMR's seller transfer steps", () => {
    const tolls = blogPosts.find(
      (post) => post.slug === "unpaid-tolls-selling-car-qld",
    );
    const text = [
      ...(tolls?.content ?? []),
      ...(tolls?.faqs ?? []).map((faq) => faq.answer),
    ].join(" ");

    // The seller transfers the registration out of their own name. The record
    // does not have to wait for the buyer to finish.
    expect(text).not.toContain(
      "until they do, the vehicle is still recorded against you",
    );
    expect(text).toContain(
      "Transport and Main Roads recommends that the seller help by transferring it out of their own name",
    );
    expect(text).toContain("Until the registration has left your name");
    // TMR's first seller step is taking the registration off direct debit,
    // before the transfer is started.
    const directDebit = text.indexOf("Take the registration off direct debit");
    const transfer = text.indexOf("Complete your side of the TMR transfer");
    expect(directDebit).toBeGreaterThan(-1);
    expect(transfer).toBeGreaterThan(directDebit);
    expect(text).toContain("before you start the transfer");
    expect(tolls?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/buying/rules/selling",
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/transfer/buyer-transfer",
      ]),
    );
  });

  it("keeps the sale-options guide to the current safety certificate rule", () => {
    const options = blogPosts.find(
      (post) => post.slug === "how-to-sell-your-car-for-cash-brisbane",
    );
    const text = [
      ...(options?.content ?? []),
      ...(options?.faqs ?? []).map((faq) => faq.answer),
    ].join(" ");

    // Corrected and re-reviewed in the same pass.
    expect(options?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(options?.reviewedAt).toBe(options?.updatedAt);
    // A certificate is no longer needed to offer a registered vehicle for
    // sale, so how the vehicle is offered does not decide the answer. It is
    // needed before disposing of one, other than to a dealer.
    expect(text).not.toMatch(/how the vehicle is offered/i);
    expect(text).toContain(
      "no longer requires a safety certificate before a registered vehicle is offered for sale",
    );
    expect(text).toContain(
      "before disposing of a registered vehicle other than to a licensed motor dealer",
    );
    expect(options?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/transfer/seller-transfer",
        "https://www.qld.gov.au/transport/registration/roadworthy",
      ]),
    );
  });

  it("keeps the lost-papers guide to what TMR's certificate and plate pages say", () => {
    const lost = blogPosts.find((post) => post.slug === "lost-rego-papers-qld");
    const text = [
      ...(lost?.content ?? []),
      ...(lost?.faqs ?? []).map((faq) => faq.answer),
    ].join(" ");

    // Corrected and re-reviewed in the same pass.
    expect(lost?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(lost?.reviewedAt).toBe(lost?.updatedAt);
    // The plate pages ask for the replacement application, evidence of
    // identity and an explanation on the form. They ask for a police reference
    // only where plates were copied, not where they were lost or stolen.
    expect(text).not.toMatch(/report reference|Policelink/i);
    expect(text).toContain(
      "explain on the form what happened to any you cannot hand over",
    );
    // The certificate service asks for the registration number and the
    // operator's licence number or customer reference number, and says it
    // takes two to five minutes.
    expect(text).toContain(
      "Queensland driver licence number or customer reference number, name and date of birth",
    );
    expect(text).not.toMatch(/the two minutes/i);
    // The form is required in person and only recommended for an online
    // transfer, so the transfer does not simply "run on" it.
    expect(text).not.toMatch(/the transfer runs on/i);
    expect(lost?.sources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.qld.gov.au/transport/registration/certificate",
        "https://www.qld.gov.au/transport/registration/numberplate/how-to-replace",
        "https://www.qld.gov.au/transport/registration/numberplate/when-to-replace",
        "https://www.qld.gov.au/transport/registration/numberplate/free-replacement",
      ]),
    );
  });
});
