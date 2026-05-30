// @vitest-environment jsdom
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { GoogleTag } from "@/components/GoogleTag";

// next/script's "afterInteractive" injection is asynchronous and depends on
// the runtime; swap it for a passthrough <script> so we can assert the
// component's contract (the tag ID wired into both the loader URL and the
// inline config) deterministically.
type MockScriptProps = {
  id?: string;
  src?: string;
  strategy?: string;
  children?: ReactNode;
};
vi.mock("next/script", () => ({
  default: ({ id, src, strategy, children }: MockScriptProps) => (
    <script data-testid={id} data-src={src} data-strategy={strategy}>
      {children}
    </script>
  ),
}));

afterEach(cleanup);

describe("GoogleTag", () => {
  it("loads gtag.js from googletagmanager for the given tag ID", () => {
    const { getByTestId } = render(<GoogleTag id="AW-123456789" />);
    expect(getByTestId("gtag-js")).toHaveAttribute(
      "data-src",
      "https://www.googletagmanager.com/gtag/js?id=AW-123456789",
    );
  });

  it("configures gtag with the given tag ID", () => {
    const { getByTestId } = render(<GoogleTag id="AW-123456789" />);
    expect(getByTestId("gtag-init").textContent).toContain(
      "gtag('config', 'AW-123456789')",
    );
  });

  it("loads both scripts only after the page is interactive", () => {
    const { getByTestId } = render(<GoogleTag id="AW-123456789" />);
    expect(getByTestId("gtag-js")).toHaveAttribute(
      "data-strategy",
      "afterInteractive",
    );
    expect(getByTestId("gtag-init")).toHaveAttribute(
      "data-strategy",
      "afterInteractive",
    );
  });
});
