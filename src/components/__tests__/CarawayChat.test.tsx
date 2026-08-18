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

afterEach(() => cleanup());

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
    expect(screen.queryByRole("button", { name: "Ask Caraway" })).toBeNull();
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
});
