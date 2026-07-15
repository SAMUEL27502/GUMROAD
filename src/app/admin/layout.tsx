"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav, AdminNavMobile } from "@/components/layout/admin-nav";
import { Loader } from "@/components/ui/loader";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminNavMobile />
      <div className="flex gap-8">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
