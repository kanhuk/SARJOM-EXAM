import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getCandidatePreferences,
  saveCandidatePreferences,
  addExamPreference,
  removeExamPreference,
} from "../../../../../../lib/sarjom-core/preferences";
import { listExams } from "../../../../../../lib/sarjom-core/exams";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Candidate authentication is not configured.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function getUserId(request: NextRequest): Promise<string | null> {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const { data, error } = await getSupabase().auth.getUser(match[1]);
  if (error || !data.user) return null;
  return data.user.id;
}

async function validExamIds(ids: unknown): Promise<string[] | null> {
  if (!Array.isArray(ids) || ids.length > 100 || ids.some(id => typeof id !== "string" || !id.trim())) return null;
  const canonical = await listExams();
  const allowed = new Set(canonical.map(exam => exam.id));
  const clean = Array.from(new Set((ids as string[]).map(id => id.trim())));
  if (clean.some(id => !allowed.has(id))) return null;
  return clean;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ success: true, selectedExamIds: await getCandidatePreferences(userId) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET preferences error:", error);
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    const input = body as Record<string, unknown>;

    if (input.action === "set") {
      const selectedExamIds = await validExamIds(input.selectedExamIds);
      if (!selectedExamIds) return NextResponse.json({ error: "Choose only exams available in the SARJOM exam catalogue." }, { status: 400 });
      await saveCandidatePreferences(userId, selectedExamIds);
      return NextResponse.json({ success: true, selectedExamIds: await getCandidatePreferences(userId) }, { headers: { "Cache-Control": "no-store" } });
    }

    if ((input.action === "add" || input.action === "remove") && typeof input.examId === "string") {
      const examId = input.examId.trim();
      if (!(await validExamIds([examId]))) return NextResponse.json({ error: "Exam is not in the SARJOM canonical catalogue." }, { status: 400 });
      const selectedExamIds = input.action === "add"
        ? await addExamPreference(userId, examId)
        : await removeExamPreference(userId, examId);
      return NextResponse.json({ success: true, selectedExamIds }, { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST preferences error:", error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
