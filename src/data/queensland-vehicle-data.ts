import rawVehicleData from "./queensland-vehicle-data.json";

export const VEHICLE_DATA_ROUTE = "/resources/queensland-vehicle-data";
export const FUEL_DATA_DOWNLOAD =
  "/data/queensland-car-registrations-by-fuel-2006-2024.csv";
export const BRISBANE_DATA_DOWNLOAD =
  "/data/brisbane-registered-vehicles-by-suburb-2022.csv";
export const VEHICLE_DATA_SOURCE_MANIFEST =
  "/data/queensland-vehicle-data-source-manifest.json";
export const VEHICLE_DATA_BUILD_SCRIPT =
  "/data/build-queensland-vehicle-data.mjs";

export type FuelType =
  | "Diesel"
  | "Diesel/Electric"
  | "Diesel/Gas"
  | "Electric"
  | "Gas"
  | "Kerosine"
  | "Hydrogen"
  | "Petrol"
  | "Petrol/Electric"
  | "Petrol/Gas"
  | "Steam";

export interface FuelTrendRow {
  year: number;
  registrations: Record<FuelType, number>;
}

export interface BrisbaneSnapshotRow {
  suburb: string;
  sourceSuburb: string;
  postcode: string;
  registeredVehicles: number;
  matchMethod: "bcc_property_postcode";
}

interface VehicleData {
  title: string;
  generatedAt: string;
  methodologyVersion: number;
  license: string;
  licenseUrl: string;
  fuelTrend: {
    title: string;
    startYear: number;
    endYear: number;
    fuelTypes: FuelType[];
    rows: FuelTrendRow[];
    source: {
      title: string;
      pageUrl: string;
      dataUrl: string;
      packageId: string;
      resourceId: string;
      owner: string;
      publisher: string;
      reportPublished: string;
      license: string;
      licenseUrl: string;
      sourceSha256: string;
      sourceRows: number;
    };
  };
  brisbaneSnapshot: {
    title: string;
    snapshotDate: string;
    rows: BrisbaneSnapshotRow[];
    joinAudit: {
      boundaryLocalities: number;
      excludedMoretonBayLocalities: string[];
      brisbaneBoundaryLocalities: number;
      excludedCrossLgaLocalities: Array<{
        suburb: string;
        sourceSuburb: string;
        postcode: string;
        registeredVehicles: number;
        matchMethod: "bcc_property_postcode" | "unique_boundary_name";
        localGovernmentAreas: string[];
      }>;
      publishedUnambiguousSuburbs: number;
      postcodeQualifiedMatches: number;
      uniqueBoundaryNameMatches: number;
      unmatchedBrisbaneSuburbs: number;
      excludedSameNameOrPostcodeMismatchRows: number;
      excludedRegistrationCount: number;
    };
    sources: {
      registrations: {
        title: string;
        pageUrl: string;
        dataUrl: string;
        packageId: string;
        resourceId: string;
        snapshotDate: string;
        license: string;
        licenseUrl: string;
        sourceSha256: string;
        sourceRows: number;
      };
      boundaries: {
        title: string;
        pageUrl: string;
        datasetId: string;
        updatedAt: string;
        license: string;
        licenseUrl: string;
        attribution: string;
        sourceLocalities: number;
        sourceNameSha256: string;
      };
      postcodeReference: {
        title: string;
        pageUrl: string;
        datasetId: string;
        updatedAt: string;
        license: string;
        licenseUrl: string;
        attribution: string;
        sourceSuburbPostcodePairs: number;
        sourcePairSha256: string;
      };
      administrativeBoundaries: {
        title: string;
        pageUrl: string;
        dataUrl: string;
        packageId: string;
        resourceId: string;
        layerName: string;
        description: string;
        license: string;
        licenseUrl: string;
        attribution: string;
        sourceRecordsForBccNames: number;
        sourcePairSha256: string;
      };
    };
  };
}

export const vehicleData = rawVehicleData as VehicleData;

export const fuelTrendRows = vehicleData.fuelTrend.rows.map((row) => ({
  ...row,
  totalRegisteredCars: Object.values(row.registrations).reduce(
    (total, value) => total + value,
    0,
  ),
}));

export const brisbaneSnapshotRows = vehicleData.brisbaneSnapshot.rows;

export const brisbaneSnapshotTotal = brisbaneSnapshotRows.reduce(
  (total, row) => total + row.registeredVehicles,
  0,
);

export const topBrisbaneSnapshotRows = [...brisbaneSnapshotRows]
  .sort(
    (left, right) =>
      right.registeredVehicles - left.registeredVehicles ||
      left.suburb.localeCompare(right.suburb, "en-AU"),
  )
  .slice(0, 10);
