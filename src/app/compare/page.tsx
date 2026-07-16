import type { Metadata } from "next";
import { Suspense } from "react";
import { BotComparison } from "@/components/compare/bot-comparison";
import { PageLoader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Bot Comparison | TradeBib",
  description:
    "Compare multiple MetaTrader 5 Expert Advisors on performance, ROI, drawdown, win rate, charts, and pricing.",
};

export default function ComparePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BotComparison />
    </Suspense>
  );
}
