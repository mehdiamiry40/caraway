import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUILD_SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIRECTORY = dirname(BUILD_SCRIPT_PATH);
const OUTPUT_ROOT_FLAG = "--output-root";
const ROOT = resolveOutputRoot();
await validateOutputRoot(ROOT);
const GENERATED_AT = "2026-08-13";
const RESOURCE_PAGE_URL = "https://caraway.au/resources/queensland-vehicle-data";
const YEARS = Array.from({ length: 19 }, (_, index) => String(2006 + index));

const SOE_RESOURCE_ID = "20c5c7c4-1a76-44b8-b3cb-ea4a37e57d28";
const SOE_DATA_URL =
  "https://www.data.qld.gov.au/dataset/294bb52d-f920-4855-a738-362ef5d1a6a8/resource/20c5c7c4-1a76-44b8-b3cb-ea4a37e57d28/archive/indicator-3-1-0-9-1.csv";
const SOE_PAGE_URL =
  "https://www.stateoftheenvironment.detsi.qld.gov.au/climate-change/indicators/number-of-registered-vehicles";

const TMR_PACKAGE_ID = "6632a3a0-8cb2-41b6-9435-50f762850d72";
const TMR_RESOURCE_ID = "9c479cfb-8c19-4759-ad34-bc3123079b94";
const TMR_PACKAGE_URL =
  "https://www.data.qld.gov.au/dataset/vehicle-registrations";
const TMR_DATA_URL =
  "https://www.data.qld.gov.au/dataset/6632a3a0-8cb2-41b6-9435-50f762850d72/resource/9c479cfb-8c19-4759-ad34-bc3123079b94/download/r44066_vehicle_trailers_reg_by_operator_add.csv";

const BCC_BOUNDARY_ID = "suburb-boundaries";
const BCC_BOUNDARY_URL =
  "https://data.brisbane.qld.gov.au/explore/dataset/suburb-boundaries/information/";
const BCC_ADDRESS_ID = "property-address-locations";
const BCC_ADDRESS_URL =
  "https://data.brisbane.qld.gov.au/explore/dataset/property-address-locations/information/";
const QLD_LOCALITY_LAYER_URL =
  "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/AdministrativeBoundaries/MapServer/2";
const QLD_LOCALITY_REST_URL =
  "https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/AdministrativeBoundaries/MapServer";
const QLD_LOCALITY_CATALOG_URL =
  "https://www.data.qld.gov.au/dataset/locality-boundaries-queensland";
const QLD_LOCALITY_PACKAGE_ID = "141c82e4-c1f7-4b5d-a528-e3202ae6ebaa";
const CC_BY_4 = "https://creativecommons.org/licenses/by/4.0/";

const MORETON_BAY_LOCALITIES = [
  "BULWER",
  "COWAN COWAN",
  "KOORINGAL",
  "MORETON BAY",
  "MORETON ISLAND",
];

const AMBIGUOUS_CROSS_LGA_LOCALITIES = [
  "BANKS CREEK",
  "CHUWAR",
  "ENGLAND CREEK",
  "LAKE MANCHESTER",
];

const SAME_NAME_ACROSS_LGAS = [
  "ALBION",
  "ASCOT",
  ...AMBIGUOUS_CROSS_LGA_LOCALITIES,
  "MACKENZIE",
  "RED HILL",
  "THE GAP",
  "WEST END",
];

