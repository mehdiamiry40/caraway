import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Hero } from "@/components/sections/Hero";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return { ...actual, preload: vi.fn() };
});

describe("Hero assessment copy", () => {
  it("describes a requested human review rather than an instant estimate", () => {
    const markup = renderToStaticMarkup(<Hero />);

    expect(markup).toContain("Tell us about your car. It takes a few minutes.");
    expect(markup).toContain("A person reviews your car");
    expect(markup).toContain("Free towing included");
    expect(markup).toContain("Towing is free when we\n              buy".replace(/\s+/g, " "));
    expect(markup).not.toContain("Estimate from four details");
    expect(markup).not.toContain("Get an estimate in minutes");
  });
});
