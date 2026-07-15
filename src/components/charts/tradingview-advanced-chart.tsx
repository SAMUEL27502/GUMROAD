"use client";

import { useEffect, useId, useRef } from "react";
import { getChartSymbol } from "@/lib/data/charts";
import { cn } from "@/lib/utils";

export interface TradingViewAdvancedChartProps {
  /** Internal symbol key e.g. EURUSD */
  symbol: string;
  /** TradingView interval: 1, 5, 15, 60, 240, D, W */
  interval?: string;
  className?: string;
  height?: number | string;
}

/**
 * TradingView Advanced Chart Widget (dark theme).
 * Docs: https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/
 */
export function TradingViewAdvancedChart({
  symbol,
  interval = "60",
  className,
  height = "100%",
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const meta = getChartSymbol(symbol);
  const tvSymbol = meta?.tvSymbol ?? `FX:${symbol}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = typeof height === "number" ? `${height}px` : height;
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.dataset.tvId = reactId;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#0f172a",
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: false,
      withdateranges: true,
      save_image: true,
      details: false,
      hotlist: false,
      backgroundColor: "#111827",
      gridColor: "rgba(148, 163, 184, 0.08)",
      support_host: "https://www.tradingview.com",
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [tvSymbol, interval, height, reactId]);

  return (
    <div
      ref={containerRef}
      className={cn("tradingview-widget-container h-full w-full overflow-hidden", className)}
      style={{ height, width: "100%" }}
    />
  );
}
