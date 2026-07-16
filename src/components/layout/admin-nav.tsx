"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Tags,
  TicketPercent,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bots", label: "Bots", icon: Bot },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/pricing", label: "Pricing", icon: Tags },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-56 shrink-0 lg:block">
      <div className="glass sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl p-3">
        <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Admin Panel
        </p>
        <ul className="space-y-1">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "text-sky-400"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-xl border border-sky-500/20 bg-sky-500/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function AdminNavMobile() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border border-sky-500/30 bg-sky-500/15 text-sky-400"
                : "glass text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
