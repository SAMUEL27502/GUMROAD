"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  CandlestickChart,
  ChevronLeft,
  Clock3,
  History,
  LayoutList,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Mt5MobileChart } from "@/components/mt5/mt5-mobile-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatMt5Price,
  mt5MobileHistory,
  mt5MobilePositions,
  mt5MobileQuotes,
  mt5MobileTimeframes,
  type Mt5MobileQuote,
} from "@/lib/data/mt5-mobile";
import { cn, formatCurrency } from "@/lib/utils";
import { useMt5AccountsStore } from "@/store/mt5-accounts-store";

type TabId = "quotes" | "chart" | "trade" | "history" | "more";

const tabs: { id: TabId; label: string; icon: typeof LayoutList }[] = [
  { id: "quotes", label: "Quotes", icon: LayoutList },
  { id: "chart", label: "Chart", icon: CandlestickChart },
  { id: "trade", label: "Trade", icon: Wallet },
  { id: "history", label: "History", icon: History },
  { id: "more", label: "More", icon: MoreHorizontal },
];

function tickQuotes(quotes: Mt5MobileQuote[]): Mt5MobileQuote[] {
  return quotes.map((q, i) => {
    const step = Math.pow(10, -q.digits);
    const nudge = ((i % 3) - 1) * step * (Math.random() > 0.45 ? 1 : 0);
    const bid = Number((q.bid + nudge).toFixed(q.digits));
    const ask = Number((bid + q.spread * step).toFixed(q.digits));
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    return {
      ...q,
      bid,
      ask,
      high: Math.max(q.high, ask),
      low: Math.min(q.low, bid),
      time,
      change: q.change + (nudge > 0 ? 1 : nudge < 0 ? -1 : 0),
    };
  });
}

