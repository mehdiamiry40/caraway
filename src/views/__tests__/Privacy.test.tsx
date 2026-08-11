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

    expect(LEGAL_DATE_ISO.privacyLastUpdated).toBe("2026-08-11");
    expect(markup).toContain("eligible completed customers");
    expect(markup).toContain("share honest feedback");
    expect(markup).toContain("do not condition the invitation on satisfaction");
    expect(markup).toContain("or ask for a particular rating");
    expect(markup).not.toContain("confirm you were satisfied");
  });
});
