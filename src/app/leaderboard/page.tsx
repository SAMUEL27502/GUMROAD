import type { Metadata } from "next";
import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";

export const metadata: Metadata = {
  title: "Leaderboard | TradeBib",
  description:
    "TradeBib leaderboard — top traders, top bots, most profitable performers, and most followed accounts.",
};

export default function LeaderboardPage() {
  return <LeaderboardBoard />;
}
