import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/admin-session";
import { listExams, saveExam } from "../../../../../../lib/sarjom-core/exams";
import { sarjomRepository } from "../../../../../../lib/sarjom-core/repository";
import type { AdminChange, SarjomGenericRecord } from "../../../../../../lib/sarjom-core/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
function text(value: unknown, max = 4000): string | undefined {
  if (typeof value !== "string") return undefined;
  const result = value.trim();
  return result ? result.slice(0, max) : undefined;
}
function safeUrl(value: unknown): string | undefined {
  const raw = text(value, 2000);
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.toString() : undefined;
  } catch { return undefined; }
}
function plainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function arrayValue(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value) || value.length > 500) throw new Error(`${name} must be an array with at most 500 items.`);
  if (value.some(item => !plainObject(item) && typeof item !== "string")) {
    throw new Error(`${name} items must be objects or strings.`);
  }
  return value;
}
function buildBlueprint(input: Record<string, unknown>) {
  const raw = plainObject(input.blueprint) ? input.blueprint : {};
  const totalMarks = raw.totalMarks == null || raw.totalMarks === "" ? undefined : Number(raw.totalMarks);
  if (totalMarks !== undefined && (!Number.isFinite(totalMarks) || totalMarks < 0 || totalMarks > 1000000)) {
    throw new Error("Total marks must be a valid non-negative number.");
  }
  const stages = arrayValue(raw.stages, "Selection stages");
  const pattern = arrayValue(raw.pattern, "Exam pattern");
  const markDistribution = arrayValue(raw.markDistribution, "Syllabus / weightage");
  const cutoffs = arrayValue(raw.cutoffs, "Cutoff archive");
  const v = plainObject(raw.verification) ? raw.verification : {};
  const verificationStatus = text(v.status, 30) ?? "unverified";
  if (!["unverified", "pending", "verified"].includes(verificationStatus)) {
    throw new Error("Verification status must be unverified, pending or verified.");
  }
  const lastVerifiedAt = text(v.lastVerifiedAt, 40);
  if (lastVerifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(lastVerifiedAt)) {
    throw new Error("Last verified date must use YYYY-MM-DD format.");
  }
  return {
    conductingBody: text(raw.conductingBody, 250),
    qualification: text(raw.qualification, 2000),
    totalMarks, stages, pattern, markDistribution, cutoffs,
    verification: { status: verificationStatus, lastVerifiedAt }
  };
}
function auditChange(entityId: string, action: string, before: Record<string, unknown>, after: Record<string, unknown>, reason: string): AdminChange {
  return { id: randomUUID(), createdAt: new Date().toISOString(), actor: "admin", entityType: "exam", entityId, action, before, after, reason };
}
export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request)) return response({ success: false, error: "Admin login required." }, 401);
  try {
    return response({ success: true, exams: await listExams() });
  } catch (error) {
    console.error("Admin exam list failed:", error);
    return response({ success: false, error: "Could not load canonical exam records." }, 500);
  }
}
export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request)) return response({ success: false, error: "Admin login required." }, 401);
  try {
    const body: unknown = await request.json();
    if (!plainObject(body)) return response({ success: false, error: "A valid JSON object is required." }, 400);
    const title = text(body.title, 250);
    if (!title) return response({ success: false, error: "Exam title is required." }, 400);
    const officialUrl = safeUrl(body.officialUrl);
    if (body.officialUrl && !officialUrl) return response({ success: false, error: "Official URL must be a valid HTTP(S) URL." }, 400);
    const blueprint = buildBlueprint(body);
    const now = new Date().toISOString();
    const exam: SarjomGenericRecord = {
      id: randomUUID(), contentType: "exam", title,
      description: text(body.description, 4000), officialUrl,
      officialSource: text(body.officialSource, 250), stateCode: text(body.stateCode, 20),
      status: "draft", updatedAt: now,
      metadata: { name: text(body.name, 250) ?? title, adminDraft: true, blueprint }
    };
    const saved = await saveExam(exam);
    await sarjomRepository.saveChange(auditChange(saved.id, "create-exam-draft", {}, saved as unknown as Record<string, unknown>, "Created from Admin Command"));
    return response({ success: true, exam: saved }, 201);
  } catch (error) {
    if (error instanceof Error && /must be|status|date|number|array|items/.test(error.message)) {
      return response({ success: false, error: error.message }, 400);
    }
    console.error("Admin exam draft creation failed:", error);
    return response({ success: false, error: "Draft creation failed. Check server configuration and logs." }, 500);
  }
}
export async function PATCH(request: NextRequest) {
  if (!isValidAdminSession(request)) return response({ success: false, error: "Admin login required." }, 401);
  try {
    const body: unknown = await request.json();
    if (!plainObject(body)) return response({ success: false, error: "A valid JSON object is required." }, 400);
    const id = text(body.id, 100);
    const title = text(body.title, 250);
    const reason = text(body.reason, 500);
    if (!id || !title || !reason) return response({ success: false, error: "Exam ID, title and change reason are required." }, 400);
    const current = await sarjomRepository.getRecord(id);
    if (!current || current.contentType !== "exam") return response({ success: false, error: "Exam record not found." }, 404);
    if (current.status !== "draft") return response({ success: false, error: "Only draft exams can be edited through this workflow." }, 409);
    const officialUrl = safeUrl(body.officialUrl);
    if (body.officialUrl && !officialUrl) return response({ success: false, error: "Official URL must be a valid HTTP(S) URL." }, 400);
    const blueprint = buildBlueprint(body);
    const before = current as unknown as Record<string, unknown>;
    const updated: SarjomGenericRecord = {
      ...current, title, description: text(body.description, 4000), officialUrl,
      officialSource: text(body.officialSource, 250), stateCode: text(body.stateCode, 20),
      status: "draft", updatedAt: new Date().toISOString(),
      metadata: { ...(current.metadata ?? {}), name: text(body.name, 250) ?? title, adminDraft: true, blueprint }
    };
    const saved = await saveExam(updated);
    await sarjomRepository.saveChange(auditChange(saved.id, "update-exam-draft", before, saved as unknown as Record<string, unknown>, reason));
    return response({ success: true, exam: saved });
  } catch (error) {
    if (error instanceof Error && /must be|status|date|number|array|items/.test(error.message)) {
      return response({ success: false, error: error.message }, 400);
    }
    console.error("Admin exam draft update failed:", error);
    return response({ success: false, error: "Draft update failed. Check server configuration and logs." }, 500);
  }
}