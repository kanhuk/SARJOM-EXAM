import { NextRequest, NextResponse } from "next/server";
import { runNoticeSync } from "@/lib/noticeSyncEngine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    const querySecret = req.nextUrl.searchParams.get("secret");
    if (authHeader !== `Bearer ${secret}` && querySecret !== secret) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runNoticeSync();
  return NextResponse.json({
    success: true,
    syncedToDb: result.syncedToDb,
    upsertedCount: result.upsertedCount,
    activeCount: result.notices.length,
    dbError: result.dbError ?? null,
    syncedAt: new Date().toISOString(),
  });
}
