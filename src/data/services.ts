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
  serviceType: string;
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
    slug: "car-removal-brisbane",
    serviceType: "Vehicle purchase and collection service",
    updatedAt: "2026-10-18",
    reviewedAt: "2026-08-07",
    title: "Car Removal Brisbane | Free Towing Included",
    metaDescription: `Car removal Brisbane for unwanted, damaged and non-running cars. Get a written offer first. Towing is free when we buy your car. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Car Removal Brisbane — Free Towing Included",
    intro:
      "Towing is free when Caraway buys your unwanted, damaged or non-running car. We buy and remove cars across Greater Brisbane. Send us the car's details and location, and get a written offer. We confirm the truck and a pickup window before anyone is sent.",
    sections: [
      {
        heading: "Car Removal That Pays You",
        content:
          "Most of our cash for cars jobs in Brisbane end with car removal. We check the car, agree a price, then pick it up. You don't pay a tow operator to take the car away. Towing is free when we buy your car, and we confirm how you get paid before the truck arrives.",
        supportLink: {
          href: "/",
          label: "How Caraway's cash for cars Brisbane service works",
        },
      },
      {
        heading: "How Brisbane Car Removal Works",
        content:
          "Tell us the make, model, year, condition, suburb, and access details. We check whether we can buy the car, then confirm an offer, a pickup window, and the equipment needed. At pickup, the operator checks the car against your description, confirms how you will be paid before loading, and gives you a signed receipt and buyer details.",
        supportLink: {
          href: "/blog/tow-truck-cost-brisbane#when-a-vehicle-sale-can-include-pickup",
          label: "When a car sale can include pickup",
        },
      },
      {
        heading: "What Free Towing Means",
        content:
          "Towing is free when we buy your car. We take no towing fee off the offer when the car and access match the details you gave us. We only tow cars we are buying. If we can't buy your car or can't arrange a safe pickup, we tell you before a pickup is booked.",
        supportLink: {
          href: "/blog/how-to-get-the-best-cash-for-cars-price-brisbane#compare-three-vehicle-buyer-quotes",
          label: "Compare three written vehicle-buyer quotes",
        },
      },
      {
        heading: "Non-Running and Hard-to-Move Cars",
        content:
          "Tell us whether the car starts, rolls, steers, brakes, and has all its wheels and keys. Also tell us about seized brakes, flat or missing tyres, locked steering, loose parts, fire damage, or severe structural damage. We check the condition and access before arranging loading equipment, and some cars can't be recovered from where they sit.",
        supportLink: {
          href: "/unregistered-cars-brisbane",
          label: "What you need to sell an unregistered car",
        },
      },
      {
        heading: "Access Details to Confirm Before Booking",
        content:
          "Send photos and measurements for underground car parks, steep or narrow driveways, backyards, soft ground, locked compounds, height limits, and cars blocked in by other things. Clear a safe path if you can. Accurate access details protect the agreed quote and make a failed pickup less likely.",
        checklistItems: [
          "Whether the car starts, rolls, steers, brakes, and has keys.",
          "Wheels and tyres: flat or missing tyres, seized brakes, and loose parts.",
          "Exactly where the car is and the path to it: gates, turns, parked cars, and obstacles.",
          "Width and height, driveway slope, ground surface, overhead clearance, and loading space.",
          "Photos of the path to the car, plus measurements where clearance is tight.",
        ],
        image: {
          src: "/images/car-removal-brisbane-access-readiness-v1.jpg",
          alt: "Vehicle pickup-access diagram showing wheel and steering checks, gate width, height clearance, driveway slope and surface, turns, and obstacles",
          caption:
            "Show the full path from the street to the car so the operator can check movement, clearance, surface, turns, and obstacles before booking.",
          width: 1200,
          height: 630,
        },
        supportLink: {
          href: "/blog/preparing-your-car-for-pickup#plates-rego-and-tow-truck-access",
          label: "Get the car, documents, and access ready for pickup",
        },
      },
      {
        heading: "Car Removal Coverage Around Brisbane",
        content:
          "We consider pickups across Brisbane and nearby parts of Logan, Ipswich, Redlands, and Moreton Bay. Timing depends on the suburb, the car's condition, access, traffic, and operator availability. We confirm a pickup window for each job before the truck is sent, not from the postcode alone.",
        supportLink: {
          href: "/how-it-works",
          label: "See the full process: quote, pickup, payment, and receipt",
        },
      },
      {
        heading: "Paperwork and What Happens After Pickup",
        content:
          "Have your current photo ID, all keys, and any registration, finance, insurer, estate, or ownership records ready. You stay responsible for the Queensland seller steps that apply to you. Depending on its condition and legal status, a car we buy may be resold, used for parts, or passed to a suitable specialist.",
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
          "Towing is free when we buy your car and the car and access match the details you gave us. We do not tow cars we are not buying.",
      },
      {
        question: "Can you remove a car that does not run?",
        answer:
          "We may be able to. Tell us whether the car rolls, steers, brakes, and has all its wheels so we can check how to load it before booking.",
      },
      {
        question: "Can you pick up from a garage or backyard?",
        answer:
          "Possibly. Send photos and measurements showing clearance, slope, surface, turns, gates, and obstacles. Pickup depends on safe access for the operator and equipment.",
      },
      {
        question: "What do I need at pickup?",
        answer:
          "Have your current photo ID, all the keys you have, and any ownership, registration, finance, insurer, or estate documents that apply. Take your belongings out before the operator arrives.",
      },
      {
        question: "What is the quickest legal way to get rid of an old car in Brisbane?",
        answer:
          "No one way is always the quickest. To avoid delays, have your photo ID, keys, ownership or registration records, photos of the car's condition, and accurate access details ready. Then confirm who the buyer is, the written sale terms, how you will be paid, and the pickup window before the truck is sent.",
      },
    ],
    relatedServices: [
      "scrap-car-removal-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["logan", "springwood", "beenleigh", "moorooka"],
  },
  {
    slug: "sell-my-car-brisbane",
    serviceType: "Vehicle buying service",
    updatedAt: "2026-10-18",
    title: "Sell My Car Brisbane | Quote From a Direct Buyer",
    metaDescription: `Sell your car in Brisbane to a direct buyer: one written offer, no listings or test drives, and free towing when we buy. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell My Car Brisbane — A Direct Buyer Option",
    intro:
      "Selling your car in Brisbane doesn't have to mean weeks of listings, test drives and no-shows. Caraway is a direct buyer: send the details, get one written offer, compare it with your other options, and accept only if it suits you. Towing is free when we buy your car.",
    sections: [
      {
        heading: "Selling for Cash Instead of Trading In",
        content:
          "A dealer trade-in ties your car's price to buying another one from the same yard, which makes it hard to see what the old car was really worth. Selling to Caraway separates the two: you get a written price for your car on its own, we confirm how you get paid before pickup, and you're free to buy your next car anywhere. It's the same process behind our cash for cars Brisbane service.",
        supportLink: {
          href: "/",
          label: "See how cash for cars works in Brisbane",
        },
      },
      {
        heading: "Direct Sale or Private Listing?",
        content:
          "A private listing may suit you if you're willing to prepare the car, advertise it, answer enquiries, arrange inspections, and negotiate with buyers. A direct sale may suit you if you want one buyer, an agreed pickup plan, and fewer appointments. Compare the money you're likely to keep, the time, the paperwork, and the certainty before you choose.",
      },
      {
        heading: "Details That Make a Quote More Accurate",
        content:
          "Tell us the exact variant if you know it, the year, kilometres, registration status, service history, mechanical condition, body damage, warning lights, modifications, missing parts, and suburb. Recent photos of every side, the interior, the odometer, and any damage help us quote more accurately. Tell us about any finance or insurer involvement before you accept an offer.",
        image: {
          src: "/images/cash-for-cars-quote-readiness-v1.jpg",
          alt: "Vehicle quote-readiness diagram showing front, rear and side photos, the interior and odometer, visible damage, and driveway access",
          caption:
            "A full set of current photos of the car and the access helps a buyer check what is visible before confirming a quote for your car.",
          width: 1200,
          height: 630,
        },
      },
      {
        heading: "Used Cars We Consider",
        content:
          "Caraway considers many used sedans, hatchbacks, wagons, utes, SUVs, four-wheel drives, vans, and light commercial vehicles. Age or high kilometres alone do not rule a car out. The quote depends on condition, completeness, identity, your authority to sell, access, and current demand. We do not buy every car.",
      },
      {
        heading: "Offer, Inspection, and Pickup",
        content:
          "The first offer is based on the details you gave us. Before loading, the operator checks that the car matches them. If it does, the agreed offer stands. If there is a significant difference, you can consider a revised offer, and you don't have to go ahead. We confirm how you get paid before pickup.",
      },
      {
        heading: "Selling a Registered or Financed Vehicle",
        content:
          "Registration, safety-certificate, finance, and insurer requirements vary with the vehicle and sale. Check the current Queensland rules that apply to you. Do not sell a financed vehicle or accept an insurer or lender settlement arrangement until the relevant authority and payout position are clear.",
      },
    ],
    faqs: [
      {
        question: "How do I sell my car to Caraway?",
        answer:
          "Send us the make, model, year, kilometres, condition, suburb, and photos. We check the details and make an offer if it is a car we can buy. If you accept, we confirm pickup and how you get paid.",
      },
      {
        question: "Do I need a safety certificate?",
        answer:
          "It depends on the registration status and the type of sale. Check current Queensland guidance for your situation before pickup. That obligation stays with you as the seller.",
      },
      {
        question: "Can I sell a car with finance owing?",
        answer:
          "Only once the finance position and your authority to sell are clear. Get an up-to-date payout figure from the lender and tell us about it before you accept an offer.",
      },
      {
        question: "Can the offer change at pickup?",
        answer:
          "The offer is based on the details you gave us. It may change if the car's identity, condition, completeness, or access is significantly different, but you can decline a revised offer.",
      },
    ],
    relatedServices: [
      "car-removal-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["toowong", "kenmore", "moorooka", "springwood"],
  },
  {
    slug: "scrap-car-removal-brisbane",
    serviceType: "End-of-life vehicle assessment and buying service",
    updatedAt: "2026-10-18",
    title: "Scrap Car Removal in Brisbane | Old & Junk Cars",
    metaDescription:
      "Scrap car removal in Brisbane for old, junk, incomplete and end-of-life cars. Get a free quote. Towing is free when we buy your car.",
    h1: "Scrap Car Removal in Brisbane — Old & Junk Cars",
    intro:
      "Old, junk or end-of-life car taking up the driveway? Caraway buys scrap cars across Greater Brisbane, and towing is free when we buy your car. The offer depends on the car's identity, what parts are left, its condition, location and access.",
    sections: [
      {
        heading: "Scrap Cars Still Have Value",
        content:
          "A car that will never drive again can still be worth something for its parts and metal. Scrap pricing is the low end of cash for cars in Brisbane, but it is rarely zero: a complete car with its catalytic converter, wheels and battery is worth more than a stripped shell. Tell us exactly what's left on it so the offer holds when the truck arrives.",
        supportLink: {
          href: "/",
          label: "Compare scrap offers with Caraway's cash for cars Brisbane service",
        },
      },
      {
        heading: "When a Car May Be at the End of Its Life",
        content:
          "You might sell a car for scrap when repairs no longer make sense, it has major mechanical or structural damage, important parts are missing, or long storage has left it run down. 'Old', 'junk', and 'scrap' overlap and are not fixed price categories. The car can still have value, but weight or age alone won't tell you how much.",
      },
      {
        heading: "How We Value an End-of-Life Car",
        content:
          "We consider the make, model, year, identity, completeness, body and drivetrain condition, location, access, and current demand for usable parts or recoverable material. Send photos of the whole car and of any missing or damaged areas. We do not publish price ranges, because two wrecks that look alike can differ a lot in value and in what they cost to recover.",
      },
      {
        heading: "Missing Parts, Wheels, and Identification",
        content:
          "Tell us about a missing engine, transmission, catalytic converter, doors, wheels, keys, or identification plates before we confirm a quote. Tell us whether the car rolls, steers, and brakes. Pickup may need different equipment, or may not be possible from where the car sits. Photos and accurate access measurements help us decide before the truck is sent.",
      },
      {
        heading: "We Check the Sale and the Pickup Separately",
        content:
          "First we check that we can identify the car and buy it, and we agree the sale terms. Then we check whether it can be picked up, based on its condition, position, location, and safe access for the operator and equipment. Towing is free when we buy your car and the car and access match the details you gave us.",
        supportLink: {
          href: "/car-removal-brisbane",
          label: "See Brisbane pickup and access details",
        },
      },
      {
        heading: "What May Happen to an End-of-Life Car",
        content:
          "What happens next depends on the car's condition and legal status. It may be resold, used for parts, or passed to a dismantling or material-recovery specialist. We can't say which until we have checked the car.",
      },
      {
        heading: "Identity, Authority, and Seller Records",
        content:
          "Have your current photo ID and any registration or ownership records ready. Estate, abandoned-vehicle, finance, or insurer situations may need extra authority. We give you a signed receipt and buyer details. You complete the Queensland seller steps that apply and keep proof of them.",
      },
    ],
    faqs: [
      {
        question: "How much is a scrap car worth in Brisbane?",
        answer:
          "It depends on the car's identity, completeness, condition, location, access, and current demand for parts or material. We need accurate details and photos to quote on your car.",
      },
      {
        question: "Do you quote on old and junk cars as well as scrap cars?",
        answer:
          "Yes. Those words often mean the same thing to a seller, so this page covers old, junk, incomplete, and end-of-life cars together.",
      },
      {
        question: "Can you pick up a car with no wheels or engine?",
        answer:
          "Possibly, but we need to check the missing parts and the access first. Send photos and tell us how the car is sitting so we can work out the equipment and whether pickup is possible.",
      },
      {
        question: "Is towing free?",
        answer:
          "Towing is free when we buy your car and its condition and access match the details you gave us.",
      },
    ],
    relatedServices: [
      "car-removal-brisbane",
      "damaged-cars-brisbane",
    ],
    relatedSuburbs: ["logan", "beenleigh", "capalaba", "redcliffe"],
  },
  {
    slug: "damaged-cars-brisbane",
    serviceType: "Damaged vehicle buying service",
    updatedAt: "2026-08-11",
    reviewedAt: "2026-08-11",
    title: "Cash for Flooded Cars in Brisbane | Vehicle Quotes",
    metaDescription:
      "Cash for flooded cars in Brisbane, plus accident, fire and write-off cars. Check ownership, insurance and written-off status, then get a free quote.",
    h1: "Sell a Damaged Car in Brisbane",
    intro:
      "Accident, storm, flood or fire damage \u2014 or a mechanical failure that isn't worth fixing \u2014 doesn't stop a car from being sold. Caraway considers damaged and written-off cars across Brisbane. The offer and pickup plan depend on the damage, the car's identity, your authority to sell, any insurer or finance interest, and safe access.",
    sections: [
      {
        heading: "Damaged Doesn't Mean Worthless",
        content:
          "Damaged cars are a large share of the cash for cars market in Brisbane because repair quotes often come to more than the car is worth. We price what the car is now \u2014 repairable, parts or scrap \u2014 rather than what it was before the damage. Clear photos of every damaged area, and a straight answer on whether it starts, rolls and steers, give you the most reliable offer.",
        supportLink: {
          href: "/",
          label: "How Caraway prices cars for cash in Brisbane",
        },
      },
      {
        heading: "Damage Details to Share for a Quote",
        content:
          "Send photos of every side, the damaged area, interior, odometer, wheels, engine bay where safe, and where the car is sitting now. Tell us whether it starts, rolls, steers, brakes, leaks, has deployed airbags, or has loose or sharp parts. Do not get into or move an unsafe car just to take photos.",
      },
      {
        heading: "Accident Cars and Written-Off Vehicles",
        content:
          "An insurer's total-loss or write-off decision affects who owns the salvage and what can lawfully happen next. Confirm whether the insurer has taken ownership, whether you kept the vehicle, and whether it has a written-off vehicle status before you accept another offer. Caraway does not give insurance or registration advice and does not say a sale will beat an insurance outcome.",
      },
      {
        heading: "Flood, Fire, and Mechanical Damage",
        content:
          "Floodwater, fire, electrical faults, engine or transmission failure, and long-term exposure can create hidden hazards and change the value a lot. Tell us the water level, fire area, contamination, missing parts, and any professional assessment you have. Do not start a flood- or fire-affected vehicle unless a qualified person has said it is safe.",
        supportLink: {
          href: "/blog/sell-flood-damaged-car-brisbane#document-the-water-exposure",
          label: "Review flood-damage safety, insurer, and sale steps",
        },
      },
      {
        heading: "How Damage Affects the Offer",
        content:
          "We consider the car's make, model, year, identity, completeness, condition before the damage, damaged systems, location, access, and current demand. There is no reliable standard price for an accident or written-off car. The first offer is based on the details you gave us, and the car is checked against them before loading.",
      },
      {
        heading: "Safe Recovery and Pickup",
        content:
          "A damaged car may need a winch, tilt tray, skates, or other loading equipment, arranged through the pickup operator for the job. Recovery depends on access and whether the car can be handled safely. Before booking, tell us about unstable panels, leaking fluids, missing wheels, tight clearance, police holds, workshop fees, or storage conditions.",
      },
      {
        heading: "Documents and Authority to Sell",
        content:
          "Have your current photo ID, ownership records, letters or emails from your insurer, finance details, and any written-off-vehicle documents that apply. You may also need a release from a storage yard or workshop. Caraway gives you a receipt and buyer details. You stay responsible for the seller and registration steps that apply in Queensland.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a car after an insurance write-off?",
        answer:
          "Only if you still own it and have authority to sell. Confirm the insurer's settlement and salvage position, any finance interest, and the vehicle's written-off status before accepting an offer.",
      },
      {
        question: "Do you quote on cars that cannot be driven?",
        answer:
          "Yes, depending on the car's condition and safe access. Tell us whether it rolls, steers, brakes, leaks, or has unstable damage so we can check what the recovery needs.",
      },
      {
        question: "How is an accident-damaged car valued?",
        answer:
          "The quote depends on the car, its completeness, the type and extent of damage, location, access, ownership status, and current demand. We need photos and accurate details.",
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
    serviceType: "Unregistered vehicle buying service",
    updatedAt: "2026-08-11",
    reviewedAt: "2026-08-11",
    title: "Unregistered Car Removal in Brisbane | Quote",
    metaDescription:
      "Unregistered car removal in Brisbane. We quote on your car and check your ownership documents and pickup access. Towing is free when we buy your car.",
    h1: "Unregistered Car Removal in Brisbane",
    intro:
      "Expired or cancelled registration doesn't decide whether a car can be sold. Caraway considers unregistered cars across Brisbane based on the car itself, your authority to sell it, where it sits and how it can be picked up. Towing is free when we buy your car, so it never needs to be driven on the road.",
    sections: [
      {
        heading: "No Rego, No Problem for the Offer",
        content:
          "An unregistered car can't legally be driven to a buyer, which is why pickup matters so much. When we buy your car, it is loaded where it sits. Registration status is one factor in the offer, along with condition and completeness. We check the same things for every cash for cars job in Brisbane.",
        supportLink: {
          href: "/",
          label: "Read how Caraway's cash for cars Brisbane service works",
        },
      },
      {
        heading: "Unregistered Cars We Consider",
        content:
          "We can consider cars with expired or cancelled Queensland registration, cars stored off-road, and some interstate-registration situations. The VIN or other identifiers must be available and you must have authority to sell. A missing number plate or registration label is not proof of ownership.",
      },
      {
        heading: "What to Send for a Quote",
        content:
          "Tell us the make, model, year, VIN if we ask for it, kilometres, condition, suburb, access, and whether the car starts, rolls, steers, and brakes. Tell us why the registration ended and send any registration or ownership records you have. Do not drive an unregistered vehicle on a public road to make pickup easier.",
      },
      {
        heading: "Proof of Identity and Authority",
        content:
          "Have your current photo ID and the best proof you have that links you to the car. Estate, company, deceased-owner, abandoned-vehicle, finance, or insurer situations can need extra documents or authority. We may decline or pause a purchase if we cannot establish identity or ownership.",
      },
      {
        heading: "Pickup From Private Property",
        content:
          "The car must be somewhere it can be picked up lawfully and safely. Tell us about apartment parking, height limits, steep driveways, locked gates, soft ground, missing wheels, or restricted access. We arrange a pickup operator only after we have checked the car and access details.",
        supportLink: {
          href: "/blog/park-unregistered-car-street-qld#moving-an-unregistered-vehicle-check-the-exact-journey",
          label: "Check Queensland movement rules for an unregistered vehicle",
        },
      },
      {
        heading: "Queensland Seller Steps",
        content:
          "The steps for transferring, cancelling, or documenting a sale vary with registration status and circumstances. Check current Queensland transport guidance for your vehicle and keep proof of what you submit. Caraway gives you a signed receipt and buyer details. You stay responsible for your own seller obligations.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a car with expired registration?",
        answer:
          "Possibly. Caraway checks the car and your authority to sell it. Registration status, identity, ownership records, condition, and access all affect whether we can buy it.",
      },
      {
        question: "Can I drive the unregistered car to meet the truck?",
        answer:
          "Do not drive an unregistered vehicle on a public road unless you have confirmed lawful authority to do so. Tell us where the car is instead, so we can check pickup access.",
      },
      {
        question: "What documents do I need?",
        answer:
          "Bring current photo ID and records that show your connection to the car and your authority to sell it. The exact documents depend on your registration, finance, insurer, estate, or company situation.",
      },
      {
        question: "Is towing free for an unregistered car?",
        answer:
          "Towing is free when we buy your car and its condition, location, and access match the details you gave us.",
      },
    ],
    relatedServices: [
      "car-removal-brisbane",
      "sell-my-car-brisbane",
    ],
    relatedSuburbs: ["moorooka", "toowong", "logan", "redcliffe"],
  },
  {
    slug: "hail-damaged-cars-brisbane",
    serviceType: "Hail-damaged vehicle buying service",
    updatedAt: "2026-10-18",
    title: "Hail Damaged Cars Brisbane | Vehicle Quote & Pickup",
    metaDescription: `Sell a hail-damaged car in Brisbane. Check your insurer and ownership status first, then get a free quote from Caraway. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell a Hail-Damaged Car in Brisbane",
    intro:
      "Brisbane storms leave plenty of cars with dented roofs, bonnets and panels. Caraway considers hail-damaged cars once you have settled any insurer, finance or salvage position. The offer depends on the car, how bad the damage is, how it drives, written-off status, completeness, location and access.",
    sections: [
      {
        heading: "When Repairing Hail Damage Doesn't Add Up",
        content:
          "Paintless dent repair is excellent on lighter hail, but heavy damage across the roof and pillars can cost more than an older car is worth. If you've kept the payout or the insurer has released the car, selling it as-is to a cash for cars buyer in Brisbane is often simpler than repairing it. Photograph every panel in good light so the dents show clearly.",
        supportLink: {
          href: "/",
          label: "Get a cash for cars Brisbane offer, running or not",
        },
      },
      {
        heading: "Photograph the Hail Damage Safely",
        content:
          "Photograph the roof, bonnet, boot, pillars, glass, each side, interior, odometer, and any water that got in. Note cracked glass, damaged lights, exposed edges, warning lights, or electrical problems. Do not handle broken glass or move a car that is not safe to drive just to get photos.",
      },
      {
        heading: "Confirm the Insurance Position First",
        content:
          "If a claim is open, confirm whether the insurer will repair the car, declare it a total loss, take ownership of the salvage, or let you keep it. Also clarify any finance interest. Do not accept a separate sale until you know that you still own the vehicle and are authorised to transfer it.",
      },
      {
        heading: "How We Value a Hail-Damaged Car",
        content:
          "We consider the make, model, year, kilometres, condition before the storm, how many dents there are and how bad they are, glass and water damage, mechanical condition, registration or written-off status, completeness, location, and current demand. A dent count or an online price range can't replace a check of your own car.",
      },
      {
        heading: "Running and Non-Running Hail-Damaged Cars",
        content:
          "A car can still be mechanically sound after cosmetic hail damage, or it may also have broken glass, water inside, dead electronics, or unrelated faults. Tell us whether it starts, rolls, steers, and brakes, and whether temporary covers or loose glass affect safe access.",
      },
      {
        heading: "Pickup and Sale Records",
        content:
          "Towing is free when we buy your car and the car and access match the details you gave us. Have your current photo ID, ownership records, letters or emails from your insurer, finance details, keys, and any written-off-vehicle documents ready. We give you a signed receipt and buyer details for your records.",
      },
    ],
    faqs: [
      {
        question: "Can I sell a hail-damaged car while an insurance claim is open?",
        answer:
          "Do not go ahead until the insurer confirms the claim, ownership, and salvage position. Finance may also affect your authority to sell.",
      },
      {
        question: "Do cosmetic dents make the car a write-off?",
        answer:
          "Not automatically. That is an insurer and regulatory decision based on the individual vehicle and damage. Tell us about any formal decision when you ask for a quote.",
      },
      {
        question: "Can you pick up a hail-damaged car with broken glass?",
        answer:
          "Possibly, if it can be reached and handled safely. Tell us about broken or loose glass and send photos so we can check what the pickup needs.",
      },
      {
        question: "How is a hail-damaged car valued?",
        answer:
          "The quote depends on the car, damage from before and from the storm, mechanical condition, completeness, registration or written-off status, location, access, and current demand.",
      },
    ],
    relatedServices: [
      "damaged-cars-brisbane",
      "car-removal-brisbane",
    ],
    relatedSuburbs: ["redcliffe", "capalaba", "springwood", "logan"],
  },
  {
    slug: "sell-toyota-hilux-brisbane",
    serviceType: "Toyota HiLux buying service",
    updatedAt: "2026-10-18",
    title: "Sell a Toyota HiLux Brisbane | Vehicle Quote",
    metaDescription: `Sell a Toyota HiLux in Brisbane. Get a quote for your ute based on its model, condition, kilometres and access. Call Caraway on ${BUSINESS.phoneDisplay}.`,
    h1: "Sell a Toyota HiLux in Brisbane",
    intro:
      "HiLuxes hold their value in Queensland \u2014 even high-kilometre, worked-hard ones. Caraway considers Toyota HiLux utes in Brisbane across every generation, cab and tray style, 2WD and 4x4. Your offer is based on the exact ute, kilometres, condition, modifications, ownership status, location and access.",
    sections: [
      {
        heading: "Why a HiLux Is Worth Describing Properly",
        content:
          "Accessories, service history and how the ute was used all move a HiLux offer. A canopy, bar work, a lift kit or a tray swap can help or hurt depending on the buyer, so list every modification honestly. We price utes the same way as any cash for cars job in Brisbane: from accurate details and current photos.",
        supportLink: {
          href: "/",
          label: "Sell your car for cash in Brisbane with Caraway",
        },
      },
      {
        heading: "HiLux Details to Include in Your Quote",
        content:
          "Tell us the year, the variant if you know it, cab and body style, engine and transmission, two- or four-wheel drive, kilometres, registration status, and service history. Photos of the VIN plate if we ask for it, the exterior, cabin, odometer, tray or tub, engine bay, tyres, and any damage help us identify the exact ute.",
      },
      {
        heading: "Running, Damaged, and Work-Worn Utes",
        content:
          "We can consider running HiLuxes as well as utes with mechanical faults, accident or storm damage, high kilometres, worn interiors, rust, missing parts, or a long time in storage. Tell us about warning lights, leaks, engine or transmission problems, chassis or suspension damage, and whether the ute starts, rolls, steers, and brakes.",
      },
      {
        heading: "Trays, Canopies, and Modifications",
        content:
          "List trays, canopies, service bodies, bullbars, suspension changes, towing equipment, accessories, or mining and fleet fit-outs. Tell us whether they are part of the sale, and about any known defects or unapproved modifications. Equipment does not add a fixed amount. We look at its condition, suitability, and demand along with the ute.",
      },
      {
        heading: "How We Work Out a HiLux Offer",
        content:
          "The offer depends on the exact model and identity, kilometres, overall mechanical and body condition, completeness, documents, location, access, and current demand. We do not publish prices by model year, because specification and condition can change the result a lot. The ute is checked against your description before loading.",
      },
      {
        heading: "Finance, Business Ownership, and Pickup",
        content:
          "Confirm any finance, company, fleet, estate, insurer, or lease interest before you accept an offer. The person selling must have authority to sell. Towing is free when we buy your ute. We confirm timing and equipment from its location, weight, condition, modifications, and safe access.",
      },
    ],
    faqs: [
      {
        question: "Do you quote on non-running Toyota HiLuxes?",
        answer:
          "Yes, depending on the ute's identity, condition, your authority to sell, and safe access. Tell us whether it starts, rolls, steers, brakes, and has all its wheels.",
      },
      {
        question: "Will a tray, canopy, or accessories change the quote?",
        answer:
          "They may. Send clear photos and tell us what is part of the sale. Condition, installation, suitability, and current demand decide whether equipment affects the offer.",
      },
      {
        question: "Can I sell a financed or company-owned HiLux?",
        answer:
          "Only when the finance position and authority to sell are clear. Get current lender or company approval documents before the sale is finalised.",
      },
      {
        question: "Is towing free for a HiLux?",
        answer:
          "Towing is free when we buy your ute and the ute and access match the details you gave us. We confirm the pickup plan before the truck is sent.",
      },
    ],
    relatedServices: [
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
