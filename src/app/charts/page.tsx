"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { watchlistSymbols } from "@/lib/data/platform";
import { cn, formatPercent } from "@/lib/utils";
import { useWatchlistStore } from "@/stores/watchlist-store";

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
];

const TV_SYMBOL_MAP: Record<string, string> = {
  EURUSD: "FX:EURUSD",
  GBPUSD: "FX:GBPUSD",
  USDJPY: "FX:USDJPY",
  AUDUSD: "FX:AUDUSD",
  XAUUSD: "OANDA:XAUUSD",
  XAGUSD: "OANDA:XAGUSD",
  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
};

function TradingViewChart({ symbol, interval }: { symbol: string; interval: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: TV_SYMBOL_MAP[symbol] || `FX:${symbol}`,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: false,
      withdateranges: false,
      save_image: false,
      backgroundColor: "#111827",
      gridColor: "rgba(148, 163, 184, 0.08)",
      support_host: "https://www.tradingview.com",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol, interval]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container h-full w-full"
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default function ChartsPage() {
  const [category, setCategory] = useState<"Forex" | "Metals" | "Crypto">("Forex");
  const [activeSymbol, setActiveSymbol] = useState("EURUSD");
  const [interval, setInterval] = useState("60");
  const { symbols, toggleSymbol, hasSymbol } = useWatchlistStore();

  const categorySymbols = watchlistSymbols.filter((s) => s.category === category);
  const watchlistItems = watchlistSymbols.filter((s) => symbols.includes(s.symbol));

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
            Live Charts
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">TradingView</span> Charts
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time charts powered by TradingView with multi-timeframe analysis.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full shrink-0 lg:w-72"
          >
            {/* Watchlist */}
            <Card className="border-border/70 bg-card/80 mb-4">
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
                      onClick={() => {
                        setActiveSymbol(item.symbol);
                        setCategory(item.category as "Forex" | "Metals" | "Crypto");
                      }}
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
                  <p className="text-muted-foreground py-4 text-center text-xs">
                    Add symbols to your watchlist below
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Category tabs + symbols */}
            <Card className="border-border/70 bg-card/80">
              <CardContent className="p-4">
                <Tabs
                  value={category}
                  onValueChange={(v) => setCategory(v as "Forex" | "Metals" | "Crypto")}
                >
                  <TabsList className="mb-3 w-full">
                    <TabsTrigger value="Forex" className="flex-1 text-xs">
                      Forex
                    </TabsTrigger>
                    <TabsTrigger value="Metals" className="flex-1 text-xs">
                      Metals
                    </TabsTrigger>
                    <TabsTrigger value="Crypto" className="flex-1 text-xs">
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  {(["Forex", "Metals", "Crypto"] as const).map((cat) => (
                    <TabsContent key={cat} value={cat} className="mt-0 space-y-1">
                      {watchlistSymbols
                        .filter((s) => s.category === cat)
                        .map((item) => (
                          <div
                            key={item.symbol}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                              activeSymbol === item.symbol && "bg-muted/40"
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveSymbol(item.symbol)}
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
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    hasSymbol(item.symbol) && "fill-current"
                                  )}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main chart area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="min-w-0 flex-1"
          >
            <Card className="border-border/70 bg-card/80 overflow-hidden">
              <div className="border-border/50 flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">{activeSymbol}</h2>
                  <p className="text-muted-foreground text-xs">
                    {TV_SYMBOL_MAP[activeSymbol] || activeSymbol}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TIMEFRAMES.map((tf) => (
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
              <div className="h-[520px] lg:h-[600px]">
                <TradingViewChart symbol={activeSymbol} interval={interval} />
              </div>
            </Card>

            {/* Quick symbol pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categorySymbols.map((s) => (
                <Button
                  key={s.symbol}
                  variant={activeSymbol === s.symbol ? "default" : "glass"}
                  size="sm"
                  onClick={() => setActiveSymbol(s.symbol)}
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
