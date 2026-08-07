// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { QldVehicleSaleRecordBuilder } from "@/components/blog/QldVehicleSaleRecordBuilder";
import { QLD_SALE_SOURCE_URLS } from "@/lib/qld-vehicle-sale-pathway";

afterEach(() => {
  cleanup();
  document.body.classList.remove("qld-sale-record-printing");
  vi.restoreAllMocks();
});

describe("QldVehicleSaleRecordBuilder", () => {
  it("server-renders an accessible, empty and privacy-labelled builder", () => {
    const { container } = render(<QldVehicleSaleRecordBuilder />);

    expect(
      screen.getByRole("heading", {
        name: /build a Queensland seller checklist and handover record/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /choose the likely transaction path/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /prepare the optional handover record/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/seller legal name/i)).toHaveValue("");
    expect(screen.getByLabelText(/buyer legal name/i)).toHaveValue("");
    expect(screen.getByText(/not submitted to Caraway/i)).toBeInTheDocument();
    expect(container.querySelector("form")).toBeNull();
  });

  it("shows the verified-dealer exception only after that option is selected", async () => {
    const user = userEvent.setup();
    render(<QldVehicleSaleRecordBuilder />);

    await user.selectOptions(
      screen.getByLabelText(/registration status now/i),
      "qld-registered",
    );
    await user.selectOptions(
      screen.getByLabelText(/intended registration outcome/i),
      "transfer-registration",
    );
    await user.selectOptions(
      screen.getByLabelText(/^buyer type$/i),
      "private-or-unverified",
    );

    expect(
      screen.getByRole("heading", { name: /check the safety-certificate requirement/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /direct licensed-dealer acquisition/i }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText(/^buyer type$/i),
      "verified-licensed-dealer",
    );

    expect(
      screen.getByRole("heading", { name: /direct licensed-dealer acquisition/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /check the safety-certificate requirement/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /check a motor licence/i }),
    ).toHaveAttribute("href", QLD_SALE_SOURCE_URLS.licenceRegister);
  });

  it("renders the nuanced unregistered road-movement result", async () => {
    const user = userEvent.setup();
    render(<QldVehicleSaleRecordBuilder />);

    await user.selectOptions(
      screen.getByLabelText(/registration status now/i),
      "already-unregistered",
    );
    await user.selectOptions(
      screen.getByLabelText(/how an unregistered vehicle would move/i),
      "road-movement",
    );

    expect(
      screen.getByRole("heading", { name: /check the exact unregistered movement/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not assume a permit is always required or never required/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /unregistered vehicle permits/i }),
    ).toHaveAttribute("href", QLD_SALE_SOURCE_URLS.unregisteredMovement);
  });

  it("keeps entries in component memory without a request or storage write", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    render(<QldVehicleSaleRecordBuilder />);

    await user.type(screen.getByLabelText(/seller legal name/i), "Seller Example");
    await user.type(screen.getByLabelText(/buyer legal name/i), "Buyer Example");
    await user.selectOptions(
      screen.getByLabelText(/registration status now/i),
      "already-unregistered",
    );

    expect(screen.getByLabelText(/seller legal name/i)).toHaveValue(
      "Seller Example",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it("clears both pathway selections and handover entries", async () => {
    const user = userEvent.setup();
    render(<QldVehicleSaleRecordBuilder />);

    await user.selectOptions(
      screen.getByLabelText(/registration status now/i),
      "qld-registered",
    );
    await user.type(screen.getByLabelText(/vehicle make and model/i), "Toyota Camry");
    await user.click(screen.getByRole("button", { name: /clear builder/i }));

    expect(screen.getByLabelText(/registration status now/i)).toHaveValue(
      "interstate-or-unknown",
    );
    expect(screen.getByLabelText(/vehicle make and model/i)).toHaveValue("");
  });

  it("prints two complete copies and removes the print portal afterwards", async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<QldVehicleSaleRecordBuilder />);
    const longCondition = `START CONDITION ${"x".repeat(500)} END CONDITION`;

    await user.type(screen.getByLabelText(/seller legal name/i), "Seller Example");
    await user.type(screen.getByLabelText(/buyer legal name/i), "Buyer Example");
    await user.type(screen.getByLabelText(/VIN, chassis or engine identifier/i), "VIN123456789");
    fireEvent.change(screen.getByLabelText(/condition notes and known disclosures/i), {
      target: { value: longCondition },
    });
    await user.click(
      screen.getByRole("button", { name: /print two copies or save as PDF/i }),
    );

    await waitFor(() => expect(print).toHaveBeenCalledTimes(1));
    expect(document.body).toHaveClass("qld-sale-record-printing");
    const printRoot = document.querySelector(".qld-sale-record-print-root");
    expect(printRoot).not.toBeNull();
    expect(within(printRoot as HTMLElement).getByText(/seller copy/i)).toBeInTheDocument();
    expect(within(printRoot as HTMLElement).getByText(/buyer copy/i)).toBeInTheDocument();
    expect(printRoot?.textContent?.match(/Seller Example/g)).toHaveLength(2);
    expect(printRoot?.textContent?.match(/VIN123456789/g)).toHaveLength(2);
    expect(printRoot?.textContent?.match(/START CONDITION/g)).toHaveLength(2);
    expect(printRoot?.textContent?.match(/END CONDITION/g)).toHaveLength(2);

    window.dispatchEvent(new Event("afterprint"));
    await waitFor(() => {
      expect(document.body).not.toHaveClass("qld-sale-record-printing");
      expect(document.querySelector(".qld-sale-record-print-root")).toBeNull();
    });
  });
});
