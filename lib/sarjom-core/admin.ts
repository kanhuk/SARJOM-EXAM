import crypto from 'node:crypto';
import { sarjomRepository } from './repository.js';
import type { AdminChange, SarjomJob } from './types.js';
import { refreshJobLifecycle } from './lifecycle.js';

type AdminJobPatch = Partial<Pick<SarjomJob,
  | 'title' | 'organization' | 'vacancies' | 'applicationStartDate' | 'applicationDeadline'
  | 'examDate' | 'officialNotificationUrl' | 'officialWebsiteUrl' | 'admitCardUrl'
  | 'resultUrl' | 'answerKeyUrl' | 'stateCode' | 'districts' | 'description'
  | 'verified' | 'verificationScore' | 'status'
>>;

function id(): string { return crypto.randomBytes(10).toString('hex'); }

export function assertAdminToken(value: unknown): void {
  const configured = process.env.SARJOM_ADMIN_TOKEN;
  if (!configured || typeof value !== 'string' || value !== configured) throw new Error('Unauthorized admin request.');
}

export type AdminUpdateAuditOptions = {
  actor?: 'admin' | 'admin-ai';
  planSignature?: string;
};

export async function updateJobAsAdmin(
  jobId: string,
  patch: AdminJobPatch,
  reason: string,
  auditOptions: AdminUpdateAuditOptions = {},
): Promise<SarjomJob> {
  const allowed = new Set<keyof AdminJobPatch>(['title','organization','vacancies','applicationStartDate','applicationDeadline','examDate','officialNotificationUrl','officialWebsiteUrl','admitCardUrl','resultUrl','answerKeyUrl','stateCode','districts','description','verified','verificationScore','status']);
  const safePatch = Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.has(key as keyof AdminJobPatch))) as AdminJobPatch;
  const current = await sarjomRepository.getJob(jobId);
  if (!current) throw new Error('Job not found.');
  const before = { ...current } as Record<string, unknown>;
  const next = refreshJobLifecycle({ ...current, ...safePatch });
  const saved = await sarjomRepository.saveJob(next);
  await sarjomRepository.saveChange({
    id: id(),
    createdAt: new Date().toISOString(),
    actor: auditOptions.actor ?? 'admin',
    entityType: 'job',
    entityId: jobId,
    action: 'update-job',
    planSignature: auditOptions.planSignature,
    before,
    after: safePatch as Record<string, unknown>,
    reason,
  } satisfies AdminChange);
  return saved;
}

