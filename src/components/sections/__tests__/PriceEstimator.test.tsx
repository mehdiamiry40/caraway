// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

const submitQuoteMock = vi.fn();
const trackEventMock = vi.fn();

vi.mock("@/actions/quote", () => ({
  submitQuote: (...args: unknown[]) => submitQuoteMock(...args),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

vi.mock("@/components/ui/address-autocomplete", () => ({
  AddressAutocomplete: ({
    id,
    value,
    onChange,
    onBlur,
    placeholder,
  }: {
    id?: string;
    value: string;
    onChange: (next: string) => void;
    onBlur?: () => void;
    placeholder?: string;
  }) => (
    <input
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  ),
}));

import { PriceEstimator } from "@/components/sections/PriceEstimator";

beforeEach(() => {
  submitQuoteMock.mockReset();
  trackEventMock.mockReset();
  // Avoid sessionStorage cross-test leakage.
  if (typeof window !== "undefined") window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/^make/i), "Toyota");
  await user.selectOptions(screen.getByLabelText(/^model/i), "Corolla");
  await user.selectOptions(screen.getByLabelText(/year of manufacture/i), "2015");
  await user.selectOptions(screen.getByLabelText(/^condition/i), "running");
}

describe("PriceEstimator", () => {
  it("renders step 1 with vehicle inputs", () => {
    render(<PriceEstimator />);
    expect(screen.getByLabelText(/^make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year of manufacture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^condition/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see my quote/i })).toBeInTheDocument();
  });

  it("disables 'See my quote' until vehicle inputs are valid", async () => {
    const user = userEvent.setup();
    render(<PriceEstimator />);

    expect(screen.getByRole("button", { name: /see my quote/i })).toBeDisabled();
    await fillStep1(user);
    expect(screen.getByRole("button", { name: /see my quote/i })).toBeEnabled();
  });

  // Both Step 2 and Step 3 markup are mounted at the same time (hidden via
  // a Tailwind `hidden` class). jsdom doesn't compute CSS, so RTL can see
  // both. Walk up the DOM to find the closest step container and check
  // whether it has the `hidden` class.
  function isInVisibleStep(el: HTMLElement) {
    let cursor: HTMLElement | null = el;
    while (cursor) {
      const cls = cursor.className;
      if (typeof cls === "string" && /(^|\s)hidden(\s|$)/.test(cls)) return false;
      cursor = cursor.parentElement;
    }
    return true;
  }

  function getVisibleOfferRequestButton() {
    const all = screen.getAllByRole("button", { name: /request (?:confirmed offer|buyer assessment)/i });
    const visible = all.filter(isInVisibleStep);
    if (visible.length !== 1) {
      throw new Error(
        `Expected exactly one visible offer-request button; found ${visible.length}`
      );
    }
    return visible[0]!;
  }

  async function waitForStep(n: 1 | 2 | 3) {
    await waitFor(
      () => {
        expect(screen.getByRole("progressbar")).toHaveAttribute(
          "aria-valuetext",
          `Step ${n} of 3`
        );
      },
      { timeout: 3000 }
    );
  }

  it("transitions through the quote flow and submits on success", async () => {
    submitQuoteMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<PriceEstimator />);

    // Step 1 → calculate
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /see my quote/i }));
    await waitForStep(2);
    expect(trackEventMock).toHaveBeenCalledWith("estimator_quote_shown");

    // Step 2 → Step 3 (uses the only visible offer-request CTA).
    await user.click(getVisibleOfferRequestButton());
    await waitForStep(3);

    await user.type(screen.getByLabelText(/your name/i), "Jane Smith");
    await user.type(screen.getByLabelText(/phone number/i), "0412345678");
    await user.type(screen.getByLabelText(/pickup address/i), "123 Smith St, Brisbane QLD 4000");

    await user.click(getVisibleOfferRequestButton());

    await waitFor(() => {
      expect(submitQuoteMock).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByText(/your offer request is in/i)).toBeInTheDocument();
    expect(trackEventMock).toHaveBeenCalledWith("estimator_submitted");
    expect(trackEventMock).toHaveBeenCalledWith("lead_submitted", {
      source: "estimator",
    });
  });

  it("blocks submission when the honeypot is filled", async () => {
    const user = userEvent.setup();
    render(<PriceEstimator />);

    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /see my quote/i }));
    await waitForStep(2);
    await user.click(getVisibleOfferRequestButton());
    await waitForStep(3);

    await user.type(screen.getByLabelText(/your name/i), "Bot");
    await user.type(screen.getByLabelText(/phone number/i), "0412345678");
    await user.type(screen.getByLabelText(/pickup address/i), "Some address Brisbane");
    const honeypot = document.getElementById("est-website") as HTMLInputElement;
    await user.type(honeypot, "http://evil.example");

    await user.click(getVisibleOfferRequestButton());

    // Honeypot path fakes a success without contacting the server.
    expect(await screen.findByText(/your offer request is in/i)).toBeInTheDocument();
    expect(submitQuoteMock).not.toHaveBeenCalled();
  });
});
