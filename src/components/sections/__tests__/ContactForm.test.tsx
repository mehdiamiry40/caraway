// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

const submitContactMock = vi.fn();
const trackEventMock = vi.fn();

vi.mock("@/actions/contact", () => ({
  submitContact: (...args: unknown[]) => submitContactMock(...args),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

import { ContactForm } from "@/components/sections/ContactForm";

beforeEach(() => {
  submitContactMock.mockReset();
  trackEventMock.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("ContactForm", () => {
  it("renders the visible fields and submit button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("keeps the message counter descriptive without announcing every keystroke", () => {
    render(<ContactForm />);

    const message = screen.getByLabelText(/^message/i);
    const counter = document.getElementById("contact-message-counter");
    expect(counter).toHaveTextContent("0/5000");
    expect(counter).not.toHaveAttribute("aria-live");
    expect(counter).not.toHaveAttribute("aria-atomic");
    expect(message).toHaveAttribute(
      "aria-describedby",
      "contact-message-counter",
    );
  });

  it("submits the form, fires analytics, and shows the success state on a successful response", async () => {
    submitContactMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^message/i), "Hello, I have a question about my car.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContactMock).toHaveBeenCalledTimes(1);
    });
    expect(trackEventMock).toHaveBeenCalledWith("contact_form_submitted");
    expect(trackEventMock).toHaveBeenCalledWith("lead_submitted", { source: "contact" });
    expect(await screen.findByText(/message sent — thanks/i)).toBeInTheDocument();
  });

  it("shows an inline error and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(submitContactMock).not.toHaveBeenCalled();
    // At least one field-level alert should appear (e.g. name/email/message).
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
  });

  it("blocks submission when the honeypot field is filled (bot trap)", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/your name/i), "Bot");
    await user.type(screen.getByLabelText(/^email/i), "bot@example.com");
    await user.type(screen.getByLabelText(/^message/i), "spam spam spam spam spam");

    // Honeypot is visually hidden but reachable via its DOM id. Client
    // validation rejects any non-empty value, so the action is never invoked.
    const honeypot = document.getElementById("contact-website") as HTMLInputElement;
    await user.type(honeypot, "http://evil.example");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Give the form a tick to settle.
    await waitFor(() => {
      expect(submitContactMock).not.toHaveBeenCalled();
    });
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("renders the error banner with the server message when the server action returns success: false", async () => {
    submitContactMock.mockResolvedValue({ success: false, message: "Mail provider down." });
    const user = userEvent.setup();

    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Jane Smith");
    await user.type(screen.getByLabelText(/^email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^message/i), "Hello, this is a real message.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/mail provider down/i)).toBeInTheDocument();
    expect(screen.queryByText(/message sent — thanks/i)).not.toBeInTheDocument();
  });
});
