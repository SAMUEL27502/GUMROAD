"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Link2,
  Server,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Mt5AccountCard } from "@/components/mt5/mt5-account-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mt5Brokers, mt5Steps, recentTrades } from "@/lib/data/platform";
import { mt5ConnectSchema, type Mt5ConnectInput } from "@/lib/validations";
import { cn, formatCurrency } from "@/lib/utils";
import { useMt5AccountsStore } from "@/store/mt5-accounts-store";

export default function MT5Page() {
  const { accounts, add, sync, disconnect, reconnect, remove } = useMt5AccountsStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Mt5ConnectInput>({
    resolver: zodResolver(mt5ConnectSchema),
    defaultValues: {
      broker: "",
      server: "",
      login: "",
      investorPassword: "",
      nickname: "",
    },
  });

  const selectedBroker = watch("broker");
  const brokerServers = useMemo(
    () => mt5Brokers.find((b) => b.name === selectedBroker)?.servers ?? [],
    [selectedBroker]
  );

  function onSubmit(data: Mt5ConnectInput) {
    const balance = 10000 + Math.floor(Math.random() * 5000);
    const equity = Number((balance * (1 + (Math.random() * 0.02 - 0.005))).toFixed(2));
    const usedMargin = Number((equity * 0.12).toFixed(2));
    add({
      id: `acc-${Date.now()}`,
      nickname: data.nickname,
      broker: data.broker,
      brokerServer: data.server,
      accountNumber: data.login,
      accountType: data.server.toLowerCase().includes("demo") ? "DEMO" : "INVESTOR",
      balance,
      equity,
      freeMargin: Number((equity - usedMargin).toFixed(2)),
      marginLevel: Number(((equity / usedMargin) * 100).toFixed(1)),
      leverage: "1:500",
      connected: true,
      lastSyncAt: new Date().toISOString(),
      openTrades: 0,
      recentOrders: [],
    });
    toast.success(`Connected ${data.nickname} successfully`);
    reset();
  }

  const totals = useMemo(() => {
    const connected = accounts.filter((a) => a.connected);
    return {
      balance: connected.reduce((s, a) => s + a.balance, 0),
      equity: connected.reduce((s, a) => s + a.equity, 0),
      freeMargin: connected.reduce((s, a) => s + a.freeMargin, 0),
      count: connected.length,
    };
  }, [accounts]);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3">
                MetaTrader 5
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                Connect Your <span className="gradient-text">MT5 Account</span>
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Link your broker with investor (read-only) access to sync balance, equity, margin, and
                deploy bots securely.
              </p>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/mt5/mobile">
                <Smartphone className="h-4 w-4" />
                Mobile Terminal
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Portfolio summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Connected", value: String(totals.count), icon: Link2 },
            { label: "Balance", value: formatCurrency(totals.balance), icon: Wallet },
            {
              label: "Equity",
              value: formatCurrency(totals.equity),
              icon: TrendingUp,
              accent: "text-emerald-400",
            },
            { label: "Free Margin", value: formatCurrency(totals.freeMargin), icon: Server },
          ].map((m) => (
            <Card key={m.label} className="border-border/70 bg-card/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
                  <m.icon className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">{m.label}</p>
                  <p className={cn("text-lg font-bold", m.accent)}>{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Connect form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-sky-400" />
                  New Connection
                </CardTitle>
                <CardDescription>
                  Broker · Server · Login · Investor Password · Nickname
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="broker">Broker</Label>
                    <Controller
                      name="broker"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v);
                            setValue("server", "");
                          }}
                        >
                          <SelectTrigger id="broker" aria-invalid={!!errors.broker}>
                            <SelectValue placeholder="Select broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {mt5Brokers.map((b) => (
                              <SelectItem key={b.name} value={b.name}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.broker && (
                      <p className="text-xs text-red-400">{errors.broker.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="server">Server</Label>
                    {brokerServers.length > 0 ? (
                      <Controller
                        name="server"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="server" aria-invalid={!!errors.server}>
                              <SelectValue placeholder="Select server" />
                            </SelectTrigger>
                            <SelectContent>
                              {brokerServers.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      <Input
                        id="server"
                        placeholder="e.g. MyBroker-Live01"
                        {...register("server")}
                      />
                    )}
                    {errors.server && (
                      <p className="text-xs text-red-400">{errors.server.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login">Login</Label>
                    <Input
                      id="login"
                      inputMode="numeric"
                      placeholder="8742931"
                      autoComplete="username"
                      {...register("login")}
                    />
                    {errors.login && <p className="text-xs text-red-400">{errors.login.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investorPassword">Investor Password</Label>
                    <Input
                      id="investorPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...register("investorPassword")}
                    />
                    {errors.investorPassword && (
                      <p className="text-xs text-red-400">{errors.investorPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="My Live Account"
                      {...register("nickname")}
                    />
                    {errors.nickname && (
                      <p className="text-xs text-red-400">{errors.nickname.message}</p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-sky-500/10 p-3 text-xs text-sky-300">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                    We only use investor (read-only) passwords. Your master trading password is
                    never stored.
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Connect Account
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Connection steps */}
            <Card className="mt-6 border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">Connection steps</CardTitle>
                <CardDescription>How TradeBib links your MT5 terminal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mt5Steps.map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-400">
                      {step.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection cards & trades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6 lg:col-span-3"
          >
            <div>
              <h2 className="mb-4 text-lg font-bold">Connection cards</h2>
              {accounts.length === 0 ? (
                <EmptyState
                  title="No accounts connected"
                  description="Use the form to link your first MT5 investor account."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {accounts.map((acc) => (
                    <Mt5AccountCard
                      key={acc.id}
                      account={acc}
                      onSync={(id) => {
                        sync(id);
                        toast.success(`Synced ${acc.nickname}`);
                      }}
                      onDisconnect={(id) => {
                        disconnect(id);
                        toast.message(`Disconnected ${acc.nickname}`);
                      }}
                      onReconnect={(id) => {
                        reconnect(id);
                        toast.success(`Reconnected ${acc.nickname}`);
                      }}
                      onRemove={(id) => {
                        remove(id);
                        toast.message(`Removed ${acc.nickname}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent trades */}
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-sky-400" />
                    Recent Trades
                  </CardTitle>
                  <CardDescription>Synced from connected MT5 accounts</CardDescription>
                </div>
                <Badge variant="outline">{recentTrades.length} trades</Badge>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Bot</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium",
                              trade.type === "BUY" ? "text-emerald-400" : "text-red-400"
                            )}
                          >
                            {trade.type === "BUY" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {trade.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{trade.volume}</TableCell>
                        <TableCell
                          className={cn(
                            "font-semibold",
                            trade.profit >= 0 ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {trade.profit >= 0 ? "+" : ""}
                          {formatCurrency(trade.profit)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{trade.bot}</TableCell>
                        <TableCell>
                          <Badge
                            variant={trade.status === "OPEN" ? "secondary" : "outline"}
                            className="text-[10px]"
                          >
                            {trade.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