const EXPECTED_AMBIGUOUS_ROWS = {
  "BANKS CREEK": {
    postcode: "4306",
    registeredVehicles: 48,
    localGovernmentAreas: ["Brisbane City", "Somerset Regional"],
  },
  CHUWAR: {
    postcode: "4306",
    registeredVehicles: 2951,
    localGovernmentAreas: ["Brisbane City", "Ipswich City"],
  },
  "ENGLAND CREEK": {
    postcode: "4306",
    registeredVehicles: 72,
    localGovernmentAreas: ["Brisbane City", "Somerset Regional"],
  },
  "LAKE MANCHESTER": {
    postcode: "4306",
    registeredVehicles: 36,
    localGovernmentAreas: ["Brisbane City", "Somerset Regional"],
  },
};

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function resolveOutputRoot() {
  const flagPositions = process.argv.reduce(
    (positions, argument, index) =>
      argument === OUTPUT_ROOT_FLAG ? [...positions, index] : positions,
    [],
  );
  invariant(
    flagPositions.length <= 1,
    `${OUTPUT_ROOT_FLAG} may be provided only once`,
  );

  if (flagPositions.length === 1) {
    const outputRoot = process.argv[flagPositions[0] + 1];
    invariant(
      outputRoot && !outputRoot.startsWith("--"),
      `${OUTPUT_ROOT_FLAG} requires a path to the Caraway repository`,
    );
    return resolve(process.cwd(), outputRoot);
  }

  if (basename(SCRIPT_DIRECTORY) === "scripts") {
    return resolve(SCRIPT_DIRECTORY, "..");
  }

  throw new Error(
    `Downloaded copies require ${OUTPUT_ROOT_FLAG} /absolute/path/to/caraway`,
  );
}

async function validateOutputRoot(outputRoot) {
  let packageMetadata;
  try {
    packageMetadata = JSON.parse(
      await readFile(join(outputRoot, "package.json"), "utf8"),
    );
  } catch {
    throw new Error(
      `Output root must be a Caraway repository containing package.json: ${outputRoot}`,
    );
  }
  invariant(
    packageMetadata.name === "caraway",
    `Output root package must be named caraway: ${outputRoot}`,
  );
}

async function fetchOk(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Caraway open-data builder/1.0 (+https://caraway.au)" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response;
}

async function fetchJson(url) {
  return (await fetchOk(url)).json();
}

async function fetchText(url) {
  return (await fetchOk(url)).text();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  invariant(!quoted, "CSV ended inside a quoted field");
  return rows;
}

function csvCell(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csv(rows) {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function displaySuburbName(sourceName) {
  const overrides = {
    MCDOWALL: "McDowall",
    "MOUNT COOT-THA": "Mount Coot-tha",
    "ST LUCIA": "St Lucia",
  };
  if (overrides[sourceName]) return overrides[sourceName];

  return sourceName
    .toLocaleLowerCase("en-AU")
    .split(" ")
    .map((word, index) => {
      if (index > 0 && word === "of") return word;
      return word
        .split("-")
        .map((part) => `${part.charAt(0).toLocaleUpperCase("en-AU")}${part.slice(1)}`)
        .join("-");
    })
    .join(" ");
}

async function fetchOpendatasoftRows(datasetId, select, groupBy) {
  const rows = [];
  for (let offset = 0; ; offset += 100) {
    const url = new URL(
      `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/${datasetId}/records`,
    );
    url.searchParams.set("select", select);
    if (groupBy) url.searchParams.set("group_by", groupBy);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));
    const payload = await fetchJson(url);
    invariant(Array.isArray(payload.results), `${datasetId}: missing API results`);
    rows.push(...payload.results);
    if (payload.results.length < 100) break;
  }
  return rows;
}

async function fetchQueenslandLocalityLgas(localityNames) {
  const where = `UPPER(locality) IN (${localityNames
    .map((name) => `'${name.replaceAll("'", "''")}'`)
    .join(",")})`;
  const body = new URLSearchParams({
    where,
    outFields: "locality,loc_code,lga",
    returnGeometry: "false",
    orderByFields: "locality,lga",
    f: "json",
  });
  const response = await fetch(`${QLD_LOCALITY_LAYER_URL}/query`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "Caraway open-data builder/1.0 (+https://caraway.au)",
    },
    body,
  });
  invariant(response.ok, `Queensland locality query failed: ${response.status}`);
  const payload = await response.json();
  invariant(!payload.error, `Queensland locality query failed: ${payload.error?.message}`);
  invariant(Array.isArray(payload.features), "Queensland locality query has no features");
  invariant(!payload.exceededTransferLimit, "Queensland locality query was truncated");

  return payload.features.map((feature) => ({
    locality: String(feature.attributes.locality).trim().toLocaleUpperCase("en-AU"),
    localityCode: String(feature.attributes.loc_code).trim(),
    lga: String(feature.attributes.lga).trim(),
  }));
}

async function buildFuelTrend() {
  const [sourceText, resource, packageData] = await Promise.all([
    fetchText(SOE_DATA_URL),
    fetchJson(
      `https://www.data.qld.gov.au/api/3/action/resource_show?id=${SOE_RESOURCE_ID}`,
    ),
    fetchJson(
      "https://www.data.qld.gov.au/api/3/action/package_show?id=294bb52d-f920-4855-a738-362ef5d1a6a8",
    ),
  ]);

  invariant(resource.success, "State of the Environment resource metadata is unavailable");
  invariant(packageData.success, "State of the Environment package metadata is unavailable");
  invariant(
    packageData.result.license_url === CC_BY_4,
    "State of the Environment source licence changed",
  );

  const sourceRows = parseCsv(sourceText);
  const header = sourceRows.shift();
  invariant(
    JSON.stringify(header) === JSON.stringify(["Vehicle Type", "Fuel Type", ...YEARS]),
    "Unexpected State of the Environment CSV header",
  );
  invariant(sourceRows.length === 70, `Expected 70 source rows, received ${sourceRows.length}`);

  const carRows = sourceRows.filter((row) => row[0] === "Cars");
  const fuelTypes = carRows.map((row) => row[1]);
  invariant(carRows.length === 11, `Expected 11 car fuel series, received ${carRows.length}`);
  invariant(new Set(fuelTypes).size === carRows.length, "Duplicate car fuel series");

  const rows = YEARS.map((year, yearIndex) => ({
    year: Number(year),
    registrations: Object.fromEntries(
      carRows.map((row) => {
        const value = Number(row[yearIndex + 2]);
        invariant(Number.isInteger(value) && value >= 0, `${year}/${row[1]} is invalid`);
        return [row[1], value];
      }),
    ),
  }));

  return {
    title: "Queensland cars by fuel type, 2006–2024",
    startYear: 2006,
    endYear: 2024,
    fuelTypes,
    rows,
    source: {
      title: "Queensland State of the Environment 2024 — Number of registered vehicles",
      pageUrl: SOE_PAGE_URL,
      dataUrl: SOE_DATA_URL,
      packageId: packageData.result.id,
      resourceId: SOE_RESOURCE_ID,
      owner: "Queensland Department of Transport and Main Roads",
      publisher: packageData.result.organization.title,
      reportPublished: "2025-09-02",
      license: "CC BY 4.0",
      licenseUrl: CC_BY_4,
      sourceSha256: sha256(sourceText),
      sourceRows: sourceRows.length,
    },
  };
}

