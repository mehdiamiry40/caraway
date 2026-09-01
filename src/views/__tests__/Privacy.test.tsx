import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LEGAL_DATE_ISO } from "@/lib/site";
import Privacy from "@/views/Privacy";

vi.mock("next/navigation", () => ({
  usePathname: () => "/privacy",
}));

describe("Privacy review-request disclosure", () => {
  it("documents a neutral invitation for eligible completed customers", () => {
    const markup = renderToStaticMarkup(<Privacy />).toLowerCase();

    expect(LEGAL_DATE_ISO.privacyLastUpdated).toBe("2026-09-01");
    expect(markup).toContain("eligible completed customers");
    expect(markup).toContain("share honest feedback");
    expect(markup).toContain("do not condition the invitation on satisfaction");
    expect(markup).toContain("or ask for a particular rating");
    expect(markup).not.toContain("confirm you were satisfied");
  });

  it("explains AI chat data flows and the store:false limitation", () => {
    const markup = renderToStaticMarkup(<Privacy />).toLowerCase();

    expect(markup).toContain("ai chat processing");
    expect(markup).toContain("vercel ai gateway to openai");
    expect(markup).toContain("pseudonymous, 32-character identifier");
    expect(markup).toContain("ip address and browser user-agent string");
    expect(markup).toContain("store: false");
    expect(markup).toContain("does not stop the providers from processing");
    expect(markup).toContain("outside australia");
    expect(markup).toContain("speed insights");
    expect(markup).toContain("core web vitals");
    expect(markup).toContain("do not put names, phone numbers, addresses");
    expect(markup).toContain("registration numbers, vins, identity-document details");
  });
});
