// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
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

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

beforeEach(() => {
  mocks.messages = [];
  mocks.sendMessage.mockReset().mockResolvedValue(undefined);
  mocks.status = "ready";
  mocks.error = undefined;
  mocks.clearError.mockReset();
  mocks.setMessages.mockReset();
  mocks.stop.mockReset();
  mocks.regenerate.mockReset().mockResolvedValue(undefined);
});

afterEach(() => cleanup());

describe("CarawayChat", () => {
  it("opens an accessible chat panel from the global launcher", async () => {
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));

    expect(screen.getByRole("dialog", { name: "Ask Caraway" })).not.toBeNull();
    expect(document.activeElement).toBe(
      screen.getByLabelText("Ask Caraway a question"),
    );
    expect(screen.getByText("Indicative estimates only")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Open Caraway chat" })).toBeNull();
  });

  it("sends a quote request from the suggested actions", async () => {
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));
    await user.click(screen.getByRole("button", { name: "Get a car estimate" }));

    expect(mocks.sendMessage).toHaveBeenCalledWith({
      text: "Can you estimate what my car is worth?",
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

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));

    const emphasis = screen.getByText("make, model, year, and condition");
    expect(emphasis.tagName).toBe("STRONG");
    expect(screen.queryByText(/\*\*make/)).toBeNull();
    expect(screen.queryByRole("link", { name: "Unsafe" })).toBeNull();
  });

  it("shows an actionable card for an indicative estimate", async () => {
    mocks.messages = [
      {
        id: "assistant-quote",
        role: "assistant",
        parts: [
          {
            type: "tool-estimateVehicle",
            toolCallId: "quote-1",
            state: "output-available",
            input: {
              make: "Toyota",
              model: "Corolla",
              year: 2012,
              condition: "running",
            },
            output: {
              currency: "AUD",
              amount: 650,
              displayAmount: "$650",
              vehicle: "2012 Toyota Corolla",
              condition: "running",
              factors: ["High-demand brand — parts are sought after in Brisbane"],
              status: "indicative_estimate",
              disclaimer: "Indicative estimate only. A confirmed offer depends on inspection.",
            },
          },
        ],
      },
    ];
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));

    expect(screen.getByText("$650")).not.toBeNull();
    expect(screen.getByText(/2012 Toyota Corolla/)).not.toBeNull();
    expect(
      screen.getByRole("link", { name: "Confirm my quote" }).getAttribute("href"),
    ).toBe("/#price-estimator");
    expect(screen.getByRole("link", { name: "Call Caraway" })).not.toBeNull();
  });

  it("lets a visitor stop a response in progress", async () => {
    mocks.status = "streaming";
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));
    await user.click(screen.getByRole("button", { name: "Stop response" }));

    expect(mocks.stop).toHaveBeenCalledOnce();
  });

  it("retries the last response after an error", async () => {
    mocks.error = new Error("gateway unavailable");
    const user = userEvent.setup();
    render(<CarawayChat />);

    await user.click(screen.getByRole("button", { name: "Open Caraway chat" }));
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(mocks.clearError).toHaveBeenCalled();
    expect(mocks.regenerate).toHaveBeenCalledOnce();
  });
});
