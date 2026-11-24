// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { Logo } from "@/components/layout/Logo";
import { LogoArtwork } from "@/components/layout/LogoArtwork";
import { LOGO_WORDMARK_PATH } from "@/components/layout/logo-paths";

afterEach(cleanup);

function artworkTarget(link: HTMLElement) {
  const href = link.querySelector("svg use")?.getAttribute("href");
  if (!href?.startsWith("#")) {
    throw new Error("The logo does not point at the shared artwork.");
  }
  return document.getElementById(href.slice(1));
}

describe("Logo", () => {
  it("is a named link to the home page even though its lettering is outlines", () => {
    render(<Logo />);

    const link = screen.getByRole("link", { name: "Caraway Cash for Cars" });
    expect(link).toHaveAttribute("href", "/");
    // The name comes from the link, so the drawing must stay out of the
    // accessibility tree or it is announced as an unnamed graphic.
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(link).toHaveTextContent("");
  });

  it("points at the artwork the layout draws, and that artwork holds the wordmark", () => {
    render(
      <>
        <LogoArtwork />
        <Logo />
      </>,
    );

    const artwork = artworkTarget(screen.getByRole("link"));
    expect(artwork).not.toBeNull();
    // The wordmark follows the colour of whichever logo uses it.
    expect(
      artwork?.querySelector(`path[d="${LOGO_WORDMARK_PATH}"]`),
    ).toHaveAttribute("fill", "currentColor");
  });

  it("colours the wordmark blue on white and white on the blue footer", () => {
    const { unmount } = render(<Logo />);
    expect(screen.getByRole("link").querySelector("svg")).toHaveClass("text-primary");
    unmount();

    render(<Logo tone="dark" />);
    expect(screen.getByRole("link").querySelector("svg")).toHaveClass("text-on-dark-hi");
  });

  it("keeps the height of the mark it replaced, so the header and footer do not move", () => {
    render(<Logo />);

    const svg = screen.getByRole("link").querySelector("svg");
    expect(svg).toHaveClass("h-11", "lg:h-12", "w-auto");
    // The artboard without its 4-unit padding: the artwork fills the box.
    expect(svg).toHaveAttribute("viewBox", "4 4 151.12 48");
  });

  it("is drawn by the root layout, without which every logo on the site is empty", () => {
    const layout = readFileSync(
      join(process.cwd(), "src", "app", "layout.tsx"),
      "utf8",
    );
    expect(layout).toContain("<LogoArtwork />");
  });
});
