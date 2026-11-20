"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findSyllabusByParam } from "@/lib/syllabusSeo";
import { Suspense } from "react";

const examDetailsData: Record<string, {
  title: string;
  category: string;
  conductingBody: string;
  officialPortal: string;
  qualification: string;
  totalMarks: number;
  status: string;
  stages: string[];
  description: string;
  pattern: { paper: string; subject: string; questions: number; marks: number; duration: string; negative: string; }[];
  cutoffs: { year: string; ur: string; sebc: string; sc: string; st: string; }[];
}> = {
  "ossc-cgl-specialist": {
    title: "OSSC CGL Specialist 2025 (CGLRE Specialist)",
    category: "Odisha State Competitive Exams",
    conductingBody: "Odisha Staff Selection Commission (OSSC)",
    officialPortal: "https://ossc.gov.in/Public/Pages/Login.aspx",
    qualification: "Graduation / Specialist Qualification (Advt No. 5919/OSSC)",
    totalMarks: 150,
    status: "Admit Card Out • Exam Date: 30/11/2026",
    stages: ["Preliminary Examination (30/11/2026)", "Main Examination", "Verification"],
    description: "OSSC CGL Specialist 2025 Preliminary Examination Admit Card is out. Examination is scheduled on 30/11/2026.",
    pattern: [
      { paper: "Prelims", subject: "General Studies, Reasoning, Aptitude & Specialist Subject", questions: 150, marks: 150, duration: "150 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2025", ur: "—", sebc: "—", sc: "—", st: "—" }
    ]
  },
  "nda-na": {
    title: "NDA & NA (National Defence Academy)",
    category: "Defence & Uniformed Services",
    conductingBody: "Union Public Service Commission (UPSC)",
    officialPortal: "https://upsc.gov.in",
    qualification: "12th Class Pass",
    totalMarks: 900,
    status: "Applications Open",
    stages: ["Written Examination", "SSB Interview", "Medical Examination"],
    description: "Premier national defense entrance examination for joining the Army, Navy, and Air Force wings.",
    pattern: [
      { paper: "Paper I", subject: "Mathematics", questions: 120, marks: 300, duration: "150 Mins", negative: "0.83" },
      { paper: "Paper II", subject: "General Ability Test (GAT)", questions: 150, marks: 600, duration: "150 Mins", negative: "1.33" }
    ],
    cutoffs: [
      { year: "2024", ur: "355", sebc: "350", sc: "340", st: "330" },
      { year: "2023", ur: "301", sebc: "295", sc: "282", st: "275" },
      { year: "2022", ur: "360", sebc: "355", sc: "345", st: "338" },
      { year: "2021", ur: "343", sebc: "338", sc: "326", st: "318" },
      { year: "2020", ur: "355", sebc: "350", sc: "342", st: "335" }
    ]
  },
  "cds": {
    title: "CDS (Combined Defence Services)",
    category: "Defence & Uniformed Services",
    conductingBody: "Union Public Service Commission (UPSC)",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduation",
    totalMarks: 300,
    status: "Notification Active",
    stages: ["Written Examination", "SSB Interview", "Medical Board"],
    description: "Conducted for admission to Indian Military Academy, Naval Academy, Air Force Academy, and OTA.",
    pattern: [
      { paper: "Paper I, II, III", subject: "English, General Knowledge, Elementary Mathematics", questions: 340, marks: 300, duration: "6 Hours", negative: "0.33" }
    ],
    cutoffs: [
      { year: "2024", ur: "145 (IMA)", sebc: "140", sc: "130", st: "125" },
      { year: "2023", ur: "136 (IMA)", sebc: "131", sc: "122", st: "118" },
      { year: "2022", ur: "153 (IMA)", sebc: "148", sc: "138", st: "132" },
      { year: "2021", ur: "138 (IMA)", sebc: "132", sc: "124", st: "119" },
      { year: "2020", ur: "143 (IMA)", sebc: "138", sc: "128", st: "122" }
    ]
  },
  "agniveer-vayu-army": {
    title: "Agniveer Vayu / Army / Navy Recruitment",
    category: "Defence & Uniformed Services",
    conductingBody: "Ministry of Defence / Indian Armed Forces",
    officialPortal: "https://agnipathvayu.cdac.in",
    qualification: "10th / 12th Pass",
    totalMarks: 100,
    status: "Active Recruitment",
    stages: ["Online CEE", "Physical Fitness Test", "Medical Exam"],
    description: "Agnipath scheme recruitment drive for induction into the Indian armed forces.",
    pattern: [
      { paper: "Online CEE", subject: "Maths, Physics, English / General Awareness", questions: 100, marks: 100, duration: "60 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "45.0", sebc: "42.0", sc: "38.0", st: "35.0" },
      { year: "2023", ur: "42.5", sebc: "40.0", sc: "35.0", st: "32.0" },
      { year: "2022", ur: "40.0", sebc: "38.0", sc: "33.0", st: "30.0" },
      { year: "2021", ur: "38.0", sebc: "35.0", sc: "30.0", st: "28.0" },
      { year: "2020", ur: "35.0", sebc: "32.0", sc: "28.0", st: "25.0" }
    ]
  },
  "gate": {
    title: "GATE (Graduate Aptitude Test in Engineering)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "Indian Institute of Science (IISc) & IITs",
    officialPortal: "https://gate2026.iisc.ac.in",
    qualification: "Bachelor Degree in Engineering",
    totalMarks: 100,
    status: "Registration Open",
    stages: ["Computer Based Test (CBT)"],
    description: "National level examination testing comprehensive understanding of undergraduate engineering subjects.",
    pattern: [
      { paper: "Core Subject + GA", subject: "General Aptitude & Discipline Core", questions: 65, marks: 100, duration: "180 Mins", negative: "0.33" }
    ],
    cutoffs: [
      { year: "2024", ur: "28.5", sebc: "25.6", sc: "19.0", st: "19.0" },
      { year: "2023", ur: "32.5", sebc: "29.2", sc: "21.6", st: "21.6" },
      { year: "2022", ur: "25.0", sebc: "22.5", sc: "16.6", st: "16.6" },
      { year: "2021", ur: "29.0", sebc: "26.1", sc: "19.3", st: "19.3" },
      { year: "2020", ur: "32.9", sebc: "29.6", sc: "21.9", st: "21.9" }
    ]
  },
  "ojee": {
    title: "OJEE (Odisha Joint Entrance Examination)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "OJEE Committee, Government of Odisha",
    officialPortal: "https://ojee.nic.in",
    qualification: "12th / Diploma / Graduate",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Computer Based Test (CBT)", "Counseling"],
    description: "State level entrance test for admission into professional undergraduate and postgraduate courses in Odisha.",
    pattern: [
      { paper: "Technical Core", subject: "Physics, Chemistry, Mathematics / MCA", questions: 120, marks: 480, duration: "2 Hours", negative: "1.0" }
    ],
    cutoffs: [
      { year: "2024", ur: "75%", sebc: "65%", sc: "45%", st: "30%" },
      { year: "2023", ur: "72%", sebc: "62%", sc: "42%", st: "28%" },
      { year: "2022", ur: "70%", sebc: "60%", sc: "40%", st: "25%" },
      { year: "2021", ur: "68%", sebc: "58%", sc: "38%", st: "22%" },
      { year: "2020", ur: "65%", sebc: "55%", sc: "35%", st: "20%" }
    ]
  },
  "neet-ug": {
    title: "NEET UG (Medical Entrance Examination)",
    category: "Engineering, Technical & Medical / PSUs",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://neet.nta.nic.in",
    qualification: "12th Pass with PCB",
    totalMarks: 720,
    status: "Cycle Active",
    stages: ["OMR Test", "Counseling"],
    description: "National entrance test for admission to undergraduate medical (MBBS) and dental (BDS) courses.",
    pattern: [
      { paper: "Physics, Chemistry, Biology", subject: "Botany, Zoology, Physics, Chemistry", questions: 200, marks: 720, duration: "200 Mins", negative: "1.0" }
    ],
    cutoffs: [
      { year: "2024", ur: "720-164", sebc: "163-129", sc: "163-129", st: "163-129" },
      { year: "2023", ur: "720-137", sebc: "136-107", sc: "136-107", st: "136-107" },
      { year: "2022", ur: "715-117", sebc: "116-93", sc: "116-93", st: "116-93" },
      { year: "2021", ur: "720-138", sebc: "137-108", sc: "137-108", st: "137-108" },
      { year: "2020", ur: "720-147", sebc: "146-113", sc: "146-113", st: "146-113" }
    ]
  },
  "central-university-bed": {
    title: "Central University B.Ed Entrance (CUET B.Ed)",
    category: "Teaching & Education Exams",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Computer Based Test (CBT)", "Counseling"],
    description: "Common entrance examination for admission into B.Ed programs across Central Universities.",
    pattern: [
      { paper: "COQP03 / CUET B.Ed", subject: "General & Domain Specific Knowledge", questions: 100, marks: 400, duration: "105 Mins", negative: "1.0" }
    ],
    cutoffs: [
      { year: "2024", ur: "245.0", sebc: "220.0", sc: "190.0", st: "165.0" },
      { year: "2023", ur: "238.0", sebc: "212.0", sc: "182.0", st: "158.0" },
      { year: "2022", ur: "230.0", sebc: "205.0", sc: "175.0", st: "150.0" },
      { year: "2021", ur: "220.0", sebc: "195.0", sc: "168.0", st: "142.0" },
      { year: "2020", ur: "210.0", sebc: "185.0", sc: "160.0", st: "135.0" }
    ]
  },
  "ctet": {
    title: "Central Teacher Eligibility Test (CTET)",
    category: "Teaching & Education Exams",
    conductingBody: "Central Board of Secondary Education (CBSE)",
    officialPortal: "https://ctet.nic.in",
    qualification: "Senior Secondary / Graduation with B.Ed",
    totalMarks: 150,
    status: "Applications Open",
    stages: ["Paper I", "Paper II"],
    description: "National eligibility test for teachers for central government and affiliated schools.",
    pattern: [
      { paper: "Paper I / II", subject: "Child Development, Languages, Math/Science or Social Studies", questions: 150, marks: 150, duration: "2.5 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2024", ur: "90 (60%)", sebc: "82.5", sc: "82.5", st: "82.5" },
      { year: "2023", ur: "90 (60%)", sebc: "82.5", sc: "82.5", st: "82.5" },
      { year: "2022", ur: "90 (60%)", sebc: "82.5", sc: "82.5", st: "82.5" },
      { year: "2021", ur: "90 (60%)", sebc: "82.5", sc: "82.5", st: "82.5" },
      { year: "2020", ur: "90 (60%)", sebc: "82.5", sc: "82.5", st: "82.5" }
    ]
  },
  "kvs-nvs-recruitment": {
    title: "KVS & NVS Teacher Recruitment (PRT / TGT / PGT)",
    category: "Teaching & Education Exams",
    conductingBody: "Kendriya Vidyalaya Sangathan & Navodaya Samiti",
    officialPortal: "https://kvsangathan.nic.in",
    qualification: "Graduation / Post Graduation with B.Ed",
    totalMarks: 180,
    status: "Notification Expected",
    stages: ["CBT Written Exam", "Interview"],
    description: "Recruitment examination for teachers across KVS and NVS institutions pan-India.",
    pattern: [
      { paper: "Main CBT", subject: "General English, Hindi, Reasoning, Subject Core", questions: 180, marks: 180, duration: "3 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2023", ur: "135.0", sebc: "127.0", sc: "121.0", st: "103.0" },
      { year: "2022", ur: "128.0", sebc: "120.0", sc: "114.0", st: "98.0" },
      { year: "2021", ur: "122.0", sebc: "115.0", sc: "108.0", st: "92.0" },
      { year: "2020", ur: "118.0", sebc: "110.0", sc: "104.0", st: "88.0" },
      { year: "2019", ur: "115.0", sebc: "107.0", sc: "100.0", st: "85.0" }
    ]
  },
  "odisha-junior-regular-teacher": {
    title: "Odisha Junior & Regular Teacher Recruitment",
    category: "Teaching & Education Exams",
    conductingBody: "Odisha Sub-ordinate Staff Selection Commission",
    officialPortal: "https://osssc.gov.in",
    qualification: "+2 CT / Graduation with B.Ed & OTET",
    totalMarks: 150,
    status: "Active Recruitment",
    stages: ["CBRE Exam"],
    description: "State-level teacher recruitment drive for primary and upper primary schools across Odisha.",
    pattern: [
      { paper: "Single Paper", subject: "Language, General Awareness, Reasoning, Pedagogy", questions: 150, marks: 150, duration: "2.5 Hours", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "98.5", sebc: "92.0", sc: "81.0", st: "68.5" },
      { year: "2023", ur: "94.0", sebc: "88.0", sc: "76.0", st: "64.0" },
      { year: "2022", ur: "90.0", sebc: "84.0", sc: "72.0", st: "60.0" },
      { year: "2021", ur: "86.0", sebc: "80.0", sc: "68.0", st: "56.0" },
      { year: "2020", ur: "82.0", sebc: "76.0", sc: "64.0", st: "52.0" }
    ]
  },
  "ugc-net-education": {
    title: "UGC NET Education JRF",
    category: "Teaching & Education Exams",
    conductingBody: "National Testing Agency (NTA) & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Education (M.Ed)",
    totalMarks: 300,
    status: "Cycle Active",
    stages: ["Paper 1", "Paper 2"],
    description: "National examination for Assistant Professor and Junior Research Fellowship in Education.",
    pattern: [
      { paper: "Paper 1 & 2", subject: "Teaching Aptitude & Education Core", questions: 150, marks: 300, duration: "3 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2024", ur: "178 (JRF)", sebc: "166 (JRF)", sc: "152 (JRF)", st: "146 (JRF)" },
      { year: "2023", ur: "172 (JRF)", sebc: "160 (JRF)", sc: "148 (JRF)", st: "140 (JRF)" },
      { year: "2022", ur: "168 (JRF)", sebc: "156 (JRF)", sc: "144 (JRF)", st: "136 (JRF)" },
      { year: "2021", ur: "164 (JRF)", sebc: "152 (JRF)", sc: "140 (JRF)", st: "132 (JRF)" },
      { year: "2020", ur: "160 (JRF)", sebc: "148 (JRF)", sc: "136 (JRF)", st: "128 (JRF)" }
    ]
  },
  "ignou-bed-entrance": {
    title: "IGNOU B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Indira Gandhi National Open University",
    officialPortal: "https://ignou.ac.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["Entrance Test", "Counseling"],
    description: "Distance education entrance test conducted by IGNOU for B.Ed program.",
    pattern: [
      { paper: "Part A & B", subject: "General English, Logical Reasoning, Teaching Learning", questions: 100, marks: 100, duration: "2 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2024", ur: "70.0", sebc: "64.0", sc: "58.0", st: "52.0" },
      { year: "2023", ur: "68.0", sebc: "62.0", sc: "56.0", st: "50.0" },
      { year: "2022", ur: "65.0", sebc: "59.0", sc: "53.0", st: "47.0" },
      { year: "2021", ur: "62.0", sebc: "56.0", sc: "50.0", st: "44.0" },
      { year: "2020", ur: "60.0", sebc: "54.0", sc: "48.0", st: "42.0" }
    ]
  },
  "odisha-ct-deled": {
    title: "Odisha CT / D.El.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Directorate of Teacher Education, Odisha",
    officialPortal: "https://samsodisha.gov.in",
    qualification: "12th with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["CBT Test", "Counseling"],
    description: "State entrance test for Diploma in Elementary Education training institutes in Odisha.",
    pattern: [
      { paper: "Section I & II", subject: "Language, Awareness, Reasoning, Math & Science", questions: 100, marks: 100, duration: "180 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "74.0", sebc: "69.5", sc: "59.0", st: "49.5" },
      { year: "2023", ur: "71.0", sebc: "66.0", sc: "56.0", st: "46.0" },
      { year: "2022", ur: "68.0", sebc: "63.0", sc: "53.0", st: "43.0" },
      { year: "2021", ur: "65.0", sebc: "60.0", sc: "50.0", st: "40.0" },
      { year: "2020", ur: "62.0", sebc: "57.0", sc: "47.0", st: "37.0" }
    ]
  },
  "odisha-bed-entrance": {
    title: "Odisha B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    conductingBody: "Higher Education Department, Odisha",
    officialPortal: "https://samsodisha.gov.in",
    qualification: "Bachelor / Master Degree with 50% Marks",
    totalMarks: 100,
    status: "Applications Open",
    stages: ["CBT Test", "Counseling"],
    description: "State level entrance test for admission into B.Ed courses across Odisha.",
    pattern: [
      { paper: "Paper I & II", subject: "Language, Reasoning, Teaching Aptitude", questions: 100, marks: 100, duration: "180 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "72.5", sebc: "68.0", sc: "58.5", st: "48.0" },
      { year: "2023", ur: "69.5", sebc: "65.0", sc: "55.5", st: "45.0" },
      { year: "2022", ur: "66.5", sebc: "62.0", sc: "52.5", st: "42.0" },
      { year: "2021", ur: "63.5", sebc: "59.0", sc: "49.5", st: "39.0" },
      { year: "2020", ur: "60.5", sebc: "56.0", sc: "46.5", st: "36.0" }
    ]
  },
  "odisha-osstet": {
    title: "Odisha Secondary School Teacher Eligibility Test",
    category: "Teaching & Education Exams",
    conductingBody: "Board of Secondary Education (BSE), Odisha",
    officialPortal: "https://bseodisha.ac.in",
    qualification: "Graduation with B.Ed",
    totalMarks: 150,
    status: "Notification Expected",
    stages: ["Written Examination"],
    description: "State eligibility test for teachers desiring to teach in secondary schools of Odisha.",
    pattern: [
      { paper: "Paper I", subject: "Educational Psychology, Language, Content", questions: 150, marks: 150, duration: "2.5 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2024", ur: "90 (60%)", sebc: "82.5", sc: "75.0", st: "75.0" },
      { year: "2023", ur: "90 (60%)", sebc: "82.5", sc: "75.0", st: "75.0" },
      { year: "2022", ur: "90 (60%)", sebc: "82.5", sc: "75.0", st: "75.0" },
      { year: "2021", ur: "90 (60%)", sebc: "82.5", sc: "75.0", st: "75.0" },
      { year: "2020", ur: "90 (60%)", sebc: "82.5", sc: "75.0", st: "75.0" }
    ]
  },
  "opsc-ag-aso": {
    title: "OPSC Assistant Section Officer (Advocate General)",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Written Exam", "Skill Test"],
    description: "Conducted for recruitment to ASO posts under the Advocate General office of Odisha.",
    pattern: [
      { paper: "Paper-1, 2, 3", subject: "General Awareness, Reasoning, Math, English & Odia", questions: 400, marks: 400, duration: "6.5 Hours", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2025", ur: "282.7", sebc: "-", sc: "243.2", st: "204.0" },
      { year: "2023", ur: "275.0", sebc: "268.0", sc: "235.0", st: "198.0" },
      { year: "2022", ur: "268.0", sebc: "260.0", sc: "228.0", st: "190.0" },
      { year: "2021", ur: "260.0", sebc: "252.0", sc: "220.0", st: "182.0" },
      { year: "2020", ur: "252.0", sebc: "244.0", sc: "212.0", st: "175.0" }
    ]
  },
  "odisha-police-si": {
    title: "Odisha Police Sub Inspector",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Uniformed Services Commission",
    officialPortal: "https://ousssc.odisha.gov.in/",
    qualification: "Bachelor Degree",
    totalMarks: 300,
    status: "Notification Out",
    stages: ["CBT Exam", "PST & PET"],
    description: "State-level selection process comprising computer-based test, physical standards, and medical evaluation.",
    pattern: [
      { paper: "Paper 1 & 2", subject: "Language, General Studies & Reasoning", questions: 300, marks: 300, duration: "270 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "195.0", sebc: "188.5", sc: "165.0", st: "142.0" },
      { year: "2023", ur: "188.0", sebc: "181.0", sc: "158.0", st: "135.0" },
      { year: "2022", ur: "180.0", sebc: "174.0", sc: "150.0", st: "128.0" },
      { year: "2021", ur: "172.0", sebc: "166.0", sc: "142.0", st: "120.0" },
      { year: "2020", ur: "165.0", sebc: "158.0", sc: "135.0", st: "112.0" }
    ]
  },
  "opsc-ocs": {
    title: "OPSC Odisha Civil Services (OCS)",
    category: "Odisha State Government Exams",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    officialPortal: "https://opsc.gov.in",
    qualification: "Bachelor Degree",
    totalMarks: 2000,
    status: "Exam Calendar Active",
    stages: ["Prelims", "Mains", "Interview"],
    description: "Premier state civil services examination for recruitment into Group A and Group B administrative services.",
    pattern: [
      { paper: "Prelims GS-1 & CSAT", subject: "General Studies & Aptitude", questions: 180, marks: 400, duration: "4 Hours", negative: "0.33" }
    ],
    cutoffs: [
      { year: "2024", ur: "98.5", sebc: "94.0", sc: "82.0", st: "70.5" },
      { year: "2023", ur: "95.0", sebc: "90.0", sc: "78.0", st: "66.0" },
      { year: "2022", ur: "92.0", sebc: "87.0", sc: "75.0", st: "63.0" },
      { year: "2021", ur: "89.0", sebc: "84.0", sc: "72.0", st: "60.0" },
      { year: "2020", ur: "86.0", sebc: "81.0", sc: "69.0", st: "57.0" }
    ]
  },
  "upsc-cse": {
    title: "UPSC Civil Services Examination (IAS / IPS)",
    category: "UPSC & Central Civil Services",
    conductingBody: "Union Public Service Commission",
    officialPortal: "https://upsc.gov.in",
    qualification: "Graduate in any discipline",
    totalMarks: 2025,
    status: "Prelims Active",
    stages: ["Prelims", "Mains", "Interview"],
    description: "India's premier civil services examination conducted annually for recruitment to IAS, IFS, and IPS.",
    pattern: [
      { paper: "GS Paper I", subject: "General Studies", questions: 100, marks: 200, duration: "2 Hours", negative: "0.66" },
      { paper: "GS Paper II (CSAT)", subject: "Aptitude", questions: 80, marks: 200, duration: "2 Hours", negative: "0.66" }
    ],
    cutoffs: [
      { year: "2024", ur: "93.0", sebc: "89.0", sc: "77.0", st: "74.0" },
      { year: "2023", ur: "75.41", sebc: "74.73", sc: "59.25", st: "47.83" },
      { year: "2022", ur: "88.22", sebc: "87.54", sc: "74.84", st: "69.35" },
      { year: "2021", ur: "87.54", sebc: "84.85", sc: "75.41", st: "70.71" },
      { year: "2020", ur: "92.51", sebc: "89.12", sc: "74.84", st: "68.79" }
    ]
  },
  "cuet-pg-eco": {
    title: "CUET PG Economics (COQP10)",
    category: "CUET PG & University Entrance",
    conductingBody: "National Testing Agency (NTA)",
    officialPortal: "https://pgcuet.samarth.ac.in",
    qualification: "Bachelor Degree in Economics",
    totalMarks: 400,
    status: "Applications Open",
    stages: ["Computer Based Test"],
    description: "National entrance examination for admission into postgraduate Economics programs across universities.",
    pattern: [
      { paper: "Core Paper", subject: "Micro, Macro, Development & Indian Economy", questions: 100, marks: 400, duration: "105 Mins", negative: "1.0" }
    ],
    cutoffs: [
      { year: "2024", ur: "210", sebc: "185", sc: "140", st: "120" },
      { year: "2023", ur: "200", sebc: "175", sc: "130", st: "110" },
      { year: "2022", ur: "190", sebc: "165", sc: "120", st: "100" },
      { year: "2021", ur: "180", sebc: "155", sc: "110", st: "90" },
      { year: "2020", ur: "170", sebc: "145", sc: "100", st: "80" }
    ]
  },
  "ugc-net-econ": {
    title: "UGC NET Economics JRF",
    category: "CUET PG & University Entrance",
    conductingBody: "NTA & UGC",
    officialPortal: "https://ugcnet.nta.nic.in",
    qualification: "Master Degree in Economics",
    totalMarks: 300,
    status: "Cycle Active",
    stages: ["Paper 1", "Paper 2"],
    description: "National Eligibility Test for Junior Research Fellowship and Assistant Professor in Economics.",
    pattern: [
      { paper: "Paper 1 & 2", subject: "Teaching Aptitude & Economics Core", questions: 150, marks: 300, duration: "3 Hours", negative: "0" }
    ],
    cutoffs: [
      { year: "2024", ur: "182 (JRF)", sebc: "170 (JRF)", sc: "154 (JRF)", st: "148 (JRF)" },
      { year: "2023", ur: "176 (JRF)", sebc: "164 (JRF)", sc: "148 (JRF)", st: "142 (JRF)" },
      { year: "2022", ur: "170 (JRF)", sebc: "158 (JRF)", sc: "142 (JRF)", st: "136 (JRF)" },
      { year: "2021", ur: "166 (JRF)", sebc: "154 (JRF)", sc: "138 (JRF)", st: "130 (JRF)" },
      { year: "2020", ur: "162 (JRF)", sebc: "150 (JRF)", sc: "134 (JRF)", st: "126 (JRF)" }
    ]
  },
  "ssc-cgl": {
    title: "SSC CGL (Combined Graduate Level)",
    category: "Staff Selection Commission (SSC)",
    conductingBody: "Staff Selection Commission",
    officialPortal: "https://ssc.nic.in",
    qualification: "Bachelor Degree",
    totalMarks: 390,
    status: "Tier-1 Active",
    stages: ["Tier-I", "Tier-II"],
    description: "All-India examination for recruitment to various Group B and Group C posts in central ministries.",
    pattern: [
      { paper: "Tier-I", subject: "Reasoning, Quant, English, GA", questions: 100, marks: 200, duration: "60 Mins", negative: "0.50" }
    ],
    cutoffs: [
      { year: "2024", ur: "153.0", sebc: "148.0", sc: "135.0", st: "125.0" },
      { year: "2023", ur: "150.0", sebc: "145.0", sc: "130.0", st: "120.0" },
      { year: "2022", ur: "130.0", sebc: "125.0", sc: "115.0", st: "105.0" },
      { year: "2021", ur: "130.0", sebc: "125.0", sc: "110.0", st: "100.0" },
      { year: "2020", ur: "132.0", sebc: "128.0", sc: "112.0", st: "103.0" }
    ]
  },
  "ibps-po": {
    title: "IBPS PO / Management Trainee",
    category: "Banking, Insurance & Regulatory Bodies",
    conductingBody: "Institute of Banking Personnel Selection",
    officialPortal: "https://ibps.in",
    qualification: "Graduation",
    totalMarks: 225,
    status: "Mains Active",
    stages: ["Prelims", "Mains", "Interview"],
    description: "Common recruitment process for Probationary Officers across participating public sector banks.",
    pattern: [
      { paper: "Prelims", subject: "English, Quant, Reasoning", questions: 100, marks: 100, duration: "60 Mins", negative: "0.25" }
    ],
    cutoffs: [
      { year: "2024", ur: "54.25", sebc: "54.25", sc: "48.0", st: "42.5" },
      { year: "2023", ur: "54.25", sebc: "54.25", sc: "46.25", st: "39.75" },
      { year: "2022", ur: "49.75", sebc: "49.75", sc: "43.50", st: "36.25" },
      { year: "2021", ur: "50.50", sebc: "50.50", sc: "44.25", st: "37.50" },
      { year: "2020", ur: "58.75", sebc: "58.75", sc: "51.25", st: "43.50" }
    ]
  },
  "rrb-ntpc": {
    title: "RRB NTPC (Non-Technical Popular Categories)",
    category: "Railway Recruitment Board (RRB)",
    conductingBody: "Ministry of Railways",
    officialPortal: "https://rrbcdg.gov.in",
    qualification: "12th Pass or Graduation",
    totalMarks: 120,
    status: "CBT Scheduled",
    stages: ["CBT 1", "CBT 2"],
    description: "Recruitment drive by Indian Railways for non-technical popular categories including guards and clerks.",
    pattern: [
      { paper: "CBT 1", subject: "Maths, Reasoning, General Awareness", questions: 100, marks: 100, duration: "90 Mins", negative: "0.33" }
    ],
    cutoffs: [
      { year: "2024", ur: "72.0", sebc: "68.0", sc: "58.0", st: "52.0" },
      { year: "2023", ur: "70.0", sebc: "66.0", sc: "56.0", st: "50.0" },
      { year: "2022", ur: "68.0", sebc: "64.0", sc: "54.0", st: "48.0" },
      { year: "2021", ur: "65.0", sebc: "60.0", sc: "50.0", st: "45.0" },
      { year: "2020", ur: "62.0", sebc: "57.0", sc: "47.0", st: "42.0" }
    ]
  }
};

function ExamDetailContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("id") || "upsc-cse";
  const exam = examDetailsData[examId];
  const syllabusRef = findSyllabusByParam(examId);

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-400">Exam Blueprint Not Found</h1>
        <p className="text-sm text-slate-400 mt-2">The requested examination details are currently unavailable.</p>
        <Link href="/exams" className="mt-6 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">
          ← Back to Exam Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 px-4 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto">
          <Link href="/exams" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950 px-4 py-2 rounded-full border border-emerald-500/30 mb-6 hover:bg-emerald-900 transition-all">
            <span>←</span> BACK TO EXAM DIRECTORY
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full font-bold border border-emerald-500/30">
              {exam.category}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 text-emerald-300 rounded-lg border border-emerald-500/20">
              {exam.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4">
            {exam.title}
          </h1>
          <p className="text-emerald-400 font-medium text-sm mt-1">{exam.conductingBody}</p>
          <p className="text-slate-300 text-sm md:text-base mt-4 max-w-3xl leading-relaxed">
            {exam.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                <p className="text-xs text-slate-400">Total Marks</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{exam.totalMarks}</p>
              </div>
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                <p className="text-xs text-slate-400">Eligibility</p>
                <p className="text-sm font-semibold text-slate-200 mt-1">{exam.qualification}</p>
              </div>
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                <p className="text-xs text-slate-400">Official Portal</p>
                <a href={exam.officialPortal} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-400 hover:underline mt-1 block truncate">
                  Visit Website ↗
                </a>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">⚙️ Selection Stages</h2>
              <div className="flex flex-wrap gap-3">
                {exam.stages.map((stage, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-emerald-300">
                    Stage {idx + 1}: {stage}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">📋 Examination Pattern</h2>
              <div className="space-y-4">
                {exam.pattern.map((pat, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-400">{pat.paper}</span>
                      <p className="text-sm font-semibold text-white">{pat.subject}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                      <span>Qns: <strong className="text-white">{pat.questions}</strong></span>
                      <span>Marks: <strong className="text-white">{pat.marks}</strong></span>
                      <span>Duration: <strong className="text-white">{pat.duration}</strong></span>
                      <span>Negative: <strong className="text-red-400">-{pat.negative}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">📊 Last 5 Years Cutoff Trends (2020 - 2024)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Year</th>
                      <th className="p-3">UR / General</th>
                      <th className="p-3">SEBC / OBC</th>
                      <th className="p-3">SC</th>
                      <th className="p-3">ST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {exam.cutoffs.map((cut, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-white">{cut.year}</td>
                        <td className="p-3 text-emerald-400 font-semibold">{cut.ur}</td>
                        <td className="p-3">{cut.sebc}</td>
                        <td className="p-3">{cut.sc}</td>
                        <td className="p-3">{cut.st}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-emerald-500/40 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-500/30">
                  Interactive Practice Hub
                </span>
                <h3 className="text-xl font-extrabold text-white mt-4">Practice Previous Year Questions (PYQs)</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Test your mastery for <strong className="text-white">{exam.title}</strong> using real-time simulated CBT test papers.
                </p>

                                <div className="mt-4 rounded-xl border border-slate-700/90 bg-slate-900/80 p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    What to Focus On First
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {(syllabusRef?.highYieldFocus ?? [
                      "Core Syllabus Fundamentals & Weightage Topics",
                      "Previous Year Question Patterns & Time Management",
                      "High-Accuracy Revision & Mistake Log",
                    ]).map((focusItem, fIdx) => (
                      <li key={fIdx}>• {focusItem}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href={syllabusRef?.pyqTopicHint ? `/pyq?q=${encodeURIComponent(syllabusRef.pyqTopicHint)}` : "/pyq"}
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Start PYQ Simulator</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href={`/syllabus/${encodeURIComponent(syllabusRef?.slug || syllabusRef?.id || examId)}`}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-950 text-emerald-300 font-bold rounded-xl text-xs transition-all duration-300 border border-emerald-500/40 flex items-center justify-center gap-2"
                  >
                    <span>View Complete Syllabus</span>
                  </Link>

                  <Link
                    href="/exams"
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-950 text-slate-300 font-bold rounded-xl text-xs transition-all duration-300 border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <span>Explore Other Blueprints</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ExamDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">Loading Blueprint...</div>}>
      <ExamDetailContent />
    </Suspense>
  );
}
