import type { Metadata } from "next";
import { Suspense } from "react";
import { BotComparison } from "@/components/compare/bot-comparison";
import { PageLoader } from "@/components/ui/loader";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Bot Comparison",
  description:
    "Compare multiple MetaTrader 5 Expert Advisors on performance, ROI, drawdown, win rate, charts, and pricing.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BotComparison />
    </Suspense>
  );
}