export function Mt5MobileTerminal() {
  const { accounts } = useMt5AccountsStore();
  const primary = accounts.find((a) => a.connected) ?? accounts[0];

  const [tab, setTab] = useState<TabId>("quotes");
  const [quotes, setQuotes] = useState(mt5MobileQuotes);
  const [selectedSymbol, setSelectedSymbol] = useState(mt5MobileQuotes[0]?.symbol ?? "EURUSD");
  const [timeframe, setTimeframe] = useState("H1");
  const [live, setLive] = useState(true);

  const selected = quotes.find((q) => q.symbol === selectedSymbol) ?? quotes[0];

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      setQuotes((prev) => tickQuotes(prev));
    }, 1800);
    return () => window.clearInterval(id);
  }, [live]);

  const accountSummary = useMemo(() => {
    if (!primary) {
      return {
        balance: 24850.42,
        equity: 25120.18,
        margin: 6680,
        freeMargin: 18440.55,
        marginLevel: 412.6,
        profit: 269.76,
        login: "8742931",
        server: "ICMarkets-Live03",
        nickname: "Demo Terminal",
      };
    }
    const profit = Number((primary.equity - primary.balance).toFixed(2));
    const margin = Number((primary.equity - primary.freeMargin).toFixed(2));
    return {
      balance: primary.balance,
      equity: primary.equity,
      margin,
      freeMargin: primary.freeMargin,
      marginLevel: primary.marginLevel,
      profit,
      login: primary.accountNumber,
      server: primary.brokerServer,
      nickname: primary.nickname,
    };
  }, [primary]);

  const openProfit = mt5MobilePositions.reduce((s, p) => s + p.profit, 0);
  const historyProfit = mt5MobileHistory.reduce((s, d) => s + d.profit, 0);

  function openChart(symbol: string) {
    setSelectedSymbol(symbol);
    setTab("chart");
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              MetaTrader 5 · Mobile
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              MT5 <span className="gradient-text">Mobile Terminal</span>
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Phone-first Quotes, Chart, Trade, and History — styled like the MetaTrader 5 mobile
              app, synced with your TradeBib connection cards.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/mt5">
                <ChevronLeft className="h-4 w-4" />
                MT5 Connect
              </Link>
            </Button>
            <Button
              variant={live ? "secondary" : "outline"}
              onClick={() => setLive((v) => !v)}
              aria-pressed={live}
            >
              <RefreshCw className={cn("h-4 w-4", live && "animate-spin [animation-duration:2.4s]")} />
              {live ? "Live ticks" : "Paused"}
            </Button>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="order-2 space-y-4 lg:order-1">
            <FeatureRow
              icon={Smartphone}
              title="Native mobile layout"
              body="Bottom tabs for Quotes, Chart, Trade, History, and More — the same navigation model as MetaTrader 5 for iOS/Android."
            />
            <FeatureRow
              icon={BarChart3}
              title="Live quote board"
              body="Bid/Ask columns with spread, daily range, and tap-to-chart. Demo ticks animate while Live is on."
            />
            <FeatureRow
              icon={Wallet}
              title="Account + positions"
              body="Balance, equity, margin, and open positions pull from your connected MT5 investor account when available."
            />
            <div className="rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
              Demo preview only — not a live broker terminal. Connect an investor account on{" "}
              <Link href="/mt5" className="text-sky-400 hover:underline">
                MT5 Connect
              </Link>{" "}
              to sync balances into this view. Official MetaTrader 5 apps:{" "}
              <a
                href="https://www.metatrader5.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline"
              >
                metatrader5.com
              </a>
              .
            </div>
          </div>

          {/* Phone frame */}
          <div className="order-1 mx-auto w-full max-w-[390px] lg:order-2 lg:sticky lg:top-24">
            <div className="rounded-[2.25rem] border border-slate-700/80 bg-slate-950 p-2 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.9)] ring-1 ring-sky-500/20">
              <div className="overflow-hidden rounded-[1.85rem] border border-slate-800 bg-[#0a0e13]">
                {/* Status / header */}
                <div className="flex items-center justify-between bg-[#0f1720] px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[11px] font-semibold tracking-wide text-slate-200">
                      MetaTrader 5
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {accountSummary.login}
                  </span>
                </div>

                <div className="flex h-[640px] flex-col">
                  <div className="border-b border-slate-800/80 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-100">
                        {tabs.find((t) => t.id === tab)?.label}
                      </h2>
                      {tab === "quotes" && (
                        <button
                          type="button"
                          className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                          aria-label="Add symbol"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                      {tab === "chart" && (
                        <div className="flex max-w-[220px] gap-1 overflow-x-auto">
                          {mt5MobileTimeframes.map((tf) => (
                            <button
                              key={tf.value}
                              type="button"
                              onClick={() => setTimeframe(tf.value)}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                                timeframe === tf.value
                                  ? "bg-sky-500/20 text-sky-300"
                                  : "text-slate-500 hover:text-slate-300"
                              )}
                            >
                              {tf.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-slate-500">
                      {accountSummary.server} · {accountSummary.nickname}
                    </p>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="h-full"
                      >
                        {tab === "quotes" && (
                          <QuotesTab
                            quotes={quotes}
                            selectedSymbol={selectedSymbol}
                            onSelect={setSelectedSymbol}
                            onOpenChart={openChart}
                          />
                        )}
                        {tab === "chart" && selected && (
                          <ChartTab
                            quote={selected}
                            timeframe={timeframe}
                            onTrade={() => setTab("trade")}
                          />
                        )}
                        {tab === "trade" && (
                          <TradeTab summary={accountSummary} openProfit={openProfit} />
                        )}
                        {tab === "history" && <HistoryTab totalProfit={historyProfit} />}
                        {tab === "more" && <MoreTab accountCount={accounts.length} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <nav
                    className="grid grid-cols-5 border-t border-slate-800 bg-[#0c1218]"
                    aria-label="MT5 mobile tabs"
                  >
                    {tabs.map((item) => {
                      const Icon = item.icon;
                      const active = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                            active ? "text-sky-400" : "text-slate-500 hover:text-slate-300"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Smartphone;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/60 bg-card/50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15">
        <Icon className="h-5 w-5 text-sky-400" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function QuotesTab({
  quotes,
  selectedSymbol,
  onSelect,
  onOpenChart,
}: {
  quotes: Mt5MobileQuote[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
  onOpenChart: (symbol: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_72px_72px_28px] gap-1 border-b border-slate-800/80 px-3 py-1.5 text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
        <span>Symbol</span>
        <span className="text-right">Bid</span>
        <span className="text-right">Ask</span>
        <span className="sr-only">Chart</span>
      </div>
      <ul>
        {quotes.map((q) => {
          const up = q.change >= 0;
          const selected = q.symbol === selectedSymbol;
          return (
            <li key={q.symbol}>
              <div
                className={cn(
                  "grid w-full grid-cols-[1fr_72px_72px_28px] items-center gap-1 border-b border-slate-900/80 px-3 py-2 transition-colors",
                  selected ? "bg-sky-500/10" : "hover:bg-slate-900/80"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(q.symbol)}
                  className="text-left"
                >
                  <span className="block text-[13px] font-semibold text-slate-100">{q.symbol}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[9px] text-slate-500">
                    <Clock3 className="h-2.5 w-2.5" />
                    {q.time}
                    <span className={up ? "text-emerald-400" : "text-rose-400"}>
                      {up ? "+" : ""}
                      {q.change}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(q.symbol)}
                  className="rounded bg-emerald-500/15 py-1.5 text-right font-mono text-[11px] font-semibold text-emerald-300"
                >
                  {formatMt5Price(q.bid, q.digits)}
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(q.symbol)}
                  className="rounded bg-rose-500/15 py-1.5 text-right font-mono text-[11px] font-semibold text-rose-300"
                >
                  {formatMt5Price(q.ask, q.digits)}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChart(q.symbol)}
                  className="flex items-center justify-center rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-sky-300"
                  aria-label={`Open ${q.symbol} chart`}
                >
                  <CandlestickChart className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="px-3 py-2 text-center text-[10px] text-slate-600">
        Tap the chart icon to open Chart
      </p>
    </div>
  );
}

function ChartTab({
  quote,
  timeframe,
  onTrade,
}: {
  quote: Mt5MobileQuote;
  timeframe: string;
  onTrade: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <Mt5MobileChart
          symbol={quote.symbol}
          bid={quote.bid}
          ask={quote.ask}
          digits={quote.digits}
          className="h-full min-h-[320px]"
        />
      </div>
      <div className="border-t border-slate-800 bg-[#0c1218] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>
            {quote.symbol} · {timeframe}
          </span>
          <span>
            H {formatMt5Price(quote.high, quote.digits)} · L{" "}
            {formatMt5Price(quote.low, quote.digits)} · Spr {quote.spread}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onTrade}
            className="rounded-lg bg-emerald-600/90 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30"
          >
            Buy {formatMt5Price(quote.ask, quote.digits)}
          </button>
          <button
            type="button"
            onClick={onTrade}
            className="rounded-lg bg-rose-600/90 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/30"
          >
            Sell {formatMt5Price(quote.bid, quote.digits)}
          </button>
        </div>
      </div>
    </div>
  );
}

function TradeTab({
  summary,
  openProfit,
}: {
  summary: {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    profit: number;
  };
  openProfit: number;
}) {
  return (
    <div>
      <div className="space-y-1 border-b border-slate-800 bg-[#0f1720] px-3 py-3 font-mono text-[11px]">
        <AccountLine label="Balance" value={formatCurrency(summary.balance)} />
        <AccountLine
          label="Equity"
          value={formatCurrency(summary.equity)}
          className="text-sky-300"
        />
        <AccountLine label="Margin" value={formatCurrency(summary.margin)} />
        <AccountLine label="Free Margin" value={formatCurrency(summary.freeMargin)} />
        <AccountLine label="Margin Level" value={`${summary.marginLevel.toFixed(1)}%`} />
        <AccountLine
          label="Floating P/L"
          value={`${openProfit >= 0 ? "+" : ""}${formatCurrency(openProfit)}`}
          className={openProfit >= 0 ? "text-emerald-400" : "text-rose-400"}
        />
      </div>

      <div className="border-b border-slate-800 px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
        Positions ({mt5MobilePositions.length})
      </div>
      <ul>
        {mt5MobilePositions.map((p) => (
          <li key={p.id} className="border-b border-slate-900/80 px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-slate-100">
                  {p.symbol}{" "}
                  <span
                    className={cn(
                      "text-[11px]",
                      p.type === "BUY" ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {p.type} {p.volume}
                  </span>
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {p.openPrice} → {p.currentPrice}
                  {p.sl != null && ` · SL ${p.sl}`}
                  {p.tp != null && ` · TP ${p.tp}`}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-600">{p.time}</p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-mono text-[12px] font-bold",
                    p.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {p.profit >= 0 ? "+" : ""}
                  {formatCurrency(p.profit)}
                </p>
                <p className="text-[9px] text-slate-500">Swap {p.swap}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HistoryTab({ totalProfit }: { totalProfit: number }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f1720] px-3 py-2.5">
        <span className="text-[11px] text-slate-400">Closed deals</span>
        <span
          className={cn(
            "font-mono text-[12px] font-bold",
            totalProfit >= 0 ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {totalProfit >= 0 ? "+" : ""}
          {formatCurrency(totalProfit)}
        </span>
      </div>
      <ul>
        {mt5MobileHistory.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between gap-2 border-b border-slate-900/80 px-3 py-2.5"
          >
            <div>
              <p className="text-[13px] font-semibold text-slate-100">
                {d.symbol}{" "}
                <span
                  className={cn(
                    "text-[11px]",
                    d.type === "BUY" ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {d.type} {d.volume}
                </span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                {d.openPrice} → {d.closePrice}
              </p>
              <p className="text-[9px] text-slate-600">{d.time}</p>
            </div>
            <p
              className={cn(
                "font-mono text-[12px] font-bold",
                d.profit >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {d.profit >= 0 ? "+" : ""}
              {formatCurrency(d.profit)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoreTab({ accountCount }: { accountCount: number }) {
  const items = [
    { label: "Accounts", detail: `${accountCount} linked`, href: "/mt5" },
    { label: "Symbols", detail: `${mt5MobileQuotes.length} watched`, href: undefined },
    { label: "Settings", detail: "Demo preferences", href: "/profile" },
    { label: "Official MT5", detail: "metatrader5.com", href: "https://www.metatrader5.com" },
  ];

  return (
    <ul className="p-2">
      {items.map((item) => {
        const content = (
          <span className="flex w-full items-center justify-between rounded-xl px-3 py-3 hover:bg-slate-900/80">
            <span>
              <span className="block text-sm font-medium text-slate-100">{item.label}</span>
              <span className="text-[11px] text-slate-500">{item.detail}</span>
            </span>
            <ChevronLeft className="h-4 w-4 rotate-180 text-slate-600" />
          </span>
        );

        if (!item.href) {
          return (
            <li key={item.label} className="text-slate-400">
              {content}
            </li>
          );
        }

        const external = item.href.startsWith("http");
        return (
          <li key={item.label}>
            {external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link href={item.href}>{content}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AccountLine({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={cn("text-slate-200", className)}>{value}</span>
    </div>
  );
}
