import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse verified MetaTrader 5 Expert Advisors. Filter by category, risk, ROI, price, and strategy. Save bots to your wishlist.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
