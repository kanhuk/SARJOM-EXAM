import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  isValidAdminSession,
  SARJOM_ADMIN_COOKIE
} from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function GET(request: NextRequest) {
  return json({ authenticated: isValidAdminSession(request) });
}

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const expectedEmail = process.env.SARJOM_ADMIN_EMAIL?.trim().toLowerCase();

    if (!url || !key || !expectedEmail || !process.env.SARJOM_ADMIN_TOKEN) {
      return json({ success: false, error: "Admin authentication is not configured on the server." }, 500);
    }

    const body = await request.json().catch(() => null);
    const accessToken = typeof body?.accessToken === "string" ? body.accessToken : "";
    if (!accessToken || accessToken.length > 10000) {
      return json({ success: false, error: "A valid signed-in session is required." }, 401);
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user?.email) {
      return json({ success: false, error: "Your sign-in session is invalid or expired." }, 401);
    }

    if (data.user.email.trim().toLowerCase() !== expectedEmail) {
      return json({ success: false, error: "This account is not authorized as an administrator." }, 403);
    }

    const session = createAdminSession();
    const response = json({ success: true });
    response.cookies.set(SARJOM_ADMIN_COOKIE, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: session.maxAge
    });
    return response;
  } catch {
    return json({ success: false, error: "Admin login could not be completed. Check server configuration." }, 500);
  }
}

export async function DELETE() {
  const response = json({ success: true });
  response.cookies.set(SARJOM_ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
  return response;
}