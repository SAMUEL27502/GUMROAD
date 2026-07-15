"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DEMO_SESSION_COOKIE,
  REMEMBER_ME_COOKIE,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { changePasswordSchema, notificationPrefsSchema, profileSchema } from "@/lib/validations";

export type ProfileActionResult = {
  success: boolean;
  error?: string;
  message?: string;
  avatarUrl?: string;
};

type DemoSession = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  notifications?: Record<string, boolean>;
};

async function readDemoSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

async function writeDemoSession(session: DemoSession) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function updateProfileAction(formData: FormData): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    plan: formData.get("plan") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid profile" };
  }

  const { name, plan } = parsed.data;

  if (!isSupabaseConfigured()) {
    const session = await readDemoSession();
    if (!session) return { success: false, error: "Not authenticated" };
    await writeDemoSession({ ...session, name });
    return { success: true, message: "Profile updated" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: name,
      name,
      ...(plan ? { plan } : {}),
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Profile updated" };
}

export async function updateAvatarAction(formData: FormData): Promise<ProfileActionResult> {
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();
  if (!avatarUrl) {
    return { success: false, error: "No avatar provided" };
  }

  // Allow data URLs (demo/local) or https URLs (Supabase storage)
  const isData = avatarUrl.startsWith("data:image/");
  const isHttp = avatarUrl.startsWith("https://");
  if (!isData && !isHttp) {
    return { success: false, error: "Invalid avatar format" };
  }

  if (isData && avatarUrl.length > 900_000) {
    return { success: false, error: "Avatar too large. Use an image under ~500KB." };
  }

  if (!isSupabaseConfigured()) {
    const session = await readDemoSession();
    if (!session) return { success: false, error: "Not authenticated" };
    // Keep cookie lean — client also stores avatar in auth state
    await writeDemoSession({
      ...session,
      avatarUrl: isHttp ? avatarUrl : undefined,
    });
    return { success: true, message: "Avatar updated", avatarUrl };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl, picture: avatarUrl },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Avatar updated", avatarUrl };
}

export async function removeAvatarAction(): Promise<ProfileActionResult> {
  if (!isSupabaseConfigured()) {
    const session = await readDemoSession();
    if (!session) return { success: false, error: "Not authenticated" };
    const { avatarUrl: _removed, ...rest } = session;
    await writeDemoSession(rest);
    return { success: true, message: "Avatar removed", avatarUrl: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: null, picture: null },
  });
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Avatar removed", avatarUrl: "" };
}

export async function changePasswordAction(formData: FormData): Promise<ProfileActionResult> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "Password updated (demo mode)",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "Not authenticated" };
  }

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (reauthError) {
    return { success: false, error: "Current password is incorrect" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Password updated successfully" };
}

export async function saveNotificationPrefsAction(
  formData: FormData
): Promise<ProfileActionResult> {
  const prefs = {
    botPerformance: formData.get("botPerformance") === "true",
    tradeAlerts: formData.get("tradeAlerts") === "true",
    mt5Sync: formData.get("mt5Sync") === "true",
    weeklyDigest: formData.get("weeklyDigest") === "true",
    subscriptionBilling: formData.get("subscriptionBilling") === "true",
    marketing: formData.get("marketing") === "true",
  };

  const parsed = notificationPrefsSchema.safeParse(prefs);
  if (!parsed.success) {
    return { success: false, error: "Invalid notification preferences" };
  }

  if (!isSupabaseConfigured()) {
    const session = await readDemoSession();
    if (!session) return { success: false, error: "Not authenticated" };
    await writeDemoSession({ ...session, notifications: parsed.data });
    return { success: true, message: "Notification preferences saved" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { notification_prefs: parsed.data },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Notification preferences saved" };
}

export async function deleteAccountAction(formData: FormData): Promise<ProfileActionResult> {
  const confirmation = String(formData.get("confirmation") || "").trim();
  if (confirmation !== "DELETE") {
    return { success: false, error: "Type DELETE to confirm account deletion" };
  }

  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_SESSION_COOKIE);
    cookieStore.delete(REMEMBER_ME_COOKIE);
    redirect("/");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Soft-delete metadata when service role is unavailable; always sign out.
  await supabase.auth.updateUser({
    data: { deleted_at: new Date().toISOString(), account_status: "deleted" },
  });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey && !serviceKey.includes("your-service")) {
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
    await admin.auth.admin.deleteUser(user.id);
  }

  await supabase.auth.signOut();
  redirect("/");
}
