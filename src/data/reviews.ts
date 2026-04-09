export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  car: string;
}

export const reviews: Review[] = [
  {
    name: "Jason M.",
    location: "Chermside",
    rating: 5,
    text: "Dead Commodore in the carport — they quoted over the phone and stuck to it at pickup. Cash before the truck left.",
    car: "2009 Holden Commodore",
  },
  {
    name: "Sarah K.",
    location: "Ipswich",
    rating: 5,
    text: "Written off in a bingle. Same-day pickup, no haggling on the day.",
    car: "2014 Toyota Camry",
  },
  {
    name: "Derek T.",
    location: "Capalaba",
    rating: 4,
    text: "Other place tried to chip the price when they arrived. These guys matched what they said. Took a star off because traffic made them 20 min late — still solid.",
    car: "2006 Ford Falcon",
  },
  {
    name: "Priya S.",
    location: "Sunnybank",
    rating: 5,
    text: "Scrap Mazda sitting a year. $950, gone in under an hour. Fine by me.",
    car: "2005 Mazda 3",
  },
  {
    name: "Michael B.",
    location: "North Lakes",
    rating: 5,
    text: "Couldn't move it privately. They did the transfer paperwork — I didn't have to queue at Transport.",
    car: "2011 Nissan Dualis",
  },
  {
    name: "Karen L.",
    location: "Logan Central",
    rating: 5,
    text: "Old Camry with a blown head gasket — quoted $650 on the phone, paid $650 at pickup. No runaround.",
    car: "2007 Toyota Camry",
  },
  {
    name: "Tran N.",
    location: "Toowong",
    rating: 5,
    text: "Uni finished, flying home. They came to my unit, paid cash, and sorted the paperwork same afternoon.",
    car: "2010 Honda Jazz",
  },
  {
    name: "Brett H.",
    location: "Caboolture",
    rating: 4,
    text: "Had two cars to get rid of on an acreage. They took both in one trip and gave a decent bulk rate. Knocked a star because I had to call back to confirm the time.",
    car: "1998 Toyota HiLux & 2004 Ford Falcon",
  },
  {
    name: "Angela R.",
    location: "Indooroopilly",
    rating: 5,
    text: "Inherited mum's car after she passed. They were respectful, handled everything quickly, and the price was fair.",
    car: "2008 Mazda 6",
  },
  {
    name: "Dave W.",
    location: "Moorooka",
    rating: 5,
    text: "Flood-damaged Lancer sitting in the carport for months. Called at 9am, cash in hand by 1pm. Easy.",
    car: "2012 Mitsubishi Lancer",
  },
];
