import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_TYPES = new Set([
  "scheme",
  "scholarship",
  "service",
  "syllabus",
  "admit-card",
  "exam",
  "answer-key",
  "result",
  "pyq",
]);

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

async function fetchFromSupabase(
  type?: string,
  id?: string,
  state?: string,
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const candidateTables =
    type === "syllabus" ? ["syllabus", "syllabi", "content"] : ["content", "syllabus", "syllabi"];

  for (const table of candidateTables) {
    let query = supabase.from(table).select("*");
    if (id) query = query.eq("id", id);
    if (state) query = query.eq("state_code", state);

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      const normalized = data.map((row: Record<string, unknown>) => ({
        ...row,
        id: String(row.id ?? ""),
        contentType: String(row.contentType ?? row.content_type ?? type ?? "syllabus"),
        title: String(row.title ?? row.name ?? "Untitled Syllabus"),
        description:
          typeof row.description === "string"
            ? row.description
            : typeof row.summary === "string"
              ? row.summary
              : "",
        stateCode:
          typeof row.stateCode === "string"
            ? row.stateCode
            : typeof row.state_code === "string"
              ? row.state_code
              : undefined,
        category: typeof row.category === "string" ? row.category : "SYLLABUS",
        officialUrl:
          typeof row.officialUrl === "string"
            ? row.officialUrl
            : typeof row.official_url === "string"
              ? row.official_url
              : undefined,
        updatedAt:
          typeof row.updatedAt === "string"
            ? row.updatedAt
            : typeof row.updated_at === "string"
              ? row.updated_at
              : undefined,
      }));

      return normalized.filter((item) => {
        if (type && item.contentType && item.contentType !== type) {
          return table === "syllabus" || table === "syllabi";
        }
        return true;
      });
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || undefined;
  const id = searchParams.get("id") || undefined;
  const state = searchParams.get("state")
    ? searchParams.get("state")!.toUpperCase()
    : undefined;

  if (type && !ALLOWED_TYPES.has(type)) {
    return NextResponse.json(
      { success: false, error: "Invalid content type." },
      { status: 400 },
    );
  }

  const externalBase = process.env.NEXT_PUBLIC_SARJOM_API_URL;
  const isLocalFallback =
    !externalBase ||
    externalBase.includes("localhost:4000") ||
    externalBase.includes("127.0.0.1:4000");

  if (!isLocalFallback && externalBase) {
    try {
      const qs = new URLSearchParams();
      if (type) qs.set("type", type);
      if (id) qs.set("id", id);
      if (state) qs.set("state", state);

      const res = await fetch(
        `${externalBase.replace(/\/$/, "")}/api/content${qs.toString() ? `?${qs.toString()}` : ""}`,
        { cache: "no-store" },
      );

      if (res.ok) {
        const json = await res.json();
        return NextResponse.json(json, { status: 200 });
      }
    } catch {
      // External API unreachable; fall through to Supabase / empty records
    }
  }

  const supabaseRecords = await fetchFromSupabase(type, id, state);
  if (supabaseRecords) {
    return NextResponse.json(
      { success: true, records: supabaseRecords },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { success: true, records: [] },
    { status: 200 },
  );
}
