"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminUserRecord } from "@/lib/data/admin-crud";
import { useAdminCrudStore } from "@/stores/admin-crud-store";

const fields: CrudField[] = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  {
    key: "plan",
    label: "Plan",
    type: "select",
    required: true,
    options: [
      { label: "STARTER", value: "STARTER" },
      { label: "PRO", value: "PRO" },
      { label: "ELITE", value: "ELITE" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { label: "USER", value: "USER" },
      { label: "ADMIN", value: "ADMIN" },
      { label: "AFFILIATE", value: "AFFILIATE" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "SUSPENDED", value: "SUSPENDED" },
      { label: "PENDING", value: "PENDING" },
    ],
  },
  { key: "joined", label: "Joined", required: true, placeholder: "2026-07-15" },
];

const empty: Omit<AdminUserRecord, "id"> = {
  name: "",
  email: "",
  plan: "STARTER",
  role: "USER",
  status: "ACTIVE",
  joined: new Date().toISOString().slice(0, 10),
};

export default function AdminUsersCrudPage() {
  const { users, createUser, updateUser, deleteUser } = useAdminCrudStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">Create, update, suspend, and delete accounts.</p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader className="space-y-4">
          <CrudToolbar
            title="All users"
            count={filtered.length}
            createLabel="Add user"
            onCreate={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, plan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">User</th>
                <th className="pb-3 pr-4 font-medium">Plan</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Joined</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary">{user.plan}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>{user.role}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{user.joined}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={
                        user.status === "ACTIVE"
                          ? "success"
                          : user.status === "SUSPENDED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(user);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteUser(user.id);
                        toast.message(`Deleted ${user.name}`);
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
        key={editing?.id ?? "new-user"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit user" : "Create user"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            name: String(values.name),
            email: String(values.email),
            plan: values.plan as AdminUserRecord["plan"],
            role: values.role as AdminUserRecord["role"],
            status: values.status as AdminUserRecord["status"],
            joined: String(values.joined),
          };
          if (editing) {
            updateUser(editing.id, payload);
            toast.success(`Updated ${payload.name}`);
          } else {
            createUser(payload);
            toast.success(`Created ${payload.name}`);
          }
        }}
      />
    </div>
  );
}