async function buildBrisbaneSnapshot() {
  const [sourceText, tmrPackage, boundaryMeta, addressMeta, localityLayerMeta, localityPackage, boundaryRows, addressRows] =
    await Promise.all([
      fetchText(TMR_DATA_URL),
      fetchJson(`https://www.data.qld.gov.au/api/3/action/package_show?id=${TMR_PACKAGE_ID}`),
      fetchJson(
        `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/${BCC_BOUNDARY_ID}`,
      ),
      fetchJson(
        `https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/${BCC_ADDRESS_ID}`,
      ),
      fetchJson(`${QLD_LOCALITY_LAYER_URL}?f=json`),
      fetchJson(
        `https://www.data.qld.gov.au/api/3/action/package_show?id=${QLD_LOCALITY_PACKAGE_ID}`,
      ),
      fetchOpendatasoftRows(BCC_BOUNDARY_ID, "suburb_name"),
      fetchOpendatasoftRows(
        BCC_ADDRESS_ID,
        "suburb,postcode,count(*) as address_count",
        "suburb,postcode",
      ),
    ]);

  invariant(tmrPackage.success, "TMR vehicle-registration package metadata is unavailable");
  invariant(tmrPackage.result.license_url === CC_BY_4, "TMR source licence changed");
  const tmrResource = tmrPackage.result.resources.find(
    (item) => item.id === TMR_RESOURCE_ID,
  );
  invariant(tmrResource, "TMR by-suburb resource is missing");
  invariant(
    tmrResource.datastore_contains_all_records_of_source_file === true,
    "TMR by-suburb resource is no longer marked complete",
  );
  invariant(
    tmrPackage.result.notes.includes("10 October 2022"),
    "TMR snapshot date changed",
  );
  invariant(boundaryMeta.metas.default.license === "CC BY 4.0", "BCC boundary licence changed");
  invariant(addressMeta.metas.default.license === "CC BY 4.0", "BCC address licence changed");
  invariant(localityPackage.success, "Queensland locality package metadata is unavailable");
  invariant(localityPackage.result.license_url === CC_BY_4, "Queensland locality licence changed");
  const localityRestResources = localityPackage.result.resources.filter(
    (resource) =>
      resource.name === "Locality boundaries - Queensland - REST Service" &&
      resource.format === "REST" &&
      resource.state === "active" &&
      resource.url === QLD_LOCALITY_REST_URL,
  );
  invariant(
    localityRestResources.length === 1,
    "Expected exactly one Queensland locality REST resource",
  );
  const [localityRestResource] = localityRestResources;

  const sourceRows = parseCsv(sourceText);
  const header = sourceRows.shift();
  invariant(
    JSON.stringify(header) === JSON.stringify(["Postcode", "Suburb", "State", "Count"]),
    "Unexpected TMR by-suburb CSV header",
  );
  invariant(sourceRows.length === 6467, `Expected 6,467 TMR rows, received ${sourceRows.length}`);

  const excludedSet = new Set(MORETON_BAY_LOCALITIES);
  const sourceBoundaryNames = [...new Set(boundaryRows.map((row) => row.suburb_name.trim()))];
  invariant(sourceBoundaryNames.length === 195, "Expected 195 BCC boundary localities");
  for (const locality of MORETON_BAY_LOCALITIES) {
    invariant(sourceBoundaryNames.includes(locality), `BCC exclusion missing: ${locality}`);
  }
  const brisbaneNames = sourceBoundaryNames
    .filter((name) => !excludedSet.has(name))
    .sort((left, right) => left.localeCompare(right, "en-AU"));
  invariant(brisbaneNames.length === 190, "Expected 190 Brisbane City localities");

  const localityLgaRows = await fetchQueenslandLocalityLgas(brisbaneNames);
  const lgasByLocality = new Map();
  for (const row of localityLgaRows) {
    const lgas = lgasByLocality.get(row.locality) ?? new Set();
    lgas.add(row.lga);
    lgasByLocality.set(row.locality, lgas);
  }
  for (const sourceName of brisbaneNames) {
    invariant(
      lgasByLocality.get(sourceName)?.has("Brisbane City"),
      `${sourceName}: authoritative locality layer does not include Brisbane City`,
    );
  }
  const sameNameAcrossLgas = brisbaneNames.filter(
    (sourceName) => (lgasByLocality.get(sourceName)?.size ?? 0) > 1,
  );
  invariant(
    JSON.stringify(sameNameAcrossLgas) === JSON.stringify(SAME_NAME_ACROSS_LGAS),
    `Same-name locality set changed: ${sameNameAcrossLgas.join(", ")}`,
  );
  invariant(
    localityLayerMeta.copyrightText.includes("State of Queensland"),
    "Queensland locality attribution changed",
  );

  const bccPostcodes = new Map();
  for (const row of addressRows) {
    const suburb = String(row.suburb).trim();
    const postcode = String(row.postcode).trim();
    invariant(!bccPostcodes.has(suburb), `BCC property data has multiple postcodes for ${suburb}`);
    bccPostcodes.set(suburb, postcode);
  }
  invariant(addressRows.length === 196, "Expected 196 BCC property suburb/postcode pairs");
  const postcodeQualifiedNames = brisbaneNames.filter((name) => bccPostcodes.has(name));
  const addresslessNames = brisbaneNames.filter((name) => !bccPostcodes.has(name));
  invariant(postcodeQualifiedNames.length === 188, "Expected 188 BCC postcode mappings");
  invariant(
    JSON.stringify(addresslessNames) ===
      JSON.stringify(["BANKS CREEK", "ENGLAND CREEK"]),
    `BCC addressless locality set changed: ${addresslessNames.join(", ")}`,
  );

  const qldRows = sourceRows
    .map(([postcode, suburb, state, count]) => ({
      postcode: postcode.trim(),
      suburb: suburb.trim(),
      state: state.trim(),
      registeredVehicles: Number(count),
    }))
    .filter((row) => row.state === "QLD");

  // These four BCC boundary names also exist in an adjacent council under the
  // same postcode, while TMR publishes one undivided suburb/postcode count.
  // Other repeated Queensland names have a distinct TMR postcode row that the
  // BCC Property Address dataset can select unambiguously.
  const crossLgaNames = sameNameAcrossLgas.filter(
    (sourceName) => qldRows.filter((row) => row.suburb === sourceName).length === 1,
  );
  invariant(
    JSON.stringify(crossLgaNames) ===
      JSON.stringify(AMBIGUOUS_CROSS_LGA_LOCALITIES),
    `Ambiguous cross-LGA locality set changed: ${crossLgaNames.join(", ")}`,
  );

  const rows = [];
  const excludedTmrRows = [];
  const crossLgaSet = new Set(crossLgaNames);
  const ambiguousRows = [];
  for (const sourceName of brisbaneNames) {
    const candidates = qldRows.filter((row) => row.suburb === sourceName);
    const bccPostcode = bccPostcodes.get(sourceName);
    const matches = bccPostcode
      ? candidates.filter((row) => row.postcode === bccPostcode)
      : candidates;
    invariant(matches.length === 1, `${sourceName}: expected one TMR match, received ${matches.length}`);

    const match = matches[0];
    invariant(
      Number.isInteger(match.registeredVehicles) && match.registeredVehicles >= 0,
      `${sourceName}: invalid count`,
    );
    const selectedRow = {
      suburb: displaySuburbName(sourceName),
      sourceSuburb: sourceName,
      postcode: match.postcode,
      registeredVehicles: match.registeredVehicles,
      matchMethod: bccPostcode ? "bcc_property_postcode" : "unique_boundary_name",
    };
    if (crossLgaSet.has(sourceName)) {
      ambiguousRows.push({
        ...selectedRow,
        localGovernmentAreas: [...lgasByLocality.get(sourceName)].sort(),
      });
    } else {
      rows.push(selectedRow);
    }
    excludedTmrRows.push(
      ...candidates
        .filter((candidate) => candidate !== match)
        .map((candidate) => ({
          suburb: candidate.suburb,
          postcode: candidate.postcode,
          registeredVehicles: candidate.registeredVehicles,
        })),
    );
  }

  invariant(rows.length === 186, "Brisbane snapshot must contain 186 unambiguous suburbs");
  invariant(ambiguousRows.length === 4, "Expected four cross-LGA locality exclusions");
  for (const row of ambiguousRows) {
    const expected = EXPECTED_AMBIGUOUS_ROWS[row.sourceSuburb];
    invariant(expected, `Unexpected ambiguous row: ${row.sourceSuburb}`);
    invariant(
      row.postcode === expected.postcode &&
        row.registeredVehicles === expected.registeredVehicles &&
        JSON.stringify(row.localGovernmentAreas) ===
          JSON.stringify(expected.localGovernmentAreas),
      `Ambiguous row changed: ${row.sourceSuburb}`,
    );
  }
  invariant(
    ambiguousRows.reduce((total, row) => total + row.registeredVehicles, 0) === 3107,
    "Cross-LGA registration count changed",
  );
  invariant(
    rows.reduce((total, row) => total + row.registeredVehicles, 0) === 1176619,
    "Published Brisbane registration count changed",
  );
  invariant(
    [...rows, ...ambiguousRows].reduce(
      (total, row) => total + row.registeredVehicles,
      0,
    ) === 1179726,
    "All associated locality-row count changed",
  );
  invariant(rows.filter((row) => row.matchMethod === "bcc_property_postcode").length === 186,
    "Expected 186 postcode-qualified matches");
  invariant(
    rows.filter((row) => row.matchMethod === "unique_boundary_name").length === 0,
    "Expected no addressless locality matches in the published rows",
  );
  invariant(excludedTmrRows.length === 12, "Expected 12 same-name or postcode-mismatch exclusions");

  return {
    title: "Registered vehicles across 186 Brisbane City suburbs — historical snapshot, 10 October 2022",
    snapshotDate: "2022-10-10",
    rows,
    joinAudit: {
      boundaryLocalities: sourceBoundaryNames.length,
      excludedMoretonBayLocalities: MORETON_BAY_LOCALITIES,
      brisbaneBoundaryLocalities: brisbaneNames.length,
      excludedCrossLgaLocalities: ambiguousRows,
      publishedUnambiguousSuburbs: rows.length,
      postcodeQualifiedMatches: 186,
      uniqueBoundaryNameMatches: 0,
      unmatchedBrisbaneSuburbs: 0,
      excludedSameNameOrPostcodeMismatchRows: excludedTmrRows.length,
      excludedRegistrationCount: excludedTmrRows.reduce(
        (total, row) => total + row.registeredVehicles,
        0,
      ),
    },
    sources: {
      registrations: {
        title: "Queensland TMR — Vehicle registrations, by suburb",
        pageUrl: TMR_PACKAGE_URL,
        dataUrl: TMR_DATA_URL,
        packageId: TMR_PACKAGE_ID,
        resourceId: TMR_RESOURCE_ID,
        snapshotDate: "2022-10-10",
        license: "CC BY 4.0",
        licenseUrl: CC_BY_4,
        sourceSha256: sha256(sourceText),
        sourceRows: sourceRows.length,
      },
      boundaries: {
        title: "Brisbane City Council — Suburb Boundaries",
        pageUrl: BCC_BOUNDARY_URL,
        datasetId: BCC_BOUNDARY_ID,
        updatedAt: boundaryMeta.metas.custom["last-updated-custom"],
        license: boundaryMeta.metas.default.license,
        licenseUrl: boundaryMeta.metas.default.license_url,
        attribution: boundaryMeta.metas.default.attributions.join("; "),
        sourceLocalities: sourceBoundaryNames.length,
        sourceNameSha256: sha256([...sourceBoundaryNames].sort().join("\n")),
      },
      postcodeReference: {
        title: "Brisbane City Council — Property Address locations",
        pageUrl: BCC_ADDRESS_URL,
        datasetId: BCC_ADDRESS_ID,
        updatedAt: addressMeta.metas.custom["last-updated-custom"],
        license: addressMeta.metas.default.license,
        licenseUrl: addressMeta.metas.default.license_url,
        attribution: addressMeta.metas.default.attributions.join("; "),
        sourceSuburbPostcodePairs: addressRows.length,
        sourcePairSha256: sha256(
          addressRows
            .map((row) => `${String(row.suburb).trim()}|${String(row.postcode).trim()}`)
            .sort()
            .join("\n"),
        ),
      },
      administrativeBoundaries: {
        title: "Queensland Government — Administrative Boundaries, Locality layer",
        pageUrl: QLD_LOCALITY_CATALOG_URL,
        dataUrl: QLD_LOCALITY_LAYER_URL,
        packageId: QLD_LOCALITY_PACKAGE_ID,
        resourceId: localityRestResource.id,
        layerName: localityLayerMeta.name,
        description: localityLayerMeta.description,
        license: "CC BY 4.0",
        licenseUrl: CC_BY_4,
        attribution: localityLayerMeta.copyrightText,
        sourceRecordsForBccNames: localityLgaRows.length,
        sourcePairSha256: sha256(
          localityLgaRows
            .map((row) => `${row.locality}|${row.localityCode}|${row.lga}`)
            .sort()
            .join("\n"),
        ),
      },
    },
  };
}

