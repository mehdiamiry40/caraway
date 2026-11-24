export interface SellerScenario {
  id: string;
  title: string;
  description: string;
  location: string;
  vehicle: string;
}

export const sellerScenarios: SellerScenario[] = [
  {
    id: "non-running-car",
    title: "Non-running car in a carport",
    description:
      "Share whether the vehicle rolls, steers, has keys, and can be reached by a flatbed. Those details help confirm the right loading equipment before dispatch.",
    location: "Chermside",
    vehicle: "Older family sedan",
  },
  {
    id: "insurance-write-off",
    title: "Insurance write-off retained by the owner",
    description:
      "Provide the VIN, WOVR classification, insurer settlement status, and an accurate damage summary. Confirm authority to sell before arranging collection.",
    location: "Ipswich",
    vehicle: "Collision-damaged vehicle",
  },
  {
    id: "apartment-pickup",
    title: "Vehicle in apartment parking",
    description:
      "Confirm height clearance, loading-bay access, body-corporate requirements, and whether the car can roll. Tight access may change the equipment or pickup window.",
    location: "Toowong",
    vehicle: "Compact hatchback",
  },
  {
    id: "deceased-estate",
    title: "Vehicle from a deceased estate",
    description:
      "The executor or administrator should have identity and estate documents that establish authority to sell, plus any registration and finance records available.",
    location: "Indooroopilly",
    vehicle: "Estate vehicle",
  },
  {
    id: "unregistered-project",
    title: "Long-unregistered project car",
    description:
      "Keep a signed receipt with the VIN or chassis number, sale date, price, vehicle details, and both parties' details. Arrange towing rather than driving it.",
    location: "Logan",
    vehicle: "Unfinished project car",
  },
  {
    id: "multiple-vehicles",
    title: "Several vehicles on one property",
    description:
      "List each VIN, condition, completeness, access point, and ownership record separately. This lets the buyer plan truck capacity and issue clear sale records.",
    location: "Caboolture",
    vehicle: "Two or more vehicles",
  },
];
