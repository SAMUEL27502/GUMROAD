import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Trading Signals",
  description:
    "High-confidence forex and metals signals from TradeBib bots — entry, take-profit, stop-loss, and rationale.",
  path: "/signals",
  keywords: ["trading signals", "forex signals", "MT5", "TradeBib"],
});

export default function SignalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