const [fuelTrend, brisbaneSnapshot] = await Promise.all([
  buildFuelTrend(),
  buildBrisbaneSnapshot(),
]);

const output = {
  title: "Queensland vehicle fuel trends and a Brisbane suburb snapshot",
  generatedAt: GENERATED_AT,
  methodologyVersion: 2,
  license: "CC BY 4.0",
  licenseUrl: CC_BY_4,
  fuelTrend,
  brisbaneSnapshot,
};

const fuelCsv = csv([
  [
    "year",
    "fuel_type",
    "registered_cars",
    "source_resource_id",
    "source_url",
    "methodology_url",
    "license_url",
    "attribution",
    "changes",
  ],
  ...fuelTrend.rows.flatMap((row) =>
    fuelTrend.fuelTypes.map((fuelType) => [
      row.year,
      fuelType,
      row.registrations[fuelType],
      SOE_RESOURCE_ID,
      SOE_PAGE_URL,
      `${RESOURCE_PAGE_URL}#queensland-fuel-trends`,
      CC_BY_4,
      "© The State of Queensland (Department of Transport and Main Roads)",
      "Filtered and reshaped by Caraway",
    ]),
  ),
]);

const brisbaneCsv = csv([
  [
    "suburb",
    "postcode",
    "registered_vehicles",
    "match_method",
    "source_snapshot_date",
    "source_resource_id",
    "source_url",
    "methodology_url",
    "license_url",
    "attribution",
    "changes",
  ],
  ...brisbaneSnapshot.rows.map((row) => [
    row.suburb,
    row.postcode,
    row.registeredVehicles,
    row.matchMethod,
    brisbaneSnapshot.snapshotDate,
    TMR_RESOURCE_ID,
    TMR_PACKAGE_URL,
    `${RESOURCE_PAGE_URL}#brisbane-suburb-snapshot`,
    CC_BY_4,
    "© The State of Queensland (Department of Transport and Main Roads)",
    "Matched and filtered by Caraway",
  ]),
]);

