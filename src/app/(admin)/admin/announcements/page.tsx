"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AdminAnnouncementRecord } from "@/lib/data/admin-crud";
import { useAdminCrudStore } from "@/store/admin-crud-store";

const fields: CrudField[] = [
  { key: "title", label: "Title", required: true },
  { key: "body", label: "Body", type: "textarea", required: true },
  {
    key: "audience",
    label: "Audience",
    type: "select",
    required: true,
    options: [
      { label: "All users", value: "ALL" },
      { label: "Pro", value: "PRO" },
      { label: "Elite", value: "ELITE" },
      { label: "Admins", value: "ADMIN" },
    ],
  },
  { key: "published", label: "Published", type: "boolean" },
  { key: "createdAt", label: "Date", required: true },
];

const empty: Omit<AdminAnnouncementRecord, "id"> = {
  title: "",
  body: "",
  audience: "ALL",
  published: false,
  createdAt: new Date().toISOString().slice(0, 10),
};

export default function AdminAnnouncementsPage() {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } =
    useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAnnouncementRecord | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="mt-1 text-muted-foreground">Publish platform notices to traders.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Announcements"
            count={announcements.length}
            createLabel="Add announcement"
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
                <th className="pb-3 pr-4 font-medium">Title</th>
                <th className="pb-3 pr-4 font-medium">Audience</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((item) => (
                <tr key={item.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{item.title}</p>
                    <p className="max-w-md truncate text-xs text-muted-foreground">{item.body}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary">{item.audience}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.createdAt}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={item.published ? "success" : "outline"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteAnnouncement(item.id);
                        toast.message("Announcement deleted");
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
        key={editing?.id ?? "new-ann"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit announcement" : "Create announcement"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            title: String(values.title),
            body: String(values.body),
            audience: values.audience as AdminAnnouncementRecord["audience"],
            published: Boolean(values.published),
            createdAt: String(values.createdAt),
          };
          if (editing) {
            updateAnnouncement(editing.id, payload);
            toast.success("Announcement updated");
          } else {
            createAnnouncement(payload);
            toast.success("Announcement created");
          }
        }}
      />
    </div>
  );
}
