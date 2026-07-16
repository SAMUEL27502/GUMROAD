/**
 * Map Supabase / network auth errors to clear user-facing messages.
 */
export function mapAuthError(message: string | undefined | null): string {
  const raw = (message ?? "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "Authentication failed. Please try again.";

  if (
    lower.includes("email not confirmed") ||
    lower.includes("email_not_confirmed") ||
    lower.includes("not confirmed")
  ) {
    return "Email not confirmed. Check your inbox for the verification link.";
  }

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials") ||
    lower.includes("wrong password") ||
    lower.includes("invalid email or password")
  ) {
    return "Wrong email or password.";
  }

  if (lower.includes("user not found") || lower.includes("no user found")) {
    return "No account found for that email.";
  }

  if (
    lower.includes("unable to validate email") ||
    lower.includes("invalid email") ||
    (lower.includes("email address") && lower.includes("invalid"))
  ) {
    return "Invalid email address.";
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("failed to fetch") ||
    lower.includes("timeout") ||
    lower.includes("econnrefused")
  ) {
    return "Network error. Check your connection and try again.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Sign in instead.";
  }

  return raw;
}
