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

// AddressAutocomplete owns network/cookie/Places logic that's tested
// elsewhere. For form-level tests, swap it for a plain input.
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

import { QuoteForm } from "@/components/sections/QuoteForm";

beforeEach(() => {
  submitQuoteMock.mockReset();
  trackEventMock.mockReset();
});

afterEach(() => {
  cleanup();
});

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/^make/i), "Toyota");
  await user.selectOptions(screen.getByLabelText(/^model/i), "Corolla");
  await user.selectOptions(screen.getByLabelText(/^year/i), "2015");
  await user.selectOptions(screen.getByLabelText(/^condition/i), "running");
  await user.type(screen.getByLabelText(/your name/i), "Jane Smith");
  await user.type(screen.getByLabelText(/^phone/i), "0412345678");
  await user.type(screen.getByLabelText(/pickup address/i), "123 Smith St, Brisbane QLD 4000");
}

describe("QuoteForm", () => {
  it("renders the visible fields and submit button", () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText(/^make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pickup address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get my quote/i })).toBeInTheDocument();
  });

  it("submits the form, fires analytics, and shows the success state on success", async () => {
    submitQuoteMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<QuoteForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /get my quote/i }));

    await waitFor(() => {
      expect(submitQuoteMock).toHaveBeenCalledTimes(1);
    });
    expect(trackEventMock).toHaveBeenCalledWith("quote_form_submitted");
    expect(trackEventMock).toHaveBeenCalledWith("lead_submitted", { source: "quote_form" });
    expect(await screen.findByText(/thanks — we've got your details/i)).toBeInTheDocument();
  });

  it("does not call the server action when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.click(screen.getByRole("button", { name: /get my quote/i }));

    expect(submitQuoteMock).not.toHaveBeenCalled();
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
  });

  it("blocks submission when the honeypot field is filled (bot trap)", async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await fillRequiredFields(user);

    const honeypot = document.getElementById("quote-website") as HTMLInputElement;
    await user.type(honeypot, "http://evil.example");
    await user.click(screen.getByRole("button", { name: /get my quote/i }));

    await waitFor(() => {
      expect(submitQuoteMock).not.toHaveBeenCalled();
    });
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("shows the server message when the server action returns success: false", async () => {
    submitQuoteMock.mockResolvedValue({ success: false, message: "Webhook failed." });
    const user = userEvent.setup();

    render(<QuoteForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /get my quote/i }));

    expect(await screen.findByText(/webhook failed/i)).toBeInTheDocument();
    expect(screen.queryByText(/thanks — we've got your details/i)).not.toBeInTheDocument();
  });
});
