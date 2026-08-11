import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "MT5 Code Lab",
  description:
    "Share and study MetaTrader 5 (MQL5) code for education and analysis — Expert Advisors, indicators, scripts, and deal-history analyzers.",
  path: "/learn",
  keywords: [
    "MT5",
    "MQL5",
    "MetaTrader 5",
    "Expert Advisor education",
    "trading code analysis",
    "TradeBib",
  ],
});

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
