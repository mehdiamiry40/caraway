import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  Banknote,
  Car,
  CarFront,
  CircleCheck,
  ClipboardList,
  CloudHail,
  FileCheck2,
  FileX2,
  MapPin,
  Recycle,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "cash-for-cars-brisbane": Banknote,
  "car-removal-brisbane": Truck,
  "sell-my-car-brisbane": CarFront,
  "scrap-car-removal-brisbane": Recycle,
  "damaged-cars-brisbane": Wrench,
  "unregistered-cars-brisbane": FileX2,
  "hail-damaged-cars-brisbane": CloudHail,
  "sell-toyota-hilux-brisbane": Car,
};

export function serviceIcon(slug: string): LucideIcon {
  return SERVICE_ICONS[slug] ?? CarFront;
}

/* First keyword match wins, so the more specific topics come first. */
const SECTION_ICON_RULES: [RegExp, LucideIcon][] = [
  [/document|paperwork|identity|authority|records|seller steps|finance/i, FileCheck2],
  [/payment|purchase/i, Banknote],
  [/offer|quote|price|affects|assess|determined/i, BadgeDollarSign],
  [/pickup|collection|removal|recovery|access/i, Truck],
  [/coverage|across|around/i, MapPin],
  [/damage|accident|flood|fire|hail|mechanical|work-worn|modification|trays/i, Wrench],
  [/insurance|safely/i, ShieldCheck],
  [/details|provide|include/i, ClipboardList],
];

export function sectionIcon(heading: string): LucideIcon {
  return SECTION_ICON_RULES.find(([pattern]) => pattern.test(heading))?.[1] ?? CircleCheck;
}
