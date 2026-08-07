export const faqCategories = [
  {
    category: "Pricing & Payment",
    faqs: [
      {
        question: "What affects the amount I may be offered?",
        answer:
          "There is no fixed amount for every vehicle. A quote depends on the make, model, year, condition, completeness, ownership position, location, access, and current resale, component, or material demand.",
      },
      {
        question: "How do you assess my vehicle?",
        answer:
          "Caraway reviews the details and photos you supply, including whether the vehicle starts, rolls, steers, and brakes and whether major components are present. Ask which assumptions could change the assessment before accepting an offer.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "The payment method and timing are confirmed for each accepted job before collection. Do not release the vehicle until the agreed payment condition has been satisfied.",
      },
      {
        question: "Can I compare another buyer's quote?",
        answer:
          "Yes. Give each buyer the same vehicle, condition, location, and access details, then compare the written net amount, collection terms, payment arrangement, deductions, and revision conditions.",
      },
    ],
  },
  {
    category: "Vehicle Requirements",
    faqs: [
      {
        question: "What types of vehicles do you assess?",
        answer:
          "Caraway assesses many old, damaged, scrap, unregistered, and non-running cars, as well as selected utes, 4WDs, SUVs, vans, trucks, and fleet vehicles. Eligibility depends on the individual vehicle, location, access, and current demand.",
      },
      {
        question: "Do I need a Roadworthy Certificate (RWC)?",
        answer:
          "Caraway can assess a vehicle as-is without a Safety Certificate. Queensland sale requirements depend on registration status, buyer type, and any recognised exemption, so check current TMR guidance before disposal.",
      },
      {
        question: "Can an unregistered vehicle be assessed?",
        answer:
          "Yes, an unregistered vehicle can be assessed. You must be entitled to sell it, keep the required sale record, and arrange lawful movement rather than driving it unregistered without the permit, insurance, and conditions that may apply.",
      },
      {
        question: "Can you assess a car that does not run?",
        answer:
          "Yes, subject to the particular vehicle and access. State whether it rolls, steers, brakes, has all wheels and keys, and can be reached safely by suitable collection equipment.",
      },
      {
        question: "Can I sell a car with finance owing?",
        answer:
          "It may be possible, but the lender's current payout and settlement instructions must be followed. Disclose any registered security interest, agree on the payment flow, and verify discharge before releasing the vehicle.",
      },
    ],
  },
  {
    category: "Process & Logistics",
    faqs: [
      {
        question: "How does the selling process work?",
        answer:
          "Supply accurate vehicle and access details for a free, no-obligation quote. If an offer is made and accepted, confirm the collection window, payment arrangement, pickup terms, receipt, and seller-side paperwork before dispatch.",
      },
      {
        question: "How fast can you pick up my car?",
        answer:
          "Collection timing depends on the vehicle, suburb, access, equipment, and availability. Caraway confirms the pickup window for each accepted job rather than promising a universal timeframe.",
      },
      {
        question: "Is pickup included?",
        answer:
          "Pickup is included when Caraway buys the vehicle and the supplied vehicle, location, and access details match. Confirm the written collection terms before accepting the quote.",
      },
      {
        question: "What paperwork do I need?",
        answer:
          "Bring current photo ID and the registration, finance, insurer, estate, or ownership records that apply. Keep a signed receipt and confirmation of the seller-side TMR steps you complete.",
      },
      {
        question: "Do I need to attend collection?",
        answer:
          "Confirm attendance and identity requirements when booking. If someone else may act for the owner, establish their authority and the documents required before dispatch rather than assuming an unattended handover is acceptable.",
      },
    ],
  },
  {
    category: "Service Area & Availability",
    faqs: [
      {
        question: "Can I visit your office or drop my car off?",
        answer:
          "Caraway does not operate a public customer yard or accept unarranged drop-offs. Vehicle location and collection access are confirmed as part of an accepted job.",
      },
      {
        question: "Which Brisbane areas do you service?",
        answer:
          "Caraway handles enquiries from Greater Brisbane, including Logan, Ipswich, Moreton Bay, and Redlands. Availability depends on the exact suburb, vehicle, access, and schedule, so confirm the location when requesting a quote.",
      },
      {
        question: "Can location or access affect pickup terms?",
        answer:
          "Yes. Distance, clearance, slope, surface, obstacles, locked wheels, missing keys, and storage-yard requirements can affect feasibility or equipment. Disclose those details before accepting an offer.",
      },
      {
        question: "Are weekend collections available?",
        answer:
          "Weekend collection may be available. The date and time depend on the location, access, equipment, and schedule and are confirmed for each accepted job.",
      },
      {
        question: "What happens to my car after Caraway buys it?",
        answer:
          "Depending on the vehicle and the receiving operator, it may be resold, used for suitable components, or sent for specialist dismantling and material recovery. Do not assume one downstream path applies to every vehicle.",
      },
    ],
  },
];

export const allFaqs = faqCategories.flatMap((category) => category.faqs);
