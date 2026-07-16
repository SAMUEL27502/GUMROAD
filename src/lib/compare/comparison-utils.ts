import type { Bot } from "@/lib/data/bots";

export const COMPARE_COLORS = ["#0EA5E9", "#22C55E", "#F59E0B", "#A855F7"] as const;

export const MAX_COMPARE_BOTS = 4;
export const MIN_COMPARE_BOTS = 2;

export function botSeriesKey(bot: Bot, index: number): string {
  return `bot_${bot.id}_${index}`;
}

export function buildEquitySeries(selected: Bot[]) {
  const dates = selected[0]?.equityCurve.map((p) => p.date) ?? [];
  return dates.map((date, i) => {
    const row: Record<string, string | number> = { date };
    selected.forEach((bot, idx) => {
      row[botSeriesKey(bot, idx)] = bot.equityCurve[i]?.equity ?? bot.equityCurve.at(-1)?.equity ?? 0;
    });
    return row;
  });
}

export function buildRoiSeries(selected: Bot[]) {
  const dates = selected[0]?.equityCurve.map((p) => p.date) ?? [];
  return dates.map((date, i) => {
    const row: Record<string, string | number> = { date };
    selected.forEach((bot, idx) => {
      const base = bot.equityCurve[0]?.equity ?? 1;
      const equity = bot.equityCurve[i]?.equity ?? base;
      row[botSeriesKey(bot, idx)] = Number((((equity - base) / base) * 100).toFixed(2));
    });
    return row;
  });
}

export function buildDrawdownSeries(selected: Bot[]) {
  const dates = selected[0]?.drawdownSeries.map((p) => p.date) ?? [];
  return dates.map((date, i) => {
    const row: Record<string, string | number> = { date };
    selected.forEach((bot, idx) => {
      row[botSeriesKey(bot, idx)] =
        bot.drawdownSeries[i]?.drawdown ?? bot.drawdownSeries.at(-1)?.drawdown ?? 0;
    });
    return row;
  });
}

export function buildMonthlySeries(selected: Bot[]) {
  const months = selected[0]?.monthlyReturns.map((p) => p.month) ?? [];
  return months.map((month, i) => {
    const row: Record<string, string | number> = { month };
    selected.forEach((bot, idx) => {
      row[botSeriesKey(bot, idx)] = bot.monthlyReturns[i]?.return ?? 0;
    });
    return row;
  });
}

export function buildSnapshotSeries(selected: Bot[]) {
  return [
    {
      metric: "ROI",
      ...Object.fromEntries(
        selected.map((bot, idx) => [botSeriesKey(bot, idx), bot.roi])
      ),
    },
    {
      metric: "Win Rate",
      ...Object.fromEntries(
        selected.map((bot, idx) => [botSeriesKey(bot, idx), bot.winRate])
      ),
    },
    {
      metric: "Drawdown",
      ...Object.fromEntries(
        selected.map((bot, idx) => [botSeriesKey(bot, idx), bot.drawdown])
      ),
    },
    {
      metric: "Profit Factor",
      ...Object.fromEntries(
        selected.map((bot, idx) => [botSeriesKey(bot, idx), bot.profitFactor * 10])
      ),
    },
  ];
}

export type MetricDirection = "higher" | "lower";

export function bestIndex(values: number[], direction: MetricDirection): number {
  if (!values.length) return -1;
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (direction === "higher" ? values[i] > values[best] : values[i] < values[best]) {
      best = i;
    }
  }
  return best;
}

export function annualPrice(monthly: number) {
  return monthly * 12;
}

export function pricePerRoiPoint(bot: Bot) {
  if (bot.roi <= 0) return Number.POSITIVE_INFINITY;
  return bot.price / bot.roi;
}

export function parseCompareSlugs(param: string | null, fallback: string[]): string[] {
  if (!param) return fallback;
  const slugs = param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const unique = [...new Set(slugs)].slice(0, MAX_COMPARE_BOTS);
  return unique.length >= MIN_COMPARE_BOTS ? unique : fallback;
}

/** Build a shareable compare deep link from bot slugs. */
export function buildComparePath(slugs: string[]): string {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].slice(
    0,
    MAX_COMPARE_BOTS
  );
  if (unique.length < MIN_COMPARE_BOTS) return "/compare";
  return `/compare?bots=${unique.join(",")}`;
}

/**
 * Pair a bot with the first other catalog slug for marketplace "Compare" links.
 */
export function compareWithDefault(
  primarySlug: string,
  catalog: Array<{ slug: string }>
): string {
  const other = catalog.find((b) => b.slug !== primarySlug)?.slug;
  if (!other) return "/compare";
  return buildComparePath([primarySlug, other]);
}

/**
 * Normalize a metric to 0–100 bar width.
 * Higher-is-better: value / max. Lower-is-better: inverted vs max (lower → longer bar).
 */
export function normalizeBarPercent(
  value: number,
  values: number[],
  direction: MetricDirection
): number {
  if (!values.length) return 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max === min) return 100;
  if (direction === "higher") {
    return Math.max(4, Math.round((value / max) * 100));
  }
  // Lower is better: longest bar for the smallest value
  const inverted = max - value;
  const span = max - min;
  return Math.max(4, Math.round((inverted / span) * 100));
}
