import type { Metadata } from "next";
import Link from "next/link";
import ContactInquiryForm from "@/components/ContactInquiryForm";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              CONTACT &amp; SUPPORT
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Spotted an outdated syllabus point, an answer key mismatch in a PYQ set, or a
              broken exam link? Reach out so we can review and update it.
            </p>

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-text-primary">Official Support Email</p>
                <a
                  href="mailto:support@sarjomexam.in"
                  className="mt-0.5 inline-block font-mono text-primary hover:underline"
                >
                  support@sarjomexam.in
                </a>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Response Window</p>
                <p className="mt-0.5 text-text-secondary">
                  Monday to Saturday, 10:00 AM - 6:00 PM IST
                </p>
              </div>

              <div>
                <p className="font-semibold text-text-primary">Best Details to Include</p>
                <p className="mt-0.5 text-text-secondary">
                  Exam name, paper/section, question or topic reference, and official notice/key
                  source if available.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-sm font-bold text-text-primary">Quick Study Links</h2>
            <div className="mt-3 flex flex-col gap-2 text-xs font-medium sm:text-sm">
              <Link
                href="/syllabus"
                className="rounded-lg border border-border bg-background px-3.5 py-2 text-text-primary transition hover:border-primary"
              >
                Syllabus Explorer
              </Link>
              <Link
                href="/pyq-practice"
                className="rounded-lg border border-border bg-background px-3.5 py-2 text-text-primary transition hover:border-primary"
              >
                PYQ CBT Practice
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-border bg-background px-3.5 py-2 text-text-primary transition hover:border-primary"
              >
                Content Verification Standards
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-7">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            DIRECT INQUIRY &amp; CORRECTIONS
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight">
            Send a Query or Syllabus / PYQ Report
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary sm:text-sm">
            Fill out the details below to format your support or correction message for{" "}
            <span className="font-medium text-text-primary">support@sarjomexam.in</span>.
          </p>

          <div className="mt-5">
            <ContactInquiryForm />
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact SARJOM EXAM | Support & Syllabus Corrections";
  const description =
    "Contact SARJOM EXAM for syllabus updates, PYQ answer key reports, exam notification queries, and candidate support.";

  return {
    title: "Contact",
    description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title,
      description,
      url: "https://www.sarjomexam.in/contact",
      siteName: "SARJOM EXAM",
      type: "website",
    },
  };
}