"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Gift, Link2, Share2, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

const referralCode = "TRADEBIB-NOVA42";
const referralLink = `https://tradebib.com/register?ref=${referralCode}`;

const stats = {
  totalReferrals: 24,
  activeReferrals: 18,
  pendingPayout: 342.5,
  lifetimeEarnings: 1840,
  nextTierAt: 30,
  commissionRate: 20,
};

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tierProgress = (stats.totalReferrals / stats.nextTierAt) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
          <Gift className="h-4 w-4" />
          Earn {stats.commissionRate}% on every referral
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Referral Program</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Share TradeBib with fellow traders and earn recurring commissions on their subscriptions.
        </p>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Referrals", value: stats.totalReferrals, icon: Users },
          { label: "Active Referrals", value: stats.activeReferrals, icon: Link2 },
          { label: "Pending Payout", value: formatCurrency(stats.pendingPayout), icon: Wallet },
          { label: "Lifetime Earnings", value: formatCurrency(stats.lifetimeEarnings), icon: Gift },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="glass border-border/60">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link to track sign-ups and commissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={referralLink} className="font-mono text-xs" />
              <Button onClick={copyLink} variant="outline" size="icon" aria-label="Copy link">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-emerald-400">Copied to clipboard!</p>}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-sm">Referral code</p>
              <p className="font-mono text-lg font-bold text-sky-400">{referralCode}</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={copyLink}>
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle>Affiliate Tier Progress</CardTitle>
            <CardDescription>
              {stats.totalReferrals} of {stats.nextTierAt} referrals to Elite Partner (25%
              commission)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={tierProgress} className="h-3" />
            <div className="space-y-3">
              {[
                { tier: "Starter Partner", rate: "15%", min: 0, active: stats.totalReferrals >= 0 },
                { tier: "Pro Partner", rate: "20%", min: 10, active: stats.totalReferrals >= 10 },
                { tier: "Elite Partner", rate: "25%", min: 30, active: stats.totalReferrals >= 30 },
              ].map((tier) => (
                <div
                  key={tier.tier}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    tier.active ? "border-sky-500/30 bg-sky-500/10" : "border-border/60 bg-muted/20"
                  }`}
                >
                  <div>
                    <p className="font-medium">{tier.tier}</p>
                    <p className="text-muted-foreground text-xs">{tier.min}+ referrals</p>
                  </div>
                  <span className="font-bold text-sky-400">{tier.rate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-border/60 mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Share your link",
                desc: "Send your unique referral URL to traders in your network.",
              },
              {
                step: "2",
                title: "They subscribe",
                desc: "When they sign up and subscribe to a paid plan, you earn commission.",
              },
              {
                step: "3",
                title: "Get paid monthly",
                desc: "Recurring payouts for as long as your referrals stay subscribed.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-400">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
