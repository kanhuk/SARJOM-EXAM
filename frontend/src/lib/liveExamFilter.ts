import { createHash } from "node:crypto";
import { ALL_EXAM_SYLLABI } from "@/data/examSyllabusCatalog";

export type NoticeCategory =
  | "Application Open"
  | "Apply Last Date"
  | "Correction Date"
  | "Admit Card"
  | "Answer Key"
  | "Result"
  | "Notification";

export type FilteredLiveNotice = {
  id: string;
  examId: string;
  examTitle: string;
  category: NoticeCategory;
  title: string;
  link: string;
  source: string;
  publishedAt?: string;
  priorityScore?: number;
};

type ExamRule = {
  id: string;
  title: string;
  officialUrl: string;
  keywords: string[];
};

const GENERIC_BLOCKED_KEYWORDS = new Set([
  "syllabus",
  "notification",
  "exam",
  "exams",
  "result",
  "results",
  "admit card",
  "answer key",
  "general",
  "core",
  "paper",
  "papers",
  "odisha",
  "india",
  "latest",
  "online",
  "officer",
  "assistant",
  "junior",
  "senior",
  "teacher",
]);

const EXTRA_EXAM_RULES: ExamRule[] = [
  {
    id: "odisha-junior-regular-teacher",
    title: "Odisha Junior & Regular Teacher",
    officialUrl: "https://osepa.odisha.gov.in",
    keywords: ["junior teacher", "regular teacher", "osepa", "ltr teacher"],
  },
  {
    id: "kvs-nvs-recruitment",
    title: "KVS & NVS Recruitment",
    officialUrl: "https://kvsangathan.nic.in",
    keywords: ["kvs", "nvs", "kendriya vidyalaya", "navodaya"],
  },
  {
    id: "ignou-bed-entrance",
    title: "IGNOU B.Ed Entrance",
    officialUrl: "https://ignou.ac.in",
    keywords: ["ignou b.ed", "ignou bed"],
  },
  {
    id: "odisha-ct-deled",
    title: "Odisha CT / D.El.Ed",
    officialUrl: "https://scertodisha.nic.in",
    keywords: ["d.el.ed", "deled", "scert odisha", "ct entrance"],
  },
  {
    id: "odisha-bed-entrance",
    title: "Odisha B.Ed Entrance",
    officialUrl: "https://samsodisha.gov.in",
    keywords: ["odisha b.ed", "sams odisha b.ed", "b.ed entrance"],
  },
];

