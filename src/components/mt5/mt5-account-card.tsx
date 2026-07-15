"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Link2,
  RefreshCw,
  Server,
  Trash2,
  Unplug,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Mt5Account } from "@/stores/mt5-accounts-store";
import { cn, formatCurrency } from "@/lib/utils";

export interface Mt5AccountCardProps {
  account: Mt5Account;
  onSync?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onReconnect?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

/** Floating P/L = equity − balance */
export function getAccountProfit(account: Pick<Mt5Account, "equity" | "balance">) {
  return Number((account.equity - account.balance).toFixed(2));
}

export function Mt5AccountCard({
  account,
  onSync,
  onDisconnect,
  onReconnect,
  onRemove,
  className,
}: Mt5AccountCardProps) {
  const profit = getAccountProfit(account);
  const orders = account.recentOrders ?? [];
  const openTrades = account.openTrades ?? orders.filter((o) => o.status === "OPEN").length;

  return (
    <Card className={cn("border-border/70 bg-card/80", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{account.nickname}</p>
            <p className="mt-0.5 text-sm font-medium text-sky-300">{account.broker}</p>
            <p className="text-xs text-muted-foreground">
              {account.brokerServer} · #{account.accountNumber}
            </p>
          </div>
          <Badge
            variant={
              !account.connected
                ? "danger"
                : account.accountType === "DEMO"
                  ? "warning"
                  : "success"
            }
          >
            {account.connected && <CheckCircle2 className="mr-1 h-3 w-3" />}
            {account.connected ? account.accountType : "OFFLINE"}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Balance" value={formatCurrency(account.balance)} />
          <Metric
            label="Equity"
            value={formatCurrency(account.equity)}
            className="text-emerald-400"
          />
          <Metric label="Margin" value={formatCurrency(account.freeMargin)} />
          <Metric
            label="Profit"
            value={`${profit >= 0 ? "+" : ""}${formatCurrency(profit)}`}
            className={profit >= 0 ? "text-emerald-400" : "text-red-400"}
          />
          <Metric label="Open Trades" value={String(openTrades)} />
          <Metric label="Margin Level" value={`${account.marginLevel}%`} />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Recent Orders
            </p>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Server className="h-3 w-3" />
              {account.leverage}
            </span>
          </div>
          {orders.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
              No recent orders
            </p>
          ) : (
            <ul className="space-y-1.5">
              {orders.slice(0, 4).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-muted/25 px-2.5 py-2 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 font-semibold",
                        order.type === "BUY" ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {order.type === "BUY" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {order.type}
                    </span>
                    <span className="font-medium">{order.symbol}</span>
                    <span className="text-muted-foreground">{order.volume}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        order.profit >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {order.profit >= 0 ? "+" : ""}
                      {formatCurrency(order.profit)}
                    </span>
                    <Badge
                      variant={order.status === "OPEN" ? "warning" : "outline"}
                      className="text-[9px]"
                    >
                      {order.status}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {onSync && (
            <Button size="sm" variant="outline" onClick={() => onSync(account.id)}>
              <RefreshCw className="h-3.5 w-3.5" />
              Sync
            </Button>
          )}
          {account.connected
            ? onDisconnect && (
                <Button size="sm" variant="outline" onClick={() => onDisconnect(account.id)}>
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect
                </Button>
              )
            : onReconnect && (
                <Button size="sm" variant="outline" onClick={() => onReconnect(account.id)}>
                  <Link2 className="h-3.5 w-3.5" />
                  Reconnect
                </Button>
              )}
          {onRemove && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400"
              onClick={() => onRemove(account.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/30 p-3">
      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className={cn("mt-0.5 text-sm font-bold sm:text-base", className)}>{value}</p>
    </div>
  );
}
