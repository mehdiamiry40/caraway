import type { RawBlogPostEntry } from "../types";
import { BUSINESS } from "@/lib/site";

export const post: RawBlogPostEntry = {
  slug: "check-engine-light-brisbane",
  title: "Check Engine Light On? A Brisbane Seller's Guide",
  metaDescription:
    "Check engine light on and thinking of selling? Learn what a steady or flashing light means, how to read the code, and when a fix pays off.",
  excerpt:
    "An amber engine symbol can mean a loose fuel cap or a failing catalytic converter. Read the fault code first, then decide whether a repair adds more to the car than it costs.",
  author: "Caraway",
  content: [
    "When the check engine light comes on, the first thing to note is whether it is steady or flashing. A steady light means the engine computer has stored a fault code and wants it looked at soon. A flashing light usually means a severe misfire, where unburnt fuel can overheat and damage the catalytic converter, so ease off, avoid hard acceleration and get the car checked before driving much further. Neither tells you what the fault is or what it will cost. Only the code and a proper diagnosis do that.",

    "## What the Light Is Actually Telling You",

    "Most petrol cars built from the mid-2000s onwards have a standard OBD-II diagnostic port, usually under the dashboard near the driver's knees. The engine computer logs a code such as P0420 or P0301 when a sensor reading falls outside its expected range. The code points to a system, not a failed part. A misfire code on cylinder one could be a worn spark plug, a failing ignition coil or an injector problem, and a workshop needs to test which before replacing anything.",

    "Common causes run from trivial to expensive. A fuel cap that was not clicked shut after filling up at the servo can trigger an evaporative system code. Oxygen sensors, spark plugs and coils are routine wear items. Further up the scale sit catalytic converter efficiency faults, vacuum leaks, EGR valve problems and, on some diesels, a clogged diesel particulate filter.",

    "That last one is worth knowing about in Brisbane. A diesel ute or SUV that spends its life on short trips, crawling along Coronation Drive or the Ipswich Motorway at peak hour, may never get hot enough for long enough to burn off the soot in its filter. A warning light and reduced power can follow. Sometimes a sustained highway drive at steady speed, such as a run up the Bruce Highway, lets the filter clean itself, but follow the owner's manual and get it checked if the light stays on.",

    "## Reading the Code Before You Decide",

    "You can buy an inexpensive OBD-II scanner or a Bluetooth reader that pairs with a phone app, and some auto parts stores will read codes for you. That gives you a starting point, but treat it as a clue. For a fault that could be costly, pay a workshop for a diagnostic check and ask for the codes, the test results and the recommended repair in writing.",

    "Resist clearing the code to get the check engine light off before a sale. If the fault is still there, the light will usually come back within a few drives. A scan tool can also show that the car's readiness monitors have been recently reset, which tells any careful buyer or inspector that codes were cleared. A sale built on a hidden fault is the kind that ends in an argument afterwards, and our [private sale refund guide](/blog/private-car-sale-refund-qld) explains how those disputes tend to play out.",

    "## Check Engine Light Faults: Repair or Sell?",

    "Once you know the fault, compare the written quote with what the car is worth. A sensor, plug or coil replacement is usually modest and worth doing before a private sale, because a lit check engine light puts off buyers out of proportion to a cheap fix. A replacement catalytic converter, a DPF clean or replacement, or an internal engine fault is a different conversation, particularly on an older car with high kilometres. If the engine light is one of several problems, such as a slipping gearbox or a suspected [blown head gasket](/blog/blown-head-gasket-brisbane), add the quotes together before deciding. Our [repair-or-sell decision guide](/blog/repair-or-sell-your-car-brisbane) sets out how to weigh those numbers.",

    "The engine light is not the only warning lamp on the dash. Lights for safety systems such as airbags and ABS are separate, and if you plan to get a safety certificate, raise any lit warning lamp with the approved inspection station before you book. Our guide to [selling without a roadworthy](/blog/sell-car-without-roadworthy-qld) covers the options if you would rather not fix the car first.",

    "## Selling a Car With the Light On",

    "Disclose the light, the codes and any workshop findings in the listing or when you ask for quotes. Trade buyers price a known, documented fault far more accurately than an unexplained one, and a written diagnosis often narrows the gap between your expectation and their offer. Note whether the car starts, drives, idles smoothly and has gone into limp mode, because that shapes how it will be moved.",

    `Caraway assesses cars with engine warning lights and other mechanical faults within its confirmed Greater Brisbane service area. Send the make, model, year, kilometres and the fault codes or workshop report through the [damaged cars Brisbane](/damaged-cars-brisbane) page or a [sell my car Brisbane](/sell-my-car-brisbane) quote request, or call **${BUSINESS.phoneDisplay}**. [Pickup is included](/car-removal-brisbane) when Caraway buys and the vehicle and access match the supplied details.`,
  ],
  faqs: [
    {
      question: "Can I keep driving with the check engine light on?",
      answer:
        "With a steady light and no other symptoms, many cars can be driven carefully to a workshop. If the light is flashing, the engine is running roughly, the temperature gauge is rising or the car has gone into limp mode, stop driving and get it checked.",
    },
    {
      question: "Will disconnecting the battery fix the engine light?",
      answer:
        "It may clear the light temporarily on some cars, but it does not fix the fault. If the problem remains, the light usually returns, and the cleared readiness monitors can show a scan tool that the codes were recently reset.",
    },
    {
      question: "Does a check engine light stop me selling my car?",
      answer:
        "No. It affects the price and the type of buyer. Disclose the light, share the fault codes and any written diagnosis, and expect buyers to factor the likely repair into their offer.",
    },
  ],
  date: "2026-10-02",
  category: "Guides",
  relatedServices: [
    "damaged-cars-brisbane",
    "sell-my-car-brisbane",
    "car-removal-brisbane",
  ],
  relatedSuburbs: ["chermside", "springwood", "ipswich"],
};
