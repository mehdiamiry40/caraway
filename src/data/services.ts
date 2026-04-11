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
    title: "Cash for Cars Brisbane | Up to $9,999 Same-Day Pickup",
    metaDescription: "Cash for cars Brisbane: Caraway pays up to $9,999 for any car, any condition. Free towing, cash on pickup, Greater Brisbane. Call 1800 227 293.",
    h1: "Cash for Cars Brisbane — Get Paid Today",
    intro: "Looking to sell your car fast in Brisbane? Caraway is Brisbane's leading cash for cars buyer, paying up to $9,999 for vehicles in any condition. Whether your car is old, damaged, scrap, or running perfectly — we'll make you a fair cash offer and pick it up the same day, free of charge.",
    sections: [
      {
        heading: "How Our Cash for Cars Service Works",
        content: "Selling your car for cash in Brisbane couldn't be simpler. Use our online price estimator or fill out our quote form with your car's details — make, model, year, and condition. We'll give you a no-obligation cash offer within minutes. If you accept, we'll arrange free pickup at a time that suits you — often the same day. Our driver arrives, pays you in cash on the spot, and tows your vehicle away at no cost. The entire process takes less than an hour from start to finish."
      },
      {
        heading: "Why Brisbane Locals Choose Caraway",
        content: "We focus on making the sale straightforward: no Roadworthy Certificate required, no classified ads, and no strangers test-driving your car. We handle transfer paperwork, pay you before the vehicle leaves your property, and include towing when we buy. We're a Brisbane-based buyer — not a national lead broker."
      },
      {
        heading: "What Cars We Buy for Cash in Brisbane",
        content: "We buy all types of vehicles across Brisbane — sedans, utes, 4WDs, SUVs, vans, trucks, and fleet vehicles. It doesn't matter if your car is running or not, registered or unregistered, crashed or flood-damaged. Old Commodores, Falcons, Camrys, Corollas, Hiluxes — we buy them all. We also purchase prestige and European vehicles, commercial vehicles, and motorcycles."
      },
      {
        heading: "Same-Day Car Removal Across Brisbane",
        content: "When you accept our offer, we can usually arrange same-day pickup anywhere in Greater Brisbane. Our fleet covers all suburbs from Caboolture in the north to Beenleigh in the south, and from Ipswich in the west to Cleveland in the east. Weekend and after-hours pickups are available by arrangement. We work around your schedule, not the other way around."
      },
      {
        heading: "How Much Cash Will I Get for My Car?",
        content: "The amount we pay depends on your vehicle's make, model, year, condition, and the current market for parts and scrap metal. Many sellers receive between $150 for older scrap cars and up to $9,999 for late-model vehicles in decent condition. If you have another written quote, mention it — we'll see what we can do."
      }
    ],
    faqs: [
      { question: "How quickly can I get cash for my car in Brisbane?", answer: "Most sellers receive same-day payment. Once you accept our offer, we can often arrange pickup within a few hours. You're paid in cash before the car leaves your property." },
      { question: "Do you buy cars without registration?", answer: "Yes, we buy unregistered, deregistered, and expired-registration vehicles across Brisbane. No current registration is required." },
      { question: "Is your car removal really free?", answer: "Absolutely. There are no towing fees, no hidden costs, and no deductions from your quoted price. The cash amount we quote is the amount you receive." },
      { question: "What areas of Brisbane do you cover?", answer: "We cover all of Greater Brisbane including North Brisbane, South Brisbane, East Brisbane, West Brisbane, Logan, Ipswich, Redland Bay, and Moreton Bay regions." }
    ],
    relatedServices: ["car-removal-brisbane", "sell-my-car-brisbane", "scrap-car-removal-brisbane", "unwanted-cars-brisbane"],
    relatedSuburbs: ["north-brisbane", "south-brisbane", "logan", "ipswich", "redcliffe", "bayside-brisbane"]
  },
  {
    slug: "car-removal-brisbane",
    title: "Free Car Removal Brisbane | Same-Day Pickup",
    metaDescription: "Free car removal across Brisbane. Same-day pickup, no towing fees, instant cash payment. We remove old, scrap, and unwanted cars. Call 1800 227 293.",
    h1: "Free Car Removal Brisbane — Same-Day Service",
    intro: "Need a car removed from your property in Brisbane? Caraway offers free car removal across Greater Brisbane with same-day pickup available 7 days a week. We don't just remove your car — we pay you cash for it. No towing fees, no hidden charges, no hassle.",
    sections: [
      {
        heading: "How Our Brisbane Car Removal Works",
        content: "Our car removal process is straightforward. Contact us with your vehicle details — we'll provide a free, no-obligation quote. Once you accept, our licensed driver will come to your location at a time that works for you. We bring our own tow truck and equipment, so your car doesn't need to be running or roadworthy. You get paid in cash before we load the vehicle. We handle all transfer paperwork on the spot."
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
        content: "Unlike many car removal services that charge towing fees or offer below-market prices, Caraway provides genuinely free removal with competitive cash offers. We're fully licensed and insured, our drivers are professional and punctual, and we've been serving Brisbane for over a decade. We also dispose of vehicles responsibly, complying with all Queensland environmental regulations."
      }
    ],
    faqs: [
      { question: "Is car removal really free in Brisbane?", answer: "Yes — 100% free. We never charge for towing or pickup. The price we quote is the full amount you receive in cash, with nothing deducted." },
      { question: "How fast can you remove my car?", answer: "We offer same-day car removal across most Brisbane suburbs. Contact us before midday and we can usually arrange afternoon pickup." },
      { question: "Do you remove cars that don't run?", answer: "Yes. Our tow trucks can load non-running, broken-down, and immobile vehicles. Your car doesn't need to start or drive." },
      { question: "Can you remove a car from a tight space?", answer: "Yes. Our experienced drivers can retrieve vehicles from garages, backyards, driveways, underground car parks, and other tight locations." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "scrap-car-removal-brisbane", "unwanted-cars-brisbane", "junk-cars-brisbane"],
    relatedSuburbs: ["chermside", "carindale", "sunnybank", "mount-gravatt", "toowong", "north-lakes"]
  },
  {
    slug: "sell-my-car-brisbane",
    title: "Sell My Car Brisbane | Instant Cash, No Hassle",
    metaDescription: "Sell your car in Brisbane fast. Get an instant cash offer, free pickup, same-day payment. No advertising, no tyre-kickers. Call Caraway on 1800 227 293.",
    h1: "Sell My Car Brisbane — Instant Offer, No Hassle",
    intro: "Want to sell your car quickly in Brisbane without the hassle of private sales? Caraway makes selling your car effortless. Get an instant cash offer, skip the advertising and test drives, and get paid the same day. We buy all makes and models in any condition.",
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
        content: "To sell your car to Caraway, all you need is photo ID to prove ownership. If you have the registration papers, that speeds things up — but they're not essential. We handle the vehicle transfer documentation, saving you a trip to Queensland Transport. It couldn't be easier."
      }
    ],
    faqs: [
      { question: "How do I sell my car to Caraway in Brisbane?", answer: "Use our online price estimator or submit our quote form. Provide your car's details and we'll give you an instant offer. Accept, and we'll pick up your car and pay you cash — often the same day." },
      { question: "Do I need a roadworthy to sell my car?", answer: "No. We buy cars as-is, without a Roadworthy Certificate. Your car can be in any condition — running, broken, damaged, or scrap." },
      { question: "How much can I get for my car?", answer: "Offers range from $150 for end-of-life scrap vehicles up to $9,999 for newer models in good condition. Contact us for a free, no-obligation quote specific to your vehicle." },
      { question: "Can I sell a car I still owe finance on?", answer: "In some cases, yes. Contact us to discuss your situation. We can sometimes arrange payout of the remaining finance as part of the sale." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "car-removal-brisbane", "used-cars-brisbane", "old-cars-brisbane"],
    relatedSuburbs: ["indooroopilly", "moorooka", "springwood", "browns-plains", "caboolture"]
  },
  {
    slug: "scrap-car-removal-brisbane",
    title: "Scrap Car Removal Brisbane | Cash for Scrap Cars",
    metaDescription: "Scrap car removal Brisbane. We pay cash for scrap cars and remove them free. End-of-life vehicles, wrecks, and junk cars. Same-day service. Call 1800 227 293.",
    h1: "Scrap Car Removal Brisbane — Cash for Your Scrap Car",
    intro: "Got a scrap car taking up space on your property? Caraway pays cash for scrap cars across Brisbane and removes them free of charge. Whether your vehicle is completely wrecked, mechanically beyond repair, or simply reached end-of-life — we'll pay you and take it away today.",
    sections: [
      {
        heading: "What Counts as a Scrap Car?",
        content: "A scrap car is any vehicle that's no longer economically viable to repair or register. This includes cars with blown engines, seized transmissions, major structural damage, extensive rust, fire damage, or vehicles that have simply reached the end of their useful life. If the cost of repairs exceeds the car's value, it's a scrap car — and we'll pay you cash for it."
      },
      {
        heading: "How We Value Scrap Cars in Brisbane",
        content: "Even scrap cars have value. We assess scrap vehicles based on their weight (steel and aluminium content), salvageable parts, and current scrap metal market prices. A standard sedan typically yields $150–$500 in scrap value, while larger vehicles like 4WDs, vans, and trucks can fetch significantly more. We always offer competitive prices based on real market conditions."
      },
      {
        heading: "Environmentally Responsible Scrap Car Disposal",
        content: "We don't just dump scrap cars. Every vehicle we collect is processed at licensed recycling facilities in Queensland. We drain and safely dispose of all fluids — oil, coolant, brake fluid, and fuel. Batteries, tyres, and hazardous materials are handled according to EPA guidelines. Salvageable parts are refurbished for reuse, and remaining materials are recycled. We take environmental responsibility seriously."
      },
      {
        heading: "Same-Day Scrap Car Pickup Brisbane",
        content: "Don't let that old wreck sit in your yard another week. Call us before midday and we can usually remove your scrap car the same afternoon. Our tow trucks are equipped to handle non-running vehicles, cars without wheels, and vehicles in difficult locations. We come to you — garage, driveway, paddock, or workshop."
      }
    ],
    faqs: [
      { question: "How much is my scrap car worth in Brisbane?", answer: "Scrap car values depend on size, weight, and condition. Standard cars typically fetch $150–$500, while larger vehicles can be worth more. Contact us for a specific quote." },
      { question: "Can you remove a car with no engine?", answer: "Yes. We remove vehicles in any state — no engine, no wheels, no doors. If there's enough of the car to identify it, we'll take it." },
      { question: "Do I need paperwork for a scrap car?", answer: "Just photo ID. Registration papers help but aren't essential. We handle all the deregistration and transfer paperwork for you." },
      { question: "Is scrap car removal really free?", answer: "Yes. We never charge for towing or removal. You receive the full quoted cash amount with no deductions." }
    ],
    relatedServices: ["car-removal-brisbane", "junk-cars-brisbane", "old-cars-brisbane", "unwanted-cars-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "caboolture", "browns-plains", "beenleigh"]
  },
  {
    slug: "unwanted-cars-brisbane",
    title: "Unwanted Car Removal Brisbane | Cash Paid Today",
    metaDescription: "Got an unwanted car in Brisbane? We pay cash and remove it free. Any make, any condition. Same-day pickup available. Call Caraway on 1800 227 293.",
    h1: "Unwanted Car Removal Brisbane — Turn It Into Cash",
    intro: "That unwanted car sitting in your driveway, garage, or yard doesn't have to be a headache. Caraway turns unwanted vehicles into instant cash across Brisbane. We buy any unwanted car regardless of its age, condition, or registration status — and we remove it free.",
    sections: [
      {
        heading: "Why Do Cars Become Unwanted?",
        content: "Cars become unwanted for many reasons. Maybe you've upgraded and the old car is just taking up space. Perhaps it failed its safety inspection and isn't worth fixing. Maybe you've inherited a vehicle you don't need, or your car was damaged in an accident and you'd rather take the cash than repair it. Whatever the reason, Caraway is the fastest way to turn that unwanted car into money."
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
      { question: "What is an unwanted car worth in Brisbane?", answer: "Values range from $150 for end-of-life vehicles to several thousand dollars for newer unwanted cars in reasonable condition. Get a free quote using our online price estimator." },
      { question: "Can you remove an unwanted car today?", answer: "In most cases, yes. Contact us in the morning and we can usually arrange same-day removal across Brisbane suburbs." },
      { question: "Do I need to be home for the pickup?", answer: "Ideally yes, as we pay cash in person and need your ID. However, we can make alternative arrangements if you're unable to be present — just ask." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "car-removal-brisbane", "old-cars-brisbane", "junk-cars-brisbane"],
    relatedSuburbs: ["north-brisbane", "south-brisbane", "chermside", "carindale", "moorooka"]
  },
  {
    slug: "damaged-cars-brisbane",
    title: "Cash for Damaged Cars Brisbane | Any Damage Accepted",
    metaDescription: "Sell your damaged car for cash in Brisbane. We buy crash-damaged, hail-damaged, and mechanically damaged cars. Free removal. Call 1800 227 293.",
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
        content: "Brisbane's weather is hard on cars. Summer hailstorms come through the north and western suburbs almost every year — we've bought hundreds of hail-dimpled cars from Chermside, The Gap, Ferny Grove, and Kenmore after major storms, and plenty more from Ipswich and Springfield. Flood damage is an even bigger issue for low-lying suburbs around Rocklea, Milton, West End, Fairfield, Oxley, and parts of Logan and Ipswich. Once a car has been through floodwater up to the dash, insurance companies will usually write it off because the wiring harness, ECUs, airbag modules, and interior trim are effectively ruined — even if the engine still runs on the day. Repairing a flood-damaged car is almost never economic; the car will develop electrical gremlins and mould problems for years. Selling it to a buyer who understands flood cars is almost always the right move. Caraway buys flood-affected vehicles as-is, no questions asked, and handles the disposal properly so the car doesn't end up being quietly on-sold to an unsuspecting buyer. The same applies to storm-damaged cars with fallen branches through the roof, vehicles caught in bushfires, and cars that have been broken into and stripped."
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
    metaDescription: "Sell your accident car for cash in Brisbane. We buy crashed, written-off, and collision-damaged vehicles. Free towing, instant payment. Call 1800 227 293.",
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
        content: "When you've been in an accident, the last thing you want is a drawn-out selling process. Contact Caraway and you could have cash in your hands within hours. We provide instant quotes over the phone, arrange same-day pickup, and pay you before we take the vehicle. It's the fastest way to move on from an accident."
      },
      {
        heading: "Understanding Statutory vs Repairable Write-Offs in Queensland",
        content: "If you've been in a serious accident in Brisbane, your insurer may have classified the vehicle as either a statutory write-off or a repairable write-off. The distinction matters a lot for what happens next. A statutory write-off is a vehicle Queensland Transport has determined can never be re-registered for road use — typically because the structural damage, fire damage, or flood exposure is so severe that the vehicle cannot be safely repaired to roadworthy standard. Statutory write-offs are flagged permanently on the Written-Off Vehicle Register and can only be sold for parts or scrap. A repairable write-off, on the other hand, can theoretically be fixed and re-registered, provided it passes a written-off vehicle inspection and meets all the compliance requirements. Caraway buys both categories. For statutory write-offs we value the vehicle based on salvageable parts and scrap metal weight. For repairable write-offs we often pay significantly more, because the car still has value as a rebuild project or as a donor for other cars of the same model. If you're not sure which category your vehicle falls into, call us with the claim number or the VIN and we'll talk you through it. Either way, the paperwork on our end is straightforward and you don't need a panel beater's quote, a police report, or an engineer's report to sell to us."
      },
      {
        heading: "What Happens to Accident Cars After We Buy Them",
        content: "Once we pay you and load the car onto our truck, the vehicle goes to one of our licensed wrecking and dismantling partners across South-East Queensland. From there, the process depends on the vehicle. Late-model cars with good running drivetrains but crashed bodies are often stripped for mechanical parts — engines, transmissions, diffs, ECUs, airbags, and suspension components — which go back into the used parts market to keep other cars on the road. Body panels, doors, bonnets, and interior trim are catalogued and listed for sale to panel beaters and DIY repairers. Cars that are too far gone mechanically get depolluted: fluids drained, batteries removed, tyres pulled off, refrigerant recovered from the air-con system, and any hazardous materials handled according to Queensland EPA regulations. The remaining shell is crushed and recycled into new steel. The whole process is documented, traceable, and compliant with the Written-Off Vehicle Register rules. You don't need to worry about the car turning up on Marketplace a month later being sold as a 'great little runner' to an unsuspecting buyer — it's gone for good, properly disposed of, and the paperwork is lodged with TMR on your behalf. That environmental and administrative peace of mind is part of what you're paying for when you sell to a licensed buyer instead of a backyard operator."
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
    metaDescription: "Sell your old car for cash in Brisbane. We buy old, high-mileage, and end-of-life vehicles. Free removal, same-day cash. Call Caraway 1800 227 293.",
    h1: "Cash for Old Cars Brisbane — Your Old Car Is Worth Money",
    intro: "Think your old car is worthless? Think again. Caraway pays cash for old cars across Brisbane — even high-kilometre vehicles, cars from the 90s, and older models that dealers won't touch. Free removal, same-day payment, zero hassle.",
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
    metaDescription: "Junk car removal in Brisbane with instant cash payment. We buy and remove junk cars free. Any condition accepted. Call Caraway on 1800 227 293.",
    h1: "Junk Car Removal Brisbane — Cash for Your Junk Car",
    intro: "Got a junk car cluttering up your property? Caraway turns junk into cash across Brisbane. We buy and remove junk cars in any condition — rusted out, engine blown, body damaged, missing parts — and pay you on the spot. Free removal, no strings attached.",
    sections: [
      {
        heading: "What Makes a Car 'Junk'?",
        content: "A junk car is generally a vehicle that's no longer roadworthy, cost-effective to repair, or useful as daily transport. It might have severe rust, mechanical failure, missing components, accident damage, or simply be too old to pass a safety inspection. Whatever state your junk car is in, it still contains valuable materials and parts that make it worth money."
      },
      {
        heading: "Junk Car Prices in Brisbane",
        content: "Junk car values vary based on vehicle size, weight, condition, and salvageable components. Small sedans typically fetch $100–$400, while larger vehicles like 4WDs, vans, and trucks can be worth $300–$1,500+ depending on parts demand. We base our offers on current Brisbane market conditions, not arbitrary low-ball figures."
      },
      {
        heading: "Get Rid of Your Junk Car Today",
        content: "Why let a junk car sit around any longer? Every day it sits, it loses value to rust and deterioration. Call Caraway today and we'll arrange same-day removal in most Brisbane suburbs. You'll have cash in hand and your space back before dinner. It's quick, easy, and completely free."
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
    metaDescription: "Sell your unregistered car for cash in Brisbane. No rego, no RWC, no worries. Free pickup and instant payment. Call Caraway on 1800 227 293.",
    h1: "Sell Your Unregistered Car in Brisbane for Cash",
    intro: "No registration? No problem. Caraway buys unregistered vehicles across Brisbane for instant cash. Whether your rego has expired, been cancelled, or your car was never registered in Queensland — we'll buy it and remove it for free. No RWC required, no paperwork headaches.",
    sections: [
      {
        heading: "Why Sell an Unregistered Car?",
        content: "An unregistered car can't legally be driven on Queensland roads. Re-registering it means getting a safety inspection (which could require expensive repairs), paying registration fees, and dealing with Queensland Transport paperwork. For many vehicles — especially older or damaged ones — the cost of re-registration exceeds the car's value. Selling to Caraway is the smarter option."
      },
      {
        heading: "No Registration Hassles with Caraway",
        content: "We don't care about your car's registration status. Expired rego, cancelled rego, interstate plates, no plates at all — it doesn't affect our offer. We buy the vehicle based on its intrinsic value (parts, materials, condition), not its registration status. We also handle all deregistration and transfer paperwork for you."
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
    title: "Sell Used Cars Brisbane | Best Cash Price Today",
    metaDescription: "Sell your used car for the best price in Brisbane. Skip private sales — get an instant cash offer from Caraway. Free pickup, same-day payment. Call 1800 227 293.",
    h1: "Sell Your Used Car in Brisbane — Best Cash Price",
    intro: "Selling a used car in Brisbane doesn't have to mean weeks of advertising and awkward test drives. Caraway offers the fastest way to sell your used car — instant cash offers, free pickup, and same-day payment. We buy all used vehicles in any condition.",
    sections: [
      {
        heading: "The Smart Alternative to Private Sales",
        content: "Selling privately in Brisbane means listing on Gumtree or Facebook Marketplace, fielding dozens of messages, arranging inspections, dealing with no-shows, and negotiating with buyers who always want a discount. You might wait weeks or months for a sale, all while paying insurance and registration. With Caraway, you get a fair offer instantly and have cash in hand the same day."
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
      { question: "How much will I get for my used car?", answer: "Used car offers depend on make, model, year, condition, and kilometres. We typically pay between $500 and $9,999 for used cars. Contact us for a specific quote." },
      { question: "Is selling to Caraway better than a dealership trade-in?", answer: "Often, yes. Dealerships heavily discount trade-in values to protect their margins. We offer transparent, competitive cash prices without the pressure to buy another vehicle." },
      { question: "How long does the process take?", answer: "From quote to cash in hand, the entire process can be completed in under an hour. Most sellers have their used car sold and removed the same day they contact us." }
    ],
    relatedServices: ["cash-for-cars-brisbane", "sell-my-car-brisbane", "car-removal-brisbane", "old-cars-brisbane"],
    relatedSuburbs: ["indooroopilly", "carindale", "chermside", "toowong", "bayside-brisbane"]
  },
  {
    slug: "insurance-write-off-cars-brisbane",
    title: "Insurance Write-Off Cars Brisbane | Caraway",
    metaDescription: "Sold your car to the insurance company but kept the salvage rights? We buy statutory and repairable write-offs across Brisbane. Free pickup, cash on the spot.",
    h1: "Insurance Write-Off Cars Brisbane",
    intro: "If your insurer has declared your vehicle a total loss and left you with the wreck — or you've elected to retain salvage rights on an accident, flood, or fire claim — Caraway buys it directly for cash. We purchase both statutory and repairable write-offs across Greater Brisbane, handle all the paperwork with TMR, and come to you with free towing. Same-day pickup is available seven days a week.",
    sections: [
      {
        heading: "Statutory vs Repairable Write-Offs Explained",
        content: "When an insurer writes off a car in Queensland, the vehicle is flagged on the Written-Off Vehicle Register (WOVR) and classified into one of two categories. A statutory write-off is a vehicle TMR has determined can never be re-registered for road use — the damage is so severe that the car cannot be repaired to roadworthy standard. Typical causes include major structural collapse, full fire damage, or flood immersion above the dashboard. Statutory write-offs can only be sold for parts or scrap. A repairable write-off, on the other hand, has been deemed economically not worth repairing by the insurer, but can still be rebuilt, inspected, and re-registered if someone is prepared to do the work. Caraway buys both. Repairable write-offs often fetch significantly higher prices because the vehicle still has value as a rebuild project or as a mechanical donor for other cars of the same make and model. Statutory write-offs are valued on salvageable parts and scrap metal weight. If you're not sure which category applies to your vehicle, call us with the claim number or the VIN — we can usually tell you within a few minutes."
      },
      {
        heading: "How to Sell a Write-Off Car to Caraway",
        content: "The process is the same as any other cash-for-cars sale, with a few small extras to keep the WOVR paperwork clean. Step one: call or fill out our online quote form with the make, model, year, damage description, and — if you know it — the WOVR classification. We'll give you a firm cash offer on the phone, usually within a few minutes. Step two: accept the quote and book a pickup time that suits you. Step three: our driver arrives at your property with a flatbed tow truck, inspects the vehicle, pays you in cash (or bank transfer for amounts over $10,000), and loads the car. We lodge the disposal notice with TMR on your behalf within the 14-day statutory window, which removes the vehicle from your name and ends your liability for any future tolls, fines, or administrative notices attached to the plate. You do not need a panel beater's quote, a police report, or an engineer's assessment to sell to us — the insurer's write-off decision is enough."
      },
      {
        heading: "What Paperwork You Need",
        content: "The paperwork is minimal. Bring a current Queensland driver's licence or other government-issued photo ID. If you still have the registration certificate, that helps, but it's not essential — we can look the vehicle up by VIN if the papers are long gone. If the insurance claim has already been finalised and you've received a settlement letter or a notice from the insurer confirming you've retained salvage rights, hand that to the driver as well; it makes the WOVR paperwork faster to process. You do not need the written-off vehicle notice from TMR, and you do not need to have the car inspected before pickup. For vehicles with outstanding finance, let us know when you request the quote so we can discuss payout options — in many cases we can work directly with your lender to settle the loan as part of the sale. For deceased estate vehicles we'll ask for a copy of the death certificate and probate or letters of administration, but nothing more elaborate than that."
      }
    ],
    faqs: [
      { question: "Can I sell a car that's listed on the Written-Off Vehicle Register?", answer: "Yes. We buy both statutory and repairable write-offs listed on the WOVR. The WOVR flag doesn't prevent a sale to a licensed buyer — it just prevents the car from being re-registered in the case of a statutory write-off. Call us with the VIN and we'll give you a firm cash offer the same day." },
      { question: "Will your offer beat the insurance payout?", answer: "For newer vehicles on comprehensive cover, the insurance payout usually wins. For older cars (10+ years), or cars where the insurer has quoted a low market value, our offer is often competitive or better — plus you get the money in hours instead of waiting weeks for claim finalisation. We're happy to quote against your insurer's number without obligation." },
      { question: "Do I need to do anything before the pickup?", answer: "Just gather your photo ID, any paperwork from the insurer, and the vehicle's registration certificate if you still have it. Remove personal belongings and take the number plates off before the truck leaves — in Queensland, plates belong to the registered owner, not the car. Everything else we handle." }
    ],
    relatedServices: ["damaged-cars-brisbane", "accident-cars-brisbane", "cash-for-cars-brisbane", "scrap-car-removal-brisbane"],
    relatedSuburbs: ["logan", "ipswich", "north-brisbane", "south-brisbane", "caboolture"]
  },
  {
    slug: "hail-damaged-cars-brisbane",
    title: "Hail Damaged Cars Brisbane | Caraway",
    metaDescription: "Hail or storm damage turning your car into a write-off? We buy hail-damaged vehicles across Brisbane. Free pickup, honest quote, no repair quotes needed.",
    h1: "Hail Damaged Cars Brisbane",
    intro: "Brisbane storm season is brutal on cars, and every summer we buy hundreds of hail-dimpled vehicles across the western and northern suburbs. If your car has been through a hailstorm and you're staring at a panel beater's quote that's worth more than the car, Caraway will take it off your hands for cash. Free pickup, same-day service, no repair quotes or engineer's reports needed — we buy hail-damaged cars in any condition across Greater Brisbane.",
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
        content: "Offers on hail-damaged vehicles depend primarily on the car's mechanical condition, kilometres, make, and model — cosmetic hail dents barely move the needle. A 2015 Hyundai i30 with 150,000 kilometres and moderate hail damage that still runs well typically fetches between $2,500 and $5,500. A hail-damaged ute or 4WD from the last five years — HiLuxes, Rangers, Pajeros, Prados — can fetch $6,000 to $9,999+ depending on condition, because the underlying parts demand stays strong regardless of dented panels. Older vehicles (pre-2005) with heavy hail damage usually land between $400 and $1,500 based on salvage and scrap value. If your car is still mechanically sound and just looks like a golf ball, you'll be pleasantly surprised — we value it on the engine, drivetrain, and interior, not the roof. We also buy cars that were already write-offs before the hail hit, and storm-damaged vehicles with broken glass, water ingress, or fallen branches through the roof. No quotes required, no paperwork headaches, and free towing across Greater Brisbane."
      }
    ],
    faqs: [
      { question: "Do you buy hail-damaged cars even if they still drive?", answer: "Yes — in fact those are often our best-value pickups. A mechanically sound, hail-damaged car is worth significantly more than a non-runner because the drivetrain, electronics, and interior can all go back into the used parts market. Call us with the make, model, year, and kilometres and we'll quote on the spot." },
      { question: "Do I need a repair quote or insurance assessment to sell?", answer: "No. We don't need a panel beater's quote, an engineer's report, or an insurance assessment to make an offer. All we need is a description of the car — make, model, year, kilometres, and a rough idea of the damage — and we can quote within minutes. Bring photo ID on pickup day and we handle the rest." },
      { question: "What if my car is already a repairable write-off from the insurer?", answer: "No problem at all. We buy repairable write-offs every week, both from owners who've retained salvage rights after a claim and from sellers who'd rather cash the car out than try to drive it dimpled or list it privately. Mention the WOVR status when you request your quote and we'll factor it in." }
    ],
    relatedServices: ["damaged-cars-brisbane", "insurance-write-off-cars-brisbane", "cash-for-cars-brisbane", "accident-cars-brisbane"],
    relatedSuburbs: ["chermside", "indooroopilly", "north-brisbane", "ipswich", "toowong"]
  }
];

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return services.find(s => s.slug === slug);
}
