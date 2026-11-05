import crypto from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { sarjomRepository } from "./repository.js";
import { updateJobAsAdmin } from "./admin.js";
import { getCanonicalJob } from "./ai/canonical-query.js";

export interface AdminAiPlan {
  action: "update-job" | "inspect-job" | "refresh-job" | "unsupported";
  jobId: string | null;
  patch: Record<string, unknown>;
  reason: string;
  requiresConfirmation: boolean;
  issuedAt: string;
  expiresAt: string;
}

export interface SignedAdminAiPlan {
  plan: AdminAiPlan;
  planSignature: string;
}

const ALLOWED_FIELDS = new Set([
  "title",
  "organization",
  "vacancies",
  "applicationStartDate",
  "applicationDeadline",
  "examDate",
  "officialNotificationUrl",
  "officialWebsiteUrl",
  "admitCardUrl",
  "resultUrl",
  "answerKeyUrl",
  "stateCode",
  "districts",
  "description",
  "verified",
  "verificationScore",
  "status",
]);

function signingSecret(): string {
  const secret =
    process.env.SARJOM_PLAN_SIGNING_SECRET ||
    process.env.SARJOM_ADMIN_TOKEN;

  if (!secret) {
    throw new Error(
      "SARJOM_PLAN_SIGNING_SECRET or SARJOM_ADMIN_TOKEN is not configured.",
    );
  }

  return secret;
}

function canonicalPlan(
  command: string,
  plan: AdminAiPlan,
): string {
  return JSON.stringify({
    command,
    action: plan.action,
    jobId: plan.jobId,
    patch: plan.patch,
    reason: plan.reason,
    requiresConfirmation: true,
    issuedAt: plan.issuedAt,
    expiresAt: plan.expiresAt,
  });
}

function signPlan(
  command: string,
  plan: AdminAiPlan,
): string {
  return crypto
    .createHmac("sha256", signingSecret())
    .update(canonicalPlan(command, plan))
    .digest("hex");
}

function verifyPlanSignature(
  command: string,
  plan: AdminAiPlan,
  signature: string,
): boolean {
  if (
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expected = signPlan(
    command,
    plan,
  );

  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    providedBuffer,
  );
}

export async function createAdminAiPlan(
  command: string,
): Promise<SignedAdminAiPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }

  const jobs = await sarjomRepository.listJobs();

  const ai = new GoogleGenAI({
    apiKey,
  });

  const prompt = `
You are SARJOM Admin AI.

Create a SAFE JSON action plan only.

Never invent a job ID.

Existing SARJOM jobs:
${jobs
  .map(
    (job) =>
      `${job.id} | ${job.title} | ${job.organization} | ${job.vacancies ?? ""} | ${job.applicationDeadline ?? ""}`,
  )
  .join("\n")}

ADMIN COMMAND:
${command}

Return ONLY JSON:

{
  "action": "update-job|inspect-job|refresh-job|unsupported",
  "jobId": null,
  "patch": {},
  "reason": "",
  "requiresConfirmation": true
}

Rules:

1. Never invent a job ID.
2. For inspection requests, do not propose changes.
3. Only use update-job fields from:
${Array.from(ALLOWED_FIELDS).join(", ")}
4. Any modification requires confirmation.
5. If the requested operation cannot safely be represented, use "unsupported".
6. Do not invent facts about jobs.
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
  });

  const raw = interaction.output_text || "";

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start < 0 || end <= start) {
    throw new Error(
      "Admin AI returned invalid JSON.",
    );
  }

  const parsed = JSON.parse(
    raw.slice(start, end + 1),
  ) as AdminAiPlan;

  if (
    !parsed ||
    typeof parsed !== "object"
  ) {
    throw new Error(
      "Admin AI returned an invalid plan.",
    );
  }

  if (
    ![
      "update-job",
      "inspect-job",
      "refresh-job",
      "unsupported",
    ].includes(parsed.action)
  ) {
    parsed.action = "unsupported";
  }

  if (
    parsed.patch &&
    typeof parsed.patch === "object"
  ) {
    for (const key of Object.keys(parsed.patch)) {
      if (!ALLOWED_FIELDS.has(key)) {
        delete parsed.patch[key];
      }
    }
  } else {
    parsed.patch = {};
  }

  parsed.requiresConfirmation = true;

  if (parsed.action !== "update-job") {
    parsed.patch = {};
  }

  const issuedAt = new Date();
  const expiresAt = new Date(
    issuedAt.getTime() + 10 * 60 * 1000,
  );

  const plan: AdminAiPlan = {
    action: parsed.action,
    jobId:
      typeof parsed.jobId === "string"
        ? parsed.jobId
        : null,
    patch: parsed.patch,
    reason:
      typeof parsed.reason === "string"
        ? parsed.reason
        : "No reasoning provided.",
    requiresConfirmation: true,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  return {
    plan,
    planSignature: signPlan(
      command,
      plan,
    ),
  };
}

async function hasReplay(
  planSignature: string,
): Promise<boolean> {
  const changes = await sarjomRepository.listChanges();

  return changes.some(
    (change) =>
      change.actor === "admin-ai" &&
      change.planSignature === planSignature,
  );
}

export async function executeAdminAiPlan(
  plan: AdminAiPlan,
  planSignature: string,
  reason: string,
  command: string,
): Promise<unknown> {
  if (
    !verifyPlanSignature(
      command,
      plan,
      planSignature,
    )
  ) {
    throw new Error(
      "Invalid or expired SARJOM Admin AI plan signature.",
    );
  }

  const now = Date.now();
  const expiresAt = Date.parse(plan.expiresAt);

  if (
    !Number.isFinite(expiresAt) ||
    now >= expiresAt
  ) {
    throw new Error(
      "SARJOM Admin AI plan has expired.",
    );
  }

  if (await hasReplay(planSignature)) {
    throw new Error(
      "SARJOM Admin AI plan has already been executed.",
    );
  }

  if (plan.action === "inspect-job") {
    if (!plan.jobId) {
      throw new Error("A job ID is required for read-only inspection.");
    }
    return getCanonicalJob(plan.jobId);
  }

  if (
    plan.action !== "update-job" ||
    !plan.jobId
  ) {
    throw new Error(
      "Only confirmed update-job plans can be executed.",
    );
  }

  return updateJobAsAdmin(
    plan.jobId,
    plan.patch as any,
    reason,
    {
      actor: "admin-ai",
      planSignature,
    },
  );
}








