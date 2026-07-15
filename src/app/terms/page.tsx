import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "TradeBib terms of service — rules and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 1, 2026</p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-3 leading-relaxed">
            By accessing or using TradeBib, you agree to be bound by these Terms of Service.
            If you do not agree, you may not use the platform. We reserve the right to modify
            these terms at any time with notice posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
          <p className="mt-3 leading-relaxed">
            TradeBib provides a marketplace for MetaTrader 5 Expert Advisors (trading bots),
            account connectivity, performance analytics, and deployment tools. We are a technology
            platform — not a broker, investment advisor, or fund manager.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Subscriptions &amp; Billing</h2>
          <p className="mt-3 leading-relaxed">
            Paid plans renew automatically unless cancelled before the renewal date.
            Bot subscriptions are billed separately per Expert Advisor. Refunds are handled
            on a case-by-case basis within 7 days of initial purchase. You are responsible
            for maintaining valid payment information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. User Responsibilities</h2>
          <p className="mt-3 leading-relaxed">
            You are solely responsible for your trading decisions and account security.
            You must provide accurate registration information and keep your credentials confidential.
            You may not reverse-engineer, redistribute, or resell Expert Advisors obtained through TradeBib.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
          <p className="mt-3 leading-relaxed">
            TradeBib is provided &quot;as is&quot; without warranties of any kind. We are not liable
            for trading losses, system downtime, data inaccuracies, or third-party broker issues.
            Our total liability shall not exceed the amount you paid us in the 12 months preceding any claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Governing Law</h2>
          <p className="mt-3 leading-relaxed">
            These terms are governed by the laws of England and Wales. Disputes shall be resolved
            through binding arbitration unless prohibited by applicable law. Contact legal@tradebib.com
            for formal notices.
          </p>
        </section>
      </div>
    </div>
  );
}
