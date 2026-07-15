"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { adminUsers } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return adminUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Manage registered traders and account roles.
        </p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{filtered.length} users found</CardDescription>
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Plan</th>
                  <th className="pb-3 pr-4 font-medium">Role</th>
                  <th className="pb-3 pr-4 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant="secondary">{user.plan}</Badge>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{user.joined}</td>
                    <td className="py-4">
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
