/** Seed data for the MT5 mobile terminal preview (demo quotes / positions). */

export type Mt5MobileQuote = {
  symbol: string;
  digits: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  time: string;
  spread: number;
  /** Daily change in points (bid vs previous close) */
  change: number;
};

export type Mt5MobilePosition = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: number | null;
  tp: number | null;
  swap: number;
  profit: number;
  time: string;
};

export type Mt5MobileHistoryDeal = {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  time: string;
};

export type Mt5MobileTimeframe = {
  label: string;
  value: string;
};

export const mt5MobileTimeframes: Mt5MobileTimeframe[] = [
  { label: "M1", value: "M1" },
  { label: "M5", value: "M5" },
  { label: "M15", value: "M15" },
  { label: "M30", value: "M30" },
  { label: "H1", value: "H1" },
  { label: "H4", value: "H4" },
  { label: "D1", value: "D1" },
  { label: "W1", value: "W1" },
  { label: "MN", value: "MN" },
];

export const mt5MobileQuotes: Mt5MobileQuote[] = [
  {
    symbol: "EURUSD",
    digits: 5,
    bid: 1.08412,
    ask: 1.08428,
    high: 1.0864,
    low: 1.0819,
    time: "14:32:08",
    spread: 1.6,
    change: 12,
  },
  {
    symbol: "GBPUSD",
    digits: 5,
    bid: 1.26341,
    ask: 1.26362,
    high: 1.2661,
    low: 1.2602,
    time: "14:32:07",
    spread: 2.1,
    change: -8,
  },
  {
    symbol: "USDJPY",
    digits: 3,
    bid: 149.842,
    ask: 149.858,
    high: 150.12,
    low: 149.41,
    time: "14:32:08",
    spread: 1.6,
    change: 24,
  },
  {
    symbol: "AUDUSD",
    digits: 5,
    bid: 0.65218,
    ask: 0.65236,
    high: 0.6542,
    low: 0.6501,
    time: "14:32:06",
    spread: 1.8,
    change: 5,
  },
  {
    symbol: "USDCAD",
    digits: 5,
    bid: 1.36482,
    ask: 1.36504,
    high: 1.3671,
    low: 1.3624,
    time: "14:32:05",
    spread: 2.2,
    change: -3,
  },
  {
    symbol: "XAUUSD",
    digits: 2,
    bid: 2348.42,
    ask: 2348.72,
    high: 2356.1,
    low: 2339.8,
    time: "14:32:08",
    spread: 30,
    change: 186,
  },
  {
    symbol: "XAGUSD",
    digits: 3,
    bid: 27.412,
    ask: 27.448,
    high: 27.62,
    low: 27.18,
    time: "14:32:04",
    spread: 36,
    change: -22,
  },
  {
    symbol: "BTCUSD",
    digits: 2,
    bid: 68420.5,
    ask: 68442.0,
    high: 69120.0,
    low: 67840.0,
    time: "14:32:08",
    spread: 21.5,
    change: 420,
  },
  {
    symbol: "ETHUSD",
    digits: 2,
    bid: 3482.6,
    ask: 3484.1,
    high: 3520.0,
    low: 3448.0,
    time: "14:32:07",
    spread: 1.5,
    change: 38,
  },
  {
    symbol: "NAS100",
    digits: 1,
    bid: 19842.5,
    ask: 19844.2,
    high: 19910.0,
    low: 19760.0,
    time: "14:32:06",
    spread: 1.7,
    change: 64,
  },
];

export const mt5MobilePositions: Mt5MobilePosition[] = [
  {
    id: "pos-1",
    symbol: "XAUUSD",
    type: "BUY",
    volume: 0.15,
    openPrice: 2341.2,
    currentPrice: 2348.42,
    sl: 2328.0,
    tp: 2365.0,
    swap: -1.2,
    profit: 108.3,
    time: "2026.08.11 09:14",
  },
  {
    id: "pos-2",
    symbol: "USDJPY",
    type: "BUY",
    volume: 0.4,
    openPrice: 149.62,
    currentPrice: 149.842,
    sl: 149.1,
    tp: 150.4,
    swap: -0.4,
    profit: 59.2,
    time: "2026.08.11 11:02",
  },
  {
    id: "pos-3",
    symbol: "EURUSD",
    type: "SELL",
    volume: 0.5,
    openPrice: 1.0854,
    currentPrice: 1.08412,
    sl: 1.088,
    tp: 1.08,
    swap: 0.6,
    profit: 64.0,
    time: "2026.08.11 08:41",
  },
  {
    id: "pos-4",
    symbol: "AUDUSD",
    type: "SELL",
    volume: 0.2,
    openPrice: 0.6514,
    currentPrice: 0.65218,
    sl: null,
    tp: 0.648,
    swap: 0.1,
    profit: -15.6,
    time: "2026.08.11 12:28",
  },
];

export const mt5MobileHistory: Mt5MobileHistoryDeal[] = [
  {
    id: "h1",
    symbol: "XAUUSD",
    type: "BUY",
    volume: 0.15,
    openPrice: 2332.1,
    closePrice: 2341.2,
    profit: 136.5,
    time: "2026.08.10 16:22",
  },
  {
    id: "h2",
    symbol: "EURUSD",
    type: "SELL",
    volume: 0.5,
    openPrice: 1.0868,
    closePrice: 1.0842,
    profit: 130.0,
    time: "2026.08.10 14:05",
  },
  {
    id: "h3",
    symbol: "GBPUSD",
    type: "BUY",
    volume: 0.3,
    openPrice: 1.2652,
    closePrice: 1.2634,
    profit: -54.0,
    time: "2026.08.10 11:48",
  },
  {
    id: "h4",
    symbol: "BTCUSD",
    type: "BUY",
    volume: 0.05,
    openPrice: 67210,
    closePrice: 68140,
    profit: 46.5,
    time: "2026.08.09 22:10",
  },
  {
    id: "h5",
    symbol: "USDJPY",
    type: "SELL",
    volume: 0.25,
    openPrice: 150.12,
    closePrice: 149.68,
    profit: 73.6,
    time: "2026.08.09 18:33",
  },
  {
    id: "h6",
    symbol: "NAS100",
    type: "BUY",
    volume: 0.1,
    openPrice: 19780,
    closePrice: 19820,
    profit: 40.0,
    time: "2026.08.08 15:01",
  },
];

/** Deterministic pseudo-candles for the mobile chart preview */
export function buildMt5MobileCandles(seed: number, count = 48) {
  const candles: { o: number; h: number; l: number; c: number }[] = [];
  let price = 50 + (seed % 30);
  for (let i = 0; i < count; i++) {
    const drift = Math.sin((i + seed) * 0.35) * 1.8 + Math.cos((i + seed) * 0.17) * 0.9;
    const open = price;
    const close = Math.max(8, open + drift);
    const high = Math.max(open, close) + 0.8 + ((i + seed) % 3) * 0.25;
    const low = Math.min(open, close) - 0.8 - ((i + seed) % 2) * 0.2;
    candles.push({ o: open, h: high, l: low, c: close });
    price = close;
  }
  return candles;
}

export function formatMt5Price(value: number, digits: number) {
  return value.toFixed(digits);
}
