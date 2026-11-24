// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { QuoteComparisonWorksheet } from "@/components/blog/QuoteComparisonWorksheet";

afterEach(() => {
  cleanup();
  document.body.classList.remove("quote-worksheet-printing");
  vi.restoreAllMocks();
});

describe("QuoteComparisonWorksheet", () => {
  it("renders three labelled quote groups and the official licence-register link", () => {
    render(<QuoteComparisonWorksheet />);

    for (const label of ["Quote A", "Quote B", "Quote C"]) {
      expect(screen.getByRole("group", { name: label })).toBeInTheDocument();
    }

    expect(
      screen.getByRole("link", {
        name: /check Queensland's public motor-licence register/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.qld.gov.au/community/fair-trading/regulated-industries-licensing-and-legislation/motor-industry-regulation/check-a-motor-licence",
    );
  });

  it("calculates effective net amounts and identifies the highest entered net", async () => {
    const user = userEvent.setup();
    render(<QuoteComparisonWorksheet />);
    const quoteA = within(screen.getByRole("group", { name: "Quote A" }));
    const quoteB = within(screen.getByRole("group", { name: "Quote B" }));

    await user.type(quoteA.getByLabelText(/buyer or legal name/i), "Buyer One");
    await user.type(quoteA.getByLabelText(/headline offer/i), "1000");
    await user.type(quoteA.getByLabelText(/deductions/i), "125");
    await user.type(quoteB.getByLabelText(/headline offer/i), "850");

    expect(quoteA.getByText(/effective net: \$875/i)).toBeInTheDocument();
    expect(quoteA.getByText(/highest entered net/i)).toBeInTheDocument();
    expect(quoteB.getByText(/effective net: \$850/i)).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Buyer One" })).toBeInTheDocument();
  });

  it("clears browser-memory entries without submitting them", async () => {
    const user = userEvent.setup();
    render(<QuoteComparisonWorksheet />);
    const buyer = within(
      screen.getByRole("group", { name: "Quote A" }),
    ).getByLabelText(/buyer or legal name/i);

    await user.type(buyer, "Temporary buyer");
    expect(buyer).toHaveValue("Temporary buyer");
    await user.click(screen.getByRole("button", { name: /clear worksheet/i }));
    expect(buyer).toHaveValue("");
  });

  it("does not calculate a net amount from a negative offer", () => {
    render(<QuoteComparisonWorksheet />);
    const quoteA = within(screen.getByRole("group", { name: "Quote A" }));

    fireEvent.change(quoteA.getByLabelText(/headline offer/i), {
      target: { value: "-100" },
    });
    expect(quoteA.getByText(/effective net: not entered/i)).toBeInTheDocument();
  });

  it("does not treat a negative deduction as zero", () => {
    render(<QuoteComparisonWorksheet />);
    const quoteA = within(screen.getByRole("group", { name: "Quote A" }));

    fireEvent.change(quoteA.getByLabelText(/headline offer/i), {
      target: { value: "1000" },
    });
    fireEvent.change(quoteA.getByLabelText(/deductions/i), {
      target: { value: "-100" },
    });

    expect(quoteA.getByText(/effective net: not entered/i)).toBeInTheDocument();
    expect(quoteA.queryByText(/highest entered net/i)).not.toBeInTheDocument();
  });

  it("prints full long-form entries without the surrounding page", async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<QuoteComparisonWorksheet />);
    const quoteA = within(screen.getByRole("group", { name: "Quote A" }));
    const longAssumptions = `START OF NOTES ${"x".repeat(540)} END OF NOTES`;

    fireEvent.change(quoteA.getByLabelText(/assumptions and revision triggers/i), {
      target: { value: longAssumptions },
    });

    await user.click(screen.getByRole("button", { name: /print or save as pdf/i }));
    await waitFor(() => expect(print).toHaveBeenCalledTimes(1));
    expect(document.body).toHaveClass("quote-worksheet-printing");
    const printRoot = document.querySelector(".quote-worksheet-print-root");
    expect(printRoot).not.toBeNull();
    expect(printRoot?.textContent).toContain("START OF NOTES");
    expect(printRoot?.textContent).toContain("END OF NOTES");

    window.dispatchEvent(new Event("afterprint"));
    await waitFor(() => {
      expect(document.body).not.toHaveClass("quote-worksheet-printing");
      expect(
        document.querySelector(".quote-worksheet-print-root"),
      ).toBeNull();
    });
  });
});
