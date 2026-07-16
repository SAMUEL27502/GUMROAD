"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AdminPricingRecord } from "@/lib/data/admin-crud";
import { formatCurrency } from "@/lib/utils";
import { useAdminCrudStore } from "@/stores/admin-crud-store";

const fields: CrudField[] = [
  { key: "name", label: "Plan name", required: true },
  { key: "monthlyPrice", label: "Monthly price", type: "number", required: true },
  { key: "yearlyPrice", label: "Yearly price", type: "number", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "popular", label: "Popular", type: "boolean" },
  { key: "active", label: "Active", type: "boolean" },
];

const empty: Omit<AdminPricingRecord, "id"> = {
  name: "",
  monthlyPrice: 0,
  yearlyPrice: 0,
  description: "",
  popular: false,
  active: true,
};

export default function AdminPricingCrudPage() {
  const { pricing, createPricing, updatePricing, deletePricing } = useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPricingRecord | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-1 text-muted-foreground">Manage Starter / Pro / Elite plan pricing.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Plans"
            count={pricing.length}
            createLabel="Add plan"
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
                <th className="pb-3 pr-4 font-medium">Plan</th>
                <th className="pb-3 pr-4 font-medium">Monthly</th>
                <th className="pb-3 pr-4 font-medium">Yearly</th>
                <th className="pb-3 pr-4 font-medium">Flags</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((plan) => (
                <tr key={plan.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{plan.name}</p>
                    <p className="max-w-xs truncate text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    {plan.monthlyPrice === 0 ? "Free" : formatCurrency(plan.monthlyPrice)}
                  </td>
                  <td className="py-3 pr-4">
                    {plan.yearlyPrice === 0 ? "—" : formatCurrency(plan.yearlyPrice)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {plan.popular && <Badge>Popular</Badge>}
                      <Badge variant={plan.active ? "success" : "outline"}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(plan);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deletePricing(plan.id);
                        toast.message(`Deleted ${plan.name}`);
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
        key={editing?.id ?? "new-price"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit plan" : "Create plan"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            name: String(values.name),
            monthlyPrice: Number(values.monthlyPrice),
            yearlyPrice: Number(values.yearlyPrice),
            description: String(values.description),
            popular: Boolean(values.popular),
            active: Boolean(values.active),
          };
          if (editing) {
            updatePricing(editing.id, payload);
            toast.success(`Updated ${payload.name}`);
          } else {
            createPricing(payload);
            toast.success(`Created ${payload.name}`);
          }
        }}
      />
    </div>
  );
}
