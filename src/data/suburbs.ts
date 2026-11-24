export interface SuburbPage {
  slug: string;
  updatedAt?: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  regionName: string;
  localContent: string;
  serviceDetails: string;
  whyUs: string;
  nearbyAreaNames: string[];
  pickupAccessNotes: string[];
  localSellingPoints: string[];
  localFaqs: Array<{
    question: string;
    answer: string;
  }>;
  internalLinks?: Array<{
    label: string;
    href: string;
  }>;
  finalCtaText: string;
  nearbySuburbs: string[];
  relatedServices: string[];
}

/**
 * Location pages are limited to areas with demonstrated Search Console demand.
 * Copy describes coverage and the information needed to plan a collection; it
 * must not imply completed local jobs, route frequency, fleet ownership, or
 * years of local trading unless Caraway can document those claims.
 */
export const suburbs: SuburbPage[] = [
  {
    slug: "toowong",
    updatedAt: "2026-10-18",
    title: "Car Removal Toowong | Cash for Cars & Pickup",
    metaDescription:
      "Car removal Toowong for unregistered, damaged, or non-running cars. Get a free quote. Towing is free when we buy your car.",
    h1: "Cash for Cars Toowong",
    intro:
      "Get a free quote from Caraway for your car in Toowong, Auchenflower, Taringa, St Lucia, Indooroopilly, or nearby inner-west suburbs. Towing is free when we buy your car. We confirm the pickup time and how you get paid before pickup.",
    regionName: "Toowong and Brisbane's inner west",
    localContent:
      "Inner-west pickups can involve apartment basements, shared driveways, steep streets, and limited loading space. These details affect how we pick up the car, so tell us the exact parking spot, clearance height, ramp access, and whether the car starts, steers, and rolls. If the car is on a busy road or in restricted parking, we will confirm whether there is a safe place to load it or whether it needs to be moved first.",
    serviceDetails:
      "We consider registered and unregistered cars in a range of conditions, including cars with mechanical faults, accident damage, flat tyres, missing keys, or expired registration. The quote depends on the year, make, model, condition, completeness, location, ownership details, and pickup access. Photos of the car and where it is parked help avoid surprises before pickup is booked. Enquiries from Toowong and Brisbane's inner west follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "You get the offer and pickup requirements before you accept. If we buy your car, we confirm the pickup time and agreed payment method, check that you have authority to sell it, and give you buyer details and a receipt for your records. Pickup depends on the car's details, safe access, and the pickup schedule.",
    nearbyAreaNames: [
      "Auchenflower",
      "Taringa",
      "St Lucia",
      "Indooroopilly",
      "Paddington",
    ],
    pickupAccessNotes: [
      "For basement or stack parking, tell us the clearance height, ramp angle, parking level, and whether the car can be moved to an accessible bay.",
      "For a steep driveway or narrow street, send photos showing the approach, turning space, and where the car is.",
      "For kerbside parking, confirm that the car is legally parked and that there is a suitable place to load it.",
    ],
    localSellingPoints: [
      "Free towing included",
      "Access checked before pickup is booked",
      "Offer and agreed payment method confirmed in advance",
      "Receipt and buyer details for your records",
    ],
    localFaqs: [
      {
        question: "Can Caraway pick up from a Toowong basement car park?",
        answer:
          "Sometimes. It depends on clearance height, ramp access, turning room, parking level, and whether the car rolls. Send those details before booking so we can confirm whether pickup is possible.",
      },
      {
        question: "Can I get a quote for an unregistered car in Toowong?",
        answer:
          "Yes. Tell us your proof-of-ownership details, the registration status, the car's condition, and exactly where it is parked. We will confirm any sale and pickup requirements before you accept.",
      },
      {
        question: "How soon can Caraway pick up a car in Toowong?",
        answer:
          "It depends on the car, safe access, when you are available, and the pickup schedule. We confirm the time before pickup.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us your car's details and a clear description of where it is in Toowong. We will confirm the offer, access requirements, and pickup time before you decide.",
    nearbySuburbs: ["kenmore"],
    relatedServices: ["car-removal-brisbane"],
  },
  {
    slug: "logan",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Logan | Free Towing Included",
    metaDescription:
      "Get a free quote for your car in Logan. We confirm the offer, access, pickup time, and how you get paid before pickup.",
    h1: "Cash for Cars Logan",
    intro:
      "Caraway quotes on cars across Logan, including Logan Central, Woodridge, Slacks Creek, Marsden, Crestmead, Springwood, and Beenleigh. Towing is free when we buy your car. Tell us where the car is and how the truck can reach it, because access can change the job.",
    regionName: "Logan City",
    localContent:
      "Logan addresses include dense residential streets, workshop yards, larger suburban blocks, and semi-rural properties. Before we quote on pickup, we need to know whether the car is on concrete, gravel, soft ground, or inside a shed, whether gates and driveways give enough access, and whether the wheels turn and the car can roll. For outer Logan addresses, the exact suburb and where the car is parked help us plan timing before you accept an offer.",
    serviceDetails:
      "We can assess cars with expired registration, mechanical faults, body damage, high kilometres, missing keys, or non-running engines. Send the year, make, model, condition, ownership details, registration status, and clear photos. If the car has seized wheels, major structural damage, or difficult yard access, tell us before booking so we can check whether a suitable pickup can be arranged. Enquiries from Logan City follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "We set out the offer and any pickup conditions before you commit. When we agree to buy, we confirm the pickup time and payment method, and payment is handled as agreed before the car leaves. You get a receipt and buyer details to keep with your Queensland disposal records.",
    nearbyAreaNames: [
      "Logan Central",
      "Woodridge",
      "Slacks Creek",
      "Marsden",
      "Crestmead",
    ],
    pickupAccessNotes: [
      "For yards and larger blocks, describe the driveway surface, gate width, ground firmness, and turning space.",
      "For a workshop pickup, tell us the business hours, contact person, where the keys are, and any storage or release requirements.",
      "For a non-running car, confirm whether it steers, rolls, has inflated tyres, and is blocked by another vehicle.",
    ],
    localSellingPoints: [
      "Logan address and access checked before booking",
      "Registered and unregistered cars considered",
      "Free towing included",
      "Clear offer, payment method, and receipt",
    ],
    localFaqs: [
      {
        question: "Does Caraway quote across Logan or only Logan Central?",
        answer:
          "We take enquiries from the wider Logan area. Pickup depends on the exact address, the car's details, safe access, and the schedule, so we confirm those before we agree to buy.",
      },
      {
        question: "Can Caraway pick up a non-running car from a Logan yard?",
        answer:
          "It may be possible. Send photos of the car and access route, and tell us the surface, gate width, obstacles, wheel condition, and whether the car steers and rolls.",
      },
      {
        question: "How soon can Caraway pick up a car in Logan?",
        answer:
          "Same- or next-day pickup may be available. It depends on the suburb, the car, access, when you are available, and the pickup schedule. We confirm the time before booking.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Tell us the Logan suburb, the car's condition, and the exact access. We will send the offer and pickup details before you decide.",
    nearbySuburbs: ["springwood", "beenleigh"],
    relatedServices: ["car-removal-brisbane"],
  },
  {
    slug: "kenmore",
    updatedAt: "2026-10-18",
    title: "Car Buyers Kenmore | Cash for Cars & Pickup",
    metaDescription:
      "Looking for car buyers in Kenmore? Get a free quote from Caraway. Towing is free when we buy your car.",
    h1: "Cash for Cars Kenmore",
    intro:
      "Caraway takes quote requests for Kenmore and nearby western suburbs. We also take enquiries from Chapel Hill, Fig Tree Pocket, Brookfield, Bellbowrie, and The Gap. We confirm whether we can buy your car and how pickup would work before you accept.",
    regionName: "Kenmore and western Brisbane",
    localContent:
      "Western-suburb properties can have sloping driveways, narrow approaches, low carports, or cars stored away from the street. Tell us how to get from the road to the car, not just the suburb. Photos of the driveway, gates, overhead clearance, turning room, and any slope help us check whether pickup is practical and what else we need to know.",
    serviceDetails:
      "We can assess older, damaged, unregistered, high-kilometre, and non-running cars. The offer is based on the car and the market information available at the time, including condition, completeness, location, and access. If the car has flat tyres, no keys, locked steering, seized brakes, or cannot be reached from a firm driveway, say so in your first enquiry. Enquiries from Kenmore and western Brisbane follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "When you compare car buyers for a Kenmore car, check the written net offer, pickup conditions, payment timing, when the offer can change, and who the buyer is. We confirm the car we are buying, our offer and conditions, how you get paid, and the pickup time before pickup. If the sale goes ahead, you get a receipt and buyer details for your records.",
    nearbyAreaNames: [
      "Chapel Hill",
      "Fig Tree Pocket",
      "Brookfield",
      "Bellbowrie",
      "The Gap",
    ],
    pickupAccessNotes: [
      "Photograph steep or curved driveways from both the street and where the car is parked.",
      "Measure low carport, garage, or basement clearance and note any gates or sharp turns.",
      "For a car away from a sealed driveway, describe the surface and how far the car is from firm ground the truck can reach.",
    ],
    localSellingPoints: [
      "Western Brisbane enquiries assessed by exact address",
      "Difficult access discussed before booking",
      "Free towing included",
      "Agreed offer and payment method confirmed first",
    ],
    localFaqs: [
      {
        question: "Can Caraway pick up from a steep Kenmore driveway?",
        answer:
          "It depends on the slope, surface, turning room, overhead clearance, where the car is, and whether it rolls. Send photos so we can check access before we offer pickup.",
      },
      {
        question: "Does Caraway cover The Gap and outer western suburbs?",
        answer:
          "We take enquiries from The Gap and western Brisbane. Pickup depends on the exact address, the car, access, and the pickup schedule, and we confirm it before you accept an offer.",
      },
      {
        question: "What details help with a Kenmore quote?",
        answer:
          "Send the year, make, model, kilometres, registration status, condition, ownership details, photos, and a clear description of where the car is parked and whether it starts and rolls.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send photos of the car and its access route with your Kenmore enquiry. We will confirm what we can offer and whether we can pick up from that address.",
    nearbySuburbs: ["toowong"],
    relatedServices: ["sell-my-car-brisbane", "car-removal-brisbane"],
  },
  {
    slug: "springwood",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Springwood | Free Towing Included",
    metaDescription:
      "Get a free quote for your car in Springwood, Daisy Hill, Underwood, or Rochedale South. Towing is free when we buy your car.",
    h1: "Cash for Cars Springwood",
    intro:
      "Caraway takes enquiries from Springwood, Daisy Hill, Underwood, Rochedale South, and nearby Logan suburbs. We confirm the offer, access requirements, how you get paid, and the pickup time before we buy your car.",
    regionName: "Springwood and north-east Logan",
    localContent:
      "A Springwood pickup may be at a house, unit complex, workshop, commercial property, or roadside spot. Tell us exactly where the car is and whether there is room to load it safely away from moving traffic. For gated complexes or business sites, include access hours and the contact who can authorise entry and release the car.",
    serviceDetails:
      "We consider cars with mechanical faults, accident damage, expired registration, high kilometres, or no current roadworthy. The year, make, model, condition, completeness, ownership details, and access all affect the quote and pickup plan. Describe a non-running car accurately, including whether it steers, rolls, has keys, and has usable tyres. Enquiries from Springwood and north-east Logan follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "We confirm the offer and the practical details in advance, not just the suburb. When we agree to buy, you know the offer, pickup time, payment method, and which documents to keep. Towing is free when we buy your car. Tell us where the car is and how the truck can reach it, because access can change the job.",
    nearbyAreaNames: [
      "Daisy Hill",
      "Underwood",
      "Rochedale South",
      "Slacks Creek",
      "Shailer Park",
    ],
    pickupAccessNotes: [
      "For a unit or gated complex, confirm gate access, visitor-bay rules, clearance, and any booking requirements.",
      "For a workshop or commercial site, tell us the opening hours, the release contact, and where the keys are held.",
      "For a car near a busy road, find a safe and legal place to load it before pickup is booked.",
    ],
    localSellingPoints: [
      "Springwood and nearby Logan suburbs considered",
      "Residential and workshop access checked in advance",
      "Free towing included",
      "Offer and payment arrangements recorded before pickup",
    ],
    localFaqs: [
      {
        question: "Can Caraway pick up from a Springwood workshop?",
        answer:
          "It may be possible. Tell us the workshop's access hours, contact person, release requirements, where the keys are, and any storage fees or permissions that must be sorted out first.",
      },
      {
        question: "Can I get a quote for a damaged car in Springwood?",
        answer:
          "Yes. Describe the damage, tell us whether the car starts, steers, and rolls, and send clear photos. We will confirm whether we can buy and pick up the car.",
      },
      {
        question: "Is towing included in a Springwood sale?",
        answer:
          "Towing is free when we buy your car. Access can change the job, so we set out the pickup time and any conditions before you accept.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us the Springwood address, your car's details, and the access details. We will confirm the offer and pickup options before you commit.",
    nearbySuburbs: ["logan", "beenleigh"],
    relatedServices: ["sell-my-car-brisbane", "car-removal-brisbane"],
  },
  {
    slug: "redcliffe",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Redcliffe & Moreton Bay",
    metaDescription:
      "Get a free quote for your car in Redcliffe or the Moreton Bay area. Towing is free when we buy your car.",
    h1: "Cash for Cars Redcliffe and Moreton Bay",
    intro:
      "Get a free quote from Caraway for your car in Redcliffe, Kippa-Ring, Clontarf, Margate, Scarborough, North Lakes, Caboolture, or another Moreton Bay address. We confirm coverage, the offer, and pickup for your exact address before you accept.",
    regionName: "Redcliffe and Moreton Bay",
    localContent:
      "The Redcliffe Peninsula and wider Moreton Bay area include apartment parking, residential driveways, workshop sites, and addresses farther from central Brisbane. So we can assess pickup accurately, tell us the suburb, the exact parking spot, the street or driveway access, and whether the car starts and rolls. Tell us about coastal exposure, visible rust, flood or salt-water contact, and long-term storage, because they can affect both the offer and safe loading.",
    serviceDetails:
      "We can assess registered or unregistered cars in varied condition, including cars with mechanical faults, corrosion, accident damage, flat tyres, or missing keys. The quote depends on the car, its completeness, location, access, ownership details, and current market factors. We confirm Moreton Bay pickup timing for the exact address, not from the suburb name alone. Enquiries from Redcliffe and Moreton Bay follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "Before we agree to buy, we record the car's details, the offer, pickup requirements, payment method, and pickup time. If the sale goes ahead, you get a receipt and buyer details to keep with your Queensland disposal records. Towing is free when we buy your car. Tell us where the car is and how the truck can reach it, because access can change the job.",
    nearbyAreaNames: [
      "Kippa-Ring",
      "Clontarf",
      "Margate",
      "North Lakes",
      "Caboolture",
    ],
    pickupAccessNotes: [
      "For peninsula apartments, tell us the basement clearance, ramp access, parking level, and whether the car can move to an accessible bay.",
      "For North Lakes, Caboolture, or other Moreton Bay addresses, give the exact location so we can check availability before booking.",
      "Tell us about significant corrosion, flood exposure, seized wheels, or unsafe tyres before pickup is planned.",
    ],
    localSellingPoints: [
      "Redcliffe and Moreton Bay enquiries assessed by address",
      "Coastal condition and access considered before booking",
      "Free towing included",
      "Receipt and buyer details provided",
    ],
    localFaqs: [
      {
        question: "Does Caraway cover the whole Moreton Bay area?",
        answer:
          "We take enquiries from Redcliffe and the wider Moreton Bay area, including North Lakes and Caboolture. Pickup depends on the exact address, the car, access, and the schedule, and we confirm it first.",
      },
      {
        question: "Can I get a quote for a rusty coastal car?",
        answer:
          "Yes. Send photos of visible rust and describe any known corrosion, flood exposure, brake issues, or long-term outdoor storage. Condition affects the offer and how we pick up the car.",
      },
      {
        question: "How soon can Caraway pick up a car in Redcliffe?",
        answer:
          "Same- or next-day pickup may be available. It depends on the exact location, access, the car's details, when you are available, and the pickup schedule.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us the Redcliffe or Moreton Bay address, the car's condition, and access photos. We will confirm the offer and pickup details before you decide.",
    nearbySuburbs: [],
    relatedServices: ["sell-my-car-brisbane"],
  },
  {
    slug: "capalaba",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Redland City | Capalaba & Bayside",
    metaDescription:
      "Get a free quote for your car in Redland City or Capalaba. Towing is free when we buy your car.",
    h1: "Cash for Cars Capalaba and Brisbane Bayside",
    intro:
      "Caraway takes quote requests from Redland City, Capalaba, and nearby eastern or bayside areas. We also take enquiries from Alexandra Hills, Birkdale, Cleveland, Wynnum, Manly, and Carindale. We confirm coverage and pickup for your exact address before we agree to buy.",
    regionName: "Capalaba, Redlands, and Brisbane's bayside",
    localContent:
      "Eastern and bayside enquiries can involve suburban driveways, unit parking, commercial sites, workshop yards, and streets with limited loading room. Tell us the exact parking spot and any gates, slopes, height limits, soft ground, or traffic restrictions. If the car has coastal corrosion, flood exposure, or seized brakes, or has been stored for a long time, tell us when you ask for a quote.",
    serviceDetails:
      "We consider older, damaged, unregistered, high-kilometre, and non-running cars. The offer reflects the make, model, year, condition, completeness, ownership details, location, and pickup access. Photos should show all sides of the car, the interior, visible damage, and the route from the car to the street. Enquiries from Capalaba, Redlands, and Brisbane's bayside follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "When you compare cash-for-cars options for a Redland City car, check the written net offer, pickup conditions, payment timing, when the offer can change, and who the buyer is. We confirm the car, our offer and conditions, how you get paid, and the pickup time before pickup. If the sale goes ahead, you get a receipt and buyer details for your records.",
    nearbyAreaNames: [
      "Alexandra Hills",
      "Birkdale",
      "Wynnum",
      "Manly",
      "Carindale",
    ],
    pickupAccessNotes: [
      "For a workshop or yard, tell us the business hours, gate access, who can release the car, and exactly where it is.",
      "For unit or townhouse parking, tell us the height clearance, shared-access rules, and a safe place to load.",
      "For bayside cars, tell us about visible rust, salt-water or flood exposure, and any seized brakes or wheels.",
    ],
    localSellingPoints: [
      "Capalaba, Redlands, and bayside enquiries considered",
      "Car condition and pickup access assessed together",
      "Free towing included",
      "Offer and payment arrangements confirmed in advance",
    ],
    localFaqs: [
      {
        question: "Does Caraway quote in both Capalaba and Brisbane's bayside?",
        answer:
          "We take enquiries from Capalaba, nearby Redlands suburbs, Wynnum, Manly, and eastern Brisbane. Pickup depends on the exact address, access, the car, and the schedule.",
      },
      {
        question: "Can Caraway pick up from a Capalaba workshop?",
        answer:
          "It may be possible. Confirm the workshop's hours, contact person, release requirements, where the keys are, and any storage fees or access restrictions before booking.",
      },
      {
        question: "Can I get a quote for a non-running bayside car?",
        answer:
          "Yes. Tell us whether it steers and rolls, the tyre and brake condition, any visible rust or flood exposure, and the exact access route. We will confirm whether we can buy and pick up the car.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us the eastern or bayside address, your car's details, and access photos. We will confirm whether we can buy the car and how pickup would work.",
    nearbySuburbs: [],
    relatedServices: ["sell-my-car-brisbane", "car-removal-brisbane"],
  },
  {
    slug: "beenleigh",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Beenleigh | Free Towing Included",
    metaDescription:
      "Get a free quote for your car in Beenleigh, Eagleby, Holmview, or nearby Logan suburbs. Towing is free when we buy your car.",
    h1: "Cash for Cars Beenleigh",
    intro:
      "Get a free quote from Caraway for your car in Beenleigh, Eagleby, Edens Landing, Holmview, Yatala, Loganholme, or nearby suburbs. We confirm the offer, access requirements, how you get paid, and whether pickup is available before we buy your car.",
    regionName: "Beenleigh and southern Logan",
    localContent:
      "Beenleigh-area pickups may involve residential driveways, townhouse complexes, workshops, industrial sites, or larger blocks toward the edge of Logan. Tell us where the car is parked, what surface it is on, whether a gate or building limits access, and whether the car starts, steers, and rolls. For a business or workshop site, include access hours and the person authorised to release the car.",
    serviceDetails:
      "We assess registered and unregistered cars in varied condition, including cars with mechanical failure, body damage, missing keys, flat tyres, or expired registration. The quote depends on the car, its condition, completeness, ownership details, location, and pickup access. Tell us about any finance, storage fees, or anyone else holding the car before you accept an offer. Enquiries from Beenleigh and southern Logan follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "We confirm the terms for your car and address before pickup. If we agree to buy, you get the offer, pickup time, payment method, and any access conditions in advance, then a receipt and buyer details for your records.",
    nearbyAreaNames: [
      "Eagleby",
      "Edens Landing",
      "Holmview",
      "Yatala",
      "Loganholme",
    ],
    pickupAccessNotes: [
      "For larger blocks, describe the driveway surface, gate width, ground firmness, and distance from the street.",
      "For industrial or workshop sites, tell us the opening hours, the release contact, and any site induction or loading rules.",
      "Sort out any finance, storage charges, or anyone else holding the car before arranging pickup.",
    ],
    localSellingPoints: [
      "Beenleigh and southern Logan enquiries considered",
      "Residential, workshop, and yard access checked first",
      "Free towing included",
      "Receipt and buyer details supplied",
    ],
    localFaqs: [
      {
        question: "Can Caraway pick up from a Beenleigh workshop or industrial site?",
        answer:
          "It may be possible. Tell us the site's hours, release contact, access rules, where the keys are, and any fees or authority needed before the car can leave.",
      },
      {
        question: "Can I get a quote for an unregistered car in Beenleigh?",
        answer:
          "Yes. Send ownership details, registration status, condition, photos, the exact location, and whether the car starts and rolls. We will confirm any purchase requirements.",
      },
      {
        question: "Is towing free in Beenleigh?",
        answer:
          "Towing is free when we buy your car. Access can change the job, so we set out the offer and pickup conditions before you accept.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us the Beenleigh-area location, the car's condition, and access details. We will confirm the offer and pickup options before you commit.",
    nearbySuburbs: ["logan", "springwood"],
    relatedServices: ["sell-my-car-brisbane", "car-removal-brisbane"],
  },
  {
    slug: "moorooka",
    updatedAt: "2026-10-18",
    title: "Cash for Cars Moorooka & South Brisbane",
    metaDescription:
      "Get a free quote for your car in Moorooka or Brisbane's southside. Towing is free when we buy your car.",
    h1: "Cash for Cars Moorooka and South Brisbane",
    intro:
      "Caraway takes enquiries from Moorooka, Rocklea, Archerfield, Annerley, Sunnybank, Mount Gravatt, and surrounding southside suburbs. We confirm the offer and pickup plan for your exact car and address before you accept.",
    regionName: "Moorooka and South Brisbane",
    localContent:
      "Southside pickup locations range from residential streets and under-house parking to workshop yards and industrial properties. Tell us whether the car is behind a gate, on a slope, inside a low garage, blocked by another vehicle, or held by a mechanic. For Rocklea or another flood-prone address, tell us about any known water exposure, contamination, seized brakes, or electrical damage.",
    serviceDetails:
      "We can assess older, damaged, unregistered, scrap, workshop-held, flood-affected, and non-running cars. The quote depends on the car, its completeness, condition, ownership details, location, and access. Cars with severe damage, water exposure, no keys, locked steering, or seized wheels need clear photos and an accurate description before we can consider pickup. Enquiries from Moorooka and South Brisbane follow the same cash for cars Brisbane process as the rest of our service area: details first, a written offer, then a confirmed pickup.",
    whyUs:
      "We confirm the car's details, the offer, payment method, pickup requirements, and pickup time before we agree to buy. Towing is free when we buy your car. Tell us where the car is and how the truck can reach it, because access can change the job. You get buyer details and a receipt to keep with your Queensland disposal records.",
    nearbyAreaNames: [
      "Rocklea",
      "Archerfield",
      "Annerley",
      "Sunnybank",
      "Mount Gravatt",
    ],
    pickupAccessNotes: [
      "For a workshop-held car, confirm who can release it, the access hours, where the keys are, and whether any storage invoice is unpaid.",
      "For under-house or low-garage parking, tell us the height clearance, driveway slope, turning room, and whether the car can roll outside.",
      "For a flood-affected car, tell us the water level, contamination, brake and wheel condition, and whether the ground is firm and accessible.",
    ],
    localSellingPoints: [
      "Moorooka and wider southside enquiries considered",
      "Workshop, residential, and industrial access assessed",
      "Free towing included",
      "Conditional offer and payment details confirmed first",
    ],
    localFaqs: [
      {
        question: "Can Caraway pick up a car from a Moorooka mechanic?",
        answer:
          "It may be possible. Confirm the mechanic's hours, release contact, keys, storage charges, and authority to release the car before pickup is booked.",
      },
      {
        question: "Does the Moorooka page cover Rocklea and Mount Gravatt?",
        answer:
          "We take enquiries across Moorooka and the wider southside, including Rocklea, Sunnybank, and Mount Gravatt. Pickup depends on the exact address, the car, access, and the schedule.",
      },
      {
        question: "Can Caraway assess a flood-affected car?",
        answer:
          "Yes. Send photos and tell us the water level, contamination, electrical condition, brakes, wheels, keys, and access. We will confirm whether we can buy and safely pick up the car.",
      },
    ],
    internalLinks: [
      { label: "Cash for cars Brisbane", href: "/" },
      { label: "View all service areas", href: "/locations" },
    ],
    finalCtaText:
      "Send us the southside address, your car's details, and access photos. We will confirm the offer and whether we can pick up before you decide.",
    nearbySuburbs: [],
    relatedServices: ["sell-my-car-brisbane", "car-removal-brisbane"],
  },
];

export function getSuburbBySlug(slug: string): SuburbPage | undefined {
  return suburbs.find((suburb) => suburb.slug === slug);
}