const BLOCKED_NOISE_TERMS = [
  "tender",
  "quotation",
  "procurement",
  "e-procurement",
  "transfer and posting",
  "deputation",
  "engagement of retired",
  "holiday list",
  "annual report",
  "examination syllabus",
  "class-10",
  "class 10",
  "hsc examination",
  "shsc examination",
  "open school certificate",
  "rural talent scholarship",
  "nrts",
  "madhyama",
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeywordWholeWord(lowerText: string, keyword: string): boolean {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(keyword)}([^a-z0-9]|$)`, "i");
  return pattern.test(lowerText);
}

function addSafeKeyword(set: Set<string>, raw: string) {
  const cleaned = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length < 3) return;
  if (GENERIC_BLOCKED_KEYWORDS.has(cleaned)) return;
  set.add(cleaned);
}

function buildExamKeywords(id: string, title: string): string[] {
  const base = new Set<string>();
  const cleanTitle = title
    .replace(/—\s*Syllabus/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  addSafeKeyword(base, cleanTitle);

  const parenMatches = title.match(/\(([^)]+)\)/g) || [];
  for (const m of parenMatches) {
    const inner = m.replace(/[()]/g, "").trim();
    if (!inner.toLowerCase().includes("code") && !inner.toLowerCase().includes("latest")) {
      addSafeKeyword(base, inner);
    }
  }

  const explicitMap: Record<string, string[]> = {
    "upsc-cse": ["civil services", "upsc cse", "ias prelims", "ifs prelims"],
    "opsc-ocs": ["odisha civil services", "opsc ocs"],
    "opsc-oas-ocs": ["odisha civil services", "opsc ocs"],
    "opsc-aso": ["assistant section officer", "opsc aso"],
    "opsc-ag-aso": ["assistant section officer", "opsc aso"],
    "opsc-ojs": ["odisha judicial service", "civil judge", "opsc ojs"],
    "opsc-pgt": ["post graduate teacher", "opsc pgt"],
    "odisha-police-si": ["police sub inspector", "police si", "cpse", "ousssc", "oprb"],
    "ossc-combined-police-si": ["police sub inspector", "police si", "cpse"],
    "ossc-cgl": ["ossc cgl", "combined graduate level"],
    "ossc-cgl-specialist": ["cglre specialist", "cgl specialist", "ossc cgl specialist", "5919/ossc"],
    "ossc-je": ["ossc junior engineer", "combined technical"],
    "osssc-ri-ari-amin": ["revenue inspector", "assistant revenue inspector", "ari", "amin", "icds supervisor"],
    "osssc-forest-guard-forester": ["forest guard", "forester", "livestock inspector"],
    "osssc-peo-ja": ["panchayat executive officer", "junior assistant"],
    "ugc-net-econ": ["ugc net", "ugc-net", "nta net"],
    "ugc-net-education": ["ugc net", "ugc-net", "nta net"],
    "cuet-pg-eco": ["cuet pg", "cuet (pg)", "coqp10"],
    "central-university-bed": ["cuet b.ed", "cuet pg"],
    "nda-na": ["nda & na", "nda and na", "national defence academy"],
    "cds": ["combined defence services", "cds examination"],
    "agniveer-vayu-army": ["agniveer", "agnipath"],
    "gate": ["gate 2025", "gate 2026", "gate 2027", "graduate aptitude test"],
    "ojee": ["ojee", "odisha joint entrance"],
    "ojee-odisha": ["ojee", "odisha joint entrance"],
    "neet-ug": ["neet (ug)", "neet ug"],
    "ctet": ["ctet", "central teacher eligibility"],
    "odisha-osstet": ["osstet"],
    "otet-osstet-odisha": ["otet", "osstet"],
    "ssc-cgl": ["ssc cgl", "combined graduate level"],
    "ssc-chsl": ["ssc chsl", "combined higher secondary"],
    "ssc-mts-havaldar": ["ssc mts", "multi tasking", "havaldar"],
    "ssc-cpo": ["ssc cpo", "sub-inspector in delhi police"],
    "ssc-gd": ["constable (gd)", "ssc gd"],
    "ssc-je": ["ssc junior engineer", "ssc je"],
    "ssc-stenographer": ["stenographer grade"],
    "ssc-selection-post": ["selection post"],
    "rrb-ntpc": ["rrb ntpc", "non-technical popular"],
    "rrb-group-d": ["rrb group d", "level 1 posts", "cen rrc"],
    "rrb-alp": ["assistant loco pilot", "rrb alp"],
    "rrb-je": ["rrb junior engineer", "rrb je"],
    "sbi-po": ["sbi probationary officer", "sbi po"],
    "sbi-clerk": ["sbi junior associate", "sbi clerk"],
    "ibps-po": ["ibps po", "crp po/mt"],
    "ibps-clerk": ["ibps clerk", "crp csa", "customer service associate"],
    "ibps-rrb-po": ["rrb officer scale", "crp rrb"],
    "ibps-rrb-clerk": ["rrb office assistant", "crp rrb"],
    "rbi-grade-b": ["rbi grade b", "officers in grade 'b'"],
    "rbi-assistant": ["rbi assistant"],
    "nabard-grade-a": ["nabard grade a", "assistant manager in grade 'a'"],
  };

  for (const kw of explicitMap[id] || []) {
    addSafeKeyword(base, kw);
  }

  return Array.from(base);
}

export function getWhitelistedExamRules(extraDynamicExams: Array<{ id: string; title: string; officialUrl?: string }> = []): ExamRule[] {
  const seen = new Set<string>();
  const rules: ExamRule[] = [];

  for (const item of ALL_EXAM_SYLLABI) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    rules.push({
      id: item.id,
      title: item.title.replace(/—\s*Syllabus/gi, "").trim(),
      officialUrl: item.officialUrl || "/exams",
      keywords: buildExamKeywords(item.id, item.title),
    });
  }

  for (const extra of EXTRA_EXAM_RULES) {
    if (seen.has(extra.id)) continue;
    seen.add(extra.id);
    rules.push(extra);
  }

  for (const dyn of extraDynamicExams) {
    if (!dyn?.id || !dyn?.title || seen.has(dyn.id)) continue;
    seen.add(dyn.id);
    rules.push({
      id: dyn.id,
      title: dyn.title.replace(/—\s*Syllabus/gi, "").trim(),
      officialUrl: dyn.officialUrl || "/exams",
      keywords: buildExamKeywords(dyn.id, dyn.title),
    });
  }

  return rules;
}

export function classifyNoticeCategory(text: string): NoticeCategory | null {
  const lower = text.toLowerCase();

  if (/(last date|closing date|deadline|apply before|submission ends)/.test(lower)) {
    return "Apply Last Date";
  }
  if (/(correction window|application correction|edit window|modify application|correction date)/.test(lower)) {
    return "Correction Date";
  }
  if (/(admit card|hall ticket|call letter|e-admit|exam city|city intimation)/.test(lower)) {
    return "Admit Card";
  }
  if (/(answer key|provisional key|final key|response sheet|objection tracker|scoring key)/.test(lower)) {
    return "Answer Key";
  }
  if (/(result|results|merit list|cut-off|cutoff|scorecard|selected candidates|shortlisted)/.test(lower)) {
    return "Result";
  }
  if (/(apply online|application open|online registration|recruitment notification|advertisement|inviting online applications)/.test(lower)) {
    return "Application Open";
  }
  if (/(exam date|schedule|timetable|postponed|rescheduled|directive|notice|recruitment)/.test(lower)) {
    return "Notification";
  }

  return null;
}

function computePriorityScore(text: string, category: NoticeCategory): number {
  let score = 0;
  if (/\b2026\b/.test(text)) score += 60;
  else if (/\b2025\b/.test(text)) score += 35;
  else if (/\b2024\b/.test(text)) score += 10;
  else if (/\b2023\b/.test(text)) score -= 10;

  if (category === "Application Open" || category === "Apply Last Date") score += 20;
  else if (category === "Admit Card" || category === "Correction Date") score += 15;
  else if (category === "Result" || category === "Answer Key") score += 10;

  return score;
}

export function matchAndFilterExamNotice(
  rawTitle: string,
  rawLink: string,
  sourceName: string,
  rules: ExamRule[],
  publishedAt?: string,
): FilteredLiveNotice | null {
  const cleanTitle = rawTitle.replace(/^[»•\-–]+\s*/, "").replace(/\s+/g, " ").trim();
  if (cleanTitle.length < 10 || cleanTitle.length > 260) return null;
  const lower = cleanTitle.toLowerCase();

  if (/\b(2023|2024)\b/.test(lower) && !/\b2026\b/.test(lower)) {
    return null;
  }

  if (BLOCKED_NOISE_TERMS.some((noise) => lower.includes(noise))) {
    return null;
  }

  const matchedExam = rules.find((rule) =>
    rule.keywords.some((kw) => matchesKeywordWholeWord(lower, kw)),
  );
  if (!matchedExam) {
    return null;
  }

  const category = classifyNoticeCategory(cleanTitle);
  if (!category) {
    return null;
  }

  const uniqueHash = createHash("sha1")
    .update(`${matchedExam.id}|${cleanTitle}|${rawLink}`)
    .digest("hex")
    .slice(0, 12);

  return {
    id: `${matchedExam.id}-${uniqueHash}`,
    examId: matchedExam.id,
    examTitle: matchedExam.title,
    category,
    title: cleanTitle,
    link: rawLink || matchedExam.officialUrl,
    source: sourceName,
    publishedAt,
    priorityScore: computePriorityScore(cleanTitle, category),
  };
}