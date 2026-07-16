"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/loader";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/services/auth/user";

export function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role && user?.role !== role) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, role, user, router]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  if (role && user?.role !== role) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
