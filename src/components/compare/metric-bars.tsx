"use client";

import { motion } from "framer-motion";
import type { Bot } from "@/lib/data/bots";
import {
  COMPARE_COLORS,
  bestIndex,
  normalizeBarPercent,
  type MetricDirection,
} from "@/lib/compare/comparison-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatPercent } from "@/lib/utils";

type BarMetric = {
  label: string;
  description: string;
  getValue: (bot: Bot) => number;
  format: (value: number) => string;
  direction: MetricDirection;
};

const BAR_METRICS: BarMetric[] = [
  {
    label: "Performance",
    description: "Profit factor — higher is stronger risk-adjusted edge",
    getValue: (b) => b.profitFactor,
    format: (v) => v.toFixed(2),
    direction: "higher",
  },
  {
    label: "ROI",
    description: "Monthly return on investment",
    getValue: (b) => b.roi,
    format: (v) => formatPercent(v),
    direction: "higher",
  },
  {
    label: "Drawdown",
    description: "Max drawdown — lower is safer (longer bar = better)",
    getValue: (b) => b.drawdown,
    format: (v) => `${v.toFixed(1)}%`,
    direction: "lower",
  },
  {
    label: "Win Rate",
    description: "Share of winning trades",
    getValue: (b) => b.winRate,
    format: (v) => `${v.toFixed(1)}%`,
    direction: "higher",
  },
];

export function MetricBars({ selectedBots }: { selectedBots: Bot[] }) {
  if (selectedBots.length < 2) return null;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      {BAR_METRICS.map((metric) => {
        const values = selectedBots.map((b) => metric.getValue(b));
        const winner = bestIndex(values, metric.direction);

        return (
          <Card key={metric.label} className="border-border/70 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{metric.label}</CardTitle>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedBots.map((bot, i) => {
                const value = values[i];
                const width = normalizeBarPercent(value, values, metric.direction);
                const isBest = i === winner;
                const color = COMPARE_COLORS[i % COMPARE_COLORS.length];

                return (
                  <div key={bot.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className={cn("truncate", isBest && "font-semibold text-emerald-400")}>
                          {bot.name}
                        </span>
                      </span>
                      <span className={cn("tb-mono shrink-0", isBest && "font-bold text-emerald-400")}>
                        {metric.format(value)}
                      </span>
                    </div>
                    <div className="bg-muted/50 h-2 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
