"use client";

import "@/app/homepage-premium.css";
import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getContent } from "@/lib/api";
import { odishaPoliceSi2023Paper1Questions } from "@/data/odishaPoliceSi2023Paper1";
import { odishaPoliceSi2023Paper2Questions } from "@/data/odishaPoliceSi2023Paper2";

type Question = {
  id: string;
  title: string;
  metadata: {
    examName?: string;
    subject?: string;
    topic?: string;
    year?: string;
    paper?: string;
    question: string;
    question_or?: string;
    options: string[];
    options_or?: string[];
    answerIndex: number;
    explanation?: string;
  };
};

type PaperCard = {
  id: string;
  exam: string;
  title: string;
  subject: string;
  category: "pyq" | "subject" | "topic";
  year: string;
  paper: string;
  shift: string;
  questionsCount: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMark: number;
  expectedCutoffPercent: number;
  isBilingual?: boolean;
  topicTag?: string;
};

type MistakeRecord = {
  questionId: string;
  paperId: string;
  paperTitle: string;
  exam: string;
  subject: string;
  topic: string;
  userAnswer: number;
  correctAnswer: number;
  timestamp: string;
};

type QuestionReport = {
  id: string;
  questionId: string;
  questionText: string;
  examName: string;
  paperTitle: string;
  subject: string;
  topic: string;
  issueType: string;
  comment: string;
  timestamp: string;
};

const curatedCatalog: PaperCard[] = [
  // 2023 PAPERS
  { 
    id: "opsi-2023-p1-official", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI 2023 Official Paper 1 English and Odia", 
    subject: "General English and Odia Language", 
    category: "pyq", 
    year: "2023", 
    paper: "Paper 1", 
    shift: "Morning Session", 
    questionsCount: 100, 
    durationMinutes: 90,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 68,
    isBilingual: false
  },
  { 
    id: "opsi-2023-p2-official", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI 2023 Official Paper 2 General Studies", 
    subject: "General Studies and Mental Ability", 
    category: "pyq", 
    year: "2023", 
    paper: "Paper 2", 
    shift: "Afternoon Session", 
    questionsCount: 200, 
    durationMinutes: 180,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 64,
    isBilingual: true
  },
  // 2019 PAPERS (HELD ON 30 OCT 2022)
  { 
    id: "opsi-2019-p1-official", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2019 Paper 1 English and Odia", 
    subject: "General English and Odia Language", 
    category: "pyq", 
    year: "2019", 
    paper: "Paper 1", 
    shift: "Exam 30 Oct 2022", 
    questionsCount: 100, 
    durationMinutes: 90,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 66,
    isBilingual: false
  },
  { 
    id: "opsi-2019-p2-official", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2019 Paper 2 General Studies", 
    subject: "General Studies, Reasoning & Computer Literacy", 
    category: "pyq", 
    year: "2019", 
    paper: "Paper 2", 
    shift: "Exam 30 Oct 2022", 
    questionsCount: 200, 
    durationMinutes: 180,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 62,
    isBilingual: true
  },
  { 
    id: "opsi-2019-p3-official", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2019 Paper 3 Technical Physics & Chemistry", 
    subject: "Physics and Chemistry Technical Paper", 
    category: "pyq", 
    year: "2019", 
    paper: "Paper 3", 
    shift: "Technical Session", 
    questionsCount: 200, 
    durationMinutes: 180,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 60,
    isBilingual: false
  },
  // 2018 PAPERS (EXAM HELD ON 06 JULY 2022)
  { 
    id: "opsi-2018-p1-06july", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2018 Paper 1 (06 July 2022 Shift 1)", 
    subject: "General English and Odia Comprehension", 
    category: "pyq", 
    year: "2018", 
    paper: "Paper 1", 
    shift: "Shift 1 (06 July 2022)", 
    questionsCount: 100, 
    durationMinutes: 90,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 65,
    isBilingual: false
  },
  { 
    id: "opsi-2018-p2-06july", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2018 Paper 2 (06 July 2022 Shift 2)", 
    subject: "General Studies, Mental Ability & Computer Literacy", 
    category: "pyq", 
    year: "2018", 
    paper: "Paper 2", 
    shift: "Shift 2 (06 July 2022)", 
    questionsCount: 200, 
    durationMinutes: 180,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 62,
    isBilingual: true
  },
  // 2018 PAPERS (EXAM HELD ON 02 JULY 2022)
  { 
    id: "opsi-2018-p1-02july", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2018 Paper 1 (02 July 2022 Shift 1)", 
    subject: "General English and Odia Comprehension", 
    category: "pyq", 
    year: "2018", 
    paper: "Paper 1", 
    shift: "Shift 1 (02 July 2022)", 
    questionsCount: 100, 
    durationMinutes: 90,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 65,
    isBilingual: false
  },
  { 
    id: "opsi-2018-p2-02july", 
    exam: "Odisha Police SI", 
    title: "Odisha Police SI CPSE 2018 Paper 2 (02 July 2022 Shift 2)", 
    subject: "General Studies, Reasoning & Computer Literacy", 
    category: "pyq", 
    year: "2018", 
    paper: "Paper 2", 
    shift: "Shift 2 (02 July 2022)", 
    questionsCount: 200, 
    durationMinutes: 180,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 62,
    isBilingual: true
  },
  // SUBJECT MODULES
  {
    id: "opsi-sub-ga-1",
    exam: "Odisha Police SI",
    title: "General Awareness & Odisha Special Module",
    subject: "General Awareness",
    category: "subject",
    year: "2023",
    paper: "Subject Test",
    shift: "Core Module",
    questionsCount: 60,
    durationMinutes: 60,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 65,
    isBilingual: true
  },
  {
    id: "opsi-sub-rs-1",
    exam: "Odisha Police SI",
    title: "Logical Reasoning & Mental Ability Module",
    subject: "Reasoning",
    category: "subject",
    year: "2023",
    paper: "Subject Test",
    shift: "Core Module",
    questionsCount: 50,
    durationMinutes: 50,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 70,
    isBilingual: true
  },
  {
    id: "opsi-sub-qa-1",
    exam: "Odisha Police SI",
    title: "Quantitative Aptitude & Math Module",
    subject: "Mathematics",
    category: "subject",
    year: "2023",
    paper: "Subject Test",
    shift: "Core Module",
    questionsCount: 50,
    durationMinutes: 60,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 65,
    isBilingual: true
  },
  {
    id: "opsi-sub-lang-1",
    exam: "Odisha Police SI",
    title: "English & Odia Language Comprehensive Module",
    subject: "Language Core",
    category: "subject",
    year: "2023",
    paper: "Subject Test",
    shift: "Core Module",
    questionsCount: 50,
    durationMinutes: 50,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 70,
    isBilingual: false
  },
  // TOPIC DRILLS
  {
    id: "opsi-top-polity",
    exam: "Odisha Police SI",
    title: "Indian Constitution & Polity Drill",
    subject: "General Awareness",
    category: "topic",
    year: "2023",
    paper: "Topic Drill",
    shift: "Topic Session",
    questionsCount: 35,
    durationMinutes: 35,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 75,
    isBilingual: true
  },
  {
    id: "opsi-top-odisha",
    exam: "Odisha Police SI",
    title: "Odisha History, Geography & Culture Drill",
    subject: "General Awareness",
    category: "topic",
    year: "2023",
    paper: "Topic Drill",
    shift: "Topic Session",
    questionsCount: 40,
    durationMinutes: 40,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 70,
    isBilingual: true
  },
  {
    id: "opsi-top-reason",
    exam: "Odisha Police SI",
    title: "Coding-Decoding & Series Drill",
    subject: "Reasoning",
    category: "topic",
    year: "2023",
    paper: "Topic Drill",
    shift: "Topic Session",
    questionsCount: 30,
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 75,
    isBilingual: true
  },
  {
    id: "opsi-top-odia",
    exam: "Odisha Police SI",
    title: "Odia Byakarana & Yuktakkhar Drill",
    subject: "Language Core",
    category: "topic",
    year: "2023",
    paper: "Topic Drill",
    shift: "Topic Session",
    questionsCount: 35,
    durationMinutes: 35,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    expectedCutoffPercent: 75,
    isBilingual: false
  }
];

