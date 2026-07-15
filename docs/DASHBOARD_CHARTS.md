# Dashboard Charts

Component: `src/components/dashboard/dashboard-charts.tsx`  
Primitives: `src/components/ui/charts.tsx` (Recharts)  
Data: `src/lib/data/platform.ts`

## Charts

| Chart           | Type        | Status                                      |
| --------------- | ----------- | ------------------------------------------- |
| Portfolio       | Area        | ✅ `portfolioPerformance`                   |
| Monthly Profit  | Bar         | ✅ `monthlyProfitSeries`                    |
| ROI             | Line        | ✅ `roiSeries`                              |
| Risk            | Donut       | ✅ `riskDistribution` + metrics panel       |
| Balance         | Dual line   | ✅ `balanceSeries` (balance vs equity)      |
| Drawdown        | Area        | ✅ `drawdownSeries`                         |
| Interactive tip | Custom      | ✅ `InteractiveTooltip` on all series       |

Embedded on `/dashboard` via tabbed Performance Charts card. Hover any point/bar/slice for series name + formatted value.
