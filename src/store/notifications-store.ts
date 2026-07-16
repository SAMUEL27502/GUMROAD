import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedNotifications,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/data/notifications";

interface NotificationsState {
  items: AppNotification[];
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: (category?: NotificationCategory | "ALL") => void;
  remove: (id: string) => void;
  unreadCount: (category?: NotificationCategory | "ALL") => number;
  byCategory: (category: NotificationCategory | "ALL") => AppNotification[];
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: seedNotifications,
      markRead: (id) =>
        set((state) => ({
          items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markUnread: (id) =>
        set((state) => ({
          items: state.items.map((n) => (n.id === id ? { ...n, read: false } : n)),
        })),
      markAllRead: (category = "ALL") =>
        set((state) => ({
          items: state.items.map((n) =>
            category === "ALL" || n.category === category ? { ...n, read: true } : n
          ),
        })),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((n) => n.id !== id),
        })),
      unreadCount: (category = "ALL") =>
        get().items.filter(
          (n) => !n.read && (category === "ALL" || n.category === category)
        ).length,
      byCategory: (category) => {
        const list =
          category === "ALL"
            ? get().items
            : get().items.filter((n) => n.category === category);
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
    }),
    { name: "tradebib-notifications" }
  )
);
