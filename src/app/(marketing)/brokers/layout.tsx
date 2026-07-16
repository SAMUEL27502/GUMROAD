import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Broker Directory",
  description:
    "Compare regulated brokers with MT5 support, ratings, and minimum deposits for TradeBib automation.",
  path: "/brokers",
  keywords: ["brokers", "MT5 brokers", "forex brokers", "TradeBib"],
});

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
