export const QLD_SALE_SOURCE_URLS = {
  selling:
    "https://www.qld.gov.au/transport/buying/rules/selling",
  transferOnline:
    "https://www.qld.gov.au/transport/registration/transfer/online",
  transferInPerson:
    "https://www.qld.gov.au/transport/registration/transfer/rego",
  cancel:
    "https://www.qld.gov.au/transport/registration/cancel",
  safetyCertificate:
    "https://www.qld.gov.au/transport/registration/roadworthy",
  unregisteredSale:
    "https://www.qld.gov.au/transport/buying/unregistered/selling",
  unregisteredMovement:
    "https://www.qld.gov.au/transport/buying/unregistered/uvp",
  gasCertificate:
    "https://www.qld.gov.au/emergency/safety/home/gas/gas-fuelled-engines",
  licenceRegister:
    "https://www.qld.gov.au/community/fair-trading/regulated-industries-licensing-and-legislation/motor-industry-regulation/check-a-motor-licence",
  ppsr:
    "https://www.ppsr.gov.au/searching/do-used-car-or-vehicle-search",
  checkRegistration:
    "https://www.service.transport.qld.gov.au/checkrego/public/Welcome.xhtml",
  interstate:
    "https://www.qld.gov.au/transport/registration/transfer/interstate",
} as const;

export type QldSaleSourceKey = keyof typeof QLD_SALE_SOURCE_URLS;

export const QLD_SALE_SOURCE_LABELS: Record<QldSaleSourceKey, string> = {
  selling: "Selling a used vehicle — Queensland Government",
  transferOnline: "Transfer registration online — Queensland Government",
  transferInPerson: "Transfer registration in person — Queensland Government",
  cancel: "Cancel registration — Queensland Government",
  safetyCertificate: "Safety certificates — Queensland Government",
  unregisteredSale:
    "Selling and moving unregistered vehicles — Queensland Government",
  unregisteredMovement: "Unregistered vehicle permits — Queensland Government",
  gasCertificate: "Gas-fuelled engines — Queensland Government",
  licenceRegister: "Check a motor licence — Queensland Government",
  ppsr: "Used-car and vehicle searches — Australian Government PPSR",
  checkRegistration: "Check vehicle registration — Queensland Government",
  interstate:
    "Moving vehicle registration to or from Queensland — Queensland Government",
};

export type QldRegistrationStatus =
  | "qld-registered"
  | "already-unregistered"
  | "interstate-or-unknown";

export type QldSaleOutcome =
  | "transfer-registration"
  | "cancel-for-parts"
  | "not-sure";

export type QldBuyerType =
  | "private-or-unverified"
  | "verified-licensed-dealer"
  | "not-sure";

export type YesNoUnsure = "yes" | "no" | "unsure";

export type VehicleMovementPlan =
  | "not-moving"
  | "professional-transport"
  | "road-movement"
  | "unsure";

export interface QldVehicleSalePathwayInputs {
  registrationStatus: QldRegistrationStatus;
  outcome: QldSaleOutcome;
  buyerType: QldBuyerType;
  gasSystem: YesNoUnsure;
  personalisedPlates: YesNoUnsure;
  financeOrSecurity: YesNoUnsure;
  specialAuthority: YesNoUnsure;
  movementPlan: VehicleMovementPlan;
}

export interface QldVehicleSalePathwayStep {
  id: string;
  heading: string;
  detail: string;
  sources: QldSaleSourceKey[];
}

export interface QldVehicleSalePathwayResult {
  heading: string;
  summary: string;
  steps: QldVehicleSalePathwayStep[];
  cautions: string[];
  sourceKeys: QldSaleSourceKey[];
}

export const DEFAULT_QLD_VEHICLE_SALE_INPUTS: QldVehicleSalePathwayInputs = {
  registrationStatus: "interstate-or-unknown",
  outcome: "not-sure",
  buyerType: "not-sure",
  gasSystem: "unsure",
  personalisedPlates: "unsure",
  financeOrSecurity: "unsure",
  specialAuthority: "unsure",
  movementPlan: "unsure",
};

