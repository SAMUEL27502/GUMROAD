"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, TrendingDown, TrendingUp } from "lucide-react";
import { TradingViewAdvancedChart } from "@/components/charts/tradingview-advanced-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  chartCategories,
  chartSymbols,
  chartTimeframes,
  getChartSymbol,
  getSymbolsByCategory,
  type ChartCategory,
} from "@/lib/data/charts";
import { cn, formatPercent } from "@/lib/utils";
import { useWatchlistStore } from "@/stores/watchlist-store";

export default function ChartsPage() {
  const [category, setCategory] = useState<ChartCategory>("Forex");
  const [activeSymbol, setActiveSymbol] = useState("EURUSD");
  const [interval, setInterval] = useState("60");
  const { symbols, toggleSymbol, hasSymbol } = useWatchlistStore();

  const categorySymbols = useMemo(() => getSymbolsByCategory(category), [category]);
  const activeMeta = getChartSymbol(activeSymbol);
  const watchlistItems = useMemo(
    () => chartSymbols.filter((s) => symbols.includes(s.symbol)),
    [symbols]
  );

  function selectCategory(next: ChartCategory) {
    setCategory(next);
    const list = getSymbolsByCategory(next);
    if (!list.some((s) => s.symbol === activeSymbol) && list[0]) {
      setActiveSymbol(list[0].symbol);
    }
  }

  function selectSymbol(symbol: string) {
    const meta = getChartSymbol(symbol);
    if (!meta) return;
    setActiveSymbol(symbol);
    setCategory(meta.category);
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Badge variant="secondary" className="mb-3">
            TradingView · Dark
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Advanced</span> Charts
          </h1>
          <p className="mt-2 text-muted-foreground">
            TradingView Advanced Chart Widget — Forex, Metals, and Crypto with multi-timeframe
            analysis.
          </p>
        </motion.div>

        {/* Top category tabs */}
        <Tabs
          value={category}
          onValueChange={(v) => selectCategory(v as ChartCategory)}
          className="mb-6"
        >
          <TabsList className="h-auto flex-wrap">
            {chartCategories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="min-w-[88px]">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {chartCategories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-3">
              <div className="flex flex-wrap gap-2">
                {getSymbolsByCategory(cat).map((s) => (
                  <Button
                    key={s.symbol}
                    variant={activeSymbol === s.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectSymbol(s.symbol)}
                  >
                    {s.symbol}
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full shrink-0 lg:w-72"
          >
            <Card className="mb-4 border-border/70 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-amber-400" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {watchlistItems.length > 0 ? (
                  watchlistItems.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => selectSymbol(item.symbol)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        activeSymbol === item.symbol
                          ? "bg-sky-500/15 text-sky-300"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <span className="font-semibold">{item.symbol}</span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          item.change >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {formatPercent(item.change)}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    Add symbols to your watchlist below
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category} markets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-4 pt-0">
                {categorySymbols.map((item) => (
                  <div
                    key={item.symbol}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                      activeSymbol === item.symbol && "bg-muted/40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectSymbol(item.symbol)}
                      className="flex flex-1 cursor-pointer items-center gap-2 text-left text-sm"
                    >
                      <span className="font-semibold">{item.symbol}</span>
                      {item.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          item.change >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {formatPercent(item.change)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSymbol(item.symbol)}
                        className={cn(
                          "flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors",
                          hasSymbol(item.symbol)
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                        aria-label="Toggle watchlist"
                      >
                        <Star
                          className={cn("h-3.5 w-3.5", hasSymbol(item.symbol) && "fill-current")}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="min-w-0 flex-1"
          >
            <Card className="overflow-hidden border-border/70 bg-card/80">
              <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{activeSymbol}</h2>
                    <Badge variant="outline">{category}</Badge>
                    <Badge variant="secondary">Dark theme</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeMeta?.name} · {activeMeta?.tvSymbol}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chartTimeframes.map((tf) => (
                    <Button
                      key={tf.value}
                      variant={interval === tf.value ? "default" : "outline"}
                      size="sm"
                      className="min-w-[44px] px-2.5"
                      onClick={() => setInterval(tf.value)}
                    >
                      {tf.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-[520px] bg-[#111827] lg:h-[640px]">
                <TradingViewAdvancedChart symbol={activeSymbol} interval={interval} />
              </div>
            </Card>

            <div className="mt-4 flex flex-wrap gap-2">
              {categorySymbols.map((s) => (
                <Button
                  key={s.symbol}
                  variant={activeSymbol === s.symbol ? "default" : "glass"}
                  size="sm"
                  onClick={() => selectSymbol(s.symbol)}
                >
                  {s.symbol}
                  {!hasSymbol(s.symbol) && (
                    <Plus
                      className="h-3 w-3 opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSymbol(s.symbol);
                      }}
                    />
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
