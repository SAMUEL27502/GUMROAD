import type { Metadata } from "next";
import { NotificationCenter } from "@/components/notifications/notification-center";

export const metadata: Metadata = {
  title: "Notification Center | TradeBib",
  description:
    "Bot alerts, trade alerts, subscription alerts, and security alerts in one Notification Center.",
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}
