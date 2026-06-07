// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { Select } from "@/components/ui/select";

const options = [
  { value: "Toyota", label: "Toyota" },
  { value: "Mazda", label: "Mazda" },
];

afterEach(cleanup);

describe("Select", () => {
  it("uses the placeholder as the initial uncontrolled value", () => {
    render(
      <Select
        aria-label="Make"
        placeholder="Select make"
        options={options}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Make" })).toHaveValue("");
  });

  it("preserves a controlled value", () => {
    render(
      <Select
        aria-label="Make"
        placeholder="Select make"
        options={options}
        value="Mazda"
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Make" })).toHaveValue("Mazda");
  });
});
