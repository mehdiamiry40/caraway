import { cache } from "react";
import { BUSINESS } from "@/lib/site";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface ServiceSection {
  heading: string;
  content: string;
  checklistItems?: string[];
  image?: ServiceImage;
  supportLink?: {
    href: string;
    label: string;
  };
}

export interface ServicePage {
  slug: string;
  updatedAt?: string;
  reviewedAt?: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: ServiceSection[];
  faqs: ServiceFAQ[];
  relatedServices: string[];
  relatedSuburbs: string[];
}

export const services: ServicePage[] = [
  {
    slug: "cash-for-cars-brisbane",
    updatedAt: "2026-08-07",
    reviewedAt: "2026-08-07",
    title: "Cash for Cars Brisbane | Vehicle Quote & Pickup",
    metaDescription: `Cash for cars Brisbane: request an offer based on your vehicle details, with pickup included when Caraway buys. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Cars Brisbane — Vehicle Quotes & Pickup",
    intro:
      "Caraway is a Brisbane vehicle buyer for owners who want a direct quote and collection option. Share accurate details about the car and its location, and we will assess whether we can make an offer. Pickup is included when Caraway buys the vehicle, and the payment method and timing are confirmed before collection.",
    sections: [
      {
        heading: "How to Request a Cash-for-Cars Quote",
        content:
          "Provide the make, model, year, kilometres, suburb, overall condition, and whether the car starts, rolls, steers, and has all of its wheels. Photos help us assess visible damage and completeness. We review those details before confirming a no-obligation offer; a web page or estimator cannot determine the final value of an individual vehicle.",
        checklistItems: [
          "Make, model, variant, year, approximate kilometres, and registration status.",
          "Whether it starts, rolls, steers, brakes, and has all wheels and keys.",
          "Known faults, warning lights, body damage, missing components, and modifications.",
          "Finance, insurer, estate, or other ownership-authority details relevant to the sale.",
          "Exact suburb plus driveway, garage, clearance, slope, surface, gate, or obstacle details.",
          "Current photos of every side, the interior, odometer, damage, missing parts, and collection access.",
        ],
        image: {
          src: "/images/cash-for-cars-brisbane-quote-readiness-v1.jpg",
          alt: "Vehicle quote-readiness diagram showing front, rear and side photos, the interior and odometer, visible damage, and driveway access",
          caption:
            "A complete set of current vehicle and access photos helps a buyer assess what is visible before confirming an individual quote.",
          width: 1200,
          height: 630,
        },
        supportLink: {
          href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#give-buyers-the-full-picture",
          label: "See the full vehicle-detail and photo checklist",
        },
      },
      {
        heading: "What Affects a Vehicle Offer",
        content:
          "The quote depends on the vehicle's identity, age, kilometres, mechanical and body condition, completeness, location, access, and current resale, parts, or material demand. Tell us about warning lights, missing components, accident or storm damage, finance, insurer involvement, and access constraints. The agreed offer may be revised only if the vehicle materially differs from the supplied description.",
        supportLink: {
          href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#compare-three-vehicle-buyer-quotes",
          label: "Compare three written vehicle-buyer quotes",
        },
      },
      {
        heading: "Vehicles and Conditions We Can Assess",
        content:
          "We assess many sedans, hatchbacks, wagons, utes, SUVs, four-wheel drives, vans, and light commercial vehicles. Running, non-running, registered, unregistered, damaged, unwanted, and end-of-life cars can be considered. An assessment is not a promise to buy every vehicle; identification, ownership authority, condition, location, and safe access all matter.",
      },
      {
        heading: "Pickup Across Greater Brisbane",
        content:
          "We quote for collections across Brisbane and surrounding parts of Logan, Ipswich, Redlands, and Moreton Bay. If Caraway buys the vehicle, pickup is included when the car and access match the information provided. Availability depends on the exact suburb, vehicle condition, access, traffic, and operator schedule, so we confirm a collection window before dispatch.",
      },
      {
        heading: "Payment and the Collection Check",
        content:
          "Before loading, the assigned pickup operator checks that the vehicle matches the description. Caraway confirms the agreed payment method and timing with you before collection. You receive a signed receipt and buyer details for your records. Never hand over a vehicle until the agreed payment arrangement and purchaser details are clear.",
      },
      {
        heading: "Documents to Have Ready",
        content:
          "Have current photo identification, every key you hold, and relevant registration, finance, insurer, estate, or ownership records. Remove personal belongings and deal with any toll account linked to the registration. You remain responsible for completing and retaining confirmation of the Queensland seller steps that apply to the sale.",
        supportLink: {
          href: "/blog/what-paperwork-to-sell-a-car-qld#at-a-glance-queensland-seller-paperwork-checklist",
          label: "Open the Queensland seller paperwork checklist",
        },
      },
    ],
    faqs: [
      {
        question: "How much cash will I get for my car in Brisbane?",
        answer:
          "There is no reliable fixed price without the vehicle details. Make, model, year, kilometres, condition, completeness, location, access, and current demand all affect the quote.",
      },
      {
        question: "Is pickup included in the offer?",
        answer:
          "Pickup is included when Caraway buys the vehicle and the car and access match the details supplied. We confirm the collection plan before dispatch.",
      },
      {
        question: "Do you buy non-running or unregistered cars?",
        answer:
          "We can assess non-running and unregistered vehicles. Tell us how the car moves, whether it is complete, and what ownership records you have so we can confirm the quote and recovery plan.",
      },
      {
        question: "When will the car be collected?",
        answer:
          "Timing depends on location, vehicle condition, access, traffic, and operator availability. We provide a collection window after those details are confirmed.",
      },
      {
        question: "Who pays the most for cars in Brisbane?",
        answer:
          "No buyer pays the most for every vehicle. Give each buyer the same vehicle, condition, location, and access details, then compare the written net amount after deductions, pickup terms, payment timing, revision conditions, and buyer identity.",
      },
      {
        question: "Where should I sell my car in Brisbane?",
        answer:
          "Compare a private listing, dealer trade-in, and direct vehicle buyer by likely net proceeds, preparation, fees, time, appointments, and certainty. A clean registered car may suit a private sale, while a direct buyer may suit an owner who prefers one quote and an agreed collection plan.",
      },
    ],
    relatedServices: [
      "car-removal-brisbane",
      "sell-my-car-brisbane",
      "scrap-car-removal-brisbane",
    ],
    relatedSuburbs: ["toowong", "logan", "redcliffe", "capalaba"],
  },
  {
    slug: "car-removal-brisbane",
    updatedAt: "2026-08-07",
    reviewedAt: "2026-08-07",
    title: "Car Removal Brisbane | Pickup Included When We Buy",
    metaDescription: `Car removal Brisbane for unwanted, damaged, and non-running vehicles. Pickup is included when Caraway buys. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Car Removal Brisbane — Pickup Included When We Buy",
    intro:
      "Caraway assesses unwanted, damaged, non-running, and end-of-life vehicles across Greater Brisbane for purchase and collection. Pickup is included when Caraway buys the vehicle. Availability and equipment depend on the car's condition, exact location, and safe access.",
    sections: [
      {
        heading: "How Brisbane Car Removal Works",
        content:
          "Share the make, model, year, condition, suburb, and access details. We will assess whether we can buy the vehicle and confirm an offer, a collection window, and the equipment required. At pickup, the operator checks the vehicle against the description, confirms the agreed payment arrangement before loading, and provides a signed receipt and buyer details.",
        supportLink: {
          href: "/blog/tow-truck-cost-brisbane#when-a-vehicle-sale-can-include-pickup",
          label: "Understand purchase pickup versus general towing",
        },
      },
      {
        heading: "What Included Pickup Means",
        content:
          "There is no separate towing deduction when Caraway buys the vehicle and the car and access match the supplied details. This is a vehicle-purchase service, not a general towing service. If we cannot buy the vehicle or safely arrange collection, we will tell you before a pickup is booked.",
        supportLink: {
          href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#compare-three-vehicle-buyer-quotes",
          label: "Compare pickup costs and effective net offers",
        },
      },
      {
        heading: "Non-Running and Difficult-to-Move Cars",
        content:
          "Tell us whether the vehicle starts, rolls, steers, brakes, and has all wheels and keys. Also disclose seized brakes, flat or missing tyres, locked steering, loose parts, fire damage, or severe structural damage. Suitable loading equipment may be arranged after the condition and access are reviewed, but not every vehicle can be recovered from every position.",
      },
      {
        heading: "Access Details to Confirm Before Booking",
        content:
          "Photos and measurements are useful for underground car parks, steep or narrow driveways, backyards, soft ground, locked compounds, height limits, and vehicles blocked by other objects. Clear a safe path where possible. Accurate access details protect the agreed quote and reduce the risk of a failed collection.",
        checklistItems: [
          "Whether the vehicle starts, rolls, steers, brakes, and has keys.",
          "All wheels and tyres, including flat or missing tyres, seized brakes, and loose components.",
          "The exact vehicle position and path to it, including gates, turns, parked vehicles, and obstacles.",
          "Available width and height, driveway slope, ground surface, overhead clearance, and loading space.",
          "Photos from the access point to the vehicle, plus measurements wherever clearance is limited.",
        ],
        image: {
          src: "/images/car-removal-brisbane-access-readiness-v1.jpg",
          alt: "Vehicle pickup-access diagram showing wheel and steering checks, gate width, height clearance, driveway slope and surface, turns, and obstacles",
          caption:
            "Show the full path from the street to the vehicle so the operator can assess movement, clearance, surface, turns, and obstacles before booking.",
          width: 1200,
          height: 630,
        },
        supportLink: {
          href: "/blog/preparing-your-car-for-pickup#plates-rego-and-tow-truck-access",
          label: "Prepare the vehicle, documents, and access for pickup",
        },
      },
      {
        heading: "Car Removal Coverage Around Brisbane",
        content:
          "We assess pickups across Brisbane and surrounding parts of Logan, Ipswich, Redlands, and Moreton Bay. Scheduling depends on the suburb, vehicle condition, access, traffic, and operator availability. A collection window is confirmed before dispatch rather than assumed from a postcode alone.",
      },
      {
        heading: "Paperwork and What Happens After Collection",
        content:
          "Bring current photo identification, all keys, and relevant registration, finance, insurer, estate, or ownership records. You remain responsible for the Queensland seller steps that apply. Depending on its condition and lawful status, a purchased vehicle may be resold, used for parts, or transferred to an appropriate downstream specialist.",
        supportLink: {
          href: "/blog/what-paperwork-to-sell-a-car-qld#at-a-glance-queensland-seller-paperwork-checklist",
          label: "Open the Queensland seller paperwork checklist",
        },
      },
    ],
    faqs: [
      {
        question: "Is car removal free in Brisbane?",
        answer:
          "Pickup is included when Caraway buys the vehicle and its condition and access match the details provided. We do not offer a universal free towing service for vehicles we do not buy.",
      },
      {
        question: "Can you remove a car that does not run?",
        answer:
          "We can assess non-running vehicles. Tell us whether the car rolls, steers, brakes, and has all wheels so the required loading method can be reviewed before booking.",
      },
      {
        question: "Can you collect from a garage or backyard?",
        answer:
          "Possibly. Send photos and measurements showing clearance, slope, surface, turns, gates, and obstacles. Collection depends on safe operator and equipment access.",
      },
      {
        question: "What do I need at pickup?",
        answer:
          "Have current photo ID, all keys you hold, and the relevant ownership, registration, finance, insurer, or estate documents. Remove personal belongings before the operator arrives.",
      },
      {
        question: "What is the quickest lawful way to get rid of an old car in Brisbane?",
        answer:
          "There is no guaranteed quickest route. To reduce avoidable delay, have photo ID, keys, relevant ownership or registration records, condition photos, and accurate access details ready, then confirm the buyer identity, written sale terms, payment arrangement, and collection window before dispatch.",
      },
    ],
    relatedServices: [
      "cash-for-cars-brisbane",
      "scrap-car-removal-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["logan", "springwood", "beenleigh", "moorooka"],
  },
  {
    slug: "sell-my-car-brisbane",
    updatedAt: "2026-08-07",
    title: "Sell My Car Brisbane | Direct Vehicle-Buyer Quote",
    metaDescription: `Sell your car in Brisbane with a direct vehicle-buyer quote and pickup included when Caraway buys. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell My Car Brisbane — A Direct Buyer Option",
    intro:
      "If you are deciding how to sell a car in Brisbane, Caraway provides a direct vehicle-buyer option. Request a quote from the details you supply, compare it with your other selling options, and accept only if it suits you. Pickup is included when Caraway buys the vehicle.",
    sections: [
      {
        heading: "Direct Sale or Private Listing?",
        content:
          "A private listing may suit an owner willing to prepare the vehicle, advertise, answer enquiries, arrange inspections, and negotiate with individual buyers. A direct sale may suit an owner who values a single buyer, an agreed collection plan, and fewer appointments. Compare the likely net return, time, paperwork, and certainty before choosing either route.",
      },
      {
        heading: "Details That Make a Quote More Accurate",
        content:
          "Share the exact variant where known, year, kilometres, registration status, service history, mechanical condition, body damage, warning lights, modifications, missing components, and suburb. Recent photos of every side, the interior, odometer, and damaged areas reduce uncertainty. Disclose finance or insurer involvement before accepting an offer.",
      },
      {
        heading: "Used Cars We Can Assess",
        content:
          "Caraway considers many used sedans, hatchbacks, wagons, utes, SUVs, four-wheel drives, vans, and light commercial vehicles. Age or high kilometres do not automatically exclude a car, but the quote depends on condition, completeness, identity, ownership authority, access, and current demand. We do not claim to buy every vehicle.",
      },
      {
        heading: "Offer, Inspection, and Pickup",
        content:
          "The initial offer is based on the information provided. Before loading, the operator checks that the vehicle matches that description. If it does, the agreed offer stands; if a material difference is found, you can consider a revised offer and are not required to proceed. The payment arrangement is confirmed before collection.",
      },
      {
        heading: "Selling a Registered or Financed Vehicle",
        content:
          "Registration, safety-certificate, finance, and insurer requirements vary with the vehicle and sale. Confirm the current Queensland rules that apply to you. Do not sell a financed vehicle or accept an insurer or lender settlement arrangement until the relevant authority and payout position are clear.",
      },
    ],
    faqs: [
      {
        question: "How do I sell my car to Caraway?",
        answer:
          "Submit the make, model, year, kilometres, condition, suburb, and photos. We assess the information, make an offer where the vehicle is within scope, and confirm pickup and payment details if you accept.",
      },
      {
        question: "Do I need a safety certificate?",
        answer:
          "Requirements depend on registration status and sale type. Check current Queensland guidance for your circumstances before collection; Caraway does not replace that seller obligation.",
      },
      {
        question: "Can I sell a car with finance owing?",
        answer:
          "Only after the finance position and authority to sell are clarified. Obtain an up-to-date payout figure from the lender and discuss it before accepting an offer.",
      },
      {
        question: "Can the offer change at pickup?",
        answer:
          "The offer is based on the details supplied. It may change if the identity, condition, completeness, or access materially differs, but you can decline a revised offer.",
      },
    ],
    relatedServices: [
      "cash-for-cars-brisbane",
      "car-removal-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["toowong", "kenmore", "moorooka", "springwood"],
  },
  {
    slug: "scrap-car-removal-brisbane",
    updatedAt: "2026-08-07",
    title: "Scrap Vehicle Assessment Brisbane | Old & Junk Cars",
    metaDescription: `Scrap vehicle assessment in Brisbane for old, junk, incomplete, and end-of-life cars. Request an individual purchase assessment. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Scrap Vehicle Assessment Brisbane — Old & Junk Cars",
    intro:
      "Caraway assesses old, junk, incomplete, and end-of-life vehicles for purchase and collection across Greater Brisbane. The quote depends on the identifiable vehicle, remaining components, condition, location, and access. Pickup is included when Caraway buys.",
    sections: [
      {
        heading: "When a Vehicle May Be at the End of Its Useful Life",
        content:
          "An owner may consider a scrap-car sale when repair costs no longer make sense, the vehicle has major mechanical or structural damage, important parts are missing, or long storage has left it deteriorated. 'Old', 'junk', and 'scrap' describe overlapping conditions rather than fixed price categories. A vehicle can still have value, but that value cannot be determined from weight or age alone.",
      },
      {
        heading: "How an End-of-Life Vehicle Is Assessed",
        content:
          "We consider the make, model, year, identity, completeness, body and drivetrain condition, location, access, and current demand for usable components or recoverable material. Photos of the full vehicle and missing or damaged areas are important. We do not publish generic dollar bands because two apparently similar wrecks can have very different value and recovery costs.",
      },
      {
        heading: "Completeness: Missing Parts, Wheels, and Identification",
        content:
          "Disclose a missing engine, transmission, catalytic converter, doors, wheels, keys, or identification plates before a quote is confirmed. Tell us whether the car rolls, steers, and brakes. Collection may require different equipment or may not be possible from the current position; photos and accurate access measurements help us decide before dispatch.",
      },
      {
        heading: "Purchase and Collection Are Separate Checks",
        content:
          "We first assess whether Caraway can buy the identifiable vehicle and agree purchase terms. Collection feasibility is then checked from its condition, position, location, and safe operator and equipment access. Pickup is included when Caraway buys and the vehicle and access match the supplied description.",
        supportLink: {
          href: "/car-removal-brisbane",
          label: "See Brisbane collection and access details",
        },
      },
      {
        heading: "What May Happen to an End-of-Life Vehicle",
        content:
          "The appropriate next step depends on the purchased vehicle's condition and lawful status. It may be resold, used for recoverable components, or transferred to an appropriate downstream dismantling or material-recovery specialist. Caraway does not promise a specific outcome before the vehicle has been assessed.",
      },
      {
        heading: "Identity, Authority, and Seller Records",
        content:
          "Have current photo identification and any registration or ownership records available. Estate, abandoned-vehicle, finance, or insurer situations may require additional authority. We provide a signed receipt and buyer details, while you complete and retain proof of the Queensland seller steps that apply.",
      },
    ],
    faqs: [
      {
        question: "How much is a scrap car worth in Brisbane?",
        answer:
          "Value depends on the identifiable vehicle, completeness, condition, location, access, and current parts or material demand. Accurate details and photos are needed for an individual quote.",
      },
      {
        question: "Do you assess old and junk cars as well as scrap cars?",
        answer:
          "Yes. Those terms often describe the same selling need, so this page covers old, junk, incomplete, and end-of-life vehicles in one assessment process.",
      },
      {
        question: "Can you collect a car with no wheels or engine?",
        answer:
          "Possibly, but the missing parts and access must be reviewed first. Send photos and explain how the vehicle is positioned so suitable equipment and feasibility can be assessed.",
      },
      {
        question: "Is pickup included?",
        answer:
          "Pickup is included when Caraway buys the vehicle and its condition and access match the information supplied.",
      },
    ],
    relatedServices: [
      "car-removal-brisbane",
      "cash-for-cars-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["logan", "beenleigh", "capalaba", "redcliffe"],
  },
  {
    slug: "damaged-cars-brisbane",
    updatedAt: "2026-08-07",
    title: "Damaged Cars Brisbane | Accident & Write-Off Quotes",
    metaDescription: `Sell a damaged car in Brisbane after an accident, flood, fire, or write-off decision. Quote and pickup assessment from Caraway. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell a Damaged Car in Brisbane",
    intro:
      "Caraway assesses accident-damaged, storm-affected, flood-damaged, fire-damaged, mechanically failed, and written-off vehicles in Brisbane. The quote and collection plan depend on the damage, vehicle identity, ownership authority, insurer or finance status, and safe access.",
    sections: [
      {
        heading: "Damage Details to Share for a Quote",
        content:
          "Provide photos of every side, the damaged area, interior, odometer, wheels, engine bay where safe, and the vehicle's current position. Tell us whether it starts, rolls, steers, brakes, leaks, has deployed airbags, or has loose and sharp components. Do not enter or move an unsafe vehicle merely to take photos.",
      },
      {
        heading: "Accident Cars and Written-Off Vehicles",
        content:
          "An insurer's total-loss or write-off decision affects who owns the salvage and what can lawfully happen next. Confirm whether the insurer has taken ownership, whether you retained the vehicle, and whether it has a written-off vehicle status before accepting another offer. Caraway does not provide insurance or registration advice and does not claim that a sale will beat an insurance outcome.",
      },
      {
        heading: "Flood, Fire, and Mechanical Damage",
        content:
          "Floodwater, fire, electrical faults, engine or transmission failure, and long-term exposure can create hidden hazards and change the value substantially. Describe water level, fire area, contamination, missing parts, and any professional assessment you have. Do not start a flood- or fire-affected vehicle unless a qualified person has said it is safe.",
      },
      {
        heading: "How Damage Affects the Offer",
        content:
          "We consider the vehicle's make, model, year, identity, completeness, pre-existing condition, damaged systems, location, access, and current demand. There is no dependable generic price for an accident or written-off car. The initial offer is based on the supplied facts and is checked against the vehicle before loading.",
      },
      {
        heading: "Safe Recovery and Pickup",
        content:
          "A damaged car may need a winch, tilt tray, skates, or other suitable loading equipment arranged through the assigned pickup operator. Recovery depends on access and whether the vehicle can be handled safely. Tell us about unstable panels, leaking fluids, missing wheels, restricted clearance, police holds, workshop fees, or storage conditions before booking.",
      },
      {
        heading: "Documents and Authority to Sell",
        content:
          "Have current photo ID, ownership records, insurer correspondence, finance information, and any written-off-vehicle documents that apply. Storage-yard or workshop releases may also be required. Caraway provides a receipt and buyer details; you remain responsible for the seller and registration steps that apply in Queensland.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a car after an insurance write-off?",
        answer:
          "Only if you still own it and have authority to sell. Confirm the insurer's settlement and salvage position, any finance interest, and the vehicle's written-off status before accepting an offer.",
      },
      {
        question: "Do you assess cars that cannot be driven?",
        answer:
          "Yes, subject to condition and safe access. Explain whether the car rolls, steers, brakes, leaks, or has unstable damage so the recovery requirements can be reviewed.",
      },
      {
        question: "How is an accident-damaged car valued?",
        answer:
          "The quote considers the vehicle, completeness, type and extent of damage, location, access, ownership status, and current demand. Photos and accurate disclosures are essential.",
      },
      {
        question: "Should I accept a buyer's offer before my insurer decides?",
        answer:
          "No. Clarify the insurer's decision, salvage ownership, and any finance obligations first so you know whether you are authorised to sell.",
      },
    ],
    relatedServices: [
      "hail-damaged-cars-brisbane",
      "car-removal-brisbane",
      "scrap-car-removal-brisbane",
    ],
    relatedSuburbs: ["logan", "springwood", "capalaba", "beenleigh"],
  },
  {
    slug: "unregistered-cars-brisbane",
    updatedAt: "2026-08-07",
    title: "Sell an Unregistered Car Brisbane | Quote & Pickup",
    metaDescription: `Sell an unregistered car in Brisbane with an individual quote, document check, and pickup assessment. Call Caraway on ${BUSINESS.phoneDisplay}.`,
    h1: "Sell an Unregistered Car in Brisbane",
    intro:
      "An expired or cancelled registration does not by itself determine whether Caraway can buy a vehicle. We assess the car, your authority to sell it, its location, and the collection requirements. Pickup is included when Caraway buys and the details are confirmed.",
    sections: [
      {
        heading: "Unregistered Vehicles We Can Assess",
        content:
          "We can consider vehicles with expired or cancelled Queensland registration, vehicles stored off-road, and some interstate-registration situations. The VIN or other identifiers must be available and you must have authority to sell. A missing number plate or registration label is not proof of ownership.",
      },
      {
        heading: "What to Provide With Your Quote Request",
        content:
          "Share the make, model, year, VIN where requested, kilometres, condition, suburb, access, and whether the car starts, rolls, steers, and brakes. Explain why the registration ended and provide relevant registration or ownership records. Do not drive an unregistered vehicle on a public road to facilitate collection.",
      },
      {
        heading: "Proof of Identity and Authority",
        content:
          "Have current photo identification and the best available proof linking you to the vehicle. Estate, company, deceased-owner, abandoned-vehicle, finance, or insurer situations can require additional documents or authority. We may decline or pause a purchase where identity or ownership cannot be established.",
      },
      {
        heading: "Collection From Private Property",
        content:
          "The vehicle must be somewhere it can lawfully and safely be collected. Tell us about apartment parking, height limits, steep driveways, locked gates, soft ground, missing wheels, or restricted access. A suitable pickup operator may be arranged only after the car and access details are reviewed.",
      },
      {
        heading: "Queensland Seller Steps",
        content:
          "The steps for transferring, cancelling, or documenting a sale vary with registration status and circumstances. Check current Queensland transport guidance for your vehicle and keep evidence of what you submit. Caraway provides a signed receipt and buyer details but does not complete your personal seller obligations for you.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a car with expired registration?",
        answer:
          "Potentially. Caraway assesses the vehicle and your authority to sell it. Registration status, identity, ownership records, condition, and access all affect whether the purchase can proceed.",
      },
      {
        question: "Can I drive the unregistered car to meet the truck?",
        answer:
          "Do not drive an unregistered vehicle on a public road unless you have confirmed lawful authority to do so. Describe its current position so collection access can be assessed instead.",
      },
      {
        question: "What documents do I need?",
        answer:
          "Current photo ID and records showing your connection and authority to sell are important. The exact documents depend on registration, finance, insurer, estate, or company circumstances.",
      },
      {
        question: "Is pickup included for an unregistered car?",
        answer:
          "Pickup is included when Caraway buys the vehicle and the condition, location, and access match the information supplied.",
      },
    ],
    relatedServices: [
      "cash-for-cars-brisbane",
      "car-removal-brisbane",
      "sell-my-car-brisbane",
    ],
    relatedSuburbs: ["moorooka", "toowong", "logan", "redcliffe"],
  },
  {
    slug: "hail-damaged-cars-brisbane",
    updatedAt: "2026-08-07",
    title: "Hail Damaged Cars Brisbane | Vehicle Quote & Pickup",
    metaDescription: `Sell a hail-damaged car in Brisbane after confirming insurer and ownership status. Request an individual quote from Caraway. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell a Hail-Damaged Car in Brisbane",
    intro:
      "Caraway assesses hail-damaged cars in Brisbane after the owner has clarified any insurer, finance, and salvage position. The quote depends on the vehicle, extent of damage, mechanical condition, written-off status, completeness, location, and access.",
    sections: [
      {
        heading: "Document the Hail Damage Safely",
        content:
          "Photograph the roof, bonnet, boot, pillars, glass, each side, interior, odometer, and any water entry. Note cracked glass, damaged lights, exposed edges, warning lights, or electrical problems. Avoid handling broken glass or moving a vehicle that is not safe to drive merely to obtain photos.",
      },
      {
        heading: "Confirm the Insurance Position First",
        content:
          "If a claim is open, confirm whether the insurer will repair the car, declare it a total loss, take ownership of the salvage, or allow you to retain it. Also clarify any finance interest. Do not accept a separate sale until you know that you still own the vehicle and are authorised to transfer it.",
      },
      {
        heading: "How We Assess a Hail-Damaged Vehicle",
        content:
          "We consider the make, model, year, kilometres, pre-storm condition, number and severity of dents, glass and water damage, mechanical state, registration or written-off status, completeness, location, and current demand. Generic dent counts or online price bands cannot substitute for an individual assessment.",
      },
      {
        heading: "Running and Non-Running Hail-Damaged Cars",
        content:
          "A vehicle may remain mechanically sound after cosmetic hail damage, or it may also have broken glass, water entry, discharged electronics, or unrelated faults. Tell us whether it starts, rolls, steers, and brakes, and whether temporary coverings or loose glass affect safe access.",
      },
      {
        heading: "Pickup and Sale Records",
        content:
          "Pickup is included when Caraway buys and the vehicle and access match the supplied details. Bring current photo ID, ownership records, insurer correspondence, finance information, keys, and any written-off-vehicle documents. We provide a signed receipt and buyer details for your records.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a hail-damaged car while an insurance claim is open?",
        answer:
          "Do not proceed until the insurer confirms the claim, ownership, and salvage position. Finance may also affect your authority to sell.",
      },
      {
        question: "Do cosmetic dents make the car a write-off?",
        answer:
          "Not automatically. That is an insurer and regulatory determination based on the individual vehicle and damage. Share any formal decision when requesting a quote.",
      },
      {
        question: "Can you collect a hail-damaged car with broken glass?",
        answer:
          "Possibly, subject to safe access and handling. Tell us about broken or loose glass and send photos so the collection requirements can be reviewed.",
      },
      {
        question: "How is a hail-damaged car valued?",
        answer:
          "The quote considers the vehicle, pre-existing and storm damage, mechanical condition, completeness, status, location, access, and current demand.",
      },
    ],
    relatedServices: [
      "damaged-cars-brisbane",
      "cash-for-cars-brisbane",
      "car-removal-brisbane",
    ],
    relatedSuburbs: ["redcliffe", "capalaba", "springwood", "logan"],
  },
  {
    slug: "sell-toyota-hilux-brisbane",
    updatedAt: "2026-08-07",
    title: "Sell a Toyota HiLux Brisbane | Vehicle Quote",
    metaDescription: `Sell a Toyota HiLux in Brisbane with an individual quote based on model, condition, kilometres, and access. Call Caraway on ${BUSINESS.phoneDisplay}.`,
    h1: "Sell a Toyota HiLux in Brisbane",
    intro:
      "Caraway assesses Toyota HiLux utes in Brisbane across different years, body styles, drivetrains, and conditions. An individual quote is based on the exact vehicle, kilometres, condition, completeness, modifications, ownership status, location, and collection access.",
    sections: [
      {
        heading: "HiLux Details to Include in Your Quote",
        content:
          "Provide the year, variant where known, cab and body style, engine and transmission, two- or four-wheel drive, kilometres, registration status, and service history. Photos of the VIN plate where requested, exterior, cabin, odometer, tray or tub, engine bay, tyres, and damage help distinguish the vehicle accurately.",
      },
      {
        heading: "Running, Damaged, and Work-Worn Utes",
        content:
          "We can assess running HiLuxes as well as vehicles with mechanical faults, accident or storm damage, high kilometres, worn interiors, rust, missing components, or long-term storage. Describe warning lights, leaks, engine or transmission symptoms, chassis or suspension damage, and whether the ute starts, rolls, steers, and brakes.",
      },
      {
        heading: "Trays, Canopies, and Modifications",
        content:
          "List trays, canopies, service bodies, bullbars, suspension changes, towing equipment, accessories, or mining and fleet fit-outs. Explain whether those items are included in the sale and disclose known defects or unapproved modifications. Equipment does not have a fixed added value; its condition, suitability, and demand are assessed with the vehicle.",
      },
      {
        heading: "How a HiLux Offer Is Determined",
        content:
          "The offer reflects the exact model and identity, kilometres, overall mechanical and body condition, completeness, documentation, location, access, and current demand. We do not publish model-year price promises because specification and condition can change the result substantially. The vehicle is checked against the supplied description before loading.",
      },
      {
        heading: "Finance, Business Ownership, and Pickup",
        content:
          "Clarify any finance, company, fleet, estate, insurer, or lease interest before accepting an offer. The person selling must have authority to do so. Pickup is included when Caraway buys, with timing and equipment confirmed from the ute's location, weight, condition, modifications, and safe access.",
      },
    ],
    faqs: [
      {
        question: "Do you assess non-running Toyota HiLuxes?",
        answer:
          "Yes, subject to vehicle identity, condition, ownership authority, and safe access. Explain whether the ute starts, rolls, steers, brakes, and has all wheels.",
      },
      {
        question: "Will a tray, canopy, or accessories change the quote?",
        answer:
          "They may. Include clear photos and confirm what is part of the sale. Condition, installation, suitability, and current demand determine whether equipment affects the offer.",
      },
      {
        question: "Can I sell a financed or company-owned HiLux?",
        answer:
          "Only when the finance position and authority to sell are clear. Obtain current lender or company approval documents before the sale is finalised.",
      },
      {
        question: "Is HiLux pickup included?",
        answer:
          "Pickup is included when Caraway buys and the vehicle and access match the supplied details. The collection plan is confirmed before dispatch.",
      },
    ],
    relatedServices: [
      "cash-for-cars-brisbane",
      "sell-my-car-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["logan", "beenleigh", "springwood", "redcliffe"],
  },
];

export function getServicePreferredImage(
  service: ServicePage,
): ServiceImage | undefined {
  return service.sections.find((section) => section.image)?.image;
}

export const getServiceBySlug = cache(
  (slug: string): ServicePage | undefined =>
    services.find((service) => service.slug === slug),
);
