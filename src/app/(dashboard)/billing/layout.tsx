import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Billing",
  description: "Manage TradeBib subscriptions, invoices, and payment methods.",
  path: "/billing",
  noIndex: true,
});

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
