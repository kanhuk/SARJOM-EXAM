import { NextResponse } from "next/server";
import { getSupabaseAdminOrPublic, runNoticeSync } from "@/lib/noticeSyncEngine";
import type { FilteredLiveNotice, NoticeCategory } from "@/lib/liveExamFilter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabaseAdminOrPublic();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("live_notices")
        .select("id, exam_id, exam_title, category, title, link, source, published_at, priority_score, first_seen_at")
        .order("first_seen_at", { ascending: false })
        .order("priority_score", { ascending: false })
        .limit(40);

      if (!error && Array.isArray(data) && data.length > 0) {
        const newestSeen = data[0]?.first_seen_at ? Date.parse(String(data[0].first_seen_at)) : 0;
        const isStale = !newestSeen || Date.now() - newestSeen > 30 * 60 * 1000;

        if (!isStale) {
          const perExam = new Map<string, number>();
          const formatted: FilteredLiveNotice[] = [];

          for (const row of data) {
            const examId = String(row.exam_id || "");
            const count = perExam.get(examId) ?? 0;
            if (count >= 3) continue;
            perExam.set(examId, count + 1);

            formatted.push({
              id: String(row.id),
              examId,
              examTitle: String(row.exam_title || ""),
              category: (row.category || "Notification") as NoticeCategory,
              title: String(row.title || ""),
              link: String(row.link || "/exams"),
              source: String(row.source || "OFFICIAL"),
              publishedAt: row.published_at ? String(row.published_at) : undefined,
              priorityScore: Number(row.priority_score || 0),
            });

            if (formatted.length >= 24) break;
          }

          return NextResponse.json({
            success: true,
            source: "supabase-cache",
            count: formatted.length,
            notices: formatted,
          });
        }
      }
    } catch {}
  }

  const fresh = await runNoticeSync();
  return NextResponse.json({
    success: true,
    source: fresh.syncedToDb ? "fresh-sync-saved" : "fresh-sync-memory",
    count: fresh.notices.length,
    notices: fresh.notices,
  });
}
