import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/og.js";

const ROOT = process.cwd();
const packageJson = JSON.parse(
  await readFile(path.join(ROOT, "package.json"), "utf8"),
);
if (packageJson.name !== "caraway") {
  throw new Error("Run this script from the Caraway repository root.");
}

const data = JSON.parse(
  await readFile(
    path.join(ROOT, "src/data/queensland-vehicle-data.json"),
    "utf8",
  ),
);
const first = data.fuelTrend.rows[0];
const latest = data.fuelTrend.rows.at(-1);
const facts = {
  startYear: first.year,
  endYear: latest.year,
  fuelLabels: data.fuelTrend.fuelTypes.length,
  electricStart: first.registrations.Electric,
  electricEnd: latest.registrations.Electric,
  petrolElectricStart: first.registrations["Petrol/Electric"],
  petrolElectricEnd: latest.registrations["Petrol/Electric"],
  snapshotDate: data.brisbaneSnapshot.snapshotDate,
  brisbaneRows: data.brisbaneSnapshot.rows.length,
};
const expectedFacts = {
  startYear: 2006,
  endYear: 2024,
  fuelLabels: 11,
  electricStart: 1,
  electricEnd: 44398,
  petrolElectricStart: 102,
  petrolElectricEnd: 110604,
  snapshotDate: "2022-10-10",
  brisbaneRows: 186,
};
if (JSON.stringify(facts) !== JSON.stringify(expectedFacts)) {
  throw new Error(`Vehicle-data image facts changed: ${JSON.stringify(facts)}`);
}

const provenance = {
  license: data.license,
  licenseUrl: data.licenseUrl,
  fuelOwner: data.fuelTrend.source.owner,
  fuelLicense: data.fuelTrend.source.license,
  fuelLicenseUrl: data.fuelTrend.source.licenseUrl,
  fuelSourceSha256: data.fuelTrend.source.sourceSha256,
  registrationsTitle: data.brisbaneSnapshot.sources.registrations.title,
  registrationsLicense: data.brisbaneSnapshot.sources.registrations.license,
  boundariesTitle: data.brisbaneSnapshot.sources.boundaries.title,
  boundariesLicense: data.brisbaneSnapshot.sources.boundaries.license,
  boundariesAttribution:
    data.brisbaneSnapshot.sources.boundaries.attribution,
  postcodeTitle: data.brisbaneSnapshot.sources.postcodeReference.title,
  postcodeLicense: data.brisbaneSnapshot.sources.postcodeReference.license,
  postcodeAttribution:
    data.brisbaneSnapshot.sources.postcodeReference.attribution,
  localityTitle:
    data.brisbaneSnapshot.sources.administrativeBoundaries.title,
  localityLicense:
    data.brisbaneSnapshot.sources.administrativeBoundaries.license,
  localityAttribution:
    data.brisbaneSnapshot.sources.administrativeBoundaries.attribution,
};
const expectedProvenance = {
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  fuelOwner: "Queensland Department of Transport and Main Roads",
  fuelLicense: "CC BY 4.0",
  fuelLicenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  fuelSourceSha256:
    "94d012b8865e927c86dd36898f9abc9efa63765305d59b5331e85fb5fa6cfcbc",
  registrationsTitle: "Queensland TMR — Vehicle registrations, by suburb",
  registrationsLicense: "CC BY 4.0",
  boundariesTitle: "Brisbane City Council — Suburb Boundaries",
  boundariesLicense: "CC BY 4.0",
  boundariesAttribution:
    "© Brisbane City Council 2025 © State of Queensland (Department of Resources) 2025",
  postcodeTitle: "Brisbane City Council — Property Address locations",
  postcodeLicense: "CC BY 4.0",
  postcodeAttribution: "© Brisbane City Council 2026",
  localityTitle:
    "Queensland Government — Administrative Boundaries, Locality layer",
  localityLicense: "CC BY 4.0",
  localityAttribution:
    "© State of Queensland (Department of Natural Resources and Mines, Manufacturing and Regional and Rural Development) 2026",
};
if (JSON.stringify(provenance) !== JSON.stringify(expectedProvenance)) {
  throw new Error(
    `Vehicle-data image provenance changed: ${JSON.stringify(provenance)}`,
  );
}

