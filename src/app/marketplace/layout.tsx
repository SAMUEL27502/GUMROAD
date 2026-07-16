import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Marketplace",
  description:
    "Browse verified MetaTrader 5 Expert Advisors. Filter by category, risk, ROI, price, and strategy.",
  path: "/marketplace",
  keywords: ["MT5 marketplace", "Expert Advisors", "forex bots", "TradeBib"],
});

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
