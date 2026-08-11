//+------------------------------------------------------------------+
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
