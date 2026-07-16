import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Live Charts",
  description: "TradingView-powered live charts for forex, metals, crypto, and indices on TradeBib.",
  path: "/charts",
});

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
