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
  status: string;
  stages: string[];
  hasPyq: boolean;
};

const examDirectory: ExamBlueprint[] = [
  {
    id: "nda-na",
    title: "NDA & NA (National Defence Academy)",
    category: "Defence & Uniformed Services",
    conductingBody: "Union Public Service Commission (UPSC)",
    officialPortal: "https://upsc.gov.in",
    qualification: "12th Class Pass",
    totalMarks: 900,
    status: "Applications Open",
    stages: ["Written Examination", "SSB Interview", "Medical Examination"],
    hasPyq: true
  },
  {
    id: "cds",
    title: "CDS (Combined Defence Services)",
    category: "Defence & Uniformed Services",
    conductingBody: "Union Public Service Commission (UPSC)",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduation",
    totalMarks: 300,
    status: "Notification Active",
    stages: ["Written Examination", "SSB Interview", "Medical Board"],
    hasPyq: false
  },
  {
    id: "agniveer-vayu-army",
    title: "Agniveer Vayu / Army / Navy Recruitment",
    category: "Defence & Uniformed Services",
    conductingBody: "Ministry of Defence / Indian Armed Forces",
    officialPortal: "https://agnipathvayu.cdac.in",
    qualification: "10th / 12th Pass",
    totalMarks: 100,
    status: "Active Recruitment",
    stages: ["Online CEE", "Physical Fitness Test", "Medical Exam"],
    hasPyq: false
  },
  {
    id: "gate",
    title: "GATE (Graduate Aptitude Test in Engineering)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "Indian Institute of Science (IISc) & IITs",
    officialPortal: "https://gate2026.iisc.ac.in",
    qualification: "Bachelor Degree in Engineering",
    totalMarks: 100,
    status: "Registration Open",
    stages: ["Computer Based Test (CBT)"],
    hasPyq: true
  },
  {
    id: "ojee",
    title: "OJEE (Odisha Joint Entrance Examination)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "OJEE Committee, Government of Odisha",
    officialPortal: "https://ojee.nic.in",
    qualification: "12th / Diploma / Graduate",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Computer Based Test (CBT)", "Counseling"],
    hasPyq: false
  },
  {
    id: "neet-ug",
    title: "NEET UG (Medical Entrance Examination)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://neet.nta.nic.in",
    qualification: "12th Pass with PCB",
    totalMarks: 720,
    status: "Cycle Active",
    stages: ["OMR Test", "Counseling"],
    hasPyq: false
  },
  {
    id: "central-university-bed",
    title: "Central University B.Ed Entrance (CUET B.Ed)",
    category: "Teaching & Education Exams",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Computer Based Test (CBT)", "Counseling"],
    hasPyq: false
  },
  {
    id: "ctet",
    title: "Central Teacher Eligibility Test (CTET)",
    category: "Teaching & Education Exams",
    conductingBody: "Central Board of Secondary Education (CBSE)",
    officialPortal: "https://ctet.nic.in",
    qualification: "Senior Secondary / Graduation with B.Ed",
    totalMarks: 150,
    status: "Applications Open",
    stages: ["Paper I", "Paper II"],
    hasPyq: true
  },
  {
    id: "kvs-nvs-recruitment",
    title: "KVS & NVS Teacher Recruitment (PRT / TGT / PGT)",
    category: "Teaching & Education Exams",
    conductingBody: "Kendriya Vidyalaya Sangathan & Navodaya Samiti",
    officialPortal: "https://kvsangathan.nic.in",
    qualification: "Graduation / Post Graduation with B.Ed",
    totalMarks: 180,
    status: "Notification Expected",
    stages: ["CBT Written Exam", "Interview"],
    hasPyq: false
  },
  {
    id: "odisha-junior-regular-teacher",
    title: "Odisha Junior & Regular Teacher Recruitment",
    category: "Teaching & Education Exams",
    conductingBody: "Odisha Sub-ordinate Staff Selection Commission",
    officialPortal: "https://osssc.gov.in",
    qualification: "+2 CT / Graduation with B.Ed & OTET",
    totalMarks: 150,
    status: "Active Recruitment",
    stages: ["CBRE Exam"],
    hasPyq: false
  },
  {
    id: "ugc-net-education",
    title: "UGC NET Education JRF",
    category: "Teaching & Education Exams",
    conductingBody: "National Testing Agency (NTA) & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Education (M.Ed)",
    totalMarks: 300,
    status: "Cycle Active",
    stages: ["Paper 1", "Paper 2"],
    hasPyq: true
  },
  {
    id: "ignou-bed-entrance",
    title: "IGNOU B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Indira Gandhi National Open University",
    officialPortal: "https://ignou.ac.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["Entrance Test", "Counseling"],
    hasPyq: false
  },
  {
    id: "odisha-ct-deled",
    title: "Odisha CT / D.El.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Directorate of Teacher Education, Odisha",
    officialPortal: "https://samsodisha.gov.in",
    qualification: "12th with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["CBT Test", "Counseling"],
    hasPyq: false
  },
  {
    id: "odisha-bed-entrance",
    title: "Odisha B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Higher Education Department, Odisha",
    officialPortal: "https://samsodisha.gov.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["CBT Test", "Counseling"],
    hasPyq: true
  },
  {
    id: "odisha-osstet",
    title: "Odisha Secondary School Teacher Eligibility Test",
    category: "Teaching & Education Exams",
    conductingBody: "Board of Secondary Education (BSE), Odisha",
    officialPortal: "https://bseodisha.ac.in",
    qualification: "Graduation with B.Ed",
    totalMarks: 150,
    status: "Notification Expected",
    stages: ["Written Examination"],
    hasPyq: false
  },
  {
    id: "opsc-ag-aso",
    title: "OPSC Assistant Section Officer (Advocate General)",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Written Exam", "Skill Test"],
    hasPyq: true
  },
  {
    id: "odisha-police-si",
    title: "Odisha Police Sub Inspector",
    category: "Odisha State Government Exams",
<<<<<<< HEAD
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
=======
    conductingBody: "Odisha Uniformed Services Commission",
    officialPortal: "https://ousssc.odisha.gov.in/",
    qualification: "Bachelor Degree",
    totalMarks: 300,
    status: "Notification Out",
    stages: ["CBT Exam", "PST & PET"],
    hasPyq: false
  },
  {
    id: "opsc-ocs",
    title: "OPSC Odisha Civil Services (OCS)",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree",
    totalMarks: 2000,
    status: "Exam Calendar Active",
    stages: ["Prelims", "Mains", "Interview"],
    hasPyq: true
  },
  {
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
    id: "upsc-cse",
    title: "UPSC Civil Services Examination (IAS / IPS)",
    category: "UPSC & Central Civil Services",
    conductingBody: "Union Public Service Commission",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduate in any discipline",
    totalMarks: 2025,
<<<<<<< HEAD
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
=======
    status: "Prelims Active",
    stages: ["Prelims", "Mains", "Interview"],
    hasPyq: true
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  },
  {
    id: "cuet-pg-eco",
    title: "CUET PG Economics (COQP10)",
    category: "CUET PG & University Entrance",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
<<<<<<< HEAD
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
=======
    qualification: "Bachelor Degree in Economics",
    totalMarks: 400,
    status: "Admissions Open",
    stages: ["Computer Based Test"],
    hasPyq: true
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  },
  {
    id: "ugc-net-econ",
    title: "UGC NET Economics JRF",
    category: "CUET PG & University Entrance",
    conductingBody: "NTA & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Economics",
    totalMarks: 300,
<<<<<<< HEAD
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
=======
    status: "Cycle Active",
    stages: ["Paper 1", "Paper 2"],
    hasPyq: true
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  },
  {
    id: "ssc-cgl",
    title: "SSC CGL (Combined Graduate Level)",
    category: "Staff Selection Commission (SSC)",
    conductingBody: "Staff Selection Commission",
    officialPortal: "https://ssc.nic.in",
    qualification: "Bachelor Degree",
    totalMarks: 390,
<<<<<<< HEAD
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
=======
    status: "Tier-1 Active",
    stages: ["Tier-I", "Tier-II"],
    hasPyq: true
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  },
  {
    id: "ibps-po",
    title: "IBPS PO / Management Trainee",
    category: "Banking, Insurance & Regulatory Bodies",
    conductingBody: "Institute of Banking Personnel Selection",
    officialPortal: "https://ibps.in",
    qualification: "Graduation",
    totalMarks: 225,
<<<<<<< HEAD
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
=======
    status: "Mains Active",
    stages: ["Prelims", "Mains", "Interview"],
    hasPyq: false
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  },
  {
    id: "rrb-ntpc",
    title: "RRB NTPC (Non-Technical Popular Categories)",
    category: "Railway Recruitment Board (RRB)",
    conductingBody: "Ministry of Railways",
    officialPortal: "https://rrbcdg.gov.in",
    qualification: "12th Pass or Graduation",
    totalMarks: 120,
<<<<<<< HEAD
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
=======
    status: "CBT Scheduled",
    stages: ["CBT 1", "CBT 2"],
    hasPyq: false
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
  }
];

