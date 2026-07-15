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
  subscribe: (bot: { id: string; name: string; price: number }) => string;
  cancel: (id: string) => void;
  reactivate: (id: string) => void;
}

function nextRenewalDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set, get) => ({
      subscriptions: seeded.filter((s) => bots.some((b) => b.id === s.botId)),
      subscribe: (bot) => {
        const existing = get().subscriptions.find((s) => s.botId === bot.id);
        if (existing?.status === "ACTIVE") return existing.id;
        if (existing?.status === "CANCELLED" || existing?.status === "PAST_DUE") {
          get().reactivate(existing.id);
          return existing.id;
        }
        const id = `sub-${bot.id}-${Date.now()}`;
        const today = new Date().toISOString().slice(0, 10);
        set((state) => ({
          subscriptions: [
            {
              id,
              botId: bot.id,
              botName: bot.name,
              price: bot.price,
              status: "ACTIVE",
              renewsAt: nextRenewalDate(),
              startedAt: today,
            },
            ...state.subscriptions,
          ],
        }));
        return id;
      },
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
