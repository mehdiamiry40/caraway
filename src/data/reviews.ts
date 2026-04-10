export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  car: string;
  /** ISO date (YYYY-MM-DD) the review was published. */
  date: string;
}

export const reviews: Review[] = [
  {
    name: "Jason M.",
    location: "Chermside",
    rating: 5,
    text: "Dead Commodore in the carport — they quoted over the phone and stuck to it at pickup. Cash before the truck left.",
    car: "2009 Holden Commodore",
    date: "2025-05-18",
  },
  {
    name: "Sarah K.",
    location: "Ipswich",
    rating: 5,
    text: "Written off in a bingle. Same-day pickup, no haggling on the day.",
    car: "2014 Toyota Camry",
    date: "2025-06-27",
  },
  {
    name: "Derek T.",
    location: "Capalaba",
    rating: 4,
    text: "Other place tried to chip the price when they arrived. These guys matched what they said. Took a star off because traffic made them 20 min late — still solid.",
    car: "2006 Ford Falcon",
    date: "2025-07-14",
  },
  {
    name: "Priya S.",
    location: "Sunnybank",
    rating: 5,
    text: "Scrap Mazda sitting a year. $950, gone in under an hour. Fine by me.",
    car: "2005 Mazda 3",
    date: "2025-08-05",
  },
  {
    name: "Michael B.",
    location: "North Lakes",
    rating: 5,
    text: "Couldn't move it privately. They did the transfer paperwork — I didn't have to queue at Transport.",
    car: "2011 Nissan Dualis",
    date: "2025-08-23",
  },
  {
    name: "Karen L.",
    location: "Logan Central",
    rating: 5,
    text: "Old Camry with a blown head gasket — quoted $650 on the phone, paid $650 at pickup. No runaround.",
    car: "2007 Toyota Camry",
    date: "2025-09-11",
  },
  {
    name: "Tran N.",
    location: "Toowong",
    rating: 5,
    text: "Uni finished, flying home. They came to my unit, paid cash, and sorted the paperwork same afternoon.",
    car: "2010 Honda Jazz",
    date: "2025-10-02",
  },
  {
    name: "Brett H.",
    location: "Caboolture",
    rating: 4,
    text: "Had two cars to get rid of on an acreage. They took both in one trip and gave a decent bulk rate. Knocked a star because I had to call back to confirm the time.",
    car: "1998 Toyota HiLux & 2004 Ford Falcon",
    date: "2025-10-29",
  },
  {
    name: "Angela R.",
    location: "Indooroopilly",
    rating: 5,
    text: "Inherited mum's car after she passed. They were respectful, handled everything quickly, and the price was fair.",
    car: "2008 Mazda 6",
    date: "2025-11-20",
  },
  {
    name: "Dave W.",
    location: "Moorooka",
    rating: 5,
    text: "Flood-damaged Lancer sitting in the carport for months. Called at 9am, cash in hand by 1pm. Easy.",
    car: "2012 Mitsubishi Lancer",
    date: "2025-12-08",
  },
  {
    name: "Rebecca O.",
    location: "Logan Central",
    rating: 5,
    text: "Pacific Mwy was chocka but the driver still rocked up inside the window. Old Territory gone and $1,100 in my hand. Zero drama.",
    car: "2006 Ford Territory",
    date: "2026-01-14",
  },
  {
    name: "Liam W.",
    location: "Toowong",
    rating: 5,
    text: "Parked the thing under a Queenslander on a crazy steep drive off Miskin St. Winched it out clean, no damage to the fence, paid me $480 cash. Properly impressed.",
    car: "2003 Mitsubishi Magna",
    date: "2026-01-29",
  },
  {
    name: "Amelia F.",
    location: "Caboolture",
    rating: 5,
    text: "Acreage out towards Wamuran, half-buried in grass. Two other mobs ghosted me. Caraway came out on a Saturday morning and paid fair for a rust-bucket Hilux.",
    car: "1995 Toyota HiLux",
    date: "2026-02-12",
  },
  {
    name: "Noah P.",
    location: "Indooroopilly",
    rating: 4,
    text: "Dead i30 blocking the carport under our unit block. They coordinated with the body corp rep, got in, got out. Only knock is the morning quote took a couple of hours to come back.",
    car: "2009 Hyundai i30",
    date: "2026-02-28",
  },
  {
    name: "Isabelle R.",
    location: "Moorooka",
    rating: 5,
    text: "Sold mum's old Corolla after she moved into a home. The bloke was kind, explained the transfer paperwork clearly, and the price was better than the wreckers down Ipswich Rd offered.",
    car: "2002 Toyota Corolla",
    date: "2026-03-17",
  },
];
