// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CarawayChat } from "@/components/CarawayChat";
import type { CarawayChatMessage } from "@/lib/chat-assistant";

const mocks = vi.hoisted(() => ({
  messages: [] as CarawayChatMessage[],
  sendMessage: vi.fn(),
  status: "ready" as "ready" | "submitted" | "streaming" | "error",
  error: undefined as Error | undefined,
  clearError: vi.fn(),
  setMessages: vi.fn(),
  stop: vi.fn(),
  regenerate: vi.fn(),
  trackEvent: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mocks.messages,
    sendMessage: mocks.sendMessage,
    status: mocks.status,
    error: mocks.error,
    clearError: mocks.clearError,
    setMessages: mocks.setMessages,
    stop: mocks.stop,
    regenerate: mocks.regenerate,
  }),
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: mocks.trackEvent }));

beforeEach(() => {
  mocks.messages = [];
  mocks.sendMessage.mockReset().mockResolvedValue(undefined);
  mocks.status = "ready";
  mocks.error = undefined;
  mocks.clearError.mockReset();
  mocks.setMessages.mockReset();
  mocks.stop.mockReset();
  mocks.regenerate.mockReset().mockResolvedValue(undefined);
  mocks.trackEvent.mockReset();
});

afterEach(() => {
  cleanup();
  delete document.body.dataset.mobileMenuOpen;
});

describe("CarawayChat", () => {
  it("opens from the lazy loader, restores focus, and tracks only the first open", async () => {
    const user = userEvent.setup();
    render(<CarawayChat initiallyOpen />);

    expect(screen.getByRole("dialog", { name: "Ask Caraway" })).not.toBeNull();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByLabelText("Ask Caraway a question"),
      );
    });
    expect(mocks.trackEvent).toHaveBeenCalledOnce();
    expect(mocks.trackEvent).toHaveBeenCalledWith("chat_opened");

    await user.click(screen.getByRole("button", { name: "Close chat" }));
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Ask Caraway" }),
      );
    });

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));
    expect(mocks.trackEvent).toHaveBeenCalledOnce();
  });

  it("opens an accessible chat panel from the global launcher", async () => {
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));

    expect(screen.getByRole("dialog", { name: "Ask Caraway" })).not.toBeNull();
    expect(document.activeElement).toBe(
      screen.getByLabelText("Ask Caraway a question"),
    );
    expect(screen.getByText("Quotes come from the form")).not.toBeNull();
    expect(screen.getByText("AI answers · offers reviewed by people")).not.toBeNull();
    expect(screen.getByText(/I can explain what affects an offer/)).not.toBeNull();
    expect(screen.queryByText("AI quotes and quick answers")).toBeNull();
    expect(screen.queryByText(/I can estimate your car/)).toBeNull();
    expect(
      screen.getByText(/Do not enter names, phone numbers, addresses, registration numbers, VINs or ID details/),
    ).not.toBeNull();
    expect(
      screen.getByLabelText("Ask Caraway a question").getAttribute("aria-describedby"),
    ).toBe("caraway-chat-privacy-note");
    expect(
      (screen.getByLabelText("Ask Caraway a question").closest("footer") as HTMLElement)
        .inert,
    ).not.toBe(true);
    expect(screen.queryByRole("button", { name: "Ask Caraway" })).toBeNull();
  });

  it("closes before following the privacy-policy link", async () => {
    const user = userEvent.setup();
    render(<CarawayChat initiallyOpen />);

    const privacyLink = screen.getByRole("link", { name: "privacy policy" });
    privacyLink.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    await user.click(privacyLink);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Ask Caraway" })).toBeNull();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("closes and suppresses itself while the mobile navigation modal is open", async () => {
    render(<CarawayChat initiallyOpen />);
    expect(screen.getByRole("dialog", { name: "Ask Caraway" })).not.toBeNull();

    document.body.dataset.mobileMenuOpen = "true";
    window.dispatchEvent(new Event("caraway:mobile-menu-change"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Ask Caraway" })).toBeNull();
      expect(screen.getByTestId("chat-launcher").getAttribute("aria-hidden")).toBe(
        "true",
      );
    });
    expect(
      screen
        .getByRole("button", { name: "Ask Caraway", hidden: true })
        .getAttribute("tabindex"),
    ).toBe("-1");
  });

  it("sends a quote request from the suggested actions", async () => {
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));
    await user.click(screen.getByRole("button", { name: "How do I get a quote?" }));

    expect(mocks.sendMessage).toHaveBeenCalledWith({
      text: "How do I get a quote for my car?",
    });
  });

  it("renders assistant Markdown as formatted content", async () => {
    mocks.messages = [
      {
        id: "assistant-1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Please provide the **make, model, year, and condition**. [Unsafe](javascript:bad)",
          },
        ],
      },
    ];
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));

    const emphasis = screen.getByText("make, model, year, and condition");
    expect(emphasis.tagName).toBe("STRONG");
    expect(screen.queryByText(/\*\*make/)).toBeNull();
    expect(screen.queryByRole("link", { name: "Unsafe" })).toBeNull();
  });

  it("points a quote request at the quote form instead of pricing it", async () => {
    mocks.messages = [
      {
        id: "assistant-quote",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "A Caraway buyer reviews every vehicle, so fill in the quote form and we'll call you back.",
          },
        ],
      },
    ];
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));

    expect(screen.getByText(/A Caraway buyer reviews every vehicle/)).not.toBeNull();
    expect(
      screen.getByRole("link", { name: /Full quote/ }).getAttribute("href"),
    ).toBe("/#quote-form");
  });

  it("lets a visitor stop a response in progress", async () => {
    mocks.status = "streaming";
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));
    await user.click(screen.getByRole("button", { name: "Stop response" }));

    expect(mocks.stop).toHaveBeenCalledOnce();
  });

  it("retries the last response after an error", async () => {
    mocks.error = new Error("gateway unavailable");
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(mocks.clearError).toHaveBeenCalled();
    expect(mocks.regenerate).toHaveBeenCalledOnce();
  });

  it("starts a fresh conversation after a permanent history limit", async () => {
    mocks.messages = [{
      id: "user-before-limit",
      role: "user",
      parts: [{ type: "text", text: "Question in the exhausted conversation" }],
    }];
    mocks.error = new Error(JSON.stringify({
      error: "conversation limit reached",
      code: "conversation_limit_reached",
    }));
    mocks.status = "error";
    mocks.clearError.mockImplementation(() => {
      mocks.error = undefined;
      mocks.status = "ready";
    });
    mocks.setMessages.mockImplementation((messages: CarawayChatMessage[]) => {
      mocks.messages = messages;
    });
    const user = userEvent.setup();
    const { rerender } = render(<CarawayChat initiallyOpen />);

    expect(screen.getByRole("alert").textContent).toContain("conversation has reached its limit");
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    expect((screen.getByLabelText("Ask Caraway a question") as HTMLTextAreaElement).disabled).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Start a new chat" }));

    await user.click(screen.getByRole("button", { name: "Start a new chat" }));
    rerender(<CarawayChat initiallyOpen />);

    expect(mocks.setMessages).toHaveBeenCalledWith([]);
    expect(mocks.clearError).toHaveBeenCalledOnce();
    expect(mocks.regenerate).not.toHaveBeenCalled();
    expect(screen.queryByText("Question in the exhausted conversation")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(document.activeElement).toBe(screen.getByLabelText("Ask Caraway a question"));
    await user.type(screen.getByLabelText("Ask Caraway a question"), "Is towing included?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(mocks.sendMessage).toHaveBeenCalledWith({ text: "Is towing included?" });
  });
});
