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
    title: "Cash for Cars Brisbane | Up to $9,999 — Same-Day Pickup",
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
      { question: "How do I sell my car to Caraway in Brisbane?", answer: "Call us on 1800 227 293 or submit our online form. Provide your car's details and we'll give you an instant offer. Accept, and we'll pick up your car and pay you cash — often the same day." },
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
      }
    ],
    faqs: [
      { question: "What is an unwanted car worth in Brisbane?", answer: "Values range from $150 for end-of-life vehicles to several thousand dollars for newer unwanted cars in reasonable condition. Get a free quote by calling 1800 227 293." },
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
  }
];

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return services.find(s => s.slug === slug);
}
