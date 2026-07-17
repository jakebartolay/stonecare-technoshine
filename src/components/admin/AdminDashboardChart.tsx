import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { PieChart } from "@mui/x-charts/PieChart";
import { RadarChart } from "@mui/x-charts/RadarChart";
import { memo, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  CircleCheck,
  Database,
  PackageCheck,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import type { AdminCounts } from "@/lib/admin-store";

type AdminDashboardChartProps = {
  counts: AdminCounts;
  hasData: boolean;
  hasError: boolean;
  isRefreshing: boolean;
  lastUpdatedAt: number | null;
};

const collectionLabels = ["Employees", "Services", "Gallery", "Reels", "Reviews", "Products", "Content"];
const barYAxis = [{ scaleType: "band" as const, data: collectionLabels, width: 86 }];
const barXAxis = [{ min: 0, tickMinStep: 1 }];
const barGrid = { vertical: true };
const barMargin = { left: 8, right: 24, top: 10, bottom: 30 };
const pieMargin = { left: 8, right: 8, top: 8, bottom: 8 };
const chartColors = ["#ff6b00", "#171717", "#14b8a6", "#f59e0b", "#a855f7", "#0ea5e9", "#10b981"];
const productStatusColors = ["#ff6b00", "#d4d4d4"];
const numberFormatter = new Intl.NumberFormat("en-PH");
const timeFormatter = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});
const syncConfirmationDurationMs = 3_500;
const cartesianChartSx = {
  "& .MuiChartsAxis-tickLabel": {
    fill: "#525252",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 11,
  },
  "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
    stroke: "#d4d4d4",
  },
  "& .MuiChartsGrid-line": {
    stroke: "#e5e5e5",
    strokeDasharray: "3 5",
  },
};
const gaugeSx = {
  [`& .${gaugeClasses.valueText}`]: {
    fill: "#171717",
    fontFamily: "Orbitron, sans-serif",
    fontSize: 30,
    fontWeight: 700,
  },
  [`& .${gaugeClasses.valueArc}`]: {
    fill: "#ff6b00",
  },
  [`& .${gaugeClasses.referenceArc}`]: {
    fill: "#e5e5e5",
  },
};

const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <time dateTime={new Date(now).toISOString()} title="Current local time">
      {timeFormatter.format(now)}
    </time>
  );
});

function EmptyChartState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-5 text-center">
      <Database className="h-7 w-7 text-primary" aria-hidden="true" />
      <p className="mt-3 font-bold text-neutral-900">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

function InsightCard({
  children,
  description,
  eyebrow,
  id,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <Card
      component="article"
      variant="outlined"
      className="min-w-0 !overflow-hidden !rounded-xl !border-neutral-200 !bg-white !shadow-md !shadow-neutral-200/60"
    >
      <div className="h-1 bg-gradient-to-r from-primary via-orange-300 to-neutral-950" aria-hidden="true" />
      <CardContent className="!p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        <h3 id={id} className="mt-2 text-xl text-neutral-950">{title}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600">{description}</p>
        <div className="mt-3 min-w-0">{children}</div>
      </CardContent>
    </Card>
  );
}

