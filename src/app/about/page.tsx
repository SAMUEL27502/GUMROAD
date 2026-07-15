"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LineChart, ShieldCheck, Zap } from "lucide-react";
import { platformStats } from "@/lib/data/platform";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Performance",
    description:
      "Every bot on TradeBib is validated against live MT5 investor accounts before listing. No backtest-only claims.",
  },
  {
    icon: LineChart,
    title: "Transparent Data",
    description:
      "Equity curves, drawdowns, win rates, and profit factors are displayed openly so you can make informed decisions.",
  },
  {
    icon: Zap,
    title: "One-Click Deployment",
    description:
      "Subscribe to an Expert Advisor and deploy it to your connected MetaTrader 5 terminal without manual file transfers.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          About <span className="gradient-text">TradeBib</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
          We built TradeBib to bring transparency and trust to automated forex trading.
          Our marketplace connects traders with verified MetaTrader 5 Expert Advisors,
          backed by real performance data — not marketing hype.
        </p>
      </motion.div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass border-border/60 text-center">
              <CardContent className="p-6">
                <p className="text-3xl font-bold gradient-text">{stat.display}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Our Mission</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="glass h-full border-border/60">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-xl bg-sky-500/10 p-3 text-sky-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl glass border border-sky-500/20 p-8 text-center md:p-12"
      >
        <h2 className="text-2xl font-bold">Ready to automate with confidence?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Browse verified bots, connect your MT5 account, and start building your automated portfolio today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/marketplace">
              Explore Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