// The repository carries these two unmodified Geist files with their SIL Open
// Font License 1.1 notice. Feed the pinned bytes to Next's WASM-backed
// ImageResponse renderer so output never depends on fonts or rasterisers
// installed on the host machine.
const fontInputs = [
  {
    file: "Geist-Regular.ttf",
    path: "scripts/assets/geist/Geist-Regular.ttf",
    weight: 400,
    sha256: "8177983fd81e22d440b343d931c508aa87eeb7a43907223b648e4c66214a3999",
  },
  {
    file: "Geist-Bold.ttf",
    path: "scripts/assets/geist/Geist-Bold.ttf",
    weight: 700,
    sha256: "45e6b30280949f1aa0208a4b05f47e1984719aba0b7fcc2bc993a15b9199f644",
  },
];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const fonts = [];
for (const input of fontInputs) {
  const bytes = await readFile(path.join(ROOT, input.path));
  const actualHash = sha256(bytes);
  if (actualHash !== input.sha256) {
    throw new Error(
      `${input.file} hash changed: expected ${input.sha256}, received ${actualHash}`,
    );
  }
  fonts.push({
    name: "CarawayGeist",
    data: bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ),
    weight: input.weight,
    style: "normal",
  });
}

const h = React.createElement;
const palette = {
  blue: "#2C5697",
  navy: "#1D3B63",
  teal: "#1B6974",
  lime: "#B5D145",
  ink: "#59636E",
  pale: "#EAF5FA",
  border: "#CBD8DE",
  footerText: "#E0E9F0",
};
const base = {
  display: "flex",
  position: "absolute",
  fontFamily: "CarawayGeist",
};
const text = (content, style) =>
  h("div", { style: { ...base, whiteSpace: "pre", ...style } }, content);
const box = (style, ...children) =>
  h("div", { style: { ...base, ...style } }, ...children);
const carIcon = (left, top, size) =>
  h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 44 44",
      style: { position: "absolute", left, top },
    },
    h("rect", { width: 44, height: 44, rx: 10, fill: palette.blue }),
    h("path", {
      d: "M10 27h24M14 27l4-10h9l7 10M15 31h18",
      stroke: "#FFFFFF",
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
    }),
    h("circle", { cx: 17, cy: 31, r: 2.5, fill: "#FFFFFF" }),
    h("circle", { cx: 31, cy: 31, r: 2.5, fill: "#FFFFFF" }),
  );

