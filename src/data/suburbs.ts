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
    updatedAt: "2026-08-10",
    title: "Car Removal Toowong | Cash for Cars & Pickup",
    metaDescription:
      "Car removal Toowong for unregistered, damaged, or non-running cars. Request a quote; pickup is included when Caraway buys, subject to access and availability.",
    h1: "Cash for Cars Toowong",
    intro:
      "Request a quote for a car in Toowong, Auchenflower, Taringa, St Lucia, Indooroopilly, or nearby inner-west suburbs. If Caraway agrees to buy the vehicle, pickup is included and the timing and payment method are confirmed before collection.",
    regionName: "Toowong and Brisbane's inner west",
    localContent:
      "Inner-west pickups can involve apartment basements, shared driveways, steep streets, and limited loading space. Those details affect which collection method is suitable, so include the exact parking position, clearance height, ramp access, and whether the vehicle starts, steers, and rolls. For a car on a busy road or in restricted parking, Caraway will confirm whether there is a safe loading position or whether the vehicle needs to be moved first.",
    serviceDetails:
      "Caraway considers registered and unregistered cars in a range of conditions, including vehicles with mechanical faults, accident damage, flat tyres, missing keys, or expired registration. The quote depends on the year, make, model, condition, completeness, location, ownership information, and pickup access. Photos of the vehicle and parking area help avoid surprises before a collection is booked.",
    whyUs:
      "You receive the proposed offer and collection requirements before accepting. If a purchase goes ahead, Caraway confirms the pickup window and agreed payment method, checks the seller's authority to sell, and provides buyer details and a receipt for your records. Pickup availability remains subject to the vehicle details, safe access, and the collection schedule.",
    nearbyAreaNames: [
      "Auchenflower",
      "Taringa",
      "St Lucia",
      "Indooroopilly",
      "Paddington",
    ],
    pickupAccessNotes: [
      "For basement or stack parking, provide the clearance height, ramp angle, parking level, and whether the car can be moved to an accessible bay.",
      "For a steep driveway or narrow street, send photos showing the approach, turning space, and the vehicle's position.",
      "For kerbside parking, confirm that the vehicle is legally parked and that a suitable loading position is available.",
    ],
    localSellingPoints: [
      "Pickup included when Caraway buys",
      "Access checked before collection is booked",
      "Offer and agreed payment method confirmed in advance",
      "Receipt and buyer details supplied for your records",
    ],
    localFaqs: [
      {
        question: "Can Caraway collect from a Toowong basement car park?",
        answer:
          "Sometimes. Clearance height, ramp access, turning room, parking level, and whether the car rolls determine the suitable method. Send those details before booking so Caraway can confirm whether collection is possible.",
      },
      {
        question: "Can I request a quote for an unregistered car in Toowong?",
        answer:
          "Yes. Include proof-of-ownership details, the registration status, the vehicle condition, and its exact parking position. Caraway will confirm any sale and collection requirements before you accept.",
      },
      {
        question: "How soon can pickup be available in Toowong?",
        answer:
          "It may be available, but it is not guaranteed. Timing depends on the vehicle, safe access, your availability, and the collection schedule. Caraway confirms the window before pickup.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the vehicle details and a clear description of the Toowong pickup location. Caraway will confirm the offer, access requirements, and available collection window before you decide.",
    nearbySuburbs: ["kenmore"],
    relatedServices: ["car-removal-brisbane"],
  },
  {
    slug: "logan",
    title: "Cash for Cars Logan | Vehicle Pickup Options",
    metaDescription:
      "Request a quote for a car in Logan. Caraway confirms the offer, access, payment method, and available pickup window before collection.",
    h1: "Cash for Cars Logan",
    intro:
      "Caraway quotes on vehicles across Logan, including Logan Central, Woodridge, Slacks Creek, Marsden, Crestmead, Springwood, and Beenleigh. Pickup is included when Caraway buys, subject to the agreed address, vehicle condition, safe access, and availability.",
    regionName: "Logan City",
    localContent:
      "Logan enquiries cover dense residential streets, workshop yards, larger suburban blocks, and semi-rural properties. Before quoting on collection, Caraway needs to know whether the car is on concrete, gravel, soft ground, or inside a shed; whether gates and driveways allow suitable access; and whether the wheels turn and the vehicle can roll. For outer Logan addresses, the exact suburb and pickup position help determine scheduling before an offer is accepted.",
    serviceDetails:
      "Cars with expired registration, mechanical faults, body damage, high kilometres, missing keys, or non-running engines can be assessed. Provide the year, make, model, condition, ownership information, registration status, and clear photos. If the vehicle has seized wheels, major structural damage, or difficult yard access, disclose that before booking so suitable collection arrangements can be considered.",
    whyUs:
      "Caraway sets out the proposed offer and any pickup conditions before the seller commits. When a purchase is agreed, the collection window and payment method are confirmed, and payment is handled according to that agreement before the vehicle leaves. The seller receives a receipt and buyer details to retain with their Queensland disposal records.",
    nearbyAreaNames: [
      "Logan Central",
      "Woodridge",
      "Slacks Creek",
      "Marsden",
      "Crestmead",
    ],
    pickupAccessNotes: [
      "For yards and larger blocks, describe the driveway surface, gate width, ground firmness, and turning space.",
      "For a workshop pickup, provide the business hours, contact person, keys location, and any storage or release requirements.",
      "For a non-running car, confirm whether it steers, rolls, has inflated tyres, and is blocked by another vehicle.",
    ],
    localSellingPoints: [
      "Logan address and access checked before booking",
      "Registered and unregistered vehicles considered",
      "Pickup included when Caraway buys",
      "Clear offer, payment method, and receipt",
    ],
    localFaqs: [
      {
        question: "Does Caraway quote across Logan or only Logan Central?",
        answer:
          "Caraway accepts enquiries from the wider Logan area. Collection depends on the exact address, vehicle details, safe access, and schedule, so those points are confirmed before a purchase is agreed.",
      },
      {
        question: "Can a non-running car be collected from a Logan yard?",
        answer:
          "It may be possible. Send photos of the car and access route, and explain the surface, gate width, obstacles, wheel condition, and whether the vehicle steers and rolls.",
      },
      {
        question: "How quickly can a Logan pickup be arranged?",
        answer:
          "Same- or next-day pickup may be available, but timing depends on the suburb, vehicle, access, seller availability, and collection schedule. The window is confirmed before booking.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Tell Caraway the Logan suburb, vehicle condition, and exact access setup. You will receive the proposed offer and available pickup arrangements before deciding whether to proceed.",
    nearbySuburbs: ["springwood", "beenleigh"],
    relatedServices: ["car-removal-brisbane"],
  },
  {
    slug: "kenmore",
    updatedAt: "2026-08-09",
    title: "Car Buyers Kenmore | Cash for Cars & Pickup",
    metaDescription:
      "Looking for car buyers in Kenmore? Request a vehicle-specific quote from Caraway. Pickup is included when Caraway buys, subject to access and availability.",
    h1: "Cash for Cars Kenmore",
    intro:
      "Caraway accepts vehicle quote requests for Kenmore and nearby western suburbs. Enquiries are also welcome from Chapel Hill, Fig Tree Pocket, Brookfield, Bellbowrie, and The Gap. Caraway confirms whether it can buy the vehicle and the available pickup arrangements before you accept.",
    regionName: "Kenmore and western Brisbane",
    localContent:
      "Western-suburb properties can have sloping driveways, narrow approaches, low carports, or vehicles stored away from the street. Explain the access from the road to the car rather than supplying only the suburb. Photos showing the driveway, gates, overhead clearance, turning room, and any slope help Caraway assess whether collection is practical and what information is still needed.",
    serviceDetails:
      "Caraway can assess older, damaged, unregistered, high-kilometre, and non-running vehicles. The offer is based on the vehicle and market information available at the time, including condition, completeness, location, and access. If the car has flat tyres, no keys, locked steering, seized brakes, or cannot be reached from a firm driveway, include that in the first enquiry.",
    whyUs:
      "When comparing car buyers for a Kenmore vehicle, check the written net offer, pickup conditions, payment timing, revision conditions, and buyer identity. Caraway confirms the vehicle being purchased, its offer and conditions, the payment arrangement, and the collection window before pickup. If the purchase proceeds, the seller receives a receipt and buyer details for their records.",
    nearbyAreaNames: [
      "Chapel Hill",
      "Fig Tree Pocket",
      "Brookfield",
      "Bellbowrie",
      "The Gap",
    ],
    pickupAccessNotes: [
      "Photograph steep or curved driveways from both the street and the vehicle position.",
      "Measure low carport, garage, or basement clearance and note any gates or sharp turns.",
      "For a car away from a sealed driveway, describe the surface and distance from firm vehicle access.",
    ],
    localSellingPoints: [
      "Western Brisbane enquiries assessed by exact address",
      "Difficult access discussed before booking",
      "Pickup included when Caraway buys",
      "Agreed offer and payment method confirmed first",
    ],
    localFaqs: [
      {
        question: "Can Caraway collect from a steep Kenmore driveway?",
        answer:
          "It depends on the slope, surface, turning room, overhead clearance, vehicle position, and whether the car rolls. Send photos so Caraway can assess access before a collection is offered.",
      },
      {
        question: "Does Caraway cover The Gap and outer western suburbs?",
        answer:
          "Enquiries are welcome from The Gap and western Brisbane. Availability depends on the exact address, vehicle, access, and collection schedule and is confirmed before you accept an offer.",
      },
      {
        question: "What details help with a Kenmore quote?",
        answer:
          "Provide the year, make, model, kilometres, registration status, condition, ownership information, photos, and a clear description of where the car is parked and whether it starts and rolls.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Include photos of the vehicle and its access route with your Kenmore enquiry. Caraway will confirm what it can offer and whether pickup is available for that location.",
    nearbySuburbs: ["toowong"],
    relatedServices: ["cash-for-cars-brisbane"],
  },
  {
    slug: "springwood",
    title: "Cash for Cars Springwood | Quote and Pickup Options",
    metaDescription:
      "Request a vehicle quote in Springwood, Daisy Hill, Underwood, or Rochedale South. Pickup is included when Caraway buys, subject to availability.",
    h1: "Cash for Cars Springwood",
    intro:
      "Caraway accepts vehicle enquiries from Springwood, Daisy Hill, Underwood, Rochedale South, and nearby Logan suburbs. The offer, safe-access requirements, payment method, and available collection window are confirmed before a purchase proceeds.",
    regionName: "Springwood and north-east Logan",
    localContent:
      "A Springwood pickup may be at a house, unit complex, workshop, commercial property, or roadside location. Provide the exact position and explain whether there is room for safe loading away from moving traffic. For gated complexes or business sites, include access hours and the contact who can authorise entry and release the vehicle.",
    serviceDetails:
      "Caraway considers cars with mechanical faults, accident damage, expired registration, high kilometres, or no current roadworthy. The year, make, model, condition, completeness, ownership information, and access all affect the quote and pickup plan. A non-running vehicle should be described accurately, including whether it steers, rolls, has keys, and has usable tyres.",
    whyUs:
      "Caraway confirms the commercial and practical details in advance instead of treating the suburb name as enough information. When a purchase is agreed, the seller knows the offer, collection window, payment method, and documents to retain. Pickup is included only when Caraway buys the vehicle and can confirm safe access.",
    nearbyAreaNames: [
      "Daisy Hill",
      "Underwood",
      "Rochedale South",
      "Slacks Creek",
      "Shailer Park",
    ],
    pickupAccessNotes: [
      "For a unit or gated complex, confirm gate access, visitor-bay rules, clearance, and any booking requirements.",
      "For a workshop or commercial site, provide opening hours, the release contact, and where the keys are held.",
      "For a vehicle near a busy road, identify a safe and legal loading position before collection is booked.",
    ],
    localSellingPoints: [
      "Springwood and nearby Logan suburbs considered",
      "Residential and workshop access checked in advance",
      "Pickup included with an agreed purchase",
      "Offer and payment arrangements recorded before collection",
    ],
    localFaqs: [
      {
        question: "Can Caraway collect from a Springwood workshop?",
        answer:
          "It may be possible. Provide the workshop's access hours, contact person, release requirements, key location, and any storage fees or permissions that must be resolved first.",
      },
      {
        question: "Can I request a quote for a damaged car in Springwood?",
        answer:
          "Yes. Describe the damage, whether the vehicle starts, steers, and rolls, and send clear photos. Caraway will confirm whether it can buy and collect the vehicle.",
      },
      {
        question: "Is collection included in a Springwood sale?",
        answer:
          "Pickup is included when Caraway agrees to buy the vehicle and confirms suitable access. The collection window and any conditions are set out before you accept.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the Springwood address, vehicle details, and access information. Caraway will confirm the proposed offer and collection options before you commit.",
    nearbySuburbs: ["logan", "beenleigh"],
    relatedServices: ["cash-for-cars-brisbane"],
  },
  {
    slug: "redcliffe",
    title: "Cash for Cars Redcliffe & Moreton Bay",
    metaDescription:
      "Request a vehicle quote in Redcliffe or the Moreton Bay area. Pickup is included when Caraway buys, subject to location, access, and availability.",
    h1: "Cash for Cars Redcliffe and Moreton Bay",
    intro:
      "Request a quote for a vehicle in Redcliffe, Kippa-Ring, Clontarf, Margate, Scarborough, North Lakes, Caboolture, or another Moreton Bay address. Caraway confirms coverage, the offer, and pickup availability for the exact location before you accept.",
    regionName: "Redcliffe and Moreton Bay",
    localContent:
      "The Redcliffe Peninsula and wider Moreton Bay area include apartment parking, residential driveways, workshop sites, and addresses farther from central Brisbane. For an accurate collection assessment, provide the suburb, exact parking position, street or driveway access, and whether the vehicle starts and rolls. Coastal exposure, visible rust, flood or salt-water contact, and long-term storage should be disclosed because they can affect both the offer and safe loading.",
    serviceDetails:
      "Caraway can assess registered or unregistered vehicles in varied condition, including cars with mechanical faults, corrosion, accident damage, flat tyres, or missing keys. The quote depends on the vehicle, completeness, location, access, ownership information, and current market factors. Moreton Bay scheduling is confirmed for the exact address; it is not assumed from the suburb name alone.",
    whyUs:
      "Before a purchase is agreed, Caraway records the vehicle details, proposed offer, collection requirements, payment method, and available window. If the sale proceeds, the seller receives a receipt and buyer details and can keep those with their Queensland disposal records. Pickup is included when Caraway buys and confirms access.",
    nearbyAreaNames: [
      "Kippa-Ring",
      "Clontarf",
      "Margate",
      "North Lakes",
      "Caboolture",
    ],
    pickupAccessNotes: [
      "For peninsula apartments, provide basement clearance, ramp access, parking level, and whether the vehicle can move to an accessible bay.",
      "For North Lakes, Caboolture, or other Moreton Bay addresses, give the exact location so availability can be checked before booking.",
      "Disclose significant corrosion, flood exposure, seized wheels, or unsafe tyres before collection is planned.",
    ],
    localSellingPoints: [
      "Redcliffe and Moreton Bay enquiries assessed by address",
      "Coastal condition and access considered before booking",
      "Pickup included with an agreed purchase",
      "Receipt and buyer details provided",
    ],
    localFaqs: [
      {
        question: "Does Caraway cover the whole Moreton Bay area?",
        answer:
          "Caraway accepts enquiries from Redcliffe and the wider Moreton Bay area, including North Lakes and Caboolture. Actual collection depends on the exact address, vehicle, access, and schedule and is confirmed first.",
      },
      {
        question: "Can I request a quote for a rusty coastal car?",
        answer:
          "Yes. Send photos of visible rust and describe any known corrosion, flood exposure, brake issues, or long-term outdoor storage. Condition affects the offer and collection method.",
      },
      {
        question: "How soon can a Redcliffe vehicle be collected?",
        answer:
          "Same- or next-day pickup may be available, but it is conditional on the exact location, access, vehicle details, seller availability, and collection schedule.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the Redcliffe or Moreton Bay address, vehicle condition, and access photos. Caraway will confirm the offer and available pickup arrangements before you decide.",
    nearbySuburbs: [],
    relatedServices: ["sell-my-car-brisbane"],
  },
  {
    slug: "capalaba",
    updatedAt: "2026-08-10",
    title: "Cash for Cars Redland City | Capalaba & Bayside",
    metaDescription:
      "Request a vehicle quote in Redland City or Capalaba. Pickup is included when Caraway buys, subject to the exact address, access, and availability.",
    h1: "Cash for Cars Capalaba and Brisbane Bayside",
    intro:
      "Caraway accepts vehicle quote requests from Redland City, Capalaba, and nearby eastern or bayside areas. Enquiries are welcome from Alexandra Hills, Birkdale, Cleveland, Wynnum, Manly, and Carindale. Coverage and collection availability are confirmed for the exact address before a purchase is agreed.",
    regionName: "Capalaba, Redlands, and Brisbane's bayside",
    localContent:
      "Eastern and bayside enquiries can involve suburban driveways, unit parking, commercial sites, workshop yards, and streets with limited loading room. Include the exact parking position and any gates, slopes, height limits, soft ground, or traffic constraints. If the vehicle has coastal corrosion, flood exposure, seized brakes, or has been stored for a long period, disclose that at the quote stage.",
    serviceDetails:
      "Caraway considers older, damaged, unregistered, high-kilometre, and non-running cars. The proposed offer reflects the make, model, year, condition, completeness, ownership information, location, and collection access. Photos should show all sides of the vehicle, the interior, visible damage, and the route from the car to the street.",
    whyUs:
      "When comparing cash-for-cars options for a Redland City vehicle, check the written net offer, pickup conditions, payment timing, revision conditions, and buyer identity. Caraway confirms the vehicle, offer and conditions, payment arrangement, and collection window before pickup. If the purchase proceeds, the seller receives a receipt and buyer details for their records.",
    nearbyAreaNames: [
      "Alexandra Hills",
      "Birkdale",
      "Wynnum",
      "Manly",
      "Carindale",
    ],
    pickupAccessNotes: [
      "For a workshop or yard, provide business hours, gate access, release authority, and the vehicle's exact position.",
      "For unit or townhouse parking, provide height clearance, shared-access rules, and a safe loading location.",
      "For bayside vehicles, disclose visible rust, salt-water or flood exposure, and any seized brakes or wheels.",
    ],
    localSellingPoints: [
      "Capalaba, Redlands, and bayside enquiries considered",
      "Vehicle condition and pickup access assessed together",
      "Pickup included when Caraway buys",
      "Offer and payment arrangements confirmed in advance",
    ],
    localFaqs: [
      {
        question: "Does Caraway quote in both Capalaba and Brisbane's bayside?",
        answer:
          "Enquiries are welcome from Capalaba, nearby Redlands suburbs, Wynnum, Manly, and eastern Brisbane. Collection depends on the exact address, access, vehicle, and schedule.",
      },
      {
        question: "Can Caraway collect from a Capalaba workshop?",
        answer:
          "It may be possible. Confirm the workshop's hours, contact person, release requirements, key location, and any storage fees or access restrictions before booking.",
      },
      {
        question: "Can I get a quote for a non-running bayside car?",
        answer:
          "Yes. Explain whether it steers and rolls, the tyre and brake condition, visible rust or flood exposure, and the exact access route. Caraway will confirm whether purchase and collection are available.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the eastern or bayside address, vehicle details, and access photos. Caraway will confirm whether it can buy the vehicle and the collection arrangements available.",
    nearbySuburbs: [],
    relatedServices: ["cash-for-cars-brisbane"],
  },
  {
    slug: "beenleigh",
    title: "Cash for Cars Beenleigh | Quote and Pickup Options",
    metaDescription:
      "Request a vehicle quote in Beenleigh, Eagleby, Holmview, or nearby Logan suburbs. Pickup is included when Caraway buys, subject to availability.",
    h1: "Cash for Cars Beenleigh",
    intro:
      "Request a quote for a car in Beenleigh, Eagleby, Edens Landing, Holmview, Yatala, Loganholme, or nearby suburbs. Caraway confirms the offer, access requirements, payment method, and pickup availability before a purchase proceeds.",
    regionName: "Beenleigh and southern Logan",
    localContent:
      "Beenleigh-area pickups may involve residential driveways, townhouse complexes, workshops, industrial sites, or larger blocks toward the edge of Logan. State where the vehicle is parked, what surface it is on, whether a gate or building limits access, and whether the car starts, steers, and rolls. For a business or workshop site, include access hours and the person authorised to release the vehicle.",
    serviceDetails:
      "Caraway assesses registered and unregistered cars in varied condition, including vehicles with mechanical failure, body damage, missing keys, flat tyres, or expired registration. The quote depends on the vehicle, condition, completeness, ownership information, location, and collection access. Disclose finance, storage fees, or third-party possession before accepting an offer.",
    whyUs:
      "Caraway confirms the proposed terms before collection instead of relying on a generic suburb promise. If a purchase is agreed, the seller receives the offer, available pickup window, payment method, and any access conditions in advance, followed by a receipt and buyer details for their records.",
    nearbyAreaNames: [
      "Eagleby",
      "Edens Landing",
      "Holmview",
      "Yatala",
      "Loganholme",
    ],
    pickupAccessNotes: [
      "For larger blocks, describe the driveway surface, gate width, ground firmness, and distance from the street.",
      "For industrial or workshop locations, provide opening hours, the release contact, and any site induction or loading rules.",
      "Resolve finance, storage charges, or another party's possession of the car before arranging collection.",
    ],
    localSellingPoints: [
      "Beenleigh and southern Logan enquiries considered",
      "Residential, workshop, and yard access checked first",
      "Pickup included with an agreed purchase",
      "Receipt and buyer details supplied",
    ],
    localFaqs: [
      {
        question: "Can Caraway collect from a Beenleigh workshop or industrial site?",
        answer:
          "It may be possible. Provide the site's hours, release contact, access rules, key location, and any fees or authority needed before the vehicle can leave.",
      },
      {
        question: "Can I request a quote for an unregistered car in Beenleigh?",
        answer:
          "Yes. Provide ownership information, registration status, condition, photos, exact location, and whether the vehicle starts and rolls. Caraway will confirm any purchase requirements.",
      },
      {
        question: "Is pickup free in Beenleigh?",
        answer:
          "Pickup is included when Caraway agrees to buy the vehicle and confirms safe access. The offer and collection conditions are set out before you accept.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the Beenleigh-area location, vehicle condition, and access details. Caraway will confirm the proposed offer and collection options before you commit.",
    nearbySuburbs: ["logan", "springwood"],
    relatedServices: ["cash-for-cars-brisbane"],
  },
  {
    slug: "moorooka",
    title: "Cash for Cars Moorooka & South Brisbane",
    metaDescription:
      "Request a vehicle quote in Moorooka or Brisbane's southside. Pickup is included when Caraway buys, subject to vehicle details, access, and availability.",
    h1: "Cash for Cars Moorooka and South Brisbane",
    intro:
      "Caraway accepts vehicle enquiries from Moorooka, Rocklea, Archerfield, Annerley, Sunnybank, Mount Gravatt, and surrounding southside suburbs. The offer and collection plan are confirmed for the exact vehicle and address before you accept.",
    regionName: "Moorooka and South Brisbane",
    localContent:
      "Southside collection locations range from residential streets and under-house parking to workshop yards and industrial properties. Tell Caraway whether the car is behind a gate, on a slope, inside a low garage, blocked by another vehicle, or held by a mechanic. For Rocklea or another flood-prone address, disclose any known water exposure, contamination, seized brakes, or electrical damage rather than assuming a standard pickup.",
    serviceDetails:
      "Older, damaged, unregistered, scrap, workshop-held, flood-affected, and non-running vehicles can be assessed. The quote depends on the vehicle, completeness, condition, ownership information, location, and access. Cars with severe damage, water exposure, no keys, locked steering, or seized wheels need clear photos and an accurate description before collection can be considered.",
    whyUs:
      "Caraway confirms the vehicle details, offer, payment method, collection requirements, and available window before a purchase is agreed. Pickup is included when Caraway buys and suitable access is confirmed. The seller receives buyer details and a receipt to retain with their Queensland disposal records.",
    nearbyAreaNames: [
      "Rocklea",
      "Archerfield",
      "Annerley",
      "Sunnybank",
      "Mount Gravatt",
    ],
    pickupAccessNotes: [
      "For a workshop-held car, confirm release authority, access hours, key location, and whether any storage invoice remains outstanding.",
      "For under-house or low-garage parking, provide height clearance, driveway slope, turning room, and whether the car can roll outside.",
      "For a flood-affected vehicle, disclose water level, contamination, brake and wheel condition, and whether the ground is firm and accessible.",
    ],
    localSellingPoints: [
      "Moorooka and wider southside enquiries considered",
      "Workshop, residential, and industrial access assessed",
      "Pickup included when Caraway buys",
      "Conditional offer and payment details confirmed first",
    ],
    localFaqs: [
      {
        question: "Can Caraway collect a car from a Moorooka mechanic?",
        answer:
          "It may be possible. Confirm the mechanic's hours, release contact, keys, storage charges, and authority to release the car before collection is booked.",
      },
      {
        question: "Does the Moorooka page cover Rocklea and Mount Gravatt?",
        answer:
          "Caraway accepts enquiries across Moorooka and the wider southside, including Rocklea, Sunnybank, and Mount Gravatt. Availability depends on the exact address, vehicle, access, and schedule.",
      },
      {
        question: "Can a flood-affected car be assessed?",
        answer:
          "Yes. Provide photos and disclose the water level, contamination, electrical condition, brakes, wheels, keys, and access. Caraway will confirm whether it can buy and safely collect the vehicle.",
      },
    ],
    internalLinks: [{ label: "View all service areas", href: "/locations" }],
    finalCtaText:
      "Send the southside address, vehicle details, and access photos. Caraway will confirm the proposed offer and whether collection is available before you decide.",
    nearbySuburbs: [],
    relatedServices: ["cash-for-cars-brisbane"],
  },
];

export function getSuburbBySlug(slug: string): SuburbPage | undefined {
  return suburbs.find((suburb) => suburb.slug === slug);
}