const sourceManifest = {
  title: output.title,
  generatedAt: GENERATED_AT,
  methodologyVersion: output.methodologyVersion,
  license: output.license,
  licenseUrl: output.licenseUrl,
  buildScript: {
    path: "/data/build-queensland-vehicle-data.mjs",
    runtime: "Node.js 22 or later",
    sha256: null,
  },
  fuelTrend: {
    filter: { vehicleType: "Cars", years: "2006–2024" },
    source: fuelTrend.source,
    output: {
      path: "/data/queensland-car-registrations-by-fuel-2006-2024.csv",
      sha256: sha256(fuelCsv),
      dataRows: fuelTrend.rows.length * fuelTrend.fuelTypes.length,
    },
  },
  brisbaneSnapshot: {
    filter: {
      state: "QLD",
      snapshotDate: brisbaneSnapshot.snapshotDate,
      geography:
        "Unambiguous suburb/postcode rows associated with Brisbane City",
    },
    sources: brisbaneSnapshot.sources,
    joinAudit: brisbaneSnapshot.joinAudit,
    output: {
      path: "/data/brisbane-registered-vehicles-by-suburb-2022.csv",
      sha256: sha256(brisbaneCsv),
      dataRows: brisbaneSnapshot.rows.length,
    },
  },
};