const format = new Intl.NumberFormat("en-AU");
const socialGraphic = box(
  {
    inset: 0,
    width: "100%",
    height: "100%",
    background: "#FFFFFF",
  },
  box({
    left: 0,
    top: 0,
    width: 1200,
    height: 9,
    backgroundImage:
      "linear-gradient(90deg, #B5D145 0%, #2D8795 50%, #2C5697 100%)",
  }),
  carIcon(56, 34, 44),
  text("CARAWAY", {
    left: 116,
    top: 40,
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 3,
    color: palette.blue,
  }),
  text("OPEN DATA RESOURCE", {
    left: 116,
    top: 70,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    color: palette.ink,
  }),
  text("QUEENSLAND · REGISTERED-CAR DATA", {
    left: 56,
    top: 122,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 2,
    color: palette.teal,
  }),
  text("Queensland cars", {
    left: 56,
    top: 163,
    fontSize: 56,
    fontWeight: 700,
    color: palette.blue,
  }),
  text("by fuel type", {
    left: 56,
    top: 221,
    fontSize: 56,
    fontWeight: 700,
    color: palette.blue,
  }),
  box(
    {
      left: 56,
      top: 292,
      width: 210,
      height: 54,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 27,
      background: palette.lime,
    },
    text(`${facts.startYear}–${facts.endYear}`, {
      position: "relative",
      fontSize: 31,
      fontWeight: 700,
      color: palette.navy,
    }),
  ),
  text(`19 years · ${facts.fuelLabels} official fuel labels`, {
    left: 56,
    top: 364,
    fontSize: 20,
    fontWeight: 700,
    color: palette.ink,
  }),
  box(
    {
      left: 56,
      top: 411,
      width: 466,
      height: 92,
      borderRadius: 9,
      border: "1px solid #D4D9DD",
      background: palette.pale,
    },
    text("REGISTRATION RECORDS", {
      left: 21,
      top: 16,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1.5,
      color: palette.navy,
    }),
    text("Not sales, market share, demand", {
      left: 21,
      top: 45,
      fontSize: 18,
      color: palette.ink,
    }),
    text("or vehicle removals.", {
      left: 21,
      top: 66,
      fontSize: 18,
      color: palette.ink,
    }),
  ),
  box(
    {
      left: 570,
      top: 112,
      width: 574,
      height: 397,
      borderRadius: 14,
      border: `2px solid ${palette.border}`,
      background: palette.pale,
    },
    text("REGISTERED-CAR RECORDS", {
      left: 31,
      top: 22,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1.5,
      color: palette.navy,
    }),
    box(
      {
        left: 31,
        top: 58,
        width: 510,
        height: 130,
        borderRadius: 10,
        background: "#FFFFFF",
      },
      box({
        left: 0,
        top: 0,
        width: 9,
        height: 130,
        borderRadius: 4,
        background: palette.blue,
      }),
      text("ELECTRIC", {
        left: 30,
        top: 22,
        fontSize: 18,
        fontWeight: 700,
        color: palette.navy,
      }),
      text(
        `${format.format(facts.electricStart)} → ${format.format(facts.electricEnd)}`,
        {
          left: 30,
          top: 55,
          fontSize: 46,
          fontWeight: 700,
          color: palette.blue,
        },
      ),
      text(`${facts.startYear} → ${facts.endYear}`, {
        left: 30,
        top: 105,
        fontSize: 15,
        fontWeight: 700,
        color: palette.ink,
      }),
    ),
    box(
      {
        left: 31,
        top: 213,
        width: 510,
        height: 130,
        borderRadius: 10,
        background: "#FFFFFF",
      },
      box({
        left: 0,
        top: 0,
        width: 9,
        height: 130,
        borderRadius: 4,
        background: palette.teal,
      }),
      text("PETROL/ELECTRIC", {
        left: 30,
        top: 22,
        fontSize: 18,
        fontWeight: 700,
        color: palette.navy,
      }),
      text(
        `${format.format(facts.petrolElectricStart)} → ${format.format(facts.petrolElectricEnd)}`,
        {
          left: 30,
          top: 55,
          fontSize: 46,
          fontWeight: 700,
          color: palette.teal,
        },
      ),
      text(`${facts.startYear} → ${facts.endYear}`, {
        left: 30,
        top: 105,
        fontSize: 15,
        fontWeight: 700,
        color: palette.ink,
      }),
    ),
  ),
  box({ left: 0, top: 536, width: 1200, height: 94, background: palette.navy }),
  text(
    "Vehicle data © The State of Queensland (TMR) · CC BY 4.0 · filtered and reshaped by Caraway",
    { left: 56, top: 557, fontSize: 15, color: palette.footerText },
  ),
  text("caraway.au/resources/queensland-vehicle-data", {
    left: 56,
    top: 585,
    fontSize: 16,
    fontWeight: 700,
    color: "#FFFFFF",
  }),
  text("Full sources, method and downloads", {
    right: 56,
    top: 587,
    fontSize: 13,
    color: "#C8D7E4",
  }),
);

