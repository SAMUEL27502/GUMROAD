import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bots } from "@/lib/data/bots";

export interface UserSubscription {
  id: string;
  botId: string;
  botName: string;
  price: number;
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE";
  renewsAt: string;
  startedAt: string;
}

const seeded: UserSubscription[] = [
  {
    id: "sub1",
    botId: "1",
    botName: "GoldScalper Pro",
    price: 79,
    status: "ACTIVE",
    renewsAt: "2026-08-15",
    startedAt: "2026-05-15",
  },
  {
    id: "sub2",
    botId: "2",
    botName: "EuroTrend AI",
    price: 49,
    status: "ACTIVE",
    renewsAt: "2026-08-01",
    startedAt: "2026-04-01",
  },
  {
    id: "sub3",
    botId: "8",
    botName: "BreakoutHunter",
    price: 59,
    status: "ACTIVE",
    renewsAt: "2026-08-10",
    startedAt: "2026-06-10",
  },
];

interface SubscriptionsState {
  subscriptions: UserSubscription[];
  cancel: (id: string) => void;
  reactivate: (id: string) => void;
}

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set) => ({
      subscriptions: seeded.filter((s) => bots.some((b) => b.id === s.botId)),
      cancel: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status: "CANCELLED" } : s
          ),
        })),
      reactivate: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status: "ACTIVE" } : s
          ),
        })),
    }),
    { name: "tradebib-subscriptions" }
  )
);
