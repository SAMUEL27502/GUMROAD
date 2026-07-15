"use server";

import { loginSchema, registerSchema } from "@/lib/validations";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const isAdmin = parsed.data.email.includes("admin");
  return {
    success: true,
    redirectTo: isAdmin ? "/admin" : "/dashboard",
  };
}

export async function registerAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  return { success: true, redirectTo: "/dashboard" };
}
