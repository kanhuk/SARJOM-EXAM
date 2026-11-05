"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl grid place-items-center text-white font-black">S</div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">SARJOM OFFICIAL PYQ PRACTICE DESK</h1>
              <p className="text-xs text-indigo-400 font-semibold">Structured exactly like Odisha Police SI & Official Exam Papers</p>
            </div>
          </div>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all">Back to Admin</Link>
        </header>

        <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Exam:</span>
          <select 
            value={selectedExam} 
            onChange={(e) => setSelectedExam(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl outline-none"
          >
            <option value="OPSC ASO">OPSC ASO</option>
            <option value="Odisha Police SI">Odisha Police SI</option>
            <option value="General">General Uploads</option>
          </select>
          <span className="text-xs text-emerald-400 font-semibold ml-auto">{filteredCards.length} Questions Available</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredCards.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm font-bold text-slate-400">No questions found for {selectedExam}.</p>
              <p className="text-xs text-slate-500">Upload PDFs from the Admin Panel PYQ Manager to auto-generate cards here instantly.</p>
            </div>
          ) : (
            filteredCards.map((card, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/20">{card.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">{card.exam}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">+{card.marksPerQuestion} / -{card.negativeMark}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-bold text-white">{card.metadata?.question}</h3>
                  {card.metadata?.question_or && (
                    <p className="text-xs text-indigo-300 font-semibold">{card.metadata.question_or}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {card.metadata?.options?.map((opt, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border text-xs font-medium ${i === card.metadata.answerIndex ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-slate-800/60 border-slate-700/50 text-slate-300'}`}
                    >
                      <span className="font-bold text-indigo-400 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                    </div>
                  ))}
                </div>

                {card.metadata?.explanation && (
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-indigo-400">Official Explanation:</strong> {card.metadata.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