export default function ExamsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< HEAD

  const categories = ["All", "Odisha State Government Exams", "UPSC & Central Civil Services", "CUET PG & University Entrance", "Staff Selection Commission (SSC)", "Banking, Insurance & Regulatory Bodies", "Railway Recruitment Board (RRB)"];
=======
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExamTitle, setSelectedExamTitle] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const categories = [
    "All",
    "Odisha State Government Exams",
    "Teaching & Education Exams",
    "Defence & Uniformed Services",
    "Engineering, Technical & Medical / PSUs",
    "UPSC & Central Civil Services",
    "CUET PG & University Entrance",
    "Staff Selection Commission (SSC)",
    "Banking, Insurance & Regulatory Bodies",
    "Railway Recruitment Board (RRB)"
  ];
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)

  const filteredExams = useMemo(() => {
    return examDirectory.filter((exam) => {
      const matchesCategory = selectedCategory === "All" || exam.category === selectedCategory;
      const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
<<<<<<< HEAD

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4 shadow-md">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="text-emerald-400 text-sm font-semibold hover:underline mb-2 inline-block">← Back to Home</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Examination Blueprints & Syllabus Hub</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Explore comprehensive exam patterns, mark distribution, cutoffs, and selection stages for Odisha State, Central, Banking, Railways, and CUET PG exams.
=======

  const handlePyqClick = (exam: ExamBlueprint) => {
    if (exam.hasPyq) {
      window.location.href = `/pyq?exam=${exam.id}`;
    } else {
      setSelectedExamTitle(exam.title);
      setRequestSubmitted(false);
      setUserEmail("");
      setUserMsg("");
      setModalOpen(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 selection:bg-emerald-500 selection:text-slate-950">
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800/80 to-slate-900 py-20 px-4 border-b border-emerald-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-400 bg-emerald-950/90 px-4 py-2 rounded-full border border-emerald-500/30 mb-6 hover:bg-emerald-900 transition-all duration-300 shadow-lg">
            <span>←</span> BACK TO HOME DASHBOARD
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
            Examination Blueprints & Master Directory
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explore meticulously verified exam patterns, marking schemes, historic cutoffs, and selection stages for Odisha State, Central, and National recruitment.
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
          </p>
        </div>
      </div>

<<<<<<< HEAD
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
=======
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-slate-800/90 border border-slate-700 px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-200 font-semibold">24 Master Exams Tracked</span>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-5 py-2.5 rounded-2xl shadow-md">
              <span className="text-xs text-slate-200 font-semibold">⚡ Verified CBT Patterns & PYQs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/80">
          <div className="relative w-full md:w-[420px]">
            <input
              type="text"
              placeholder="🔍 Search exams, boards, or bodies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-sm text-white placeholder-slate-400 transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-inner"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredExams.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
              <p className="text-slate-300 font-medium">No matching examinations found in this category.</p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <div 
                key={exam.id} 
                className="group bg-slate-800/85 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_15px_40px_rgb(16,185,129,0.18)] flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-500/30">
                      {exam.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-900 text-emerald-300 rounded-lg border border-emerald-500/20">
                        {exam.status}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">Marks: {exam.totalMarks}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 group-hover:text-emerald-300 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium mt-1">{exam.conductingBody}</p>
                  
                  <div className="mt-4 space-y-2 text-xs text-slate-200 bg-slate-900/90 p-4 rounded-xl border border-slate-700/70">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Eligibility:</span>
                      <span className="font-medium text-slate-100 text-right">{exam.qualification}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Selection Stages:</span>
                      <span className="font-medium text-emerald-400 text-right truncate max-w-[180px]" title={exam.stages.join(" → ")}>
                        {exam.stages.join(" → ")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/80 grid grid-cols-2 gap-3">
                  <Link 
                    href={`/exams/details?id=${exam.id}`} 
                    className="py-2.5 px-3 bg-slate-900 hover:bg-slate-950 text-emerald-400 font-bold rounded-xl text-xs transition-all text-center border border-emerald-500/30 flex items-center justify-center gap-1 active:scale-95 shadow-inner"
                  >
                    <span>Exam Details</span>
                  </Link>
                  <button 
                    onClick={() => handlePyqClick(exam)}
                    className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Practice PYQs</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs uppercase px-3 py-1 bg-amber-950 text-amber-400 rounded-full font-bold border border-amber-500/30">
                Service Notice
              </span>
              <h3 className="text-xl font-extrabold text-white mt-3">PYQ Practice Not Available</h3>
              <p className="text-xs text-slate-300 mt-1">
                Verified PYQ sets for <strong className="text-emerald-400">{selectedExamTitle}</strong> are currently under preparation by our academic team.
              </p>
            </div>

            {requestSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2">
                <p className="text-sm font-bold text-emerald-300">✅ Request Received Successfully!</p>
                <p className="text-xs text-slate-300">We will notify you at <strong className="text-white">{userEmail}</strong> as soon as the test papers are published.</p>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="mt-3 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="aspirant@exam.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Drop a Request / Specific Paper Needed</label>
                  <textarea 
                    rows={3}
                    placeholder="E.g., Please add 2023 and 2024 question sets..."
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Submit Priority Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
>>>>>>> 6418c45 (Update exam directory and add cutoff details page)
    </div>
  );
}
