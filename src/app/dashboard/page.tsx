"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Bot,
  DollarSign,
  Eye,
  Gift,
  Globe2,
  LineChart,
  Plus,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardChartsLazy } from "@/components/performance/lazy-charts";
import { bots } from "@/lib/data/bots";
import {
  activities,
  botAllocation,
  dashboardMetrics,
  monthlyProfitSeries,
  recentTrades,
  watchlistSymbols,
} from "@/lib/data/platform";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import { useWatchlistStore } from "@/stores/watchlist-store";

const fallbackActiveSlugs = [
  "goldscalper-pro",
  "eurotrend-ai",
  "nightowl-grid",
  "breakouthunter",
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { subscriptions } = useSubscriptionsStore();
  const { items: notificationItems, markRead, unreadCount } = useNotificationsStore();
  const previewNotifications = [...notificationItems]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const { symbols, toggleSymbol } = useWatchlistStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const activeBots = useMemo(() => {
    const fromSubs = subscriptions
      .filter((s) => s.status === "ACTIVE")
      .map((s) => bots.find((b) => b.id === s.botId))
      .filter(Boolean) as typeof bots;
    if (fromSubs.length > 0) return fromSubs;
    return bots.filter((b) => fallbackActiveSlugs.includes(b.slug));
  }, [subscriptions]);

  const watchlistItems = useMemo(
    () => watchlistSymbols.filter((s) => symbols.includes(s.symbol)),
    [symbols]
  );

  const marketOverview = useMemo(
    () => [...watchlistSymbols].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)),
    []
  );

  if (isLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  const metrics = [
    {
      label: "Portfolio Balance",
      value: formatCurrency(dashboardMetrics.balance),
      change: formatPercent(dashboardMetrics.monthlyRoi),
      icon: Wallet,
      color: "from-sky-500/20 to-sky-500/5",
    },
    {
      label: "Monthly ROI",
      value: formatPercent(dashboardMetrics.monthlyRoi),
      change: "+1.2% vs last month",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      label: "Total Profit",
      value: formatCurrency(dashboardMetrics.profit),
      change: `${dashboardMetrics.openTrades} open trades`,
      icon: DollarSign,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      label: "Active Bots",
      value: String(activeBots.length || dashboardMetrics.activeBots),
      change: `${dashboardMetrics.totalTrades.toLocaleString()} total trades`,
      icon: Bot,
      color: "from-violet-500/20 to-violet-500/5",
    },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here&apos;s your portfolio overview and bot performance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                <Plus className="h-4 w-4" />
                Browse Bots
              </Link>
            </Button>
            <Button asChild>
              <Link href="/mt5">
                <Rocket className="h-4 w-4" />
                Connect MT5
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-border/70 bg-card/80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
                        m.color
                      )}
                    >
                      <m.icon className="h-5 w-5 text-sky-400" />
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      Live
                    </Badge>
                  </div>
                  <p className="mt-4 text-xs tracking-wide text-muted-foreground uppercase">
                    {m.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{m.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recharts: Portfolio, Monthly Profit, ROI, Risk, Balance, Drawdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <DashboardChartsLazy />
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Active bots */}
          <Card className="border-border/70 bg-card/80 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Active Bots</CardTitle>
                <CardDescription>Subscribed strategies currently running</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace">
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeBots.length === 0 ? (
                <EmptyState
                  title="No active bots"
                  description="Subscribe to a bot to see it here."
                />
              ) : (
                activeBots.map((bot) => (
                  <Link
                    key={bot.id}
                    href={`/bots/${bot.slug}`}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                          bot.imageGradient
                        )}
                      >
                        {bot.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{bot.name}</p>
                        <p className="text-xs text-muted-foreground">{bot.tradingPair}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{formatPercent(bot.roi)}</p>
                      <p className="text-xs text-muted-foreground">DD {bot.drawdown.toFixed(1)}%</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-sky-400" />
                Notifications
                {unreadCount("ALL") > 0 ? (
                  <Badge variant="default">{unreadCount("ALL")}</Badge>
                ) : null}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/notifications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {previewNotifications.length === 0 ? (
                <EmptyState title="No alerts" description="You're all caught up." />
              ) : (
                previewNotifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "block rounded-xl border p-3 transition-colors hover:bg-muted/30",
                      !n.read ? "border-sky-500/30 bg-sky-500/5" : "border-border/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      {n.category} · {n.time}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent trades */}
        <Card className="mt-6 border-border/70 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-sky-400" />
                Recent Trades
              </CardTitle>
              <CardDescription>Latest fills from your active bots</CardDescription>
            </div>
            <Badge variant="outline">{recentTrades.length} trades</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Bot</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="text-xs text-muted-foreground">{trade.time}</TableCell>
                    <TableCell className="font-medium">{trade.bot}</TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.type === "BUY" ? "success" : "danger"}>
                        {trade.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.volume}</TableCell>
                    <TableCell
                      className={cn(
                        "font-semibold",
                        trade.profit >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {trade.profit >= 0 ? "+" : ""}
                      {formatCurrency(trade.profit)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.status === "OPEN" ? "warning" : "outline"}>
                        {trade.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Bot allocation */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">Bot Allocation</CardTitle>
              <CardDescription>Capital share across active strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {botAllocation.map((b) => (
                <div key={b.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="font-semibold">{b.value}%</span>
                  </div>
                  <Progress value={b.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly profits */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">Monthly Profits</CardTitle>
              <CardDescription>Net P/L by month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyProfitSeries.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3"
                >
                  <span className="text-sm font-medium">{m.month}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      m.profit >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {m.profit >= 0 ? "+" : ""}
                    {formatCurrency(m.profit)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Watchlist */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4 text-sky-400" />
                  Watchlist
                </CardTitle>
                <CardDescription>Symbols you are tracking</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/charts">
                  Charts <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {watchlistItems.length === 0 ? (
                <EmptyState
                  title="Watchlist empty"
                  description="Star symbols from market overview or charts."
                />
              ) : (
                watchlistItems.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          item.change >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleSymbol(item.symbol)}
                        aria-label={`Remove ${item.symbol} from watchlist`}
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Market overview */}
          <Card className="border-border/70 bg-card/80 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 className="h-4 w-4 text-sky-400" />
                  Market Overview
                </CardTitle>
                <CardDescription>Top movers across forex, metals, and crypto</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/news">
                  News <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {marketOverview.map((item) => {
                  const watched = symbols.includes(item.symbol);
                  return (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.symbol}</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            item.change >= 0 ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {item.change >= 0 ? "+" : ""}
                          {item.change.toFixed(2)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleSymbol(item.symbol)}
                          aria-label={`Toggle ${item.symbol} watchlist`}
                        >
                          <Star
                            className={cn(
                              "h-3.5 w-3.5",
                              watched
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & quick actions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="border-border/70 bg-card/80 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-sky-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-sky-500" />
                    <p className="flex-1 text-sm">{a.text}</p>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/marketplace">
                  <Plus className="h-4 w-4" />
                  Subscribe to a Bot
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/recommend">
                  <Sparkles className="h-4 w-4" />
                  AI Bot Recommendations
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4" />
                  View Leaderboard
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/referrals">
                  <Gift className="h-4 w-4" />
                  Affiliate Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/mt5">
                  <Rocket className="h-4 w-4" />
                  Connect MT5 Account
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/charts">
                  <LineChart className="h-4 w-4" />
                  Open Live Charts
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/profile">
                  <Wallet className="h-4 w-4" />
                  Manage Billing
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
