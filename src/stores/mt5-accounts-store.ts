import { create } from "zustand";
import { persist } from "zustand/middleware";
import { connectedAccounts as seedAccounts } from "@/lib/data/platform";

export type Mt5Account = (typeof seedAccounts)[number] & {
  lastSyncAt?: string;
};

interface Mt5AccountsState {
  accounts: Mt5Account[];
  disconnect: (id: string) => void;
  reconnect: (id: string) => void;
  rename: (id: string, nickname: string) => void;
  sync: (id: string) => void;
  remove: (id: string) => void;
  add: (account: Mt5Account) => void;
}

export const useMt5AccountsStore = create<Mt5AccountsState>()(
  persist(
    (set) => ({
      accounts: seedAccounts.map((a) => ({
        ...a,
        lastSyncAt: new Date().toISOString(),
      })),
      disconnect: (id) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, connected: false } : a)),
        })),
      reconnect: (id) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, connected: true, lastSyncAt: new Date().toISOString() } : a
          ),
        })),
      rename: (id, nickname) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, nickname } : a)),
        })),
      sync: (id) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  lastSyncAt: new Date().toISOString(),
                  equity: Number((a.equity * (1 + (Math.random() * 0.004 - 0.002))).toFixed(2)),
                  balance: Number((a.balance * (1 + (Math.random() * 0.002 - 0.001))).toFixed(2)),
                }
              : a
          ),
        })),
      remove: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
      add: (account) =>
        set((state) => ({
          accounts: [...state.accounts, account],
        })),
    }),
    { name: "tradebib-mt5-accounts" }
  )
);
