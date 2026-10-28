import { processDiscoveredJob } from './auto-engine.js';
import { sarjomRepository } from './repository.js';

const SOURCE_ARTICLE =
  'https://www.freejobalert.com/articles/btsc-junior-engineer-recruitment-2026-apply-online-for-2809-posts-3032777';

const OFFICIAL_DOMAIN = 'btsc.bihar.gov.in';

const TEST_JOB = {
  id: 'sarjom-real-pipeline-btsc-je-civil-test',
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
  keywords: [
    'BTSC',
    'Junior Engineer',
    'JE',
    'Civil',
    'Bihar',
    'Recruitment',
  ],
  vacancies: 2809,
};

async function main() {
  console.log('\n========================================');
  console.log(' SARJOM REAL END-TO-END PIPELINE TEST');
  console.log('========================================\n');

  console.log('Source article:');
  console.log(SOURCE_ARTICLE);
  console.log(`Official domain: ${OFFICIAL_DOMAIN}\n`);

  console.log('Pipeline:');
  console.log('1. Discover official notification');
  console.log('2. Match official document');
  console.log('3. Download PDF temporarily');
  console.log('4. Analyze PDF with Gemini');
  console.log('5. Evaluate notification freshness');
  console.log('6. Derive recruitment lifecycle');
  console.log('7. Save to Upstash Redis');
  console.log('8. Read back from Upstash Redis\n');

  let savedId: string | null = null;

  try {
    const result = await processDiscoveredJob(
      TEST_JOB,
      SOURCE_ARTICLE,
      OFFICIAL_DOMAIN,
    );

    savedId = result.job.id;

    console.log('\n========================================');
    console.log(' PIPELINE RESULT');
    console.log('========================================\n');

    console.log(
      JSON.stringify(
        {
          success: result.success,
          warnings: result.warnings,
          selectedDocument: result.selectedDocument,
          job: {
            id: result.job.id,
            title: result.job.title,
            organization: result.job.organization,
            vacancies: result.job.vacancies,
            applicationStartDate: result.job.applicationStartDate,
            applicationDeadline: result.job.applicationDeadline,
            examDate: result.job.examDate,
            status: result.job.status,
            lifecycle: result.job.lifecycle,
            verified: result.job.verified,
            verificationScore: result.job.verificationScore,
            officialNotificationUrl:
              result.job.officialNotificationUrl,
            superseded: result.job.superseded,
            versionReason: result.job.versionReason,
          },
        },
        null,
        2,
      ),
    );

    const stored = await sarjomRepository.getJob(result.job.id);

    console.log('\n========================================');
    console.log(' UPSTASH READ-BACK');
    console.log('========================================\n');

    if (!stored) {
      throw new Error(
        'Pipeline saved the job but Upstash read-back returned null.',
      );
    }

    console.log(
      JSON.stringify(
        {
          found: true,
          id: stored.id,
          lifecycle: stored.lifecycle,
          status: stored.status,
          verified: stored.verified,
          title: stored.title,
        },
        null,
        2,
      ),
    );

    console.log('\n========================================');
    console.log(' REAL PIPELINE TEST PASSED');
    console.log('========================================\n');

  } finally {
    if (savedId) {
      await sarjomRepository.deleteJob(savedId);
      console.log(
        `[SARJOM] Temporary test job removed from Upstash: ${savedId}`,
      );
    }
  }
}

main().catch((error) => {
  console.error('\n========================================');
  console.error(' REAL PIPELINE TEST FAILED');
  console.error('========================================\n');
  console.error(error);
  process.exit(1);
});
