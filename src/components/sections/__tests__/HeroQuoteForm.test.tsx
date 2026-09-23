// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

const submitQuoteMock = vi.fn();
const trackEventMock = vi.fn();
const issuerFetchMock = vi.fn<typeof fetch>();
const issuedId = "1788566400000-8a459515-f557-42e1-8c5e-811e1498f843";

vi.mock("@/actions/quote", () => ({
  submitQuote: (...args: unknown[]) => submitQuoteMock(...args),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

import { HeroQuoteForm } from "@/components/sections/HeroQuoteForm";

beforeEach(() => {
  submitQuoteMock.mockReset();
  trackEventMock.mockReset();
  sessionStorage.clear();
  issuerFetchMock
    .mockReset()
    .mockImplementation(async () => Response.json({ id: issuedId }));
  vi.stubGlobal("fetch", issuerFetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/car make/i), "Toyota");
  await user.selectOptions(screen.getByLabelText(/car model/i), "Corolla");
  await user.selectOptions(screen.getByLabelText(/^year/i), "2015");
  await user.selectOptions(screen.getByLabelText(/^condition/i), "running");
  await user.type(screen.getByLabelText(/your name/i), "Jane Smith");
  await user.type(screen.getByLabelText(/^phone/i), "0412345678");
  await user.type(screen.getByLabelText(/^suburb/i), "Toowong");
}

describe("HeroQuoteForm", () => {
  it("exposes every required quote field with an accessible name", () => {
    render(<HeroQuoteForm />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/car make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/car model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^suburb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expected price/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^get my quote$/i })).toBeInTheDocument();
    // The free-text vehicle notes stay on the full form below the fold.
    expect(
      screen.queryByLabelText(/vehicle and access details/i),
    ).not.toBeInTheDocument();
  });

  it("submits, attributes the lead to the hero, and shows the success state", async () => {
    submitQuoteMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<HeroQuoteForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /^get my quote$/i }));

    await waitFor(() => expect(submitQuoteMock).toHaveBeenCalledTimes(1));
    expect(submitQuoteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Smith",
        phone: "0412345678",
        make: "Toyota",
        model: "Corolla",
        year: 2015,
        condition: "running",
        suburb: "Toowong",
      }),
      issuedId,
    );
    expect(trackEventMock).toHaveBeenCalledWith("quote_form_submitted", {
      source: "hero_quote_form",
    });
    expect(trackEventMock).toHaveBeenCalledWith("lead_submitted", {
      source: "hero_quote_form",
    });
    expect(
      await screen.findByText(/thanks — we've got your details/i),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("caraway:submission:quote")).toBeNull();
    const analytics = JSON.stringify(trackEventMock.mock.calls);
    for (const personalValue of ["Jane Smith", "0412345678", "Toowong", issuedId]) {
      expect(analytics).not.toContain(personalValue);
    }
  });

  it("reports a failed delivery without clearing the entered details", async () => {
    submitQuoteMock.mockResolvedValue({
      success: false,
      message: "We couldn't send your quote.",
    });
    const user = userEvent.setup();

    render(<HeroQuoteForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /^get my quote$/i }));

    await waitFor(() => expect(submitQuoteMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
    expect(screen.getByLabelText(/your name/i)).toHaveValue("Jane Smith");
  });

  it("blocks a honeypot submission from reaching delivery", async () => {
    const user = userEvent.setup();

    render(<HeroQuoteForm />);
    await fillRequiredFields(user);
    const honeypot = document.getElementById("hero-quote-website");
    expect(honeypot).not.toBeNull();
    await user.type(honeypot as HTMLInputElement, "https://spam.example");
    await user.click(screen.getByRole("button", { name: /^get my quote$/i }));

    await waitFor(() => expect(submitQuoteMock).not.toHaveBeenCalled());
    expect(trackEventMock).not.toHaveBeenCalled();
    expect(issuerFetchMock).not.toHaveBeenCalled();
  });
});
