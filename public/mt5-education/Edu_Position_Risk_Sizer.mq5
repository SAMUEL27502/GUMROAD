//+------------------------------------------------------------------+
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
