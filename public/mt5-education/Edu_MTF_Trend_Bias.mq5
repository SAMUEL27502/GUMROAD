//+------------------------------------------------------------------+
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
