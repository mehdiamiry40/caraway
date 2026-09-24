// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { CarawayChatLauncher } from "@/components/CarawayChatLauncher";
import { MobileMenuClient } from "@/components/layout/MobileMenuClient";

const serviceLinks = [
  { label: "Cash for Cars", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal", href: "/car-removal-brisbane" },
];

const originalShowModal = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  "showModal",
);
const originalClose = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  "close",
);
let desktopMatches = false;
let mediaListeners: Set<() => void>;

beforeEach(() => {
  desktopMatches = false;
  mediaListeners = new Set();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return desktopMatches;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: () => void) =>
        mediaListeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) =>
        mediaListeners.delete(listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    }),
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    }),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalShowModal) {
    Object.defineProperty(
      HTMLDialogElement.prototype,
      "showModal",
      originalShowModal,
    );
  } else {
    Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  }
  if (originalClose) {
    Object.defineProperty(HTMLDialogElement.prototype, "close", originalClose);
  } else {
    Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  }
  delete document.body.dataset.mobileMenuOpen;
  document.body.style.overflow = "";
});

describe("MobileMenuClient", () => {
  it("opens as a modal, contains focus, closes on Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(<MobileMenuClient serviceLinks={serviceLinks} />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    const closeButton = screen.getByRole("button", { name: "Close menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.body).toHaveAttribute("data-mobile-menu-open", "true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(closeButton);

    const lastLink = screen.getByRole("link", { name: "Get my quote" });
    lastLink.focus();
    await user.tab();
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).toBeNull());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger);
    expect(document.body).not.toHaveAttribute("data-mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
  });

  it("removes the chat launcher from interaction while the menu is open", async () => {
    const user = userEvent.setup();
    render(
      <>
        <MobileMenuClient serviceLinks={serviceLinks} />
        <CarawayChatLauncher onClick={vi.fn()} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));

    await waitFor(() => {
      expect(screen.getByTestId("chat-launcher")).toHaveAttribute("aria-hidden", "true");
    });
    expect(screen.getByRole("button", { name: "Ask Caraway", hidden: true })).toHaveAttribute(
      "tabindex",
      "-1",
    );

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    await waitFor(() => {
      expect(screen.getByTestId("chat-launcher")).not.toHaveAttribute("aria-hidden");
    });
  });

  it("closes an open modal when the layout crosses into desktop", async () => {
    const user = userEvent.setup();
    render(<MobileMenuClient serviceLinks={serviceLinks} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    desktopMatches = true;
    mediaListeners.forEach((listener) => listener());

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Menu" })).toBeNull();
      expect(document.body.style.overflow).toBe("");
      expect(document.body).not.toHaveAttribute("data-mobile-menu-open");
    });
  });
});
