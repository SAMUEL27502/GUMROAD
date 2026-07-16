import type { Metadata } from "next";
import { RecommendationEngine } from "@/components/recommend/recommendation-engine";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "AI Bot Recommendations",
  description:
    "Get personalized MetaTrader 5 Expert Advisor recommendations based on risk tolerance, capital, experience, trading style, and favorite pairs.",
  path: "/recommend",
});

export default function RecommendPage() {
  return <RecommendationEngine />;
}
