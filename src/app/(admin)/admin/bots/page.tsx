"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useAdminCrudStore } from "@/store/admin-crud-store";
import type { AdminBotRecord } from "@/lib/data/admin-crud";

const fields: CrudField[] = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug", required: true, placeholder: "goldscalper-pro" },
  { key: "strategy", label: "Strategy", required: true },
  { key: "tradingPair", label: "Trading pair", required: true },
  {
    key: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { label: "Forex", value: "Forex" },
      { label: "Metals", value: "Metals" },
      { label: "Crypto", value: "Crypto" },
      { label: "Indices", value: "Indices" },
    ],
  },
  {
    key: "riskLevel",
    label: "Risk",
    type: "select",
    required: true,
    options: [
      { label: "LOW", value: "LOW" },
      { label: "MEDIUM", value: "MEDIUM" },
      { label: "HIGH", value: "HIGH" },
    ],
  },
  { key: "price", label: "Price / mo", type: "number", required: true },
  { key: "roi", label: "ROI %", type: "number", required: true },
  { key: "verified", label: "Verified", type: "boolean" },
  { key: "approved", label: "Approved", type: "boolean" },
];

const empty: Omit<AdminBotRecord, "id"> = {
  name: "",
  slug: "",
  strategy: "Scalping",
  tradingPair: "EURUSD",
  category: "Forex",
  riskLevel: "MEDIUM",
  price: 49,
  roi: 10,
  verified: false,
  approved: false,
};

export default function AdminBotsCrudPage() {
  const { bots, createBot, updateBot, deleteBot } = useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBotRecord | null>(null);

  const initialValues = useMemo(
    () => (editing ? { ...editing } : { ...empty }),
    [editing]
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Bots</h1>
        <p className="mt-1 text-muted-foreground">Create, edit, approve, and delete marketplace bots.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Bot inventory"
            count={bots.length}
            createLabel="Add bot"
            onCreate={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Bot</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">ROI</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bot.tradingPair} · {bot.strategy}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{bot.category}</td>
                  <td className="py-3 pr-4 text-emerald-400">{formatPercent(bot.roi)}</td>
                  <td className="py-3 pr-4">{formatCurrency(bot.price)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={bot.verified ? "success" : "outline"}>
                        {bot.verified ? "Verified" : "Unverified"}
                      </Badge>
                      <Badge variant={bot.approved ? "success" : "warning"}>
                        {bot.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(bot);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteBot(bot.id);
                        toast.message(`Deleted ${bot.name}`);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <CrudFormDialog
        key={editing?.id ?? "new-bot"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit bot" : "Create bot"}
        fields={fields}
        initialValues={initialValues}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            name: String(values.name),
            slug: String(values.slug),
            strategy: String(values.strategy),
            tradingPair: String(values.tradingPair),
            category: String(values.category),
            riskLevel: values.riskLevel as AdminBotRecord["riskLevel"],
            price: Number(values.price),
            roi: Number(values.roi),
            verified: Boolean(values.verified),
            approved: Boolean(values.approved),
          };
          if (editing) {
            updateBot(editing.id, payload);
            toast.success(`Updated ${payload.name}`);
          } else {
            createBot(payload);
            toast.success(`Created ${payload.name}`);
          }
        }}
      />
    </div>
  );
}
