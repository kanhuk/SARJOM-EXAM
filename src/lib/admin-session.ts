import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
export const SARJOM_ADMIN_COOKIE = "sarjom_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
function secret(): string {
  const value = process.env.SARJOM_ADMIN_TOKEN;
  if (!value) throw new Error("SARJOM_ADMIN_TOKEN is not configured.");
  return value;
}
function sign(expiry: string): string {
  return createHmac("sha256", secret()).update(`sarjom-admin-session:${expiry}`).digest("hex");
}
function equal(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function createAdminSession() {
  const maxAge = SESSION_SECONDS;
  const expiry = String(Math.floor(Date.now() / 1000) + maxAge);
  return { value: `${expiry}.${sign(expiry)}`, maxAge };
}
export function isValidAdminSession(request: NextRequest): boolean {
  try {
    const value = request.cookies.get(SARJOM_ADMIN_COOKIE)?.value;
    if (!value) return false;
    const [expiry, supplied, extra] = value.split(".");
    if (!expiry || !supplied || extra !== undefined || !/^\d+$/.test(expiry)) return false;
    if (Number(expiry) <= Math.floor(Date.now() / 1000)) return false;
    return equal(supplied, sign(expiry));
  } catch { return false; }
}
export function adminTokenMatches(value: unknown): boolean {
  const expected = process.env.SARJOM_ADMIN_TOKEN;
  return Boolean(expected && typeof value === "string" && equal(value, expected));
}
