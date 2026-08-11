"use client";

import { useId, useMemo } from "react";
import { buildMt5MobileCandles } from "@/lib/data/mt5-mobile";
import { cn } from "@/lib/utils";

interface Mt5MobileChartProps {
  symbol: string;
  bid: number;
  ask: number;
  digits: number;
  className?: string;
}

/** Lightweight candlestick preview — no external chart SDK. */
export function Mt5MobileChart({ symbol, bid, ask, digits, className }: Mt5MobileChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const candles = useMemo(() => {
    const seed = symbol.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return buildMt5MobileCandles(seed, 52);
  }, [symbol]);

  const width = 360;
  const height = 280;
  const padX = 8;
  const padY = 12;
  const lows = candles.map((c) => c.l);
  const highs = candles.map((c) => c.h);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = Math.max(max - min, 0.001);
  const slot = (width - padX * 2) / candles.length;
  const bodyW = Math.max(2.2, slot * 0.55);

  const y = (v: number) => padY + ((max - v) / span) * (height - padY * 2);

  const mid = (bid + ask) / 2;
  const midLabel = mid.toFixed(digits);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0b0f14]", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        role="img"
        aria-label={`${symbol} candlestick chart`}
      >
        <defs>
          <linearGradient id={`mt5-chart-bg-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#122033" />
            <stop offset="100%" stopColor="#0b0f14" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#mt5-chart-bg-${gradientId})`} />

        {[0.25, 0.5, 0.75].map((t) => {
          const gy = padY + t * (height - padY * 2);
          return (
            <line
              key={t}
              x1={padX}
              x2={width - padX}
              y1={gy}
              y2={gy}
              stroke="#1e293b"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          );
        })}

        {candles.map((c, i) => {
          const x = padX + i * slot + slot / 2;
          const up = c.c >= c.o;
          const color = up ? "#22c55e" : "#ef4444";
          const top = y(Math.max(c.o, c.c));
          const bottom = y(Math.min(c.o, c.c));
          const bodyH = Math.max(1.5, bottom - top);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} />
              <rect
                x={x - bodyW / 2}
                y={top}
                width={bodyW}
                height={bodyH}
                fill={color}
                rx={0.5}
              />
            </g>
          );
        })}

        <line
          x1={padX}
          x2={width - padX}
          y1={y(candles[candles.length - 1]?.c ?? mid)}
          y2={y(candles[candles.length - 1]?.c ?? mid)}
          stroke="#38bdf8"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.7}
        />
      </svg>

      <div className="pointer-events-none absolute top-2 left-3 right-3 flex items-start justify-between text-[10px]">
        <div>
          <p className="font-semibold tracking-wide text-slate-200">{symbol}</p>
          <p className="mt-0.5 text-slate-400">
            Bid <span className="text-sky-300">{bid.toFixed(digits)}</span>
            <span className="mx-1.5 text-slate-600">·</span>
            Ask <span className="text-rose-300">{ask.toFixed(digits)}</span>
          </p>
        </div>
        <span className="rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-sky-300">
          {midLabel}
        </span>
      </div>
    </div>
  );
}
