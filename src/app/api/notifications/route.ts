import { NextResponse } from "next/server";
import { seedNotifications } from "@/lib/data/notifications";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "ALL";
  const read = searchParams.get("read");

  let items = [...seedNotifications].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (category !== "ALL") {
    items = items.filter((n) => n.category === category);
  }
  if (read === "true") items = items.filter((n) => n.read);
  if (read === "false") items = items.filter((n) => !n.read);

  return NextResponse.json({
    count: items.length,
    unread: seedNotifications.filter((n) => !n.read).length,
    notifications: items,
  });
}
