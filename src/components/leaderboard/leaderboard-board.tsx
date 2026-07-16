"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bot,
  Crown,
  Medal,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import {
  getMostFollowedBots,
  getMostFollowedTraders,
  getMostProfitableBots,
  getMostProfitableTraders,
  getTopBots,
  topTraders,
  type LeaderboardBotEntry,
  type LeaderboardTrader,
} from "@/lib/data/leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const rankIcons = [
  { icon: Crown, color: "text-amber-400" },
  { icon: Medal, color: "text-slate-300" },
  { icon: Trophy, color: "text-amber-600" },
];

type TabKey = "traders" | "bots" | "profitable" | "followed";

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const { icon: Icon, color } = rankIcons[rank - 1];
    return <Icon className={cn("h-5 w-5", color)} />;
  }
  return <span className="text-muted-foreground w-5 text-center text-sm font-bold">#{rank}</span>;
}

function TraderPodium({ traders }: { traders: LeaderboardTrader[] }) {
  const topThree = traders.slice(0, 3);
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {topThree.map((trader, i) => {
        const { icon: Icon, color } = rankIcons[i];
        return (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={i === 0 ? "md:order-2 md:-mt-4" : i === 1 ? "md:order-1" : "md:order-3"}
          >
            <Card
              className={cn(
                "border-border/70 bg-card/80 text-center",
                i === 0 && "border-amber-500/40 shadow-lg shadow-amber-500/10"
              )}
            >
              <CardContent className="p-6">
                <Icon className={cn("mx-auto h-8 w-8", color)} />
                <Badge variant="secondary" className="mt-3">
                  #{trader.rank}
                </Badge>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <h3 className="text-xl font-bold">
                    <Link
                      href={`/traders/${trader.slug}`}
                      className="hover:text-sky-300 focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {trader.name}
                    </Link>
                  </h3>
                  {trader.verified ? <BadgeCheck className="h-4 w-4 text-sky-400" /> : null}
                </div>
                <p className="text-muted-foreground text-xs">{trader.handle}</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href={`/traders/${trader.slug}`}>View profile</Link>
                </Button>
                <p className="mt-3 text-3xl font-bold text-emerald-400">
                  {formatPercent(trader.roi)}
                </p>
                <div className="text-muted-foreground mt-4 flex flex-wrap justify-center gap-3 text-sm">
                  <span>{formatCurrency(trader.profit)} P&L</span>
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
  );
}

function BotPodium({ entries }: { entries: LeaderboardBotEntry[] }) {
  const topThree = entries.slice(0, 3);
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {topThree.map((entry, i) => {
        const { icon: Icon, color } = rankIcons[i];
        const bot = entry.bot;
        return (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={i === 0 ? "md:order-2 md:-mt-4" : i === 1 ? "md:order-1" : "md:order-3"}
          >
            <Card
              className={cn(
                "border-border/70 bg-card/80 overflow-hidden text-center",
                i === 0 && "border-amber-500/40 shadow-lg shadow-amber-500/10"
              )}
            >
              <div className={cn("h-16 bg-gradient-to-br", bot.imageGradient)} />
              <CardContent className="p-6">
                <Icon className={cn("mx-auto -mt-2 h-8 w-8", color)} />
                <Badge variant="secondary" className="mt-3">
                  #{entry.rank}
                </Badge>
                <h3 className="mt-2 text-xl font-bold">{bot.name}</h3>
                <p className="text-muted-foreground text-xs">
                  {bot.strategy} · {bot.tradingPair}
                </p>
                <p className="mt-3 text-3xl font-bold text-emerald-400">
                  {formatPercent(bot.roi)}
                </p>
                <div className="text-muted-foreground mt-4 flex flex-wrap justify-center gap-3 text-sm">
                  <span>{bot.subscribers.toLocaleString()} followers</span>
                  <span>{bot.rating.toFixed(1)}★</span>
                </div>
                <Button className="mt-4" variant="outline" size="sm" asChild>
                  <Link href={`/bots/${bot.slug}`}>View bot</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function TraderTable({
  traders,
  metric,
}: {
  traders: LeaderboardTrader[];
  metric: "roi" | "profit" | "followers";
}) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle>Rankings</CardTitle>
        <CardDescription>
          {metric === "roi" && "Sorted by verified ROI"}
          {metric === "profit" && "Sorted by realized profit"}
          {metric === "followers" && "Sorted by follower count"}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-border/60 border-b text-left">
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Rank</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Trader</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">ROI</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Profit</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Bots</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Followers</th>
              <th className="text-muted-foreground pb-3 font-medium">Win rate</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((trader, i) => (
              <motion.tr
                key={trader.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-border/40 border-b last:border-0"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={trader.rank} />
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
                      {trader.name.charAt(0)}
                    </div>
                    <div>
                      <p className="flex items-center gap-1 font-medium">
                        {trader.name}
                        {trader.verified ? (
                          <BadgeCheck className="h-3.5 w-3.5 text-sky-400" />
                        ) : null}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {trader.handle} · {trader.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className={cn(
                    "py-3 pr-4 font-semibold",
                    metric === "roi" ? "text-emerald-400" : "text-foreground"
                  )}
                >
                  {formatPercent(trader.roi)}
                </td>
                <td
                  className={cn(
                    "py-3 pr-4 font-semibold",
                    metric === "profit" ? "text-emerald-400" : "text-foreground"
                  )}
                >
                  {formatCurrency(trader.profit)}
                </td>
                <td className="py-3 pr-4">{trader.bots}</td>
                <td
                  className={cn(
                    "py-3 pr-4 font-semibold",
                    metric === "followers" ? "text-sky-400" : "text-foreground"
                  )}
                >
                  {trader.followers.toLocaleString()}
                </td>
                <td className="py-3">{trader.winRate.toFixed(1)}%</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function BotTable({
  entries,
  metric,
}: {
  entries: LeaderboardBotEntry[];
  metric: "score" | "roi" | "followers";
}) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle>Bot rankings</CardTitle>
        <CardDescription>
          {metric === "score" && "Composite score from ROI, rating, win rate, and followers"}
          {metric === "roi" && "Sorted by monthly ROI"}
          {metric === "followers" && "Sorted by subscriber count"}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-border/60 border-b text-left">
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Rank</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Bot</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">ROI</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Drawdown</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Followers</th>
              <th className="text-muted-foreground pb-3 pr-4 font-medium">Rating</th>
              <th className="text-muted-foreground pb-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const bot = entry.bot;
              return (
                <motion.tr
                  key={bot.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-border/40 border-b last:border-0"
                >
                  <td className="py-3 pr-4">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/bots/${bot.slug}`}
                      className="group flex items-center gap-3 hover:text-sky-300"
                    >
                      <div
                        className={cn(
                          "h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br",
                          bot.imageGradient
                        )}
                      />
                      <div>
                        <p className="font-medium group-hover:underline">{bot.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {bot.strategy} · {bot.tradingPair}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td
                    className={cn(
                      "py-3 pr-4 font-semibold",
                      metric === "roi" || metric === "score"
                        ? "text-emerald-400"
                        : "text-foreground"
                    )}
                  >
                    {formatPercent(bot.roi)}
                  </td>
                  <td className="py-3 pr-4">{bot.drawdown.toFixed(1)}%</td>
                  <td
                    className={cn(
                      "py-3 pr-4 font-semibold",
                      metric === "followers" ? "text-sky-400" : "text-foreground"
                    )}
                  >
                    {bot.subscribers.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">{bot.rating.toFixed(1)}★</td>
                  <td className="py-3">{formatCurrency(bot.price)}/mo</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function LeaderboardBoard() {
  const [tab, setTab] = useState<TabKey>("traders");

  const topBots = useMemo(() => getTopBots(10), []);
  const profitableBots = useMemo(() => getMostProfitableBots(10), []);
  const followedBots = useMemo(() => getMostFollowedBots(10), []);
  const profitableTraders = useMemo(() => getMostProfitableTraders(10), []);
  const followedTraders = useMemo(() => getMostFollowedTraders(10), []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <Badge className="mb-4 border-sky-500/30 bg-sky-500/10 text-sky-300">
          <Trophy className="mr-1.5 h-3.5 w-3.5" />
          Live standings
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Top traders, top bots, most profitable performers, and most followed accounts on
          TradeBib.
        </p>
      </motion.div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { key: "traders" as const, label: "Top traders", icon: Users, hint: "By ROI" },
          { key: "bots" as const, label: "Top bots", icon: Bot, hint: "Composite score" },
          {
            key: "profitable" as const,
            label: "Most profitable",
            icon: Wallet,
            hint: "Profit & ROI",
          },
          {
            key: "followed" as const,
            label: "Most followed",
            icon: TrendingUp,
            hint: "Subscribers",
          },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-sky-500/50 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                  : "border-border/70 bg-card/60 hover:border-sky-500/30"
              )}
            >
              <Icon className={cn("mb-2 h-5 w-5", active ? "text-sky-400" : "text-muted-foreground")} />
              <p className="font-semibold">{item.label}</p>
              <p className="text-muted-foreground text-xs">{item.hint}</p>
            </button>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="mb-6 hidden">
          <TabsTrigger value="traders">Top traders</TabsTrigger>
          <TabsTrigger value="bots">Top bots</TabsTrigger>
          <TabsTrigger value="profitable">Most profitable</TabsTrigger>
          <TabsTrigger value="followed">Most followed</TabsTrigger>
        </TabsList>

        <TabsContent value="traders" className="mt-0 space-y-6">
          <TraderPodium traders={topTraders} />
          <TraderTable traders={topTraders} metric="roi" />
        </TabsContent>

        <TabsContent value="bots" className="mt-0 space-y-6">
          <BotPodium entries={topBots} />
          <BotTable entries={topBots} metric="score" />
        </TabsContent>

        <TabsContent value="profitable" className="mt-0 space-y-8">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Most profitable bots</h2>
            <BotPodium entries={profitableBots} />
            <BotTable entries={profitableBots} metric="roi" />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Most profitable traders</h2>
            <TraderTable traders={profitableTraders} metric="profit" />
          </div>
        </TabsContent>

        <TabsContent value="followed" className="mt-0 space-y-8">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Most followed bots</h2>
            <BotPodium entries={followedBots} />
            <BotTable entries={followedBots} metric="followers" />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Most followed traders</h2>
            <TraderTable traders={followedTraders} metric="followers" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/marketplace">Browse marketplace</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/recommend">Get AI recommendations</Link>
        </Button>
      </div>
    </div>
  );
}
