"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  Link2,
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { bots, type Bot } from "@/lib/data/bots";
import {
  COMPARE_COLORS,
  MAX_COMPARE_BOTS,
  MIN_COMPARE_BOTS,
  annualPrice,
  bestIndex,
  botSeriesKey,
  buildComparePath,
  buildDrawdownSeries,
  buildEquitySeries,
  buildMonthlySeries,
  buildRoiSeries,
  buildSnapshotSeries,
  parseCompareSlugs,
  pricePerRoiPoint,
} from "@/lib/compare/comparison-utils";
import { MetricBars } from "@/components/compare/metric-bars";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { chartTooltipStyle } from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard, StatGrid } from "@/components/ui/metric-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type MetricRow = {
  label: string;
  section: "performance" | "pricing" | "profile";
  values: (bot: Bot) => string;
  numeric?: (bot: Bot) => number;
  direction?: "higher" | "lower";
  emphasize?: boolean;
};

const metricRows: MetricRow[] = [
  {
    label: "Monthly ROI",
    section: "performance",
    values: (b) => formatPercent(b.roi),
    numeric: (b) => b.roi,
    direction: "higher",
    emphasize: true,
  },
  {
    label: "Max Drawdown",
    section: "performance",
    values: (b) => `${b.drawdown.toFixed(1)}%`,
    numeric: (b) => b.drawdown,
    direction: "lower",
    emphasize: true,
  },
  {
    label: "Win Rate",
    section: "performance",
    values: (b) => `${b.winRate.toFixed(1)}%`,
    numeric: (b) => b.winRate,
    direction: "higher",
    emphasize: true,
  },
  {
    label: "Profit Factor",
    section: "performance",
    values: (b) => b.profitFactor.toFixed(2),
    numeric: (b) => b.profitFactor,
    direction: "higher",
  },
  {
    label: "Rating",
    section: "performance",
    values: (b) => `${b.rating.toFixed(1)} / 5`,
    numeric: (b) => b.rating,
    direction: "higher",
  },
  {
    label: "Subscribers",
    section: "performance",
    values: (b) => b.subscribers.toLocaleString(),
    numeric: (b) => b.subscribers,
    direction: "higher",
  },
  {
    label: "Monthly Price",
    section: "pricing",
    values: (b) => `${formatCurrency(b.price)}/mo`,
    numeric: (b) => b.price,
    direction: "lower",
    emphasize: true,
  },
  {
    label: "Annual Price",
    section: "pricing",
    values: (b) => `${formatCurrency(annualPrice(b.price))}/yr`,
    numeric: (b) => annualPrice(b.price),
    direction: "lower",
  },
  {
    label: "Price / 1% ROI",
    section: "pricing",
    values: (b) => formatCurrency(pricePerRoiPoint(b)),
    numeric: (b) => pricePerRoiPoint(b),
    direction: "lower",
  },
  {
    label: "Risk Level",
    section: "profile",
    values: (b) => b.riskLevel,
  },
  {
    label: "Strategy",
    section: "profile",
    values: (b) => b.strategy,
  },
  {
    label: "Trading Pair",
    section: "profile",
    values: (b) => b.tradingPair,
  },
  {
    label: "Category",
    section: "profile",
    values: (b) => b.category,
  },
  {
    label: "Verified",
    section: "profile",
    values: (b) => (b.verified ? "Yes" : "No"),
  },
];

const DEFAULT_SLUGS = ["goldscalper-pro", "eurotrend-ai"];

function WinnerBadge() {
  return (
    <Badge className="ml-2 border-0 bg-emerald-500/15 text-emerald-300">
      <Crown className="mr-1 h-3 w-3" />
      Best
    </Badge>
  );
}

