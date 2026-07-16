import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Copy Trading",
  description:
    "Allocate capital to top TradeBib leaders and mirror their verified MT5 strategies.",
  path: "/copy",
  noIndex: true,
  keywords: ["copy trading", "social trading", "TradeBib"],
});

export default function CopyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
