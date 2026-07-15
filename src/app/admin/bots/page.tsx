"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { bots as initialBots } from "@/lib/data/bots";
import type { Bot } from "@/lib/data/bots";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, formatPercent } from "@/lib/utils";

type ManagedBot = Bot & { approved: boolean };

export default function AdminBotsPage() {
  const [managedBots, setManagedBots] = useState<ManagedBot[]>(
    initialBots.map((b) => ({ ...b, approved: b.featured }))
  );

  const toggleVerified = (id: string) => {
    setManagedBots((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const verified = !b.verified;
        toast.success(`${b.name} ${verified ? "verified" : "unverified"}`);
        return { ...b, verified };
      })
    );
  };

  const toggleApproved = (id: string) => {
    setManagedBots((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const approved = !b.approved;
        toast.success(`${b.name} ${approved ? "approved" : "unapproved"}`);
        return { ...b, approved };
      })
    );
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Bots</h1>
        <p className="text-muted-foreground mt-1">
          Approve listings and toggle verification status.
        </p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>Bot Management</CardTitle>
          <CardDescription>{managedBots.length} bots in marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left">
                  <th className="pr-4 pb-3 font-medium">Bot</th>
                  <th className="pr-4 pb-3 font-medium">Strategy</th>
                  <th className="pr-4 pb-3 font-medium">ROI</th>
                  <th className="pr-4 pb-3 font-medium">Price</th>
                  <th className="pr-4 pb-3 font-medium">Risk</th>
                  <th className="pr-4 pb-3 text-center font-medium">Verified</th>
                  <th className="pb-3 text-center font-medium">Approved</th>
                </tr>
              </thead>
              <tbody>
                {managedBots.map((bot, i) => (
                  <motion.tr
                    key={bot.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-border/40 border-b last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium">{bot.name}</p>
                      <p className="text-muted-foreground text-xs">{bot.tradingPair}</p>
                    </td>
                    <td className="text-muted-foreground py-4 pr-4">{bot.strategy}</td>
                    <td className="py-4 pr-4 font-medium text-emerald-400">
                      {formatPercent(bot.roi)}
                    </td>
                    <td className="py-4 pr-4">{formatCurrency(bot.price)}/mo</td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant={
                          bot.riskLevel === "LOW"
                            ? "low"
                            : bot.riskLevel === "MEDIUM"
                              ? "medium"
                              : "high"
                        }
                      >
                        {bot.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <Switch
                        checked={bot.verified}
                        onCheckedChange={() => toggleVerified(bot.id)}
                        aria-label={`Toggle verified for ${bot.name}`}
                      />
                    </td>
                    <td className="py-4 text-center">
                      <Switch
                        checked={bot.approved}
                        onCheckedChange={() => toggleApproved(bot.id)}
                        aria-label={`Toggle approved for ${bot.name}`}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