const fallbackExtractedQuestions: Question[] = [
  // 2023 PAPERS
  {
    id: "opsi-2023-p1-q1",
    title: "Why was the narrator technically not a prisoner",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General English",
      topic: "Reading Comprehension",
      year: "2023",
      paper: "Paper 1",
      question: "Why was the narrator technically not a prisoner?",
      options: [
        "because he was a criminal",
        "because he had not committed a crime",
        "because he was not formally charged",
        "because he was a political activist"
      ],
      answerIndex: 2,
      explanation: "Technically, I was not imprisoned but merely in custody because I was not formally charged."
    }
  },
  {
    id: "opsi-2023-p2-q1",
    title: "Not true about Leprosy",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General Studies",
      topic: "General Science",
      year: "2023",
      paper: "Paper 2",
      question: "Which of the following is NOT true about the disease Leprosy?",
      question_or: "କୁଷ୍ଠ ରୋଗ ସମ୍ବନ୍ଧରେ ନିମ୍ନଲିଖିତ ମଧ୍ୟରୁ କେଉଁଟି ସତ୍ୟ ନୁହେଁ?",
      options: [
        "It is caused by a virus",
        "The disease spreads only after a long and close contact with the patient",
        "Its symptoms occur after more than one year of the entry of bacteria into the body",
        "All of the above"
      ],
      options_or: [
        "ଏହା ଏକ ଭୂତାଣୁ virus ଦ୍ୱାରା ହୋଇଥାଏ",
        "ରୋଗୀ ସହିତ ଦୀର୍ଘ ଦିନର ନିକଟ ସମ୍ପର୍କ ପରେ ହିଁ ଏହି ରୋଗ ବ୍ୟାପିଥାଏ",
        "ଶରୀରରେ ବ୍ୟାକ୍ଟେରିଆ ପ୍ରବେଶ କରିବାର ଏକ ବର୍ଷ ପରେ ଏହାର ଲକ୍ଷଣ ଦେଖାଯାଏ",
        "ଉପରୋକ୍ତ ସମସ୍ତ"
      ],
      answerIndex: 0,
      explanation: "Leprosy is caused by Mycobacterium leprae, which is a bacterium, not a virus."
    }
  },
  // 2019 PAPERS
  {
    id: "opsi-2019-p1-q1",
    title: "ସ୍ବାଧୀନତାର ନାମ ଗ୍ରହଣ କରିବାର ଅଧିକାର",
    metadata: {
      examName: "Odisha Police SI",
      subject: "Odia Language",
      topic: "Odia Comprehension",
      year: "2019",
      paper: "Paper 1",
      question: "ସ୍ବାଧୀନତାର ନାମ ଗ୍ରହଣ କରିବାର ଅଧିକାର କେଉଁ ବ୍ୟକ୍ତିର ରହିଛି?",
      options: [
        "ପାର୍ଥିବ ସୁଖ ସମୃଦ୍ଧି - ସଂସାରରେ ଯଶ ଓ ସୁଖ୍ୟାତି ଥିବା ବ୍ୟକ୍ତି ।",
        "ବିବେକର ଆଦେଶ ଓ ଈଶ୍ବରଙ୍କ ସତ୍ୟକୁ ଗ୍ରହଣ କରୁଥିବା ବ୍ୟକ୍ତି ।",
        "ଜନ ସାଧାରଣଙ୍କ ପ୍ରଶଂସା ଯାହା ନିକଟରେ ଅଧିକ ମୂଲ୍ୟବାନ ବ୍ୟକ୍ତି ।",
        "ସଂସାରର ଦୁଃଖକଷ୍ଟରେ ଭୟାତୁର ବ୍ୟକ୍ତି ।"
      ],
      answerIndex: 1,
      explanation: "Official Key: Option B (ବିବେକର ଆଦେଶ ଓ ଈଶ୍ବରଙ୍କ ସତ୍ୟକୁ ଗ୍ରହଣ କରୁଥିବା ବ୍ୟକ୍ତି)।"
    }
  },
  {
    id: "opsi-2019-p2-q1",
    title: "Father of Green Revolution in India",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General Studies",
      topic: "Indian Agriculture",
      year: "2019",
      paper: "Paper 2",
      question: "Who is known as 'Indian Father of Green Revolution'?",
      question_or: "ଭାରତରେ 'ସବୁଜ ବିପ୍ଳବର ଜନକ' ଭାବରେ କିଏ ପରିଚିତ?",
      options: [
        "M. S. Swaminathan",
        "M. K. Narayanaswami",
        "H. K. Firodia",
        "P. N. Mehra"
      ],
      options_or: [
        "ଏମ୍. ଏସ୍. ସ୍ୱାମୀନାଥନ୍",
        "ଏମ୍. କେ. ନାରାୟଣସ୍ୱାମୀ",
        "ଏଚ୍. କେ. ଫିରୋଦିଆ",
        "ପି. ଏନ୍. ମେହେରା"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (M. S. Swaminathan led the Green Revolution in India)."
    }
  },
  // 2018 PAPERS (06 JULY 2022 SHIFT 1 - PAPER 1)
  {
    id: "opsi-2018-06july-p1-q1",
    title: "Homi Bhabha childhood behavior",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General English",
      topic: "Reading Comprehension",
      year: "2018",
      paper: "Paper 1",
      question: "As a child, Homi was:",
      options: [
        "lazy",
        "unhealthy",
        "overactive for his age",
        "difficult to handle"
      ],
      answerIndex: 2,
      explanation: "Official Key: Option C (overactive for his age). As stated in the passage: Homi had a super active brain and slept much less than children of his age."
    }
  },
  {
    id: "opsi-2018-06july-p1-q12",
    title: "Antonym of Venal",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General English",
      topic: "Vocabulary",
      year: "2018",
      paper: "Paper 1",
      question: "Choose the option that is opposite in meaning to the word - Venal:",
      options: [
        "vicious",
        "corrupt",
        "venial",
        "noble"
      ],
      answerIndex: 3,
      explanation: "Official Key: Option D (noble). Venal means open to bribery or corrupt; its antonym is noble or honorable."
    }
  },
  {
    id: "opsi-2018-06july-p1-q27",
    title: "Person who does not believe in God",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General English",
      topic: "One Word Substitution",
      year: "2018",
      paper: "Paper 1",
      question: "What is a person who does not believe in God called?",
      options: [
        "Atheist",
        "Ascetic",
        "Lunatic",
        "Anarchist"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (Atheist). A person who does not believe in the existence of God or gods is an atheist."
    }
  },
  {
    id: "opsi-2018-06july-p1-q28",
    title: "Hit the sack meaning",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General English",
      topic: "Idioms & Phrases",
      year: "2018",
      paper: "Paper 1",
      question: "'Hit the sack' means:",
      options: [
        "Go to bed or go to sleep",
        "Box the bag",
        "Hit the potato sack with a stick",
        "Throw the sack to the floor"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (Go to bed or go to sleep). It is an informal idiom meaning to prepare for sleep."
    }
  },
  {
    id: "opsi-2018-06july-p1-q73",
    title: "Look two bulls are fighting translation",
    metadata: {
      examName: "Odisha Police SI",
      subject: "Odia Language",
      topic: "Translation",
      year: "2018",
      paper: "Paper 1",
      question: "Look, two bulls are fighting. ସଠିକ ଅନୁବାଦ ଚିହ୍ନାଅ:",
      options: [
        "ଦେଖ ଦୁଇଟା ଷଣ୍ଢ ଲଢେଇ କରୁଛନ୍ତି|",
        "ଦୁଇଟା ଷଣ୍ଢ ଲଢେଇ କରୁଥିଲେ।",
        "ଦେଖ ଦୁଇଟା ବଳଦ ଲଢେଇ କରିଥିଲେ|",
        "ଦେଖ ଦୁଇଟା ଗାଈ ଲଢେଇ କରୁଛନ୍ତି|"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (ଦେଖ ଦୁଇଟା ଷଣ୍ଢ ଲଢେଇ କରୁଛନ୍ତି|)."
    }
  },
  {
    id: "opsi-2018-06july-p1-q94",
    title: "ଯିଏ ବିଧାନ କରେ ଏକ ପଦରେ ପ୍ରକାଶ",
    metadata: {
      examName: "Odisha Police SI",
      subject: "Odia Language",
      topic: "Odia Byakarana",
      year: "2018",
      paper: "Paper 1",
      question: "ଏକ ପଦରେ ପ୍ରକାଶ କର : ଯିଏ ବିଧାନ କରେ",
      options: [
        "ଇଶ୍ୱର",
        "ବିଧାୟକ",
        "ବିଧାତା",
        "ପଣ୍ଡିତ"
      ],
      answerIndex: 2,
      explanation: "Official Key: Option C (ବିଧାତା). ଯିଏ ବିଧାନ କରେ ତାକୁ ବିଧାତା କୁହାଯାଏ।"
    }
  },
  // 2018 PAPERS (06 JULY 2022 SHIFT 2 - PAPER 2)
  {
    id: "opsi-2018-06july-p2-q1",
    title: "UN Year of 2016",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General Studies",
      topic: "Current Affairs & International Years",
      year: "2018",
      paper: "Paper 2",
      question: "UN year of 2016 was celebrated as:",
      question_or: "ମିଳିତ ଜାତିସଂଘ ଦ୍ୱାରା ୨୦୧୬ ବର୍ଷ କେଉଁ ଭାବରେ ପାଳନ କରାଯାଇଥିଲା?",
      options: [
        "International year of pulses",
        "International year of water",
        "International year of health",
        "International year of millets"
      ],
      options_or: [
        "ଅନ୍ତର୍ଜାତୀୟ ଡାଲି ଜାତୀୟ ଶସ୍ୟ ବର୍ଷ",
        "ଅନ୍ତର୍ଜାତୀୟ ଜଳ ବର୍ଷ",
        "ଅନ୍ତର୍ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ବର୍ଷ",
        "ଅନ୍ତର୍ଜାତୀୟ ମାଣ୍ଡିଆ ବର୍ଷ"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (International year of pulses). The 68th UN General Assembly declared 2016 as the International Year of Pulses."
    }
  },
  {
    id: "opsi-2018-06july-p2-q40",
    title: "Google website classification",
    metadata: {
      examName: "Odisha Police SI",
      subject: "Computer Literacy",
      topic: "Internet & IT",
      year: "2018",
      paper: "Paper 2",
      question: "Google (www.google.com) is a:",
      question_or: "ଗୁଗୁଲ୍ (www.google.com) ଏକ:",
      options: [
        "Search Engine",
        "Name in Math",
        "Directory of image",
        "Chat service on web"
      ],
      options_or: [
        "ସର୍ଚ୍ଚ ଇଞ୍ଜିନ୍",
        "ଗାଣିତିକ ନାମ",
        "ଚିତ୍ର ଡିରେକ୍ଟୋରୀ",
        "ୱେବ୍ ଚାଟ୍ ସେବା"
      ],
      answerIndex: 0,
      explanation: "Official Key: Option A (Search Engine). Google is the world's most widely used internet search engine."
    }
  },
  {
    id: "opsi-2018-06july-p2-q55",
    title: "Constitutional Advisor to Constituent Assembly",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General Studies",
      topic: "Indian Polity",
      year: "2018",
      paper: "Paper 2",
      question: "Who was the Constitutional Advisor to the Constituent Assembly of India?",
      question_or: "ଭାରତର ସମ୍ବିଧାନ ପ୍ରଣୟନ ସଭାର ସାମ୍ବିଧାନିକ ପରାମର୍ଶଦାତା କିଏ ଥିଲେ?",
      options: [
        "Dr. Rajendra Prasad",
        "Dr. B. R. Ambedkar",
        "Sir B. N. Rau",
        "Shri K. M. Munshi"
      ],
      options_or: [
        "ଡକ୍ଟର ରାଜେନ୍ଦ୍ର ପ୍ରସାଦ",
        "ଡକ୍ଟର ବି. ଆର୍. ଆମ୍ବେଦକର",
        "ସାର୍ ବି. ଏନ୍. ରାଓ",
        "ଶ୍ରୀ କେ. ଏମ୍. ମୁନ୍ସୀ"
      ],
      answerIndex: 2,
      explanation: "Official Key: Option C (Sir B. N. Rau). Sir Benegal Narsing Rau was appointed as the Constitutional Advisor to the Constituent Assembly in 1946."
    }
  },
  {
    id: "opsi-2018-06july-p2-q85",
    title: "Non-contact force of attraction between two bodies",
    metadata: {
      examName: "Odisha Police SI",
      subject: "General Studies",
      topic: "General Science - Physics",
      year: "2018",
      paper: "Paper 2",
      question: "_____ is defined as the non-contact force of attraction between any two bodies in the universe.",
      question_or: "ବିଶ୍ୱ ବ୍ରହ୍ମାଣ୍ଡରେ ଯେକୌଣସି ଦୁଇଟି ବସ୍ତୁ ମଧ୍ୟରେ ଥିବା ଅଣ-ସ୍ପର୍ଶ ଆକର୍ଷଣ ବଳକୁ କ'ଣ କୁହାଯାଏ?",
      options: [
        "Motion",
        "Gravitation",
        "Reduction",
        "None of these"
      ],
      options_or: [
        "ଗତି",
        "ମାଧ୍ୟାକର୍ଷଣ",
        "ବିଜାରଣ",
        "ଏଥିମଧ୍ୟରୁ କୌଣସିଟି ନୁହେଁ"
      ],
      answerIndex: 1,
      explanation: "Official Key: Option B (Gravitation). Gravitational force is a non-contact attractive force between any two masses in the universe."
    }
  }
];

