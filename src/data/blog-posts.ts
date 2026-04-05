export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
}

/** Calculate reading time from content paragraphs (~200 WPM average). */
function calcReadTime(content: string[]): string {
  const words = content.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/** Get related posts by matching category, excluding the current post. */
export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  const others = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

const rawPosts: Omit<BlogPost, "readTime">[] = [
  {
    slug: "cash-for-cars-caboolture-brisbane",
    title: "Cash for Cars Caboolture: Same-Day Pickup 2026",
    metaDescription:
      "Get cash for cars in Caboolture with same-day free pickup and instant payment. Any make, any condition — running, damaged, or unregistered. Serving all Moreton Bay suburbs.",
    excerpt:
      "Thinking of selling your car in Caboolture without the hassle of private listings? Here's how cash for cars works across the Moreton Bay region and what you can realistically expect to be paid.",
    content: [
      "Caboolture sits at the northern edge of Greater Brisbane, roughly 45 kilometres from the CBD, and it's one of the busiest corridors in South East Queensland for vehicle turnover. Between the rapid housing growth in Morayfield, the acreage blocks out around Wamuran, and the commuter traffic running up and down the Bruce Highway, there are plenty of vehicles reaching the end of their useful life every week. Cash for cars in Caboolture is one of the quickest ways to clear an unwanted vehicle and walk away with money in hand the same day.",
      "The process is refreshingly simple. You provide the basics — make, model, year, and a short description of the condition — and a cash buyer gives you a firm quote in minutes. If the offer suits you, a tow truck is dispatched to your address, often within a few hours. The driver checks the vehicle against your description, you sign the transfer paperwork, and you receive cash on the spot. Most pickups across the Moreton Bay Regional Council area wrap up in under 90 minutes from booking to payment.",
      "A common question from Caboolture sellers is whether a vehicle has to be registered or running to qualify. It doesn't. Cash-for-cars buyers purchase vehicles in any state: unregistered, deregistered, mechanically dead, accident-damaged, rusted out, or storm-affected. The D'Aguilar Highway and surrounding rural stretches see their share of kangaroo strikes and rollovers, and buyers are used to picking up vehicles with serious panel damage or blown drivetrains.",
      "So what is a car in Caboolture actually worth? Offers typically range from around $200 for a stripped shell up to $9,999 for a complete, running vehicle in reasonable shape. A non-running Ford Falcon with a tired engine might pull $400 to $900, while a 2012 Hyundai i30 that still drives could fetch $2,000 to $4,000 depending on kilometres and service history. Utes and 4WDs — HiLuxes, Rangers, Patrols, Pajeros — consistently attract stronger offers because their parts are in constant demand across Queensland and their heavier body panels return more in recyclable steel.",
      "Free towing is included right across the Moreton Bay region. Whether your car is parked at a house in Bellmere, a unit in Morayfield, a rural block in Elimbah, or a workshop in Narangba, the truck comes to you at no extra charge. You don't need to organise a flatbed, pay for transport, or drag the car anywhere yourself. That alone saves most sellers $150 to $300 compared with arranging their own tow.",
      "Paperwork is minimal but important. You'll need a valid photo ID — a Queensland driver's licence or passport — and ideally your registration certificate. The buyer will help you complete the disposal section on the rego papers and notify the Department of Transport and Main Roads (TMR) within the 14-day window required by QLD law. Don't forget to remove your number plates before the driver leaves. In Queensland, plates belong to the registered owner, not the car, and you can either return them to TMR or transfer them to another vehicle.",
      "Caboolture has a strong mix of tradies, commuters, and semi-rural households, which means the vehicle stock is varied. Work utes that have hammered up and down the Bruce Highway for a decade, family wagons that have done the school run from Burpengary to Narangba Valley every day, and older 4WDs that have been dragged out to the Glass House Mountains one too many times. Once a car crosses 250,000 kilometres, repair costs start climbing sharply, and the maths quickly favours a cash sale over another round of mechanical work.",
      "Selling privately is always an option, but for older or damaged cars it's rarely worth the effort in this part of Brisbane. You'll need a safety certificate (roadworthy), you'll have to write a listing, answer messages at all hours, manage test drives with strangers, and haggle on price. For a clean late-model car that still attracts buyers, the effort can pay off. For anything older than ten years, unregistered, or non-running, the private market in Caboolture is thin and the lowball offers are relentless. A cash-for-cars service removes the friction entirely.",
      "Timing is worth a quick thought. Scrap steel prices move with global markets, and those movements feed directly into what buyers can pay for end-of-life vehicles. Through early 2026, Queensland scrap steel has held reasonably steady, which means offers are solid right now. If you've been sitting on a car for months hoping the value will climb, the honest reality is that most unused cars lose value every week to flat tyres, dead batteries, seized brakes, and rodent damage.",
      "A few practical tips for sellers in Caboolture. Be honest about the condition upfront — surprises at pickup lead to revised offers, which wastes everyone's time. Have your paperwork and ID ready before the driver arrives. If access is tight — narrow rural driveway, car bogged on a back block, vehicle parked under a low carport — mention it when booking so the right truck is sent. And if you've got more than one vehicle to clear, say so early; bulk pickups almost always attract a better per-car rate.",
      "Cash for cars in Caboolture is one of the fastest, cleanest ways to turn an unwanted vehicle into usable money. No listing fees, no weekends lost to tyre-kickers, no mechanical repairs required before sale. Whether your car is in Morayfield, Upper Caboolture, Beerburrum, or anywhere else across the Moreton Bay region, a single phone call is all it takes to get a firm quote and have the vehicle off your property the same day.",
    ],
    date: "2026-04-05",
    category: "Guides",
  },
  {
    slug: "cash-for-cars-ipswich-brisbane",
    title: "Cash for Cars Ipswich: Fast Offers in 2026",
    metaDescription:
      "Get cash for cars in Ipswich, Brisbane. Same-day free pickup and instant payment for any vehicle — old, damaged, or unregistered. Serving all Ipswich suburbs.",
    excerpt:
      "Want to sell your car in Ipswich without the hassle of private listings? Here's how cash for cars works across the Ipswich region and what to expect.",
    content: [
      "Ipswich sits at the western gateway of Greater Brisbane, and it's home to some of the most diverse vehicle stock in South East Queensland. From tradies upgrading their work utes in Yamanto to families parting with a second car in Springfield, there's always someone in Ipswich looking to sell a vehicle quickly. Cash for cars in Ipswich gives you a way to do exactly that — no ads, no tyre-kickers, and no weeks of waiting.",

      "The process is simple. You share a few details about your vehicle — the make, model, year, and its general condition — and you receive a firm quote within minutes. If the offer works for you, a tow truck is dispatched to your location, usually on the same day. The driver confirms the vehicle matches your description, you sign the transfer paperwork, and you're handed cash on the spot. Start to finish, most Ipswich pickups take less than two hours from the initial call.",

      "One question Ipswich sellers often ask is whether the vehicle needs to be registered. The short answer is no. Cash-for-cars buyers purchase vehicles in any condition: unregistered, deregistered, mechanically failed, accident-damaged, even flood-affected. Ipswich and its low-lying suburbs around the Bremer River — Bundamba, Riverview, and North Ipswich — have experienced significant flooding in recent years. If a flood left your car waterlogged and you've been putting off dealing with it, a cash buyer will still make an offer based on its salvageable parts and scrap metal weight.",

      "What kind of money can you expect? Prices for cash for cars in Ipswich typically range from $200 for a stripped or severely damaged shell up to $9,999 for a complete, running vehicle in decent shape. Most cars fall somewhere in between. A non-running Commodore with a seized engine might fetch $400 to $800, while a ten-year-old Mazda 3 that still drives could bring $2,000 to $4,500 depending on kilometres and condition. Heavier vehicles like utes and 4WDs generally attract higher offers because they contain more recyclable steel and their parts are in strong demand.",

      "Free towing is included across the entire Ipswich City Council area. Whether your car is parked at a house in Booval, a unit block in Goodna, a rural property in Rosewood, or a workshop in Redbank Plains, the tow truck comes to you at no charge. You don't need to organise or pay for transport — it's all part of the service.",

      "Paperwork is straightforward. You'll need a valid photo ID (driver's licence or passport) and ideally your registration certificate. The buyer will help you complete the transfer documentation and ensure the Department of Transport and Main Roads (TMR) is notified of the disposal. Remember to remove your number plates before handover — in Queensland, plates belong to the owner, not the vehicle. You can return them to TMR or transfer them to another car.",

      "Ipswich has a strong industrial and working-class heritage, which means there are plenty of older, high-mileage vehicles in the region. Cars that have spent years commuting along the Warrego Highway or Cunningham Highway tend to rack up kilometres fast. Once they hit 250,000 or 300,000 km, repair costs start climbing and resale value drops sharply. That's the sweet spot for a cash-for-cars sale — you avoid pouring money into a vehicle that's worth less than the repair bill.",

      "Selling privately in Ipswich is always an option, but it comes with trade-offs. You'll need to arrange a safety certificate, write a listing, field enquiries, manage test drives, and negotiate a price. For a newer, clean car, the extra effort can pay off. But for anything older than ten years, damaged, unregistered, or non-running, the private market is thin. Buyers on Gumtree and Facebook Marketplace will lowball you or simply not show up. A cash-for-cars service removes all of that friction.",

      "Timing matters. Scrap metal prices shift with global markets, and the value of recyclable steel directly influences what a buyer can offer for end-of-life vehicles. In early 2026, scrap steel prices in Queensland have remained stable, so offers are holding well. If you've been sitting on an old car, acting now locks in today's rate rather than gambling on future fluctuations.",

      "A few practical tips for Ipswich sellers. Be honest about the car's condition when requesting a quote — surprises at pickup lead to revised offers, which wastes everyone's time. Have your paperwork and ID ready before the driver arrives. If you have more than one vehicle to sell, mention it upfront — bulk pickups often attract a better per-car rate. And if access is tricky (steep driveway, narrow street, car stuck on grass), let the buyer know so they send the right truck.",

      "Getting cash for cars in Ipswich is one of the fastest ways to clear an unwanted vehicle and put money back in your pocket. No listing fees, no weekends spent showing the car to strangers, and no mechanical repairs needed. Whether your car is in Springfield Lakes, Brassall, Karalee, or anywhere else in the Ipswich region, a single phone call is all it takes to get the process started.",
    ],
    date: "2026-04-04",
    category: "Guides",
  },
  {
    slug: "cash-for-cars-logan-brisbane",
    title: "Cash for Cars Logan: Get Paid Today (2026)",
    metaDescription:
      "Get cash for cars in Logan, Brisbane. Same-day pickup and payment for any vehicle — running or not. Free towing across Logan City and surrounds.",
    excerpt:
      "Living in Logan and want to sell your car fast? Here's how cash for cars works in the Logan area, what your vehicle is worth, and how to get paid today.",
    content: [
      "Logan is one of the fastest-growing regions in South East Queensland, and with that growth comes a steady stream of cars reaching the end of their useful life. Whether you're in Springwood, Beenleigh, Marsden, Woodridge, or Browns Plains, getting cash for cars in Logan is straightforward — and you can usually have money in hand within a few hours of making a call.",

      "The process starts with a quote. You provide basic details about your vehicle — make, model, year, and a quick description of its condition. Is it running? Any major damage? Is it registered? Based on that information, a cash-for-cars buyer will give you a firm offer over the phone or online. There's no obligation to accept, and the whole conversation takes about five minutes.",

      "One of the biggest advantages of selling to a cash buyer in Logan is speed. Private sales can drag on for weeks, especially for older or damaged vehicles. You have to write ads, deal with no-shows, and haggle with buyers who always want to knock down the price. A cash-for-cars service skips all of that. Once you accept a quote, pickup is typically arranged for the same day or the next morning.",

      "So what kind of cars do Logan sellers typically offload? The mix is wide. We see plenty of Holden Commodores and Ford Falcons that have done 300,000-plus kilometres on the Pacific Motorway. There are flood-affected vehicles from low-lying suburbs like Kingston and Loganholme, where summer storms can leave cars waterlogged. And there are everyday runabouts — Corollas, Mazda 3s, Hyundai i30s — that have simply reached the point where repairs cost more than the car is worth.",

      "Prices for cash for cars in Logan generally range from $200 for a complete scrap vehicle up to $9,999 for a running car in reasonable condition. The main factors that determine your offer are the vehicle's weight (heavier cars contain more recyclable metal), the demand for its parts, and whether it still drives. A non-running Toyota HiLux, for example, can still fetch a strong price because HiLux parts are always in demand across Queensland.",

      "Free towing is standard across the entire Logan City Council area. That means whether your car is parked in a driveway in Crestmead, sitting on a nature strip in Shailer Park, or tucked behind a shed in Jimboomba, the buyer sends a tow truck at no cost to you. You don't need to worry about organising transport or paying for a flatbed — it's all included in the service.",

      "What about paperwork? In Queensland, you need to notify the Department of Transport and Main Roads (TMR) when you dispose of a vehicle. A reputable cash-for-cars buyer handles most of this for you. You'll need to bring valid photo ID and sign the transfer documents. If the car is still registered, remember to remove your number plates — they belong to you, not the vehicle. You can return them to TMR or transfer them to another car.",

      "Logan residents sometimes ask whether it's better to sell privately or go the cash-for-cars route. The honest answer depends on the car. If you have a clean, registered vehicle under ten years old with no major issues, you'll likely get more selling privately — but it takes time and effort. For anything older, damaged, unregistered, or non-running, a cash buyer will almost certainly give you a better result than a dealership trade-in, and you avoid the hassle of listing and negotiating.",

      "Timing can affect your payout, too. Scrap metal prices fluctuate throughout the year based on global demand. In early 2026, steel prices in Australia have been steady, which means scrap car values are holding well. If you've been thinking about selling, the current market is a reasonable time to act rather than waiting for prices to potentially drop.",

      "A few tips to get the best price in Logan. First, be upfront about the car's condition — mentioning damage or mechanical issues early avoids surprises at pickup and keeps the process smooth. Second, have your paperwork sorted before the driver arrives. Third, if you have multiple vehicles to sell (it's more common than you'd think), mention it when you call — buyers often offer a better per-car rate for bulk pickups.",

      "Getting cash for cars in Logan doesn't have to be complicated. The whole process — from first call to cash in hand — typically takes under two hours. No ads to write, no strangers test-driving your car, no weekends wasted waiting for buyers who never show up. If your car is costing you more to keep than it's worth, a quick phone call is the fastest way to turn it into cash today.",
    ],
    date: "2026-04-03",
    category: "Guides",
  },
  {
    slug: "how-to-transfer-car-ownership-qld",
    title: "How to Transfer Car Ownership in QLD (2026)",
    metaDescription:
      "Step-by-step guide to transferring car ownership in Queensland. Learn what forms, fees, and documents you need when selling or buying a vehicle in Brisbane.",
    excerpt:
      "Transferring car ownership in Queensland is straightforward once you know the steps. Here's exactly what buyers and sellers need to do to stay legal.",
    content: [
      "Whether you're selling your car privately, through a dealer, or to a cash-for-cars buyer in Brisbane, you need to transfer ownership properly. Getting it wrong can leave you liable for fines, tolls, or even accidents after the car has left your hands. Here's how to handle it correctly in Queensland.",
      "The key document is the vehicle's registration certificate — also called a Certificate of Registration. In QLD, the seller must complete the disposal section on the back of this certificate and submit it to the Department of Transport and Main Roads (TMR) within 14 days of the sale. This step is non-negotiable. Until TMR updates their records, the car is still registered in your name.",
      "For the buyer, they need to complete a Transfer of Registration application (Form 18). This form is available at any TMR customer service centre or online. The buyer pays a transfer fee, which currently sits at around $37.85 for a standard vehicle, plus stamp duty based on the sale price or market value — whichever is higher. Stamp duty in Queensland is calculated at $3 per $100 of the dutiable value up to $100,000.",
      "If the car is sold with an active safety certificate (formerly known as a roadworthy certificate), the transfer is straightforward. Without one, the buyer will need to obtain a safety certificate before they can register the vehicle in their name. Safety certificates in Brisbane typically cost between $80 and $150 from an approved inspection station, though repairs to pass the inspection can add to that cost.",
      "Here's what the seller needs to provide: a signed transfer section on the registration certificate, a valid safety certificate (if the vehicle is being sold registered), and a receipt showing the agreed sale price. It's good practice to include the vehicle's VIN, make, model, year, and the odometer reading on the receipt. Both parties should keep a copy.",
      "Don't forget to notify your insurance company. Cancel or transfer your comprehensive or CTP insurance on the day of sale. If you forget, you could be paying premiums on a car you no longer own. In QLD, CTP insurance (also called a green slip) is included in your registration cost, so cancelling your rego will automatically end your CTP cover.",
      "One common mistake Brisbane sellers make is forgetting to cancel tolls and e-tag accounts linked to the vehicle. If the new owner racks up toll charges on the Gateway Motorway or Logan Motorway before you've updated your details with Linkt or another toll provider, those charges may land on your account. Remove the vehicle from your toll account on the day of sale.",
      "What if you've lost your registration certificate? You can apply for a replacement through TMR before the sale, or complete a statutory declaration confirming you are the registered owner. This adds a small delay, so sort it out early if you know your papers are missing.",
      "For cash-for-cars transactions, the process is simpler. Reputable buyers like Caraway handle much of the paperwork for you. When our team picks up your vehicle in Brisbane, we complete the transfer documentation on the spot and ensure TMR is notified. You still need to bring valid photo ID and sign the transfer forms, but the heavy lifting is done for you.",
      "If you're selling a written-off vehicle, there are extra rules. Statutory write-offs in Queensland cannot be re-registered — ever. Repairable write-offs can be re-registered, but only after passing a written-off vehicle inspection through TMR. Make sure you know which category your car falls into before listing it for sale.",
      "A few final tips to keep the transfer clean. Always conduct the sale during business hours so you can contact TMR if questions arise. Never hand over the keys before receiving full payment — in cash transactions, count the money before signing anything. And take a photo of the buyer's licence for your records, just in case.",
      "Transferring car ownership in QLD is not complicated, but skipping steps can create headaches weeks or months down the track. Whether you're selling a near-new sedan in Paddington or offloading a twenty-year-old ute in Logan, following this process protects both you and the buyer. If you'd rather skip the paperwork entirely, a cash-for-cars service handles it all — and you walk away with cash on the same day.",
    ],
    date: "2026-04-02",
    category: "Guides",
  },
  {
    slug: "how-much-is-my-car-worth-for-scrap-brisbane",
    title: "How Much Is My Car Worth for Scrap in Brisbane? (2025 Guide)",
    metaDescription:
      "Find out how much your scrap car is worth in Brisbane. We break down what affects scrap car prices in 2025, from metal weight to parts value, and how to get the best offer.",
    excerpt:
      "Wondering what your old car is actually worth as scrap? Brisbane scrap prices depend on several factors most sellers overlook. Here's what determines your payout.",
    content: [
      "If you have an old, damaged, or non-running car sitting in your driveway, one of the first questions you'll ask is: how much is it actually worth? The answer in Brisbane depends on a handful of factors that most sellers never think about.",
      "The biggest factor is weight. Scrap car prices in Brisbane are heavily influenced by the current price of steel and other metals. A typical sedan weighs between 1,200 and 1,800 kilograms. At current scrap metal rates, the raw metal in an average car is worth between $150 and $400. But that's only the starting point — the real value often comes from what's still usable inside.",
      "Salvageable parts can dramatically increase your car's value. An engine that still turns over, a working transmission, undamaged doors, headlights, or even a good set of alloy wheels can add hundreds of dollars to a scrap offer. Popular models like Toyota Corollas, Hiluxes, and Ford Rangers have high parts demand in Brisbane, which pushes their scrap value up even when the car itself is in poor condition.",
      "The make and model matter more than you'd expect. Japanese brands — Toyota, Honda, Mazda, Nissan — tend to fetch higher scrap prices because their parts are in constant demand from mechanics and panel shops across South East Queensland. European cars can go either way: some parts are valuable, but others are difficult to move.",
      "Age isn't always a dealbreaker. A 2005 car with a blown engine can be worth more than a 2015 car that's been in a major accident, simply because the older car may have more intact, sellable parts. It depends on the specific damage and what components survived.",
      "Condition categories and what they typically pay in Brisbane: Running and registered cars in average condition generally receive $1,000 to $9,999 depending on make, model, and age. Non-running cars with salvageable parts usually fetch $300 to $2,000. Complete scrap vehicles — no usable parts, just metal — typically bring $150 to $500 based on weight.",
      "Location within Brisbane also plays a small role. Most reputable cash-for-cars buyers offer free towing across the entire Greater Brisbane region, so your suburb shouldn't affect the price. However, if you're in a very remote area or the car is in a difficult access spot — think underground parking or a narrow laneway — mention it upfront so the buyer can send the right equipment.",
      "To get the best price for your scrap car in Brisbane, follow these steps. First, get at least two or three quotes. Prices vary between buyers, and having a competing offer gives you leverage. Second, be completely honest about the car's condition — surprises at pickup lead to renegotiation, which nobody enjoys. Third, have your ID and any registration documents ready to speed up the process.",
      "One common mistake is waiting too long. A car that sits unused loses value every month to rust, flat-spotted tyres, dead batteries, and rodent damage. If you've decided to sell, act sooner rather than later. The scrap metal market fluctuates, and today's price isn't guaranteed next month.",
      "The bottom line: most scrap cars in Brisbane are worth between $150 and $3,000, with the sweet spot for older but reasonably complete vehicles sitting around $500 to $1,500. The only way to know your specific car's value is to get a quote based on its actual make, model, year, and condition. A quick phone call or online form takes five minutes and costs nothing.",
    ],
    date: "2025-04-01",
    category: "Guides",
  },
  {
    slug: "how-to-sell-your-car-for-cash-brisbane",
    title: "How to Sell Your Car for Cash in Brisbane: A Complete Guide",
    metaDescription:
      "Learn how to sell your car for cash in Brisbane. From getting quotes to same-day pickup, here's everything you need to know about cash for cars services.",
    excerpt:
      "Selling a car privately can take weeks of listing, fielding calls, and negotiating. If you want a faster option, cash-for-cars services let you skip all of that.",
    content: [
      "Selling a car privately can take weeks of listing, fielding calls, and negotiating. If you want a faster option, cash-for-cars services let you skip all of that. Here's how the process works in Brisbane.",
      "First, get a quote. You can call or fill out an online form with your car's make, model, year, and condition. A reputable buyer will give you a price over the phone — no obligation.",
      "Second, schedule your pickup. Most services offer same-day or next-day collection across Greater Brisbane, including Logan, Ipswich, and Moreton Bay.",
      "Third, get paid on the spot. When the tow truck arrives, the driver inspects the car, confirms the quote, and hands you cash. No waiting for bank transfers.",
      "What about cars that don't run? Most cash-for-cars buyers accept vehicles in any condition — damaged, unregistered, written off, or simply old. Free towing is standard.",
      "How much will you get? Offers typically range from a few hundred dollars for scrap vehicles up to $9,999 for cars in good working order. The main factors are make, model, age, condition, and current scrap metal prices.",
      "To get the best price, have your registration papers ready, be honest about the car's condition, and compare quotes from at least two buyers before committing.",
    ],
    date: "2025-03-15",
    category: "Guides",
  },
  {
    slug: "what-happens-to-your-car-after-selling",
    title: "What Happens to Your Car After You Sell It for Cash?",
    metaDescription:
      "Ever wondered what happens to your car after a cash-for-cars buyer picks it up? Here's the journey from your driveway to recycling or resale.",
    excerpt:
      "Once the tow truck drives away with your old car, what happens next? The answer depends on the vehicle's condition.",
    content: [
      "Once the tow truck drives away with your old car, what happens next? The answer depends on the vehicle's condition.",
      "Cars in reasonable working order are often resold at auction or exported to markets where older models are still in demand. The buyer handles re-registration and any needed repairs.",
      "Vehicles that are damaged, written off, or too old to resell go to licensed auto recyclers. There, they're carefully dismantled. Usable parts — engines, transmissions, doors, mirrors — are cleaned, tested, and sold as second-hand spares.",
      "The remaining shell is crushed, shredded, and sorted. Steel, aluminium, copper, and other metals are separated and sent to smelters. Australia recycles roughly 90% of an end-of-life vehicle's metal content.",
      "Fluids like engine oil, coolant, and brake fluid are drained and either re-refined or disposed of according to EPA guidelines. Tyres are sent to specialist recyclers.",
      "So whether your car runs or not, selling it for cash means it gets a second life — as parts, raw materials, or both. It's a more responsible option than letting it rust in the yard.",
    ],
    date: "2025-02-28",
    category: "Insights",
  },
  {
    slug: "signs-your-car-is-worth-more-as-scrap",
    title: "5 Signs Your Car Is Worth More as Scrap Than a Trade-In",
    metaDescription:
      "Not sure whether to trade in or scrap your old car? Here are five signs that scrapping might get you a better deal.",
    excerpt:
      "Trade-ins seem convenient, but dealerships lowball older vehicles. Here are five signs you'd do better selling for scrap cash.",
    content: [
      "Trade-ins seem convenient, but dealerships lowball older vehicles because they can't resell them easily. Here are five signs you'd do better selling your car to a cash buyer.",
      "1. The repair costs exceed the car's value. If a mechanic quotes $3,000 to fix a car worth $2,500, it's time to sell as-is. Cash buyers factor in the scrap value of metals and parts, so you still get paid.",
      "2. It's been sitting unused for months. A car that's been parked for six months or more is losing value to rust, flat tyres, and battery decay. The longer you wait, the less it's worth.",
      "3. It failed the safety inspection. If your car can't pass a roadworthy certificate and the fixes are expensive, a cash-for-cars service is the simplest exit. No roadworthy required.",
      "4. The trade-in offer was insultingly low. Dealerships often offer $500 or less for older cars, then charge you fees on top. A direct cash buyer typically offers more because they recover value from parts and metal.",
      "5. You just want it gone today. Private sales take time — ads, tyre-kickers, test drives, negotiation. If speed matters, cash buyers pick up same day and pay on the spot.",
    ],
    date: "2025-02-10",
    category: "Tips",
  },
  {
    slug: "preparing-your-car-for-pickup",
    title: "How to Prepare Your Car for a Cash-for-Cars Pickup",
    metaDescription:
      "Getting your car ready for a cash-for-cars pickup? Follow these simple steps to make the process smooth and quick.",
    excerpt:
      "A little preparation before the tow truck arrives makes the pickup faster and ensures you don't leave personal items behind.",
    content: [
      "A little preparation before the tow truck arrives makes the pickup faster and ensures you don't leave personal items behind. Here's a quick checklist.",
      "Remove all personal belongings. Check the glove box, boot, under seats, door pockets, and sun visors. People commonly forget sunglasses, phone chargers, garage remotes, and toll tags.",
      "Gather your paperwork. Have your registration certificate or proof of ownership ready. If you've lost the papers, let the buyer know in advance — most can still proceed with valid ID.",
      "Remove your number plates. In Queensland, plates belong to the registered owner, not the vehicle. Take them off before the driver arrives, or ask for help on the day.",
      "Cancel your registration. Once the car is gone, notify the Department of Transport to cancel rego and get a refund on any unused portion.",
      "Ensure access for the tow truck. Clear the driveway or parking area so the truck can reach the car easily. If the car is in a tight spot, mention it when booking so the right equipment is sent.",
      "That's it — five simple steps. The whole pickup usually takes 15 to 30 minutes from arrival to payment.",
    ],
    date: "2025-01-20",
    category: "Guides",
  },
];

export const blogPosts: BlogPost[] = rawPosts.map((p) => ({
  ...p,
  readTime: calcReadTime(p.content),
}));
