// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { findQuoteTarget } from "@/hooks/use-scroll-to-quote";

describe("findQuoteTarget", () => {
  it("prefers the homepage estimator when it is present", () => {
    const estimator = document.createElement("section");
    estimator.id = "price-estimator";
    const form = document.createElement("section");
    form.id = "quote-form";
    document.body.append(estimator, form);

    expect(findQuoteTarget()).toBe(estimator);

    document.body.replaceChildren();
  });

  it("finds the embedded quote form used by service and suburb pages", () => {
    const form = document.createElement("section");
    form.id = "quote-form";
    document.body.append(form);

    expect(findQuoteTarget()).toBe(form);

    document.body.replaceChildren();
  });

  it("returns null when no quote target exists", () => {
    const getElementById = vi.fn().mockReturnValue(null);

    expect(findQuoteTarget({ getElementById })).toBeNull();
    expect(getElementById).toHaveBeenCalledTimes(3);
  });
});
