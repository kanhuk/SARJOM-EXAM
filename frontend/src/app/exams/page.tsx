"use client";

import "@/app/homepage-premium.css";
import { useState, useMemo } from "react";
import Link from "next/link";

type ExamBlueprint = {
  id: string;
  title: string;
  category: string;
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
    category: "Odisha State Government Exams",
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
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Uniformed Services Staff Selection Commission",
    officialPortal: "https://ousssc.odisha.gov.in/",
    qualification: "Bachelor Degree in any discipline",
    totalMarks: 300,
    stages: ["CBT Written Exam", "PST & PET", "Medical Examination"],
    pattern: [
      { paper: "Paper 1", subject: "General English & Odia Language", questions: 100, marks: 100, duration: "90 Mins", negative: "0.25" },
      { paper: "Paper 2", subject: "General Studies & Reasoning", questions: 200, marks: 200, duration: "180 Mins", negative: "0.25" }
    ],
    markDistribution: [
      { section: "Odia & English", marks: "100", keyTopics: "Grammar, Comprehension, Translation" },
      { section: "GS & Numerical Ability", marks: "200", keyTopics: "Current Events, Polity, Quant, Reasoning" }
    ],
    cutoffs: [
      { year: "2024", ur: "195.0", sebc: "188.5", sc: "165.0", st: "142.0" }
    ]
  },
  {
    id: "opsc-ocs",
    title: "OPSC Odisha Civil Services (OCS)",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree",
    totalMarks: 2000,
    stages: ["Prelims (GS 1 & CSAT)", "Mains (9 Papers)", "Personality Test / Interview"],
    pattern: [
      { paper: "Prelims GS-1", subject: "General Studies", questions: 100, marks: 200, duration: "2 Hours", negative: "0.33" },
      { paper: "Prelims CSAT", subject: "Civil Services Aptitude Test", questions: 80, marks: 200, duration: "2 Hours", negative: "0.33" }
    ],
    markDistribution: [
      { section: "General Studies", marks: "200", keyTopics: "History, Geography, Polity, Economy, Odisha GK" }
    ],
    cutoffs: [
      { year: "2024", ur: "98.5", sebc: "94.0", sc: "82.0", st: "70.5" }
    ]
  },
  {
    id: "upsc-cse",
    title: "UPSC Civil Services Examination (IAS / IPS)",
    category: "UPSC & Central Civil Services",
    conductingBody: "Union Public Service Commission",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduate in any discipline",
    totalMarks: 2025,
    stages: ["Prelims", "Mains", "Interview"],
    pattern: [
      { paper: "GS Paper I", subject: "General Studies", questions: 100, marks: 200, duration: "2 Hours", negative: "0.66" },
      { paper: "GS Paper II (CSAT)", subject: "Aptitude", questions: 80, marks: 200, duration: "2 Hours", negative: "0.66" }
    ],
    markDistribution: [
      { section: "General Studies", marks: "200", keyTopics: "History, Polity, Economy, Environment, IR" }
    ],
    cutoffs: [
      { year: "2024", ur: "93.0", sebc: "89.0", sc: "77.0", st: "74.0" }
    ]
  },
  {
    id: "cuet-pg-eco",
    title: "CUET PG Economics (COQP10)",
    category: "CUET PG & University Entrance",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
    qualification: "Bachelor Degree in Economics / Relevant Field",
    totalMarks: 400,
    stages: ["Computer Based Test (CBT)"],
    pattern: [
      { paper: "Core Paper", subject: "Micro, Macro, Development & Indian Economy", questions: 100, marks: 400, duration: "105 Mins", negative: "1.0" }
    ],
    markDistribution: [
      { section: "Micro & Macro Economics", marks: "200", keyTopics: "Consumer Theory, Income Determination, Monetary Economics" }
    ],
    cutoffs: [
      { year: "2024", ur: "210", sebc: "185", sc: "140", st: "120" }
    ]
  },
  {
    id: "ugc-net-econ",
    title: "UGC NET Economics JRF",
    category: "CUET PG & University Entrance",
    conductingBody: "NTA & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Economics",
    totalMarks: 300,
    stages: ["Paper 1 (Teaching & Research)", "Paper 2 (Economics Subject)"],
    pattern: [
      { paper: "Paper 1", subject: "Teaching & Research Aptitude", questions: 50, marks: 100, duration: "1 Hour", negative: "0" },
      { paper: "Paper 2", subject: "Economics", questions: 100, marks: 200, duration: "2 Hours", negative: "0" }
    ],
    markDistribution: [
      { section: "Economics Core", marks: "200", keyTopics: "Micro, Macro, Public Finance, International Trade, Statistics" }
    ],
    cutoffs: [
      { year: "2024", ur: "182 (JRF)", sebc: "170 (JRF)", sc: "154 (JRF)", st: "148 (JRF)" }
    ]
  },
  {
    id: "ssc-cgl",
    title: "SSC CGL (Combined Graduate Level)",
    category: "Staff Selection Commission (SSC)",
    conductingBody: "Staff Selection Commission",
    officialPortal: "https://ssc.nic.in",
    qualification: "Bachelor Degree",
    totalMarks: 390,
    stages: ["Tier-I (CBT)", "Tier-II (CBT & Typing)"],
    pattern: [
      { paper: "Tier-I", subject: "Reasoning, Quant, English, GA", questions: 100, marks: 200, duration: "60 Mins", negative: "0.50" }
    ],
    markDistribution: [
      { section: "Quant & Reasoning", marks: "100", keyTopics: "Arithmetic, Advanced Math, Logical Reasoning" }
    ],
    cutoffs: [
      { year: "2024", ur: "153.0", sebc: "148.0", sc: "135.0", st: "125.0" }
    ]
  },
  {
    id: "ibps-po",
    title: "IBPS PO / Management Trainee",
    category: "Banking, Insurance & Regulatory Bodies",
    conductingBody: "Institute of Banking Personnel Selection",
    officialPortal: "https://ibps.in",
    qualification: "Graduation",
    totalMarks: 225,
    stages: ["Prelims", "Mains", "Interview"],
    pattern: [
      { paper: "Prelims", subject: "English, Quant, Reasoning", questions: 100, marks: 100, duration: "60 Mins", negative: "0.25" }
    ],
    markDistribution: [
      { section: "Quantitative & Reasoning", marks: "70", keyTopics: "Data Interpretation, Puzzles, Number Series" }
    ],
    cutoffs: [
      { year: "2024", ur: "54.25", sebc: "54.25", sc: "48.0", st: "42.5" }
    ]
  },
  {
    id: "rrb-ntpc",
    title: "RRB NTPC (Non-Technical Popular Categories)",
    category: "Railway Recruitment Board (RRB)",
    conductingBody: "Ministry of Railways",
    officialPortal: "https://rrbcdg.gov.in",
    qualification: "12th Pass or Graduation",
    totalMarks: 120,
    stages: ["CBT 1", "CBT 2", "Typing / Skill Test"],
    pattern: [
      { paper: "CBT 1", subject: "Maths, Reasoning, General Awareness", questions: 100, marks: 100, duration: "90 Mins", negative: "0.33" }
    ],
    markDistribution: [
      { section: "General Awareness", marks: "50", keyTopics: "Static GK, Current Affairs, Science, History" }
    ],
    cutoffs: [
      { year: "2024", ur: "72.0", sebc: "68.0", sc: "58.0", st: "52.0" }
    ]
  }
];

