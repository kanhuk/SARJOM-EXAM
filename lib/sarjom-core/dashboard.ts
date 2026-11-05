import { sarjomRepository } from './repository.js';
import { calculateDaysRemaining } from './lifecycle.js';
import type { SarjomJob } from './types.js';

export interface DashboardData {
  latestNotifications: SarjomJob[];
  openApplications: SarjomJob[];
  closingSoon: SarjomJob[];
  upcomingJobs: SarjomJob[];
  admitCards: SarjomJob[];
  upcomingExams: SarjomJob[];
  results: SarjomJob[];
  answerKeys: SarjomJob[];
  odishaJobs: SarjomJob[];
}

function recentFirst(a: SarjomJob, b: SarjomJob): number {
  return (b.publishedAt || b.discoveredAt).localeCompare(a.publishedAt || a.discoveredAt);
}

export async function buildDashboardData(): Promise<DashboardData> {
  const jobs = await sarjomRepository.listJobs();

  // Never expose automatic records that are explicitly held for admin review.
  const current = jobs.filter(
    job => !job.superseded && job.publicationStatus !== 'hold-for-review',
  );

  const open = current.filter(job => job.lifecycle === 'open' || job.lifecycle === 'closing-soon');
  const closing = open.filter(job => {
    const days = calculateDaysRemaining(job.applicationDeadline);
    return days !== null && days >= 0 && days <= 7;
  });

  return {
    latestNotifications: current.filter(job => job.verified && !job.isExpected).sort(recentFirst).slice(0, 20),
    openApplications: open.sort(recentFirst).slice(0, 50),
    closingSoon: closing.sort(
      (a, b) =>
        (calculateDaysRemaining(a.applicationDeadline) ?? 999) -
        (calculateDaysRemaining(b.applicationDeadline) ?? 999),
    ).slice(0, 20),
    upcomingJobs: current.filter(job => job.isExpected || job.lifecycle === 'upcoming').sort(recentFirst).slice(0, 20),
    admitCards: current.filter(job => job.lifecycle === 'admit-card-released').sort(recentFirst).slice(0, 20),
    upcomingExams: current.filter(
      job => job.examDate && ['exam-scheduled', 'admit-card-released', 'closed'].includes(job.lifecycle),
    ).sort((a, b) => (a.examDate || '').localeCompare(b.examDate || '')).slice(0, 20),
    results: current.filter(job => job.lifecycle === 'result-released' || Boolean(job.resultUrl)).sort(recentFirst).slice(0, 20),
    answerKeys: current.filter(job => job.lifecycle === 'answer-key-released' || Boolean(job.answerKeyUrl)).sort(recentFirst).slice(0, 20),
    odishaJobs: current.filter(job => job.stateCode === 'OD').sort(recentFirst).slice(0, 50),
  };
}
