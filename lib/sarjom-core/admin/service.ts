import crypto from 'node:crypto';
import type { SarjomJob } from '../types.js';
import { sarjomRepository } from '../repository.js';
import { refreshAllStoredJobs } from '../auto-engine.js';

export type AdminOperation =
  | 'refresh-lifecycle'
  | 'rebuild-lifecycle-indexes'
  | 'list-review'
  | 'get-job'
  | 'publish'
  | 'hold-review';

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function assertAdminSecret(secret: string | undefined): void {
  const expected = process.env.SARJOM_ADMIN_SECRET;

  if (!expected) {
    throw new Error(
      'SARJOM_ADMIN_SECRET is not configured. Admin operations are disabled.',
    );
  }

  if (!secret || secret.length !== expected.length) {
    throw new Error('Unauthorized');
  }

  const valid = crypto.timingSafeEqual(
    Buffer.from(secret),
    Buffer.from(expected),
  );

  if (!valid) {
    throw new Error('Unauthorized');
  }
}

export function getBearerSecret(req: any): string | undefined {
  const authorization =
    req?.headers?.authorization ??
    req?.headers?.Authorization;

  if (typeof authorization !== 'string') {
    return undefined;
  }

  return authorization.replace(/^Bearer\s+/i, '');
}

export async function requireAdmin(req: any): Promise<void> {
  assertAdminSecret(getBearerSecret(req));
}

async function recordAdminChange(
  entityId: string,
  action: string,
  before?: Record<string, unknown>,
  after?: Record<string, unknown>,
  reason?: string,
): Promise<void> {
  await sarjomRepository.saveChange({
    id: createId('change'),
    createdAt: new Date().toISOString(),
    actor: 'admin',
    entityType: 'job',
    entityId,
    action,
    before,
    after,
    reason,
  });
}

export async function adminRefreshLifecycle() {
  await requireAdmin({ headers: {} });

  return refreshAllStoredJobs();
}

export async function refreshLifecycleWithRequest(req: any) {
  await requireAdmin(req);

  return refreshAllStoredJobs();
}

export async function rebuildIndexesWithRequest(req: any) {
  await requireAdmin(req);

  return sarjomRepository.rebuildLifecycleIndexes();
}

export async function listReviewJobs(req: any): Promise<SarjomJob[]> {
  await requireAdmin(req);

  const jobs = await sarjomRepository.listJobs();

  return jobs.filter(job =>
    job.publicationStatus === 'hold-for-review' ||
    job.reviewRequired === true ||
    job.lifecycle === 'unknown',
  );
}

export async function getAdminJob(
  req: any,
  id: string,
): Promise<SarjomJob | null> {
  await requireAdmin(req);

  return sarjomRepository.getJob(id);
}

export async function setPublicationStatus(
  req: any,
  id: string,
  status: 'published' | 'hold-for-review',
  reason: string,
): Promise<SarjomJob> {
  await requireAdmin(req);

  const job = await sarjomRepository.getJob(id);

  if (!job) {
    throw new Error('Job not found');
  }

  const before = {
    publicationStatus: job.publicationStatus,
    reviewRequired: job.reviewRequired,
    publicationReason: job.publicationReason,
  };

  const updated: SarjomJob = {
    ...job,
    publicationStatus: status,
    reviewRequired: status === 'hold-for-review',
    publicationReason: reason,
  };

  await sarjomRepository.saveJob(updated);

  await recordAdminChange(
    id,
    status === 'published'
      ? 'publish-job'
      : 'hold-job-for-review',
    before,
    {
      publicationStatus: updated.publicationStatus,
      reviewRequired: updated.reviewRequired,
      publicationReason: updated.publicationReason,
    },
    reason,
  );

  return updated;
}
