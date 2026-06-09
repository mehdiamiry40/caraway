import { cache } from "react";
import { BUSINESS } from "@/lib/site";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSection {
  heading: string;
  content: string;
}

export interface ServicePage {
  slug: string;
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
    title: "Cash for Cars Brisbane | Fair Offers, Fast Free Pickup",
    metaDescription: `Cash for cars Brisbane: get a fair cash offer based on your vehicle details. Free towing, payment on pickup, Greater Brisbane. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Cars Brisbane — Get Paid Today",
    intro: "Looking to sell your car fast in Brisbane? Caraway is one of Brisbane's trusted cash for cars buyers, giving fair offers for vehicles in any condition — up to $9,999 for selected vehicles. Whether your car is old, damaged, scrap, or running perfectly, we'll make you a clear cash offer and pick it up the same or next day, free of charge. Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers.",
    sections: [
      {
        heading: "How Our Cash for Cars Service Works",
        content: "Selling your car for cash in Brisbane couldn't be simpler. Use our online price estimator or fill out our quote form with your car's details — make, model, year, and condition. We'll give you a no-obligation cash offer within minutes. If you accept, we'll arrange free pickup at a time that suits you — often the same or next day. Our driver arrives, pays you in cash on the spot, and tows your vehicle away at no cost. The entire process takes less than an hour from start to finish."
      },
      {
        heading: "Why Brisbane Locals Choose Caraway",
        content: "We focus on making the sale straightforward: cars are assessed as-is, there are no classified ads or stranger test drives, and towing is included when we buy. We provide a receipt and buyer details for the applicable Queensland paperwork, and payment is confirmed before the vehicle leaves. We're a Brisbane-based buyer — not a national lead broker."
      },
      {
        heading: "What Cars We Buy for Cash in Brisbane",
        content: "We buy all types of vehicles across Brisbane — sedans, utes, 4WDs, SUVs, vans, trucks, and fleet vehicles. It doesn't matter if your car is running or not, registered or unregistered, crashed or flood-damaged. Old Commodores, Falcons, Camrys, Corollas, Hiluxes — we buy them all. We also purchase prestige and European vehicles, commercial vehicles, and motorcycles."
      },
      {
        heading: "Same- or Next-Day Car Removal Across Brisbane",
        content: "When you accept our offer, we can usually arrange same- or next-day pickup anywhere in Greater Brisbane. Our fleet covers all suburbs from Caboolture in the north to Beenleigh in the south, and from Ipswich in the west to Cleveland in the east. Weekend and after-hours pickups are available by arrangement. We work around your schedule, not the other way around."
      },
      {
        heading: "How Much Cash Will I Get for My Car?",
        content: "Offers may range from $200 to $9,999 depending on the vehicle. The amount we pay depends on your vehicle's make, model, year, condition, completeness, location, and the current market for parts and scrap metal. Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers. If you have another written quote, mention it — we'll see what we can do."
      },
      {
        heading: "How We Calculate Your Car Offer",
        content: "Your offer depends on the vehicle's make, model, year, condition, location, whether it is complete, whether it can roll, and current parts or resale demand. Scrap vehicles usually receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers."
      }
    ],
    faqs: [
      { question: "Will I really get up to $9,999 for my car?", answer: "Some selected vehicles may receive offers up to $9,999, but most older, damaged, or scrap vehicles receive lower offers. Your quote depends on the vehicle's make, model, year, condition, completeness, location, and current market demand." },
      { question: "How quickly can I get cash for my car in Brisbane?", answer: "Most sellers receive same- or next-day payment. Once you accept our offer, we can often arrange pickup within a few hours. You're paid in cash before the car leaves your property." },
      { question: "Do you buy cars without registration?", answer: "Yes, we buy unregistered, deregistered, and expired-registration vehicles across Brisbane. No current registration is required." },
      { question: "Is your car removal really free?", answer: "Absolutely. There are no towing fees or hidden pickup costs. We do not deduct towing from your agreed quote when the vehicle matches the details provided." },
      { question: "What areas of Brisbane do you cover?", answer: "We cover all of Greater Brisbane including North Brisbane, South Brisbane, East Brisbane, West Brisbane, Logan, Ipswich, Redland Bay, and Moreton Bay regions." }
    ],
    relatedServices: ["car-removal-brisbane", "sell-my-car-brisbane", "scrap-car-removal-brisbane", "unwanted-cars-brisbane"],
    relatedSuburbs: ["north-brisbane", "south-brisbane", "logan", "ipswich", "redcliffe", "bayside-brisbane"]
  },
  {
    slug: "car-removal-brisbane",
    title: "Free Car Removal Brisbane | Same- or Next-Day Pickup",
    metaDescription: `Free car removal across Brisbane when we buy. Same- or next-day pickup is usually available, with payment confirmed at collection. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Free Car Removal Brisbane — Same- or Next-Day Service",
    intro: "Need a car removed from your property in Brisbane? Caraway offers free car removal across Greater Brisbane with same- or next-day pickup available 7 days a week. We don't just remove your car — we pay you cash for it. No towing fees, no hidden charges, no hassle.",
    sections: [
      {
        heading: "How Our Brisbane Car Removal Works",
        content: "Our car removal process is straightforward. Contact us with your vehicle details for a free, no-obligation quote. Once you accept, our pickup driver comes at the agreed time with the towing equipment needed for non-running vehicles. We confirm the agreed payment before loading and provide a receipt and buyer details for the Queensland paperwork that applies."
      },
      {
        heading: "We Remove All Types of Vehicles",
        content: "Our removal service covers all vehicle types and conditions. We remove old cars that have been sitting in driveways for years, accident-damaged vehicles, mechanically failed cars, flood-damaged cars, fire-damaged vehicles, and end-of-life scrap cars. We also remove commercial vehicles, vans, trucks, utes, and 4WDs. If it has wheels, we can remove it."
      },
      {
        heading: "Brisbane-Wide Coverage, No Exceptions",
        content: "We operate across the entire Greater Brisbane region. Whether you're in the CBD, inner suburbs like West End and New Farm, northern suburbs like Chermside and North Lakes, southern suburbs like Logan and Springwood, or western areas like Ipswich and Springfield — our team will come to you. We never charge extra for distance."
      },
      {
        heading: "Why Choose Caraway for Car Removal?",
        content: "Unlike many car removal services that charge towing fees, Caraway includes removal when we buy and provides a clear offer before dispatch. We're insured and Brisbane-based, and our drivers aim to be professional and punctual. Vehicles intended for dismantling or recycling are sent through appropriate specialist facilities."
      }
    ],
    faqs: [
      { question: "Is car removal really free in Brisbane?", answer: "Yes — 100% free. We never charge for towing or pickup. The price we quote is the full amount you receive in cash, with nothing deducted." },
      { question: "How fast can you remove my car?", answer: "We offer same- or next-day car removal across most Brisbane suburbs. Contact us before midday and we can usually arrange afternoon pickup." },
      { question: "Do you remove cars that don't run?", answer: "Yes. Our tow trucks can load non-running, broken-down, and immobile vehicles. Your car doesn't need to start or drive." },
      { question: "Can you remove a car from a tight space?", answer: "Yes. Our experienced drivers can retrieve vehicles from garages, backyards, driveways, underground car parks, and other tight locations." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "scrap-car-removal-brisbane", "unwanted-cars-brisbane", "junk-cars-brisbane"],
    relatedSuburbs: ["chermside", "carindale", "sunnybank", "mount-gravatt", "toowong", "north-lakes"]
  },
  {
    slug: "sell-my-car-brisbane",
    title: "Sell My Car Brisbane | Instant Cash, No Hassle",
    metaDescription: `Sell your car in Brisbane fast. Get an instant cash offer, free pickup, same- or next-day payment. No advertising, no tyre-kickers. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell My Car Brisbane — Instant Offer, No Hassle",
    intro: "Want to sell your car quickly in Brisbane without the hassle of private sales? Caraway makes selling your car effortless. Get an instant cash offer, skip the advertising and test drives, and get paid the same or next day. We buy all makes and models in any condition.",
    sections: [
      {
        heading: "Skip the Hassle of Private Sales",
        content: "Selling a car privately in Brisbane means weeks of advertising, fielding calls from time-wasters, arranging test drives with strangers, negotiating with lowballers, and dealing with transfer paperwork. With Caraway, you skip all of that. One phone call, one fair offer, one quick pickup. You get your cash and move on with your day."
      },
      {
        heading: "Get a Fair Price Without the Wait",
        content: "Our team uses real-time market data to price your vehicle fairly. We consider the make, model, year, kilometres, condition, and current demand. You'll receive a transparent offer with no hidden fees or surprise deductions at pickup. If you've received quotes from other buyers, we're happy to try to beat them."
      },
      {
        heading: "We Buy Cars Dealers Won't Touch",
        content: "Dealerships often turn away older vehicles, high-kilometre cars, or those needing mechanical work. Caraway doesn't discriminate. We buy vehicles that dealers refuse — old Commodores with 300,000km, Camrys with blown head gaskets, Hiluxes with rust, and everything in between. Your car's imperfections don't bother us."
      },
      {
        heading: "Minimal Paperwork Required",
        content: "Bring current photo ID and any registration, finance, insurer, estate, or ownership documents relevant to the vehicle. We provide a signed receipt and buyer details, while you complete and retain confirmation of the seller-side TMR steps that apply."
      }
    ],
    faqs: [
      { question: "How do I sell my car to Caraway in Brisbane?", answer: "Use our online price estimator or submit our quote form. Provide your car's details and we'll give you a free offer based on those details. Accept, and we'll pick up your car and pay you cash — often the same or next day." },
      { question: "Do I need a roadworthy to sell my car?", answer: "We can assess your car as-is without a safety certificate. Queensland requirements depend on registration status and sale type, so check current TMR guidance and confirm the applicable paperwork before pickup." },
      { question: "How much can I get for my car?", answer: "Offers may range from $200 to $9,999 depending on the vehicle, but there is no one-size-fits-all price. Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers. Contact us for a free, no-obligation quote specific to your vehicle." },
      { question: "Can I sell a car I still owe finance on?", answer: "In some cases, yes. Contact us to discuss your situation. We can sometimes arrange payout of the remaining finance as part of the sale." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "car-removal-brisbane", "used-cars-brisbane", "old-cars-brisbane"],
    relatedSuburbs: ["indooroopilly", "moorooka", "springwood", "browns-plains", "caboolture"]
  },
  {
    slug: "scrap-car-removal-brisbane",
    title: "Scrap Car Removal Brisbane | Cash for Scrap Cars",
    metaDescription: `Scrap car removal Brisbane. Cash for scrap cars, wrecks, and junk cars — removed free. Same- or next-day service. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Scrap Car Removal Brisbane — Cash for Your Scrap Car",
    intro: "Got a scrap car taking up space on your property? Caraway pays cash for scrap cars across Brisbane and removes them free of charge. Whether your vehicle is completely wrecked, mechanically beyond repair, or simply reached end-of-life — we'll pay you and take it away today.",
    sections: [
      {
        heading: "What Counts as a Scrap Car?",
        content: "A scrap car is any vehicle that's no longer economically viable to repair or register. This includes cars with blown engines, seized transmissions, major structural damage, extensive rust, fire damage, or vehicles that have simply reached the end of their useful life. If the cost of repairs exceeds the car's value, it's a scrap car — and we'll pay you cash for it."
      },
      {
        heading: "How We Value Scrap Cars in Brisbane",
        content: "Even scrap cars have value. We assess scrap vehicles based on their weight (steel and aluminium content), salvageable parts, and current scrap metal market prices. A standard sedan typically yields $300–$500 in scrap value, while larger vehicles like 4WDs, vans, and trucks can fetch significantly more. We always offer competitive prices based on real market conditions."
      },
      {
        heading: "Environmentally Responsible Scrap Car Disposal",
        content: "We don't just dump scrap cars. Every vehicle we collect is processed at licensed recycling facilities in Queensland. We drain and safely dispose of all fluids — oil, coolant, brake fluid, and fuel. Batteries, tyres, and hazardous materials are handled according to EPA guidelines. Salvageable parts are refurbished for reuse, and remaining materials are recycled. We take environmental responsibility seriously."
      },
      {
        heading: "Same- or Next-Day Scrap Car Pickup Brisbane",
        content: "Don't let that old wreck sit in your yard another week. Call us before midday and we can usually remove your scrap car the same afternoon. Our tow trucks are equipped to handle non-running vehicles, cars without wheels, and vehicles in difficult locations. We come to you — garage, driveway, paddock, or workshop."
      }
    ],
    faqs: [
      { question: "How much is my scrap car worth in Brisbane?", answer: "Scrap car values depend on size, weight, and condition. Standard cars typically fetch $300–$500, while larger vehicles can be worth more. Contact us for a specific quote." },
      { question: "Can you remove a car with no engine?", answer: "Yes. We remove vehicles in any state — no engine, no wheels, no doors. If there's enough of the car to identify it, we'll take it." },
      { question: "Do I need paperwork for a scrap car?", answer: "Bring current photo ID and any registration or ownership records you have. We provide a receipt and buyer details, and you complete the seller-side TMR steps that apply to a transfer, cancellation, or unregistered sale." },
      { question: "Is scrap car removal really free?", answer: "Yes. We do not charge for towing or removal, and we do not deduct towing costs from your agreed quote when the vehicle matches the details provided." }
    ],
    relatedServices: ["car-removal-brisbane", "junk-cars-brisbane", "old-cars-brisbane", "unwanted-cars-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "caboolture", "browns-plains", "beenleigh"]
  },
  {
    slug: "unwanted-cars-brisbane",
    title: "Unwanted Car Removal Brisbane | Cash Paid Today",
    metaDescription: `Got an unwanted car in Brisbane? We pay cash and remove it free. Any make, any condition. Same- or next-day pickup available. Call Caraway on ${BUSINESS.phoneDisplay}.`,
    h1: "Unwanted Car Removal Brisbane — Turn It Into Cash",
    intro: "That unwanted car sitting in your driveway, garage, or yard doesn't have to be a headache. Caraway turns unwanted vehicles into instant cash across Brisbane. We buy any unwanted car regardless of its age, condition, or registration status — and we remove it free.",
    sections: [
      {
        heading: "Why Do Cars Become Unwanted?",
        content: "Cars become unwanted for many reasons. Maybe you've upgraded and the old car is just taking up space. Perhaps it failed its safety inspection and isn't worth fixing. Maybe you've inherited a vehicle you don't need, or your car was damaged in an accident and you'd rather take the cash than repair it. Whatever the reason, Caraway is a straightforward way to turn that unwanted car into money."
      },
      {
        heading: "We Buy All Unwanted Vehicles",
        content: "Our service covers every type of unwanted vehicle in Brisbane. Old family cars, deceased estate vehicles, ex-company fleet cars, vehicles with mechanical problems, cars that have been sitting unused for years, and vehicles that simply aren't worth the hassle of selling privately. If you don't want it, we do — and we'll pay you for it."
      },
      {
        heading: "Fast, Convenient Removal at Your Location",
        content: "We come to you anywhere in Greater Brisbane. You don't need to drive the car anywhere or arrange independent towing. Our team arrives at your location with a flatbed tow truck, pays you cash, loads the vehicle, and leaves. The whole process takes about 30 minutes. We can even remove cars from backyards, sheds, and properties where there's limited access."
      },
      {
        heading: "Unwanted Car Removal Across Every Brisbane Suburb",
        content: "Our unwanted car removal service covers every postcode across Greater Brisbane, from Bracken Ridge and Bald Hills in the north through to Beenleigh, Loganholme, and Mount Warren Park in the south. We regularly run to the western suburbs along the Ipswich Motorway — Jindalee, Darra, Wacol, Goodna, and out to Ipswich itself — and we cover the bayside and Redlands from Wynnum through Capalaba to Victoria Point and Redland Bay. Rural properties on the fringes of the city are no problem either: our flatbed trucks can reach acreages around Samford, Dayboro, and the outer Moreton Bay region. Wherever the unwanted car is sitting, we'll make the trip. Our drivers know the quirks of Brisbane's road network — the tight streets of Paddington, the steep driveways of Kenmore, the apartment complexes along Coronation Drive, the industrial estates of Geebung and Rocklea — and they come prepared with the right equipment for the job. We don't charge distance surcharges and we never reduce a quote because of the suburb you're in. Whether you're inside the CBD or on the edge of the Scenic Rim, the cash offer is the same fair number on the phone as at pickup."
      },
      {
        heading: "Why Unwanted Cars Cost You Money Every Day You Wait",
        content: "An unwanted car isn't a neutral thing — it quietly costs you money and space every day it sits. If it's still registered, you're paying registration and CTP insurance for a vehicle you're not using: in Queensland that's around $840 per year for a standard four-cylinder private car. If you're storing it in a garage or carport, you're losing usable space on your own property. If it's outside, it's weathering — paint oxidising, seals perishing, upholstery fading, tyres going flat and cracking. Mice and possums get into the engine bay and chew wiring looms. Brake discs rust onto calipers. Fuel turns to varnish in the lines. Every month the car sits, it loses value you'll never recover. On top of the financial cost, Brisbane City Council and surrounding councils can issue abandoned vehicle infringements for derelict cars visible from the street — fines start around $330 and can climb quickly if the problem isn't addressed. Selling to Caraway stops the bleed immediately. You get the money, you get the space back, and you stop worrying about fines, rust, and rodents. Most of our customers say the hardest part was picking up the phone; after that, the car was gone in hours."
      }
    ],
    faqs: [
      { question: "What is an unwanted car worth in Brisbane?", answer: "Values range from $200 for end-of-life vehicles to several thousand dollars for newer unwanted cars in reasonable condition. Get a free quote using our online price estimator." },
      { question: "Can you remove an unwanted car today?", answer: "In most cases, yes. Contact us in the morning and we can usually arrange same- or next-day removal across Brisbane suburbs." },
      { question: "Do I need to be home for the pickup?", answer: "Ideally yes, as we pay cash in person and need your ID. However, we can make alternative arrangements if you're unable to be present — just ask." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "car-removal-brisbane", "old-cars-brisbane", "junk-cars-brisbane"],
    relatedSuburbs: ["north-brisbane", "south-brisbane", "chermside", "carindale", "moorooka"]
  },
  {
    slug: "damaged-cars-brisbane",
    title: "Cash for Damaged Cars Brisbane | Any Damage Accepted",
    metaDescription: `Sell your damaged car for cash in Brisbane. We buy crash-damaged, hail-damaged, and mechanically damaged cars. Free removal. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Damaged Cars Brisbane",
    intro: "Has your car been damaged in an accident, hailstorm, or flood? Don't spend thousands on repairs — sell it to Caraway for instant cash. We buy all types of damaged vehicles across Brisbane and remove them free of charge, regardless of the extent of the damage.",
    sections: [
      {
        heading: "Types of Damaged Cars We Buy",
        content: "We purchase vehicles with all types of damage: front-end and rear-end collision damage, side impact damage, hail damage, flood and water damage, fire damage, storm damage, vandalism damage, and mechanical damage including blown engines, failed transmissions, and electrical faults. The severity doesn't matter — from minor panel damage to complete write-offs, we'll make an offer."
      },
      {
        heading: "Better Than an Insurance Payout?",
        content: "If your insurer has written off your vehicle, their payout might not reflect what the car is actually worth. Before accepting an insurance settlement, get a quote from Caraway. In many cases, we can offer competitive rates for written-off vehicles, and our process is faster than dealing with insurance claims. You could have cash in hand today."
      },
      {
        heading: "Damaged Car Valuation in Brisbane",
        content: "We assess damaged cars based on the vehicle's pre-damage value, the extent of damage, salvageable components, and current parts market demand. Even heavily damaged cars contain valuable parts — engines, transmissions, alternators, starter motors, body panels, and interior components. These parts have real value, and that value goes straight into your cash offer."
      },
      {
        heading: "Flood, Hail, and Storm Damage in South-East Queensland",
        content: "Brisbane weather can be hard on vehicles, especially after hail, flood, and storm events. Flood exposure may affect wiring, electronics, safety systems, interior materials, and structural components even when an engine still runs. Caraway assesses flood- and storm-affected vehicles from the details provided, and vehicles intended for dismantling or recycling are directed to appropriate specialists."
      },
      {
        heading: "Insurance Write-Off vs Cash Sale: Which Makes Sense?",
        content: "If you've been in a prang and your insurer is talking about a total loss payout, it's worth running the numbers before signing anything. Insurance write-off values are calculated from market guides minus the salvage value the insurer will recover by selling the wreck at auction — which means the payout you actually see can be surprisingly low, especially for older cars that fall outside the main valuation guides. For vehicles 10+ years old, a direct cash sale to Caraway often matches or beats the insurance offer, and you get the money in hours rather than weeks of claim processing. You also avoid the hit to your no-claim bonus if you're able to withdraw the claim before it's finalised. On newer cars with comprehensive cover and a recent market-value payout, the insurance route usually wins. We're happy to give you an honest quote to compare against your insurance offer — no pressure, no obligation. If the insurer's number is better, take it. If ours is better, or if you just want the car gone faster, we'll come and collect it the same day. Many Brisbane sellers also come to us after the insurance claim is finalised but the insurer has left them with the damaged vehicle to dispose of — that's an easy cash transaction too."
      }
    ],
    faqs: [
      { question: "Will you buy a car that's been in a major accident?", answer: "Yes. We buy accident-damaged cars of all severity levels, from minor fender benders to total write-offs. Contact us for a quote regardless of the damage." },
      { question: "Do you buy hail-damaged cars in Brisbane?", answer: "Absolutely. Hail damage is cosmetic and doesn't affect our ability to salvage parts. We pay fair prices for hail-damaged vehicles." },
      { question: "Can you remove a car that can't be driven?", answer: "Yes. Our tow trucks handle non-driveable vehicles. Your car doesn't need to start, steer, or brake. We load it and take it away." }
    ],
    relatedServices: ["accident-cars-brisbane", "cash-for-cars-brisbane", "car-removal-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["sunnybank", "mount-gravatt", "toowong", "indooroopilly", "redcliffe"]
  },
  {
    slug: "accident-cars-brisbane",
    title: "Cash for Accident Cars Brisbane | Sell Crashed Cars",
    metaDescription: `Sell your accident car for cash in Brisbane. We buy crashed, written-off, and collision-damaged vehicles. Free towing, instant payment. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Accident Cars Brisbane — Sell Your Crashed Car",
    intro: "Been in a car accident in Brisbane? If your vehicle has been crashed, written off, or isn't worth repairing — sell it to Caraway for instant cash. We specialise in purchasing accident-damaged vehicles and offer free removal from anywhere across Greater Brisbane.",
    sections: [
      {
        heading: "Selling After an Accident in Brisbane",
        content: "After a car accident, you're left with difficult decisions. Repair bills can run into thousands, insurance excesses add up, and you might be left without a car for weeks while a panel beater works on it. Selling to Caraway gives you a clean break — instant cash to put toward a replacement vehicle, with no ongoing headaches."
      },
      {
        heading: "We Buy All Accident-Damaged Cars",
        content: "From minor collisions to serious crashes, we purchase all accident-damaged vehicles in Brisbane. T-bone collisions, rollover damage, rear-end accidents, head-on crashes, multi-vehicle pile-up damage — we've seen it all and we'll make you a fair offer regardless. We also buy statutory write-offs and repairable write-offs."
      },
      {
        heading: "Quick Cash After Your Accident",
        content: "When you've been in an accident, the last thing you want is a drawn-out selling process. Contact Caraway and you could have cash in your hands within hours. We provide instant quotes over the phone, arrange same- or next-day pickup, and pay you before we take the vehicle. It's a simple way to move on from an accident."
      },
      {
        heading: "Understanding Statutory vs Repairable Write-Offs in Queensland",
        content: "If you've been in a serious accident in Brisbane, your insurer may have classified the vehicle as either a statutory write-off or a repairable write-off. The distinction matters a lot for what happens next. A statutory write-off is a vehicle Queensland Transport has determined can never be re-registered for road use — typically because the structural damage, fire damage, or flood exposure is so severe that the vehicle cannot be safely repaired to roadworthy standard. Statutory write-offs are flagged permanently on the Written-Off Vehicle Register and can only be sold for parts or scrap. A repairable write-off, on the other hand, can theoretically be fixed and re-registered, provided it passes a written-off vehicle inspection and meets all the compliance requirements. Caraway buys both categories. For statutory write-offs we value the vehicle based on salvageable parts and scrap metal weight. For repairable write-offs we often pay significantly more, because the car still has value as a rebuild project or as a donor for other cars of the same model. If you're not sure which category your vehicle falls into, call us with the claim number or the VIN and we'll talk you through it. Either way, the paperwork on our end is straightforward and you don't need a panel beater's quote, a police report, or an engineer's report to sell to us."
      },
      {
        heading: "What Happens to Accident Cars After We Buy Them",
        content: "Vehicles intended for parts recovery or recycling go to specialist operators across South-East Queensland. Usable components may return to the parts market, while end-of-life vehicles are depolluted before metals and other recoverable materials are processed. We provide a sale receipt and buyer details; the seller should complete and verify the applicable TMR transfer or cancellation steps and retain confirmation."
      }
    ],
    faqs: [
      { question: "How much is an accident car worth in Brisbane?", answer: "It depends on the vehicle and damage severity. We offer fair prices based on salvageable parts and materials. Even total write-offs have value — contact us for a specific quote." },
      { question: "Do I need a police report to sell an accident car?", answer: "No. We don't require police reports. We just need your photo ID and access to the vehicle." },
      { question: "Can I sell a statutory write-off?", answer: "Yes. We buy statutory write-offs (which can never be re-registered in Queensland) as well as repairable write-offs." }
    ],
    relatedServices: ["damaged-cars-brisbane", "cash-for-cars-brisbane", "car-removal-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "north-brisbane", "south-brisbane", "caboolture"]
  },
  {
    slug: "old-cars-brisbane",
    title: "Cash for Old Cars Brisbane | Sell Your Old Car Today",
    metaDescription: `Sell your old car for cash in Brisbane. We buy old, high-mileage, and end-of-life vehicles. Free removal, same- or next-day cash. Call Caraway ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Old Cars Brisbane — Your Old Car Is Worth Money",
    intro: "Think your old car is worthless? Think again. Caraway pays cash for old cars across Brisbane — even high-kilometre vehicles, cars from the 90s, and older models that dealers won't touch. Free removal, same- or next-day payment, zero hassle.",
    sections: [
      {
        heading: "Your Old Car Still Has Value",
        content: "Even old cars with high kilometres, faded paint, and worn interiors have real value. Mechanical components like engines, gearboxes, and differentials are in constant demand. Body panels, lights, mirrors, and interior parts are sought after by second-hand parts suppliers. And the steel, aluminium, and copper in your old car have scrap metal value. Don't let it rust away for nothing."
      },
      {
        heading: "Old Cars We Commonly Buy in Brisbane",
        content: "We frequently purchase older Holden Commodores, Ford Falcons, Toyota Camrys and Corollas, Nissan Pulsars, Mitsubishi Lancers, Mazda 3s and 6s, Hyundai Accents and i30s, Subaru Imprezas, and Honda Civics. We also buy older 4WDs, utes, and vans. No matter the brand or model — if it's old and you want it gone, we want it."
      },
      {
        heading: "Why Sell Your Old Car Instead of Leaving It?",
        content: "An old car sitting unused on your property is more than an eyesore. It can leak fluids into the ground, attract pests, reduce your property value, and create a safety hazard. Councils in Brisbane can even issue fines for derelict vehicles on residential properties. Selling to Caraway solves all of these problems while putting cash in your pocket."
      }
    ],
    faqs: [
      { question: "How old can a car be for you to buy it?", answer: "There's no age limit. We buy cars from the 1970s, 80s, 90s, 2000s, and newer. As long as we can identify the vehicle, we'll make an offer." },
      { question: "Will you buy a car with over 300,000km?", answer: "Yes. High-kilometre vehicles still have value in parts and materials. We regularly buy cars with 300,000+ kilometres." },
      { question: "My old car hasn't been started in years — can you still buy it?", answer: "Absolutely. Non-running, non-starting old cars are among the most common vehicles we purchase. Our tow truck will collect it from wherever it's sitting." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "scrap-car-removal-brisbane", "unwanted-cars-brisbane", "junk-cars-brisbane"],
    relatedSuburbs: ["moorooka", "browns-plains", "springwood", "mount-gravatt", "chermside"]
  },
  {
    slug: "junk-cars-brisbane",
    title: "Junk Car Removal Brisbane | Cash for Junk Cars",
    metaDescription: `Junk car removal in Brisbane with payment confirmed at pickup. We assess vehicles in any condition and include towing when we buy. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Junk Car Removal Brisbane — Cash for Your Junk Car",
    intro: "Got a junk car cluttering up your property? Caraway turns junk into cash across Brisbane. We buy and remove junk cars in any condition — rusted out, engine blown, body damaged, missing parts — and pay you on the spot. Free removal, no strings attached.",
    sections: [
      {
        heading: "What Makes a Car 'Junk'?",
        content: "A junk car is generally a vehicle that's no longer roadworthy, cost-effective to repair, or useful as daily transport. It might have severe rust, mechanical failure, missing components, accident damage, or simply be too old to pass a safety inspection. Whatever state your junk car is in, it still contains valuable materials and parts that make it worth money."
      },
      {
        heading: "Junk Car Prices in Brisbane",
        content: "Junk car values vary based on vehicle size, weight, condition, and salvageable components. Small sedans typically fetch $300–$400, while larger vehicles like 4WDs, vans, and trucks can be worth $300–$1,500+ depending on parts demand. We base our offers on current Brisbane market conditions, not arbitrary low-ball figures."
      },
      {
        heading: "Get Rid of Your Junk Car Today",
        content: "Why let a junk car sit around any longer? Every day it sits, it loses value to rust and deterioration. Call Caraway today and we'll arrange same- or next-day removal in most Brisbane suburbs. You'll have cash in hand and your space back before dinner. It's quick, easy, and completely free."
      }
    ],
    faqs: [
      { question: "Do you buy junk cars with no registration?", answer: "Yes. Most junk cars we purchase are unregistered. You don't need current plates or registration to sell to us." },
      { question: "Can you remove a junk car from a backyard?", answer: "Yes. Our drivers are experienced at retrieving vehicles from tight and difficult locations including backyards, garages, and rural properties." },
      { question: "What happens to junk cars after you buy them?", answer: "Usable parts are salvaged and resold. Remaining materials are recycled at licensed facilities. We dispose of all fluids and hazardous materials responsibly." }
    ],
    relatedServices: ["scrap-car-removal-brisbane", "old-cars-brisbane", "car-removal-brisbane", "unwanted-cars-brisbane"],
    relatedSuburbs: ["ipswich", "logan", "caboolture", "redcliffe", "beenleigh"]
  },
  {
    slug: "unregistered-cars-brisbane",
    title: "Sell Unregistered Cars Brisbane | No Rego Needed",
    metaDescription: `Sell an unregistered car in Brisbane with a clear quote, free pickup when we buy, and payment confirmed at collection. Call Caraway on ${BUSINESS.phoneDisplay}.`,
    h1: "Sell Your Unregistered Car in Brisbane for Cash",
    intro: "No registration? Caraway assesses unregistered vehicles across Brisbane and includes pickup when we buy. Whether the registration expired, was cancelled, or the vehicle was never registered in Queensland, we can quote on it as-is and explain what sale records we need.",
    sections: [
      {
        heading: "Why Sell an Unregistered Car?",
        content: "An unregistered car can't legally be driven on Queensland roads. Re-registering it means getting a safety inspection (which could require expensive repairs), paying registration fees, and dealing with Queensland Transport paperwork. For many vehicles — especially older or damaged ones — the cost of re-registration exceeds the car's value. Selling to Caraway is the smarter option."
      },
      {
        heading: "No Registration Hassles with Caraway",
        content: "Expired registration, cancelled registration, interstate registration, or no plates do not prevent us from assessing a vehicle. The offer is based on the vehicle's details, condition, completeness, location, and demand. We provide a receipt and buyer details; you retain confirmation of any seller-side TMR steps that apply."
      },
      {
        heading: "Common Unregistered Cars We Buy",
        content: "We regularly purchase unregistered vehicles that have been sitting in yards, garages, and sheds across Brisbane. Cars with expired registration that owners let lapse, project cars that never got finished, inherited vehicles from deceased estates, and cars bought at auction that were never registered. Whatever the backstory, we're interested."
      }
    ],
    faqs: [
      { question: "Can I sell a car with expired registration?", answer: "Yes. Expired, cancelled, or lapsed registration doesn't prevent you from selling to us. We buy vehicles regardless of registration status." },
      { question: "What ID do I need to sell an unregistered car?", answer: "Just your driver's licence or photo ID. If you have any ownership documents or previous registration papers, bring those too — but they're not essential." },
      { question: "How do you remove an unregistered car that can't be driven?", answer: "Our tow truck will come to your location and load the vehicle. Your car doesn't need to be roadworthy or driveable for us to remove it." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "old-cars-brisbane", "unwanted-cars-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["south-brisbane", "north-brisbane", "springwood", "toowong", "north-lakes"]
  },
  {
    slug: "used-cars-brisbane",
    title: "Sell Used Cars Brisbane | Fair Cash Price Today",
    metaDescription: `Sell your used car for a fair price in Brisbane. Skip private sales — get an instant cash offer. Free pickup, same- or next-day payment. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Sell Your Used Car in Brisbane — Fair Cash Offer",
    intro: "Selling a used car in Brisbane doesn't have to mean weeks of advertising and awkward test drives. Caraway offers a straightforward way to sell your used car — instant cash offers, free pickup, and same- or next-day payment. We buy all used vehicles in any condition.",
    sections: [
      {
        heading: "The Smart Alternative to Private Sales",
        content: "Selling privately in Brisbane means listing on Gumtree or Facebook Marketplace, fielding dozens of messages, arranging inspections, dealing with no-shows, and negotiating with buyers who always want a discount. You might wait weeks or months for a sale, all while paying insurance and registration. With Caraway, you get a fair offer instantly and have cash in hand the same or next day."
      },
      {
        heading: "Fair Market Offers for Used Cars",
        content: "We use real-time market data, recent sales, and condition assessments to offer fair prices for used cars in Brisbane. While we may not match private sale top-dollar prices, we compensate with speed, convenience, and zero listing costs — payment when we collect the car. For many Brisbane sellers, the time saved is worth the trade-off."
      },
      {
        heading: "All Makes and Models Accepted",
        content: "We buy all used car brands popular in Brisbane — Toyota, Holden, Ford, Mazda, Hyundai, Kia, Nissan, Mitsubishi, Subaru, Honda, Volkswagen, BMW, Mercedes, Audi, and more. Sedans, hatchbacks, wagons, utes, SUVs, 4WDs, vans, and trucks. Any age, any mileage, any condition. One call does it all."
      }
    ],
    faqs: [
      { question: "How much will I get for my used car?", answer: "Used car offers depend on make, model, year, condition, kilometres, completeness, location, and current market demand. Selected newer or high-demand vehicles may receive higher offers, while older, damaged, or incomplete vehicles usually receive lower offers. Contact us for a specific quote." },
      { question: "Is selling to Caraway better than a dealership trade-in?", answer: "Often, yes. Dealerships heavily discount trade-in values to protect their margins. We offer transparent, competitive cash prices without the pressure to buy another vehicle." },
      { question: "How long does the process take?", answer: "From quote to cash in hand, the entire process can be completed in under an hour. Most sellers have their used car sold and removed the same or next day they contact us." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "car-removal-brisbane", "old-cars-brisbane"],
    relatedSuburbs: ["indooroopilly", "carindale", "chermside", "toowong", "bayside-brisbane"]
  },
  {
    slug: "insurance-write-off-cars-brisbane",
    title: "Insurance Write-Off Cars Brisbane | Caraway",
    metaDescription: "Sold your car to the insurance company but kept the salvage rights? We buy statutory and repairable write-offs across Brisbane. Free pickup, cash on the spot.",
    h1: "Insurance Write-Off Cars Brisbane",
    intro: "If your insurer has declared your vehicle a total loss and you retain the salvage, Caraway can assess both statutory and repairable write-offs across Greater Brisbane. We include towing when we buy, provide a signed receipt and buyer details, and usually offer same- or next-day pickup subject to availability.",
    sections: [
      {
        heading: "Statutory vs Repairable Write-Offs Explained",
        content: "When an insurer writes off a car in Queensland, the vehicle is flagged on the Written-Off Vehicle Register (WOVR) and classified into one of two categories. A statutory write-off is a vehicle TMR has determined can never be re-registered for road use — the damage is so severe that the car cannot be repaired to roadworthy standard. Typical causes include major structural collapse, full fire damage, or flood immersion above the dashboard. Statutory write-offs can only be sold for parts or scrap. A repairable write-off, on the other hand, has been deemed economically not worth repairing by the insurer, but can still be rebuilt, inspected, and re-registered if someone is prepared to do the work. Caraway buys both. Repairable write-offs often fetch significantly higher prices because the vehicle still has value as a rebuild project or as a mechanical donor for other cars of the same make and model. Statutory write-offs are valued on salvageable parts and scrap metal weight. If you're not sure which category applies to your vehicle, call us with the claim number or the VIN — we can usually tell you within a few minutes."
      },
      {
        heading: "How to Sell a Write-Off Car to Caraway",
        content: "Start with the make, model, year, damage description, and WOVR classification if known. If you accept the quote, we agree on a pickup window and payment method before dispatch. At pickup, the driver confirms the vehicle details, payment, and receipt. You then complete and retain confirmation of the seller-side TMR transfer or cancellation steps that apply."
      },
      {
        heading: "What Paperwork You Need",
        content: "The paperwork is minimal. Bring a current Queensland driver's licence or other government-issued photo ID. If you still have the registration certificate, that helps, but it's not essential — we can look the vehicle up by VIN if the papers are long gone. If the insurance claim has already been finalised and you've received a settlement letter or a notice from the insurer confirming you've retained salvage rights, hand that to the driver as well; it makes the WOVR paperwork faster to process. You do not need the written-off vehicle notice from TMR, and you do not need to have the car inspected before pickup. For vehicles with outstanding finance, let us know when you request the quote so we can discuss payout options — in many cases we can work directly with your lender to settle the loan as part of the sale. For deceased estate vehicles we'll ask for a copy of the death certificate and probate or letters of administration, but nothing more elaborate than that."
      }
    ],
    faqs: [
      { question: "Can I sell a car that's listed on the Written-Off Vehicle Register?", answer: "Yes. We assess both statutory and repairable write-offs. A statutory write-off cannot be re-registered, while repairable write-offs have separate inspection and registration requirements. Tell us the VIN and classification when requesting a quote." },
      { question: "Will your offer beat the insurance payout?", answer: "For newer vehicles on comprehensive cover, the insurance payout usually wins. For older cars (10+ years), or cars where the insurer has quoted a low market value, our offer is often competitive or better — plus you get the money in hours instead of waiting weeks for claim finalisation. We're happy to quote against your insurer's number without obligation." },
      { question: "Do I need to do anything before the pickup?", answer: "Gather photo ID, insurer correspondence, and any registration or ownership records. Remove personal belongings and confirm whether the transaction is a registered transfer, cancellation, or unregistered sale. Standard plates usually stay with a registered vehicle during a normal transfer; cancellation and personalised plates follow different rules." }
    ],
    relatedServices: ["damaged-cars-brisbane", "accident-cars-brisbane", "cash-for-cars-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "north-brisbane", "south-brisbane", "caboolture"]
  },
  {
    slug: "hail-damaged-cars-brisbane",
    title: "Hail Damaged Cars Brisbane | Caraway",
    metaDescription: "Hail or storm damage turning your car into a write-off? We buy hail-damaged vehicles across Brisbane. Free pickup, honest quote, no repair quotes needed.",
    h1: "Hail Damaged Cars Brisbane",
    intro: "Brisbane storm season is brutal on cars, and every summer we buy hundreds of hail-dimpled vehicles across the western and northern suburbs. If your car has been through a hailstorm and you're staring at a panel beater's quote that's worth more than the car, Caraway will take it off your hands for cash. Free pickup, same- or next-day service, no repair quotes or engineer's reports needed — we buy hail-damaged cars in any condition across Greater Brisbane.",
    sections: [
      {
        heading: "Queensland Storm Season and Why Hail Is So Bad for Cars",
        content: "Queensland's severe storm season runs from October through to March, and South-East Queensland consistently cops some of the worst hailstorms in Australia. Brisbane has taken direct hits from major hail events in 2014 (the Great Brisbane Hailstorm), 2020 (the Halloween storm through Rochedale and Springwood), and more recent cells that tracked across Chermside, The Gap, Kenmore, Ferny Grove, and out through Ipswich and Springfield. When a proper storm comes through — golf ball to cricket ball sized hail, driven by 80 km/h winds — a car parked in the open can be left with hundreds of dents across the bonnet, roof, and boot in the space of two or three minutes. The damage is almost always cosmetic rather than mechanical, but it's enough to write the car off for any buyer who cares about resale value. Insurers routinely declare hail-damaged cars total losses because the cost of traditional panel-beating and respraying runs into tens of thousands of dollars, and paintless dent repair (PDR) is impractical once there are more than a couple of hundred dents on a single panel. That's where Caraway comes in: we value hail-damaged cars on their mechanical and parts value, not on cosmetic condition, so dents don't cost you anything in the quote."
      },
      {
        heading: "Insurance Cash-Out vs Repair: Which Makes Sense?",
        content: "After a major hail event, most Brisbane drivers with comprehensive insurance have two broad options. The first is to let the insurer take the car, write it off, and pay out the agreed or market value minus the excess. The second is to elect to keep the car as a repairable write-off, accept a reduced cash settlement, and either drive the dimpled car as-is or try to on-sell it privately. Both paths end up at Caraway for a lot of sellers. If the insurer's settlement figure feels low — which is common on cars over 10 years old that sit outside the main valuation guides — we can quote directly against it. If you've already taken the cash settlement and retained salvage rights, we'll buy the car from you for a lump sum on top. If you're uninsured or were third-party only, we'll value the car as-is and give you a realistic figure within minutes. The quote is always free and obligation-free; if the insurer beats us, take their number. If we beat them or you just want the car gone today, we'll be at your address the same day."
      },
      {
        heading: "Typical Hail-Damaged Car Prices in Brisbane",
        content: "Offers on hail-damaged vehicles depend primarily on the car's mechanical condition, kilometres, make, and model — cosmetic hail dents barely move the needle. A 2015 Hyundai i30 with 150,000 kilometres and moderate hail damage that still runs well typically fetches between $2,500 and $5,500. A hail-damaged ute or 4WD from the last five years — HiLuxes, Rangers, Pajeros, Prados — may fetch $6,000 to $9,999+ depending on condition, because the underlying parts demand stays strong regardless of dented panels. Older vehicles (pre-2005) with heavy hail damage usually land between $400 and $1,500 based on salvage and scrap value. Most older or scrap vehicles receive lower offers, while newer, complete, repairable, or high-demand vehicles may receive higher offers. If your car is still mechanically sound and just looks like a golf ball, you'll be pleasantly surprised — we value it on the engine, drivetrain, and interior, not the roof. We also buy cars that were already write-offs before the hail hit, and storm-damaged vehicles with broken glass, water ingress, or fallen branches through the roof. No quotes required, no paperwork headaches, and free towing across Greater Brisbane."
      }
    ],
    faqs: [
      { question: "Do you buy hail-damaged cars even if they still drive?", answer: "Yes — in fact those are often our best-value pickups. A mechanically sound, hail-damaged car is worth significantly more than a non-runner because the drivetrain, electronics, and interior can all go back into the used parts market. Call us with the make, model, year, and kilometres and we'll quote on the spot." },
      { question: "Do I need a repair quote or insurance assessment to sell?", answer: "No. We don't need a panel beater's quote, an engineer's report, or an insurance assessment to make an offer. All we need is a description of the car — make, model, year, kilometres, and a rough idea of the damage — and we can quote within minutes. Bring photo ID on pickup day and we handle the rest." },
      { question: "What if my car is already a repairable write-off from the insurer?", answer: "No problem at all. We buy repairable write-offs every week, both from owners who've retained salvage rights after a claim and from sellers who'd rather cash the car out than try to drive it dimpled or list it privately. Mention the WOVR status when you request your quote and we'll factor it in." }
    ],
    relatedServices: ["damaged-cars-brisbane", "insurance-write-off-cars-brisbane", "cash-for-cars-brisbane", "accident-cars-brisbane"],
    relatedSuburbs: ["chermside", "indooroopilly", "north-brisbane", "ipswich", "toowong"]
  },
  {
    slug: "sell-toyota-hilux-brisbane",
    title: "Sell My Toyota HiLux Brisbane | Cash, Any Condition",
    metaDescription: `Sell your Toyota HiLux for cash in Brisbane. All generations — KUN, GUN, SR5, Workmate, dual-cab, extra-cab. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Toyota HiLux Brisbane — Any Year, Any Condition",
    intro: "The Toyota HiLux is the best-selling vehicle in Australia for good reason, and Brisbane HiLux owners often find they can earn a strong cash price even when the ute is tired, accident-damaged, or off the road. Caraway pays competitive cash for HiLuxes across every generation and trim — Workmate, SR, SR5, Rugged X, and Rogue — with free same- or next-day pickup anywhere in Greater Brisbane.",
    sections: [
      {
        heading: "Which HiLux Generations We Buy",
        content: "We buy every HiLux generation on Brisbane roads. That includes the N50/N60 (1988–1997) old-school workhorses that still turn up on rural blocks, the N140/N170 (1997–2005) solid-axle dual cabs that outlived their paintwork, the KUN26 N70 (2005–2015) which is the single most common HiLux in our Brisbane pickup schedule, the GUN126/GUN136 N80 (2015–2024) with the 1GD-FTV diesel, and the newest N90 range. Early 4-cylinder petrols, 3.0L 1KD diesels, 2.7L 2TR petrols, and the newer 2.8L turbodiesels all attract fair cash offers regardless of kilometres."
      },
      {
        heading: "Why HiLuxes Hold Their Value in Brisbane",
        content: "Queensland is the country's biggest HiLux market — tradies, farmers, fleet operators, and weekend 4WDers all buy them, and that demand keeps wholesale and parts values high even for high-kilometre examples. A tidy 2012 SR5 4x4 with 250,000 km will still pull strong money, and even a rolled or mechanically finished N70 is worth meaningful parts value because the KUN chassis shares components with Fortuners, Prados, and older HiAce vans. That's why our cash offers on HiLuxes consistently sit at the top end of what we pay for any non-prestige vehicle."
      },
      {
        heading: "We Buy HiLuxes in Any Condition",
        content: "Running or not, registered or not, tidy or rusted, we assess HiLuxes with mechanical faults, accident damage, hail damage, water damage, or heavy wear. We can quote from the vehicle details without requiring you to obtain a mechanic's repair estimate first."
      },
      {
        heading: "How Much Is My HiLux Worth in Brisbane?",
        content: "Offers depend on year, sub-model (4x2 vs 4x4, single cab vs dual cab), kilometres, completeness, and mechanical condition. Rough ranges: a 1998 Workmate 4x2 petrol, tired but running, typically fetches $800–$1,800. A 2005–2011 N70 SR5 4x4 diesel, running with average km, commonly lands $3,500–$7,500. A 2015+ GUN N80 dual cab, running, may pull $6,000–$9,999+ where condition and demand support it. Non-runners and scrap HiLuxes — even heavily damaged or incomplete — are valued on parts and scrap demand. Call us with the rego, kilometres, and a brief condition description and we'll quote on the phone."
      },
      {
        heading: "Free Same- or Next-Day HiLux Pickup Across Greater Brisbane",
        content: "Whether your HiLux is at a Logan workshop, an Ipswich property, a Redcliffe carport, or a Chermside driveway, we arrange suitable towing equipment and include pickup when we buy. We provide a receipt and buyer details, and most booked pickups happen the same or next business day subject to availability."
      }
    ],
    faqs: [
      { question: "Do you buy HiLuxes without rego?", answer: "Yes. We assess unregistered and long-deregistered HiLuxes across Brisbane. Bring photo ID and any ownership or registration records available, and keep a signed receipt with the VIN and both parties' details." },
      { question: "My HiLux has chassis rust — will you still buy it?", answer: "Yes. Chassis rust is a known issue on 2005–2015 N70 HiLuxes in coastal Queensland and we buy them all the time. We value the car on its drivetrain, interior, and parts potential — not the chassis rails." },
      { question: "Do you buy repairable write-off HiLuxes?", answer: "Yes. If your HiLux is a WOVR repairable write-off, we buy them regularly. Mention the write-off status when you request your quote so we can factor it in from the start." },
      { question: "Will you pay more for a diesel HiLux than a petrol?", answer: "Usually, yes. Diesel HiLuxes — especially the 1KZ, 1KD, and 1GD turbodiesels — generally fetch higher prices because the drivetrain parts demand is stronger. But a clean, low-km 2.7L petrol can still pull a strong number." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "used-cars-brisbane", "car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "redcliffe", "caboolture", "north-brisbane"]
  },
  {
    slug: "sell-toyota-corolla-brisbane",
    title: "Sell My Toyota Corolla Brisbane | Cash, Any Year",
    metaDescription: `Sell your Toyota Corolla for cash in Brisbane. Every generation — AE92, AE101, ZZE122, ZRE152, ZRE182, E210. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Toyota Corolla Brisbane — Every Generation",
    intro: "The Toyota Corolla is one of the most common cars on Brisbane roads, and Caraway pays fair cash for Corollas of every generation, kilometres, and condition. Whether you're offloading a much-loved first car, clearing a deceased estate hatch, or getting rid of an accident-written-off sedan, we'll come to you with a firm cash offer and free same- or next-day pickup.",
    sections: [
      {
        heading: "Every Corolla Generation, Every Body Style",
        content: "We buy every Corolla generation sold in Australia. That includes the KE70 rear-drivers, the AE82 front-wheel-drive transition cars, the AE92/AE95 Seca and Conquest generation, the AE101/AE102/AE112 mid-90s workhorses (including the Liftback and Ascent), the ZZE122 9th-gen 2001–2006 cars, the ZRE152 2007–2012 hatches and sedans, the ZRE182 2012–2018 models, and the current E210 range. Hatches, sedans, wagons (the Seca/Wagon), and the hybrids — they all qualify. Manual or automatic, Ascent, Conquest, SX, ZR — any trim."
      },
      {
        heading: "Why Brisbane Is Full of Corollas Worth Selling",
        content: "Corollas are famously long-lasting, which is exactly why so many of them end up at the back of Brisbane driveways, under carports, and in garages long past the point where the owner actively uses them. That reliability also means the used-parts market stays strong — late-model Corollas are in constant demand for panels, drivetrains, and interior trims across Queensland, so even non-running examples carry real value. We routinely pay solid cash for Corollas that their owners assumed were worth nothing."
      },
      {
        heading: "We Buy Corollas in Any Condition",
        content: "Running or not, registered or expired, tidy or panel-damaged, we assess Corollas with flat batteries, engine or transmission faults, flood damage, hail damage, and WOVR classifications. You can request a quote without first obtaining a mechanical repair report."
      },
      {
        heading: "Corolla Cash Price Ranges in Brisbane",
        content: "Offers depend on year, engine, kilometres, completeness, and condition. A 1998 AE101 Corolla, tired but running, typically fetches $500–$1,200. A 2005–2010 ZZE122 Ascent or Conquest, running with average km, commonly lands $1,500–$3,800. A 2012+ ZRE182, running, usually pulls $3,000–$6,500. Current E210 hybrid and ZR models, running and tidy, may reach $7,000–$9,999 where condition and demand support it. Non-runners and scrap Corollas generally land $300–$800 based on parts and scrap value."
      },
      {
        heading: "Greater Brisbane Corolla Pickup, Free and Fast",
        content: "We collect Corollas across Greater Brisbane, including apartments, tight carports, and outer-suburban properties. Towing is included when we buy, payment is confirmed before the vehicle leaves, and we provide the receipt and buyer details needed for the applicable paperwork. Most booked pickups happen the same or next business day."
      }
    ],
    faqs: [
      { question: "My Corolla has been sitting for years and won't start — is it worth selling?", answer: "Almost always, yes. Corollas have strong parts demand in Queensland, so even a long-dormant, non-running car usually pulls $300+ before we factor in the drivetrain and interior condition. Call us with the year and we'll quote." },
      { question: "Do you buy Corolla hybrids?", answer: "Yes. We buy the Corolla Hybrid and we're familiar with the hybrid-specific transfer and battery handling. We account for battery condition in the offer but you'll find our hybrid quotes competitive." },
      { question: "Do I need the original service books or spare keys?", answer: "No — they help but they aren't required. All we need on pickup day is photo ID. If you have the rego papers and a spare key, bring them; if not, we'll still complete the sale." },
      { question: "Do you buy Corollas with failed safety certificates?", answer: "Yes. We don't require a roadworthy certificate. Failed safety checks don't reduce our offer — we're buying the whole car, not a car that needs to be re-registered." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "old-cars-brisbane", "used-cars-brisbane"],
    relatedSuburbs: ["chermside", "sunnybank", "indooroopilly", "springwood", "north-brisbane"]
  },
  {
    slug: "sell-holden-commodore-brisbane",
    title: "Sell My Holden Commodore Brisbane | Cash for VT–VF",
    metaDescription: `Sell your Holden Commodore for cash in Brisbane. VT to VF sedans, wagons, utes, SS, SV6, Calais. Any condition. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Holden Commodore Brisbane — Every Model",
    intro: "Holden Commodores are everywhere in Brisbane, and Caraway pays fair cash for them regardless of generation, condition, or kilometres. Whether it's a VT sedan that's been parked for years, a VE SS with accident damage, a VF ute that's worn out its clutch, or a Calais wagon on the way to scrap — we'll make a firm offer and pick it up for free same or next day.",
    sections: [
      {
        heading: "Every Commodore Generation We Buy",
        content: "We buy every Commodore sold in Australia from the VN forward. That includes the VN/VP/VR/VS cars from 1988–1997, the VT/VX/VY/VZ range from 1997–2006, the VE from 2006–2013, and the final VF range from 2013–2017. Sedans, wagons, utes (including the VE/VF Maloo), and Sportwagon variants all qualify. Executive, Acclaim, Berlina, Calais, SV6, SS, and SS-V trims — every spec, every engine (from the Ecotec V6 and Alloytec LY7 to the L76/L77 V8 and LS3 Redline), and every transmission."
      },
      {
        heading: "Why Queensland Is a Commodore Market",
        content: "Brisbane and South-East Queensland have one of the highest Commodore densities in the country, which means the used-parts market here is strong for every generation. Even a scrap-bound VT will deliver meaningful parts value because panels, interior trims, and driveline components stay in high demand. VE and VF Commodores often hold surprising money even with high km or blown engines because Supercars-era enthusiast demand and modification parts keep values up. That's why our Commodore offers are typically competitive against any Brisbane cash-for-cars service."
      },
      {
        heading: "We Buy Commodores in Any Condition",
        content: "Running or not, rego'd or not, panel-straight or wrecked. Common Commodore issues we see every week include blown VT/VX cooling systems, Alloytec timing chain failures, VE L77 valve lifter issues, VF slipping autos, hail-damaged SV6s and SS sedans, flood-affected cars from the 2011 and 2022 floods, rolled utes, and deceased-estate VTs that have been sitting for a decade. None of that reduces our willingness to buy — we value the car on parts potential and drivetrain condition, not cosmetics."
      },
      {
        heading: "Commodore Cash Prices in Brisbane",
        content: "Offers depend heavily on generation, trim, completeness, and condition. A tidy 1998 VT Executive with average km typically fetches $600–$1,500. A 2002–2006 VY/VZ sedan, running, usually lands $800–$2,200. A 2006–2013 VE SV6 or Calais, running with average km, commonly pulls $2,500–$5,500. VE and VF SS and SS-V V8s in decent condition may reach $6,500–$9,999+ where condition and demand support it. Non-runners and scrap-bound Commodores generally land $400–$1,200 based on parts and scrap value. Performance variants — HSV Clubsport, Maloo, GTS — are quoted case-by-case and may exceed our standard ceiling."
      },
      {
        heading: "Free Brisbane-Wide Commodore Pickup",
        content: "We collect Commodores across Greater Brisbane, including Logan, Ipswich, the northside, southside, east, west, and outer regions. Towing is included when we buy, payment is confirmed before the vehicle leaves, and we provide a signed receipt. Most booked pickups happen the same or next business day."
      }
    ],
    faqs: [
      { question: "Do you buy Commodores with blown engines?", answer: "Yes. Blown head gaskets, timing chain failures, and full engine seizes are common Commodore issues and we buy them every week. We value the car on drivetrain parts, body panels, and interior — not on running condition." },
      { question: "Do you buy HSV Commodores separately?", answer: "Yes. HSV variants (Clubsport, Maloo, GTS, Senator) are valued case-by-case and usually command higher offers than standard Commodores. Mention the HSV badge and VIN when you request your quote." },
      { question: "My VE ute has been written off — still worth selling?", answer: "Yes. Repairable write-offs (WOVR) on VE and VF utes remain in strong demand, both for resale after repair and for parts. We buy them direct from owners after insurance claims close." },
      { question: "Do you buy Commodores that have been sitting for years?", answer: "Yes, and this is a common pickup for us. Long-dormant Commodores with dead batteries, flat tyres, and seized brakes are welcome — we bring winches and the right gear to load them regardless." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "old-cars-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "springwood", "caboolture", "south-brisbane"]
  },
  {
    slug: "sell-ford-falcon-brisbane",
    title: "Sell My Ford Falcon Brisbane | Cash for BA, BF, FG",
    metaDescription: `Sell your Ford Falcon for cash in Brisbane. AU, BA, BF, FG sedans, utes, XR6, XR8, G6E, Territory. Any condition. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Ford Falcon Brisbane — All Models & Conditions",
    intro: "Ford Falcons were a staple of Queensland roads for decades, and many are still parked on Brisbane properties waiting to be moved on. Caraway assesses every Falcon generation, including XR6 and XR8 performance variants, utes, wagons, and the related Territory SUV. Pickup is included when we buy, and cars are assessed as-is.",
    sections: [
      {
        heading: "Falcon Generations We Buy",
        content: "We buy every mainstream Falcon from the EA onward. That covers the EA/EB/ED/EF/EL (1988–1998) generations, the AU (1998–2002), the BA (2002–2005), the BF (2005–2008), and the final FG and FG X (2008–2016). Every body style qualifies — sedans, wagons, utes, and the Territory SX/SY/SY2/SZ SUV. Every trim — Forte, Futura, Futura II, Fairmont, Fairmont Ghia, XR6, XR6 Turbo, XR8, G6, G6E, G6E Turbo — attracts a fair offer."
      },
      {
        heading: "Why Falcons Still Sell for Real Money in Brisbane",
        content: "Falcons are slowly leaving Queensland roads, which is actually pushing parts values up. BA and BF XR6 Turbos have become genuine enthusiast cars, FG XR8s command strong money, and even base-spec sedans hold meaningful parts value because late-model Falcon driveline and interior components are becoming scarce. Brisbane's Falcon enthusiast community is active, and our wholesale and parts buyers keep demand steady — which means even tired or non-running Falcons typically pull decent cash rather than pure scrap money."
      },
      {
        heading: "We Buy Falcons in Every Condition",
        content: "Running or not, registered or not, straight or accident-damaged, we assess Falcons with transmission faults, cooling issues, rust, flood damage, or long-term storage wear. You can request a quote without first obtaining a mechanic's repair estimate."
      },
      {
        heading: "Falcon Cash Price Ranges in Brisbane",
        content: "Offers depend on generation, trim, completeness, and condition. An EF/EL Falcon, running, typically fetches $600–$1,500. An AU Falcon, running, commonly lands $500–$1,400. A BA/BF Falcon XT or Futura, running with average km, usually pulls $1,200–$3,200. An FG Falcon, running, commonly reaches $1,800–$4,500 for base models. Performance variants change the picture — tidy BA/BF/FG XR6 Turbos and XR8s may reach $4,500–$9,999 where condition and demand support it, and particularly strong examples (low km, unmodified, genuine) can exceed that. Territory SUVs span $1,000–$6,500 depending on trim and condition."
      },
      {
        heading: "Brisbane-Wide Falcon Pickup",
        content: "We collect Falcons across Greater Brisbane, including Ipswich, Logan, Caboolture, and the outer north. Towing is included when we buy, payment is confirmed at pickup, and we provide a signed receipt and buyer details. There are no distance surcharges within our confirmed service area."
      }
    ],
    faqs: [
      { question: "Do you pay extra for XR6 Turbo or XR8 Falcons?", answer: "Yes, almost always. Performance variants with their original driveline and sound mechanical condition consistently attract our top-tier offers — mention the XR badge and VIN when requesting your quote." },
      { question: "My Falcon's auto is blown — still worth selling?", answer: "Yes. BA/BF ZF and 4-speed auto failures are one of the most common reasons Falcons end up in our purchase schedule. We value the rest of the car and the drivetrain parts even when the transmission is finished." },
      { question: "Do you buy Territories?", answer: "Yes. All Territory generations — SX, SY, SY2, SZ — in any condition. We're familiar with the common Territory issues (autos, 4WD systems, diesel fuel pump failures) and quote accordingly." },
      { question: "Do you buy Falcon utes without a tray?", answer: "Yes. Utes without trays, damaged trays, or aftermarket canopies are all fine. The tray doesn't materially affect our offer — we're buying the cab and drivetrain." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "old-cars-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["ipswich", "logan", "caboolture", "north-brisbane", "redcliffe"]
  },
  {
    slug: "sell-ford-ranger-brisbane",
    title: "Sell My Ford Ranger Brisbane | Cash for PJ, PK, PX",
    metaDescription: `Sell your Ford Ranger for cash in Brisbane. PJ, PK, PX, MkII, MkIII, Next-Gen. XL, XLT, Wildtrak, Raptor. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Ford Ranger Brisbane — All Generations",
    intro: "The Ford Ranger has been one of Australia's top-selling vehicles for years, and Caraway pays strong cash for Rangers across every generation and trim. Whether you're offloading a tired PJ fleet ute, a rolled PX Wildtrak, or a Next-Gen Raptor being moved on, we'll quote on the phone and pick up free across Greater Brisbane.",
    sections: [
      {
        heading: "Ranger Generations We Buy",
        content: "We buy every Ranger Australia has seen. The PJ (2006–2009) and PK (2009–2011) Mazda-BT50-twin era, the PX (2011–2015), PX MkII (2015–2018), and PX MkIII (2018–2022) range, plus the current Next-Gen T6.2 Ranger launched in 2022. XL, XLS, XLT, FX4, Sport, Wildtrak, Raptor and Raptor X variants all qualify. 2.2L TDCi, 3.2L 5-cylinder, 2.0L bi-turbo, 3.0L V6 turbodiesel, and the Raptor's 2.0L/3.0L engines are all within our purchase scope."
      },
      {
        heading: "Ranger Demand in Queensland",
        content: "Queensland is one of the strongest Ranger markets in Australia — tradies, farmers, tourism operators, and weekend 4WDers all buy them in volume. That keeps the wholesale and parts market strong, which in turn supports our cash offers even for Rangers with high kilometres, mechanical issues, or accident damage. Ranger drivelines share components with the Mazda BT-50 and (pre-Next-Gen) with Everest SUVs, so the parts market for older Rangers remains deep."
      },
      {
        heading: "Any Condition: Running, Non-Running, Damaged",
        content: "We buy Rangers with blown engines (PX 3.2L oil pump and EGR failures, 2.0L bi-turbo carbon build-up), transmission failures, rolled cabs, hail damage, flood damage from the 2022 SEQ floods, accident write-offs, and high-km fleet Rangers worn out from mining or agricultural work. Repairable write-offs (WOVR) on Rangers remain in strong demand and we buy them regularly direct from owners after insurance settlement."
      },
      {
        heading: "Ranger Cash Price Ranges",
        content: "Offers depend on generation, sub-model, completeness, and condition. A PJ/PK Ranger, running with average km, typically fetches $2,000–$5,000. A PX Ranger (2011–2015), running, commonly lands $4,000–$8,000. A PX MkII or MkIII (2015–2022) running and tidy may pull $6,500–$9,999+ where condition and demand support it, with Wildtraks and Raptors often near or above our ceiling. Non-runners and heavily damaged Rangers are valued on parts and scrap demand. Next-Gen Rangers and Raptors are quoted individually and may exceed our standard top tier."
      },
      {
        heading: "Free Same- or Next-Day Ranger Pickup",
        content: "Wherever your Ranger is — a Logan driveway, an Ipswich property, or a Brisbane CBD car park — we confirm access and bring suitable loading equipment. Towing is included within the confirmed service area, payment is confirmed before the vehicle leaves, and we provide a signed receipt and buyer details."
      }
    ],
    faqs: [
      { question: "Do you buy Ranger Raptors?", answer: "Yes. Both first-gen (PX MkII/MkIII) and Next-Gen Raptors. They're typically at the top of our offer range and we quote them case-by-case with the VIN and mechanical condition in hand." },
      { question: "My Ranger has a known oil-pump issue — will you still buy it?", answer: "Yes. PX 3.2L oil pump failures are a known issue and we buy affected Rangers every week. We value the rest of the vehicle, including the body, interior, and recoverable drivetrain parts, and price accordingly." },
      { question: "Do you buy Ranger-based conversions and canopies?", answer: "Yes. Aftermarket canopies, service bodies, tray conversions, and mining-spec Rangers are all fine. Good aftermarket fit-outs can add to the offer; damaged ones don't reduce it." },
      { question: "Do you buy Rangers with finance still owing?", answer: "Sometimes, depending on the payout figure. Call us with the payout amount from your lender and we'll talk through whether we can structure the purchase — it happens regularly." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "used-cars-brisbane", "car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "caboolture", "north-brisbane", "redcliffe"]
  },
  {
    slug: "sell-toyota-landcruiser-brisbane",
    title: "Sell My Toyota LandCruiser Brisbane | All Series, Cash",
    metaDescription: `Sell your Toyota LandCruiser for cash in Brisbane. 70–300 Series — Troop Carrier, Sahara, GXL, VX, Workmate. Same- or next-day pickup. Call ${BUSINESS.phoneDisplay}.`,
    h1: "Cash for Toyota LandCruiser Brisbane — 70, 80, 100, 200, 300 Series",
    intro: "Toyota LandCruisers hold their value better than almost anything else on Australian roads, and Caraway pays strong cash for every generation — 70, 80, 100, 200, and 300 Series — regardless of kilometres or condition. Whether it's a tired Troopy, an 80 Series with a blown head gasket, a 100 Series V8 that's been touring the country for 500,000 km, or a 200 Series with accident damage, we'll quote and pick up free across Greater Brisbane.",
    sections: [
      {
        heading: "LandCruiser Generations We Buy",
        content: "Every LandCruiser sold in Australia. 40 Series (1960–1984) early classics when they come up. 60 Series (1980–1990) wagons. 70 Series (1984–present) — HJ75, HZJ75, HZJ79, HDJ78, VDJ76, VDJ78, VDJ79 Workmate/GX/GXL/Sahara — in every body style (Troop Carrier, dual cab, single cab, wagon). 80 Series (1990–1998) — 1HZ, 1HD-T, 1HD-FT, 1FZ-FE. 100 Series (1998–2007) — 1HD-FTE diesel, 2UZ-FE V8 petrol. 200 Series (2007–2021) — 1VD-FTV V8 diesel, 2UZ V8 petrol, GX/GXL/VX/Sahara. And the current 300 Series with the 3.3L V6 twin-turbo diesel."
      },
      {
        heading: "Why LandCruisers Keep Their Value",
        content: "LandCruisers are the backbone of Australia's remote touring, farming, mining, and tourism sectors, and Queensland has one of the biggest LandCruiser populations in the country. The wholesale market for every generation stays strong — a clean 80 Series 1HD-FT is a collector's item, a tidy 100 Series V8 diesel is a long-distance tourer's dream, 70 Series Troopies are in permanent demand for outback work, 200 Series VXs and Saharas command premium prices, and 300 Series wait lists remain long at Toyota dealers. All of that means our LandCruiser cash offers are consistently the highest end of what we pay for any class of vehicle."
      },
      {
        heading: "We Buy LandCruisers in Any Condition",
        content: "Running or not, rego'd or not, straight or rolled. Common LandCruiser issues we buy weekly: 80 Series 1HZ/1HD-T injector pump failures, 100 Series 1HD-FTE head gasket issues, 200 Series EGR coke-up on the 1VD-FTV, rolled 70 Series Troopies from Cape York trips, 100 Series with cracked cylinder heads, and 200/300 Series accident write-offs. Ex-mining LandCruisers with 700,000+ km, flood-damaged examples, repairable write-offs (WOVR) — all welcome. Mining-spec safety cages, bullbars, and touring fit-outs can add to offers."
      },
      {
        heading: "LandCruiser Cash Price Ranges in Brisbane",
        content: "Offers span a wide range because the model catalogue does. A running 80 Series wagon with high km typically fetches $3,500–$8,500 depending on variant and condition; clean 1HD-FT examples may reach $9,999+ where condition and demand support it. A running 100 Series V8 diesel commonly lands $4,500–$9,999, with tidy GXL/Sahara examples sometimes exceeding our standard ceiling. 70 Series Troop Carriers and dual cabs range from $3,000 to well beyond $9,999 for newer, low-km examples. 200 and 300 Series are quoted case-by-case and can command higher prices than our standard tier. Non-runners and mechanical failures are valued on parts and scrap demand."
      },
      {
        heading: "Brisbane-Wide LandCruiser Pickup",
        content: "We collect LandCruisers across Greater Brisbane, from inner-city car parks to rural properties around Ipswich. We confirm access and arrange flatbeds, winches, or extended ramps suited to heavy 4WDs. Towing is included when we buy, payment is confirmed at pickup, and we provide a signed receipt."
      }
    ],
    faqs: [
      { question: "Do you buy 70 Series Troop Carriers with touring fit-outs?", answer: "Yes. We're happy to account for quality aftermarket touring gear — drawer systems, long-range tanks, roof racks, suspension upgrades, winches — in the offer. Mention the fit-out when you call and we'll factor it in." },
      { question: "My 80 Series has a blown head gasket — is it worth selling?", answer: "Yes, and they're worth significantly more than you might expect. 80 Series 1HD-T and 1HZ drivetrains carry strong parts value, and we buy head-gasket failures every week. Call with year, engine code, and km." },
      { question: "Do you pay competitive prices on 200 Series VX and Sahara?", answer: "Yes. 200 Series VX and Sahara variants are usually at the top end of our offer range and often exceed our standard ceiling, especially for low-km or well-maintained examples. We quote them individually with the VIN." },
      { question: "Do you buy ex-mining LandCruisers with 500,000+ km?", answer: "Yes. Ex-mining 70 Series and 200 Series with high kilometres are a regular part of our pickup schedule. We value the drivetrain, chassis, and parts potential — high km doesn't disqualify the vehicle." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "used-cars-brisbane", "car-removal-brisbane"],
    relatedSuburbs: ["ipswich", "logan", "caboolture", "north-brisbane", "redcliffe"]
  }
];

export const getServiceBySlug = cache(
  (slug: string): ServicePage | undefined => services.find((s) => s.slug === slug),
);
