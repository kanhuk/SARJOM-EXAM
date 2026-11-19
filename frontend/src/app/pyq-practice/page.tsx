"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

type PyqCard = {
  id: string;
  exam: string;
  title: string;
  subject: string;
  category: "pyq" | "subject" | "topic";
  marksPerQuestion: number;
  negativeMark: number;
  expectedCutoffPercent: number;
  isBilingual: boolean;
  metadata: {
    examName?: string;
    question: string;
    question_or?: string;
    options: string[];
    options_or?: string[];
    answerIndex: number;
    explanation?: string;
  };
};

const defaultOfficialCards: PyqCard[] = [
  {
    id: "opsc-aso-official-1",
    exam: "OPSC ASO",
    title: "OPSC ASO General Awareness & Constitution Paper",
    subject: "General Awareness",
    category: "pyq",
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 68,
    isBilingual: true,
    metadata: {
      examName: "OPSC ASO",
      question: "Under which Article of the Indian Constitution is the Governor empowered to grant pardons?",
      question_or: "ଭାରତୀୟ ସମ୍ବିଧାନର କେଉଁ ଅନୁଚ୍ଛେଦ ଅଧୀନରେ ରାଜ୍ୟପାଳକ୍ଷମା ପ୍ରଦାନ କରିବାକୁ କ୍ଷମତାପ୍ରାପ୍ତ?",
      options: ["Article 161", "Article 123", "Article 72", "Article 213"],
      answerIndex: 0,
      explanation: "Article 161 empowers the Governor of a State to grant pardons, suspend, remit or commute sentences."
    }
  },
  {
    id: "opsc-aso-official-2",
    exam: "OPSC ASO",
    title: "OPSC ASO Odisha History & Geography Paper",
    subject: "Odisha GK",
    category: "pyq",
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 70,
    isBilingual: true,
    metadata: {
      examName: "OPSC ASO",
      question: "The famous 'Paika Rebellion' of Odisha took place in which year?",
      question_or: "ଓଡିଶାର ପ୍ରସିଦ୍ଧ 'ପାଇକ ବିଦ୍ରୋହ' କେଉଁ ବର୍ଷରେ ହୋଇଥିଲା?",
      options: ["1804", "1817", "1825", "1857"],
      answerIndex: 1,
      explanation: "The Paika Rebellion (Paika Bidroha) was an armed rebellion against British East India Company rule in Odisha in 1817."
    }
  }
];

export default function PyqPracticePage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedExam, setSelectedExam] = useState("OPSC ASO");
  const [cards, setCards] = useState<PyqCard[]>(defaultOfficialCards);

  useEffect(() => {
    const saved = localStorage.getItem("sarjom_uploaded_pyqs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards((prev) => [...parsed, ...prev]);
        }
      } catch (e) {
        console.error("Failed to load uploaded PYQs", e);
      }
    }
  }, []);

  const filteredCards = cards.filter(
    (c) => c.exam.toLowerCase().includes(selectedExam.toLowerCase()) || selectedExam === "ALL"
  );

  return (
    <div className="min-h-screen bg-background p-6 font-sans text-text-primary transition-colors md:p-10">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-black text-slate-950">
              S
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-text-primary">
                SARJOM OFFICIAL PYQ PRACTICE DESK
              </h1>
              <p className="text-xs font-semibold text-primary">
                Structured for Odisha State &amp; Official Exam Papers
              </p>
            </div>
          </div>
          <Link
            href="/pyq"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-slate-950 transition hover:opacity-90"
          >
            Open CBT Console →
          </Link>
        </header>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Select Exam:
          </span>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            aria-label="Select exam"
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-text-primary outline-none focus:border-primary"
          >
            <option value="OPSC ASO">OPSC ASO</option>
            <option value="Odisha Police SI">Odisha Police SI</option>
            <option value="General">General Uploads</option>
          </select>
          <span className="ml-auto text-xs font-semibold text-primary">
            {filteredCards.length} Questions Available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredCards.length === 0 ? (
            <div className="space-y-3 rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="text-sm font-bold text-text-primary">
                No questions found for {selectedExam}.
              </p>
              <p className="text-xs text-text-secondary">
                Upload PDFs from the Admin Panel PYQ Manager to auto-generate cards here instantly.
              </p>
            </div>
          ) : (
            filteredCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-md transition hover:border-primary/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {card.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-background px-2.5 py-0.5 text-[10px] font-bold text-text-secondary">
                      {card.exam}
                    </span>
                    <span className="rounded bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      +{card.marksPerQuestion} / -{card.negativeMark}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-text-primary md:text-base">
                    {card.metadata?.question}
                  </h3>
                  {card.metadata?.question_or && (
                    <p className="text-xs font-semibold text-primary">
                      {card.metadata.question_or}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                  {card.metadata?.options?.map((opt, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 text-xs font-medium ${
                        i === card.metadata.answerIndex
                          ? "border-primary bg-primary/15 font-semibold text-text-primary"
                          : "border-border bg-background text-text-secondary"
                      }`}
                    >
                      <span className="mr-2 font-bold text-primary">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                {card.metadata?.explanation && (
                  <div className="rounded-xl border border-border bg-background p-3 text-[11px] text-text-secondary">
                    <strong className="text-primary">Official Explanation:</strong>{" "}
                    {card.metadata.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}