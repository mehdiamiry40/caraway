/** Popular car makes and their models for the Australian market. */

export const POPULAR_MAKES = [
  "Toyota",
  "Mazda",
  "Hyundai",
  "Kia",
  "Honda",
  "Ford",
  "Holden",
  "Mitsubishi",
  "Nissan",
  "Subaru",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Suzuki",
  "Isuzu",
  "Jeep",
  "Audi",
  "Volvo",
  "Lexus",
  "Other",
] as const;

export const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: [
    "Corolla", "Camry", "Hilux", "RAV4", "LandCruiser", "Yaris",
    "Prado", "Kluger", "86", "Supra", "Aurion", "Fortuner",
    "C-HR", "Echo", "Avalon", "Tarago",
  ],
  Mazda: [
    "2", "3", "6", "CX-3", "CX-5", "CX-8", "CX-9",
    "CX-30", "CX-60", "BT-50", "MX-5",
  ],
  Hyundai: [
    "i30", "Tucson", "Kona", "Santa Fe", "Accent", "Elantra",
    "Sonata", "Venue", "Getz", "ix35", "iMax", "iLoad",
  ],
  Kia: [
    "Cerato", "Sportage", "Seltos", "Carnival", "Sorento",
    "Stinger", "Rio", "Picanto", "Soul", "Stonic",
  ],
  Honda: [
    "Civic", "Accord", "HR-V", "CR-V", "Jazz", "City",
    "Odyssey", "CRX", "S2000", "Integra",
  ],
  Ford: [
    "Ranger", "Focus", "Fiesta", "Mustang", "Escape", "Everest",
    "Territory", "Falcon", "Mondeo", "EcoSport", "Endura",
  ],
  Holden: [
    "Commodore", "Astra", "Cruze", "Colorado", "Captiva",
    "Barina", "Trax", "Equinox", "Calais", "Statesman",
  ],
  Mitsubishi: [
    "Triton", "Outlander", "ASX", "Pajero", "Lancer",
    "Eclipse Cross", "Pajero Sport", "Mirage", "Express",
  ],
  Nissan: [
    "Navara", "X-Trail", "Qashqai", "Patrol", "Pathfinder",
    "Juke", "Pulsar", "Dualis", "Leaf", "370Z",
  ],
  Subaru: [
    "Outback", "Forester", "WRX", "Impreza", "XV",
    "Liberty", "BRZ", "Levorg",
  ],
  Volkswagen: [
    "Golf", "Polo", "Tiguan", "Amarok", "T-Roc",
    "T-Cross", "Passat", "Touareg", "Arteon",
  ],
  BMW: [
    "1 Series", "3 Series", "5 Series", "X1", "X3", "X5",
    "4 Series", "7 Series", "X7", "M3", "M4",
  ],
  "Mercedes-Benz": [
    "A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE",
    "CLA", "S-Class", "GLS", "AMG",
  ],
  Suzuki: [
    "Swift", "Jimny", "Vitara", "Baleno", "S-Cross",
    "Ignis", "Grand Vitara", "Liana", "Alto",
  ],
  Isuzu: ["D-Max", "MU-X"],
  Jeep: [
    "Wrangler", "Grand Cherokee", "Cherokee", "Compass",
    "Renegade", "Gladiator",
  ],
  Audi: [
    "A3", "A4", "A5", "Q3", "Q5", "Q7",
    "A1", "A6", "Q2", "Q8", "TT",
  ],
  Volvo: [
    "XC40", "XC60", "XC90", "S60", "V40",
    "V60", "S90", "C30",
  ],
  Lexus: [
    "IS", "RX", "NX", "UX", "ES",
    "GS", "LS", "LX", "CT",
  ],
};

/** Build Select-compatible options from a make, appending "Other". */
export function getModelOptions(make: string): { value: string; label: string }[] {
  const models = MODELS_BY_MAKE[make];
  if (!models) return [{ value: "Other", label: "Other" }];
  return [
    ...models.map((m) => ({ value: m, label: m })),
    { value: "Other", label: "Other" },
  ];
}

/** Build Select-compatible options for makes. */
export const MAKE_OPTIONS: { value: string; label: string }[] = POPULAR_MAKES.map(
  (m) => ({ value: m, label: m }),
);

/** Build Select-compatible year options from current year + 1 down to 1950. */
export function getYearOptions(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = currentYear + 1; y >= 1950; y--) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

export const YEAR_OPTIONS = getYearOptions();
