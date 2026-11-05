import {
  getCanonicalJob,
  queryCanonicalJobs,
} from './ai/canonical-query.js';
import { sarjomRepository } from './repository.js';
import type { SarjomJob } from './types.js';

const prefix = `canonical-ai-test-${Date.now()}`;

function makeJob(
  id: string,
  overrides: Partial<SarjomJob> = {},
): SarjomJob {
  return {
    id,
    title: `Canonical Test ${id}`,
    organization: 'SARJOM TEST',
    source: 'https://example.gov.in',
    sourceUrl: 'https://example.gov.in/recruitment',
    officialUrl: 'https://example.gov.in/recruitment',
    sourceType: 'government',
    category: 'government',
    location: 'Odisha',
    state: 'Odisha',
    stateCode: 'OD',
    districts: ['Mayurbhanj'],
    vacancies: 10,
    qualification: 'Graduate',
    applicationStartDate: '2026-09-01',
    applicationDeadline: '2026-10-01',
    publishedAt: '2026-09-01',
    description: 'Canonical SARJOM AI test recruitment',
    relevanceScore: 100,
    verificationScore: 100,
    verified: true,
    status: 'active',
    discoveredAt: '2026-09-01',
    keywords: ['SSC', 'test'],
    lifecycle: 'open',
    publicationStatus: 'published',
    reviewRequired: false,
    superseded: false,
    lastVerifiedAt: '2026-09-29T00:00:00.000Z',
    sourceConfidence: 1,
    ...overrides,
  } as SarjomJob;
}

async function main() {
  const ids = {
    public: `${prefix}-public`,
    held: `${prefix}-held`,
    draft: `${prefix}-draft`,
    superseded: `${prefix}-superseded`,
    unknown: `${prefix}-unknown`,
    review: `${prefix}-review`,
  };

  try {
    await sarjomRepository.saveJob(makeJob(ids.public));

    await sarjomRepository.saveJob(
      makeJob(ids.held, {
        publicationStatus: 'hold-for-review',
        reviewRequired: true,
      }),
    );

    await sarjomRepository.saveJob(
      makeJob(ids.draft, {
        publicationStatus: 'draft',
      }),
    );

    await sarjomRepository.saveJob(
      makeJob(ids.superseded, {
        superseded: true,
      }),
    );

    await sarjomRepository.saveJob(
      makeJob(ids.unknown, {
        lifecycle: 'unknown',
      }),
    );

    await sarjomRepository.saveJob(
      makeJob(ids.review, {
        reviewRequired: true,
      }),
    );

    const result = await queryCanonicalJobs({
      query: 'SSC',
      stateCode: 'OD',
      district: 'Mayurbhanj',
      limit: 50,
    });

    const returnedIds = result.jobs.map(job => job.id);

    if (!returnedIds.includes(ids.public)) {
      throw new Error('Published canonical job was not returned.');
    }

    for (const blockedId of [
      ids.held,
      ids.draft,
      ids.superseded,
      ids.unknown,
      ids.review,
    ]) {
      if (returnedIds.includes(blockedId)) {
        throw new Error(
          `Unsafe record leaked into canonical AI results: ${blockedId}`,
        );
      }

      const direct = await getCanonicalJob(blockedId);

      if (direct !== null) {
        throw new Error(
          `Unsafe record was directly accessible: ${blockedId}`,
        );
      }
    }

    const publicJob = await getCanonicalJob(ids.public);

    if (!publicJob) {
      throw new Error('Public canonical job could not be fetched.');
    }

    if (publicJob.source.recordId !== ids.public) {
      throw new Error('Canonical provenance record ID is incorrect.');
    }

    if (publicJob.source.officialUrl !== 'https://example.gov.in/recruitment') {
      throw new Error('Canonical provenance official URL is incorrect.');
    }

    if (publicJob.source.lastVerifiedAt !== '2026-09-29T00:00:00.000Z') {
      throw new Error('Canonical provenance verification timestamp is incorrect.');
    }

    if (publicJob.sourceConfidence !== 1) {
      throw new Error('Canonical source confidence is incorrect.');
    }

    console.log('✓ Published canonical record returned');
    console.log('✓ hold-for-review blocked');
    console.log('✓ draft blocked');
    console.log('✓ superseded blocked');
    console.log('✓ unknown lifecycle blocked');
    console.log('✓ review-required blocked');
    console.log('✓ direct unsafe-record access blocked');
    console.log('✓ official provenance preserved');
    console.log('');
    console.log('SARJOM CANONICAL AI QUERY TESTS PASSED');
  } finally {
    for (const id of Object.values(ids)) {
      await sarjomRepository.deleteJob(id);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
