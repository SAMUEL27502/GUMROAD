export type HeatCell = {
  id: string;
  label: string;
  pair: string;
  bot: string;
  pnl: number;
  allocation: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
};

/** Portfolio cells for heatmap intensity (PnL % of week). */
export const portfolioHeatmap: HeatCell[] = [
  { id: "h1", label: "Gold", pair: "XAUUSD", bot: "GoldScalper Pro", pnl: 4.2, allocation: 22, risk: "HIGH" },
  { id: "h2", label: "EUR", pair: "EURUSD", bot: "EuroTrend AI", pnl: 1.8, allocation: 18, risk: "MEDIUM" },
  { id: "h3", label: "GBP", pair: "GBPUSD", bot: "BreakoutHunter", pnl: -0.9, allocation: 12, risk: "MEDIUM" },
  { id: "h4", label: "JPY", pair: "USDJPY", bot: "TokyoRange", pnl: 0.6, allocation: 10, risk: "LOW" },
  { id: "h5", label: "NAS", pair: "NAS100", bot: "IndexPulse", pnl: 2.4, allocation: 14, risk: "HIGH" },
  { id: "h6", label: "BTC", pair: "BTCUSD", bot: "CryptoGrid", pnl: -1.5, allocation: 8, risk: "HIGH" },
  { id: "h7", label: "AUD", pair: "AUDUSD", bot: "QuietGrid", pnl: 0.4, allocation: 7, risk: "LOW" },
  { id: "h8", label: "OIL", pair: "USOIL", bot: "CommoditySwing", pnl: 1.1, allocation: 9, risk: "MEDIUM" },
];

export function heatColor(pnl: number) {
  if (pnl >= 3) return "bg-emerald-500/80 text-white";
  if (pnl >= 1) return "bg-emerald-500/45 text-emerald-50";
  if (pnl >= 0) return "bg-emerald-500/20 text-emerald-200";
  if (pnl >= -1) return "bg-red-500/25 text-red-200";
  return "bg-red-500/70 text-white";
}
