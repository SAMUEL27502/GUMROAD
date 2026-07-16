import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationPrefs } from "@/lib/validations";

const defaultPrefs: NotificationPrefs = {
  botPerformance: true,
  tradeAlerts: true,
  mt5Sync: true,
  weeklyDigest: false,
  subscriptionBilling: true,
  securityAlerts: true,
  marketing: false,
};

interface NotificationPrefsState {
  prefs: NotificationPrefs;
  setPrefs: (prefs: NotificationPrefs) => void;
  updatePref: <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => void;
  reset: () => void;
}

export const useNotificationPrefsStore = create<NotificationPrefsState>()(
  persist(
    (set) => ({
      prefs: defaultPrefs,
      setPrefs: (prefs) => set({ prefs }),
      updatePref: (key, value) => set((state) => ({ prefs: { ...state.prefs, [key]: value } })),
      reset: () => set({ prefs: defaultPrefs }),
    }),
    { name: "tradebib-notification-prefs" }
  )
);
