#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const repoRoot = process.cwd();
const sourceRoot = join(repoRoot, "src");
const sourceExtensions = new Set([".ts", ".tsx"]);
const retiredBlogSlugs = new Set([
  "cash-for-cars-gold-coast",
  "cash-for-cars-ipswich-brisbane",
  "cash-for-cars-logan-brisbane",
  "cash-for-cars-redcliffe-brisbane",
  "cash-for-cars-sunshine-coast",
  "cash-for-cars-toowoomba",
  // August 2026: consolidated into /car-removal-brisbane.
  "free-car-removal-brisbane",
  // July 2026: suburb posts retired in favour of /locations/{suburb} pages.
  "cash-for-cars-beenleigh",
  "cash-for-cars-browns-plains",
  "cash-for-cars-bulimba",
  "cash-for-cars-caboolture-brisbane",
  "cash-for-cars-capalaba",
  "cash-for-cars-carindale",
  "cash-for-cars-chermside",
  "cash-for-cars-indooroopilly",
  "cash-for-cars-ipswich",
  "cash-for-cars-kenmore",
  "cash-for-cars-logan",
  "cash-for-cars-moorooka",
  "cash-for-cars-mount-gravatt",
  "cash-for-cars-north-lakes",
  "cash-for-cars-nundah",
  "cash-for-cars-redcliffe",
  "cash-for-cars-springwood",
  "cash-for-cars-stafford",
  "cash-for-cars-sunnybank",
  "cash-for-cars-toowong",
  "cash-for-cars-wynnum",
  // July 2026: duplicate of how-much-is-scrap-car-worth-brisbane.
  "how-much-is-my-car-worth-for-scrap-brisbane",
]);

/**
 * A blog post may never target the same "cash for cars {suburb}" query as a
 * /locations/{suburb} landing page — that cannibalizes the money page.
 * Suburb slugs are read from src/data/suburbs.ts so the guard tracks new
 * location pages automatically.
 */
const suburbSlugs = (() => {
  const suburbsSource = readFileSync(
    join(repoRoot, "src", "data", "suburbs.ts"),
    "utf8",
  );
  return new Set(
    [...suburbsSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]),
  );
})();

