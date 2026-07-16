import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "KYC Verification",
  description:
    "Complete identity verification to unlock higher limits and compliance-ready withdrawals on TradeBib.",
  path: "/kyc",
  noIndex: true,
  keywords: ["KYC", "identity verification", "compliance", "TradeBib"],
});

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return children;
}
