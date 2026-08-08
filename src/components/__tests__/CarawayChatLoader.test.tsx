// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CarawayChatLoader } from "@/components/CarawayChatLoader";

const mocks = vi.hoisted(() => ({ moduleLoads: 0 }));

vi.mock("@/components/CarawayChat", () => {
  mocks.moduleLoads += 1;
  return {
    CarawayChat: ({ initiallyOpen }: { initiallyOpen?: boolean }) => (
      <div role="dialog" aria-label="Ask Caraway">
        {initiallyOpen ? "Initially open" : "Initially closed"}
      </div>
    ),
  };
});

afterEach(() => cleanup());

describe("CarawayChatLoader", () => {
  it("loads the chat module only after the visitor activates the launcher", async () => {
    const user = userEvent.setup();
    render(<CarawayChatLoader />);

    expect(mocks.moduleLoads).toBe(0);
    expect(screen.queryByRole("dialog", { name: "Ask Caraway" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Ask Caraway" }));

    expect(await screen.findByRole("dialog", { name: "Ask Caraway" })).not.toBeNull();
    expect(screen.getByText("Initially open")).not.toBeNull();
    expect(mocks.moduleLoads).toBe(1);
  });
});
