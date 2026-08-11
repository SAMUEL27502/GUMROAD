//+------------------------------------------------------------------+
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
