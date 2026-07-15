"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { bots } from "@/lib/data/bots";
import { adminStats, adminUsers } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

const statCards = [
  {
    label: "Total Users",
    value: adminStats.totalUsers.toLocaleString(),
    change: `+${adminStats.userGrowth}%`,
    icon: Users,
    href: "/admin/users",
    color: "text-sky-400",
  },
  {
    label: "Active Bots",
    value: adminStats.activeBots.toString(),
    change: "+24 this month",
    icon: Bot,
    href: "/admin/bots",
    color: "text-blue-400",
  },
  {
    label: "Monthly Revenue",
    value: formatCurrency(adminStats.monthlyRevenue),
    change: `+${adminStats.revenueGrowth}%`,
    icon: DollarSign,
    href: "/admin/analytics",
    color: "text-emerald-400",
  },
  {
    label: "Subscriptions",
    value: adminStats.activeSubscriptions.toLocaleString(),
    change: "Active plans",
    icon: CreditCard,
    href: "/admin/subscriptions",
    color: "text-violet-400",
  },
];

export default function AdminDashboardPage() {
  const recentUsers = adminUsers.slice(0, 5);
  const recentBots = bots.slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform overview, user activity, and quick actions.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, i) => {
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
                    <div className={`rounded-xl bg-muted/50 p-3 ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
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
              <CardTitle>Recent Bots</CardTitle>
              <CardDescription>Marketplace listings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bots">
                Manage <ArrowRight className="h-4 w-4" />
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

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Jump to admin sections</CardDescription>
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
