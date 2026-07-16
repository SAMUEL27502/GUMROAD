import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Alerts",
  description:
    "Configure email and Telegram alerts for trades, drawdown, signals, billing, and security.",
  path: "/alerts",
  noIndex: true,
  keywords: ["alerts", "Telegram", "email notifications", "TradeBib"],
});

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
