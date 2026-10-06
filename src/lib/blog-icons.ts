import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BookOpen,
  CloudHail,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

/* First keyword match on the post title wins. */
const BLOG_ICON_RULES: [RegExp, LucideIcon][] = [
  [/scam|safe|privacy|personal data|insurance/i, ShieldCheck],
  [/hail|flood|storm/i, CloudHail],
  [/damage|accident|leak|engine|gearbox|defect|write-off|written.off|repair|fail/i, Wrench],
  [/rego|registration|paperwork|transfer|plates|licen|toll|record|notice/i, FileCheck2],
  [/tow|pickup|pick up|removal|collect/i, Truck],
  [/price|worth|value|cash|pay|finance|quote|offer|cost/i, Banknote],
  [/key|keys|sell|selling/i, KeyRound],
];

export function blogIcon(title: string): LucideIcon {
  return BLOG_ICON_RULES.find(([pattern]) => pattern.test(title))?.[1] ?? BookOpen;
}
