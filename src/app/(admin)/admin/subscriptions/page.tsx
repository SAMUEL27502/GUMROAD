"use client";

import { motion } from "framer-motion";
import { adminSubscriptions } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const statusVariant = {
  ACTIVE: "success" as const,
  PAST_DUE: "danger" as const,
  CANCELLED: "warning" as const,
};

export default function AdminSubscriptionsPage() {
  const totalMrr = adminSubscriptions
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Active plans, renewals, and billing status.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active MRR", value: formatCurrency(totalMrr) },
          { label: "Total Subscriptions", value: adminSubscriptions.length.toString() },
          {
            label: "Past Due",
            value: adminSubscriptions.filter((s) => s.status === "PAST_DUE").length.toString(),
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass border-border/60">
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>Billing and renewal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left">
                  <th className="pr-4 pb-3 font-medium">User</th>
                  <th className="pr-4 pb-3 font-medium">Plan</th>
                  <th className="pr-4 pb-3 font-medium">Amount</th>
                  <th className="pr-4 pb-3 font-medium">Bots</th>
                  <th className="pr-4 pb-3 font-medium">Renews</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminSubscriptions.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-border/40 border-b last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium">{sub.user}</p>
                      <p className="text-muted-foreground text-xs">{sub.email}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant="secondary">{sub.plan}</Badge>
                    </td>
                    <td className="py-4 pr-4 font-medium">
                      {sub.amount === 0 ? "Free" : `${formatCurrency(sub.amount)}/mo`}
                    </td>
                    <td className="text-muted-foreground py-4 pr-4">{sub.bots}</td>
                    <td className="text-muted-foreground py-4 pr-4">{sub.renews}</td>
                    <td className="py-4">
                      <Badge variant={statusVariant[sub.status as keyof typeof statusVariant]}>
                        {sub.status.replace("_", " ")}
                      </Badge>
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
