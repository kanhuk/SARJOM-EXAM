import { sarjomRepository } from './repository.js';
import { refreshStoredJobLifecycle } from './auto-engine.js';
import type { SarjomJob } from './types.js';

const TODAY = new Date('2026-08-15T00:00:00Z');

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`SARJOM LIFECYCLE INTEGRATION TEST FAILED: ${message}`);
}

function baseJob(id: string, overrides: Partial<SarjomJob>): SarjomJob {
  return {
    id,
    title: 'Integration Recruitment',
    organization: 'Test Government Organization',
    source: 'official',
    sourceUrl: 'https://example.gov.in/recruitment',
    officialUrl: 'https://example.gov.in/recruitment',
    sourceType: 'government',
    category: 'government',
    relevanceScore: 100,
    verificationScore: 100,
    verified: true,
    status: 'open',
    discoveredAt: TODAY.toISOString(),
    keywords: ['test'],
    contentType: 'job',
    lifecycle: 'unknown',
    publicationStatus: 'published',
    reviewRequired: false,
    ...overrides,
  };
}

async function persistAndRead(job: SarjomJob): Promise<SarjomJob> {
  const refreshed = refreshStoredJobLifecycle(job, TODAY);
  await sarjomRepository.saveJob(refreshed);
  const stored = await sarjomRepository.getJob(job.id);
  assert(Boolean(stored), `${job.id} should be persisted.`);
  return stored!;
}

console.log('\n========================================');
console.log(' SARJOM LIFECYCLE PERSISTENCE INTEGRATION');
console.log('========================================\n');

const open = await persistAndRead(baseJob('integration-open', {
  applicationStartDate: '2026-08-01',
  applicationDeadline: '2026-09-30',
}));
assert(open.lifecycle === 'open', 'OPEN job should persist lifecycle=open.');
assert(open.primarySurface === 'active-applications', 'OPEN job should route to active-applications.');
assert(open.applicationOpen === true, 'OPEN job should persist applicationOpen=true.');

const closing = await persistAndRead(baseJob('integration-closing', {
  applicationStartDate: '2026-08-01',
  applicationDeadline: '2026-08-20',
}));
assert(closing.lifecycle === 'closing-soon', 'CLOSING SOON job should persist lifecycle=closing-soon.');
assert(closing.primarySurface === 'closing-soon', 'CLOSING SOON job should route to closing-soon.');
assert(closing.closingSoon === true, 'CLOSING SOON job should persist closingSoon=true.');

const closed = await persistAndRead(baseJob('integration-closed', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
}));
assert(closed.lifecycle === 'closed', 'CLOSED job should persist lifecycle=closed.');
assert(closed.applicationEnded === true, 'CLOSED job should persist applicationEnded=true.');
assert(closed.primarySurface === 'archive', 'CLOSED job should route to archive.');
assert(closed.applicationOpen === false, 'CLOSED job must not remain active.');

const admitCard = await persistAndRead(baseJob('integration-admit', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
  admitCardUrl: 'https://example.gov.in/admit-card',
}));
assert(admitCard.lifecycle === 'admit-card-released', 'ADMIT CARD job should persist admit-card-released.');
assert(admitCard.primarySurface === 'admit-card', 'ADMIT CARD job should route to admit-card.');
assert(admitCard.admitCardAvailable === true, 'ADMIT CARD job should persist admitCardAvailable=true.');
assert(admitCard.applicationOpen === false, 'ADMIT CARD job must not be active.');

const exam = await persistAndRead(baseJob('integration-exam', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
  examDate: '2026-09-20',
}));
assert(exam.lifecycle === 'exam-scheduled', 'EXAM job should persist lifecycle=exam-scheduled.');
assert(exam.primarySurface === 'exam-date', 'EXAM job should route to exam-date.');
assert(exam.examDateKnown === true, 'EXAM job should persist examDateKnown=true.');
assert(exam.notificationSurfaces?.includes('exam-date') === true, 'Exam job should appear on exam-date notification surface.');
assert(exam.notificationSurfaces?.includes('admit-card') !== true, 'Exam job must not appear on admit-card surface when admit card is only pending.');
const answerKey = await persistAndRead(baseJob('integration-answer-key', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
  examDate: '2026-09-20',
  answerKeyUrl: 'https://example.gov.in/answer-key',
}));

assert(
  answerKey.lifecycle === 'answer-key-released',
  'ANSWER KEY job should persist lifecycle=answer-key-released.',
);

assert(
  answerKey.primarySurface === 'answer-keys',
  'ANSWER KEY job should route to answer-keys.',
);

assert(
  answerKey.answerKeyUrl === 'https://example.gov.in/answer-key',
  'ANSWER KEY job should persist answerKeyUrl.',
);

assert(
  answerKey.applicationOpen === false,
  'ANSWER KEY job must not be active.',
);

assert(
  answerKey.notificationSurfaces?.includes('answer-keys') === true,
  'ANSWER KEY job should appear on answer-keys notification surface.',
);

assert(
  answerKey.notificationSurfaces?.includes('admit-card') !== true,
  'ANSWER KEY job must not appear on admit-card surface.',
);

const result = await persistAndRead(baseJob('integration-result', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
  examDate: '2026-09-20',
  resultUrl: 'https://example.gov.in/result',
}));

assert(
  result.lifecycle === 'result-released',
  'RESULT job should persist lifecycle=result-released.',
);

assert(
  result.primarySurface === 'results',
  'RESULT job should route to results.',
);

assert(
  result.resultUrl === 'https://example.gov.in/result',
  'RESULT job should persist resultUrl.',
);

assert(
  result.applicationOpen === false,
  'RESULT job must not be active.',
);

assert(
  result.notificationSurfaces?.includes('results') === true,
  'RESULT job should appear on results notification surface.',
);

assert(
  result.notificationSurfaces?.includes('admit-card') !== true,
  'RESULT job must not appear on admit-card surface.',
);
const review = await persistAndRead(baseJob('integration-review', {
  applicationStartDate: '2026-06-01',
  applicationDeadline: '2026-07-31',
  reviewRequired: true,
  publicationStatus: 'hold-for-review',
}));
assert(review.publicationStatus === 'hold-for-review', 'REVIEW job must remain blocked.');
assert(review.primarySurface === 'review', 'REVIEW job should route to review.');
assert(review.applicationOpen === false, 'REVIEW job must not be active.');

console.log('\n========================================');
console.log(' LIFECYCLE PERSISTENCE INTEGRATION PASSED');
console.log('========================================\n');
