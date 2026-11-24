/**
 * Long-form homepage copy for the primary "cash for cars Brisbane" query.
 *
 * The homepage owns that query (the former exact-match service page now
 * redirects here), so this is where the service detail lives: how a
 * quote is requested, what moves an offer, what we buy, pickup, payment and
 * paperwork. Claims stay within what Caraway can back — no fixed prices, no
 * promised pickup timing, and payment terms confirmed per job.
 */

export interface HomeContentSection {
  heading: string;
  paragraphs: string[];
  checklistItems?: string[];
  supportLink?: { href: string; label: string };
}

export const HOME_CASH_INTRO =
  "Caraway is a Brisbane-based car buyer. Tell us about your car and a person reviews the details and tells you if we can make an offer. If we buy, you get the offer in writing before the truck is booked, towing is free wherever we collect in Greater Brisbane, and we agree how and when you're paid before your car leaves.";

export const homeCashSections: HomeContentSection[] = [
  {
    heading: "How to get a cash for cars quote in Brisbane",
    paragraphs: [
      "Send us the make, model, year, rough kilometres, suburb and condition through the quote form, or call us. Tell us if the car starts, rolls, steers and brakes, and if it has all its wheels and keys. Photos of each side, the interior, the odometer and any damage help us check the car before we confirm an offer. There is no obligation.",
      "A web page can't price your car on its own, so we don't show an instant figure. A person reviews your details. It takes a few minutes of your time and gives you a number you can rely on.",
    ],
    checklistItems: [
      "Make, model, variant, year, kilometres and rego status",
      "If it starts, rolls, steers and brakes, and has all wheels and keys",
      "Known faults, warning lights, body damage, missing parts and modifications",
      "Any finance, insurance, estate or ownership details that affect the sale",
      "Your suburb, plus any driveway, garage, gate, slope or clearance limits",
    ],
    supportLink: {
      href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#give-buyers-the-full-picture",
      label: "See the full details and photo checklist",
    },
  },
  {
    heading: "What affects how much cash you get for your car",
    paragraphs: [
      "Your offer depends on what the car is, its age, kilometres, mechanical and body condition, whether it is complete, where it is and the access. Current demand in Brisbane for resale, parts and metal matters too. A complete, repairable or in-demand car is usually worth more than a stripped or burnt-out shell.",
      "Tell us about warning lights, missing parts, accident, hail or flood damage, finance and any insurance claim. The agreed offer only changes if the car is materially different from what you described, so accurate details protect your price.",
    ],
    supportLink: {
      href: "/blog/how-much-is-my-car-worth-brisbane",
      label: "How Brisbane car values are worked out",
    },
  },
  {
    heading: "Cars we buy for cash in Brisbane",
    paragraphs: [
      "We look at sedans, hatchbacks, wagons, utes, SUVs, four-wheel drives, vans and light commercials. Running or not, registered or not, damaged, old, unwanted or at the end of its life. Fleet, estate and multi-car clearances are welcome too.",
      "We can't buy every car. ID, the right to sell, condition, location and safe access all matter, and we tell you straight away if we can't help.",
    ],
  },
  {
    heading: "Car pickup across Greater Brisbane",
    paragraphs: [
      "We quote for pickups in Brisbane and nearby parts of Logan, Ipswich, Redlands and Moreton Bay. Towing is free when we buy your car, as long as the car and the access match what you told us.",
      "Timing depends on your suburb, the car's condition, access, traffic and the truck schedule. We confirm a pickup time with you before anyone is sent.",
    ],
    supportLink: {
      href: "/locations",
      label: "Check the Brisbane suburbs we cover",
    },
  },
  {
    heading: "Getting paid, and the pickup check",
    paragraphs: [
      "Before loading, the operator checks the car matches its description. We confirm how and when you're paid before pickup, and you get a signed receipt and our details for your records.",
      "Our rule for any cash for cars sale in Brisbane, with us or anyone else: don't hand over the car until the payment and the buyer's details are clear.",
    ],
    supportLink: {
      href: "/how-it-works",
      label: "See how offers, pickup, payment and records work",
    },
  },
  {
    heading: "Paperwork to have ready",
    paragraphs: [
      "Have current photo ID, every key you hold, and any rego, finance, insurance, estate or ownership records. Take out your belongings and take the car off any toll account. You are still responsible for the Queensland seller steps that apply to your sale. Complete them and keep the confirmation.",
    ],
    supportLink: {
      href: "/blog/what-paperwork-to-sell-a-car-qld#at-a-glance-queensland-seller-paperwork-checklist",
      label: "Open the Queensland seller paperwork checklist",
    },
  },
];

/** Specialist pages linked from the homepage's "cars we buy" block. */
export const homeVehicleLinks = [
  { label: "Car removal", href: "/car-removal-brisbane" },
  { label: "Sell my car", href: "/sell-my-car-brisbane" },
  { label: "Scrap cars", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged & flooded cars", href: "/damaged-cars-brisbane" },
  { label: "Hail-damaged cars", href: "/hail-damaged-cars-brisbane" },
  { label: "Unregistered cars", href: "/unregistered-cars-brisbane" },
  { label: "Toyota HiLux", href: "/sell-toyota-hilux-brisbane" },
] as const;
