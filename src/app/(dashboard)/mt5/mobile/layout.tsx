import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "MT5 Mobile Terminal",
  description:
    "MetaTrader 5 mobile-style Quotes, Chart, Trade, and History terminal preview synced with TradeBib MT5 accounts.",
  path: "/mt5/mobile",
  keywords: ["MT5 mobile", "MetaTrader 5 mobile", "MT5 quotes", "mobile trading terminal"],
});

export default function Mt5MobileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
