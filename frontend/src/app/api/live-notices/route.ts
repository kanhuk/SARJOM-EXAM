import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getWhitelistedExamRules,
  matchAndFilterExamNotice,
  type FilteredLiveNotice,
} from "@/lib/liveExamFilter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OFFICIAL_FEED_SOURCES = [
  { name: "UPSC", url: "https://upsc.gov.in/whats-new", baseUrl: "https://upsc.gov.in" },
  { name: "OPSC", url: "https://www.opsc.gov.in/Public/OPSC/Default.aspx", baseUrl: "https://www.opsc.gov.in" },
  { name: "OSSC", url: "https://www.ossc.gov.in/Public/OSSC/Default.aspx", baseUrl: "https://www.ossc.gov.in" },
  { name: "OSSSC", url: "https://www.osssc.gov.in/Public/OSSSC/Default.aspx", baseUrl: "https://www.osssc.gov.in" },
  { name: "UGC NET", url: "https://ugcnet.nta.ac.in", baseUrl: "https://ugcnet.nta.ac.in" },
  { name: "SSC", url: "https://ssc.gov.in", baseUrl: "https://ssc.gov.in" },
  { name: "OJEE", url: "https://ojee.nic.in", baseUrl: "https://ojee.nic.in" },
  { name: "SBI", url: "https://sbi.co.in/web/careers", baseUrl: "https://sbi.co.in" },
  { name: "RBI", url: "https://opportunities.rbi.org.in", baseUrl: "https://opportunities.rbi.org.in" },
  { name: "NABARD", url: "https://www.nabard.org", baseUrl: "https://www.nabard.org" },
  { name: "BSE Odisha", url: "https://www.bseodisha.ac.in", baseUrl: "https://www.bseodisha.ac.in" },
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function extractAnchorPairs(html: string, baseUrl: string): Array<{ title: string; link: string }> {
  const results: Array<{ title: string; link: string }> = [];
  const anchorRegex = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) !== null) {
    const rawHref = match[1].trim();
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&amp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text || text.length < 10) continue;

    let resolvedUrl = baseUrl;
    try {
      resolvedUrl = new URL(rawHref, baseUrl).toString();
    } catch {
      resolvedUrl = baseUrl;
    }

    results.push({ title: text, link: resolvedUrl });
    if (results.length >= 140) break;
  }

  return results;
}

async function fetchSourceHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const dynamicExams: Array<{ id: string; title: string; officialUrl?: string }> = [];
  const storedRawNotices: Array<{ title: string; link: string; source: string; publishedAt?: string }> = [];

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: examRows } = await supabase.from("content").select("id, title, official_url, content_type");
      if (Array.isArray(examRows)) {
        for (const row of examRows) {
          const cType = String(row.content_type || "");
          if (cType === "exam" || cType === "syllabus") {
            dynamicExams.push({
              id: String(row.id || ""),
              title: String(row.title || ""),
              officialUrl: typeof row.official_url === "string" ? row.official_url : undefined,
            });
          } else if (["admit-card", "answer-key", "result", "notification"].includes(cType)) {
            storedRawNotices.push({
              title: String(row.title || ""),
              link: typeof row.official_url === "string" ? row.official_url : "/exams",
              source: "SARJOM VERIFIED",
            });
          }
        }
      }
    } catch {
      // Ignore Supabase fetch issues cleanly
    }
  }

    const pinnedNotices: Array<{ title: string; link: string; source: string; publishedAt?: string }> = [
    {
      title: "2026-11-20 OSSC CGL Specialist 2025 Preliminary Examination Admit Card Out (Exam Date: 30/11/2026)",
      link: "https://ossc.gov.in/Public/Pages/Login.aspx",
      source: "OSSC",
      publishedAt: "2026-11-20",
    },
  ];
  const rules = getWhitelistedExamRules(dynamicExams);
  const candidates: FilteredLiveNotice[] = [];
  const seenTitles = new Set<string>();

  for (const item of pinnedNotices) {
    const filtered = matchAndFilterExamNotice(item.title, item.link, item.source, rules, item.publishedAt);
    if (filtered && !seenTitles.has(filtered.title.toLowerCase())) {
      seenTitles.add(filtered.title.toLowerCase());
      candidates.push({ ...filtered, priorityScore: (filtered.priorityScore ?? 0) + 100 });
    }
  }
  for (const item of storedRawNotices) {
    const filtered = matchAndFilterExamNotice(item.title, item.link, item.source, rules, item.publishedAt);
    if (filtered && !seenTitles.has(filtered.title.toLowerCase())) {
      seenTitles.add(filtered.title.toLowerCase());
      candidates.push(filtered);
    }
  }

  const fetchedPages = await Promise.all(
    OFFICIAL_FEED_SOURCES.map(async (src) => {
      const html = await fetchSourceHtml(src.url);
      return { src, anchors: html ? extractAnchorPairs(html, src.baseUrl) : [] };
    }),
  );

  for (const { src, anchors } of fetchedPages) {
    for (const anchor of anchors) {
      const filtered = matchAndFilterExamNotice(anchor.title, anchor.link, src.name, rules);
      if (filtered && !seenTitles.has(filtered.title.toLowerCase())) {
        seenTitles.add(filtered.title.toLowerCase());
        candidates.push(filtered);
      }
    }
  }

  // Sort newest / highest priority notices first, and cap at 3 per exam for balanced coverage
  candidates.sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));

  const perExamCount = new Map<string, number>();
  const balancedList: FilteredLiveNotice[] = [];

  for (const notice of candidates) {
    const current = perExamCount.get(notice.examId) ?? 0;
    if (current >= 3) continue;
    perExamCount.set(notice.examId, current + 1);
    balancedList.push(notice);
    if (balancedList.length >= 24) break;
  }

  return NextResponse.json({
    success: true,
    count: balancedList.length,
    notices: balancedList,
  });
}