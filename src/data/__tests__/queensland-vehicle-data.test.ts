import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  BRISBANE_DATA_DOWNLOAD,
  FUEL_DATA_DOWNLOAD,
  VEHICLE_DATA_BUILD_SCRIPT,
  VEHICLE_DATA_SOURCE_MANIFEST,
  brisbaneSnapshotRows,
  brisbaneSnapshotTotal,
  fuelTrendRows,
  vehicleData,
} from "@/data/queensland-vehicle-data";

function publicFile(publicPath: string): string {
  return readFileSync(join(process.cwd(), "public", publicPath), "utf8");
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const fuelCsv = publicFile(FUEL_DATA_DOWNLOAD);
const brisbaneCsv = publicFile(BRISBANE_DATA_DOWNLOAD);
const sourceManifest = JSON.parse(
  publicFile(VEHICLE_DATA_SOURCE_MANIFEST),
) as {
  generatedAt: string;
  methodologyVersion: number;
  fuelTrend: {
    filter: { vehicleType: string; years: string };
    source: { pageUrl: string };
    output: { sha256: string };
  };
  brisbaneSnapshot: {
    filter: { state: string; snapshotDate: string; geography: string };
    output: { sha256: string };
    sources: {
      administrativeBoundaries: { licenseUrl: string; resourceId: string };
    };
  };
  buildScript: { path: string; runtime: string; sha256: string };
};

describe("Queensland vehicle-data artifact", () => {
  it("keeps the coherent statewide fuel series complete and source-shaped", () => {
    expect(vehicleData.generatedAt).toBe("2026-08-13");
    expect(vehicleData.methodologyVersion).toBe(2);
    expect(vehicleData.licenseUrl).toBe(
      "https://creativecommons.org/licenses/by/4.0/",
    );
    expect(vehicleData.fuelTrend.fuelTypes).toHaveLength(11);
    expect(vehicleData.fuelTrend.source.pageUrl).toBe(
      "https://www.stateoftheenvironment.detsi.qld.gov.au/climate-change/indicators/number-of-registered-vehicles",
    );
    expect(fuelTrendRows.map((row) => row.year)).toEqual(
      Array.from({ length: 19 }, (_, index) => 2006 + index),
    );
    expect(
      fuelTrendRows.every((row) =>
        Object.values(row.registrations).every(
          (value) => Number.isInteger(value) && value >= 0,
        ),
      ),
    ).toBe(true);
    expect(fuelTrendRows[0].registrations.Electric).toBe(1);
    expect(fuelTrendRows.at(-1)?.registrations.Electric).toBe(44_398);
    expect(fuelTrendRows.at(-1)?.registrations["Petrol/Electric"]).toBe(
      110_604,
    );
  });

  it("publishes only the 186 unambiguous Brisbane suburb rows", () => {
    expect(brisbaneSnapshotRows).toHaveLength(186);
    expect(brisbaneSnapshotTotal).toBe(1_176_619);
    expect(
      new Set(
        brisbaneSnapshotRows.map((row) => `${row.suburb}|${row.postcode}`),
      ).size,
    ).toBe(brisbaneSnapshotRows.length);
    expect(
      brisbaneSnapshotRows.every(
        (row) =>
          /^4\d{3}$/.test(row.postcode) &&
          Number.isInteger(row.registeredVehicles) &&
          row.registeredVehicles >= 0 &&
          row.matchMethod === "bcc_property_postcode",
      ),
    ).toBe(true);

    const audit = vehicleData.brisbaneSnapshot.joinAudit;
    expect(audit.boundaryLocalities).toBe(195);
    expect(audit.brisbaneBoundaryLocalities).toBe(190);
    expect(audit.publishedUnambiguousSuburbs).toBe(186);
    expect(audit.postcodeQualifiedMatches).toBe(186);
    expect(audit.uniqueBoundaryNameMatches).toBe(0);
    expect(audit.excludedCrossLgaLocalities).toMatchObject([
      { sourceSuburb: "BANKS CREEK", postcode: "4306", registeredVehicles: 48 },
      { sourceSuburb: "CHUWAR", postcode: "4306", registeredVehicles: 2_951 },
      { sourceSuburb: "ENGLAND CREEK", postcode: "4306", registeredVehicles: 72 },
      { sourceSuburb: "LAKE MANCHESTER", postcode: "4306", registeredVehicles: 36 },
    ]);
    expect(
      audit.excludedCrossLgaLocalities.reduce(
        (total, row) => total + row.registeredVehicles,
        0,
      ),
    ).toBe(3_107);
    expect(audit.excludedSameNameOrPostcodeMismatchRows).toBe(12);
    expect(audit.excludedRegistrationCount).toBe(5_265);
  });

  it("keeps both CSV downloads in exact parity with the checked-in JSON", () => {
    const fuelLines = fuelCsv.trimEnd().split("\n");
    expect(fuelLines[0]).toBe(
      "year,fuel_type,registered_cars,source_resource_id,source_url,methodology_url,license_url,attribution,changes",
    );
    expect(fuelLines).toHaveLength(1 + 19 * 11);

    const expectedFuelLines = fuelTrendRows.flatMap((row) =>
      vehicleData.fuelTrend.fuelTypes.map(
        (fuelType) =>
          `${row.year},${fuelType},${row.registrations[fuelType]},${vehicleData.fuelTrend.source.resourceId},${vehicleData.fuelTrend.source.pageUrl},https://caraway.au/resources/queensland-vehicle-data#queensland-fuel-trends,https://creativecommons.org/licenses/by/4.0/,© The State of Queensland (Department of Transport and Main Roads),Filtered and reshaped by Caraway`,
      ),
    );
    expect(fuelLines.slice(1)).toEqual(expectedFuelLines);

    const brisbaneLines = brisbaneCsv.trimEnd().split("\n");
    expect(brisbaneLines[0]).toBe(
      "suburb,postcode,registered_vehicles,match_method,source_snapshot_date,source_resource_id,source_url,methodology_url,license_url,attribution,changes",
    );
    expect(brisbaneLines).toHaveLength(187);
    expect(brisbaneLines.slice(1)).toEqual(
      brisbaneSnapshotRows.map(
        (row) =>
          `${row.suburb},${row.postcode},${row.registeredVehicles},${row.matchMethod},2022-10-10,${vehicleData.brisbaneSnapshot.sources.registrations.resourceId},${vehicleData.brisbaneSnapshot.sources.registrations.pageUrl},https://caraway.au/resources/queensland-vehicle-data#brisbane-suburb-snapshot,https://creativecommons.org/licenses/by/4.0/,© The State of Queensland (Department of Transport and Main Roads),Matched and filtered by Caraway`,
      ),
    );

    for (const excluded of [
      "Banks Creek,4306",
      "Chuwar,4306",
      "England Creek,4306",
      "Lake Manchester,4306",
    ]) {
      expect(brisbaneCsv).not.toContain(excluded);
    }
  });

  it("records source hashes, filters, outputs, and no row-level identifiers", () => {
    // Provenance: the manifest must describe the dataset actually committed.
    expect(sourceManifest.generatedAt).toBe(vehicleData.generatedAt);
    expect(sourceManifest.methodologyVersion).toBe(2);
    expect(sourceManifest.fuelTrend.filter).toEqual({
      vehicleType: "Cars",
      years: "2006–2024",
    });
    expect(sourceManifest.fuelTrend.source.pageUrl).toBe(
      "https://www.stateoftheenvironment.detsi.qld.gov.au/climate-change/indicators/number-of-registered-vehicles",
    );
    expect(sourceManifest.brisbaneSnapshot.filter).toMatchObject({
      state: "QLD",
      snapshotDate: "2022-10-10",
    });
    expect(sourceManifest.fuelTrend.output.sha256).toBe(sha256(fuelCsv));
    expect(sourceManifest.brisbaneSnapshot.output.sha256).toBe(
      sha256(brisbaneCsv),
    );
    expect(
      sourceManifest.brisbaneSnapshot.sources.administrativeBoundaries
        .licenseUrl,
    ).toBe("https://creativecommons.org/licenses/by/4.0/");
    expect(
      sourceManifest.brisbaneSnapshot.sources.administrativeBoundaries
        .resourceId,
    ).toBe(
      vehicleData.brisbaneSnapshot.sources.administrativeBoundaries.resourceId,
    );
    expect(
      sourceManifest.brisbaneSnapshot.sources.administrativeBoundaries
        .resourceId,
    ).toMatch(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    const buildScript = publicFile(VEHICLE_DATA_BUILD_SCRIPT);
    expect(sourceManifest.buildScript).toMatchObject({
      path: VEHICLE_DATA_BUILD_SCRIPT,
      runtime: "Node.js 22 or later",
      sha256: sha256(buildScript),
    });
    expect(buildScript).toBe(
      readFileSync(
        join(process.cwd(), "scripts", "build-queensland-vehicle-data.mjs"),
        "utf8",
      ),
    );
    expect(buildScript).toContain(
      'resource.name === "Locality boundaries - Queensland - REST Service"',
    );
    expect(buildScript).toContain('resource.format === "REST"');
    expect(buildScript).not.toContain("const QLD_LOCALITY_RESOURCE_ID");

    const serializedOutputs = `${fuelCsv}\n${brisbaneCsv}\n${buildScript}\n${JSON.stringify(
      sourceManifest,
    )}`;
    expect(serializedOutputs).not.toMatch(
      /OPEN_DATA_VEHICLE_IDENTIFIER|\bVIN\b|chassis|engine_number/i,
    );
    expect(serializedOutputs).not.toContain(
      "/pollution/air-quality/number-of-registered-vehicles",
    );
    expect(serializedOutputs).not.toContain(
      "01ce1c06-ce2a-4528-8fa2-9265bdb2147d",
    );
  });

  it("refuses to write when a downloaded build script has no explicit output root", () => {
    const temporaryDirectory = mkdtempSync(
      join(tmpdir(), "caraway-vehicle-data-builder-"),
    );
    try {
      const downloadedScript = join(temporaryDirectory, "build.mjs");
      writeFileSync(downloadedScript, publicFile(VEHICLE_DATA_BUILD_SCRIPT));

      const result = spawnSync(process.execPath, [downloadedScript], {
        encoding: "utf8",
      });

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain(
        "Downloaded copies require --output-root /absolute/path/to/caraway",
      );
      expect(existsSync(join(temporaryDirectory, "src"))).toBe(false);
      expect(existsSync(join(temporaryDirectory, "public"))).toBe(false);
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });
});
