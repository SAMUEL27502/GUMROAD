//+------------------------------------------------------------------+
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
