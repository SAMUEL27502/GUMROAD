"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/layout/logo";

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({ items, title = "Navigation", footer, className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-border/60 bg-card/40 sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r backdrop-blur-xl transition-all lg:flex",
        collapsed ? "w-[72px]" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 p-4">
        {!collapsed && <Logo size="sm" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      {!collapsed && (
        <p className="text-muted-foreground px-4 pt-4 text-xs font-semibold tracking-wider uppercase">
          {title}
        </p>
      )}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
      {footer && (
        <>
          <Separator />
          <div className="p-4">{footer}</div>
        </>
      )}
    </aside>
  );
}
