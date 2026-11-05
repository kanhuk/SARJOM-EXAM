"use client";

import "@/app/homepage-premium.css";
import { useState } from "react";
import Link from "next/link";

type ExamBlueprint = {
  id: string;
  title: string;
  conductingBody: string;
  officialPortal: string;
  qualification: string;
  totalMarks: number;
  stages: string[];
  pattern: {
    paper: string;
    subject: string;
    questions: number;
    marks: number;
    duration: string;
    negative: string;
  }[];
  markDistribution: {
    section: string;
    marks: string;
    keyTopics: string;
  }[];
  cutoffs: {
    year: string;
    ur: string;
    sebc: string;
    sc: string;
    st: string;
  }[];
};

const examDirectory: ExamBlueprint[] = [
  {
    id: "opsc-ag-aso",
    title: "OPSC Assistant Section Officer (Advocate General)",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree in any discipline",
    totalMarks: 400,
    stages: ["Written Examination", "Skill Test"],
    pattern: [
      { paper: "Paper-1", subject: "General Awareness", questions: 100, marks: 100, duration: "2 Hours", negative: "0.25" },
      { paper: "Paper-2", subject: "Reasoning & Mathematics", questions: 100, marks: 100, duration: "2 Hours", negative: "0.25" },
      { paper: "Paper-3", subject: "English & Odia Language", questions: 200, marks: 200, duration: "2.5 Hours", negative: "0.25" }
    ],
    markDistribution: [
      { section: "General Awareness", marks: "100", keyTopics: "Current Affairs, Polity, History, Geography" },
      { section: "Reasoning & Math", marks: "100", keyTopics: "Mental Ability, Quantitative Aptitude" },
      { section: "Language Core", marks: "200", keyTopics: "English & Odia Grammar, Comprehension" }
    ],
    cutoffs: [
      { year: "2025", ur: "282.7", sebc: "-", sc: "243.2", st: "204.0" }
    ]
  },
  {
    id: "odisha-police-si",
    title: "Odisha Police Sub Inspector",
    conductingBody: "Odisha Uniformed Services Staff Selection Commission (OUSSSC)",
    officialPortal: "https://ousssc.odisha.gov.in/",
    qualification: "Bachelor Degree in any discipline from a recognized University",
    totalMarks: 300,
    stages: [
      "Stage 1: Computer Based Written Examination (CBT)",
      "Stage 2: Physical Standard Measurement (PST)",
      "Stage 3: Physical Efficiency Test (PET - 1.6 KM Run & Long Jump)",
      "Stage 4: Document Verification & Medical Examination",
    ],
    pattern: [
      {
        paper: "Paper 1",
        subject: "General English & Odia Language",
        questions: 100,
        marks: 100,
        duration: "90 Minutes",
        negative: "0.25 Mark per incorrect answer",
      },
      {
        paper: "Paper 2",
        subject: "General Studies, Reasoning & Numerical Ability",
        questions: 200,
        marks: 200,
        duration: "180 Minutes",
        negative: "0.25 Mark per incorrect answer",
      },
    ],
    markDistribution: [
      {
        section: "Paper 1: Odia Language",
        marks: "50 Marks (50 Qs)",
        keyTopics: "Comprehension of Odia Passage, Odia Grammar (Sandhi, Samasa, Krupanna, Bisesya/Bisesana), Vocabulary, Idioms and Phrases (Rudhi & Lokabani), Translation from English to Odia.",
      },
      {
        section: "Paper 1: General English",
        marks: "50 Marks (50 Qs)",
        keyTopics: "Comprehension of Unseen Passages, Grammar (Tenses, Articles, Prepositions, Subject-Verb Agreement), Vocabulary (Synonyms, Antonyms, One-word substitution), Sentence Correction, Paragraph Completion.",
      },
      {
        section: "Paper 2: General Science & Environment",
        marks: "25-30 Marks",
        keyTopics: "Everyday Science, Physics & Chemistry basics in daily life, Biology, Ecology, Environmental pollution, Renewable Energy & Climate changes.",
      },
      {
        section: "Paper 2: Current Affairs & Events",
        marks: "25-30 Marks",
        keyTopics: "National & International Events, Government Policies, Awards, Sports, Defense developments, Summits & Odisha Specific Current Schemes.",
      },
      {
        section: "Paper 2: History & Odisha Heritage",
        marks: "25-30 Marks",
        keyTopics: "Ancient, Medieval & Modern Indian History, Indian National Movement, Dynastic History of Odisha (Ganga, Gajapati, Kharavela), Paika Rebellion, 1857 in Odisha, Creation of Odisha Province.",
      },
      {
        section: "Paper 2: Geography of India & Odisha",
        marks: "20-25 Marks",
        keyTopics: "Physiographic divisions of India, River systems, Climate & Monsoon, Natural Resources, Mineral distribution in Odisha, Soil & Forests of Odisha.",
      },
      {
        section: "Paper 2: Indian Polity & Governance",
        marks: "25-30 Marks",
        keyTopics: "Constitution of India, Fundamental Rights & Duties, Preamble, Parliament, State Legislature, Judiciary, Panchayati Raj Institutions, Local Governance in Odisha.",
      },
      {
        section: "Paper 2: Indian Economy & Social Development",
        marks: "15-20 Marks",
        keyTopics: "Economic planning, NITI Aayog, Inflation, Poverty & Unemployment, Inclusive Growth, Banking system in India, Odisha Budget & Welfare programs.",
      },
      {
        section: "Paper 2: Numerical Ability & Arithmetic",
        marks: "25-30 Marks",
        keyTopics: "Number System, HCF & LCM, Percentages, Profit & Loss, Simple & Compound Interest, Ratio & Proportion, Time & Work, Speed, Time & Distance, Mensuration (Class X standard).",
      },
      {
        section: "Paper 2: Mental Ability & Logical Reasoning",
        marks: "15-20 Marks",
        keyTopics: "Analogies, Classification, Series (Number & Alphabet), Coding-Decoding, Blood Relations, Direction Sense Test, Syllogisms, Non-Verbal Venn Diagrams.",
      },
      {
        section: "Paper 2: Basic Computer Literacy",
        marks: "15-20 Marks",
        keyTopics: "Computer Fundamentals, Operating Systems, MS Office suite (Word, Excel, PowerPoint), Internet & Email protocols, Cybersecurity basics, Networking fundamentals.",
      },
    ],
    cutoffs: [
      { year: "2023 Cycle", ur: "Male 172.80 | Female 102.22", sebc: "Male 182.73 | Female 147.65", sc: "Male 125.33 | Female 101.89", st: "Male 123.29 | Female 101.67" },
      { year: "2019 Cycle", ur: "Male 283.41 | Female 170.15", sebc: "Male 275.50 | Female 160.96", sc: "Male 185.00 | Female 131.63", st: "Male 152.00 | Female 111.47" },
      { year: "2018 Cycle", ur: "Male 186.50 | Female 148.96", sebc: "Male 182.00 | Female 144.10", sc: "Male 148.96 | Female 112.50", st: "Male 139.71 | Female 103.06" },
    ],
  },
  {
    id: "ugc-net",
    title: "UGC NET",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://ugcnet.nta.ac.in",
    qualification: "Master Degree with minimum 55% marks (50% for reserved categories)",
    totalMarks: 300,
    stages: ["Single-Session Computer Based Test (CBT)"],
    pattern: [
      {
        paper: "Paper 1",
        subject: "General Teaching & Research Aptitude",
        questions: 50,
        marks: 100,
        duration: "Composite 180 Minutes (Combined)",
        negative: "No Negative Marking (+2 per correct)",
      },
      {
        paper: "Paper 2",
        subject: "Subject Discipline (Economics, Commerce, English, Pol Science, etc.)",
        questions: 100,
        marks: 200,
        duration: "Composite 180 Minutes (Combined)",
        negative: "No Negative Marking (+2 per correct)",
      },
    ],
    markDistribution: [
      { section: "Unit 1 // Teaching Aptitude", marks: "10 Marks (5 Qs)", keyTopics: "Teaching levels, Learner characteristics, Swayam, Swayamprabha, Evaluation systems" },
      { section: "Unit 2 // Research Aptitude", marks: "10 Marks (5 Qs)", keyTopics: "Positivism & Post-positivism, Types of Research, Methods, Thesis writing, Research ethics" },
      { section: "Unit 3 // Reading Comprehension", marks: "10 Marks (5 Qs)", keyTopics: "Passage analysis, Contextual interpretation, Central idea extraction" },
      { section: "Unit 4 // Communication", marks: "10 Marks (5 Qs)", keyTopics: "Classroom communication, Verbal & Non-verbal types, Intercultural barriers" },
      { section: "Unit 5 // Mathematical Reasoning", marks: "10 Marks (5 Qs)", keyTopics: "Number & letter series, Coding decoding, Fractions, Ratio, Proportion, Percentage" },
      { section: "Unit 6 // Logical Reasoning", marks: "10 Marks (5 Qs)", keyTopics: "Square of Opposition, Categorical syllogisms, Indian Logic (Pramanas, Hetvabhasa)" },
      { section: "Unit 7 // Data Interpretation", marks: "10 Marks (5 Qs)", keyTopics: "Table charts, Bar charts, Pie charts, Percentage & average calculation" },
      { section: "Unit 8 // ICT", marks: "10 Marks (5 Qs)", keyTopics: "ICT abbreviations, Internet, Email, Digital initiatives in higher education" },
      { section: "Unit 9 // People & Environment", marks: "10 Marks (5 Qs)", keyTopics: "MDGs & SDGs, Environmental pollution, Renewable energy, Paris Agreement" },
      { section: "Unit 10 // Higher Education System", marks: "10 Marks (5 Qs)", keyTopics: "Ancient Indian institutions, Post-independence committees, Value education, NEP 2020" },
      { section: "Paper 2 // Core Discipline Domain", marks: "200 Marks (100 Qs)", keyTopics: "10 Subject-specific advanced curriculum units as per official UGC NET syllabus" },
    ],
    cutoffs: [
      { year: "Economics (June 2024)", ur: "JRF: 212 | Asst. Prof: 178", sebc: "JRF: 198 | Asst. Prof: 160", sc: "JRF: 178 | Asst. Prof: 148", st: "JRF: 170 | Asst. Prof: 142" },
      { year: "Commerce (June 2024)", ur: "JRF: 210 | Asst. Prof: 182", sebc: "JRF: 198 | Asst. Prof: 166", sc: "JRF: 182 | Asst. Prof: 154", st: "JRF: 176 | Asst. Prof: 146" },
      { year: "Political Science (Dec 2024)", ur: "JRF: 222 | Asst. Prof: 196", sebc: "JRF: 212 | Asst. Prof: 180", sc: "JRF: 190 | Asst. Prof: 162", st: "JRF: 182 | Asst. Prof: 154" },
    ],
  },
  {
    id: "opsc-aso",
    title: "OPSC Assistant Section Officer",
    conductingBody: "Odisha Public Service Commission",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree in any discipline",
    totalMarks: 400,
    stages: ["Stage 1: Written Examination", "Stage 2: Skill Test in Computer Applications"],
    pattern: [
      { paper: "Paper 1", subject: "General Awareness", questions: 100, marks: 100, duration: "90 Minutes", negative: "0.25 Mark" },
      { paper: "Paper 2", subject: "Test of Reasoning & Mental Ability", questions: 100, marks: 100, duration: "90 Minutes", negative: "0.25 Mark" },
      { paper: "Paper 3", subject: "Mathematics", questions: 100, marks: 100, duration: "90 Minutes", negative: "0.25 Mark" },
      { paper: "Paper 4", subject: "Language: English & Odia", questions: 100, marks: 100, duration: "120 Minutes", negative: "0.25 Mark" },
    ],
    markDistribution: [
      { section: "General Awareness", marks: "100 Marks", keyTopics: "Polity, History, Economy, Environment, Current Affairs" },
      { section: "Language", marks: "100 Marks", keyTopics: "English Grammar 50 Marks, Odia Grammar 50 Marks" },
    ],
    cutoffs: [
      { year: "2022 Cycle", ur: "235 to 245 Marks", sebc: "228 to 238 Marks", sc: "210 to 220 Marks", st: "195 to 205 Marks" },
    ],
  },
];

