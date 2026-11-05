import {
  refreshAllStoredJobs,
} from './auto-engine.js';

import {
  sarjomRepository,
} from './repository.js';

import type {
  SarjomJob,
} from './types.js';

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

function makeJob(
  overrides: Partial<SarjomJob>,
): SarjomJob {
  return {
    id: 'auto-test-job',

    title:
      'Automatic Engine Test',

    organization:
      'SARJOM Test Organization',

    source: 'test',

    sourceUrl:
      'https://example.gov.in',

    sourceType:
      'government',

    category:
      'government',

    state:
      'Odisha',

    stateCode:
      'OD',

    districts: [
      'Mayurbhanj',
    ],

    vacancies: 100,

    applicationStartDate:
      '2026-08-01',

    applicationDeadline:
      '2026-09-30',

    relevanceScore: 100,

    verificationScore: 100,

    verified: true,

    status: 'open',

    discoveredAt:
      '2026-08-01T00:00:00.000Z',

    publishedAt:
      '2026-08-01T00:00:00.000Z',

    keywords: [
      'government',
      'recruitment',
    ],

    contentType:
      'job',

    lifecycle:
      'open',

    primarySurface:
      'active-applications',

    notificationSurfaces: [
      'active-applications',
    ],

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

    publicationStatus:
      'published',

    reviewRequired:
      false,

    ...overrides,
  };
}

console.log(
  '\n========================================',
);

console.log(
  ' SARJOM AUTOMATIC ENGINE REFRESH TEST',
);

console.log(
  '========================================\n',
);

const testIds = [
  'engine-open',
  'engine-closing',
  'engine-closed',
  'engine-review',
];

