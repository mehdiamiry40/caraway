export const faqCategories = [
  {
    category: "Pricing & Payment",
    faqs: [
      { question: "Will I really get up to $9,999 for my car?", answer: "Some selected vehicles may receive offers up to $9,999, but most older, damaged, or scrap vehicles receive lower offers. Your quote depends on the vehicle's make, model, year, condition, completeness, location, and current market demand." },
      { question: "How do you determine my car's value?", answer: "We use real-time market data including current scrap metal prices, parts demand, recent comparable sales in Brisbane, condition, completeness, and towing access. Our valuations are transparent — we'll explain exactly how we arrived at your offer." },
      { question: "When and how do I get paid?", answer: "We agree the payment method before pickup. Payment may be made in cash or by cleared bank transfer depending on the sale, and it is confirmed before the vehicle leaves your property." },
      { question: "Can you match or beat a quote I've received elsewhere?", answer: "We'll certainly try. If you've received a competing offer, let us know the amount and we'll do our best to match or exceed it. We're competitive on pricing across Brisbane." }
    ]
  },
  {
    category: "Vehicle Requirements",
    faqs: [
      { question: "What types of cars do you buy?", answer: "We buy all types — sedans, utes, 4WDs, SUVs, vans, trucks, and commercial vehicles. Old cars, damaged cars, scrap cars, accident write-offs, flood-damaged vehicles, and more. Running or not." },
      { question: "Do I need a Roadworthy Certificate (RWC)?", answer: "We can assess your vehicle as-is without a safety certificate. Queensland requirements depend on registration status and sale type, so check current TMR guidance for the paperwork that applies." },
      { question: "Can I sell a car without registration?", answer: "Yes. We buy unregistered, deregistered, and expired-registration vehicles across Brisbane. No current registration is needed." },
      { question: "Do you buy cars that don't run or start?", answer: "Absolutely. Non-running, mechanically failed, and immobile vehicles are among the most common types we purchase. Our tow truck will handle the rest." },
      { question: "Can I sell a car I still owe finance on?", answer: "In some cases, yes. Contact us to discuss your specific situation. We may be able to arrange payout of remaining finance as part of the sale." }
    ]
  },
  {
    category: "Process & Logistics",
    faqs: [
      { question: "How does the selling process work?", answer: "It's three simple steps: (1) Contact us with your car details for a free quote. (2) Accept our offer. (3) We pick up your car and pay you cash. The whole process can be completed in under an hour." },
      { question: "How fast can you pick up my car?", answer: "Most pickups are same- or next-day across Greater Brisbane, depending on truck availability in your area and when you accept the offer. When you book, we confirm a pickup window — we won't promise a slot we can't keep." },
      { question: "Is your towing really free?", answer: "Yes — towing is free anywhere in Greater Brisbane. We do not deduct towing costs from your agreed quote when the vehicle matches the details provided." },
      { question: "What paperwork do I need?", answer: "Bring current photo ID and any registration, finance, insurer, or ownership documents you have. We provide a receipt and buyer details, while you complete the seller-side TMR steps that apply." },
      { question: "Do I need to be home for the pickup?", answer: "Ideally yes, as we pay cash in person and need to verify your ID. However, we can sometimes make alternative arrangements — just ask when booking." }
    ]
  },
  {
    category: "Service Area & Availability",
    faqs: [
      { question: "Can I visit your office or drop my car off?", answer: "No. We don't operate a public yard and we don't accept vehicle drop-offs. We collect cars from you (home, work, or another agreed spot) across Greater Brisbane with free towing." },
      { question: "What areas of Brisbane do you cover?", answer: "We cover all of Greater Brisbane — north to Caboolture, south to Beenleigh, west to Ipswich, and east to Cleveland. This includes Logan, Moreton Bay, Redland City, and Ipswich council areas." },
      { question: "Do you charge extra for outer suburbs?", answer: "No. Whether you're in the CBD or Caboolture, our service is the same price — free towing and competitive cash offers regardless of your location." },
      { question: "Are you available on weekends?", answer: "Yes. We're reachable 7 days a week, Monday to Sunday, 7am to 7pm for quotes and bookings. Weekend pickups are usually same- or next-day, subject to truck availability — during busy periods it's worth calling earlier in the day so we can lock in a slot." },
      { question: "What happens to my car after you buy it?", answer: "Depending on condition, we either resell it, salvage usable parts, or responsibly recycle it at a licensed Queensland facility. All fluids and hazardous materials are disposed of according to EPA regulations." }
    ]
  }
];

export const allFaqs = faqCategories.flatMap(c => c.faqs);
