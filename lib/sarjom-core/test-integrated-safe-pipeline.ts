import { reconcileRecruitmentEvidence } from '../job-discovery/reconciliation.js';
import { processDiscoveredJob } from './auto-engine.js';
import { sarjomRepository } from './repository.js';

const SOURCE_ARTICLE =
  'https://www.freejobalert.com/articles/btsc-junior-engineer-recruitment-2026-apply-online-for-2809-posts-3032777';

const TEST_JOB = {
  id: 'sarjom-integrated-pipeline-btsc-test',
  title: 'BTSC Junior Engineer Civil Recruitment 2026',
  organization: 'Bihar Technical Service Commission',
  source: 'FreeJobAlert',
  sourceUrl: SOURCE_ARTICLE,
  sourceType: 'job-portal' as const,
  category: 'engineering' as const,
  relevanceScore: 90,
  verificationScore: 0,
  verified: false,
  status: 'new' as const,
  discoveredAt: new Date().toISOString(),
  keywords: ['BTSC', 'Junior Engineer', 'Civil', 'Bihar', 'Recruitment'],
  vacancies: 2809,
};

async function main() {
  console.log('\n========================================');
  console.log(' SARJOM INTEGRATED SAFE PIPELINE TEST');
  console.log('========================================\n');

  const result = await processDiscoveredJob(
    TEST_JOB,
    SOURCE_ARTICLE,
    'btsc.bihar.gov.in',
  );

  console.log(JSON.stringify({
    success: result.success,
    warnings: result.warnings,
    job: {
      id: result.job.id,
      title: result.job.title,
      vacancies: result.job.vacancies,
      applicationStartDate: result.job.applicationStartDate,
      applicationDeadline: result.job.applicationDeadline,
      examDate: result.job.examDate,
      lifecycle: result.job.lifecycle,
      verified: result.job.verified,
      publicationStatus: result.job.publicationStatus,
      reviewRequired: result.job.reviewRequired,
      publicationReason: result.job.publicationReason,
      reconciliation: result.job.reconciliation,
    },
  }, null, 2));

  const stored = await sarjomRepository.getJob(result.job.id);
  if (!stored) throw new Error('Integrated pipeline record was not saved.');

  if (stored.publicationStatus !== 'hold-for-review') {
    throw new Error(
      `Expected this intentionally conflicting source/article test to be held. Got: ${stored.publicationStatus}`,
    );
  }

  await sarjomRepository.deleteJob(result.job.id);

  console.log('\n========================================');
  console.log(' INTEGRATED SAFE PIPELINE TEST PASSED');
  console.log('========================================\n');
}

main().catch(error => {
  console.error('\nINTEGRATED PIPELINE TEST FAILED');
  console.error(error);
  process.exit(1);
});