const buildScriptSource = await readFile(BUILD_SCRIPT_PATH, "utf8");
sourceManifest.buildScript.sha256 = sha256(buildScriptSource);

const dataDir = join(ROOT, "src", "data");
const publicDataDir = join(ROOT, "public", "data");
await mkdir(dataDir, { recursive: true });
await mkdir(publicDataDir, { recursive: true });
await Promise.all([
  writeFile(
    join(dataDir, "queensland-vehicle-data.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  ),
  writeFile(
    join(publicDataDir, "queensland-car-registrations-by-fuel-2006-2024.csv"),
    fuelCsv,
  ),
  writeFile(
    join(publicDataDir, "brisbane-registered-vehicles-by-suburb-2022.csv"),
    brisbaneCsv,
  ),
  writeFile(
    join(publicDataDir, "queensland-vehicle-data-source-manifest.json"),
    `${JSON.stringify(sourceManifest, null, 2)}\n`,
  ),
  writeFile(
    join(publicDataDir, "build-queensland-vehicle-data.mjs"),
    buildScriptSource,
  ),
]);

console.log(
  JSON.stringify(
    {
      generatedAt: GENERATED_AT,
      fuelYears: fuelTrend.rows.length,
      fuelSeries: fuelTrend.fuelTypes.length,
      brisbaneSuburbs: brisbaneSnapshot.rows.length,
      brisbaneRegisteredVehicles: brisbaneSnapshot.rows.reduce(
        (total, row) => total + row.registeredVehicles,
        0,
      ),
      excludedTmrRows: brisbaneSnapshot.joinAudit.excludedSameNameOrPostcodeMismatchRows,
      excludedRegistrationCount: brisbaneSnapshot.joinAudit.excludedRegistrationCount,
    },
    null,
    2,
  ),
);
