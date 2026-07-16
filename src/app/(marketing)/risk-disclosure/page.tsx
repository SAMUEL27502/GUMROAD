import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Risk Disclosure",
  description: "Important risk disclosure for trading with automated Expert Advisors on TradeBib.",
  path: "/risk-disclosure",
});

export default function RiskDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-amber-400">Risk Disclosure</h1>
        <p className="mt-2 text-sm text-amber-200/80">
          Please read this disclosure carefully before using TradeBib or deploying any Expert
          Advisor.
        </p>
      </div>

      <div className="prose prose-invert text-muted-foreground max-w-none space-y-8">
        <section>
          <h2 className="text-foreground text-xl font-semibold">
            Trading Involves Substantial Risk
          </h2>
          <p className="mt-3 leading-relaxed">
            Foreign exchange, metals, and cryptocurrency trading carry a high level of risk and may
            not be suitable for all investors. Leverage can work against you as well as for you. You
            could lose some or all of your invested capital. Only trade with money you can afford to
            lose.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">Automated Trading Risks</h2>
          <p className="mt-3 leading-relaxed">
            Expert Advisors (EAs) execute trades automatically based on programmed logic. They may
            behave unpredictably during high volatility, news events, broker disconnections, or
            spread widening. Past backtested or live performance displayed on TradeBib does not
            guarantee future results. Drawdowns shown are historical and future drawdowns may exceed
            prior maximums.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">No Investment Advice</h2>
          <p className="mt-3 leading-relaxed">
            TradeBib does not provide investment, financial, tax, or legal advice. Bot ratings, ROI
            figures, and risk grades are informational tools based on historical data. You should
            consult independent financial advisors before making trading decisions.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">Technology &amp; Connectivity</h2>
          <p className="mt-3 leading-relaxed">
            Platform availability, MT5 connectivity, VPS uptime, and data synchronization are
            subject to technical failures. TradeBib is not responsible for missed trades, duplicate
            orders, or losses resulting from connectivity issues between your terminal and broker
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">Your Acknowledgment</h2>
          <p className="mt-3 leading-relaxed">
            By using TradeBib, you acknowledge that you understand these risks and accept full
            responsibility for your trading activity. Review our{" "}
            <Link href="/terms" className="text-sky-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-sky-400 hover:underline">
              Privacy Policy
            </Link>{" "}
            for additional information.
          </p>
        </section>
      </div>
    </div>
  );
}
