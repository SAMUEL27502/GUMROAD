import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Profit Calculator",
  description: "Estimate Expert Advisor profits, ROI, and drawdown scenarios before you subscribe.",
  path: "/calculator",
});

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
