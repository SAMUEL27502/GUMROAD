import type { Metadata } from "next";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Notification Center",
  description:
    "Bot alerts, trade alerts, subscription alerts, and security alerts in one Notification Center.",
  path: "/notifications",
  noIndex: true,
});

export default function NotificationsPage() {
  return <NotificationCenter />;
}
