import type { Metadata } from "next";
import { AffiliateDashboard } from "@/components/affiliate/affiliate-dashboard";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Affiliate Dashboard",
  description:
    "Track your TradeBib referral link, clicks, conversions, commissions, and withdrawals.",
  path: "/referrals",
  noIndex: true,
});

export default function ReferralsPage() {
  return <AffiliateDashboard />;
}