const retiredLocationSlugs = (() => {
  const consolidationSource = readFileSync(
    join(repoRoot, "src", "lib", "location-consolidation.ts"),
    "utf8",
  );
  const objectBody = consolidationSource.match(
    /RETIRED_LOCATION_DESTINATIONS\s*=\s*\{([\s\S]*?)\}\s*as const/,
  )?.[1];
  if (!objectBody) return new Set();

  return new Set(
    [...objectBody.matchAll(/^\s*(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*"\/locations/gm)]
      .map((match) => match[1] ?? match[2])
      .filter(Boolean),
  );
})();

const retiredServiceSlugs = (() => {
  const consolidationSource = readFileSync(
    join(repoRoot, "src", "lib", "service-consolidation.ts"),
    "utf8",
  );
  const objectBody = consolidationSource.match(
    /RETIRED_SERVICE_DESTINATIONS\s*=\s*\{([\s\S]*?)\}\s*as const/,
  )?.[1];
  if (!objectBody) return new Set();

  return new Set(
    [...objectBody.matchAll(/^\s*"([^"]+)":\s*"\//gm)].map(
      (match) => match[1],
    ),
  );
})();

const prohibitedClaims = [
  {
    label: "incorrect proprietary-company identity",
    pattern: /Caraway Pty Ltd/i,
  },
  {
    label: "unsupported named employee persona",
    pattern: /Sam Williams|Senior Buyer/i,
  },
  {
    label: "obsolete AUSTRAC motor-dealer cash threshold",
    pattern: /AUSTRAC/i,
  },
  {
    label: "blanket Queensland plate-ownership claim",
    pattern:
      /(?:number )?plates? (?:belong|belongs|stay|stays|remain|remains) (?:with|to) (?:you|the (?:registered )?(?:owner|operator))/i,
  },
  {
    label: "blanket instruction to remove Queensland plates",
    pattern:
      /(?:remov(?:e|ing)|tak(?:e|ing) off) (?:your |the )?(?:number )?plates? (?:before|when)|tak(?:e|ing) (?:your |the )?(?:number )?plates? off before/i,
  },
  {
    label: "unsupported motor-dealer licence claim",
    pattern:
      /fully licensed(?: and insured)?|our licensed driver|licensed (?:\[)?cash-for-cars buyer|licensed cash buyer|licensed buyer (?:gives|pays)|Caraway[^.\n]{0,120}licensed motor dealer/i,
  },
  {
    label: "unsupported blanket insurance claim",
    pattern:
      /fully insured|public liability and goods-in-transit cover on every pickup|all pickups are insured/i,
  },
  {
    label: "unsupported job-specific insurance confirmation",
    pattern: /insurance details applicable to (?:that|every|the) job/i,
  },
  {
    label: "unsupported universal vehicle acceptance",
    pattern: /all vehicles accepted|we buy cars in any condition/i,
  },
  {
    label: "unsupported fixed quote-response speed",
    pattern: /(?:real )?offer in under \d+ seconds/i,
  },
  {
    label: "unsupported claim that access cannot affect an offer",
    pattern: /access details (?:do not|don't) change the offer/i,
  },
  {
    label: "seller responsibility delegated entirely to buyer",
    pattern:
      /(?:buyer|we) (?:lodges?|files?|handles?|notifies?|completes?) (?:the )?(?:vehicle )?disposal notice|handle all (?:the )?(?:vehicle )?(?:transfer|deregistration|TMR) paperwork|disposal notice (?:with TMR )?on your behalf|(?:TMR|transfer|disposal|deregistration)[^.\n]{0,100}on your behalf|paperwork handled (?:by us|for you|directly with TMR|on the (?:spot|day))|TMR paperwork (?:handled|sorted)|ensure TMR is notified/i,
  },
  {
    label: "absolute roadworthy exemption",
    pattern:
      /No RWC is required at all|roadworthy certificate is not required to sell your vehicle to Caraway|\bno (?:RWC|roadworthy(?: certificate)?|safety certificate) (?:is )?(?:required|needed)\b/i,
  },
  {
    label: "invented cash-payment threshold",
    pattern:
      /(?:cash|bank transfer)[^.\n]{0,100}(?:under|over|above|below) \$?10,?000|\$?10,?000[^.\n]{0,100}(?:cash|bank transfer)/i,
  },
  {
    // Pickup timing must read as conditional (requirements.yaml). Qualified
    // forms like "same- or next-day pickup" and "same-day or next-day pickup"
    // do not match because another word sits between "same(-)day" and the noun.
    label: "unconditional same-day promise (use 'same- or next-day' or 'cash on pickup')",
    pattern:
      /same.day (?:car |scrap car |hilux )?(?:pickup|removal|collection|cash|payment|service|settlement)/i,
  },
];

const prohibitedLocationClaims = [
  {
    label: "unsupported location operating-history or reputation claim",
    pattern:
      /(?:serv(?:e|ed|ing)|collect(?:ed|ing)?)[^.\n]{0,80}for years|repeat customers?|repeat business|word-of-mouth|customer referrals?|hundreds of [^.\n]{0,80}(?:cars|vehicles|pickups)/i,
  },
  {
    label: "unsupported location fleet, depot, or route-frequency claim",
    pattern:
      /our depot|our tow trucks?|our drivers|we (?:regularly|routinely) (?:collect|buy|pick up)|(?:collect|pick up) [^.\n]{0,80}(?:every day|daily|multiple times a week)/i,
  },
  {
    label: "unsupported absolute location offer or pickup claim",
    pattern:
      /cash on the spot|instant cash|free towing regardless|no distance surcharge|same- or next-day (?:service|pickup) is standard/i,
  },
  {
    label: "illustrative vehicle must not be presented as a completed local job",
    pattern: /Example vehicles we buy|Example only/i,
  },
];

const prohibitedServiceClaims = [
  {
    label: "unsourced numerical service-page price claim",
    pattern: /\$\s*\d/,
  },
  {
    label: "unsupported service purchase-history or demand claim",
    pattern:
      /hundreds|every week|we (?:regularly|routinely) (?:buy|purchase|collect)|strongest? demand|highest demand/i,
  },
  {
    label: "unsupported owned fleet, driver, or facility claim",
    pattern: /our tow trucks?|our drivers|our fleet|our depot|our facilities/i,
  },
  {
    label: "unsupported absolute service scope claim",
    pattern:
      /we buy (?:them )?all|all makes (?:and|&) models|any condition|regardless of (?:age|condition|kilometres|generation)/i,
  },
  {
    label: "unsupported service timing or payment guarantee",
    pattern:
      /cash on the spot|instant cash|same- or next-day|same day or next day|before dinner|within (?:an? )?hours?/i,
  },
  {
    label: "unsupported downstream processing claim",
    pattern:
      /licensed recycling facilit|we drain|every vehicle we collect/i,
  },
];

const featuredServiceSupportPosts = new Set([
  "how-to-sell-your-car-for-cash-brisbane.ts",
  "how-to-get-the-best-cash-for-cars-price-brisbane.ts",
  "how-much-is-my-car-worth-brisbane.ts",
  "tow-truck-cost-brisbane.ts",
  "preparing-your-car-for-pickup.ts",
  "repair-or-sell-your-car-brisbane.ts",
  "sell-flood-damaged-car-brisbane.ts",
  "sell-high-kilometre-car-brisbane.ts",
  "sell-non-running-car-brisbane.ts",
  "sell-hail-damaged-car-brisbane.ts",
]);

const prohibitedSupportClaims = [
  {
    label: "featured service guide contains an unsourced vehicle price",
    pattern: /\$\s*\d/,
  },
  {
    label: "featured service guide contains an unsupported response or pickup time",
    pattern:
      /same-day offer|same or next day|same- or next-day|within minutes|within a day|\d+\s+to\s+\d+\s+minutes/i,
  },
  {
    label: "featured service guide presents pickup as universally free",
    pattern:
      /free (?:car removal|tow|towing|collection|pickup)|collect[^.\n]{0,80}for free/i,
  },
  {
    label: "featured service guide contains an unsourced percentage range",
    pattern: /\d+\s*(?:–|-|to)\s*\d+\s*%/i,
  },
  {
    label: "featured service guide presents universal vehicle acceptance",
    pattern: /purchase vehicles in any condition|we buy [^.\n]{0,80}any condition/i,
  },
  {
    label: "featured service guide overstates the 72-hour storage protection",
    pattern: /storage fees (?:cannot|can't) be charged for the first 72 hours/i,
  },
  {
    label: "featured service guide invents a universal scrap-price floor",
    pattern: /scrap (?:steel|metal) price[^.\n]{0,80}(?:sets?|creates?) the floor/i,
  },
  {
    label: "featured service guide contains an unsourced multi-thousand-dollar claim",
    pattern: /worth several thousand dollars/i,
  },
  {
    label: "featured service guide claims fuller details guarantee faster or firmer pricing",
    pattern: /buyers price faster and firmer/i,
  },
  {
    label: "featured service guide claims a cosmetic tidy-up raises the offer",
    pattern: /tidy-up pays for itself|genuinely nudge an offer up/i,
  },
  {
    label: "featured service guide claims seasonal buyer generosity",
    pattern: /busier buyer is often a more generous one/i,
  },
  {
    label: "featured service guide claims completeness always raises value",
    pattern: /complete car is worth more/i,
  },
];

const regulatedPosts = new Set([
  "cancel-rego-after-selling-car-qld.ts",
  "how-much-is-my-car-worth-brisbane.ts",
  "how-to-cancel-car-rego-qld.ts",
  "how-to-sell-your-car-for-cash-brisbane.ts",
  "how-to-sell-a-car-with-finance-owing-qld.ts",
  "how-to-transfer-car-ownership-qld.ts",
  "number-plates-when-selling-car-qld.ts",
  "sell-car-not-in-my-name-qld.ts",
  "sell-car-without-roadworthy-qld.ts",
  "take-car-to-tip-brisbane.ts",
  "tow-truck-cost-brisbane.ts",
  "what-paperwork-to-sell-a-car-qld.ts",
  "wovr-written-off-vehicle-register-qld-guide.ts",
]);

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

const violations = [];

for (const slug of suburbSlugs) {
  if (retiredLocationSlugs.has(slug)) {
    violations.push({
      file: "src/data/suburbs.ts",
      line: 1,
      label: `retired location slug must stay redirected: ${slug}`,
    });
  }
}

const serviceSource = readFileSync(
  join(repoRoot, "src", "data", "services.ts"),
  "utf8",
);
const liveServiceSlugs = new Set(
  [...serviceSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]),
);
for (const slug of retiredServiceSlugs) {
  if (liveServiceSlugs.has(slug)) {
    violations.push({
      file: "src/data/services.ts",
      line: 1,
      label: `retired service slug must stay redirected: ${slug}`,
    });
  }
}

for (const filePath of collectSourceFiles(sourceRoot)) {
  const source = readFileSync(filePath, "utf8");
  const lines = source.split("\n");
  const relativePath = relative(repoRoot, filePath);

  if (relativePath.startsWith("src/content/blog/posts/")) {
    const slugMatch = source.match(/\bslug:\s*"([^"]+)"/);
    const slug = slugMatch?.[1];
    if (slug && retiredBlogSlugs.has(slug)) {
      violations.push({
        file: relativePath,
        line: lines.findIndex((line) => /\bslug:\s*"/.test(line)) + 1,
        label: "retired blog slug must stay redirected, not republished",
      });
    }
    const suburbCollision =
      slug?.match(/^cash-for-cars-(.+?)(?:-brisbane)?$/)?.[1];
    if (suburbCollision && suburbSlugs.has(suburbCollision)) {
      violations.push({
        file: relativePath,
        line: lines.findIndex((line) => /\bslug:\s*"/.test(line)) + 1,
        label: `blog slug cannibalizes /locations/${suburbCollision} — cover the suburb on its location page instead`,
      });
    }
  }

  for (const [index, line] of lines.entries()) {
    for (const claim of prohibitedClaims) {
      if (claim.pattern.test(line)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          label: claim.label,
        });
      }
    }

    if (relativePath === "src/data/suburbs.ts") {
      for (const claim of prohibitedLocationClaims) {
        if (claim.pattern.test(line)) {
          violations.push({
            file: relativePath,
            line: index + 1,
            label: claim.label,
          });
        }
      }
    }

    if (relativePath === "src/data/services.ts") {
      for (const claim of prohibitedServiceClaims) {
        if (claim.pattern.test(line)) {
          violations.push({
            file: relativePath,
            line: index + 1,
            label: claim.label,
          });
        }
      }
    }
  }

  const fileName = filePath.split("/").at(-1);
  if (fileName && featuredServiceSupportPosts.has(fileName)) {
    for (const [index, line] of lines.entries()) {
      for (const claim of prohibitedSupportClaims) {
        if (claim.pattern.test(line)) {
          violations.push({
            file: relativePath,
            line: index + 1,
            label: claim.label,
          });
        }
      }
    }
  }

  if (fileName && regulatedPosts.has(fileName)) {
    if (!/reviewedAt:\s*"\d{4}-\d{2}-\d{2}"/.test(source)) {
      violations.push({
        file: relativePath,
        line: 1,
        label: "regulated article missing reviewedAt metadata",
      });
    }
    if (
      !/sources:\s*\[/.test(source) ||
      !/https:\/\/(?:www\.)?(?:qld\.gov\.au|ppsr\.gov\.au)\//.test(source)
    ) {
      violations.push({
        file: relativePath,
        line: 1,
        label: "regulated article missing an official primary source",
      });
    }
  }
}

if (violations.length > 0) {
  console.error("Content integrity check failed:");
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} (${violation.label})`,
    );
  }
  process.exit(1);
}

console.log("Content integrity check passed.");
