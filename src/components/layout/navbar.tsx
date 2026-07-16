"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  CreditCard,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plug,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "./logo";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationsStore } from "@/store/notifications-store";
import { categoryLabels } from "@/lib/data/notifications";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

/** Heavy client routes skip Link prefetch to keep hover bandwidth low. */
const links = [
  { href: "/marketplace", label: "Marketplace", prefetch: true },
  { href: "/signals", label: "Signals", prefetch: true },
  { href: "/compare", label: "Compare", prefetch: false },
  { href: "/leaderboard", label: "Leaderboard", prefetch: true },
  { href: "/charts", label: "Charts", prefetch: false },
  { href: "/dashboard", label: "Dashboard", prefetch: false },
  { href: "/pricing", label: "Pricing", prefetch: true },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isLoading, clear } = useAuthStore();
  const { items, unreadCount, markRead } = useNotificationsStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const unread = unreadCount("ALL");
  const preview = [...items]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first link in the panel
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSignOut() {
    clear();
    try {
      await logoutAction();
    } catch {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-40 border-b backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.prefetch}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "bg-sky-500/10 text-sky-400"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            </Button>
          ) : (
            <div className="h-10 w-10" aria-hidden />
          )}

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
                  >
                    <Bell className="h-4 w-4" aria-hidden />
                    {unread > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unread > 0 ? <Badge variant="default">{unread}</Badge> : null}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {preview.length === 0 ? (
                    <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                      No notifications
                    </div>
                  ) : (
                    preview.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        className="flex flex-col items-start gap-1 py-3"
                        onClick={() => {
                          markRead(n.id);
                          router.push(n.href);
                        }}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="font-medium">{n.title}</span>
                          {!n.read && <Badge variant="default">New</Badge>}
                        </div>
                        <span className="text-muted-foreground text-xs">{n.message}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {categoryLabels[n.category]} · {n.time}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/notifications")}>
                    <Bell className="h-4 w-4" /> View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 px-2"
                    aria-label={`Account menu for ${user?.name || "user"}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {(user?.name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-muted-foreground text-xs font-normal">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/journal")}>
                    <LayoutDashboard className="h-4 w-4" /> AI Journal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/copy")}>
                    <Gift className="h-4 w-4" /> Copy Trading
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/vps")}>
                    <Plug className="h-4 w-4" /> VPS Hosting
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/alerts")}>
                    <Bell className="h-4 w-4" /> Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/referrals")}>
                    <Gift className="h-4 w-4" /> Affiliate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/billing")}>
                    <CreditCard className="h-4 w-4" /> Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/mt5")}>
                    <Plug className="h-4 w-4" /> MT5 Connect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/kyc")}>
                    <Shield className="h-4 w-4" /> KYC Verification
                  </DropdownMenuItem>
                  {user?.role === "ADMIN" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <Shield className="h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : isLoading ? (
            <div className="bg-muted/50 hidden h-9 w-24 animate-pulse rounded-xl sm:block" />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </Container>

      {open && (
        <div
          id={menuId}
          ref={menuRef}
          className="border-border/60 bg-background/95 border-t px-4 py-4 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.prefetch}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    active ? "bg-sky-500/10 text-sky-400" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
