"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

export const chartTooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1e293b",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
  padding: "10px 12px",
};

type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

interface InteractiveTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadItem[];
  valueFormatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string) => string;
}

/** Shared interactive Recharts tooltip with colored series rows. */
export function InteractiveTooltip({
  active,
  label,
  payload,
  valueFormatter,
  labelFormatter,
}: InteractiveTooltipProps) {
  if (!active || !payload?.length) return null;
  const title =
    labelFormatter?.(String(label ?? "")) ?? (label != null ? String(label) : undefined);

  return (
    <div
      className="min-w-[140px] rounded-xl border border-border/80 bg-gray-900/95 px-3 py-2 shadow-xl backdrop-blur"
      style={chartTooltipStyle}
    >
      {title ? <p className="mb-1.5 text-xs font-semibold text-slate-200">{title}</p> : null}
      <div className="space-y-1">
        {payload.map((entry, i) => {
          const name = String(entry.name ?? entry.dataKey ?? "Value");
          const raw = Number(entry.value ?? 0);
          const display = valueFormatter
            ? valueFormatter(raw, name)
            : typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : String(entry.value ?? "");
          return (
            <div key={`${name}-${i}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color ?? "#0EA5E9" }}
                />
                {name}
              </span>
              <span className="font-semibold text-slate-100">{display}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
}

export function ChartContainer({ children, className, height = 280 }: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export function AreaPerformanceChart({
  data,
  dataKey = "value",
  xKey = "month",
  color = "#0EA5E9",
  valueFormatter,
  name = "Value",
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  name?: string;
  valueFormatter?: (value: number, name: string) => string;
}) {
  const gradientId = `tbArea-${dataKey}`;
  return (
    <ChartContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.35 }}
          content={
            <InteractiveTooltip
              valueFormatter={valueFormatter ?? ((v) => formatCurrency(v))}
            />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#0f172a" }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function LinePerformanceChart({
  data,
  dataKey = "equity",
  xKey = "date",
  color = "#0EA5E9",
  name = "Value",
  valueFormatter,
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  name?: string;
  valueFormatter?: (value: number, name: string) => string;
}) {
  return (
    <ChartContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.35 }}
          content={
            <InteractiveTooltip
              valueFormatter={
                valueFormatter ?? ((v) => (name.toLowerCase().includes("roi") ? formatPercent(v) : formatCurrency(v)))
              }
            />
          }
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3, fill: color }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function BarPerformanceChart({
  data,
  dataKey = "return",
  xKey = "month",
  name = "Return",
  valueFormatter,
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  name?: string;
  valueFormatter?: (value: number, name: string) => string;
}) {
  return (
    <ChartContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(14,165,233,0.08)" }}
          content={
            <InteractiveTooltip
              valueFormatter={valueFormatter ?? ((v) => formatCurrency(v))}
            />
          }
        />
        <Bar dataKey={dataKey} name={name} radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Number(entry[dataKey]) >= 0 ? "#0EA5E9" : "#EF4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function BalanceChart({
  data,
}: {
  data: { month: string; balance: number; equity: number }[];
}) {
  return (
    <ChartContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={{ stroke: "#94a3b8", strokeOpacity: 0.35 }}
          content={<InteractiveTooltip valueFormatter={(v) => formatCurrency(v)} />}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke="#0EA5E9"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="equity"
          name="Equity"
          stroke="#22C55E"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function DrawdownChart({
  data,
}: {
  data: { month: string; drawdown: number }[];
}) {
  return (
    <ChartContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tbDrawdown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
          reversed
        />
        <Tooltip
          cursor={{ stroke: "#EF4444", strokeOpacity: 0.35 }}
          content={
            <InteractiveTooltip valueFormatter={(v) => `${v.toFixed(1)}%`} />
          }
        />
        <Area
          type="monotone"
          dataKey="drawdown"
          name="Drawdown"
          stroke="#EF4444"
          strokeWidth={2.5}
          fill="url(#tbDrawdown)"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ChartContainer height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={
            <InteractiveTooltip valueFormatter={(v, name) => `${name}: ${v}%`} />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}
