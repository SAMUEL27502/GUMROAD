"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";
import {
  DEMO_SESSION_COOKIE,
  REMEMBER_ME_COOKIE,
  isSupabaseConfigured,
} from "@/services/supabase/config";
import { mapDemoUser } from "@/services/auth/user";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  message?: string;
  redirectTo?: string;
};

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function setDemoSession(email: string, name?: string, remember = false) {
  const user = mapDemoUser(email, name);
  const cookieStore = await cookies();
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  cookieStore.set(
    DEMO_SESSION_COOKIE,
    JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    }
  );
  cookieStore.set(REMEMBER_ME_COOKIE, remember ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return user;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on" || formData.get("remember") === "true",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password, remember } = parsed.data;
  const next = (formData.get("next") as string) || "/dashboard";

  if (!isSupabaseConfigured()) {
    await setDemoSession(email, undefined, remember);
    return { success: true, redirectTo: next, message: "Signed in (demo mode)" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_ME_COOKIE, remember ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
  });

  return { success: true, redirectTo: next };
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  if (!isSupabaseConfigured()) {
    await setDemoSession(email, name, true);
    return {
      success: true,
      redirectTo: "/dashboard",
      message: "Account created (demo mode)",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, name, plan: "STARTER", role: "USER" },
      emailRedirectTo: `${appUrl()}/auth/callback?next=/auth/verified`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user && !data.session) {
    return {
      success: true,
      redirectTo: `/auth/verify-email?email=${encodeURIComponent(email)}`,
      message: "Check your email to verify your account",
    };
  }

  return { success: true, redirectTo: "/dashboard" };
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: "If an account exists, a reset link was sent (demo mode).",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      redirectTo: "/login",
      message: "Password updated (demo mode). Sign in again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, redirectTo: "/login", message: "Password updated. Please sign in." };
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(REMEMBER_ME_COOKIE);
  redirect("/");
}

export async function updateProfileAction(formData: FormData): Promise<AuthActionResult> {
  const name = String(formData.get("name") || "").trim();
  const plan = String(formData.get("plan") || "STARTER");

  if (name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters" };
  }

  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { id: string; email: string; role?: string };
        cookieStore.set(DEMO_SESSION_COOKIE, JSON.stringify({ ...parsed, name }), {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch {
        /* ignore */
      }
    }
    return { success: true, message: "Profile updated" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: name, name, plan },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Profile updated" };
}

export async function resendVerificationAction(email: string): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Verification email resent (demo mode)" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${appUrl()}/auth/callback?next=/auth/verified`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Verification email sent" };
}