export default function ExamsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Odisha State Government Exams", "UPSC & Central Civil Services", "CUET PG & University Entrance", "Staff Selection Commission (SSC)", "Banking, Insurance & Regulatory Bodies", "Railway Recruitment Board (RRB)"];

  const filteredExams = useMemo(() => {
    return examDirectory.filter((exam) => {
      const matchesCategory = selectedCategory === "All" || exam.category === selectedCategory;
      const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4 shadow-md">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="text-emerald-400 text-sm font-semibold hover:underline mb-2 inline-block">← Back to Home</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Examination Blueprints & Syllabus Hub</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Explore comprehensive exam patterns, mark distribution, cutoffs, and selection stages for Odisha State, Central, Banking, Railways, and CUET PG exams.
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <input
            type="text"
            placeholder="Search exams or conducting body..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {filteredExams.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium">No matching exams found.</p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">{exam.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-3">{exam.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{exam.conductingBody}</p>
                  
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <p><strong>Qualification:</strong> {exam.qualification}</p>
                    <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                    <p><strong>Stages:</strong> {exam.stages.join(" → ")}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a href={exam.officialPortal} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-semibold hover:underline">
                    Official Website ↗
                  </a>
                  <Link href={`/exams/${exam.id}`} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                    View Blueprint & PYQs →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