const AdminDashboardChart = memo(function AdminDashboardChart({
  counts,
  hasData,
  hasError,
  isRefreshing,
  lastUpdatedAt,
}: AdminDashboardChartProps) {
  const lastAnnouncedSyncRef = useRef<number | null>(null);
  const [showSyncUpdated, setShowSyncUpdated] = useState(false);
  const summary = useMemo(() => {
    const collectionValues = [
      counts.employees,
      counts.services,
      counts.galleryImages,
      counts.reels,
      counts.testimonials,
      counts.products,
      counts.contentSections,
    ];
    const data = collectionLabels.map((label, index) => ({
      label,
      records: collectionValues[index],
    }));
    const totalRecords = collectionValues.reduce((total, records) => total + records, 0);
    const largestCollection = data.reduce(
      (largest, item) => (item.records > largest.records ? item : largest),
      data[0],
    );
    const publishedProducts = Math.min(counts.publishedProducts, counts.products);
    const unpublishedProducts = Math.max(counts.products - publishedProducts, 0);
    const publishingRate = counts.products
      ? Math.round((publishedProducts / counts.products) * 100)
      : 0;

    return {
      barSeries: [
        {
          data: collectionValues,
          label: "Records",
          color: "#ff6b00",
          valueFormatter: (value: number | null) => numberFormatter.format(value ?? 0),
        },
      ],
      collectionValues,
      largestCollection,
      maxCollection: Math.max(1, ...collectionValues),
      populatedCollections: collectionValues.filter((value) => value > 0).length,
      productStatusData: [
        { id: "published", label: "Published", value: publishedProducts },
        { id: "draft", label: "Draft", value: unpublishedProducts },
      ],
      publishedProducts,
      publishingRate,
      radarSeries: [
        {
          data: collectionValues,
          label: "Records",
          color: "#ff6b00",
          fillArea: true,
        },
      ],
      totalRecords,
      unpublishedProducts,
    };
  }, [
    counts.contentSections,
    counts.employees,
    counts.galleryImages,
    counts.products,
    counts.publishedProducts,
    counts.reels,
    counts.testimonials,
    counts.services,
  ]);
  const snapshotUnavailable = hasError && !hasData;
  const syncStatusLabel = isRefreshing
    ? "Syncing data"
    : hasError
      ? "Update delayed"
      : showSyncUpdated
        ? "Sync data updated"
        : null;
  const syncStatusIsError = !isRefreshing && hasError;

  useEffect(() => {
    if (!hasData || hasError || isRefreshing || lastUpdatedAt === null) {
      setShowSyncUpdated(false);
      return;
    }

    if (lastAnnouncedSyncRef.current !== lastUpdatedAt) {
      lastAnnouncedSyncRef.current = lastUpdatedAt;
      setShowSyncUpdated(true);
    }

    const timeoutId = window.setTimeout(
      () => setShowSyncUpdated(false),
      syncConfirmationDurationMs,
    );
    return () => window.clearTimeout(timeoutId);
  }, [hasData, hasError, isRefreshing, lastUpdatedAt]);

  return (
    <>
      <section
        aria-labelledby="records-overview-title"
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md shadow-neutral-200/60"
      >
        <div className="grid xl:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Operations snapshot
                </p>
                <h2 id="records-overview-title" className="mt-2 text-2xl text-neutral-950">
                  Live records overview
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                  Current records across the admin workspace. Values refresh after data changes.
                </p>
              </div>

              {syncStatusLabel !== null ? (
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                    syncStatusIsError
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : isRefreshing
                        ? "border-sky-200 bg-sky-50 text-sky-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                  role={syncStatusIsError ? "alert" : "status"}
                  aria-live={syncStatusIsError ? "assertive" : "polite"}
                  aria-atomic="true"
                >
                  {syncStatusIsError ? (
                    <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : isRefreshing ? (
                    <RefreshCw className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" />
                  ) : (
                    <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {syncStatusLabel}
                </div>
              ) : null}
            </div>

            {summary.totalRecords > 0 ? (
              <figure className="mt-6 min-w-0" aria-label="Admin records by collection">
                <BarChart
                  title="Admin records by collection"
                  desc="Horizontal bars comparing employees, services, gallery, reels, reviews, products, and content records."
                  height={304}
                  layout="horizontal"
                  xAxis={barXAxis}
                  yAxis={barYAxis}
                  series={summary.barSeries}
                  colors={chartColors}
                  grid={barGrid}
                  margin={barMargin}
                  borderRadius={6}
                  hideLegend
                  sx={cartesianChartSx}
                />
                <figcaption className="sr-only">
                  {collectionLabels
                    .map((label, index) => `${label}: ${numberFormatter.format(summary.collectionValues[index])}`)
                    .join(", ")}
                </figcaption>
              </figure>
            ) : snapshotUnavailable ? (
              <div
                role="alert"
                className="mt-6 flex min-h-[19rem] flex-col items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-6 text-center"
              >
                <TriangleAlert className="h-8 w-8 text-amber-600" aria-hidden="true" />
                <p className="mt-4 text-lg font-bold text-neutral-900">Snapshot unavailable</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">
                  The dashboard will retry automatically when the admin API is available.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex min-h-[19rem] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center">
                <Database className="h-8 w-8 text-primary" aria-hidden="true" />
                <p className="mt-4 text-lg font-bold text-neutral-900">No records yet</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">
                  Add your first employee, service, product, reel, or content section to populate this chart.
                </p>
              </div>
            )}
          </div>

          <aside className="flex flex-col bg-neutral-950 p-5 text-white sm:p-6">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
              Workspace health
            </div>

            <div className="mt-7 border-b border-white/10 pb-6">
              <p className="text-sm text-white/55">Managed records</p>
              <p className="mt-2 font-display text-5xl font-bold leading-none text-white" aria-live="polite">
                {hasData ? numberFormatter.format(summary.totalRecords) : "--"}
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                {hasData
                  ? "Across employees, services, gallery, reels, reviews, products, and content."
                  : "No database snapshot has been received yet."}
              </p>
            </div>

            <div className="border-b border-white/10 py-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
                  Live viewers
                </div>
                <span className="font-mono text-sm font-bold text-primary">
                  {hasData ? numberFormatter.format(counts.liveVisitors) : "--"}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Visitors seen on public pages during the last two minutes.
              </p>
            </div>

            <div className="py-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <PackageCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Product visibility
                </div>
                <span className="font-mono text-sm font-bold text-primary">
                  {hasData ? `${summary.publishingRate}%` : "--"}
                </span>
              </div>
              {hasData ? (
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="Published products"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={summary.publishingRate}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${summary.publishingRate}%` }}
                  />
                </div>
              ) : (
                <div className="mt-4 h-2 rounded-full bg-white/10" aria-hidden="true" />
              )}
              <div className="mt-3 flex justify-between gap-4 text-xs text-white/50">
                <span>{hasData ? `${summary.publishedProducts} published` : "-- published"}</span>
                <span>{hasData ? `${summary.unpublishedProducts} draft` : "-- draft"}</span>
              </div>
            </div>

            <dl className="mt-auto border-t border-white/10 pt-5">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/45">Live clock</dt>
                <dd className="font-mono text-xs font-bold tabular-nums text-white">
                  <LiveClock />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/45">Largest collection</dt>
                <dd className="text-sm font-bold text-white">
                  {hasData
                    ? summary.totalRecords > 0
                      ? summary.largestCollection.label
                      : "None"
                    : "Unavailable"}
                </dd>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/45">Records</dt>
                <dd className="font-mono text-sm font-bold text-primary">
                  {hasData && summary.totalRecords > 0
                    ? numberFormatter.format(summary.largestCollection.records)
                    : "--"}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section aria-labelledby="dashboard-insights-title" className="mt-5">
        <div className="mb-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Material analytics
          </p>
          <h2 id="dashboard-insights-title" className="mt-2 text-2xl text-neutral-950">
            More workspace insights
          </h2>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            id="product-status-chart-title"
            eyebrow="Donut chart"
            title="Product status"
            description="Published products compared with drafts in the current shop catalog."
          >
            {hasData && counts.products > 0 ? (
              <figure aria-labelledby="product-status-chart-title">
                <PieChart
                  title="Published and draft products"
                  desc={`${summary.publishedProducts} published products and ${summary.unpublishedProducts} draft products.`}
                  height={240}
                  hideLegend
                  colors={productStatusColors}
                  margin={pieMargin}
                  series={[
                    {
                      data: summary.productStatusData,
                      innerRadius: "58%",
                      outerRadius: "88%",
                      paddingAngle: 3,
                      cornerRadius: 5,
                      arcLabel: (item) => numberFormatter.format(item.value),
                      arcLabelMinAngle: 32,
                    },
                  ]}
                />
                <figcaption className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-neutral-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                    {summary.publishedProducts} Published
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" aria-hidden="true" />
                    {summary.unpublishedProducts} Draft
                  </span>
                </figcaption>
              </figure>
            ) : (
              <EmptyChartState
                title={snapshotUnavailable ? "Product data unavailable" : "No products yet"}
                description="Add products to compare published items and drafts."
              />
            )}
          </InsightCard>

          <InsightCard
            id="collection-footprint-chart-title"
            eyebrow="Radar chart"
            title="Collection footprint"
            description="A profile of record volume across the main admin collections."
          >
            {hasData && summary.totalRecords > 0 ? (
              <figure aria-labelledby="collection-footprint-chart-title">
                <RadarChart
                  title="Admin collection footprint"
                  desc="Radar chart comparing employees, services, gallery, reels, reviews, products, and content records."
                  height={270}
                  hideLegend
                  colors={["#ff6b00"]}
                  radar={{ metrics: collectionLabels, max: summary.maxCollection }}
                  series={summary.radarSeries}
                  divisions={4}
                  shape="circular"
                />
                <figcaption className="sr-only">
                  {collectionLabels
                    .map((label, index) => `${label}: ${summary.collectionValues[index]}`)
                    .join(", ")}
                </figcaption>
              </figure>
            ) : (
              <EmptyChartState
                title={snapshotUnavailable ? "Collection data unavailable" : "No collection records yet"}
                description="Add records to compare the footprint of each admin collection."
              />
            )}
          </InsightCard>

          <InsightCard
            id="populated-collections-chart-title"
            eyebrow="Gauge chart"
            title="Populated collections"
            description="How many admin collections currently contain at least one record."
          >
            {hasData ? (
              <figure aria-labelledby="populated-collections-chart-title">
                <Gauge
                  height={240}
                  value={summary.populatedCollections}
                  valueMin={0}
                  valueMax={7}
                  startAngle={-110}
                  endAngle={110}
                  innerRadius="72%"
                  outerRadius="94%"
                  cornerRadius="50%"
                  text={({ value }) => `${value}/7`}
                  aria-labelledby="populated-collections-chart-title"
                  aria-valuetext={`${summary.populatedCollections} of 7 collections populated`}
                  sx={gaugeSx}
                />
                <figcaption className="text-center text-xs leading-5 text-neutral-600">
                  {summary.populatedCollections} active collection{summary.populatedCollections === 1 ? "" : "s"}
                </figcaption>
              </figure>
            ) : (
              <EmptyChartState
                title="Collection status unavailable"
                description="The gauge will update after a dashboard snapshot is received."
              />
            )}
          </InsightCard>
        </div>
      </section>
    </>
  );
});

export default AdminDashboardChart;
