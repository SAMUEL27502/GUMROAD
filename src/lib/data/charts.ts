export type ChartCategory = "Forex" | "Metals" | "Crypto";

export interface ChartSymbol {
  symbol: string;
  name: string;
  category: ChartCategory;
  /** TradingView Advanced Chart symbol id */
  tvSymbol: string;
  change: number;
}

/** Supported symbols for the TradingView Advanced Chart page. */
export const chartSymbols: ChartSymbol[] = [
  {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    category: "Forex",
    tvSymbol: "FX:EURUSD",
    change: 0.24,
  },
  {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    category: "Forex",
    tvSymbol: "FX:GBPUSD",
    change: -0.12,
  },
  {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    category: "Forex",
    tvSymbol: "FX:USDJPY",
    change: 0.08,
  },
  {
    symbol: "AUDUSD",
    name: "Australian Dollar / US Dollar",
    category: "Forex",
    tvSymbol: "FX:AUDUSD",
    change: 0.15,
  },
  {
    symbol: "XAUUSD",
    name: "Gold / US Dollar",
    category: "Metals",
    tvSymbol: "OANDA:XAUUSD",
    change: 0.62,
  },
  {
    symbol: "XAGUSD",
    name: "Silver / US Dollar",
    category: "Metals",
    tvSymbol: "OANDA:XAGUSD",
    change: -0.31,
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin / US Dollar",
    category: "Crypto",
    tvSymbol: "BINANCE:BTCUSDT",
    change: 1.84,
  },
  {
    symbol: "ETHUSD",
    name: "Ethereum / US Dollar",
    category: "Crypto",
    tvSymbol: "BINANCE:ETHUSDT",
    change: 1.12,
  },
];

export const chartCategories: ChartCategory[] = ["Forex", "Metals", "Crypto"];

export const chartTimeframes = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
] as const;

export function getChartSymbol(symbol: string) {
  return chartSymbols.find((s) => s.symbol === symbol);
}

export function getSymbolsByCategory(category: ChartCategory) {
  return chartSymbols.filter((s) => s.category === category);
}
