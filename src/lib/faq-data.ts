export const faqCategories = [
  {
    category: "Pricing & Payment",
    faqs: [
      {
        question: "What affects how much I'm offered?",
        answer:
          "There is no set amount for every car. A quote depends on the make, model, year, condition, whether the car is complete, its ownership, location, access, and current demand for resale, parts or materials.",
      },
      {
        question: "How do you assess my car?",
        answer:
          "We review the details and photos you send, including whether the car starts, rolls, steers and brakes, and whether the major parts are there. Before you accept an offer, ask what could change it.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "We confirm how and when you're paid before pickup, for each job we accept. Don't hand over the car until the agreed payment condition is met.",
      },
      {
        question: "Can I compare another buyer's quote?",
        answer:
          "Yes. Give each buyer the same details about the car, its condition, location and access. Then compare the written net amount, pickup terms, payment, deductions, and what could change the offer.",
      },
    ],
  },
  {
    category: "Vehicle Requirements",
    faqs: [
      {
        question: "What types of vehicles do you assess?",
        answer:
          "We look at many old, damaged, scrap, unregistered and non-running cars, plus selected utes, 4WDs, SUVs, vans, trucks and fleet vehicles. Whether we can buy one depends on the vehicle, location, access and current demand.",
      },
      {
        question: "Do I need a Roadworthy Certificate (RWC)?",
        answer:
          "We can assess a vehicle as it is, without a Safety Certificate. Queensland sale requirements depend on registration status, buyer type and any recognised exemption, so check current TMR guidance before you dispose of the vehicle.",
      },
      {
        question: "Can you assess an unregistered car?",
        answer:
          "Yes. You must have the right to sell it and keep the required sale record. Have it moved lawfully. Don't drive it unregistered without the permit, insurance and conditions that may apply.",
      },
      {
        question: "Can you assess a car that doesn't run?",
        answer:
          "Yes, depending on the car and the access. Tell us if it rolls, steers and brakes, has all wheels and keys, and can be reached safely by a suitable truck.",
      },
      {
        question: "Can I sell a car with finance owing?",
        answer:
          "It may be possible, but you must follow the lender's current payout and settlement instructions. Tell us about any registered security interest, agree how the payment will flow, and check the finance is discharged before you hand over the car.",
      },
    ],
  },
  {
    category: "Process & Logistics",
    faqs: [
      {
        question: "How does the selling process work?",
        answer:
          "Give us accurate details about the car and the access to get a free quote with no obligation. If we make an offer and you accept, confirm the pickup time, payment, pickup terms, receipt and seller-side paperwork before the truck is sent.",
      },
      {
        question: "How fast can you pick up my car?",
        answer:
          "It depends on the car, the suburb, access, the truck needed and availability. We confirm the pickup time for each job we accept. There is no single timeframe for every car.",
      },
      {
        question: "Is towing free?",
        answer:
          "Yes, towing is free when we buy your car and the car, location and access match what you told us. Check the written pickup terms before you accept the quote.",
      },
      {
        question: "What paperwork do I need?",
        answer:
          "Bring current photo ID and the rego, finance, insurance, estate or ownership records that apply. Keep a signed receipt and confirmation of the seller-side TMR steps you complete.",
      },
      {
        question: "Do I need to be there for pickup?",
        answer:
          "Ask when you book who needs to be there and what ID is needed. If someone else will act for the owner, sort out their authority and documents before the truck is sent. Don't assume the car can be handed over with nobody there.",
      },
    ],
  },
  {
    category: "Service Area & Availability",
    faqs: [
      {
        question: "Can I visit your office or drop my car off?",
        answer:
          "Please don't visit or bring a car to an address unless we have confirmed the appointment and location first. The car's location and pickup access are agreed as part of each job we accept.",
      },
      {
        question: "Which Brisbane areas do you service?",
        answer:
          "We take enquiries from Greater Brisbane, including Logan, Ipswich, Moreton Bay and Redlands. Whether we can pick up depends on the exact suburb, the car, access and the schedule, so tell us the location when you ask for a quote.",
      },
      {
        question: "Can location or access change the pickup?",
        answer:
          "Yes. Distance, clearance, slope, surface, obstacles, locked wheels, missing keys and storage-yard rules can affect whether we can pick up and which truck is needed. Tell us before you accept an offer.",
      },
      {
        question: "Do you pick up on weekends?",
        answer:
          "Weekend pickup may be available. The date and time depend on the location, access, truck and schedule, and are confirmed for each job we accept.",
      },
      {
        question: "What happens to my car after Caraway buys it?",
        answer:
          "It depends on the car and who receives it. It may be resold, used for parts, or sent for specialist dismantling and recycling. It is not the same for every car.",
      },
    ],
  },
];

export const allFaqs = faqCategories.flatMap((category) => category.faqs);