function uniqueSourceKeys(
  steps: QldVehicleSalePathwayStep[],
): QldSaleSourceKey[] {
  return [...new Set(steps.flatMap((step) => step.sources))];
}

/**
 * Builds a conservative information checklist from the seller's selections.
 * It deliberately does not determine ownership, licence status, legal rights,
 * or whether a particular transaction is valid.
 */
export function buildQldVehicleSalePathway(
  inputs: QldVehicleSalePathwayInputs,
): QldVehicleSalePathwayResult {
  const steps: QldVehicleSalePathwayStep[] = [];
  const cautions: string[] = [
    "This checklist is general information. Confirm the current path with Transport and Main Roads or an appropriately qualified adviser before relying on it.",
  ];

  const addStep = (step: QldVehicleSalePathwayStep) => steps.push(step);

  addStep({
    id: "authority",
    heading: "Confirm authority and identify the transaction",
    detail:
      "Confirm who is entitled to sell the vehicle, identify the buyer, match the vehicle identifiers, and agree on the registration outcome, amount, payment, collection and receipt terms before handover.",
    sources: ["selling", "checkRegistration"],
  });

  if (inputs.registrationStatus === "interstate-or-unknown") {
    addStep({
      id: "jurisdiction",
      heading: "Confirm the registration jurisdiction first",
      detail:
        "Check whether the vehicle is currently Queensland registered, already unregistered, or registered in another state or territory. An interstate registration cannot be transferred through the ordinary Queensland transfer pathway; follow the issuing authority's process.",
      sources: ["checkRegistration", "interstate"],
    });
    addStep({
      id: "record",
      heading: "Prepare a factual handover record",
      detail:
        "Record the vehicle, parties, date, agreed amount, payment confirmation, registration status, items handed over and any official reference numbers. Use the printable record below only as a recordkeeping aid.",
      sources: ["unregisteredSale", "transferInPerson"],
    });
    cautions.push(
      "Do not use the Queensland transfer, cancellation or certificate result until the registration status and issuing jurisdiction are confirmed.",
    );

    if (inputs.financeOrSecurity !== "no") {
      addStep({
        id: "finance",
        heading: "Resolve finance or a registered security interest",
        detail:
          "Obtain a current lender payout and agreed discharge process where finance may remain. A PPSR search can show a registered security interest and usually recorded stolen or written-off information, but not the owner or the amount owing.",
        sources: ["ppsr"],
      });
    }

    return {
      heading: "Confirm the vehicle's status before choosing a pathway",
      summary:
        "The answers do not yet establish which Queensland seller process applies. Check the live registration record and issuing jurisdiction first.",
      steps,
      cautions,
      sourceKeys: uniqueSourceKeys(steps),
    };
  }

  if (inputs.financeOrSecurity !== "no") {
    addStep({
      id: "finance",
      heading: "Resolve finance or a registered security interest",
      detail:
        "Obtain a current lender payout and agreed discharge process where finance may remain. A PPSR search can show a registered security interest and usually recorded stolen or written-off information, but not the owner or the amount owing.",
      sources: ["ppsr"],
    });
  }

  if (inputs.specialAuthority !== "no") {
    addStep({
      id: "special-authority",
      heading: "Resolve any special authority before handover",
      detail:
        "Pause where an insurer, deceased estate, company, joint registration, representative or written-off-vehicle issue may affect who can act or what must happen next. Obtain the applicable documents and confirm the official pathway.",
      sources: ["selling", "cancel"],
    });
  }

  if (inputs.buyerType !== "private-or-unverified") {
    addStep({
      id: "buyer-licence",
      heading: "Verify any claimed motor-dealer licence",
      detail:
        "Search Queensland's public motor-licence register using the supplied holder or business details. A business description, ABN, website or cash-for-cars wording does not by itself establish that the buyer is a licensed motor dealer.",
      sources: ["licenceRegister"],
    });
  }

  if (inputs.registrationStatus === "qld-registered") {
    if (inputs.outcome === "transfer-registration") {
      if (inputs.buyerType === "verified-licensed-dealer") {
        addStep({
          id: "dealer-certificate",
          heading: "Confirm the direct licensed-dealer acquisition path",
          detail:
            "Queensland says a safety certificate is not needed when a vehicle is traded directly to a licensed motor dealer. Keep the licence-search details, receipt and buyer identity, and confirm the seller notification or registration step that the dealer will use.",
          sources: ["safetyCertificate", "licenceRegister", "selling"],
        });
      } else {
        addStep({
          id: "safety-certificate",
          heading: "Check the safety-certificate requirement",
          detail:
            "For disposal of a registered light vehicle, obtain and give the buyer a current safety certificate unless an official exemption applies. Do not use the licensed-dealer exception for an unverified buyer.",
          sources: ["safetyCertificate", "selling"],
        });
      }

      if (inputs.gasSystem !== "no") {
        addStep({
          id: "gas-certificate",
          heading: "Check every fitted gas system",
          detail:
            "A registered vehicle with a gas system generally needs an inspection by an authorised gas installer and a vehicle inspection certificate that is no more than three months old when registration transfers. Gas-equipped registrations cannot use every online-transfer pathway.",
          sources: ["gasCertificate", "transferOnline"],
        });
      }

      if (inputs.personalisedPlates !== "no") {
        addStep({
          id: "personalised-plates",
          heading: "Confirm the personalised or customised plate path",
          detail:
            "Queensland's online seller transfer is not available while personalised or customised plates are attached. Check the current plate and in-person transfer instructions before handover.",
          sources: ["transferOnline", "transferInPerson"],
        });
      }

      if (inputs.buyerType !== "verified-licensed-dealer") {
        addStep({
          id: "registered-transfer",
          heading: "Complete the seller-side registration transfer",
          detail:
            "Use the eligible online service or the current in-person process. TMR recommends completing the F3520 Seller's Copy (Part B) and having the buyer sign it on the day of sale, even when an online transfer is intended. The registration transfer must be completed within 14 days.",
          sources: ["transferOnline", "transferInPerson"],
        });
      }

      addStep({
        id: "registered-record",
        heading: "Keep the receipt and official confirmation",
        detail:
          "Keep a signed handover record, the transfer confirmation or completed seller copy, and the certificate details that apply. Check that the registration no longer appears in your name, remove the vehicle from registration direct debit and update the toll account.",
        sources: ["transferOnline", "transferInPerson", "selling"],
      });
    } else if (inputs.outcome === "cancel-for-parts") {
      addStep({
        id: "deregister-for-parts",
        heading: "Deregister the vehicle before a for-parts sale",
        detail:
          "Queensland says a vehicle sold for parts must be deregistered before it is sold. Complete the current cancellation process rather than treating it as an ordinary registered transfer.",
        sources: ["safetyCertificate", "cancel"],
      });
      addStep({
        id: "cancel-registration",
        heading: "Complete cancellation and the plate step",
        detail:
          "Complete and sign form F3517. Number plates generally must be surrendered, although personalised or customised, lost, stolen, destroyed, already-surrendered and written-off situations can follow different instructions. Keep the cancellation and plate receipt.",
        sources: ["cancel"],
      });
      addStep({
        id: "unregistered-record",
        heading: "Sign and retain the unregistered-sale record",
        detail:
          "Both parties should sign and keep a record that includes the VIN, chassis or engine identifier, make and model, and sale date. The printable record below includes those minimum fields plus optional transaction details.",
        sources: ["unregisteredSale"],
      });
    } else {
      addStep({
        id: "choose-outcome",
        heading: "Choose transfer or cancellation before handover",
        detail:
          "A registered transfer and cancellation before an unregistered or for-parts sale are different processes. Confirm the intended outcome with TMR and the buyer before certificates, plates, movement or collection are arranged.",
        sources: ["selling", "transferOnline", "cancel"],
      });
      cautions.push(
        "Do not hand over a currently registered vehicle for parts until the required deregistration and plate steps are confirmed and completed.",
      );
    }
  } else {
    addStep({
      id: "unregistered-certificate",
      heading: "Use the unregistered-sale requirements",
      detail:
        "Queensland allows an already-unregistered vehicle to be sold without a safety certificate. Do not describe the handover record as a registration transfer.",
      sources: ["unregisteredSale", "safetyCertificate"],
    });
    addStep({
      id: "unregistered-record",
      heading: "Sign and retain the unregistered-sale record",
      detail:
        "Both parties should sign and keep a record that includes the VIN, chassis or engine identifier, make and model, and sale date. The printable record below includes those minimum fields plus optional transaction details.",
      sources: ["unregisteredSale"],
    });
  }

  const movementNeedsUnregisteredRules =
    inputs.registrationStatus === "already-unregistered" ||
    (inputs.registrationStatus === "qld-registered" &&
      inputs.outcome === "cancel-for-parts");

  if (movementNeedsUnregisteredRules) {
    if (inputs.movementPlan === "road-movement") {
      addStep({
        id: "road-movement",
        heading: "Check the exact unregistered movement before travel",
        detail:
          "Do not assume a permit is always required or never required. TMR lists limited direct registration-related journeys that may be made without a permit when the vehicle is safe and the required CTP certificate is carried; other listed journeys require an unregistered vehicle permit. Follow the most direct route and current plate instructions. An unsafe vehicle, or one that has failed an inspection, must be transported rather than driven or towed under a permit.",
        sources: ["unregisteredMovement"],
      });
    } else if (inputs.movementPlan === "professional-transport") {
      addStep({
        id: "professional-transport",
        heading: "Confirm the transport method before collection",
        detail:
          "Tell the transport provider that the vehicle is unregistered and disclose whether it is safe, rolls, steers and brakes. Confirm the lawful loading and transport method; a sale record does not authorise road use.",
        sources: ["unregisteredMovement"],
      });
    } else if (inputs.movementPlan === "unsure") {
      addStep({
        id: "movement-undecided",
        heading: "Decide how the unregistered vehicle will move",
        detail:
          "Check the TMR movement rules before pickup or travel. The answer changes with the journey purpose, vehicle safety, CTP cover, permit eligibility, plates and whether the vehicle will be driven, towed or transported.",
        sources: ["unregisteredMovement"],
      });
    }
  }

  cautions.push(
    "The printable handover record does not prove ownership, verify identity or licence status, replace an official TMR or Office of Fair Trading form or notice, or waive legal rights.",
  );

  const heading =
    inputs.registrationStatus === "already-unregistered"
      ? "Already-unregistered Queensland sale checklist"
      : inputs.outcome === "cancel-for-parts"
        ? "Cancellation and for-parts sale checklist"
        : inputs.outcome === "transfer-registration"
          ? "Queensland registered-transfer checklist"
          : "Confirm the Queensland transaction outcome";

  const summary =
    inputs.registrationStatus === "already-unregistered"
      ? "Prepare the signed unregistered-sale record and confirm any road movement separately."
      : inputs.outcome === "cancel-for-parts"
        ? "Complete deregistration and the applicable plate step before the for-parts sale, then retain the signed record."
        : inputs.outcome === "transfer-registration"
          ? "Prepare the certificates, buyer details, seller-side transfer and retained records that apply to this registered sale."
          : "Decide whether registration will transfer or be cancelled before the vehicle is handed over.";

  return {
    heading,
    summary,
    steps,
    cautions,
    sourceKeys: uniqueSourceKeys(steps),
  };
}
