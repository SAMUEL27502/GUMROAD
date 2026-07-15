"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { bots } from "@/lib/data/bots";
import type { Bot } from "@/lib/data/bots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatPercent } from "@/lib/utils";

const metrics: { key: keyof Bot | "price"; label: string; format: (b: Bot) => string }[] = [
  { key: "roi", label: "Monthly ROI", format: (b) => formatPercent(b.roi) },
  { key: "drawdown", label: "Max Drawdown", format: (b) => `${b.drawdown.toFixed(1)}%` },
  { key: "winRate", label: "Win Rate", format: (b) => `${b.winRate.toFixed(1)}%` },
  { key: "profitFactor", label: "Profit Factor", format: (b) => b.profitFactor.toFixed(2) },
  { key: "subscribers", label: "Subscribers", format: (b) => b.subscribers.toLocaleString() },
  { key: "price", label: "Price", format: (b) => `${formatCurrency(b.price)}/mo` },
  { key: "rating", label: "Rating", format: (b) => `${b.rating.toFixed(1)} / 5` },
  { key: "riskLevel", label: "Risk Level", format: (b) => b.riskLevel },
  { key: "strategy", label: "Strategy", format: (b) => b.strategy },
  { key: "verified", label: "Verified", format: (b) => (b.verified ? "Yes" : "No") },
];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(["goldscalper-pro", "eurotrend-ai"]);

  const selectedBots = useMemo(
    () => selected.map((slug) => bots.find((b) => b.slug === slug)).filter(Boolean) as Bot[],
    [selected]
  );

  const updateSlot = (index: number, slug: string) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
  };

  const addSlot = () => {
    if (selected.length >= 3) return;
    const unused = bots.find((b) => !selected.includes(b.slug));
    if (unused) setSelected((prev) => [...prev, unused.slug]);
  };

  const removeSlot = (index: number) => {
    if (selected.length <= 2) return;
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Bot Comparison</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Select 2–3 Expert Advisors and compare performance metrics side by side.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-wrap items-end justify-center gap-4">
        {selected.map((slug, i) => (
          <div key={i} className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Bot {i + 1}</span>
              {selected.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeSlot(i)}
                  className="text-muted-foreground cursor-pointer hover:text-red-400"
                  aria-label="Remove bot"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={slug} onValueChange={(v) => updateSlot(i, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bot" />
              </SelectTrigger>
              <SelectContent>
                {bots.map((b) => (
                  <SelectItem
                    key={b.slug}
                    value={b.slug}
                    disabled={selected.includes(b.slug) && b.slug !== slug}
                  >
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        {selected.length < 3 && (
          <Button variant="outline" onClick={addSlot}>
            Add Bot
          </Button>
        )}
      </div>

      <Card className="glass border-border/60 overflow-hidden">
        <CardHeader>
          <CardTitle>Metrics Comparison</CardTitle>
          <CardDescription>Side-by-side performance data</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-border/60 border-b">
                <th className="text-muted-foreground pr-6 pb-4 text-left font-medium">Metric</th>
                {selectedBots.map((bot) => (
                  <th key={bot.id} className="pr-6 pb-4 text-left">
                    <div
                      className={`mb-2 h-2 w-full rounded-full bg-gradient-to-r ${bot.imageGradient}`}
                    />
                    <p className="font-bold">{bot.name}</p>
                    <p className="text-muted-foreground text-xs">{bot.tradingPair}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, i) => (
                <motion.tr
                  key={metric.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-border/40 border-b"
                >
                  <td className="text-muted-foreground py-4 pr-6 font-medium">{metric.label}</td>
                  {selectedBots.map((bot) => (
                    <td key={bot.id} className="py-4 pr-6">
                      {metric.key === "riskLevel" ? (
                        <Badge
                          variant={
                            bot.riskLevel === "LOW"
                              ? "low"
                              : bot.riskLevel === "MEDIUM"
                                ? "medium"
                                : "high"
                          }
                        >
                          {bot.riskLevel}
                        </Badge>
                      ) : metric.key === "verified" ? (
                        bot.verified ? (
                          <Check className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <X className="text-muted-foreground h-5 w-5" />
                        )
                      ) : (
                        <span className={metric.key === "roi" ? "font-bold text-emerald-400" : ""}>
                          {metric.format(bot)}
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {selectedBots.map((bot) => (
          <Button key={bot.id} variant="outline" asChild>
            <Link href={`/bots/${bot.slug}`}>
              View {bot.name} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
