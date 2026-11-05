import { NextResponse } from "next/server";
import { listExams } from "../../../../../../lib/sarjom-core/exams";

export async function GET() {
  try {
    const records = await listExams();
    const exams = records
      .filter(record => record.status === "published" && record.contentType === "exam")
      .map(record => ({
        id: record.id,
        title: record.title,
        name: typeof record.metadata?.name === "string" ? record.metadata.name : record.title,
      }));
    return NextResponse.json({ success: true, exams }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Candidate exams error:", error);
    return NextResponse.json({ error: "Failed to load the SARJOM exam catalogue." }, { status: 500 });
  }
}
