"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { bots } from "@/lib/data/bots";
import {
  adminActivity,
  adminStats,
  adminUsers,
  pendingBotApprovals as pendingSeed,
  revenueChartData,
} from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  fontSize: "12px",
};

const activityIcon = {
  USER: Users,
  BOT: Bot,
  PAYMENT: DollarSign,
  SUBSCRIPTION: CreditCard,
} as const;

export default function AdminDashboardPage() {
  const [pending, setPending] = useState(pendingSeed);
  const recentUsers = adminUsers.slice(0, 5);
  const recentBots = bots.slice(0, 5);

  const metrics = [
    {
      label: "Users",
      value: adminStats.totalUsers.toLocaleString(),
      change: `+${adminStats.userGrowth}%`,
      icon: Users,
      href: "/admin/users",
      color: "text-sky-400",
    },
    {
      label: "Revenue",
      value: formatCurrency(adminStats.monthlyRevenue),
      change: `+${adminStats.revenueGrowth}%`,
      icon: DollarSign,
      href: "/admin/analytics",
      color: "text-emerald-400",
    },
    {
      label: "Subscriptions",
      value: adminStats.activeSubscriptions.toLocaleString(),
      change: `+${adminStats.subscriptionGrowth}%`,
      icon: CreditCard,
      href: "/admin/subscriptions",
      color: "text-violet-400",
    },
    {
      label: "Bot approvals",
      value: String(pending.length || adminStats.pendingBotApprovals),
      change: `${adminStats.activeBots} live bots`,
      icon: ShieldCheck,
      href: "/admin/bots",
      color: "text-amber-400",
    },
  ];

  function approveBot(id: string) {
    const bot = pending.find((b) => b.id === id);
    setPending((prev) => prev.filter((b) => b.id !== id));
    toast.success(`${bot?.name ?? "Bot"} approved`);
  }

  function rejectBot(id: string) {
    const bot = pending.find((b) => b.id === id);
    setPending((prev) => prev.filter((b) => b.id !== id));
    toast.message(`${bot?.name ?? "Bot"} rejected`);
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Metrics, revenue, users, subscriptions, bot approvals, charts, and recent activity.
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={stat.href}>
                <Card className="glass border-border/60 transition-colors hover:border-sky-500/30">
                  <CardContent className="flex items-start justify-between p-6">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={cn("rounded-xl bg-muted/50 p-3", stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly platform MRR</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics">
                Analytics <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
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
                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0EA5E9"
                    fill="url(#adminRevGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Registered traders over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [Number(value).toLocaleString(), "Users"]}
                  />
                  <Bar dataKey="users" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bot approvals */}
        <Card className="glass border-border/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                Bot approvals
              </CardTitle>
              <CardDescription>Pending marketplace submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bots">
                Manage all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No bots awaiting approval.
              </p>
            ) : (
              pending.map((bot) => (
                <div
                  key={bot.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bot.pair} · {bot.strategy} · submitted {bot.submitted}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        bot.risk === "LOW" ? "low" : bot.risk === "MEDIUM" ? "medium" : "high"
                      }
                    >
                      {bot.risk}
                    </Badge>
                    <Button size="sm" onClick={() => approveBot(bot.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectBot(bot.id)}>
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-sky-400" />
              Recent activity
            </CardTitle>
            <CardDescription>Platform events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminActivity.map((item) => {
              const Icon = activityIcon[item.type as keyof typeof activityIcon] ?? Activity;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-3 rounded-xl border border-border/40 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="mt-0.5 rounded-lg bg-sky-500/15 p-2 text-sky-400">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Latest registrations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary">{user.plan}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={user.status === "ACTIVE" ? "success" : "danger"}>
                          {user.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Live marketplace bots</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/subscriptions">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Bot</th>
                    <th className="pb-3 font-medium">ROI</th>
                    <th className="pb-3 font-medium">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBots.map((bot) => (
                    <tr key={bot.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{bot.name}</p>
                        <p className="text-xs text-muted-foreground">{bot.tradingPair}</p>
                      </td>
                      <td className="py-3 font-medium text-emerald-400">
                        {formatPercent(bot.roi)}
                      </td>
                      <td className="py-3">
                        <Badge variant={bot.verified ? "success" : "warning"}>
                          {bot.verified ? "Yes" : "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics shortcut */}
      <Card className="glass border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Full revenue and acquisition reports</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/analytics">Open analytics</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {[
            { href: "/admin/users", label: "Manage Users" },
            { href: "/admin/bots", label: "Approve Bots" },
            { href: "/admin/subscriptions", label: "Subscriptions" },
            { href: "/admin/analytics", label: "View Analytics" },
            { href: "/marketplace", label: "Marketplace" },
          ].map((link) => (
            <Button key={link.href} variant="outline" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
