import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.SARJOM_API_URL ||
  process.env.NEXT_PUBLIC_SARJOM_API_URL ||
  "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const question =
      typeof body?.question === "string"
        ? body.question.trim()
        : typeof body?.query === "string"
          ? body.query.trim()
          : "";

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required." },
        { status: 400 },
      );
    }

    const upstream = await fetch(`${API_BASE_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      cache: "no-store",
    });

    const raw = await upstream.text();

    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: "SARJOM AI returned an invalid response." },
        { status: 502 },
      );
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to connect to SARJOM AI. Check the configured backend URL and API status." },
      { status: 502 },
    );
  }
}
