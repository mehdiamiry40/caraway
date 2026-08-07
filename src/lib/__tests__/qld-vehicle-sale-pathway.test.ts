import { describe, expect, it } from "vitest";
import {
  buildQldVehicleSalePathway,
  DEFAULT_QLD_VEHICLE_SALE_INPUTS,
  QLD_SALE_SOURCE_URLS,
  type QldVehicleSalePathwayInputs,
} from "@/lib/qld-vehicle-sale-pathway";

function qldRegisteredInputs(
  overrides: Partial<QldVehicleSalePathwayInputs> = {},
): QldVehicleSalePathwayInputs {
  return {
    registrationStatus: "qld-registered",
    outcome: "transfer-registration",
    buyerType: "private-or-unverified",
    gasSystem: "no",
    personalisedPlates: "no",
    financeOrSecurity: "no",
    specialAuthority: "no",
    movementPlan: "not-moving",
    ...overrides,
  };
}

function stepIds(inputs: QldVehicleSalePathwayInputs): string[] {
  return buildQldVehicleSalePathway(inputs).steps.map((step) => step.id);
}

describe("buildQldVehicleSalePathway", () => {
  it("fails closed when the registration jurisdiction is unknown", () => {
    const result = buildQldVehicleSalePathway(DEFAULT_QLD_VEHICLE_SALE_INPUTS);

    expect(result.heading).toMatch(/confirm the vehicle's status/i);
    expect(result.steps.map((step) => step.id)).toContain("jurisdiction");
    expect(result.cautions.join(" ")).toMatch(
      /do not use the Queensland transfer, cancellation or certificate result/i,
    );
    expect(result.sourceKeys).toContain("interstate");
  });

  it("builds the registered private-sale certificate and transfer path", () => {
    const result = buildQldVehicleSalePathway(
      qldRegisteredInputs({
        gasSystem: "yes",
        personalisedPlates: "yes",
      }),
    );
    const ids = result.steps.map((step) => step.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        "safety-certificate",
        "gas-certificate",
        "personalised-plates",
        "registered-transfer",
        "registered-record",
      ]),
    );
    expect(
      result.steps.find((step) => step.id === "registered-transfer")?.detail,
    ).toMatch(/F3520 Seller's Copy \(Part B\).*14 days/i);
  });

  it("uses the dealer certificate exception only for a verified licensed dealer", () => {
    const verified = stepIds(
      qldRegisteredInputs({ buyerType: "verified-licensed-dealer" }),
    );
    const unverified = stepIds(
      qldRegisteredInputs({ buyerType: "private-or-unverified" }),
    );

    expect(verified).toContain("dealer-certificate");
    expect(verified).not.toContain("safety-certificate");
    expect(verified).toContain("buyer-licence");
    expect(unverified).toContain("safety-certificate");
    expect(unverified).not.toContain("dealer-certificate");
  });

  it("separates cancellation and deregistration from a registered transfer", () => {
    const result = buildQldVehicleSalePathway(
      qldRegisteredInputs({ outcome: "cancel-for-parts" }),
    );
    const ids = result.steps.map((step) => step.id);

    expect(ids).toContain("deregister-for-parts");
    expect(ids).toContain("cancel-registration");
    expect(ids).toContain("unregistered-record");
    expect(ids).not.toContain("registered-transfer");
    expect(result.summary).toMatch(/before the for-parts sale/i);
  });

  it("uses the signed-record minimum for an already-unregistered sale", () => {
    const result = buildQldVehicleSalePathway({
      ...qldRegisteredInputs(),
      registrationStatus: "already-unregistered",
    });
    const recordStep = result.steps.find(
      (step) => step.id === "unregistered-record",
    );

    expect(recordStep?.detail).toMatch(
      /both parties.*VIN, chassis or engine identifier, make and model, and sale date/i,
    );
    expect(stepIds({
      ...qldRegisteredInputs(),
      registrationStatus: "already-unregistered",
    })).not.toContain("safety-certificate");
  });

  it("does not reduce unregistered road movement to a universal permit rule", () => {
    const result = buildQldVehicleSalePathway({
      ...qldRegisteredInputs(),
      registrationStatus: "already-unregistered",
      movementPlan: "road-movement",
    });
    const movement = result.steps.find((step) => step.id === "road-movement");

    expect(movement?.detail).toMatch(
      /do not assume a permit is always required or never required/i,
    );
    expect(movement?.detail).toMatch(/unsafe vehicle.*must be transported/i);
    expect(movement?.sources).toEqual(["unregisteredMovement"]);
  });

  it("adds finance and special-authority gates only when they may apply", () => {
    const cleanIds = stepIds(qldRegisteredInputs());
    const complicatedIds = stepIds(
      qldRegisteredInputs({
        financeOrSecurity: "unsure",
        specialAuthority: "yes",
      }),
    );

    expect(cleanIds).not.toContain("finance");
    expect(cleanIds).not.toContain("special-authority");
    expect(complicatedIds).toContain("finance");
    expect(complicatedIds).toContain("special-authority");
  });

  it("returns unique, HTTPS official sources used by the result", () => {
    const result = buildQldVehicleSalePathway(
      qldRegisteredInputs({
        gasSystem: "yes",
        personalisedPlates: "yes",
        financeOrSecurity: "yes",
        specialAuthority: "yes",
      }),
    );

    expect(new Set(result.sourceKeys).size).toBe(result.sourceKeys.length);
    for (const key of result.sourceKeys) {
      expect(QLD_SALE_SOURCE_URLS[key]).toMatch(/^https:\/\//);
    }
  });
});
