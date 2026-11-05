import { evaluateNotificationFreshness } from '../job-discovery/notification-freshness.js';
import type { SarjomJob, RecruitmentLifecycle } from './types.js';

export function calculateDaysRemaining(deadline?: string | null): number | null {
  if (!deadline) return null;
  const parsed = new Date(`${deadline}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.ceil((parsed.getTime() - start) / 86400000);
}

export function deriveRecruitmentLifecycle(job: Pick<SarjomJob, 'applicationStartDate' | 'applicationDeadline' | 'examDate' | 'admitCardUrl' | 'resultUrl' | 'answerKeyUrl' | 'isExpected' | 'superseded'>): RecruitmentLifecycle {
  if (job.superseded) return 'cancelled';
  if (job.resultUrl) return 'result-released';
  if (job.answerKeyUrl) return 'answer-key-released';
  if (job.admitCardUrl) return 'admit-card-released';

  const freshness = evaluateNotificationFreshness({
    applicationStartDate: job.applicationStartDate,
    applicationLastDate: job.applicationDeadline,
    examDate: job.examDate,
  });

  if (job.isExpected) return 'upcoming';
  if (freshness.status === 'open') {
    const remaining = calculateDaysRemaining(job.applicationDeadline);
    return remaining !== null && remaining >= 0 && remaining <= 7 ? 'closing-soon' : 'open';
  }
  if (freshness.status === 'upcoming') return 'upcoming';
  if (freshness.status === 'expired') {
    return job.examDate ? 'exam-scheduled' : 'closed';
  }
  return 'unknown';
}

export function refreshJobLifecycle(job: SarjomJob): SarjomJob {
  return { ...job, lifecycle: deriveRecruitmentLifecycle(job) };
}
