import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/providers/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TradeBib — Automated MT5 Bots Marketplace",
    template: "%s | TradeBib",
  },
  description:
    "Browse, subscribe and deploy verified MetaTrader 5 Expert Advisors using real verified trading data.",
  keywords: [
    "MT5",
    "Expert Advisors",
    "Forex bots",
    "automated trading",
    "TradeBib",
    "MetaTrader 5",
  ],
  openGraph: {
    title: "TradeBib — Automated MT5 Bots Marketplace",
    description:
      "Browse, subscribe and deploy verified MetaTrader 5 Expert Advisors using real verified trading data.",
    type: "website",
    siteName: "TradeBib",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeBib — Automated MT5 Bots Marketplace",
    description:
      "Browse, subscribe and deploy verified MetaTrader 5 Expert Advisors using real verified trading data.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jakarta.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
