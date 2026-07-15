"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1e293b",
  borderRadius: 12,
  fontSize: 12,
};

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
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  color?: string;
}) {
  return (
    <ChartContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tbArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          fill="url(#tbArea)"
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
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
  color?: string;
}) {
  return (
    <ChartContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}

export function BarPerformanceChart({
  data,
  dataKey = "return",
  xKey = "month",
}: {
  data: Record<string, string | number>[];
  dataKey?: string;
  xKey?: string;
}) {
  return (
    <ChartContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
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
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ChartContainer>
  );
}
