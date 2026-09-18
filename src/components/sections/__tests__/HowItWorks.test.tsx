// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { services } from "@/data/services";

afterEach(cleanup);

describe("HowItWorks internal links", () => {
  it("links the homepage process summary to the full process guide", () => {
    render(<HowItWorks />);

    expect(
      screen.getByRole("link", {
        name: /read the full quote, pickup and payment process/i,
      }),
    ).toHaveAttribute("href", "/how-it-works");
  });

  it("does not self-link when embedded on the full process page", () => {
    render(<HowItWorks showHeader={false} />);

    expect(
      screen.queryByRole("link", {
        name: /read the full quote, pickup and payment process/i,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start your quote/i })).toHaveAttribute(
      "href",
      "/#quote-form",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Tell us about your car" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Tell us about your car" }),
    ).not.toBeInTheDocument();
  });

  it.each(["cash-for-cars-brisbane", "car-removal-brisbane"])(
    "links the %s service body to the full process guide",
    (slug) => {
      const service = services.find((candidate) => candidate.slug === slug);

      expect(service).toBeDefined();
      expect(
        service?.sections.some(
          (section) => section.supportLink?.href === "/how-it-works",
        ),
      ).toBe(true);
    },
  );
});