const brisbaneGraphic = box(
  {
    inset: 0,
    width: "100%",
    height: "100%",
    background: "#FFFFFF",
  },
  box({
    left: 0,
    top: 0,
    width: 800,
    height: 12,
    backgroundImage:
      "linear-gradient(90deg, #B5D145 0%, #2D8795 50%, #2C5697 100%)",
  }),
  carIcon(54, 47, 52),
  text("CARAWAY", {
    left: 125,
    top: 53,
    fontSize: 29,
    fontWeight: 700,
    letterSpacing: 3,
    color: palette.blue,
  }),
  text("OPEN DATA REUSE", {
    left: 125,
    top: 86,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    color: palette.ink,
  }),
  box(
    {
      left: 54,
      top: 137,
      width: 692,
      height: 78,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      border: `1px solid ${palette.border}`,
      background: palette.pale,
    },
    text("HISTORICAL SNAPSHOT · NOT CURRENT", {
      left: 0,
      right: 0,
      top: 15,
      justifyContent: "center",
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: 1.7,
      color: palette.navy,
    }),
    text("10 OCTOBER 2022", {
      left: 0,
      right: 0,
      top: 44,
      justifyContent: "center",
      fontSize: 23,
      fontWeight: 700,
      color: palette.blue,
    }),
  ),
  text("Brisbane registered-vehicle", {
    left: 0,
    right: 0,
    top: 244,
    justifyContent: "center",
    fontSize: 39,
    fontWeight: 700,
    color: palette.blue,
  }),
  text("suburb snapshot", {
    left: 0,
    right: 0,
    top: 290,
    justifyContent: "center",
    fontSize: 39,
    fontWeight: 700,
    color: palette.blue,
  }),
  box(
    {
      left: 306,
      top: 343,
      width: 188,
      height: 188,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 94,
      background: palette.blue,
    },
    box(
      {
        position: "relative",
        width: 162,
        height: 162,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 81,
        background: "#FFFFFF",
      },
      text(String(facts.brisbaneRows), {
        position: "relative",
        fontSize: 84,
        fontWeight: 700,
        color: palette.blue,
      }),
    ),
  ),
  text("UNAMBIGUOUS ROWS", {
    left: 0,
    right: 0,
    top: 548,
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    color: palette.navy,
  }),
  text("suburb + postcode matches", {
    left: 0,
    right: 0,
    top: 578,
    justifyContent: "center",
    fontSize: 22,
    color: palette.ink,
  }),
  box(
    {
      left: 54,
      top: 613,
      width: 692,
      height: 74,
      borderRadius: 12,
      border: "1px solid #D4D9DD",
      background: "#F5F7F8",
    },
    text("Registration records—not owners, sales, prices", {
      left: 0,
      right: 0,
      top: 16,
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 700,
      color: palette.navy,
    }),
    text("or a current fleet estimate.", {
      left: 0,
      right: 0,
      top: 43,
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 700,
      color: palette.navy,
    }),
  ),
  box({ left: 0, top: 718, width: 800, height: 82, background: palette.navy }),
  text(
    "Vehicle data © State of Queensland · geography © BCC / State of Queensland",
    {
      left: 0,
      right: 0,
      top: 738,
      justifyContent: "center",
      fontSize: 14,
      color: palette.footerText,
    },
  ),
  text("CC BY 4.0 · adapted by Caraway · method and exclusions online", {
    left: 0,
    right: 0,
    top: 765,
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "#FFFFFF",
  }),
);

const outputs = [
  {
    file: "queensland-vehicle-data-open-data-v1.png",
    element: socialGraphic,
    width: 1200,
    height: 630,
    sha256: "52bf6fad057c766721a092736fcee682324501d0b765ba7c7785619215a6e424",
  },
  {
    file: "brisbane-registered-vehicle-snapshot-v1.png",
    element: brisbaneGraphic,
    width: 800,
    height: 800,
    sha256: "63a218ff9127e41e634a1b4eab9cd01768ea34062955478ad0c224aae9e767a9",
  },
];

const checkOnly = process.argv.includes("--check");
for (const output of outputs) {
  const response = new ImageResponse(output.element, {
    width: output.width,
    height: output.height,
    fonts,
  });
  const generated = Buffer.from(await response.arrayBuffer());
  const generatedHash = sha256(generated);
  if (generatedHash !== output.sha256) {
    throw new Error(
      `${output.file} immutable v1 hash changed: expected ${output.sha256}, received ${generatedHash}`,
    );
  }

  const destination = path.join(ROOT, "public/images", output.file);
  if (checkOnly) {
    const committed = await readFile(destination);
    if (sha256(committed) !== generatedHash) {
      throw new Error(`${output.file} does not match its deterministic render.`);
    }
  } else {
    await writeFile(destination, generated);
  }

  const size = (await stat(destination)).size;
  if (size >= 2_000_000) {
    throw new Error(`${output.file} exceeds the BCC 2 MB upload limit.`);
  }
  process.stdout.write(`${output.file}: ${size} bytes · sha256 ${generatedHash}\n`);
}
