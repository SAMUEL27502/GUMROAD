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
    <footer className="border-t border-border/60 bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Discover verified MetaTrader 5 Expert Advisors, connect accounts, and automate with confidence.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TradeBib. All rights reserved.
          </p>
          <p className="max-w-xl text-xs text-muted-foreground">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
