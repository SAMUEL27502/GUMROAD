"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={className ?? "space-y-3"}>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export const DashboardChartsLazy = dynamic(
  () =>
    import("@/components/dashboard/dashboard-charts").then((m) => m.DashboardCharts),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

export const TradingViewChartLazy = dynamic(
  () =>
    import("@/components/charts/tradingview-advanced-chart").then(
      (m) => m.TradingViewAdvancedChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="border-border/60 bg-card/40 flex h-[520px] items-center justify-center rounded-xl border">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    ),
  }
);

export const BotComparisonLazy = dynamic(
  () => import("@/components/compare/bot-comparison").then((m) => m.BotComparison),
  {
    ssr: false,
    loading: () => <ChartSkeleton className="mx-auto max-w-7xl space-y-4 px-4 py-12" />,
  }
);
