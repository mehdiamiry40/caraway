// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CarawayChat } from "@/components/CarawayChat";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  clearError: vi.fn(),
  setMessages: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: [],
    sendMessage: mocks.sendMessage,
    status: "ready",
    error: undefined,
    clearError: mocks.clearError,
    setMessages: mocks.setMessages,
    stop: mocks.stop,
  }),
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

beforeEach(() => {
  mocks.sendMessage.mockReset().mockResolvedValue(undefined);
  mocks.clearError.mockReset();
  mocks.setMessages.mockReset();
  mocks.stop.mockReset();
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
});
