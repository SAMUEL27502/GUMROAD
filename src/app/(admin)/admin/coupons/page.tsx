"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AdminCouponRecord } from "@/lib/data/admin-crud";
import { useAdminCrudStore } from "@/store/admin-crud-store";

const fields: CrudField[] = [
  { key: "code", label: "Code", required: true, placeholder: "WELCOME20" },
  {
    key: "type",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { label: "Percent", value: "PERCENT" },
      { label: "Fixed", value: "FIXED" },
    ],
  },
  { key: "value", label: "Value", type: "number", required: true },
  { key: "maxRedemptions", label: "Max redemptions", type: "number", required: true },
  { key: "redeemed", label: "Redeemed", type: "number" },
  { key: "expiresAt", label: "Expires", required: true, placeholder: "2026-12-31" },
  { key: "active", label: "Active", type: "boolean" },
];

const empty: Omit<AdminCouponRecord, "id"> = {
  code: "",
  type: "PERCENT",
  value: 10,
  maxRedemptions: 100,
  redeemed: 0,
  expiresAt: "2026-12-31",
  active: true,
};

export default function AdminCouponsPage() {
  const { coupons, createCoupon, updateCoupon, deleteCoupon } = useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCouponRecord | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
        <p className="mt-1 text-muted-foreground">Create and manage discount codes.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Coupons"
            count={coupons.length}
            createLabel="Add coupon"
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
                <th className="pb-3 pr-4 font-medium">Code</th>
                <th className="pb-3 pr-4 font-medium">Discount</th>
                <th className="pb-3 pr-4 font-medium">Usage</th>
                <th className="pb-3 pr-4 font-medium">Expires</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4 font-mono font-semibold">{coupon.code}</td>
                  <td className="py-3 pr-4">
                    {coupon.type === "PERCENT" ? `${coupon.value}%` : `$${coupon.value}`}
                  </td>
                  <td className="py-3 pr-4">
                    {coupon.redeemed}/{coupon.maxRedemptions}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{coupon.expiresAt}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={coupon.active ? "success" : "outline"}>
                      {coupon.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(coupon);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteCoupon(coupon.id);
                        toast.message(`Deleted ${coupon.code}`);
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
        key={editing?.id ?? "new-coupon"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit coupon" : "Create coupon"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            code: String(values.code).toUpperCase(),
            type: values.type as AdminCouponRecord["type"],
            value: Number(values.value),
            maxRedemptions: Number(values.maxRedemptions),
            redeemed: Number(values.redeemed || 0),
            expiresAt: String(values.expiresAt),
            active: Boolean(values.active),
          };
          if (editing) {
            updateCoupon(editing.id, payload);
            toast.success(`Updated ${payload.code}`);
          } else {
            createCoupon(payload);
            toast.success(`Created ${payload.code}`);
          }
        }}
      />
    </div>
  );
}