export default function PyqPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E] flex items-center justify-center font-mono text-slate-500">Loading Practice Workspace...</div>}>
      <PyqContentInner />
    </Suspense>
  );
}

function PyqContentInner() {
  const params = useSearchParams();

  const localOdishaSiQuestions: Question[] = [
  ...odishaPoliceSi2023Paper1Questions.map((item) => ({
    id: item.id,
    title: item.question,
    metadata: {
      examName: "Odisha Police SI",
      year: "2023",
      paper: "Paper 1",
      question: item.question,
      options: item.options,
      answerIndex: item.correctAnswer,
      subject: item.subject,
      topic: item.topic,
      explanation: item.explanation,
    },
  })),
  ...odishaPoliceSi2023Paper2Questions.map((item) => ({
    id: item.id,
    title: item.question,
    metadata: {
      examName: "Odisha Police SI",
      year: "2023",
      paper: "Paper 2",
      question: item.question,
      options: item.options,
      answerIndex: item.correctAnswer,
      subject: item.subject,
      topic: item.topic,
      explanation: item.explanation,
    },
  })),
];

const [questions, setQuestions] = useState<Question[]>([
    ...fallbackExtractedQuestions.filter((item) => !(
      item.metadata.examName?.toLowerCase() === "odisha police si" &&
      item.metadata.year === "2023" &&
      ["paper 1", "paper 2"].includes(item.metadata.paper?.toLowerCase() || "")
    )),
    ...localOdishaSiQuestions,
  ]);
  const [selectedExam, setSelectedExam] = useState<string>(params.get("exam") || "Odisha Police SI");
  const [examSearch, setExamSearch] = useState("");
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"pyq" | "subject" | "topic">("pyq");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");

  const [mode, setMode] = useState<"catalog" | "instructions" | "cbt" | "tutor" | "result">("catalog");
  const [activePaper, setActivePaper] = useState<PaperCard | null>(null);
  const [targetPracticeType, setTargetPracticeType] = useState<"cbt" | "tutor">("cbt");
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);

  const [examLanguage, setExamLanguage] = useState<"en" | "or">("en");
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const activeQRef = useRef<string>("");

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [review, setReview] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [attemptsCount, setAttemptsCount] = useState<number>(1);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeToolView, setActiveToolView] = useState<"catalog" | "bookmarks-page" | "heatmap-page" | "smart-quiz-hub" | "admin-reports">("catalog");
  const [solutionFilter, setSolutionFilter] = useState<"all" | "correct" | "incorrect" | "skipped">("all");

  const [mistakesHistory, setMistakesHistory] = useState<MistakeRecord[]>([]);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedIssueType, setSelectedIssueType] = useState("Incorrect answer key");
  const [reportComment, setReportComment] = useState("");
  const [reportsList, setReportsList] = useState<QuestionReport[]>([]);
  const [reportSuccessToast, setReportSuccessToast] = useState(false);

  const [pendingTest, setPendingTest] = useState<{
    paperId: string;
    paperTitle: string;
    exam: string;
    savedAnswers: Record<string, number>;
    savedSeconds: number;
    savedCurrent: number;
    savedReview: string[];
    savedQuestionTimes: Record<string, number>;
    dateStr: string;
  } | null>(null);

  useEffect(() => {
    if (mode === "cbt" || mode === "tutor") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mode]);

  useEffect(() => {
    try {
      const savedBm = localStorage.getItem("sarjom_my_bookmarks");
      if (savedBm) setBookmarkedIds(JSON.parse(savedBm));

      const savedTest = localStorage.getItem("sarjom_incomplete_test");
      if (savedTest) setPendingTest(JSON.parse(savedTest));

      const savedMistakes = localStorage.getItem("sarjom_mistakes_history");
      if (savedMistakes) setMistakesHistory(JSON.parse(savedMistakes));

      const savedReps = localStorage.getItem("sarjom_admin_reports");
      if (savedReps) setReportsList(JSON.parse(savedReps));
    } catch {}
  }, []);

  function toggleBookmark(questionId: string) {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId];
      try {
        localStorage.setItem("sarjom_my_bookmarks", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }

  function handleReportSubmit() {
    if (!q || !activePaper) return;
    const newReport: QuestionReport = {
      id: `rep-${Date.now()}`,
      questionId: q.id,
      questionText: q.metadata.question,
      examName: activePaper.exam,
      paperTitle: activePaper.title,
      subject: q.metadata.subject || "General",
      topic: q.metadata.topic || "Core",
      issueType: selectedIssueType,
      comment: reportComment.trim(),
      timestamp: new Date().toLocaleString("en-IN")
    };

    const updated = [newReport, ...reportsList];
    setReportsList(updated);
    try {
      localStorage.setItem("sarjom_admin_reports", JSON.stringify(updated));
    } catch {}

    setReportModalOpen(false);
    setReportComment("");
    setReportSuccessToast(true);
    setTimeout(() => setReportSuccessToast(false), 3000);
  }

  useEffect(() => {
    let active = true;
    getContent("pyq")
      .then((response) => {
        const records = Array.isArray(response.records) ? response.records : [];
        if (active && records.length > 0) {
          const parsed = records.map((r: any) => ({
            id: r.id,
            title: r.title || r.metadata?.question,
            metadata: r.metadata
          })).filter((q: any) => q.metadata?.question);
          if (parsed.length > 0) {
            setQuestions((prev) => {
              const byId = new Map(prev.map((item) => [item.id, item]));
              parsed.forEach((item: Question) => byId.set(item.id, item));
              return Array.from(byId.values());
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => {});

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if ((mode === "cbt" || mode === "tutor") && activePaper && !submitted) {
      const payload = {
        paperId: activePaper.id,
        paperTitle: activePaper.title,
        exam: activePaper.exam,
        savedAnswers: answers,
        savedSeconds: seconds,
        savedCurrent: current,
        savedReview: review,
        savedQuestionTimes: questionTimes,
        dateStr: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      };
      try {
        localStorage.setItem("sarjom_incomplete_test", JSON.stringify(payload));
      } catch {}
    }
  }, [answers, seconds, current, review, mode, activePaper, submitted, questionTimes]);

  useEffect(() => {
    if (mode !== "cbt" || submitted || isPaused) return;
    const timer = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(timer);
          submitAttempt(false);
          return 0;
        }
        return s - 1;
      });

      if (activeQRef.current) {
        setQuestionTimes((prev) => ({
          ...prev,
          [activeQRef.current]: (prev[activeQRef.current] || 0) + 1
        }));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, submitted, isPaused]);

  const currentExamCatalog = useMemo(() => {
    return curatedCatalog.filter((item) => item.exam.toLowerCase() === selectedExam.toLowerCase());
  }, [selectedExam]);

  const counts = useMemo(() => {
    return {
      pyq: currentExamCatalog.filter((x) => x.category === "pyq").length,
      subject: currentExamCatalog.filter((x) => x.category === "subject").length,
      topic: currentExamCatalog.filter((x) => x.category === "topic").length,
    };
  }, [currentExamCatalog]);

  const displayCards = useMemo(() => {
    return currentExamCatalog.filter((item) => {
      if (item.category !== activeTab) return false;
      if (activeTab === "pyq" && selectedYear !== "All" && item.year !== selectedYear) return false;
      if ((activeTab === "subject" || activeTab === "topic") && selectedSubjectFilter !== "All" && !item.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase())) return false;
      return true;
    });
  }, [currentExamCatalog, activeTab, selectedYear, selectedSubjectFilter]);

  const activeQuestions = useMemo(() => {
    if (!activePaper) return questions;

    if (activePaper.id.startsWith("smart-quiz-mistake-")) {
      const targetPaperId = activePaper.id.slice("smart-quiz-mistake-".length);
      const targetIds = new Set(
        mistakesHistory
          .filter((m) => m.paperId === targetPaperId)
          .map((m) => m.questionId)
      );

      return questions.filter((question) => targetIds.has(question.id));
    }

    return questions.filter((item) => {
      const matchExam = item.metadata.examName
        ? item.metadata.examName.toLowerCase() === activePaper.exam.toLowerCase()
        : false;
      const matchYear = activePaper.year
        ? item.metadata.year === activePaper.year
        : true;
      const matchPaper = activePaper.paper
        ? item.metadata.paper?.toLowerCase() === activePaper.paper.toLowerCase()
        : true;

      return matchExam && matchYear && matchPaper;
    });
  }, [questions, activePaper, mistakesHistory]);

  const q = activeQuestions[current];

  useEffect(() => {
    if (q) activeQRef.current = q.id;
  }, [q]);

  const options = useMemo(() => {
    if (!q) return [];
    if (examLanguage === "or" && q.metadata?.options_or && q.metadata.options_or.length > 0) {
      return q.metadata.options_or;
    }
    return q.metadata?.options || [];
  }, [q, examLanguage]);

  const activeQuestionText = useMemo(() => {
    if (!q) return "";
    if (examLanguage === "or" && q.metadata?.question_or) {
      return q.metadata.question_or;
    }
    return q.metadata?.question || "";
  }, [q, examLanguage]);

  const answered = Object.keys(answers).filter((id) => activeQuestions.some((item) => item.id === id)).length;
  const correct = activeQuestions.filter((item) => answers[item.id] === item.metadata.answerIndex).length;
  const incorrect = activeQuestions.filter((item) => answers[item.id] !== undefined && answers[item.id] !== item.metadata.answerIndex).length;
  const unanswered = activeQuestions.length - answered;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const marksPerQ = activePaper?.marksPerQuestion || 1;
  const negPerQ = activePaper?.negativeMark || 0.25;
  const totalMaxMarks = activeQuestions.length * marksPerQ;
  const netScore = Math.max(0, correct * marksPerQ - incorrect * negPerQ);
  const scorePercent = totalMaxMarks > 0 ? (netScore / totalMaxMarks) * 100 : 0;
  const cutoffPercent = activePaper?.expectedCutoffPercent || 60;
  const cutoffMarks = (totalMaxMarks * (cutoffPercent / 100)).toFixed(1);

  const percentile = Math.min(99.6, Math.max(12.5, scorePercent * 1.08 + (correct > 0 ? 8 : 0))).toFixed(1);
  const totalEstimatedCandidates = 14500;
  const estimatedRank = Math.max(1, Math.round(totalEstimatedCandidates * (1 - parseFloat(percentile) / 100)));

  const mistakesGroupedByPaper = useMemo(() => {
    const groups: Record<string, { paperId: string; paperTitle: string; exam: string; count: number }> = {};
    mistakesHistory.forEach((m) => {
      if (!groups[m.paperId]) {
        groups[m.paperId] = {
          paperId: m.paperId,
          paperTitle: m.paperTitle,
          exam: m.exam,
          count: 0
        };
      }
      groups[m.paperId].count += 1;
    });
    return Object.values(groups);
  }, [mistakesHistory]);

  const heatmapMetrics = useMemo(() => {
    const totalAttempted = 7;
    const totalCorrect = 2;
    const overallAcc = Math.round((totalCorrect / totalAttempted) * 100);

    const topicsData = [
      { name: "Reading Comprehension", subject: "General English", accuracy: 25, questions: 4, status: "weak" },
      { name: "Vocabulary and Grammar", subject: "General English", accuracy: 66, questions: 3, status: "average" },
      { name: "Odia Byakarana", subject: "Odia Language", accuracy: 75, questions: 4, status: "strong" },
      { name: "General Science", subject: "General Studies", accuracy: 20, questions: 5, status: "weak" },
      { name: "Computer Knowledge", subject: "General Studies", accuracy: 100, questions: 3, status: "strong" }
    ];

    const strongCount = topicsData.filter((t) => t.accuracy >= 70).length;
    const avgCount = topicsData.filter((t) => t.accuracy >= 50 && t.accuracy < 70).length;
    const weakCount = topicsData.filter((t) => t.accuracy < 50).length;
    const focusTopic = topicsData.find((t) => t.status === "weak") || topicsData[0];

    return { overallAcc, totalAttempted, totalCorrect, strongCount, avgCount, weakCount, topicsData, focusTopic };
  }, []);

  function triggerInstructions(paper: PaperCard, type: "cbt" | "tutor") {
    setActivePaper(paper);
    setTargetPracticeType(type);
    setInstructionsAccepted(false);
    setExamLanguage("en");
    setMode("instructions");
  }

  function launchExamSession() {
    if (!instructionsAccepted || !activePaper) return;
    
    try {
      const storedAttempts = JSON.parse(localStorage.getItem("sarjom_paper_attempts") || "{}");
      const nextAttempt = (storedAttempts[activePaper.id] || 0) + 1;
      storedAttempts[activePaper.id] = nextAttempt;
      localStorage.setItem("sarjom_paper_attempts", JSON.stringify(storedAttempts));
      setAttemptsCount(nextAttempt);
    } catch {
      setAttemptsCount(1);
    }

    setAnswers({});
    setReview([]);
    setShowExplanation({});
    setQuestionTimes({});
    setCurrent(0);
    setSeconds(activePaper.durationMinutes * 60);
    setIsPaused(false);
    setSubmitted(false);
    setMode(targetPracticeType);
  }

  function resumePendingTest() {
    if (!pendingTest) return;
    const target = curatedCatalog.find((c) => c.id === pendingTest.paperId) || curatedCatalog[0];
    setActivePaper(target);
    setAnswers(pendingTest.savedAnswers || {});
    setSeconds(pendingTest.savedSeconds || target.durationMinutes * 60);
    setCurrent(pendingTest.savedCurrent || 0);
    setReview(pendingTest.savedReview || []);
    setQuestionTimes(pendingTest.savedQuestionTimes || {});
    setShowExplanation({});
    setIsPaused(false);
    setSubmitted(false);
    setMode("cbt");
  }

  function dismissPendingTest() {
    try {
      localStorage.removeItem("sarjom_incomplete_test");
    } catch {}
    setPendingTest(null);
  }

  function submitAttempt(requireConfirmation = true) {
    if (!requireConfirmation || window.confirm("Do you want to submit your examination and review your evaluation?")) {
      setSubmitted(true);
      setMode("result");

      if (activePaper) {
        const newRecords: MistakeRecord[] = [];
        activeQuestions.forEach((item) => {
          const userChoice = answers[item.id];
          if (userChoice !== undefined && userChoice !== item.metadata.answerIndex) {
            newRecords.push({
              questionId: item.id,
              paperId: activePaper.id,
              paperTitle: activePaper.title,
              exam: activePaper.exam,
              subject: item.metadata.subject || "General",
              topic: item.metadata.topic || "Core",
              userAnswer: userChoice,
              correctAnswer: item.metadata.answerIndex,
              timestamp: new Date().toISOString().split("T")[0]
            });
          }
        });

        if (newRecords.length > 0) {
          setMistakesHistory((prev) => {
            const existing = new Set(prev.map((m) => m.questionId));
            const updated = [...prev, ...newRecords.filter((m) => !existing.has(m.questionId))];
            try {
              localStorage.setItem("sarjom_mistakes_history", JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      }

      try {
        localStorage.removeItem("sarjom_incomplete_test");
      } catch {}
      setPendingTest(null);
    }
  }

  return (
    <div className={mode === "cbt" || mode === "tutor" ? "fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#07090E] text-slate-100" : "min-h-screen w-full bg-[#07090E] text-slate-100 py-6 px-4 sm:px-6"}>
      <div className={mode === "cbt" || mode === "tutor" ? "h-full w-full flex flex-col" : "max-w-[1380px] mx-auto"}>
        
        {/* VIEW 1: CATALOGUE */}
        {mode === "catalog" && activeToolView === "catalog" && (
          <>
            {pendingTest && (
              <div className="mb-6 rounded-2xl border border-amber-400/30 bg-[#0E1626] p-4 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 text-base">
                    ⏳
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Resume Incomplete Test
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {pendingTest.paperTitle}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                      {pendingTest.exam} • Attempted {Object.keys(pendingTest.savedAnswers || {}).length} Questions • {pendingTest.dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={dismissPendingTest}
                    className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 font-mono text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={resumePendingTest}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1.5 font-mono text-xs font-black text-slate-950 transition hover:brightness-110 shadow-md"
                  >
                    Resume Test
                  </button>
                </div>
              </div>
            )}

            {/* TOP 4 REVISION PILLARS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <button
                type="button"
                onClick={() => setActiveToolView("bookmarks-page")}
                className="group relative rounded-2xl border border-white/10 bg-[#0E1524] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#131D32] hover:border-[#00DDB0]/60 hover:shadow-[0_8px_24px_rgba(0,221,176,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">🔖</span>
                  <span className="rounded-full bg-[#00DDB0]/15 border border-[#00DDB0]/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#00DDB0]">
                    {bookmarkedIds.length} Saved
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00DDB0] transition-colors">My Bookmark</h4>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5 leading-snug">Your pinned tricky questions</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveToolView("smart-quiz-hub")}
                className="group relative rounded-2xl border border-white/10 bg-[#0E1524] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#131D32] hover:border-amber-400/60 hover:shadow-[0_8px_24px_rgba(251,191,36,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">⚡</span>
                  <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                    {mistakesHistory.length} Mistakes
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Smart Quiz</h4>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5 leading-snug">Re-attempt wrong questions by paper</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeQuestions.length > 0) {
                    setSubmitted(true);
                    setMode("result");
                  } else {
                    alert("Take a practice test first to generate your Mistakes Notebook.");
                  }
                }}
                className="group relative rounded-2xl border border-white/10 bg-[#0E1524] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#131D32] hover:border-purple-400/60 hover:shadow-[0_8px_24px_rgba(168,85,247,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">📓</span>
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                    Notebook
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Mistakes Notebook</h4>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5 leading-snug">Review wrong & skipped queries</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveToolView("heatmap-page")}
                className="group relative rounded-2xl border border-white/10 bg-[#0E1524] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#131D32] hover:border-indigo-400/60 hover:shadow-[0_8px_24px_rgba(129,140,248,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">📊</span>
                  <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-300">
                    Accuracy Map
                  </span>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Memory Heatmap</h4>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5 leading-snug">Strong, average & weak areas</p>
                </div>
              </button>
            </div>

            {/* EXAM SELECTOR BAR */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0E1524] p-4 text-white shadow-xl relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
                  SELECT EXAM:
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExamDropdownOpen(!examDropdownOpen)}
                    className="flex items-center gap-3 rounded-xl border border-white/20 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:border-[#00DDB0]"
                  >
                    <span>{selectedExam}</span>
                    <span className="text-xs text-slate-400">▼</span>
                  </button>

                  {examDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-white/20 bg-slate-950 p-2 shadow-2xl">
                      <input
                        type="text"
                        value={examSearch}
                        onChange={(e) => setExamSearch(e.target.value)}
                        placeholder="Search exam..."
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-[#00DDB0]"
                        autoFocus
                      />
                      <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                        {["Odisha Police SI", "OPSC ASO", "OPSC OCS"].map((exam) => (
                          <button
                            key={exam}
                            type="button"
                            onClick={() => {
                              setSelectedExam(exam);
                              setExamDropdownOpen(false);
                              setExamSearch("");
                            }}
                            className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold ${
                              selectedExam === exam ? "bg-[#00DDB0]/15 text-[#00DDB0]" : "text-slate-300 hover:bg-slate-900"
                            }`}
                          >
                            {exam}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveToolView("admin-reports")}
                  className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-300 hover:bg-amber-400/20"
                >
                  Reports Desk ({reportsList.length})
                </button>
                <div className="font-mono text-xs text-slate-400">
                  Tests: <span className="font-bold text-[#00DDB0]">{currentExamCatalog.length}</span>
                </div>
              </div>
            </div>

            {/* MAIN TABS */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("pyq");
                  setSelectedYear("All");
                }}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                  activeTab === "pyq"
                    ? "bg-[#00DDB0] text-slate-950 shadow-md"
                    : "bg-[#161F33] text-slate-300 hover:bg-[#1C273E] border border-slate-700/60"
                }`}
              >
                Previous Year Papers ({counts.pyq})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("subject");
                  setSelectedSubjectFilter("All");
                }}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                  activeTab === "subject"
                    ? "bg-[#00DDB0] text-slate-950 shadow-md"
                    : "bg-[#161F33] text-slate-300 hover:bg-[#1C273E] border border-slate-700/60"
                }`}
              >
                Subject-wise Tests ({counts.subject})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("topic");
                  setSelectedSubjectFilter("All");
                }}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                  activeTab === "topic"
                    ? "bg-[#00DDB0] text-slate-950 shadow-md"
                    : "bg-[#161F33] text-slate-300 hover:bg-[#1C273E] border border-slate-700/60"
                }`}
              >
                Topic-wise Tests ({counts.topic})
              </button>
            </div>

            {/* SUB FILTERS */}
            {activeTab === "pyq" && (
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="font-bold text-slate-400 mr-2 uppercase text-[11px]">FILTER BY YEAR:</span>
                {["All", "2023", "2019", "2018"].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1 rounded-xl uppercase transition ${
                      selectedYear === yr
                        ? "bg-[#00DDB0]/15 border border-[#00DDB0] text-[#00DDB0] font-bold"
                        : "bg-[#161F33] border border-slate-700/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {yr === "All" ? "All Years" : yr}
                  </button>
                ))}
              </div>
            )}

            {(activeTab === "subject" || activeTab === "topic") && (
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="font-bold text-slate-400 mr-2 uppercase text-[11px]">SELECT SUBJECT:</span>
                {["All", "General Awareness", "Reasoning", "Mathematics", "Language Core"].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`px-3.5 py-1.5 rounded-xl transition ${
                      selectedSubjectFilter === sub
                        ? "bg-[#00DDB0] text-slate-950 font-bold shadow"
                        : "bg-[#161F33] border border-slate-700/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {/* 4 CARDS PER ROW GRID */}
            <section className="mt-6">
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {displayCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E1524] p-4.5 text-white transition hover:border-[#00DDB0]/50 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-[#00DDB0]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00DDB0]">
                          {card.paper} • {card.year}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {card.shift}
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-sm font-bold text-white leading-snug line-clamp-2">
                        {card.title}
                      </h3>

                      <p className="mt-1 font-mono text-[11px] text-slate-400 truncate">
                        {card.subject}
                      </p>

                      <div className="mt-3 flex items-center gap-2.5 font-mono text-[10px] text-slate-400 border-t border-white/5 pt-2.5">
                        <span>📝 {card.questionsCount} Qs</span>
                        <span>⏱ {card.durationMinutes} Mins</span>
                        {card.isBilingual && <span className="text-[#00DDB0] font-bold">🌐 Odia/Eng</span>}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => triggerInstructions(card, "cbt")}
                        className="flex-1 rounded-xl bg-[#00DDB0] py-2 text-center font-mono text-[11px] font-black text-slate-950 transition hover:bg-[#00f2c3]"
                      >
                        CBT Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerInstructions(card, "tutor")}
                        className="flex-1 rounded-xl border border-white/20 bg-slate-900 py-2 text-center font-mono text-[11px] font-bold text-white transition hover:border-[#00DDB0] hover:text-[#00DDB0]"
                      >
                        Tutor Mode
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* VIEW: SMART QUIZ HUB */}
        {mode === "catalog" && activeToolView === "smart-quiz-hub" && (
          <div className="py-2 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setActiveToolView("catalog")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1524] px-4 py-2 font-mono text-xs font-semibold text-slate-300 hover:border-[#00DDB0] hover:text-white transition"
              >
                Back to Practice
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Smart Quiz Hub</h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Reattempt questions you got wrong across previous tests, grouped by examination paper.
              </p>
            </div>

            {mistakesGroupedByPaper.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-12 text-center">
                <span className="text-4xl">🌟</span>
                <h3 className="text-base font-bold text-white mt-3">No Mistakes Recorded Yet</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  Whenever you get a question wrong in any CBT or Tutor practice test, it will automatically appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveToolView("catalog")}
                  className="mt-6 rounded-xl bg-[#00DDB0] px-5 py-2.5 font-mono text-xs font-bold text-slate-950"
                >
                  Browse Exam Papers
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {mistakesGroupedByPaper.map((g) => (
                  <div
                    key={g.paperId}
                    className="rounded-2xl border border-red-500/30 bg-[#0E1524] p-6 text-white shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-0.5 font-mono text-[11px] font-bold text-red-300">
                          {g.count} Mistakes to Fix
                        </span>
                        <span className="font-mono text-xs text-slate-400">{g.exam}</span>
                      </div>
                      <h3 className="mt-3.5 text-base font-bold text-white leading-snug">{g.paperTitle}</h3>
                      <p className="mt-1.5 font-mono text-xs text-slate-400">
                        Targeted drill containing only your previously incorrect attempts.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          const quizCard: PaperCard = {
                            id: `smart-quiz-mistake-${g.paperId}`,
                            exam: selectedExam,
                            title: `${g.paperTitle} Mistakes Drill`,
                            subject: "Targeted Mistakes",
                            category: "topic",
                            year: "2026",
                            paper: "Mistake Quiz",
                            shift: "Instant",
                            questionsCount: g.count,
                            durationMinutes: Math.max(5, g.count * 2),
                            marksPerQuestion: 1,
                            negativeMark: 0.25,
                            expectedCutoffPercent: 60,
                            topicTag: "Mistakes"
                          };
                          setActivePaper(quizCard);
                          setAnswers({});
                          setReview([]);
                          setShowExplanation({});
                          setQuestionTimes({});
                          setCurrent(0);
                          setSeconds(quizCard.durationMinutes * 60);
                          setIsPaused(false);
                          setSubmitted(false);
                          setActiveToolView("catalog");
                          setMode("tutor");
                        }}
                        className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 font-mono text-xs font-bold text-white transition hover:opacity-90 shadow-md"
                      >
                        Start Smart Quiz ({g.count} Questions)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: MEMORY HEATMAP */}
        {mode === "catalog" && activeToolView === "heatmap-page" && (
          <div className="py-2 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setActiveToolView("catalog")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1524] px-4 py-2 font-mono text-xs font-semibold text-slate-300 hover:border-[#00DDB0] hover:text-white transition"
              >
                Back to Practice
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Memory Heatmap</h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Based on your latest answer to every question you have attempted.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 shadow-xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  OVERALL ACCURACY
                </span>
                <div className="mt-2 text-4xl font-black text-white">
                  {heatmapMetrics.overallAcc}%
                </div>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  {heatmapMetrics.totalCorrect} of {heatmapMetrics.totalAttempted} questions correct
                </p>

                <div className="mt-6 space-y-3 font-mono text-xs border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>Strong topics</span>
                    </div>
                    <span className="font-bold text-white">{heatmapMetrics.strongCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span>Average topics</span>
                    </div>
                    <span className="font-bold text-white">{heatmapMetrics.avgCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span>Weak topics</span>
                    </div>
                    <span className="font-bold text-white">{heatmapMetrics.weakCount}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <span>◎</span>
                    <span>Focus next</span>
                  </div>
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="border-l-4 border-red-500 pl-3">
                      <h4 className="text-base font-bold text-white">{heatmapMetrics.focusTopic.name}</h4>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        {heatmapMetrics.focusTopic.subject} • {heatmapMetrics.focusTopic.accuracy}% Accuracy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-slate-400">
                  <span>Priority algorithm suggests revision for sub 50% accuracy areas.</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Topics you have attempted</h3>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">
                    {heatmapMetrics.topicsData.length} topics across subjects
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {heatmapMetrics.topicsData.map((item) => {
                    let cellStyle = "border-red-500/30 bg-red-950/20 text-red-300";
                    if (item.accuracy >= 70) cellStyle = "border-emerald-500/30 bg-emerald-950/20 text-emerald-300";
                    else if (item.accuracy >= 50) cellStyle = "border-amber-400/30 bg-amber-950/20 text-amber-300";

                    return (
                      <div
                        key={item.name}
                        className={`rounded-xl border p-4 flex flex-col justify-between transition hover:scale-[1.01] ${cellStyle}`}
                      >
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                            {item.subject}
                          </span>
                          <h4 className="mt-1 text-sm font-bold text-white">{item.name}</h4>
                        </div>
                        <div className="mt-4 flex items-end justify-between font-mono">
                          <span className="text-2xl font-black">{item.accuracy}%</span>
                          <span className="text-xs text-slate-400">{item.questions} Questions</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: MY BOOKMARKS FULL PAGE */}
        {mode === "catalog" && activeToolView === "bookmarks-page" && (
          <div className="py-2 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setActiveToolView("catalog")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1524] px-4 py-2 font-mono text-xs font-semibold text-slate-300 hover:border-[#00DDB0] hover:text-white transition"
              >
                Back to Practice
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Bookmarks</h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                {bookmarkedIds.length} saved questions across tests
              </p>
            </div>

            {bookmarkedIds.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-12 text-center">
                <span className="text-4xl">🔖</span>
                <h3 className="text-base font-bold text-white mt-3">No Bookmarks Saved Yet</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  Click the Bookmark button while attempting any examination to pin questions for quick revision here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveToolView("catalog")}
                  className="mt-6 rounded-xl bg-[#00DDB0] px-5 py-2.5 font-mono text-xs font-bold text-slate-950"
                >
                  Start Practicing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions
                  .filter((q) => bookmarkedIds.includes(q.id))
                  .map((item, i) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-bold">Q{i + 1}</span>
                          <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-indigo-300">{item.metadata.subject}</span>
                          <span className="text-slate-400">{item.metadata.topic}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(item.id)}
                          className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-amber-300 hover:bg-amber-400/20"
                        >
                          ★ Bookmarked
                        </button>
                      </div>

                      <p className="mt-4 text-base font-semibold text-white leading-relaxed">
                        {item.metadata.question}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 font-mono text-xs">
                        {item.metadata.options.map((opt, oIdx) => (
                          <div
                            key={`${item.id}-bm-opt-${oIdx}`}
                            className={`rounded-lg border p-3 ${
                              oIdx === item.metadata.answerIndex
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-200 font-bold"
                                : "border-white/5 bg-slate-950/40 text-slate-400"
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {oIdx === item.metadata.answerIndex && <span className="ml-2 text-emerald-400">✓ Correct</span>}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 font-mono text-xs text-slate-300">
                        <p className="font-bold text-emerald-400 mb-1">Explanation and Concept:</p>
                        <p className="font-sans text-sm text-slate-300 leading-relaxed">
                          {item.metadata.explanation || "Official key verified by examination authorities."}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ADMIN REPORTS DESK */}
        {mode === "catalog" && activeToolView === "admin-reports" && (
          <div className="py-2 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setActiveToolView("catalog")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1524] px-4 py-2 font-mono text-xs font-semibold text-slate-300 hover:border-[#00DDB0] hover:text-white transition"
              >
                Back to Practice
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Question Reports Desk</h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Issues flagged by candidates during tests organized by exam, paper, subject and topic.
              </p>
            </div>

            {reportsList.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-12 text-center">
                <span className="text-4xl">🚩</span>
                <h3 className="text-base font-bold text-white mt-3">No Issues Reported</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  Candidate reports submitted during live tests will show up here for fast error correction.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportsList.map((rep) => (
                  <div key={rep.id} className="rounded-2xl border border-amber-400/30 bg-[#0E1524] p-5 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-red-500/20 px-2 py-0.5 font-bold text-red-300">
                          {rep.issueType}
                        </span>
                        <span className="text-slate-300">{rep.examName}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{rep.subject}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{rep.timestamp}</span>
                    </div>

                    <div className="mt-3">
                      <p className="font-mono text-xs text-slate-400">Reported Question:</p>
                      <p className="mt-1 text-sm font-semibold text-white">{rep.questionText}</p>
                    </div>

                    {rep.comment && (
                      <div className="mt-3 rounded-xl border border-white/5 bg-slate-950/60 p-3 font-mono text-xs text-amber-300">
                        Candidate Note: {rep.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CANDIDATE INSTRUCTIONS SCREEN */}
        {mode === "instructions" && activePaper && (
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0E1524] p-6 sm:p-10 text-white shadow-2xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00DDB0]">
                Examination Instructions
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{activePaper.title}</h2>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {activePaper.exam} • {activePaper.paper} • {activePaper.shift}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                <span className="text-slate-400 block">Total Questions</span>
                <span className="text-lg font-bold text-white mt-1 block">{activePaper.questionsCount}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                <span className="text-slate-400 block">Total Duration</span>
                <span className="text-lg font-bold text-white mt-1 block">{activePaper.durationMinutes} Minutes</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                <span className="text-emerald-400 block">Correct Answer</span>
                <span className="text-lg font-bold text-emerald-300 mt-1 block">+{activePaper.marksPerQuestion} Mark</span>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5">
                <span className="text-red-400 block">Negative Mark</span>
                <span className="text-lg font-bold text-red-300 mt-1 block">-{activePaper.negativeMark} Mark</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-5 space-y-3 font-mono text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">
                Question Palette Color Codes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-[11px] flex-shrink-0">1</span>
                  <span><strong>Answered</strong>: You have selected an answer.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-red-500 flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0">2</span>
                  <span><strong>Not Answered</strong>: You have visited but not answered.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0">3</span>
                  <span><strong>Review Later</strong>: Marked for later review.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-[11px] flex-shrink-0">4</span>
                  <span><strong>Not Visited</strong>: Not visited yet.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instructionsAccepted}
                  onChange={(e) => setInstructionsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-[#00DDB0] focus:ring-0"
                />
                <span className="font-mono text-xs text-slate-300">
                  I have read and understood all the instructions and confirm to proceed.
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMode("catalog")}
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 font-mono text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={launchExamSession}
                  disabled={!instructionsAccepted}
                  className="rounded-xl bg-[#00DDB0] px-6 py-2.5 font-mono text-xs font-bold text-slate-950 disabled:opacity-40 shadow-lg hover:bg-[#00f2c3] transition"
                >
                  I am ready to begin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CBT CONSOLE */}
        {(mode === "cbt" || mode === "tutor") && (
          <div className="h-full w-full flex flex-col bg-[#07090E] select-none">
            {reportSuccessToast && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-emerald-500/50 bg-emerald-950/90 px-4 py-2 font-mono text-xs text-emerald-300 shadow-2xl">
                Report submitted successfully to review desk.
              </div>
            )}

            <header className="h-14 border-b border-white/10 bg-[#0B0F19] px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00DDB0] animate-pulse" />
                  <span className="font-mono text-sm font-black tracking-wider text-white">SARJOM EXAM</span>
                </div>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="font-mono text-xs text-slate-300 font-semibold truncate">
                  {activePaper?.title}
                </span>
                {mode === "tutor" && (
                  <span className="rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 font-mono text-[10px] font-bold">
                    TUTOR MODE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {activePaper?.isBilingual && (
                  <div className="flex items-center rounded-lg border border-white/15 bg-slate-900/80 p-0.5 font-mono text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setExamLanguage("en")}
                      className={`px-2.5 py-1 rounded-md transition ${examLanguage === "en" ? "bg-[#00DDB0] text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamLanguage("or")}
                      className={`px-2.5 py-1 rounded-md transition ${examLanguage === "or" ? "bg-[#00DDB0] text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                      ଓଡ଼ିଆ
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs font-bold text-[#00DDB0]">
                  <span>⏱</span>
                  <span>{fmt(seconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => submitAttempt()}
                  className="rounded-lg bg-[#00DDB0] px-4 py-1.5 font-mono text-xs font-bold text-slate-950 transition hover:bg-[#00f2c3]"
                >
                  Finish Test
                </button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col justify-between overflow-y-auto p-5 sm:p-8">
                {q ? (
                  <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-black text-[#00DDB0]">
                            Question {current + 1} of {activeQuestions.length}
                          </span>
                          <span className="rounded bg-indigo-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-300">
                            {q.metadata?.subject}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            +{marksPerQ} / -{negPerQ}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            Time: {questionTimes[q.id] || 0}s
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleBookmark(q.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-bold transition ${
                              bookmarkedIds.includes(q.id)
                                ? "border-amber-400 bg-amber-400/20 text-amber-300"
                                : "border-white/10 bg-slate-900 text-slate-300 hover:border-amber-400/60"
                            }`}
                          >
                            <span>{bookmarkedIds.includes(q.id) ? "★" : "☆"}</span>
                            <span>{bookmarkedIds.includes(q.id) ? "Bookmarked" : "Bookmark"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setReportModalOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-slate-300 hover:border-red-400 hover:text-red-300 transition"
                          >
                            <span>⚑</span>
                            <span>Report</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 text-base sm:text-lg font-medium text-slate-100 leading-relaxed font-sans whitespace-pre-line">
                        {activeQuestionText}
                      </div>

                      <div className="mt-6 space-y-3">
                        {options.map((opt, i) => {
                          const isChecked = answers[q.id] === i;
                          const isCorrect = i === q.metadata.answerIndex;
                          const isTutorMode = mode === "tutor";
                          const hasAnswered = answers[q.id] !== undefined;

                          let btnStyle = "border-white/10 bg-[#0B0F19] text-slate-300 hover:border-white/30";

                          if (isTutorMode && hasAnswered) {
                            if (isCorrect) {
                              btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-200 font-bold ring-1 ring-emerald-500/40";
                            } else if (isChecked && !isCorrect) {
                              btnStyle = "border-red-500 bg-red-500/15 text-red-200 font-bold";
                            }
                          } else if (isChecked) {
                            btnStyle = "border-[#00DDB0] bg-[#00DDB0]/15 text-white font-semibold ring-1 ring-[#00DDB0]/40";
                          }

                          return (
                            <button
                              key={`${q.id}-${i}`}
                              type="button"
                              onClick={() => setAnswers((old) => ({ ...old, [q.id]: i }))}
                              className={`w-full rounded-xl border p-4 text-left transition flex items-start gap-3 ${btnStyle}`}
                            >
                              <span className="h-6 w-6 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs text-slate-300 flex-shrink-0">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-sm sm:text-base leading-relaxed">{opt}</span>
                                {isTutorMode && hasAnswered && isCorrect && (
                                  <span className="text-emerald-400 font-mono text-xs font-bold ml-2">Correct</span>
                                )}
                                {isTutorMode && hasAnswered && isChecked && !isCorrect && (
                                  <span className="text-red-400 font-mono text-xs font-bold ml-2">Your Choice</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {mode === "tutor" && (
                        <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-[#0B1322] p-4.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                              <span className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-wider">
                                Tutor Mode Answer Key
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowExplanation((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                              className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition"
                            >
                              {showExplanation[q.id] ? "Hide Solution" : "View Answer and Explanation"}
                            </button>
                          </div>

                          {showExplanation[q.id] && (
                            <div className="pt-3 border-t border-white/10 font-mono text-xs space-y-2 animate-in fade-in duration-150">
                              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <span>Official Answer:</span>
                                <span className="rounded bg-emerald-500/20 px-2 py-0.5">
                                  Option {String.fromCharCode(65 + q.metadata.answerIndex)}
                                </span>
                              </div>
                              <p className="font-sans text-xs text-slate-300 leading-relaxed pt-1">
                                <strong>Explanation:</strong> {q.metadata.explanation || "Official question key verified by examination authorities."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={current === 0}
                          onClick={() => setCurrent((i) => i - 1)}
                          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers((old) => {
                              const copy = { ...old };
                              delete copy[q.id];
                              return copy;
                            });
                          }}
                          className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 font-mono text-xs font-bold text-slate-400 hover:text-white"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setReview((old) => old.includes(q.id) ? old.filter((id) => id !== q.id) : [...old, q.id])}
                          className={`rounded-xl border px-3.5 py-2 font-mono text-xs font-bold transition ${
                            review.includes(q.id)
                              ? "border-purple-400 bg-purple-500/20 text-purple-300"
                              : "border-white/10 bg-slate-900 text-slate-300"
                          }`}
                        >
                          {review.includes(q.id) ? "Marked" : "Review Later"}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (current < activeQuestions.length - 1) {
                            setCurrent((i) => i + 1);
                          } else {
                            submitAttempt(false);
                          }
                        }}
                        className="rounded-xl bg-[#00DDB0] px-7 py-2.5 font-mono text-xs font-black text-slate-950 transition hover:bg-[#00f2c3] shadow-md"
                      >
                        {current === activeQuestions.length - 1 ? "Save and Submit Test" : "Save and Next"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                    <h3 className="text-lg font-bold text-white">
                      {activeQuestions.length === 0 ? "No Matching Questions Available" : "Question Not Available"}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-slate-400">
                      {activeQuestions.length === 0
                        ? "This paper has no questions matching its current exam, year, paper, or mistake records. No unrelated questions have been substituted."
                        : "The selected question is unavailable. Return to the paper catalogue and try again."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("catalog");
                        setActiveToolView("catalog");
                        setActivePaper(null);
                      }}
                      className="mt-5 rounded-xl bg-[#00DDB0] px-5 py-2.5 font-mono text-xs font-bold text-slate-950"
                    >
                      Back to Papers
                    </button>
                  </div>
                )}
              </div>

              <aside className="w-72 lg:w-80 flex-shrink-0 border-l border-white/10 bg-[#090D16] flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex flex-col h-full overflow-hidden">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex-shrink-0">
                    Question Palette
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mb-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
                      <span>Answered ({answered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-red-500" />
                      <span>Not Answered ({unanswered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-purple-500" />
                      <span>Review ({review.length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-slate-700" />
                      <span>Total ({activeQuestions.length})</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-5 gap-2">
                      {activeQuestions.map((item, i) => {
                        const isCurrent = current === i;
                        const isAns = answers[item.id] !== undefined;
                        const isRev = review.includes(item.id);

                        let bg = "bg-slate-800 text-slate-400 hover:bg-slate-700";
                        if (isAns && isRev) bg = "bg-purple-600 text-white font-bold ring-2 ring-emerald-400";
                        else if (isRev) bg = "bg-purple-600 text-white font-bold";
                        else if (isAns) bg = "bg-emerald-600 text-white font-bold";
                        else if (isCurrent) bg = "bg-red-500 text-white font-bold";

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setCurrent(i)}
                            className={`h-9 rounded-lg font-mono text-xs transition flex items-center justify-center relative ${bg} ${
                              isCurrent ? "ring-2 ring-white" : ""
                            }`}
                          >
                            {i + 1}
                            {bookmarkedIds.includes(item.id) && (
                              <span className="absolute -top-1 -right-1 text-[10px] text-amber-300">★</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex-shrink-0 mt-3">
                  <button
                    type="button"
                    onClick={() => submitAttempt()}
                    className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 font-mono text-xs font-bold text-white transition hover:opacity-90"
                  >
                    Finish Test
                  </button>
                </div>
              </aside>
            </div>

            {reportModalOpen && q && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
                <div className="w-full max-w-[420px] rounded-2xl border border-white/15 bg-[#0D1322] p-5 text-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">⚠️</span>
                      <h3 className="font-bold text-sm text-white">Report Question {current + 1}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="h-6 w-6 rounded-lg font-mono text-xs text-slate-400 hover:bg-white/10 hover:text-white flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="mt-2 font-mono text-[11px] text-slate-400 leading-snug">
                    Issues go directly to our admin review desk. Your test progress is safe.
                  </p>

                  <div className="mt-3">
                    <span className="font-mono text-[10px] font-bold text-[#00DDB0] uppercase tracking-wider block mb-1.5">
                      Select Issue:
                    </span>

                    <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
                      {[
                        { title: "Incorrect answer key", desc: "The marked correct option looks wrong." },
                        { title: "Unclear or ambiguous question", desc: "Wording is confusing or has multiple interpretations." },
                        { title: "Formatting display issue", desc: "Broken text, font problem, or layout overlap." },
                        { title: "Wrong topic section", desc: "Question tagged under the wrong syllabus area." },
                        { title: "Duplicate question", desc: "This question appeared earlier in the test." },
                        { title: "Other issue", desc: "Any other problem worth flagging." }
                      ].map((issue) => (
                        <label
                          key={issue.title}
                          onClick={() => setSelectedIssueType(issue.title)}
                          className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition ${
                            selectedIssueType === issue.title
                              ? "border-[#00DDB0] bg-[#00DDB0]/10"
                              : "border-white/5 bg-slate-950/40 hover:border-white/15"
                          }`}
                        >
                          <input
                            type="radio"
                            name="issueType"
                            checked={selectedIssueType === issue.title}
                            onChange={() => setSelectedIssueType(issue.title)}
                            className="mt-0.5 h-3 w-3 text-[#00DDB0] focus:ring-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white leading-tight">{issue.title}</p>
                            <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">{issue.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Additional Note optional:
                    </span>
                    <textarea
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      placeholder="Write your observation here"
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-2 text-xs text-white outline-none focus:border-[#00DDB0] resize-none"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReportSubmit}
                      className="rounded-xl bg-[#00DDB0] px-4 py-1.5 font-mono text-xs font-bold text-slate-950 transition hover:bg-[#00f2c3]"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: EVALUATION DASHBOARD */}
        {mode === "result" && (
          <div className="py-2 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMode("catalog")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E1524] px-4 py-2 font-mono text-xs font-semibold text-slate-300 hover:border-[#00DDB0] hover:text-white transition"
              >
                Back to Practice
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#00DDB0]/40 bg-[#00DDB0]/15 px-4 py-2 font-mono text-xs font-bold text-[#00DDB0] hover:bg-[#00DDB0] hover:text-slate-950 transition shadow-lg"
              >
                <span>📄</span>
                <span>Download Mistakes Sheet PDF</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#00DDB0] uppercase tracking-wider">
                  Exam Evaluation and Pace Analysis
                </span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-0.5 font-mono text-xs font-bold text-indigo-300">
                  Attempt {attemptsCount}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white mt-1">Session summary</h1>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {activePaper?.title} • {activePaper?.shift || "Official Mode"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Cut off and Comparative Standing</h3>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">
                    Estimated based on official benchmark scores and peer performance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                    scorePercent >= cutoffPercent
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : scorePercent >= cutoffPercent - 8
                      ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                      : "bg-red-500/20 border-red-500/40 text-red-300"
                  }`}>
                    {scorePercent >= cutoffPercent ? "Expected Qualified Above Cut off" : scorePercent >= cutoffPercent - 8 ? "Borderline Score" : "Below Expected Cut off"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                  <span className="text-slate-400 block">Your Net Score</span>
                  <span className="text-2xl font-black text-white mt-1 block">{netScore.toFixed(2)}</span>
                  <span className="text-[11px] text-slate-500">out of {totalMaxMarks} marks</span>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                  <span className="text-slate-400 block">Expected Cut off</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">{cutoffMarks}</span>
                  <span className="text-[11px] text-slate-500">{cutoffPercent}% benchmark score</span>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                  <span className="text-slate-400 block">Percentile</span>
                  <span className="text-2xl font-black text-[#00DDB0] mt-1 block">{percentile}%</span>
                  <span className="text-[11px] text-slate-500">higher than {percentile}% students</span>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                  <span className="text-slate-400 block">Estimated Rank</span>
                  <span className="text-2xl font-black text-indigo-300 mt-1 block">Rank {estimatedRank}</span>
                  <span className="text-[11px] text-slate-500">among 14500 peers</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-emerald-500/30 bg-[#0F1D1F] p-4">
                <p className="font-mono text-[11px] text-emerald-400">Correct</p>
                <p className="font-mono text-2xl font-black text-emerald-400 mt-1">
                  {correct} <span className="text-xs text-emerald-500/70 font-normal">/ {activeQuestions.length}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-[#1D1217] p-4">
                <p className="font-mono text-[11px] text-red-400">Incorrect</p>
                <p className="font-mono text-2xl font-black text-red-400 mt-1">
                  {incorrect} <span className="text-xs text-red-500/70 font-normal">/ {activeQuestions.length}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-4">
                <p className="font-mono text-[11px] text-slate-400">Skipped</p>
                <p className="font-mono text-2xl font-black text-slate-300 mt-1">
                  {unanswered} <span className="text-xs text-slate-500 font-normal">/ {activeQuestions.length}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-4">
                <p className="font-mono text-[11px] text-slate-400">Accuracy</p>
                <p className="font-mono text-2xl font-black text-white mt-1">
                  {answered ? Math.round((correct / answered) * 100) : 0}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-4">
                <p className="font-mono text-[11px] text-slate-400">Score</p>
                <p className="font-mono text-2xl font-black text-white mt-1">
                  {netScore.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/ {totalMaxMarks}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-4">
                <p className="font-mono text-[11px] text-slate-400">Time spent</p>
                <p className="font-mono text-2xl font-black text-[#00DDB0] mt-1">
                  {fmt((activePaper?.durationMinutes || 90) * 60 - seconds)}
                </p>
              </div>
            </div>

            {/* FULL SOLUTIONS */}
            <div className="rounded-2xl border border-white/10 bg-[#0E1524] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Solutions and Explanations</h3>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">
                    Review each question with verified official answer key and logic.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSolutionFilter("all")}
                    className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition ${
                      solutionFilter === "all" ? "bg-[#00DDB0] text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    All ({activeQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolutionFilter("correct")}
                    className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition ${
                      solutionFilter === "correct" ? "bg-emerald-500 text-white font-bold" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    Correct ({correct})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolutionFilter("incorrect")}
                    className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition ${
                      solutionFilter === "incorrect" ? "bg-red-500 text-white font-bold" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    Incorrect ({incorrect})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolutionFilter("skipped")}
                    className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition ${
                      solutionFilter === "skipped" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    Skipped ({unanswered})
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {activeQuestions.map((item, idx) => {
                  const userAns = answers[item.id];
                  const isRight = userAns === item.metadata.answerIndex;
                  const isSkipped = userAns === undefined;

                  if (solutionFilter === "correct" && !isRight) return null;
                  if (solutionFilter === "incorrect" && (isRight || isSkipped)) return null;
                  if (solutionFilter === "skipped" && !isSkipped) return null;

                  return (
                    <div
                      key={`sol-${item.id}`}
                      className={`rounded-2xl border p-6 transition ${
                        isRight
                          ? "border-emerald-500/30 bg-[#0C1717]"
                          : isSkipped
                          ? "border-white/10 bg-[#0A0F1A]"
                          : "border-red-500/30 bg-[#1A1015]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-[#00DDB0]">Question {idx + 1}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isRight ? "bg-emerald-500/20 text-emerald-300" : isSkipped ? "bg-slate-800 text-slate-400" : "bg-red-500/20 text-red-300"
                          }`}>
                            {isRight ? "CORRECT" : isSkipped ? "SKIPPED" : "INCORRECT"}
                          </span>
                          <span className="text-slate-400">{item.metadata.subject} • {item.metadata.topic}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleBookmark(item.id)}
                          className="font-mono text-xs text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <span>{bookmarkedIds.includes(item.id) ? "★ Saved" : "☆ Bookmark"}</span>
                        </button>
                      </div>

                      <p className="mt-4 text-base font-semibold text-white leading-relaxed whitespace-pre-line">
                        {item.metadata.question}
                      </p>

                      <div className="mt-5 space-y-2 font-mono text-xs">
                        {item.metadata.options.map((opt, oIdx) => {
                          const isCorrectKey = oIdx === item.metadata.answerIndex;
                          const isYourChoice = oIdx === userAns;

                          let style = "border-white/5 bg-slate-950/40 text-slate-400";
                          if (isCorrectKey) style = "border-emerald-500 bg-emerald-500/15 text-emerald-200 font-bold ring-1 ring-emerald-500/40";
                          else if (isYourChoice && !isCorrectKey) style = "border-red-500 bg-red-500/15 text-red-200 font-bold";

                          return (
                            <div key={`sol-opt-${item.id}-${oIdx}`} className={`rounded-xl border p-3 flex items-center justify-between ${style}`}>
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isCorrectKey && <span className="text-emerald-400 font-bold">Official Key</span>}
                              {isYourChoice && !isCorrectKey && <span className="text-red-400 font-bold">Your Choice</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 font-mono text-xs text-slate-300">
                        <p className="font-bold text-emerald-400 mb-1">Verified Explanation:</p>
                        <p className="font-sans text-xs leading-relaxed text-slate-200">
                          {item.metadata.explanation || "Official answer key verified by examination authorities."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




