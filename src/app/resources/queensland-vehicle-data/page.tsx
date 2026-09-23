import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, FileJson } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { VehicleFuelTrendChart } from "@/components/resources/VehicleFuelTrendChart";
import {
  BRISBANE_DATA_DOWNLOAD,
  BRISBANE_OPEN_DATA_SHOWCASE_URL,
  BRISBANE_REUSE_THUMBNAIL,
  FUEL_DATA_DOWNLOAD,
  VEHICLE_DATA_SOCIAL_IMAGE,
  VEHICLE_DATA_BUILD_SCRIPT,
  VEHICLE_DATA_ROUTE,
  VEHICLE_DATA_SOURCE_MANIFEST,
  brisbaneSnapshotRows,
  brisbaneSnapshotTotal,
  fuelTrendRows,
  topBrisbaneSnapshotRows,
  vehicleData,
} from "@/data/queensland-vehicle-data";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import {
  OPEN_GRAPH_DEFAULTS,
  SITE_URL,
  VEHICLE_DATA_CONTENT_PUBLISHED,
  VEHICLE_DATA_CONTENT_UPDATED,
  VEHICLE_DATA_DATASET_UPDATED,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Queensland Vehicle Data | Fuel Trends & Brisbane Snapshot",
  description:
    "Explore Queensland car fuel records from 2006–2024 and a clearly dated 2022 snapshot of registered vehicles across 186 Brisbane City suburbs.",
  alternates: { canonical: VEHICLE_DATA_ROUTE },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: VEHICLE_DATA_ROUTE,
    title: "Queensland Vehicle Data | Fuel Trends & Brisbane Snapshot",
    description:
      "Two separate official-data views: Queensland cars by fuel type and a historical Brisbane City suburb snapshot.",
    images: [
      {
        url: VEHICLE_DATA_SOCIAL_IMAGE.src,
        width: VEHICLE_DATA_SOCIAL_IMAGE.width,
        height: VEHICLE_DATA_SOCIAL_IMAGE.height,
        alt: VEHICLE_DATA_SOCIAL_IMAGE.alt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Queensland Vehicle Data | Fuel Trends & Brisbane Snapshot",
    description:
      "Two separate official-data views: Queensland cars by fuel type and a historical Brisbane City suburb snapshot.",
    images: [
      {
        url: VEHICLE_DATA_SOCIAL_IMAGE.src,
        alt: VEHICLE_DATA_SOCIAL_IMAGE.alt,
      },
    ],
  },
};

export const RESOURCE_HEADING =
  "Queensland vehicle fuel trends and a Brisbane suburb snapshot";

const canonical = `${SITE_URL}${VEHICLE_DATA_ROUTE}`;
const socialImageUrl = `${SITE_URL}${VEHICLE_DATA_SOCIAL_IMAGE.src}`;
const brisbaneImageUrl = `${SITE_URL}${BRISBANE_REUSE_THUMBNAIL.src}`;
const fuelDatasetId = `${canonical}#queensland-fuel-dataset`;
const brisbaneDatasetId = `${canonical}#brisbane-suburb-dataset`;
const fuelImageId = `${canonical}#queensland-fuel-image`;
const brisbaneImageId = `${canonical}#brisbane-suburb-image`;
const imageReuseLicenseUrl = `${canonical}#image-reuse-license`;
const fuelImageCredit =
  "Caraway graphic. Source vehicle data © The State of Queensland (Department of Transport and Main Roads); filtered and reshaped under CC BY 4.0; changes made.";
const brisbaneImageCredit =
  "Caraway graphic. Vehicle data © The State of Queensland (Department of Transport and Main Roads). Geography references © Brisbane City Council and © State of Queensland; adapted under CC BY 4.0; changes made. Full department attribution is listed below.";
const numberFormat = new Intl.NumberFormat("en-AU");
const firstFuelRow = fuelTrendRows[0];
const previousFuelRow = fuelTrendRows.at(-2)!;
const latestFuelRow = fuelTrendRows.at(-1)!;
const publishedFuelChanges = [
  {
    label: "All 11 source fuel labels",
    previous: previousFuelRow.totalRegisteredCars,
    current: latestFuelRow.totalRegisteredCars,
  },
  {
    label: 'Source label “Electric”',
    previous: previousFuelRow.registrations.Electric,
    current: latestFuelRow.registrations.Electric,
  },
  {
    label: 'Source label “Petrol/Electric”',
    previous: previousFuelRow.registrations["Petrol/Electric"],
    current: latestFuelRow.registrations["Petrol/Electric"],
  },
].map((metric) => ({
  ...metric,
  difference: metric.current - metric.previous,
  percentageDifference: ((metric.current - metric.previous) / metric.previous) * 100,
}));

function formatSigned(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${numberFormat.format(value)}`;
}

function formatSignedPercentage(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Queensland vehicle data" },
];

export const vehicleDataStructuredData: Record<string, unknown>[] = [
  breadcrumbListSchema(
    breadcrumbs.map((item) => ({
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : canonical,
    })),
  ),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: RESOURCE_HEADING,
    description:
      "A methodology-first collection of two separate derived datasets: Queensland registered cars by fuel type from 2006 to 2024, and a historical 2022 registration snapshot across 186 unambiguous Brisbane City suburb rows.",
    inLanguage: "en-AU",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    breadcrumb: { "@id": `${canonical}#breadcrumbs` },
    datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
    dateModified: VEHICLE_DATA_CONTENT_UPDATED,
    primaryImageOfPage: { "@id": fuelImageId },
    image: [{ "@id": fuelImageId }, { "@id": brisbaneImageId }],
    thumbnailUrl: socialImageUrl,
    hasPart: [{ "@id": fuelDatasetId }, { "@id": brisbaneDatasetId }],
  },
  {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": fuelImageId,
    url: socialImageUrl,
    contentUrl: socialImageUrl,
    encodingFormat: "image/png",
    width: VEHICLE_DATA_SOCIAL_IMAGE.width,
    height: VEHICLE_DATA_SOCIAL_IMAGE.height,
    caption: VEHICLE_DATA_SOCIAL_IMAGE.alt,
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Caraway",
    },
    creditText: fuelImageCredit,
    license: vehicleData.licenseUrl,
    acquireLicensePage: imageReuseLicenseUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": brisbaneImageId,
    url: brisbaneImageUrl,
    contentUrl: brisbaneImageUrl,
    encodingFormat: "image/png",
    width: BRISBANE_REUSE_THUMBNAIL.width,
    height: BRISBANE_REUSE_THUMBNAIL.height,
    caption: BRISBANE_REUSE_THUMBNAIL.alt,
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Caraway",
    },
    creditText: brisbaneImageCredit,
    license: vehicleData.licenseUrl,
    acquireLicensePage: imageReuseLicenseUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": fuelDatasetId,
    url: `${canonical}#queensland-fuel-trends`,
    name: vehicleData.fuelTrend.title,
    description:
      "A Caraway-derived long-form CSV of Queensland registered-car records for all 11 fuel types in the official State of the Environment table, covering each year from 2006 through 2024.",
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isBasedOn: [
      vehicleData.fuelTrend.source.pageUrl,
      vehicleData.fuelTrend.source.dataUrl,
    ],
    license: vehicleData.licenseUrl,
    isAccessibleForFree: true,
    inLanguage: "en-AU",
    datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
    dateModified: VEHICLE_DATA_DATASET_UPDATED,
    temporalCoverage: "2006/2024",
    spatialCoverage: { "@type": "Place", name: "Queensland" },
    keywords:
      "Queensland vehicle registrations, registered cars by fuel type, electric cars, historical vehicle data",
    variableMeasured: ["year", "fuel type", "registered cars"],
    measurementTechnique:
      "Filtered the official table to Vehicle Type = Cars and converted the 19 annual columns into one row per year and fuel type without estimating missing values.",
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${SITE_URL}${FUEL_DATA_DOWNLOAD}`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": brisbaneDatasetId,
    url: `${canonical}#brisbane-suburb-snapshot`,
    name: vehicleData.brisbaneSnapshot.title,
    description:
      "A Caraway-derived historical CSV of the 10 October 2022 TMR registered-vehicle rows that can be matched unambiguously to 186 Brisbane City suburbs using official boundary and postcode references.",
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isBasedOn: [
      vehicleData.brisbaneSnapshot.sources.registrations.pageUrl,
      vehicleData.brisbaneSnapshot.sources.boundaries.pageUrl,
      vehicleData.brisbaneSnapshot.sources.postcodeReference.pageUrl,
      vehicleData.brisbaneSnapshot.sources.administrativeBoundaries.pageUrl,
    ],
    license: vehicleData.licenseUrl,
    isAccessibleForFree: true,
    inLanguage: "en-AU",
    datePublished: VEHICLE_DATA_CONTENT_PUBLISHED,
    dateModified: VEHICLE_DATA_DATASET_UPDATED,
    temporalCoverage: "2022-10-10/2022-10-10",
    spatialCoverage: {
      "@type": "Place",
      name: "186 unambiguous suburb and postcode rows associated with Brisbane City",
    },
    keywords:
      "Brisbane registered vehicles by suburb, postcode, historical 2022 registration snapshot",
    variableMeasured: ["suburb", "postcode", "registered vehicles"],
    measurementTechnique:
      "Started with Brisbane City Council boundary names, excluded the five separately listed Moreton Bay locality records, and matched Queensland TMR suburb and postcode rows to the remaining 190 names using property-address postcodes. Four cross-LGA-ambiguous rows and 12 alternative same-name or postcode-mismatch rows were then excluded.",
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${SITE_URL}${BRISBANE_DATA_DOWNLOAD}`,
    },
  },
];

const downloadClasses =
  "inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function SourceLink({
  href,
  label,
  location,
}: {
  href: string;
  label: string;
  location: string;
}) {
  return (
    <TrackedOutboundLink
      href={href}
      label={label}
      location={location}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm py-2 font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </TrackedOutboundLink>
  );
}

function DataTable({
  rows,
  caption,
}: {
  rows: typeof brisbaneSnapshotRows;
  caption: string;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-secondary text-primary">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Suburb</th>
            <th scope="col" className="px-4 py-3 font-semibold">Postcode</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Registered vehicles
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={`${row.suburb}-${row.postcode}`}>
              <th scope="row" className="px-4 py-3 font-medium text-foreground">
                {row.suburb}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{row.postcode}</td>
              <td className="px-4 py-3 text-right tabular-nums text-foreground">
                {numberFormat.format(row.registeredVehicles)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QueenslandVehicleDataPage() {
  const ambiguousRows =
    vehicleData.brisbaneSnapshot.joinAudit.excludedCrossLgaLocalities;
  const ambiguousCount = ambiguousRows.reduce(
    (total, row) => total + row.registeredVehicles,
    0,
  );

  return (
    <>
      <JsonLd data={vehicleDataStructuredData} />
      <PageShell
        breadcrumbs={breadcrumbs}
        eyebrow="Open data resource"
        title={RESOURCE_HEADING}
        subtitle={
          <p>
            Two independent views built from official Queensland and Brisbane
            datasets. Their dates, geography, and vehicle definitions differ, so
            the panels should not be combined into one series.
          </p>
        }
      >
        <div className="site-container py-12 sm:py-16 lg:py-20">
          <nav aria-label="On this page" className="grid gap-4 md:grid-cols-2">
            <a
              href="#queensland-fuel-trends"
              className="rounded-md border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="eyebrow">Panel 1 · Queensland</span>
              <span className="mt-2 block text-lg font-semibold text-primary">
                Cars by fuel type, 2006–2024
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                A 19-year official aggregate suitable for statewide trend analysis.
              </span>
            </a>
            <a
              href="#brisbane-suburb-snapshot"
              className="rounded-md border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="eyebrow">Panel 2 · Brisbane City</span>
              <span className="mt-2 block text-lg font-semibold text-primary">
                Registered vehicles by suburb, 10 October 2022
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                Historical snapshot — not current. Includes 186 unambiguous rows.
              </span>
            </a>
          </nav>

          <section
            id="queensland-fuel-trends"
            aria-labelledby="queensland-fuel-heading"
            className="scroll-mt-header pt-16 sm:pt-20"
          >
            <p className="eyebrow">Panel 1 · Statewide annual data</p>
            <h2
              id="queensland-fuel-heading"
              className="mt-3 text-3xl font-display font-bold text-foreground sm:text-4xl"
            >
              Queensland cars by fuel type, 2006–2024
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              This panel filters the Queensland State of the Environment table to
              <strong className="font-semibold text-foreground"> Cars</strong> and
              preserves all 11 fuel categories. These are registration records,
              not sales, removals, scrappage, prices, or demand.
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Electric cars in 2006
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(firstFuelRow.registrations.Electric)}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Electric cars in 2024
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(latestFuelRow.registrations.Electric)}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Petrol/electric cars in 2024
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(
                    latestFuelRow.registrations["Petrol/Electric"],
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-10 rounded-md border border-border bg-card p-6">
              <h3 className="text-2xl font-semibold text-foreground">
                Change in the published records, {previousFuelRow.year}–{latestFuelRow.year}
              </h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                This compares the final two annual columns in the source. The fuel
                labels remain separate and literal. Differences can reflect both
                registration activity and source cleansing; they are not sales,
                market share, demand, removals, or BEV/PHEV classifications.
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {publishedFuelChanges.map((metric) => (
                  <div key={metric.label} className="rounded-md bg-secondary p-5">
                    <dt className="text-sm font-semibold text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-bold tabular-nums text-primary">
                      {formatSigned(metric.difference)} ({formatSignedPercentage(
                        metric.percentageDifference,
                      )})
                    </dd>
                    <dd className="mt-2 text-sm tabular-nums text-muted-foreground">
                      {numberFormat.format(metric.previous)} → {numberFormat.format(
                        metric.current,
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                When reusing these figures, describe them as Queensland
                registered-car records under the source&apos;s literal fuel labels,
                link to this panel, and cite the official source below.
              </p>
            </div>

            <div className="mt-10">
              <VehicleFuelTrendChart rows={fuelTrendRows} />
            </div>

            <div className="mt-8 overflow-x-auto rounded-md border border-border bg-card">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Annual Queensland registered electric and petrol-electric cars,
                  2006 to 2024
                </caption>
                <thead className="bg-secondary text-primary">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Year</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Electric
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Petrol/Electric
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      All listed fuel types
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fuelTrendRows.map((row) => (
                    <tr key={row.year}>
                      <th scope="row" className="px-4 py-3 font-medium text-foreground">
                        {row.year}
                      </th>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {numberFormat.format(row.registrations.Electric)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {numberFormat.format(row.registrations["Petrol/Electric"])}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {numberFormat.format(row.totalRegisteredCars)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={FUEL_DATA_DOWNLOAD} download className={downloadClasses}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download all 11 fuel types (CSV)
              </a>
              <SourceLink
                href={vehicleData.fuelTrend.source.pageUrl}
                label="Open the official State of the Environment source"
                location="vehicle_data_fuel_source"
              />
            </div>
          </section>

          <section
            id="brisbane-suburb-snapshot"
            aria-labelledby="brisbane-snapshot-heading"
            className="scroll-mt-header pt-20"
          >
            <p className="eyebrow">Panel 2 · Historical local snapshot</p>
            <h2
              id="brisbane-snapshot-heading"
              className="mt-3 text-3xl font-display font-bold text-foreground sm:text-4xl"
            >
              Registered vehicles across 186 Brisbane City suburbs
            </h2>
            <p className="mt-4 inline-flex rounded-sm border border-warning/50 bg-warning/10 px-3 py-2 text-sm font-bold text-foreground">
              Historical snapshot — not current · 10 October 2022
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              The published rows contain vehicles, trailers, caravans, and
              motorcycles grouped by recorded garaging address in the selected suburbs.
              They exclude seasonal registrations and do not represent cars,
              households, owners, roadworthiness, or today&apos;s fleet.
            </p>

            <aside
              aria-label="Brisbane City Council showcase recognition"
              className="mt-8 rounded-md border border-primary/25 bg-secondary p-5 sm:p-6"
            >
              <p className="eyebrow">Brisbane Open Data</p>
              <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">
                Featured in{" "}
                <TrackedOutboundLink
                  href={BRISBANE_OPEN_DATA_SHOWCASE_URL}
                  label="Brisbane City Council Open Data showcase"
                  location="vehicle_data_council_showcase"
                  className="rounded-sm underline decoration-primary/30 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Brisbane City Council’s Open Data showcase
                  <ExternalLink
                    className="ml-1 inline h-4 w-4 align-[-0.125em]"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </TrackedOutboundLink>
                .
              </p>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                Council’s public listing links directly to this resource and
                describes the historical snapshot, methodology, and exclusions.
              </p>
            </aside>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Registrations in published rows
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(brisbaneSnapshotTotal)}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Unambiguous suburb rows
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(brisbaneSnapshotRows.length)}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-secondary p-5">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Cross-LGA-ambiguous rows excluded
                </dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums text-primary">
                  {numberFormat.format(ambiguousRows.length)}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-foreground">
                Ten largest published rows in the snapshot
              </h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                A large row can reflect commercial fleets, trailers, motorcycles,
                or garaging-address patterns. It is not a suburb population or
                household-ownership ranking.
              </p>
              <div className="mt-5">
                <DataTable
                  rows={topBrisbaneSnapshotRows}
                  caption="Ten largest registered-vehicle rows in the historical Brisbane City suburb snapshot"
                />
              </div>
            </div>

            <details className="mt-8 rounded-md border border-border bg-muted p-4 sm:p-6">
              <summary className="cursor-pointer rounded-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                View all 186 unambiguous suburb rows
              </summary>
              <div className="mt-5">
                <DataTable
                  rows={brisbaneSnapshotRows}
                  caption="All 186 unambiguous registered-vehicle rows in the historical Brisbane City suburb snapshot"
                />
              </div>
            </details>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={BRISBANE_DATA_DOWNLOAD} download className={downloadClasses}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download 186 suburb rows (CSV)
              </a>
              <SourceLink
                href={vehicleData.brisbaneSnapshot.sources.registrations.pageUrl}
                label="Open the official TMR snapshot source"
                location="vehicle_data_brisbane_source"
              />
            </div>
          </section>

          <section
            id="image-reuse-license"
            aria-labelledby="editorial-images-heading"
            className="scroll-mt-header pt-20"
          >
            <h2
              id="editorial-images-heading"
              className="text-3xl font-display font-bold text-foreground sm:text-4xl"
            >
              Editorial preview images
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              These Caraway-created PNG summaries are available for editorial or
              research reference alongside this resource. They summarize separate
              datasets; the Brisbane graphic is a historical 10 October 2022
              snapshot, not a current fleet estimate.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <figure className="rounded-md border border-border bg-card p-4">
                <Image
                  src={VEHICLE_DATA_SOCIAL_IMAGE.src}
                  alt={VEHICLE_DATA_SOCIAL_IMAGE.alt}
                  width={VEHICLE_DATA_SOCIAL_IMAGE.width}
                  height={VEHICLE_DATA_SOCIAL_IMAGE.height}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full rounded-sm border border-border"
                />
                <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Queensland registered-car fuel trends, kept separate from the
                  historical Brisbane suburb snapshot.
                </figcaption>
              </figure>
              <figure className="rounded-md border border-border bg-card p-4">
                <Image
                  src={BRISBANE_REUSE_THUMBNAIL.src}
                  alt={BRISBANE_REUSE_THUMBNAIL.alt}
                  width={BRISBANE_REUSE_THUMBNAIL.width}
                  height={BRISBANE_REUSE_THUMBNAIL.height}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="mx-auto h-auto w-full max-w-xl rounded-sm border border-border"
                />
                <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Historical Brisbane City suburb snapshot — 10 October 2022,
                  not current.
                </figcaption>
              </figure>
            </div>
            <div className="mt-6 rounded-md border border-border bg-secondary p-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Caraway releases these two PNG summaries under{" "}
                <SourceLink
                  href={vehicleData.licenseUrl}
                  label="Creative Commons Attribution 4.0"
                  location="vehicle_data_image_license"
                />
                . When reusing either image, retain the source context, credit
                Caraway and the named source licensors, link to the licence, and
                state whether changes were made.
              </p>
              <ul className="mt-4 list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-foreground">Fuel-trends graphic:</strong>{" "}
                  {fuelImageCredit}
                </li>
                <li>
                  <strong className="text-foreground">Brisbane snapshot graphic:</strong>{" "}
                  {brisbaneImageCredit}
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={VEHICLE_DATA_SOCIAL_IMAGE.src}
                download
                className={downloadClasses}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Queensland fuel-trends graphic (PNG, 1200 × 630)
              </a>
              <a
                href={BRISBANE_REUSE_THUMBNAIL.src}
                download
                className={downloadClasses}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download historical Brisbane suburb-snapshot graphic (PNG, 800 × 800)
              </a>
            </div>
          </section>

          <section
            aria-labelledby="methodology-heading"
            className="pt-20"
          >
            <h2
              id="methodology-heading"
              className="text-3xl font-display font-bold text-foreground sm:text-4xl"
            >
              Methodology, exclusions, and build checks
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-md border border-border bg-card p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Queensland fuel panel
                </h3>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-muted-foreground">
                  <li>Use the single official 70-row State of the Environment table.</li>
                  <li>Filter exactly to Vehicle Type = Cars.</li>
                  <li>Preserve every fuel type and every annual value from 2006–2024.</li>
                  <li>Convert the wide official table to a downloadable long-form CSV.</li>
                </ol>
              </div>
              <div className="rounded-md border border-border bg-card p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Brisbane suburb panel
                </h3>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-muted-foreground">
                  <li>Start with the fixed 10 October 2022 TMR suburb snapshot.</li>
                  <li>
                    Start with the Brisbane City Council boundary catalogue. It also
                    lists five Moreton Bay localities separately from Brisbane&apos;s 190
                    suburbs—Bulwer, Cowan Cowan, Kooringal, Moreton Bay, and Moreton
                    Island—so those five are excluded before matching. Current
                    property-address postcodes are used only to disambiguate names.
                  </li>
                  <li>
                    Exclude 12 alternative same-name or postcode-mismatch TMR rows
                    that did not match the Council postcode reference, representing {numberFormat.format(
                      vehicleData.brisbaneSnapshot.joinAudit.excludedRegistrationCount,
                    )} registrations.
                  </li>
                  <li>
                    Exclude Banks Creek, Chuwar, England Creek, and Lake Manchester:
                    each name appears in Brisbane and another LGA under postcode 4306,
                    while TMR supplies one undivided row. Those four rows represent
                    {` ${numberFormat.format(ambiguousCount)} `}registrations and are
                    not apportioned.
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 rounded-md border border-border bg-secondary p-6">
              <h3 className="text-xl font-semibold text-foreground">
                Important limits
              </h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-muted-foreground">
                <li>
                  The Queensland source may change as registration data is cleansed;
                  it is intended for aggregate trend analysis.
                </li>
                <li>
                  The Brisbane snapshot is historical. Current boundary and address
                  datasets were used only as a conservative reference and do not make
                  the 2022 records current.
                </li>
                <li>
                  The two panels differ in date, geography, and vehicle definition.
                  No Brisbane share of the Queensland series is calculated.
                </li>
                <li>
                  Neither panel measures vehicle sales, prices, buyer demand,
                  removals, recycling, scrappage, or unique transactions.
                </li>
                <li>
                  The script applies a deterministic transformation, but its official
                  reference endpoints can change. A rerun can produce different data
                  or stop for manual review when source metadata, schemas, counts, or
                  matching sets drift; the manifest records the published source
                  projections and hashes.
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={VEHICLE_DATA_SOURCE_MANIFEST}
                download
                className={downloadClasses}
              >
                <FileJson className="h-4 w-4" aria-hidden="true" />
                Download source manifest (JSON)
              </a>
              <a
                href={VEHICLE_DATA_BUILD_SCRIPT}
                download
                className={downloadClasses}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download the source-audited build script
              </a>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The checked-in script runs with Node.js 22 or later. A downloaded copy
              must be given an explicit Caraway repository target, for example{
              " "
              }
              <code className="rounded bg-card px-1.5 py-0.5 text-foreground">
                --output-root /path/to/caraway
              </code>
              ; it stops before fetching or writing if that target is not a Caraway
              repository.
            </p>
          </section>

          <section aria-labelledby="sources-heading" className="pt-20">
            <h2
              id="sources-heading"
              className="text-3xl font-display font-bold text-foreground sm:text-4xl"
            >
              Official sources and attribution
            </h2>
            <ul className="mt-6 space-y-3">
              <li>
                <SourceLink
                  href={vehicleData.fuelTrend.source.pageUrl}
                  label={vehicleData.fuelTrend.source.title}
                  location="vehicle_data_sources"
                />
              </li>
              <li>
                <SourceLink
                  href={vehicleData.brisbaneSnapshot.sources.registrations.pageUrl}
                  label={vehicleData.brisbaneSnapshot.sources.registrations.title}
                  location="vehicle_data_sources"
                />
              </li>
              <li>
                <SourceLink
                  href={vehicleData.brisbaneSnapshot.sources.boundaries.pageUrl}
                  label={vehicleData.brisbaneSnapshot.sources.boundaries.title}
                  location="vehicle_data_sources"
                />
              </li>
              <li>
                <SourceLink
                  href={vehicleData.brisbaneSnapshot.sources.postcodeReference.pageUrl}
                  label={vehicleData.brisbaneSnapshot.sources.postcodeReference.title}
                  location="vehicle_data_sources"
                />
              </li>
              <li>
                <SourceLink
                  href={
                    vehicleData.brisbaneSnapshot.sources.administrativeBoundaries
                      .pageUrl
                  }
                  label={
                    vehicleData.brisbaneSnapshot.sources.administrativeBoundaries
                      .title
                  }
                  location="vehicle_data_sources"
                />
              </li>
            </ul>

            <div className="mt-8 space-y-4 rounded-md border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                Source vehicle data © The State of Queensland (Department of
                Transport and Main Roads), used under CC BY 4.0. Caraway filtered,
                joined, and reformatted the source data; changes were made.
              </p>
              <p>{vehicleData.brisbaneSnapshot.sources.boundaries.attribution}.</p>
              <p>{vehicleData.brisbaneSnapshot.sources.postcodeReference.attribution}.</p>
              <p>
                {
                  vehicleData.brisbaneSnapshot.sources.administrativeBoundaries
                    .attribution
                }. Adapted by Caraway; retrieved 10 August 2026.
              </p>
              <p>
                Caraway&apos;s derived CSV files and source manifest are released under{" "}
                <SourceLink
                  href={vehicleData.licenseUrl}
                  label="Creative Commons Attribution 4.0"
                  location="vehicle_data_license"
                />.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="related-services-heading"
            className="mt-20 rounded-md bg-ink px-6 py-8 text-on-dark sm:px-8"
          >
            <h2
              id="related-services-heading"
              className="text-2xl font-semibold text-on-dark-hi"
            >
              Vehicle-selling information
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-on-dark-hi/85">
              This resource does not estimate an individual vehicle. For commercial
              service information, see Caraway&apos;s{" "}
              <Link
                href="/cash-for-cars-brisbane"
                className="font-semibold text-cta-bright underline underline-offset-4 hover:text-on-dark-hi"
              >
                Brisbane vehicle-buyer quote service
              </Link>{" "}
              and{" "}
              <Link
                href="/car-removal-brisbane"
                className="font-semibold text-cta-bright underline underline-offset-4 hover:text-on-dark-hi"
              >
                vehicle purchase and collection information
              </Link>.
            </p>
          </section>
        </div>
      </PageShell>
    </>
  );
}
