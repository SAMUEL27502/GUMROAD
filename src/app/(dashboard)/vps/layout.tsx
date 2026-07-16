import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "VPS Hosting",
  description:
    "Provision low-latency VPS near broker servers and keep your MT5 bots online 24/7.",
  path: "/vps",
  noIndex: true,
  keywords: ["VPS", "MT5 hosting", "low latency", "TradeBib"],
});

export default function VpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
