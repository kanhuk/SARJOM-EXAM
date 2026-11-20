import type { Metadata } from "next";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-[18px] border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          BILLING &amp; PLANS
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Refund Policy
        </h1>
        <p className="mt-2 font-mono text-xs text-text-secondary">
          Effective Date: November 2026
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Free &amp; Paid Plans Scope</h2>
            <p>
              SARJOM EXAM provides free study resources alongside optional paid plans, mock test series, or premium study modules as introduced on the platform. Plan validity, inclusions, and pricing are displayed clearly prior to checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Digital Access &amp; Non-Refundable Activation</h2>
            <p>
              Paid plans grant immediate digital access to online test consoles, curated question banks, and study tools. Once a plan is activated on a candidate account and digital content access begins, fees are generally non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Failed or Duplicate Transactions</h2>
            <p>
              If an amount is debited from your bank account, UPI, or card due to a network or payment gateway error without activating your plan, or if you are charged twice for the same plan, we will verify the transaction record and initiate a refund or plan activation promptly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Technical Unavailability</h2>
            <p>
              In the rare case where a paid feature remains inaccessible for an extended duration due to a verified technical fault on our platform and cannot be restored within a reasonable time, candidates may request a billing review.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">5. How to Request Billing Support</h2>
            <p>
              For any payment or refund query, share your registered email address, transaction or order reference ID, and payment date via our{" "}
              <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">
                Contact page
              </Link>{" "}
              so our team can verify and assist you.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Refund Policy",
    description: "Refund Policy for SARJOM EXAM plans and test series.",
    openGraph: {
      title: "Refund Policy | SARJOM EXAM",
      description: "Refund Policy for SARJOM EXAM plans and test series.",
      url: "https://www.sarjomexam.in/refund",
    },
  };
}