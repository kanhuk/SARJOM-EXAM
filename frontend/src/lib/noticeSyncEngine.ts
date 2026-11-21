import { createClient } from "@supabase/supabase-js";
import {
  getWhitelistedExamRules,
  matchAndFilterExamNotice,
  type FilteredLiveNotice,
} from "@/lib/liveExamFilter";

export const OFFICIAL_FEED_SOURCES = [
  { name: "SSB Odisha", url: "https://ssbodisha.ac.in", baseUrl: "https://ssbodisha.ac.in" },
  { name: "SSB Odisha Notices", url: "https://ssbodisha.ac.in/notice/", baseUrl: "https://ssbodisha.ac.in" },
  { name: "UPSC", url: "https://upsc.gov.in/whats-new", baseUrl: "https://upsc.gov.in" },
  { name: "OPSC", url: "https://www.opsc.gov.in/Public/OPSC/Default.aspx", baseUrl: "https://www.opsc.gov.in" },
  { name: "OSSC", url: "https://www.ossc.gov.in/Public/OSSC/Default.aspx", baseUrl: "https://www.ossc.gov.in" },
  { name: "OSSSC", url: "https://www.osssc.gov.in/Public/OSSSC/Default.aspx", baseUrl: "https://www.osssc.gov.in" },
  { name: "OSSSC Recruitment", url: "https://www.osssc.gov.in/Public/Pages/Post_detail_information.aspx", baseUrl: "https://www.osssc.gov.in" },
  { name: "BSE Odisha", url: "https://www.bseodisha.ac.in", baseUrl: "https://www.bseodisha.ac.in" },
  { name: "UGC NET", url: "https://ugcnet.nta.ac.in", baseUrl: "https://ugcnet.nta.ac.in" },
  { name: "SSC", url: "https://ssc.gov.in", baseUrl: "https://ssc.gov.in" },
  { name: "IBPS", url: "https://www.ibps.in", baseUrl: "https://www.ibps.in" },
  { name: "OJEE", url: "https://ojee.nic.in", baseUrl: "https://ojee.nic.in" },
  { name: "SBI", url: "https://sbi.co.in/web/careers", baseUrl: "https://sbi.co.in" },
  { name: "RBI", url: "https://opportunities.rbi.org.in", baseUrl: "https://opportunities.rbi.org.in" },
  { name: "NABARD", url: "https://www.nabard.org", baseUrl: "https://www.nabard.org" },
];

export function getSupabaseAdminOrPublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function cleanHtmlText(fragment: string): string {
  return fragment
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&amp;|&quot;|&#39;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractSmartCandidates(html: string, baseUrl: string): Array<{ title: string; link: string }> {
  const results: Array<{ title: string; link: string }> = [];
  const seen = new Set<string>();

  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const hrefMatch = rowHtml.match(/<a\b[^>]*href=["']([^"'#]+)["']/i);
    if (!hrefMatch) continue;
    const rowText = cleanHtmlText(rowHtml).slice(0, 420);
    if (rowText.length < 12) continue;

    let resolvedUrl = baseUrl;
    try {
      resolvedUrl = new URL(hrefMatch[1].trim(), baseUrl).toString();
    } catch {
      resolvedUrl = baseUrl;
    }

    const key = `${rowText.toLowerCase()}|${resolvedUrl}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ title: rowText, link: resolvedUrl });
    }
    if (results.length >= 180) break;
  }

  const anchorRegex = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchorRegex.exec(html)) !== null) {
    const rawHref = match[1].trim();
    const text = cleanHtmlText(match[2]).slice(0, 420);
    if (!text || text.length < 12) continue;

    let resolvedUrl = baseUrl;
    try {
      resolvedUrl = new URL(rawHref, baseUrl).toString();
    } catch {
      resolvedUrl = baseUrl;
    }

    const key = `${text.toLowerCase()}|${resolvedUrl}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ title: text, link: resolvedUrl });
    }
    if (results.length >= 250) break;
  }

  return results;
}

async function fetchSourceHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
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

export async function runNoticeSync(): Promise<{
  notices: FilteredLiveNotice[];
  syncedToDb: boolean;
  upsertedCount: number;
  dbError?: string;
}> {
  const supabase = getSupabaseAdminOrPublic();
  const dynamicExams: Array<{ id: string; title: string; officialUrl?: string }> = [];
  const storedRawNotices: Array<{ title: string; link: string; source: string; publishedAt?: string }> = [];

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
    } catch {}
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
      return { src, items: html ? extractSmartCandidates(html, src.baseUrl) : [] };
    }),
  );

  for (const { src, items } of fetchedPages) {
    for (const item of items) {
      const filtered = matchAndFilterExamNotice(item.title, item.link, src.name, rules);
      if (filtered) {
        if (src.name.startsWith("SSB Odisha")) {
          filtered.examId = "ssb-odisha-recruitment";
          filtered.examTitle = "SSB Odisha (Junior Assistant / Lecturer)";
        }
      }
      if (filtered && !seenTitles.has(filtered.title.toLowerCase())) {
        seenTitles.add(filtered.title.toLowerCase());
        candidates.push(filtered);
      }
    }
  }

  let syncedToDb = false;
  let upsertedCount = 0;
  let dbError: string | undefined;

  if (!supabase) {
    dbError = "Supabase client missing env vars";
  } else if (candidates.length > 0) {
    try {
      const cutoffIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("live_notices").delete().lt("first_seen_at", cutoffIso);

      const nowIso = new Date().toISOString();
      const rows = candidates.map((n) => ({
        id: n.id,
        exam_id: n.examId,
        exam_title: n.examTitle,
        category: n.category,
        title: n.title,
        link: n.link,
        source: n.source,
        published_at: n.publishedAt || nowIso.slice(0, 10),
        priority_score: n.priorityScore ?? 0,
        last_seen_at: nowIso,
      }));

      const { error } = await supabase
        .from("live_notices")
        .upsert(rows, { onConflict: "id", ignoreDuplicates: false });

      if (!error) {
        syncedToDb = true;
        upsertedCount = rows.length;
      } else {
        dbError = error.message;
      }
    } catch (err: any) {
      dbError = err?.message || "Unknown DB error";
    }
  }

  candidates.sort((a, b) => {
    const scoreDiff = (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    const dateA = a.publishedAt ? Date.parse(a.publishedAt) || 0 : 0;
    const dateB = b.publishedAt ? Date.parse(b.publishedAt) || 0 : 0;
    return dateB - dateA;
  });

  const perExamCount = new Map<string, number>();
  const balancedList: FilteredLiveNotice[] = [];

  for (const notice of candidates) {
    const current = perExamCount.get(notice.examId) ?? 0;
    if (current >= 3) continue;
    perExamCount.set(notice.examId, current + 1);
    balancedList.push(notice);
    if (balancedList.length >= 24) break;
  }

  return { notices: balancedList, syncedToDb, upsertedCount, dbError };
}




