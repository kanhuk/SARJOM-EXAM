"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Search, ArrowLeft, ArrowRight, Sparkles, X, CheckCircle2 } from "lucide-react";

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
    id: "ossc-cgl-specialist",
    title: "OSSC CGL Specialist 2025 (Exam: 30/11/2026)",
    category: "Odisha State Competitive Exams",
    conductingBody: "Odisha Staff Selection Commission (OSSC)",
    officialPortal: "https://ossc.gov.in/Public/Pages/Login.aspx",
    qualification: "Graduation / Specialist Qualification",
    totalMarks: 150,
    status: "Admit Card Out • Exam 30/11/2026",
    stages: ["Preliminary Exam (30/11/2026)", "Main Examination", "Document Verification"],
    hasPyq: true
  },
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
    conductingBody: "Odisha Uniformed Services Commission",
    officialPortal: "https://ousssc.odisha.gov.in/",
    qualification: "Bachelor Degree",
    totalMarks: 300,
    status: "Notification Out",
    stages: ["CBT Exam", "PST & PET"],
    hasPyq: true
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
    id: "upsc-cse",
    title: "UPSC Civil Services Examination (IAS / IPS)",
    category: "UPSC & Central Civil Services",
    conductingBody: "Union Public Service Commission",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduate in any discipline",
    totalMarks: 2025,
    status: "Prelims Active",
    stages: ["Prelims", "Mains", "Interview"],
    hasPyq: true
  },
  {
    id: "cuet-pg-eco",
    title: "CUET PG Economics (COQP10)",
    category: "CUET PG & University Entrance",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
    qualification: "Bachelor Degree in Economics",
    totalMarks: 400,
    status: "Admissions Open",
    stages: ["Computer Based Test"],
    hasPyq: true
  },
  {
    id: "ugc-net-econ",
    title: "UGC NET Economics JRF",
    category: "CUET PG & University Entrance",
    conductingBody: "NTA & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Economics",
    totalMarks: 300,
    status: "Cycle Active",
    stages: ["Paper 1", "Paper 2"],
    hasPyq: true
  },
  {
    id: "ssc-cgl",
    title: "SSC CGL (Combined Graduate Level)",
    category: "Staff Selection Commission (SSC)",
    conductingBody: "Staff Selection Commission",
    officialPortal: "https://ssc.nic.in",
    qualification: "Bachelor Degree",
    totalMarks: 390,
    status: "Tier-1 Active",
    stages: ["Tier-I", "Tier-II"],
    hasPyq: true
  },
  {
    id: "ibps-po",
    title: "IBPS PO / Management Trainee",
    category: "Banking, Insurance & Regulatory Bodies",
    conductingBody: "Institute of Banking Personnel Selection",
    officialPortal: "https://ibps.in",
    qualification: "Graduation",
    totalMarks: 225,
    status: "Mains Active",
    stages: ["Prelims", "Mains", "Interview"],
    hasPyq: false
  },
  {
    id: "rrb-ntpc",
    title: "RRB NTPC (Non-Technical Popular Categories)",
    category: "Railway Recruitment Board (RRB)",
    conductingBody: "Ministry of Railways",
    officialPortal: "https://rrbcdg.gov.in",
    qualification: "12th Pass or Graduation",
    totalMarks: 120,
    status: "CBT Scheduled",
    stages: ["CBT 1", "CBT 2"],
    hasPyq: false
  }
];

export default function ExamsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredExams = useMemo(() => {
    return examDirectory.filter((exam) => {
      const matchesCategory = selectedCategory === "All" || exam.category === selectedCategory;
      const matchesSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePyqClick = (exam: ExamBlueprint) => {
    if (exam.hasPyq) {
      window.location.href = `/pyq?exam=${encodeURIComponent(exam.title)}`;
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
    <div className="min-h-screen bg-background pb-24 text-text-primary transition-colors">
      <div className="relative overflow-hidden border-b border-border bg-surface/80 px-4 py-14 shadow-sm sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,217,165,0.12),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-primary transition hover:bg-primary/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO HOME DASHBOARD</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Examination Blueprints &amp; Master Directory
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Explore meticulously verified exam patterns, marking schemes, historic cutoffs, and selection stages for Odisha State, Central, and National recruitment.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-xs font-semibold text-text-primary">
                {examDirectory.length} Master Exams Tracked
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-text-primary">
                Verified CBT Patterns &amp; PYQs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-md md:flex-row">
          <div className="relative w-full md:w-[420px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search exams, boards, or bodies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by exam category"
              className="w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 md:w-auto"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-surface py-20 text-center">
              <p className="font-medium text-text-secondary">
                No matching examinations found in this category.
              </p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <motion.div
                key={exam.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {exam.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-primary">
                        {exam.status}
                      </span>
                      <span className="text-xs font-semibold text-text-secondary">
                        Marks: {exam.totalMarks}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-text-primary transition-colors group-hover:text-primary">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-primary">
                    {exam.conductingBody}
                  </p>

                  <div className="mt-4 space-y-2 rounded-xl border border-border bg-background/80 p-4 text-xs">
                    <p className="flex items-center justify-between gap-2">
                      <span className="text-text-secondary">Eligibility:</span>
                      <span className="text-right font-semibold text-text-primary">
                        {exam.qualification}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="text-text-secondary">Selection Stages:</span>
                      <span
                        className="max-w-[180px] truncate text-right font-semibold text-primary"
                        title={exam.stages.join(" → ")}
                      >
                        {exam.stages.join(" → ")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <Link
                    href={`/exams/details?id=${exam.id}`}
                    className="flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2.5 text-center text-xs font-bold text-text-primary transition hover:border-primary hover:text-primary"
                  >
                    Exam Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handlePyqClick(exam)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-extrabold text-slate-950 shadow-sm transition hover:opacity-90"
                  >
                    <span>Practice PYQs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-text-primary shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary transition hover:bg-background hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 text-center">
              <span className="rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-xs font-bold uppercase text-warning">
                Service Notice
              </span>
              <h3 className="mt-3 text-xl font-extrabold text-text-primary">
                PYQ Practice Not Available
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Verified PYQ sets for <strong className="text-primary">{selectedExamTitle}</strong> are currently under preparation by our academic team.
              </p>
            </div>

            {requestSubmitted ? (
              <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Request Received Successfully</span>
                </p>
                <p className="text-xs text-text-secondary">
                  We will notify you at <strong className="text-text-primary">{userEmail}</strong> as soon as the test papers are published.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-3 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-slate-950"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aspirant@exam.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    Drop a Request / Specific Paper Needed
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Please add 2023 and 2024 question sets..."
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold text-slate-950 shadow-sm transition hover:opacity-90"
                >
                  <span>Submit Priority Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}