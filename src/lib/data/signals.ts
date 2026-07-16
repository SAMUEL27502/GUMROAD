export type SignalSide = "BUY" | "SELL";
export type SignalStatus = "ACTIVE" | "HIT_TP" | "HIT_SL" | "EXPIRED";

export type TradingSignal = {
  id: string;
  pair: string;
  side: SignalSide;
  entry: number;
  tp: number;
  sl: number;
  confidence: number;
  timeframe: string;
  source: string;
  status: SignalStatus;
  createdAt: string;
  rationale: string;
};

export const tradingSignals: TradingSignal[] = [
  {
    id: "sig1",
    pair: "EURUSD",
    side: "BUY",
    entry: 1.0842,
    tp: 1.091,
    sl: 1.0795,
    confidence: 78,
    timeframe: "H1",
    source: "EuroTrend AI",
    status: "ACTIVE",
    createdAt: "2026-07-15T14:20:00Z",
    rationale: "Break above session VWAP with rising ADX and soft USD tape.",
  },
  {
    id: "sig2",
    pair: "XAUUSD",
    side: "SELL",
    entry: 2384.5,
    tp: 2368,
    sl: 2396,
    confidence: 71,
    timeframe: "M15",
    source: "GoldScalper Pro",
    status: "HIT_TP",
    createdAt: "2026-07-15T09:05:00Z",
    rationale: "Rejection at London high with divergence on RSI.",
  },
  {
    id: "sig3",
    pair: "GBPUSD",
    side: "BUY",
    entry: 1.274,
    tp: 1.2815,
    sl: 1.269,
    confidence: 64,
    timeframe: "H4",
    source: "BreakoutHunter",
    status: "ACTIVE",
    createdAt: "2026-07-14T18:40:00Z",
    rationale: "Range break with positive UK retail sales surprise.",
  },
  {
    id: "sig4",
    pair: "NAS100",
    side: "SELL",
    entry: 20140,
    tp: 19980,
    sl: 20255,
    confidence: 59,
    timeframe: "H1",
    source: "IndexPulse",
    status: "HIT_SL",
    createdAt: "2026-07-14T15:10:00Z",
    rationale: "Failed retest of supply after CPI headline miss.",
  },
  {
    id: "sig5",
    pair: "USDJPY",
    side: "BUY",
    entry: 157.2,
    tp: 158.1,
    sl: 156.55,
    confidence: 69,
    timeframe: "H1",
    source: "QuietGrid",
    status: "ACTIVE",
    createdAt: "2026-07-15T11:30:00Z",
    rationale: "Yen soft on BoJ hold; grid bias long on pullbacks.",
  },
];
