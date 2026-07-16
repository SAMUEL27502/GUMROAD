import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About TradeBib",
  description:
    "Learn about TradeBib — the marketplace for verified MetaTrader 5 Expert Advisors and automated trading tools.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
