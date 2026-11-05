import {
  processOfficialCandidate,
} from './auto-engine.js';

import type {
  DiscoveredJob,
} from '../job-discovery/types.js';

const job: DiscoveredJob = {
  id: 'production-gemini-integration-test',
  title: 'Bihar Technical Service Commission Recruitment',
  organization: 'Bihar Technical Service Commission',
  sourceUrl: 'https://btsc.bihar.gov.in/',
  source: 'official-test',
  sourceType: 'government',
  category: 'government',
  discoveredAt: new Date().toISOString(),
  keywords: ['recruitment', 'government', 'job'],
  relevanceScore: 95,
  verificationScore: 95,
  verified: true,
  status: 'open',
};

const result =
  await processOfficialCandidate({
    job,

    documentUrl:
      'https://btsc.bihar.gov.in/sites/default/files/Advertisement/Civil.pdf',

    documentTitle:
      'BTSC Civil Recruitment Advertisement',

    officialWebsiteUrl:
      'https://btsc.bihar.gov.in/',

    officialDomain:
      'btsc.bihar.gov.in',

    documentType:
      'notification',
  });

console.log('');
console.log('========================================');
console.log(' SARJOM PRODUCTION CANDIDATE TEST');
console.log('========================================');
console.log('');

console.log(
  JSON.stringify(
    {
      success: result.success,
      job: result.job
        ? {
            id: result.job.id,
            title: result.job.title,
            organization: result.job.organization,
            lifecycle: result.job.lifecycle,
            publicationStatus:
              result.job.publicationStatus,
            reviewRequired:
              result.job.reviewRequired,
            verified:
              result.job.verified,
            verificationScore:
              result.job.verificationScore,
            reconciliation:
              result.job.reconciliation,
            applicationOpen:
              result.job.applicationOpen,
            modificationType:
              result.job.reconciliation
                ? result.job.reconciliation.versionDecision
                : null,
            versionReasons:
              result.job.reconciliation
                ? result.job.reconciliation.versionReasons
                : [],
          }
        : null,
      warnings: result.warnings,
    },
    null,
    2,
  ),
);

console.log('');
console.log('========================================');
console.log(' PRODUCTION CANDIDATE TEST COMPLETE');
console.log('========================================');
console.log('');






