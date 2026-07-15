import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: "STARTER" | "PRO" | "ELITE";
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name) =>
        set({
          isAuthenticated: true,
          user: {
            id: "demo-user",
            name: name || email.split("@")[0],
            email,
            plan: "PRO",
            role: email.includes("admin") ? "ADMIN" : "USER",
            avatarUrl: undefined,
          },
        }),
      register: (name, email) =>
        set({
          isAuthenticated: true,
          user: {
            id: "demo-user",
            name,
            email,
            plan: "STARTER",
            role: "USER",
          },
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: "tradebib-auth" }
  )
);
