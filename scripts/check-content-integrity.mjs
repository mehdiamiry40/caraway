#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const repoRoot = process.cwd();
const sourceRoot = join(repoRoot, "src");
const sourceExtensions = new Set([".ts", ".tsx"]);

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
      /(?:remove|take off) (?:your |the )?(?:number )?plates? (?:before|when)|take (?:your |the )?(?:number )?plates? off before/i,
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
];

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

const violations = [];

for (const filePath of collectSourceFiles(sourceRoot)) {
  const lines = readFileSync(filePath, "utf8").split("\n");
  for (const [index, line] of lines.entries()) {
    for (const claim of prohibitedClaims) {
      if (claim.pattern.test(line)) {
        violations.push({
          file: relative(repoRoot, filePath),
          line: index + 1,
          label: claim.label,
        });
      }
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
