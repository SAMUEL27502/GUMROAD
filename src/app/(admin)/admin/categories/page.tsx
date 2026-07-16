"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AdminCategoryRecord } from "@/lib/data/admin-crud";
import { useAdminCrudStore } from "@/store/admin-crud-store";

const fields: CrudField[] = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "botCount", label: "Bot count", type: "number" },
];

const empty: Omit<AdminCategoryRecord, "id"> = {
  name: "",
  slug: "",
  description: "",
  botCount: 0,
};

export default function AdminCategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory } = useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategoryRecord | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-muted-foreground">Manage marketplace bot categories.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Categories"
            count={categories.length}
            createLabel="Add category"
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
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Slug</th>
                <th className="pb-3 pr-4 font-medium">Bots</th>
                <th className="pb-3 pr-4 font-medium">Description</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4 font-medium">{cat.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{cat.slug}</td>
                  <td className="py-3 pr-4">{cat.botCount}</td>
                  <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">
                    {cat.description}
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(cat);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteCategory(cat.id);
                        toast.message(`Deleted ${cat.name}`);
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
        key={editing?.id ?? "new-cat"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit category" : "Create category"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            name: String(values.name),
            slug: String(values.slug),
            description: String(values.description),
            botCount: Number(values.botCount || 0),
          };
          if (editing) {
            updateCategory(editing.id, payload);
            toast.success(`Updated ${payload.name}`);
          } else {
            createCategory(payload);
            toast.success(`Created ${payload.name}`);
          }
        }}
      />
    </div>
  );
}
