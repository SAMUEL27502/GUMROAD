import type { Metadata } from "next";
import { Suspense } from "react";
import { BotComparisonLazy } from "@/components/performance/lazy-charts";
import { PageLoader } from "@/components/ui/loader";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Bot Comparison — Performance, ROI, Drawdown & Pricing",
  description:
    "Compare multiple MetaTrader 5 Expert Advisors side by side: performance, ROI, drawdown, win rate, charts, and pricing.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BotComparisonLazy />
    </Suspense>
  );
}
