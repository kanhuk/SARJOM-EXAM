import {
  refreshStoredJobLifecycle,
} from './auto-engine.js';

import type {
  SarjomJob,
} from './types.js';

function baseJob(): SarjomJob {
  return {
    id: 'integration-version-lifecycle',
    contentType: 'job',

    title: 'Junior Engineer Recruitment',

    organization:
      'Example Commission',

    source: 'official',

    sourceUrl:
      'https://gov.example/28-2025.pdf',

    officialUrl:
      'https://gov.example/28-2025.pdf',

    sourceType:
      'government',

    category:
      'government',

    relevanceScore: 100,

    verificationScore: 100,

    verified: true,

    status: 'open',

    discoveredAt:
      '2026-01-01T00:00:00.000Z',

    keywords: [
      'junior',
      'engineer',
    ],


    lifecycle: 'open',

    applicationStartDate:
      '2026-01-01',

    applicationDeadline:
      '2026-12-31',

    publicationStatus:
      'published',

    reviewRequired:
      false,

    applicationOpen:
      true,

    closingSoon:
      false,

    applicationEnded:
      false,

    admitCardAvailable:
      false,

    admitCardPending:
      false,

    examDateKnown:
      false,

    examDatePassed:
      false,

    primarySurface:
      'active-applications',

    notificationSurfaces: [
      'active-applications',
    ],

    lifecycleUpdatedAt:
      '2026-01-01T00:00:00.000Z',
  } as SarjomJob;
}

console.log('');
console.log('========================================');
console.log(' SARJOM CANCELLATION / POSTPONEMENT LIFECYCLE TEST');
console.log('========================================');
console.log('');

const today =
  new Date('2026-08-17T00:00:00.000Z');

/*
 * ----------------------------------------
 * NORMAL JOB
 * ----------------------------------------
 */

const normalJob =
  baseJob();

const normalResult =
  refreshStoredJobLifecycle(
    normalJob,
    today,
  );

console.log(
  'NORMAL LIFECYCLE:',
  normalResult.lifecycle,
);

/*
 * ----------------------------------------
 * CANCELLATION
 * ----------------------------------------
 */

const cancelledJob =
  baseJob();

cancelledJob.reconciliation = {
  publicationStatus:
    'publish',

  severity:
    'none',

  safeToPublish:
    true,

  summary:
    'Official cancellation detected.',

  warnings: [],

  conflicts: [],

  versionDecision:
    'official-cancellation',

  changedFields: [
    'status',
  ],

  versionReasons: [
    'Official cancellation notice detected.',
  ],
};

const cancelledResult =
  refreshStoredJobLifecycle(
    cancelledJob,
    today,
  );

console.log(
  'CANCELLATION LIFECYCLE:',
  cancelledResult.lifecycle,
);

console.log(
  'CANCELLATION APPLICATION OPEN:',
  cancelledResult.applicationOpen,
);

if (
  cancelledResult.lifecycle !==
  'cancelled'
) {
  throw new Error(
    'Official cancellation did not produce cancelled lifecycle.',
  );
}

if (
  cancelledResult.applicationOpen !==
  false
) {
  throw new Error(
    'Cancelled recruitment is still marked application-open.',
  );
}

if (
  cancelledResult.applicationEnded !==
  true
) {
  throw new Error(
    'Cancelled recruitment is not marked application-ended.',
  );
}

if (
  cancelledResult.publicationStatus !==
  'published'
) {
  throw new Error(
    'Cancellation notice should remain publicly published.',
  );
}

/*
 * ----------------------------------------
 * POSTPONEMENT
 * ----------------------------------------
 */

const postponedJob =
  baseJob();

postponedJob.reconciliation = {
  publicationStatus:
    'publish',

  severity:
    'none',

  safeToPublish:
    true,

  summary:
    'Official postponement detected.',

  warnings: [],

  conflicts: [],

  versionDecision:
    'official-postponement',

  changedFields: [
    'examDate',
  ],

  versionReasons: [
    'Official postponement notice detected.',
  ],
};

const postponedResult =
  refreshStoredJobLifecycle(
    postponedJob,
    today,
  );

console.log(
  'POSTPONEMENT LIFECYCLE:',
  postponedResult.lifecycle,
);

console.log(
  'POSTPONEMENT APPLICATION OPEN:',
  postponedResult.applicationOpen,
);

if (
  postponedResult.lifecycle !==
  'postponed'
) {
  throw new Error(
    'Official postponement did not produce postponed lifecycle.',
  );
}

if (
  postponedResult.publicationStatus !==
  'published'
) {
  throw new Error(
    'Postponement notice should remain publicly published.',
  );
}

console.log('');
console.log('========================================');
console.log(' CANCELLATION / POSTPONEMENT TEST PASSED');
console.log('========================================');
console.log('');
