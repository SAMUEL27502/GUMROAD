import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "TradeBib privacy policy — how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground mt-2 text-sm">Last updated: July 1, 2026</p>

      <div className="prose prose-invert text-muted-foreground mt-10 max-w-none space-y-8">
        <section>
          <h2 className="text-foreground text-xl font-semibold">1. Information We Collect</h2>
          <p className="mt-3 leading-relaxed">
            We collect information you provide directly, including account registration details, MT5
            connection credentials (stored encrypted), subscription and billing information, and
            communications with our support team. We also collect usage data such as pages visited,
            bot subscriptions, and feature interactions to improve our platform.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="mt-3 leading-relaxed">
            Your information is used to provide and maintain the TradeBib service, process
            subscriptions, sync MT5 account data, send performance alerts, and respond to support
            requests. We may use aggregated, anonymized data for analytics and product improvement.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">3. MT5 Account Data</h2>
          <p className="mt-3 leading-relaxed">
            When you connect a MetaTrader 5 account, we access balance, equity, open trades, and
            historical performance via investor (read-only) credentials. We do not execute trades on
            your behalf without explicit deployment authorization. Credentials are encrypted at rest
            and in transit using industry-standard protocols.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">4. Data Sharing</h2>
          <p className="mt-3 leading-relaxed">
            We do not sell your personal information. We may share data with payment processors,
            cloud infrastructure providers, and analytics services under strict data processing
            agreements. We may disclose information if required by law or to protect the rights and
            safety of our users.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">5. Your Rights</h2>
          <p className="mt-3 leading-relaxed">
            Depending on your jurisdiction, you may have the right to access, correct, delete, or
            export your personal data. Contact us at privacy@tradebib.com to exercise these rights.
            You may also disconnect MT5 accounts and delete your TradeBib account at any time from
            your profile settings.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-xl font-semibold">6. Contact</h2>
          <p className="mt-3 leading-relaxed">
            For privacy-related inquiries, email{" "}
            <a href="mailto:privacy@tradebib.com" className="text-sky-400 hover:underline">
              privacy@tradebib.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
