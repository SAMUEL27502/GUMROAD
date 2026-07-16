import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "TradeBib pricing plans — Starter, Pro, and Elite. Monthly or yearly billing with Stripe and PayPal.",
  path: "/pricing",
  keywords: ["TradeBib pricing", "EA subscription", "MT5 bots pricing"],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
