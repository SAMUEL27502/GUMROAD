import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "MT5 Connect",
  description:
    "Connect your MetaTrader 5 account with investor password sync. Monitor balance, equity, and trades in TradeBib.",
  path: "/mt5",
  keywords: ["MT5 connect", "investor password", "MetaTrader sync"],
});

export default function Mt5Layout({ children }: { children: React.ReactNode }) {
  return children;
}
