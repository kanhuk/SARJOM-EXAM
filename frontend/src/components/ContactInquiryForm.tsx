"use client";

import { useState, type FormEvent } from "react";

const INQUIRY_TOPICS = [
  "Syllabus Correction or Update",
  "PYQ Question / Answer Key Issue",
  "Exam Notification or Stage Info",
  "Account, Login or Technical Support",
  "General Feedback or Partnership",
] as const;

export default function ContactInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [examName, setExamName] = useState("");
  const [topic, setTopic] = useState<string>(INQUIRY_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [submittedSummary, setSubmittedSummary] = useState<{
    topic: string;
    examName: string;
    mailtoHref: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setErrorMsg("Please enter at least 10 characters describing your query or correction.");
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address or leave it blank.");
      return;
    }

    setErrorMsg(null);
    const examPart = examName.trim() ? ` [${examName.trim()}]` : "";
    const subject = encodeURIComponent(`SARJOM EXAM: ${topic}${examPart}`);
    const bodyLines = [
      name.trim() ? `Name: ${name.trim()}` : null,
      trimmedEmail ? `Reply Email: ${trimmedEmail}` : null,
      examName.trim() ? `Exam: ${examName.trim()}` : null,
      `Category: ${topic}`,
      "",
      trimmedMessage,
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join("\n"));

    setSubmittedSummary({
      topic,
      examName: examName.trim() || "General",
      mailtoHref: `mailto:support@sarjomexam.in?subject=${subject}&body=${body}`,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-semibold text-text-primary"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Subham Nayak"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-semibold text-text-primary"
          >
            Email for Reply (Optional)
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-topic"
            className="block text-xs font-semibold text-text-primary"
          >
            Inquiry Category
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {INQUIRY_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-exam"
            className="block text-xs font-semibold text-text-primary"
          >
            Target Exam (Optional)
          </label>
          <input
            id="contact-exam"
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g., OPSC ASO, OSSC CGL, UGC NET"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-semibold text-text-primary"
        >
          Details / Correction Note
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share the exam name, paper/question number, official source link, or support issue..."
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-primary focus:outline-none"
        />
      </div>

      {errorMsg && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-500"
        >
          {errorMsg}
        </p>
      )}

      {submittedSummary && (
        <div className="rounded-xl border border-primary/40 bg-background p-4 text-xs sm:text-sm">
          <p className="font-semibold text-text-primary">
            Message prepared for {submittedSummary.topic} ({submittedSummary.examName}).
          </p>
          <p className="mt-1 text-text-secondary">
            Click below to open your email app pre-filled to{" "}
            <span className="font-medium text-text-primary">support@sarjomexam.in</span>, or send
            directly from your mail client.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={submittedSummary.mailtoHref}
              className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:opacity-95"
            >
              Send via Email App
            </a>
            <button
              type="button"
              onClick={() => {
                setSubmittedSummary(null);
                setMessage("");
              }}
              className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:text-text-primary"
            >
              Clear Form
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-text-secondary">
          Direct support: <strong className="text-text-primary">support@sarjomexam.in</strong>
        </span>
        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-95 sm:text-sm"
        >
          Prepare Support Request
        </button>
      </div>
    </form>
  );
}