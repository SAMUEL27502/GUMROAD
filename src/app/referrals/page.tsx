import type { Metadata } from "next";
import { AffiliateDashboard } from "@/components/affiliate/affiliate-dashboard";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | TradeBib",
  description:
    "Track your TradeBib referral link, clicks, conversions, commissions, and withdrawals.",
};

export default function ReferralsPage() {
  return <AffiliateDashboard />;
}