export default function ExamsPage() {
  const [selectedExamId, setSelectedExamId] = useState<string>("odisha-police-si");

  const currentExam = examDirectory.find((e) => e.id === selectedExamId) || examDirectory[0];

  return (
    <div className="sarjom-viewport">
      <div className="sarjom-canvas pt-6">
        <header className="sarjom-hero-matrix">
          <span className="sarjom-kicker-sm">EXAMINATION BLUEPRINT DIRECTORY</span>
          <h1 className="sarjom-core-heading">
            <span className="sarjom-muted-line">OFFICIAL EXAM STRUCTURES</span>
            <span className="sarjom-electric-text">PATTERN, SYLLABUS & CUTOFF ARCHIVE</span>
          </h1>
          <p className="sarjom-descriptor">
            Standard examination frameworks with exact marking schemes, sectional weightage distribution, and authentic previous cycle cutoff records.
          </p>

          <div className="sarjom-quick-strip mt-6">
            <span className="sarjom-strip-head">CHOOSE DIRECTORY:</span>
            {examDirectory.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedExamId(item.id)}
                className={`sarjom-speed-pill ${selectedExamId === item.id ? "!bg-[#10192D] !text-[#00DDB0]" : ""}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#10192D] p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="sarjom-kicker-sm !text-[#00DDB0]">{currentExam.conductingBody}</span>
              <h2 className="sarjom-core-heading !text-2xl !text-white mt-1">{currentExam.title}</h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Minimum Eligibility: {currentExam.qualification} • Total Aggregate: {currentExam.totalMarks} Marks
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={currentExam.officialPortal}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 font-mono text-xs font-semibold text-slate-300 hover:text-white hover:border-[#00DDB0] transition"
              >
                Official Portal ↗
              </a>
              <Link
                href={`/pyq?exam=${encodeURIComponent(currentExam.title)}`}
                className="rounded-xl bg-[#00DDB0] px-5 py-2.5 font-mono text-xs font-bold text-slate-950 transition hover:bg-[#00f2c3]"
              >
                Practice {currentExam.title} PYQs →
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
              Stage 01 // Examination Pattern & Marking Scheme
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentExam.pattern.map((pat) => (
                <div key={pat.paper} className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#00DDB0]">{pat.paper}</span>
                    <span className="font-mono text-xs text-slate-400">{pat.duration}</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-white">{pat.subject}</h4>
                  <div className="mt-3 flex justify-between font-mono text-xs text-slate-300 border-t border-white/5 pt-2">
                    <span>{pat.questions} Questions</span>
                    <span>{pat.marks} Marks</span>
                    <span className="text-amber-300">{pat.negative}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
              Stage 02 // Official Topic-by-Topic Syllabus & Weightage Breakdown
            </h3>
            <div className="mt-4 space-y-3">
              {currentExam.markDistribution.map((item) => (
                <div
                  key={item.section}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-4"
                >
                  <div className="flex-1 min-w-[280px]">
                    <span className="text-sm font-bold text-white">{item.section}</span>
                    <p className="font-mono text-xs text-slate-400 mt-1 leading-relaxed">{item.keyTopics}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#00DDB0] bg-[#00DDB0]/10 px-3 py-1.5 rounded-md whitespace-nowrap">
                    {item.marks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
              Stage 03 // Official Selection Stages
            </h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {currentExam.stages.map((stg, i) => (
                <div key={stg} className="rounded-lg border border-white/5 bg-slate-950/60 p-3 font-mono text-xs text-slate-300 flex items-center gap-3">
                  <span className="flex-shrink-0 text-[#00DDB0] font-bold">0{i + 1}.</span>
                  <span>{stg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
              Stage 04 // Official Previous Year Cutoff Archives
            </h3>
            <div className="mt-4 space-y-3">
              {currentExam.cutoffs.map((row) => (
                <div key={row.year} className="rounded-xl border border-white/10 bg-slate-900/70 p-5">
                  <span className="font-mono text-xs font-bold text-[#00DDB0]">{row.year}</span>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px]">UR:</span>
                      <span className="text-white font-bold">{row.ur}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px]">SEBC / OBC:</span>
                      <span className="text-white font-bold">{row.sebc}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px]">SC:</span>
                      <span className="text-white font-bold">{row.sc}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[11px]">ST:</span>
                      <span className="text-white font-bold">{row.st}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

