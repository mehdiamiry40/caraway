// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Locations from "@/views/Locations";
import { suburbs } from "@/data/suburbs";

vi.mock("@/components/layout/PageShell", () => ({
  PageShell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function searchFor(value: string) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Search suburbs" }), {
    target: { value },
  });
  act(() => vi.advanceTimersByTime(150));
}

describe("Locations suburb search", () => {
  it.each([
    ["Indooroopilly", "toowong"],
    ["North Lakes", "redcliffe"],
    ["Sunnybank", "moorooka"],
    ["The Gap", "kenmore"],
  ])("routes a search for %s to the existing %s guide", (alias, slug) => {
    render(<Locations />);

    searchFor(alias);

    const guide = suburbs.find((suburb) => suburb.slug === slug)!;
    const heading = screen.getByRole("heading", { name: guide.h1 });
    expect(heading.closest("a")).toHaveAttribute("href", `/locations/${slug}`);
    expect(screen.getByRole("status")).toHaveTextContent(`1 location guide found for “${alias}”.`);
    expect(screen.queryByText(/No suburbs match/)).not.toBeInTheDocument();
  });

  it("keeps one concise status mounted through matching, zero, and cleared searches", () => {
    const { container } = render(<Locations />);
    const status = screen.getByRole("status");

    expect(status).toHaveTextContent(`${suburbs.length} location guides found.`);

    searchFor("  tOoWoNg  ");
    expect(screen.getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("1 location guide found for “tOoWoNg”.");

    searchFor("unlisted-suburb");
    expect(screen.getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("0 location guides found for “unlisted-suburb”.");
    expect(screen.getByText(/No suburbs match/)).toHaveTextContent("unlisted-suburb");
    expect(screen.getByRole("link", { name: "contact us" })).toHaveAttribute("href", "/contact");
    expect(screen.queryByRole("heading", { name: /Cash for Cars/ })).not.toBeInTheDocument();

    searchFor("");
    expect(screen.getByRole("status")).toBe(status);
    expect(status).toHaveTextContent(`${suburbs.length} location guides found.`);
    expect(screen.queryByText(/No suburbs match/)).not.toBeInTheDocument();
    expect(container.querySelectorAll("[aria-live]")).toHaveLength(1);
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("only applies the latest search after the user pauses typing", () => {
    render(<Locations />);
    const search = screen.getByRole("searchbox", { name: "Search suburbs" });
    const status = screen.getByRole("status");

    fireEvent.change(search, { target: { value: "Indooroopilly" } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(search, { target: { value: "North Lakes" } });
    act(() => vi.advanceTimersByTime(50));
    expect(status).toHaveTextContent(`${suburbs.length} location guides found.`);

    act(() => vi.advanceTimersByTime(100));
    expect(status).toHaveTextContent("1 location guide found for “North Lakes”.");
    expect(screen.getByRole("heading", { name: /^Cash for Cars Redcliffe/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Cash for Cars Toowong" })).not.toBeInTheDocument();
  });
});
