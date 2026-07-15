"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Link2,
  Server,
  Shield,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectedAccounts, mt5Steps, recentTrades } from "@/lib/data/platform";
import { cn, formatCurrency } from "@/lib/utils";

const connectSchema = z.object({
  brokerServer: z.string().min(3, "Broker server is required"),
  accountNumber: z.string().min(4, "Account number is required"),
  investorPassword: z.string().min(4, "Investor password is required"),
  nickname: z.string().min(2, "Nickname is required"),
});

type ConnectForm = z.infer<typeof connectSchema>;

export default function MT5Page() {
  const [accounts, setAccounts] = useState(connectedAccounts);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConnectForm>({
    resolver: zodResolver(connectSchema),
    defaultValues: {
      brokerServer: "",
      accountNumber: "",
      investorPassword: "",
      nickname: "",
    },
  });

  function onSubmit(data: ConnectForm) {
    const newAccount = {
      id: `acc-${Date.now()}`,
      nickname: data.nickname,
      broker: data.brokerServer.split("-")[0] || "Broker",
      brokerServer: data.brokerServer,
      accountNumber: data.accountNumber,
      accountType: "INVESTOR" as const,
      balance: 10000,
      equity: 10000,
      freeMargin: 9800,
      marginLevel: 500,
      leverage: "1:500",
      connected: true,
    };
    setAccounts((prev) => [...prev, newAccount]);
    toast.success(`Connected ${data.nickname} successfully`);
    reset();
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Badge variant="secondary" className="mb-3">
            MetaTrader 5
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Connect Your <span className="gradient-text">MT5 Account</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Link your broker account with investor (read-only) access to sync balance, equity, and
            deploy bots securely.
          </p>
        </motion.div>

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
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brokerServer">Broker Server</Label>
                    <Input
                      id="brokerServer"
                      placeholder="e.g. ICMarkets-Live03"
                      {...register("brokerServer")}
                    />
                    {errors.brokerServer && (
                      <p className="text-xs text-red-400">{errors.brokerServer.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="8742931"
                      {...register("accountNumber")}
                    />
                    {errors.accountNumber && (
                      <p className="text-xs text-red-400">{errors.accountNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investorPassword">Investor Password</Label>
                    <Input
                      id="investorPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("investorPassword")}
                    />
                    {errors.investorPassword && (
                      <p className="text-xs text-red-400">{errors.investorPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Account Nickname</Label>
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
                    We only use investor (read-only) passwords. Your trading password is never
                    stored.
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Connect Account
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="mt-6 border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
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

          {/* Connected accounts & trades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 space-y-6"
          >
            <div>
              <h2 className="mb-4 text-lg font-bold">Connected Accounts</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {accounts.map((acc) => (
                  <Card key={acc.id} className="border-border/70 bg-card/80">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{acc.nickname}</p>
                          <p className="text-xs text-muted-foreground">
                            {acc.brokerServer} · #{acc.accountNumber}
                          </p>
                        </div>
                        <Badge variant={acc.accountType === "DEMO" ? "warning" : "success"}>
                          {acc.connected && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {acc.accountType}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-muted/30 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Balance
                          </p>
                          <p className="text-lg font-bold">{formatCurrency(acc.balance)}</p>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Equity
                          </p>
                          <p className="text-lg font-bold text-emerald-400">
                            {formatCurrency(acc.equity)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Free Margin
                          </p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(acc.freeMargin)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-3">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Margin Level
                          </p>
                          <p className="text-sm font-semibold">{acc.marginLevel}%</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Server className="h-3.5 w-3.5" />
                        {acc.leverage} leverage
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent trades */}
            <Card className="border-border/70 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-sky-400" />
                  Recent Trades
                </CardTitle>
                <Badge variant="outline">{recentTrades.length} trades</Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="pb-3 pr-4">Symbol</th>
                        <th className="pb-3 pr-4">Type</th>
                        <th className="pb-3 pr-4">Volume</th>
                        <th className="pb-3 pr-4">Profit</th>
                        <th className="pb-3 pr-4">Bot</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-border/30">
                          <td className="py-3 pr-4 font-semibold">{trade.symbol}</td>
                          <td className="py-3 pr-4">
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
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">{trade.volume}</td>
                          <td
                            className={cn(
                              "py-3 pr-4 font-semibold",
                              trade.profit >= 0 ? "text-emerald-400" : "text-red-400"
                            )}
                          >
                            {trade.profit >= 0 ? "+" : ""}
                            {formatCurrency(trade.profit)}
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{trade.bot}</td>
                          <td className="py-3">
                            <Badge
                              variant={trade.status === "OPEN" ? "secondary" : "outline"}
                              className="text-[10px]"
                            >
                              {trade.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
