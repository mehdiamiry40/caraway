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
      "Tell us if the car rolls, steers, has keys, and can be reached by a flatbed. That helps us book the right truck.",
    location: "Chermside",
    vehicle: "Older family sedan",
  },
  {
    id: "insurance-write-off",
    title: "Insurance write-off retained by the owner",
    description:
      "Give us the VIN, the WOVR classification, where the insurance settlement is up to, and an accurate summary of the damage. Confirm you have the right to sell before you book a pickup.",
    location: "Ipswich",
    vehicle: "Collision-damaged vehicle",
  },
  {
    id: "apartment-pickup",
    title: "Vehicle in apartment parking",
    description:
      "Check the height clearance, loading-bay access, body-corporate rules, and whether the car rolls. Tight access may change the truck or the pickup time.",
    location: "Toowong",
    vehicle: "Compact hatchback",
  },
  {
    id: "deceased-estate",
    title: "Vehicle from a deceased estate",
    description:
      "The executor or administrator needs ID and estate documents that show they can sell, plus any rego and finance records.",
    location: "Indooroopilly",
    vehicle: "Estate vehicle",
  },
  {
    id: "unregistered-project",
    title: "Long-unregistered project car",
    description:
      "Keep a signed receipt with the VIN or chassis number, sale date, price, car details, and both parties' details. Have it towed. Don't drive it.",
    location: "Logan",
    vehicle: "Unfinished project car",
  },
  {
    id: "multiple-vehicles",
    title: "Several vehicles on one property",
    description:
      "List each car's VIN, condition, missing parts, access point and ownership record. The buyer can then plan the trucks and give you clear sale records.",
    location: "Caboolture",
    vehicle: "Two or more vehicles",
  },
];
