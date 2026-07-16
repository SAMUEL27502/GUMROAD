"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Copy,
  Gift,
  Link2,
  MousePointerClick,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  affiliateProfile,
  buildReferralLink,
  computeAffiliateStats,
} from "@/lib/data/affiliate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";
import { useAffiliateStore } from "@/store/affiliate-store";
import { useAuthStore } from "@/store/auth-store";

const statusVariant = {
  PENDING: "warning" as const,
  ACTIVE: "success" as const,
  INACTIVE: "outline" as const,
  BLOCKED: "danger" as const,
  APPROVED: "success" as const,
  PAID: "success" as const,
  VOID: "danger" as const,
  PROCESSING: "medium" as const,
  REJECTED: "danger" as const,
};

export function AffiliateDashboard() {
  const { isAuthenticated } = useAuthStore();
  const {
    referralCode,
    clicks,
    conversions,
    commissions,
    withdrawals,
    payoutDestination,
    requestWithdrawal,
    setPayoutDestination,
  } = useAffiliateStore();

  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("100");
  const [destination, setDestination] = useState(payoutDestination);

  const code = referralCode;
  const referralLink = buildReferralLink(code);

  const stats = useMemo(
    () => computeAffiliateStats(conversions, commissions, withdrawals, clicks),
    [conversions, commissions, withdrawals, clicks]
  );

  const tierProgress = Math.min(
    100,
    (stats.conversions / affiliateProfile.nextTierAt) * 100
  );

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amount > stats.availableBalance) {
      toast.error("Amount exceeds available commission balance");
      return;
    }
    const result = requestWithdrawal(amount, destination);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setPayoutDestination(destination);
    toast.success(`Withdrawal of ${formatCurrency(amount)} requested`);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">Affiliate Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-3">
          Sign in to view your referral link, clicks, conversions, commissions, and withdrawals.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <Badge className="mb-4 border-sky-500/30 bg-sky-500/10 text-sky-300">
          <Gift className="mr-1.5 h-3.5 w-3.5" />
          Earn {affiliateProfile.commissionRate}% recurring commission
        </Badge>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Affiliate Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Track your referral link, clicks, conversions, commissions, and withdrawals.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {affiliateProfile.tier} · {affiliateProfile.commissionRate}%
          </Badge>
        </div>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Clicks",
            value: stats.clicks.toLocaleString(),
            icon: MousePointerClick,
            hint: `${stats.conversionRate}% conversion`,
          },
          {
            label: "Conversions",
            value: stats.conversions.toLocaleString(),
            icon: Users,
            hint: `${stats.activeReferrals} active`,
          },
          {
            label: "Commission pending",
            value: formatCurrency(stats.pendingCommission),
            icon: Banknote,
            hint: `${formatCurrency(stats.paidCommission)} paid`,
          },
          {
            label: "Available",
            value: formatCurrency(stats.availableBalance),
            icon: Wallet,
            hint: "Ready to withdraw",
          },
          {
            label: "Lifetime earnings",
            value: formatCurrency(stats.lifetimeEarnings),
            icon: Gift,
            hint: "All-time commissions",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/70 bg-card/80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                      <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
                    </div>
                    <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-400">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-sky-400" />
              Referral link
            </CardTitle>
            <CardDescription>Share this URL to attribute clicks and conversions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={referralLink} className="font-mono text-xs" />
              <Button onClick={copyLink} variant="outline" size="icon" aria-label="Copy link">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied ? <p className="text-xs text-emerald-400">Copied to clipboard</p> : null}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-sm">Referral code</p>
              <p className="font-mono text-lg font-bold text-sky-400">{code}</p>
            </div>
            <Button className="w-full" onClick={copyLink}>
              <Share2 className="h-4 w-4" />
              Copy & share link
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle>Tier progress</CardTitle>
            <CardDescription>
              {stats.conversions} of {affiliateProfile.nextTierAt} conversions to Elite Partner
              (25%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={tierProgress} className="h-3" />
            {[
              { tier: "Starter", rate: "15%", min: 0 },
              { tier: "Partner", rate: "20%", min: 10 },
              { tier: "Elite", rate: "25%", min: 30 },
            ].map((tier) => {
              const active = stats.conversions >= tier.min;
              return (
                <div
                  key={tier.tier}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3",
                    active ? "border-sky-500/30 bg-sky-500/10" : "border-border/60 bg-muted/20"
                  )}
                >
                  <div>
                    <p className="font-medium">{tier.tier}</p>
                    <p className="text-muted-foreground text-xs">{tier.min}+ conversions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {active ? <CheckCircle2 className="h-4 w-4 text-sky-400" /> : null}
                    <span className="font-bold text-sky-400">{tier.rate}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clicks" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="clicks">Clicks</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Click activity</CardTitle>
              <CardDescription>
                {stats.clicks} tracked clicks · {stats.conversionRate}% converted to sign-ups
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {clicks.length === 0 ? (
                <EmptyState title="No clicks yet" description="Share your referral link to start." />
              ) : (
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-border/60 border-b text-left">
                      <th className="text-muted-foreground pb-3 pr-4 font-medium">Date</th>
                      <th className="text-muted-foreground pb-3 pr-4 font-medium">Source</th>
                      <th className="text-muted-foreground pb-3 pr-4 font-medium">Landing</th>
                      <th className="text-muted-foreground pb-3 font-medium">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clicks.map((click) => (
                      <tr key={click.id} className="border-border/40 border-b last:border-0">
                        <td className="py-3 pr-4">{click.date}</td>
                        <td className="py-3 pr-4 font-medium">{click.source}</td>
                        <td className="text-muted-foreground py-3 pr-4 font-mono text-xs">
                          {click.landingPath}
                        </td>
                        <td className="py-3">{click.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
              <CardDescription>Sign-ups attributed to your referral code</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-border/60 border-b text-left">
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">User</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Plan</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Status</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Signed up</th>
                    <th className="text-muted-foreground pb-3 font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((c) => (
                    <tr key={c.id} className="border-border/40 border-b last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-muted-foreground text-xs">{c.email}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary">{c.plan}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="py-3 pr-4">{c.signedUpAt}</td>
                      <td className="py-3 font-semibold text-emerald-400">
                        {formatCurrency(c.commissionEarned)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Commission ledger</CardTitle>
              <CardDescription>
                Pending {formatCurrency(stats.pendingCommission)} · Paid{" "}
                {formatCurrency(stats.paidCommission)}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-border/60 border-b text-left">
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Referral</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Description</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Rate</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Amount</th>
                    <th className="text-muted-foreground pb-3 pr-4 font-medium">Status</th>
                    <th className="text-muted-foreground pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-border/40 border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{c.referralName}</td>
                      <td className="text-muted-foreground py-3 pr-4">{c.description}</td>
                      <td className="py-3 pr-4">{c.rate}%</td>
                      <td className="py-3 pr-4 font-semibold text-emerald-400">
                        {formatCurrency(c.amount)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="py-3">{c.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <Card className="border-border/70 bg-card/80 h-fit">
              <CardHeader>
                <CardTitle>Request withdrawal</CardTitle>
                <CardDescription>
                  Available: {formatCurrency(stats.availableBalance)} · Min{" "}
                  {formatCurrency(affiliateProfile.minWithdrawal)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wd-amount">Amount (USD)</Label>
                    <Input
                      id="wd-amount"
                      type="number"
                      min={affiliateProfile.minWithdrawal}
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wd-dest">PayPal email</Label>
                    <Input
                      id="wd-dest"
                      type="email"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <ArrowUpRight className="h-4 w-4" />
                    Request payout
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Withdrawal history</CardTitle>
                <CardDescription>Pending, processing, and paid payouts</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {withdrawals.length === 0 ? (
                  <EmptyState
                    title="No withdrawals yet"
                    description="Request a payout when you have available commission."
                  />
                ) : (
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="border-border/60 border-b text-left">
                        <th className="text-muted-foreground pb-3 pr-4 font-medium">Amount</th>
                        <th className="text-muted-foreground pb-3 pr-4 font-medium">Method</th>
                        <th className="text-muted-foreground pb-3 pr-4 font-medium">Destination</th>
                        <th className="text-muted-foreground pb-3 pr-4 font-medium">Status</th>
                        <th className="text-muted-foreground pb-3 font-medium">Requested</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="border-border/40 border-b last:border-0">
                          <td className="py-3 pr-4 font-semibold">
                            {formatCurrency(w.amount)}
                          </td>
                          <td className="py-3 pr-4 uppercase">{w.method}</td>
                          <td className="text-muted-foreground py-3 pr-4 text-xs">
                            {w.destination}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={statusVariant[w.status]}>{w.status}</Badge>
                          </td>
                          <td className="py-3">{w.requestedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
