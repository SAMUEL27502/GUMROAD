"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CandlestickChart,
  Gauge,
  LineChart,
  MousePointerClick,
  PieChart,
  ShieldCheck,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotCard } from "@/components/bots/bot-card";
import { CountUp } from "@/components/landing/count-up";
import { getFeaturedBots } from "@/lib/data/bots";
import { features, platformStats } from "@/lib/data/platform";

const iconMap = {
  ShieldCheck,
  LineChart,
  Gauge,
  Zap,
  Store,
  PieChart,
  MousePointerClick,
  CandlestickChart,
};

export function LandingPage() {
  const featured = getFeaturedBots().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute inset-0 grid-bg" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                TradeBib
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Trade Smarter with{" "}
                <span className="gradient-text">Automated MT5 Bots</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Browse, subscribe and deploy verified MetaTrader 5 Expert Advisors using real
                verified trading data.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/marketplace">
                    Browse Bots <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="glass" asChild>
                  <Link href="/marketplace">View Marketplace</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating cards */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Live Equity", value: "$24,850", change: "+8.7%" },
                  { label: "Open Trades", value: "3", change: "Synced" },
                  { label: "Active Bots", value: "4", change: "Running" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className={`rounded-2xl border border-border/60 bg-card/60 p-4 ${i === 0 ? "animate-float" : i === 2 ? "animate-float-delayed" : ""}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs text-emerald-400">{item.change}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 h-28 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-transparent">
                <svg viewBox="0 0 400 100" className="h-full w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,70 C40,65 60,40 100,45 C140,50 160,20 200,28 C240,36 260,55 300,40 C340,25 360,30 400,18 L400,100 L0,100 Z"
                    fill="url(#g)"
                  />
                  <path
                    d="M0,70 C40,65 60,40 100,45 C140,50 160,20 200,28 C240,36 260,55 300,40 C340,25 360,30 400,18"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {platformStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <CountUp value={stat.value} display={stat.display} />
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why TradeBib */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why TradeBib</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to discover, verify, and deploy automated trading strategies.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full border-border/70 bg-card/70 transition-colors hover:border-sky-500/40">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Bots */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Bots</h2>
            <p className="mt-3 text-muted-foreground">
              Top verified Expert Advisors with live performance metrics.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/marketplace">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((bot, i) => (
            <BotCard key={bot.id} bot={bot} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent p-10 text-center sm:p-16">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to automate your edge?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Connect MetaTrader 5, subscribe to verified bots, and monitor everything from one
              premium dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/mt5">Connect MT5</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
