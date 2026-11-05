import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/admin-session";
const API_BASE_URL = process.env.SARJOM_API_URL || process.env.NEXT_PUBLIC_SARJOM_API_URL || "http://localhost:4000";
export async function POST(request: NextRequest) {
  try {
    if (!isValidAdminSession(request)) {
      return NextResponse.json({ success: false, error: "Admin login required. Open /admin/login first." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }
    const body = await request.json();
    if (!body || typeof body.command !== "string" || !body.command.trim()) {
      return NextResponse.json({ success: false, error: "command is required." }, { status: 400 });
    }
    const adminToken = process.env.SARJOM_ADMIN_TOKEN;
    if (!adminToken) return NextResponse.json({ success: false, error: "SARJOM_ADMIN_TOKEN is not configured on the server." }, { status: 500 });
    const upstreamBody: Record<string, unknown> = { command: body.command.trim(), confirm: body.confirm === true };
    if (body.confirm === true) {
      if (!body.plan || typeof body.plan !== "object") return NextResponse.json({ success: false, error: "Execution requires the reviewed Admin AI plan." }, { status: 400 });
      if (typeof body.planSignature !== "string" || !body.planSignature) return NextResponse.json({ success: false, error: "Execution requires the Admin AI plan signature." }, { status: 400 });
      upstreamBody.plan = body.plan;
      upstreamBody.planSignature = body.planSignature;
    }
    const upstream = await fetch(`${API_BASE_URL}/api/admin/ai-command`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(upstreamBody), cache: "no-store"
    });
    const raw = await upstream.text();
    if (!raw.trim()) return NextResponse.json({ success: false, error: "SARJOM API returned an empty response." }, { status: upstream.status || 502 });
    let data: unknown;
    try { data = JSON.parse(raw); }
    catch { return NextResponse.json({ success: false, error: "SARJOM API returned invalid JSON.", upstreamStatus: upstream.status }, { status: 502 }); }
    return NextResponse.json(data, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ success: false, error: "Admin AI proxy failed." }, { status: 500 });
  }
}
