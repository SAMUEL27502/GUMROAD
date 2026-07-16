import type { Metadata } from "next";
import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Leaderboard",
  description:
    "TradeBib leaderboard — top traders, top bots, most profitable performers, and most followed accounts.",
  path: "/leaderboard",
});

export default function LeaderboardPage() {
  return <LeaderboardBoard />;
}
