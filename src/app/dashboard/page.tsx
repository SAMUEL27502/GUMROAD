"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Bot,
  DollarSign,
  LineChart,
  Plus,
  Rocket,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { bots } from "@/lib/data/bots";
import {
  activities,
  botAllocation,
  dashboardMetrics,
  notifications,
  portfolioPerformance,
  riskDistribution,
} from "@/lib/data/platform";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const chartTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  fontSize: "12px",
};

const subscribedBots = bots.filter((b) =>
  ["goldscalper-pro", "eurotrend-ai", "nightowl-grid", "breakouthunter"].includes(b.slug)
);

const monthlyProfits = portfolioPerformance.slice(1).map((point, i) => ({
  month: point.month,
  profit: point.value - portfolioPerformance[i].value,
}));

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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
      value: String(dashboardMetrics.activeBots),
      change: `${dashboardMetrics.totalTrades.toLocaleString()} total trades`,
      icon: Bot,
      color: "from-violet-500/20 to-violet-500/5",
    },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

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

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="border-border/70 bg-card/80 overflow-hidden">
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
                  <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{m.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Portfolio chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-sky-400" />
                  Portfolio Performance
                </CardTitle>
                <Badge variant="secondary">{formatPercent(dashboardMetrics.monthlyRoi)} MTD</Badge>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioPerformance}>
                      <defs>
                        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        fill="url(#portfolioGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card className="border-border/70 bg-card/80 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingDown className="h-4 w-4 text-amber-400" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-2">
                  {riskDistribution.map((r) => (
                    <div key={r.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: r.color }}
                        />
                        {r.name}
                      </span>
                      <span className="font-semibold">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Subscribed bots */}
          <Card className="border-border/70 bg-card/80 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Subscribed Bots</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace">
                  View all <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {subscribedBots.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4"
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
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-sky-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  className={cn(
                    "block rounded-xl border p-3 transition-colors hover:bg-muted/30",
                    !n.read ? "border-sky-500/30 bg-sky-500/5" : "border-border/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">{n.time}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Bot allocation */}
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">Bot Allocation</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyProfits.map((m) => (
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

        {/* Activities & quick actions */}
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
