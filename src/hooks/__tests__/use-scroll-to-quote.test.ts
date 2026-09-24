// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { findQuoteTarget } from "@/hooks/use-scroll-to-quote";

describe("findQuoteTarget", () => {
  it("finds the quote form used by the homepage, service and suburb pages", () => {
    const form = document.createElement("section");
    form.id = "quote-form";
    document.body.append(form);

    expect(findQuoteTarget()).toBe(form);

    document.body.replaceChildren();
  });

  it("falls back to a legacy quote section id", () => {
    const section = document.createElement("section");
    section.id = "quote-section";
    document.body.append(section);

    expect(findQuoteTarget()).toBe(section);

    document.body.replaceChildren();
  });

  it("returns null when no quote target exists", () => {
    const getElementById = vi.fn().mockReturnValue(null);

    expect(findQuoteTarget({ getElementById })).toBeNull();
    expect(getElementById).toHaveBeenCalledTimes(2);
  });
});
