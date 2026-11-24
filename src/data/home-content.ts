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
  "Caraway is a Brisbane-based car buyer. Tell us about your vehicle, and a person — not an algorithm — reviews the details and confirms whether we can make an offer. If we buy, the offer is in writing before the truck is booked, pickup is included anywhere we collect across Greater Brisbane, and the payment method and timing are agreed before your car leaves.";

export const homeCashSections: HomeContentSection[] = [
  {
    heading: "How to get a cash for cars quote in Brisbane",
    paragraphs: [
      "Send the make, model, year, approximate kilometres, suburb and overall condition through the quote form, or call us. Tell us whether the car starts, rolls, steers and brakes, and whether it has all its wheels and keys. Photos of each side, the interior, the odometer and any damage let us assess what is visible before we confirm a no-obligation offer.",
      "No web page can price an individual car on its own, so we never show an instant figure. A human-reviewed assessment takes a few minutes of your time and gives you a number you can actually rely on.",
    ],
    checklistItems: [
      "Make, model, variant, year, kilometres and registration status",
      "Whether it starts, rolls, steers and brakes, and has all wheels and keys",
      "Known faults, warning lights, body damage, missing parts and modifications",
      "Finance, insurer, estate or other ownership details that affect the sale",
      "Your suburb plus driveway, garage, gate, slope or clearance details",
    ],
    supportLink: {
      href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#give-buyers-the-full-picture",
      label: "See the full vehicle-detail and photo checklist",
    },
  },
  {
    heading: "What affects how much cash you get for your car",
    paragraphs: [
      "An offer reflects the vehicle's identity, age, kilometres, mechanical and body condition, completeness, location and access, plus current resale, parts and metal demand in Brisbane. A complete, repairable or in-demand vehicle is usually worth more than a stripped or burnt-out shell.",
      "Be upfront about warning lights, missing components, accident, hail or flood damage, finance and insurer involvement. The agreed offer only changes if the car materially differs from what you described — so accurate details are what protect your price.",
    ],
    supportLink: {
      href: "/blog/how-much-is-my-car-worth-brisbane",
      label: "How Brisbane car values are worked out",
    },
  },
  {
    heading: "Cars we buy for cash in Brisbane",
    paragraphs: [
      "We assess sedans, hatchbacks, wagons, utes, SUVs, four-wheel drives, vans and light commercial vehicles — running or not, registered or unregistered, damaged, old, unwanted or at the end of its life. Fleet, estate and multi-vehicle clearances are welcome too.",
      "An assessment isn't a promise to buy every vehicle: identification, ownership authority, condition, location and safe access all matter, and we tell you straight away if we can't help.",
    ],
  },
  {
    heading: "Car pickup across Greater Brisbane",
    paragraphs: [
      "We quote for collections across Brisbane and surrounding parts of Logan, Ipswich, Redlands and Moreton Bay. When Caraway buys your car, pickup is included as long as the vehicle and access match the details you gave us.",
      "Timing depends on the suburb, the vehicle's condition, access, traffic and the operator schedule, so we confirm a collection window with you before anyone is dispatched.",
    ],
    supportLink: {
      href: "/locations",
      label: "Check the Brisbane suburbs we cover",
    },
  },
  {
    heading: "Getting paid, and the collection check",
    paragraphs: [
      "Before loading, the pickup operator checks the car matches its description. The agreed payment method and timing are confirmed with you before collection, and you receive a signed receipt and buyer details for your records.",
      "Our rule for any cash for cars sale in Brisbane, with us or anyone else: never hand over a vehicle until the agreed payment arrangement and the buyer's details are clear.",
    ],
    supportLink: {
      href: "/how-it-works",
      label: "See how offers, pickup, payment and records work",
    },
  },
  {
    heading: "Paperwork to have ready",
    paragraphs: [
      "Have current photo ID, every key you hold, and any registration, finance, insurer, estate or ownership records. Remove personal belongings and take the car off any toll account. You stay responsible for completing — and keeping confirmation of — the Queensland seller steps that apply to your sale.",
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
