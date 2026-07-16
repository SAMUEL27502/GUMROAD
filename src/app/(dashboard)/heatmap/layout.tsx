import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Portfolio Heatmap",
  description:
    "Visualize bot allocation and weekly PnL intensity across your TradeBib portfolio.",
  path: "/heatmap",
  noIndex: true,
  keywords: ["portfolio heatmap", "bot allocation", "PnL", "TradeBib"],
});

export default function HeatmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