try {

  /*
   * -----------------------------------------------------
   * OPEN RECRUITMENT
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'engine-open',

      applicationDeadline:
        '2026-09-30',

      lifecycle:
        'open',

      primarySurface:
        'active-applications',

      notificationSurfaces: [
        'active-applications',
      ],

      applicationOpen:
        true,

      closingSoon:
        false,

      applicationEnded:
        false,
    }),
  );

  /*
   * -----------------------------------------------------
   * CLOSING SOON
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'engine-closing',

      applicationDeadline:
        '2026-08-20',

      lifecycle:
        'open',

      primarySurface:
        'active-applications',

      notificationSurfaces: [
        'active-applications',
      ],

      applicationOpen:
        true,

      closingSoon:
        false,

      applicationEnded:
        false,
    }),
  );

  /*
   * -----------------------------------------------------
   * CLOSED + ADMIT CARD PENDING
   *
   * This record deliberately contains
   * an OLD / WRONG lifecycle.
   *
   * The automatic lifecycle engine must
   * recalculate it.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'engine-closed',

      applicationDeadline:
        '2026-07-31',

      lifecycle:
        'open',

      primarySurface:
        'active-applications',

      notificationSurfaces: [
        'active-applications',
      ],

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
    }),
  );

  /*
   * -----------------------------------------------------
   * REVIEW REQUIRED
   *
   * This record must be skipped by the
   * automatic lifecycle refresh.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'engine-review',

      lifecycle:
        'unknown',

      primarySurface:
        'review',

      notificationSurfaces: [],

      applicationOpen:
        false,

      closingSoon:
        false,

      applicationEnded:
        false,

      publicationStatus:
        'hold-for-review',

      reviewRequired:
        true,
    }),
  );

  /*
   * -----------------------------------------------------
   * RUN AUTOMATIC REFRESH
   * -----------------------------------------------------
   */

  console.log(
    'Running refreshAllStoredJobs()...\n',
  );

  const result =
    await refreshAllStoredJobs();

  console.log(
    JSON.stringify(
      result,
      null,
      2,
    ),
  );

  /*
   * -----------------------------------------------------
   * BASIC ENGINE RESULT
   * -----------------------------------------------------
   */

  assert(
  result.checked >= 4,
  'Automatic engine should check at least the four test jobs.',
);
  /*
   * Open may update routing/date metadata.
   * Closing changes lifecycle.
   * Closed changes lifecycle.
   * Review is skipped.
   *
   * Therefore three records are expected
   * to be updated.
   */

  assert(
  result.updated >= 3,
  'Automatic engine should update at least three lifecycle records.',
);

  assert(
    result.errors.length === 0,
    'Automatic engine should complete without errors.',
  );

  /*
   * -----------------------------------------------------
   * READ PERSISTED RESULTS
   * -----------------------------------------------------
   */

  const open =
    await sarjomRepository.getJob(
      'engine-open',
    );

  const closing =
    await sarjomRepository.getJob(
      'engine-closing',
    );

  const closed =
    await sarjomRepository.getJob(
      'engine-closed',
    );

  const review =
    await sarjomRepository.getJob(
      'engine-review',
    );

  /*
   * -----------------------------------------------------
   * OPEN VALIDATION
   * -----------------------------------------------------
   */

  assert(
    Boolean(open),
    'Open recruitment should still exist.',
  );

  assert(
    open?.lifecycle ===
      'open',
    'Open recruitment should remain open.',
  );

  assert(
    open?.primarySurface ===
      'active-applications',
    'Open recruitment should remain in Active Applications.',
  );

  assert(
    open?.applicationOpen ===
      true,
    'Open recruitment should remain application-open.',
  );

  assert(
    open?.applicationEnded ===
      false,
    'Open recruitment must not be marked ended.',
  );

  /*
   * -----------------------------------------------------
   * CLOSING-SOON VALIDATION
   * -----------------------------------------------------
   */

  assert(
    Boolean(closing),
    'Closing recruitment should still exist.',
  );

  assert(
    closing?.lifecycle ===
      'closing-soon',
    'Closing recruitment should automatically become closing-soon.',
  );

  assert(
    closing?.primarySurface ===
      'closing-soon',
    'Closing recruitment should route to Closing Soon.',
  );

  assert(
    closing?.applicationOpen ===
      true,
    'Closing-soon recruitment should remain application-open.',
  );

  assert(
    closing?.closingSoon ===
      true,
    'Closing recruitment should be marked closingSoon.',
  );

  assert(
    closing?.applicationEnded ===
      false,
    'Closing-soon recruitment must not be marked ended.',
  );

  /*
   * -----------------------------------------------------
   * CLOSED + ADMIT CARD PENDING
   *
   * MOST IMPORTANT VALIDATION
   * -----------------------------------------------------
   */

  assert(
    Boolean(closed),
    'Closed recruitment should still exist.',
  );

  assert(
    closed?.lifecycle ===
      'admit-card-pending',
    'Closed recruitment should automatically become admit-card-pending.',
  );

  assert(
    closed?.primarySurface ===
      'archive',
    'Pending admit-card recruitment must route to archive.',
  );

  assert(
    closed?.applicationOpen ===
      false,
    'Closed recruitment must not remain application-open.',
  );

  assert(
    closed?.applicationEnded ===
      true,
    'Closed recruitment must be marked applicationEnded.',
  );

  assert(
    closed?.admitCardPending ===
      true,
    'Closed recruitment should be marked admitCardPending.',
  );

  assert(
    closed?.admitCardAvailable ===
      false,
    'Pending admit card must not be marked available.',
  );

  assert(
    closed?.primarySurface !==
      'admit-card',
    'Pending admit-card recruitment MUST NOT route to Admit Card.',
  );

  assert(
    !(
      closed?.notificationSurfaces ||
      []
    ).includes(
      'admit-card',
    ),
    'Pending admit-card recruitment must not have Admit Card notification surface.',
  );

  /*
   * -----------------------------------------------------
   * REVIEW VALIDATION
   * -----------------------------------------------------
   */

  assert(
    Boolean(review),
    'Review record should still exist.',
  );

  assert(
    review?.publicationStatus ===
      'hold-for-review',
    'Review record must remain held for review.',
  );

  assert(
    review?.reviewRequired ===
      true,
    'Review flag must remain enabled.',
  );

  assert(
    review?.lifecycle ===
      'unknown',
    'Review record lifecycle must remain unknown.',
  );

  assert(
    review?.primarySurface ===
      'review',
    'Review record must remain in review.',
  );

  assert(
    (
      review?.notificationSurfaces ||
      []
    ).length === 0,
    'Review record must have no public notification surfaces.',
  );

  /*
   * -----------------------------------------------------
   * FINAL SUCCESS
   * -----------------------------------------------------
   */

  console.log(
    '\n========================================',
  );

  console.log(
    ' AUTOMATIC ENGINE REFRESH TEST PASSED',
  );

  console.log(
    '========================================\n',
  );

} finally {

  /*
   * -----------------------------------------------------
   * CLEAN UP TEST RECORDS
   * -----------------------------------------------------
   */

  for (
    const id of testIds
  ) {
    await sarjomRepository.deleteJob(
      id,
    );
  }
}