function MetricTable({
  section,
  selectedBots,
  title,
  description,
}: {
  section: "performance" | "pricing" | "profile";
  selectedBots: Bot[];
  title: string;
  description: string;
}) {
  const rows = metricRows.filter((row) => row.section === section);

  return (
    <Card className="border-border/70 bg-card/80 overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-border/60 border-b">
              <th className="text-muted-foreground pr-4 pb-3 text-left font-medium">Metric</th>
              {selectedBots.map((bot, i) => (
                <th key={bot.id} className="pr-4 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                    />
                    <span className="font-semibold">{bot.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const nums = row.numeric ? selectedBots.map((b) => row.numeric!(b)) : [];
              const winner = row.direction && nums.length ? bestIndex(nums, row.direction) : -1;

              return (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="border-border/40 border-b"
                >
                  <td className="text-muted-foreground py-3 pr-4 font-medium">{row.label}</td>
                  {selectedBots.map((bot, i) => (
                    <td key={bot.id} className="py-3 pr-4">
                      {row.label === "Risk Level" ? (
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
                      ) : row.label === "Verified" ? (
                        bot.verified ? (
                          <Check className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <X className="text-muted-foreground h-5 w-5" />
                        )
                      ) : (
                        <span
                          className={cn(
                            row.emphasize && i === winner && "font-bold text-emerald-400"
                          )}
                        >
                          {row.values(bot)}
                          {i === winner && row.direction ? <WinnerBadge /> : null}
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function BotComparison() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => {
    const fromUrl = parseCompareSlugs(searchParams.get("bots"), DEFAULT_SLUGS).filter((slug) =>
      bots.some((b) => b.slug === slug)
    );
    return fromUrl.length >= MIN_COMPARE_BOTS ? fromUrl : DEFAULT_SLUGS;
  });

  useEffect(() => {
    const nextQuery = `bots=${selected.join(",")}`;
    const current = searchParams.get("bots");
    if (current === selected.join(",")) return;
    router.replace(`${pathname}?${nextQuery}`, { scroll: false });
  }, [selected, pathname, router, searchParams]);

  const selectedBots = useMemo(
    () => selected.map((slug) => bots.find((b) => b.slug === slug)).filter(Boolean) as Bot[],
    [selected]
  );

  const equityData = useMemo(() => buildEquitySeries(selectedBots), [selectedBots]);
  const roiData = useMemo(() => buildRoiSeries(selectedBots), [selectedBots]);
  const drawdownData = useMemo(() => buildDrawdownSeries(selectedBots), [selectedBots]);
  const monthlyData = useMemo(() => buildMonthlySeries(selectedBots), [selectedBots]);
  const snapshotData = useMemo(() => buildSnapshotSeries(selectedBots), [selectedBots]);

  const winners = useMemo(() => {
    if (selectedBots.length < 2) {
      return { roi: -1, drawdown: -1, winRate: -1, price: -1 };
    }
    return {
      roi: bestIndex(
        selectedBots.map((b) => b.roi),
        "higher"
      ),
      drawdown: bestIndex(
        selectedBots.map((b) => b.drawdown),
        "lower"
      ),
      winRate: bestIndex(
        selectedBots.map((b) => b.winRate),
        "higher"
      ),
      price: bestIndex(
        selectedBots.map((b) => b.price),
        "lower"
      ),
    };
  }, [selectedBots]);

  function updateSlot(index: number, slug: string) {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
  }

  function addSlot() {
    if (selected.length >= MAX_COMPARE_BOTS) return;
    const unused = bots.find((b) => !selected.includes(b.slug));
    if (unused) setSelected((prev) => [...prev, unused.slug]);
  }

  function removeSlot(index: number) {
    if (selected.length <= MIN_COMPARE_BOTS) return;
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  async function shareComparison() {
    const path = buildComparePath(selected);
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Comparison link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <Container padY="md">
      <PageHeader
        align="center"
        icon={Scale}
        eyebrow="Multi-bot comparison"
        title={<span className="gradient-text">Bot Comparison</span>}
        description={`Compare ${MIN_COMPARE_BOTS}–${MAX_COMPARE_BOTS} Expert Advisors on performance, ROI, drawdown, win rate, charts, and pricing.`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={shareComparison}>
              <Link2 className="h-4 w-4" />
              Share link
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/marketplace">Browse marketplace</Link>
            </Button>
          </>
        }
      />

      <div className="border-border/60 bg-background/80 sticky top-16 z-20 mb-8 rounded-2xl border p-4 backdrop-blur-md sm:p-5">
        <div className="flex flex-wrap items-end justify-center gap-4">
          {selected.map((slug, i) => (
            <div key={`${slug}-${i}`} className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                  />
                  Bot {i + 1}
                </span>
                {selected.length > MIN_COMPARE_BOTS && (
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
          {selected.length < MAX_COMPARE_BOTS && (
            <Button variant="outline" onClick={addSlot}>
              <Plus className="h-4 w-4" />
              Add Bot
            </Button>
          )}
        </div>
      </div>

      <StatGrid cols={4} className="mb-8">
        {[
          {
            label: "Best ROI",
            icon: TrendingUp,
            index: winners.roi,
            value: (b: Bot) => formatPercent(b.roi),
            valueClassName: "text-emerald-400",
          },
          {
            label: "Lowest Drawdown",
            icon: TrendingDown,
            index: winners.drawdown,
            value: (b: Bot) => `${b.drawdown.toFixed(1)}%`,
            valueClassName: "text-sky-400",
          },
          {
            label: "Best Win Rate",
            icon: Check,
            index: winners.winRate,
            value: (b: Bot) => `${b.winRate.toFixed(1)}%`,
            valueClassName: "text-amber-400",
          },
          {
            label: "Best Price",
            icon: Wallet,
            index: winners.price,
            value: (b: Bot) => `${formatCurrency(b.price)}/mo`,
            valueClassName: "text-violet-400",
          },
        ].map((card) => {
          const bot = selectedBots[card.index];
          return (
            <MetricCard
              key={card.label}
              label={card.label}
              icon={card.icon}
              value={bot ? card.value(bot) : "—"}
              hint={bot?.name ?? "—"}
              valueClassName={card.valueClassName}
            />
          );
        })}
      </StatGrid>

      <MetricBars selectedBots={selectedBots} />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <MetricTable
          section="performance"
          selectedBots={selectedBots}
          title="Performance"
          description="ROI, drawdown, win rate, and related stats"
        />
        <MetricTable
          section="pricing"
          selectedBots={selectedBots}
          title="Pricing"
          description="Subscription cost and value metrics"
        />
      </div>

      <div className="mb-8">
        <MetricTable
          section="profile"
          selectedBots={selectedBots}
          title="Profile"
          description="Strategy, pair, risk, category, and verification"
        />
      </div>

      <Card className="border-border/70 bg-card/80 mb-8">
        <CardHeader>
          <CardTitle>Charts</CardTitle>
          <CardDescription>
            Overlay equity, ROI, drawdown, monthly returns, and performance snapshot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="equity">
            <TabsList className="flex h-auto flex-wrap">
              <TabsTrigger value="equity">Equity</TabsTrigger>
              <TabsTrigger value="roi">ROI</TabsTrigger>
              <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
            </TabsList>

            <TabsContent value="equity" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                    />
                    <Legend />
                    {selectedBots.map((bot, i) => (
                      <Line
                        key={bot.id}
                        type="monotone"
                        dataKey={botSeriesKey(bot, i)}
                        name={bot.name}
                        stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="roi" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(2)}%`,
                        String(name),
                      ]}
                    />
                    <Legend />
                    {selectedBots.map((bot, i) => (
                      <Line
                        key={bot.id}
                        type="monotone"
                        dataKey={botSeriesKey(bot, i)}
                        name={bot.name}
                        stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="drawdown" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={drawdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v) => `${Number(v)}%`}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}%`,
                        String(name),
                      ]}
                    />
                    <Legend />
                    {selectedBots.map((bot, i) => (
                      <Line
                        key={bot.id}
                        type="monotone"
                        dataKey={botSeriesKey(bot, i)}
                        name={bot.name}
                        stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(v) => `${Number(v)}%`}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}%`,
                        String(name),
                      ]}
                    />
                    <Legend />
                    {selectedBots.map((bot, i) => (
                      <Bar
                        key={bot.id}
                        dataKey={botSeriesKey(bot, i)}
                        name={bot.name}
                        fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="snapshot" className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={snapshotData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="metric" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend />
                    {selectedBots.map((bot, i) => (
                      <Bar
                        key={bot.id}
                        dataKey={botSeriesKey(bot, i)}
                        name={bot.name}
                        fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Snapshot scales profit factor ×10 so it sits alongside percentage metrics.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <section className="mb-8" aria-labelledby="compare-pricing-heading">
        <div className="mb-4">
          <h2 id="compare-pricing-heading" className="text-xl font-semibold tracking-tight">
            Pricing
          </h2>
          <p className="text-muted-foreground text-sm">
            Monthly subscription, annual cost, and value per ROI point
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {selectedBots.map((bot, i) => (
            <Card key={bot.id} className="border-border/70 bg-card/80">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                  />
                  {bot.name}
                </CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(bot.price)}/mo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  Annual: {formatCurrency(annualPrice(bot.price))}
                </p>
                <p className="text-muted-foreground">
                  Value: {formatCurrency(pricePerRoiPoint(bot))} per 1% ROI
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button className="w-full" asChild>
                    <Link href={`/bots/${bot.slug}`}>
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/billing">Subscribe</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/marketplace">Browse marketplace</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/recommend">Get AI recommendations</Link>
        </Button>
      </div>
    </Container>
  );
}
