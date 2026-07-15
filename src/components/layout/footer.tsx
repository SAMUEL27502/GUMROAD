import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/charts", label: "Charts" },
      { href: "/pricing", label: "Pricing" },
      { href: "/mt5", label: "MT5 Connect" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/compare", label: "Bot Comparison" },
      { href: "/calculator", label: "Profit Calculator" },
      { href: "/calendar", label: "Economic Calendar" },
      { href: "/news", label: "Forex News" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/design-system", label: "Design System" },
      { href: "/animations", label: "Animations" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/risk-disclosure", label: "Risk Disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border/60 bg-background/80 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              Discover verified MetaTrader 5 Expert Advisors, connect accounts, and automate with
              confidence.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-foreground mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm transition-colors hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-border/60 mt-12 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} TradeBib. All rights reserved.
          </p>
          <p className="text-muted-foreground max-w-xl text-xs">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
