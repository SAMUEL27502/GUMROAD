/**
 * Educational MetaTrader 5 (MQL5) samples for study and analysis.
 * Not investment advice — for learning platform APIs and research workflows.
 */

export type Mt5SampleKind = "EA" | "INDICATOR" | "SCRIPT" | "ANALYZER";

export type Mt5CodeSample = {
  id: string;
  slug: string;
  title: string;
  kind: Mt5SampleKind;
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  learningGoals: string[];
  analysisNotes: string[];
  filename: string;
  language: "mql5";
  code: string;
};

export const mt5SampleKinds: Array<{ id: "ALL" | Mt5SampleKind; label: string }> = [
  { id: "ALL", label: "All" },
  { id: "EA", label: "Expert Advisors" },
  { id: "INDICATOR", label: "Indicators" },
  { id: "SCRIPT", label: "Scripts" },
  { id: "ANALYZER", label: "Analyzers" },
];

export const mt5CodeSamples: Mt5CodeSample[] = [
  {
    id: "edu-ma-cross",
    slug: "ma-crossover-lab",
    title: "MA Crossover Lab EA",
    kind: "EA",
    level: "Beginner",
    summary:
      "Minimal moving-average crossover Expert Advisor with explicit risk inputs, trade logging, and no martingale — built for Strategy Tester experiments.",
    learningGoals: [
      "Wire OnInit / OnTick / OnDeinit lifecycle hooks",
      "Use iMA handles and CopyBuffer safely",
      "Place market orders with CTrade and fixed risk",
    ],
    analysisNotes: [
      "Compare results across symbols and periods in the Strategy Tester.",
      "Study how slip/spread assumptions change net expectancy.",
      "Disable trading and keep only signal prints for signal quality analysis.",
    ],
    filename: "Edu_MA_Crossover_Lab.mq5",
    language: "mql5",
    code: `//+------------------------------------------------------------------+
//| Edu_MA_Crossover_Lab.mq5                                         |
//| Educational MA crossover EA — analysis / Strategy Tester only    |
//| NOT financial advice. Use demo accounts.                         |
//+------------------------------------------------------------------+
#property copyright "TradeBib Education"
#property link      "https://tradebib.local/learn"
#property version   "1.00"
#property strict

#include <Trade/Trade.mqh>

input int      FastPeriod   = 20;      // Fast MA period
input int      SlowPeriod   = 50;      // Slow MA period
input ENUM_MA_METHOD MaMethod = MODE_EMA;
input double   RiskPercent  = 0.5;     // Risk per trade (% equity)
input double   StopPoints   = 300;     // Stop distance in points
input double   TakePoints   = 450;     // Take-profit distance in points
input ulong    MagicNumber  = 20260811;
input bool     EnableTrading = false;  // Keep false while studying signals

CTrade trade;
int fastHandle = INVALID_HANDLE;
int slowHandle = INVALID_HANDLE;

int OnInit()
  {
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(20);

   fastHandle = iMA(_Symbol, PERIOD_CURRENT, FastPeriod, 0, MaMethod, PRICE_CLOSE);
   slowHandle = iMA(_Symbol, PERIOD_CURRENT, SlowPeriod, 0, MaMethod, PRICE_CLOSE);
   if(fastHandle == INVALID_HANDLE || slowHandle == INVALID_HANDLE)
     {
      Print("Edu MA Lab: failed to create MA handles");
      return INIT_FAILED;
     }

   PrintFormat("Edu MA Lab ready | %s | Fast=%d Slow=%d Trading=%s",
               _Symbol, FastPeriod, SlowPeriod, EnableTrading ? "ON" : "OFF");
   return INIT_SUCCEEDED;
  }

void OnDeinit(const int reason)
  {
   if(fastHandle != INVALID_HANDLE) IndicatorRelease(fastHandle);
   if(slowHandle != INVALID_HANDLE) IndicatorRelease(slowHandle);
  }

bool CopyMa(const int handle, double &buffer[])
  {
   ArraySetAsSeries(buffer, true);
   return CopyBuffer(handle, 0, 0, 3, buffer) == 3;
  }

double LotsForRisk()
  {
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double point     = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   if(tickValue <= 0 || tickSize <= 0 || point <= 0 || StopPoints <= 0)
      return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double moneyRisk = equity * RiskPercent / 100.0;
   double stopMoney = (StopPoints * point / tickSize) * tickValue;
   if(stopMoney <= 0) return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double lots = moneyRisk / stopMoney;
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   double minv = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxv = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   lots = MathFloor(lots / step) * step;
   return MathMax(minv, MathMin(maxv, lots));
  }

bool HasOpenPosition()
  {
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol) continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) != MagicNumber) continue;
      return true;
     }
   return false;
  }

void OnTick()
  {
   static datetime lastBar = 0;
   datetime barTime = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(barTime == lastBar) return; // new-bar only — cleaner for analysis
   lastBar = barTime;

   double fast[], slow[];
   if(!CopyMa(fastHandle, fast) || !CopyMa(slowHandle, slow)) return;

   // Cross detected on closed bar [1] vs [2]
   bool crossUp   = fast[2] <= slow[2] && fast[1] > slow[1];
   bool crossDown = fast[2] >= slow[2] && fast[1] < slow[1];

   if(crossUp)
      PrintFormat("SIGNAL BUY  fast=%.5f slow=%.5f", fast[1], slow[1]);
   if(crossDown)
      PrintFormat("SIGNAL SELL fast=%.5f slow=%.5f", fast[1], slow[1]);

   if(!EnableTrading || HasOpenPosition()) return;

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   double lots = LotsForRisk();

   if(crossUp)
     {
      double sl = ask - StopPoints * point;
      double tp = ask + TakePoints * point;
      trade.Buy(lots, _Symbol, ask, sl, tp, "Edu MA Lab BUY");
     }
   else if(crossDown)
     {
      double sl = bid + StopPoints * point;
      double tp = bid - TakePoints * point;
      trade.Sell(lots, _Symbol, bid, sl, tp, "Edu MA Lab SELL");
     }
  }
`,
  },
  {
    id: "edu-rsi-structure",
    slug: "rsi-structure-indicator",
    title: "RSI Structure Marker",
    kind: "INDICATOR",
    level: "Intermediate",
    summary:
      "Custom indicator that plots RSI with overbought/oversold zones and marks swing pivots — useful for discretionary analysis and EA signal research.",
    learningGoals: [
      "Create indicator buffers and plot styles",
      "Compute RSI via iRSI + CopyBuffer",
      "Mark simple pivot highs/lows for structure study",
    ],
    analysisNotes: [
      "Overlay on H1/H4 charts and journal confluence with price structure.",
      "Export values via Data Window when building your own signal rules.",
      "Avoid treating zone touches as standalone trade triggers.",
    ],
    filename: "Edu_RSI_Structure.mq5",
    language: "mql5",
    code: `//+------------------------------------------------------------------+
//| Edu_RSI_Structure.mq5                                            |
//| Educational RSI + swing markers for chart analysis               |
//+------------------------------------------------------------------+
#property copyright "TradeBib Education"
#property version   "1.00"
#property indicator_separate_window
#property indicator_buffers 3
#property indicator_plots   3

#property indicator_label1  "RSI"
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrDodgerBlue
#property indicator_width1  2

#property indicator_label2  "PivotHigh"
#property indicator_type2   DRAW_ARROW
#property indicator_color2  clrOrangeRed
#property indicator_width2  1

#property indicator_label3  "PivotLow"
#property indicator_type3   DRAW_ARROW
#property indicator_color3  clrLime
#property indicator_width3  1

input int RsiPeriod = 14;
input int PivotLeft = 2;
input int PivotRight = 2;
input double Overbought = 70.0;
input double Oversold = 30.0;

double rsiBuffer[];
double pivotHigh[];
double pivotLow[];
int rsiHandle = INVALID_HANDLE;

int OnInit()
  {
   SetIndexBuffer(0, rsiBuffer, INDICATOR_DATA);
   SetIndexBuffer(1, pivotHigh, INDICATOR_DATA);
   SetIndexBuffer(2, pivotLow, INDICATOR_DATA);
   PlotIndexSetInteger(1, PLOT_ARROW, 159);
   PlotIndexSetInteger(2, PLOT_ARROW, 159);
   ArraySetAsSeries(rsiBuffer, true);
   ArraySetAsSeries(pivotHigh, true);
   ArraySetAsSeries(pivotLow, true);

   IndicatorSetString(INDICATOR_SHORTNAME, "Edu RSI Structure");
   IndicatorSetDouble(INDICATOR_LEVELVALUE, 0, Overbought);
   IndicatorSetDouble(INDICATOR_LEVELVALUE, 1, Oversold);
   IndicatorSetInteger(INDICATOR_LEVELS, 2);

   rsiHandle = iRSI(_Symbol, PERIOD_CURRENT, RsiPeriod, PRICE_CLOSE);
   if(rsiHandle == INVALID_HANDLE) return INIT_FAILED;
   return INIT_SUCCEEDED;
  }

void OnDeinit(const int reason)
  {
   if(rsiHandle != INVALID_HANDLE) IndicatorRelease(rsiHandle);
  }

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
  {
   if(rates_total < RsiPeriod + PivotLeft + PivotRight + 5) return 0;

   if(CopyBuffer(rsiHandle, 0, 0, rates_total, rsiBuffer) <= 0) return 0;

   int start = rates_total - prev_calculated + PivotRight + 2;
   if(start >= rates_total) start = rates_total - 1;
   if(prev_calculated == 0)
     {
      ArrayInitialize(pivotHigh, EMPTY_VALUE);
      ArrayInitialize(pivotLow, EMPTY_VALUE);
      start = rates_total - 1;
     }

   for(int i = start; i >= PivotRight; i--)
     {
      pivotHigh[i] = EMPTY_VALUE;
      pivotLow[i] = EMPTY_VALUE;

      bool isHigh = true;
      bool isLow = true;
      for(int k = 1; k <= PivotLeft; k++)
        {
         if(rsiBuffer[i] <= rsiBuffer[i + k]) isHigh = false;
         if(rsiBuffer[i] >= rsiBuffer[i + k]) isLow = false;
        }
      for(int k = 1; k <= PivotRight; k++)
        {
         if(rsiBuffer[i] <= rsiBuffer[i - k]) isHigh = false;
         if(rsiBuffer[i] >= rsiBuffer[i - k]) isLow = false;
        }

      if(isHigh) pivotHigh[i] = rsiBuffer[i];
      if(isLow)  pivotLow[i]  = rsiBuffer[i];
     }

   return rates_total;
  }
`,
  },
  {
    id: "edu-risk-sizer",
    slug: "position-risk-sizer",
    title: "Position Risk Sizer Script",
    kind: "SCRIPT",
    level: "Beginner",
    summary:
      "One-click script that prints suggested lot size from equity, stop distance, and risk percent — for pre-trade analysis on a chart.",
    learningGoals: [
      "Read account and symbol trade specifications",
      "Convert stop distance into monetary risk",
      "Normalize volume to broker min/step/max",
    ],
    analysisNotes: [
      "Run on several symbols to see how tick value changes sizing.",
      "Compare fixed-fractional risk vs fixed lot assumptions in your journal.",
    ],
    filename: "Edu_Position_Risk_Sizer.mq5",
    language: "mql5",
    code: `//+------------------------------------------------------------------+
//| Edu_Position_Risk_Sizer.mq5                                      |
//| Educational position sizing helper (script)                      |
//+------------------------------------------------------------------+
#property copyright "TradeBib Education"
#property version   "1.00"
#property script_show_inputs

input double RiskPercent = 1.0;   // Risk % of equity
input double StopPoints  = 250;   // Planned stop in points
input double EntryPrice  = 0;     // 0 = use Bid for estimate

void OnStart()
  {
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double entry = EntryPrice > 0 ? EntryPrice : bid;
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double volMin = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double volMax = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double volStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   double moneyRisk = equity * RiskPercent / 100.0;
   double stopMoneyPerLot = (StopPoints * point / tickSize) * tickValue;
   double rawLots = stopMoneyPerLot > 0 ? moneyRisk / stopMoneyPerLot : volMin;
   double lots = MathFloor(rawLots / volStep) * volStep;
   lots = MathMax(volMin, MathMin(volMax, lots));

   PrintFormat("=== Edu Risk Sizer | %s ===", _Symbol);
   PrintFormat("Equity=%.2f | Risk%%=%.2f | MoneyRisk=%.2f", equity, RiskPercent, moneyRisk);
   PrintFormat("Entry≈%.5f | StopPoints=%.0f | $/lot stop≈%.2f", entry, StopPoints, stopMoneyPerLot);
   PrintFormat("Suggested lots=%.2f (min=%.2f step=%.2f max=%.2f)", lots, volMin, volStep, volMax);
   Comment(StringFormat("Edu sizer: %.2f lots @ %.1f%% risk", lots, RiskPercent));
  }
`,
  },
  {
    id: "edu-history-analyzer",
    slug: "deal-history-analyzer",
    title: "Deal History Analyzer",
    kind: "ANALYZER",
    level: "Advanced",
    summary:
      "Script that scans account deal history, aggregates win rate, profit factor, average R, and prints a compact performance report for education and journaling.",
    learningGoals: [
      "Select history with HistorySelect",
      "Iterate deals vs orders correctly",
      "Derive PF, expectancy, and streak stats",
    ],
    analysisNotes: [
      "Filter by magic number when studying a single EA.",
      "Compare reports across demo vs live to spot execution gaps.",
      "Pair with the TradeBib journal for qualitative review.",
    ],
    filename: "Edu_Deal_History_Analyzer.mq5",
    language: "mql5",
    code: `//+------------------------------------------------------------------+
//| Edu_Deal_History_Analyzer.mq5                                    |
//| Educational closed-deal performance report                       |
//+------------------------------------------------------------------+
#property copyright "TradeBib Education"
#property version   "1.00"
#property script_show_inputs

input int    LookbackDays = 90;
input ulong  FilterMagic  = 0;      // 0 = all magics
input string FilterSymbol = "";     // empty = all symbols

void OnStart()
  {
   datetime to = TimeCurrent();
   datetime from = to - LookbackDays * 24 * 60 * 60;
   if(!HistorySelect(from, to))
     {
      Print("Edu Analyzer: HistorySelect failed");
      return;
     }

   int wins = 0, losses = 0, dealsOut = 0;
   double grossProfit = 0, grossLoss = 0, sumR = 0;
   int winStreak = 0, lossStreak = 0, maxWinStreak = 0, maxLossStreak = 0;

   int total = HistoryDealsTotal();
   for(int i = 0; i < total; i++)
     {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket == 0) continue;

      long entry = HistoryDealGetInteger(ticket, DEAL_ENTRY);
      if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_OUT_BY) continue;

      long magic = HistoryDealGetInteger(ticket, DEAL_MAGIC);
      if(FilterMagic != 0 && (ulong)magic != FilterMagic) continue;

      string sym = HistoryDealGetString(ticket, DEAL_SYMBOL);
      if(FilterSymbol != "" && sym != FilterSymbol) continue;

      double profit = HistoryDealGetDouble(ticket, DEAL_PROFIT)
                    + HistoryDealGetDouble(ticket, DEAL_SWAP)
                    + HistoryDealGetDouble(ticket, DEAL_COMMISSION);

      dealsOut++;
      if(profit > 0)
        {
         wins++;
         grossProfit += profit;
         winStreak++;
         lossStreak = 0;
         if(winStreak > maxWinStreak) maxWinStreak = winStreak;
        }
      else if(profit < 0)
        {
         losses++;
         grossLoss += -profit;
         lossStreak++;
         winStreak = 0;
         if(lossStreak > maxLossStreak) maxLossStreak = lossStreak;
        }

      // Rough R using stop distance is unavailable here; use +/-1 unit proxy
      sumR += (profit > 0 ? 1.0 : (profit < 0 ? -1.0 : 0.0));
     }

   double winRate = dealsOut > 0 ? 100.0 * wins / dealsOut : 0.0;
   double pf = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999.0 : 0.0);
   double expectancy = dealsOut > 0 ? (grossProfit - grossLoss) / dealsOut : 0.0;
   double avgSignedR = dealsOut > 0 ? sumR / dealsOut : 0.0;

   Print("======== Edu Deal History Analyzer ========");
   PrintFormat("Window: last %d days | deals(out)=%d", LookbackDays, dealsOut);
   PrintFormat("Wins=%d Losses=%d WinRate=%.1f%%", wins, losses, winRate);
   PrintFormat("GrossProfit=%.2f GrossLoss=%.2f ProfitFactor=%.2f", grossProfit, grossLoss, pf);
   PrintFormat("Expectancy/trade=%.2f | Avg signed R proxy=%.2f", expectancy, avgSignedR);
   PrintFormat("Max win streak=%d | Max loss streak=%d", maxWinStreak, maxLossStreak);
   Print("Educational metrics only — validate before live decisions.");
  }
`,
  },
  {
    id: "edu-mtf-bias",
    slug: "mtf-trend-bias",
    title: "Multi-Timeframe Trend Bias",
    kind: "INDICATOR",
    level: "Intermediate",
    summary:
      "Chart comment / buffer helper that scores higher-timeframe EMA alignment (D1/H4/H1) to support top-down analysis before studying lower-timeframe setups.",
    learningGoals: [
      "Request multi-timeframe indicator handles",
      "Aggregate a simple bias score",
      "Surface analysis context via Comment()",
    ],
    analysisNotes: [
      "Use as a filter study: how often LTF signals align with HTF bias?",
      "Log bias changes alongside your TradeBib journal entries.",
    ],
    filename: "Edu_MTF_Trend_Bias.mq5",
    language: "mql5",
    code: `//+------------------------------------------------------------------+
//| Edu_MTF_Trend_Bias.mq5                                           |
//| Educational multi-timeframe EMA bias overlay                     |
//+------------------------------------------------------------------+
#property copyright "TradeBib Education"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 1
#property indicator_plots   1
#property indicator_label1  "BiasScore"
#property indicator_type1   DRAW_NONE

input int EmaPeriod = 50;

double biasBuffer[];
int hD1 = INVALID_HANDLE, hH4 = INVALID_HANDLE, hH1 = INVALID_HANDLE;

int MakeEma(ENUM_TIMEFRAMES tf)
  {
   return iMA(_Symbol, tf, EmaPeriod, 0, MODE_EMA, PRICE_CLOSE);
  }

int OnInit()
  {
   SetIndexBuffer(0, biasBuffer, INDICATOR_DATA);
   ArraySetAsSeries(biasBuffer, true);
   hD1 = MakeEma(PERIOD_D1);
   hH4 = MakeEma(PERIOD_H4);
   hH1 = MakeEma(PERIOD_H1);
   if(hD1 == INVALID_HANDLE || hH4 == INVALID_HANDLE || hH1 == INVALID_HANDLE)
      return INIT_FAILED;
   IndicatorSetString(INDICATOR_SHORTNAME, "Edu MTF Bias");
   return INIT_SUCCEEDED;
  }

void OnDeinit(const int reason)
  {
   if(hD1 != INVALID_HANDLE) IndicatorRelease(hD1);
   if(hH4 != INVALID_HANDLE) IndicatorRelease(hH4);
   if(hH1 != INVALID_HANDLE) IndicatorRelease(hH1);
   Comment("");
  }

int TfBias(const int handle, ENUM_TIMEFRAMES tf)
  {
   double ema[];
   ArraySetAsSeries(ema, true);
   if(CopyBuffer(handle, 0, 0, 2, ema) < 2) return 0;
   double close = iClose(_Symbol, tf, 1);
   if(close > ema[1]) return 1;
   if(close < ema[1]) return -1;
   return 0;
  }

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
  {
   int d1 = TfBias(hD1, PERIOD_D1);
   int h4 = TfBias(hH4, PERIOD_H4);
   int h1 = TfBias(hH1, PERIOD_H1);
   int score = d1 + h4 + h1; // -3 .. +3

   for(int i = 0; i < rates_total; i++)
      biasBuffer[i] = score;

   string label = score >= 2 ? "BULLISH" : (score <= -2 ? "BEARISH" : "MIXED");
   Comment(StringFormat("Edu MTF Bias: %s (D1=%+d H4=%+d H1=%+d score=%+d)",
                        label, d1, h4, h1, score));
   return rates_total;
  }
`,
  },
];

export function getMt5SampleBySlug(slug: string): Mt5CodeSample | undefined {
  return mt5CodeSamples.find((s) => s.slug === slug);
}

export function filterMt5Samples(kind: "ALL" | Mt5SampleKind): Mt5CodeSample[] {
  if (kind === "ALL") return mt5CodeSamples;
  return mt5CodeSamples.filter((s) => s.kind === kind);
}
