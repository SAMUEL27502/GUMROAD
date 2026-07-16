import type { Metadata } from "next";
import { RecommendationEngine } from "@/components/recommend/recommendation-engine";

export const metadata: Metadata = {
  title: "AI Bot Recommendations | TradeBib",
  description:
    "Get personalized MetaTrader 5 Expert Advisor recommendations based on risk tolerance, capital, experience, trading style, and favorite pairs.",
};

export default function RecommendPage() {
  return <RecommendationEngine />;
}
