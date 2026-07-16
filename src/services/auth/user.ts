import type { User } from "@supabase/supabase-js";

export type PlanTier = "STARTER" | "PRO" | "ELITE";
export type UserRole = "USER" | "ADMIN" | "AFFILIATE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: PlanTier;
  role: UserRole;
  emailVerified: boolean;
  provider?: string;
}

export function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  const app = user.app_metadata ?? {};
  const email = user.email ?? "";
  const name = meta.full_name || meta.name || meta.user_name || email.split("@")[0] || "Trader";

  const roleFromMeta = (app.role || meta.role || "").toString().toUpperCase();
  const role: UserRole =
    roleFromMeta === "ADMIN" || email.includes("admin")
      ? "ADMIN"
      : roleFromMeta === "AFFILIATE"
        ? "AFFILIATE"
        : "USER";

  return {
    id: user.id,
    name,
    email,
    avatarUrl: meta.avatar_url || meta.picture || undefined,
    plan: (meta.plan as PlanTier) || "STARTER",
    role,
    emailVerified: Boolean(user.email_confirmed_at),
    provider: app.provider,
  };
}

function demoIdFromEmail(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  return `demo-${hash.toString(16)}`;
}

export function mapDemoUser(
  email: string,
  name?: string,
  extras?: { avatarUrl?: string; plan?: PlanTier }
): AuthUser {
  return {
    id: demoIdFromEmail(email),
    name: name || email.split("@")[0] || "Trader",
    email,
    avatarUrl: extras?.avatarUrl,
    plan: extras?.plan || "PRO",
    role: email.includes("admin") ? "ADMIN" : "USER",
    emailVerified: true,
    provider: "demo",
  };
}
