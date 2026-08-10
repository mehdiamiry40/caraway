import type { FuelTrendRow } from "@/data/queensland-vehicle-data";

const WIDTH = 760;
const HEIGHT = 360;
const MARGIN = { top: 24, right: 24, bottom: 48, left: 72 } as const;
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

const compactNumber = new Intl.NumberFormat("en-AU", {
  notation: "compact",
  maximumFractionDigits: 0,
});

function linePath(
  rows: FuelTrendRow[],
  getValue: (row: FuelTrendRow) => number,
  maximum: number,
): string {
  return rows
    .map((row, index) => {
      const x = MARGIN.left + (index / (rows.length - 1)) * PLOT_WIDTH;
      const y = MARGIN.top + PLOT_HEIGHT - (getValue(row) / maximum) * PLOT_HEIGHT;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function VehicleFuelTrendChart({ rows }: { rows: FuelTrendRow[] }) {
  const maximumValue = Math.max(
    ...rows.flatMap((row) => [
      row.registrations.Electric,
      row.registrations["Petrol/Electric"],
    ]),
  );
  const axisMaximum = Math.ceil(maximumValue / 30_000) * 30_000;
  const yTicks = Array.from({ length: 5 }, (_, index) =>
    Math.round((axisMaximum / 4) * index),
  );
  const xTickYears = new Set([2006, 2010, 2014, 2018, 2022, 2024]);

  return (
    <figure>
      <div className="rounded-md border border-border bg-card p-3 sm:p-5 shadow-sm">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="fuel-trend-chart-title fuel-trend-chart-description"
          className="block h-auto w-full"
        >
          <title id="fuel-trend-chart-title">
            Queensland registered electric and petrol-electric cars, 2006 to 2024
          </title>
          <desc id="fuel-trend-chart-description">
            A line chart showing electric car records increasing from 1 in 2006 to
            44,398 in 2024, and petrol-electric car records increasing from 102 to
            110,604 over the same period.
          </desc>

          {yTicks.map((tick) => {
            const y =
              MARGIN.top + PLOT_HEIGHT - (tick / axisMaximum) * PLOT_HEIGHT;
            return (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={WIDTH - MARGIN.right}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth="1"
                />
                <text
                  x={MARGIN.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[12px]"
                >
                  {compactNumber.format(tick)}
                </text>
              </g>
            );
          })}

          {rows.map((row, index) => {
            if (!xTickYears.has(row.year)) return null;
            const x = MARGIN.left + (index / (rows.length - 1)) * PLOT_WIDTH;
            return (
              <text
                key={row.year}
                x={x}
                y={HEIGHT - 16}
                textAnchor="middle"
                className="fill-muted-foreground text-[12px]"
              >
                {row.year}
              </text>
            );
          })}

          <line
            x1={MARGIN.left}
            x2={MARGIN.left}
            y1={MARGIN.top}
            y2={MARGIN.top + PLOT_HEIGHT}
            className="stroke-muted-foreground"
            strokeWidth="1.25"
          />
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={MARGIN.top + PLOT_HEIGHT}
            y2={MARGIN.top + PLOT_HEIGHT}
            className="stroke-muted-foreground"
            strokeWidth="1.25"
          />

          <path
            d={linePath(rows, (row) => row.registrations.Electric, axisMaximum)}
            fill="none"
            className="stroke-primary"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={linePath(
              rows,
              (row) => row.registrations["Petrol/Electric"],
              axisMaximum,
            )}
            fill="none"
            className="stroke-accent-ink"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-primary" aria-hidden="true" />
            Electric
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-accent-ink" aria-hidden="true" />
            Petrol/Electric
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Registered-car records in the Queensland State of the Environment table.
        The exact annual values are provided below the chart.
      </figcaption>
    </figure>
  );
}
