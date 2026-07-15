"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy, Users } from "lucide-react";
import { leaderboard } from "@/lib/data/platform";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

const rankIcons = [
  { icon: Crown, color: "text-amber-400" },
  { icon: Medal, color: "text-slate-300" },
  { icon: Trophy, color: "text-amber-600" },
];

export default function LeaderboardPage() {
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Trader Leaderboard</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Top-performing traders on TradeBib ranked by verified ROI and portfolio size.
        </p>
      </motion.div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {topThree.map((trader, i) => {
          const { icon: Icon, color } = rankIcons[i];
          return (
            <motion.div
              key={trader.rank}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={i === 0 ? "md:order-2 md:-mt-4" : i === 1 ? "md:order-1" : "md:order-3"}
            >
              <Card
                className={`glass border-border/60 text-center ${
                  i === 0 ? "border-amber-500/30 shadow-amber-500/10" : ""
                }`}
              >
                <CardContent className="p-6">
                  <Icon className={`mx-auto h-8 w-8 ${color}`} />
                  <Badge variant="secondary" className="mt-3">
                    #{trader.rank}
                  </Badge>
                  <h3 className="mt-2 text-xl font-bold">{trader.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-emerald-400">
                    {formatPercent(trader.roi)}
                  </p>
                  <div className="text-muted-foreground mt-4 flex justify-center gap-4 text-sm">
                    <span>{trader.bots} bots</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {trader.followers.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>Full leaderboard standings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rest.map((trader, i) => (
                <motion.div
                  key={trader.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="border-border/60 bg-muted/20 flex items-center justify-between rounded-xl border px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground w-8 text-center font-bold">
                      #{trader.rank}
                    </span>
                    <span className="font-medium">{trader.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-muted-foreground">{trader.bots} bots</span>
                    <span className="font-bold text-emerald-400">{formatPercent(trader.roi)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
