import {
  sarjomRepository,
  hasPersistentSarjomStore,
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

const TEST_JOB_ID =
  'redis-persistence-test-job';

const TEST_TITLE =
  'SARJOM Redis Persistence Verification';

console.log(
  '\n========================================',
);

console.log(
  ' SARJOM REDIS PERSISTENCE TEST',
);

console.log(
  '========================================\n',
);

/*
 * -----------------------------------------------------
 * 1. VERIFY PERSISTENT STORE
 * -----------------------------------------------------
 */

console.log(
  `Persistent store: ${hasPersistentSarjomStore}`,
);

assert(
  hasPersistentSarjomStore,
  'Redis is not configured. This test requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
);

/*
 * -----------------------------------------------------
 * 2. CREATE TEST JOB
 * -----------------------------------------------------
 */

const now =
  new Date().toISOString();

const testJob: SarjomJob = {
  id:
    TEST_JOB_ID,

  title:
    TEST_TITLE,

  organization:
    'SARJOM Persistence Test',

  source:
    'redis-persistence-test',

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

  vacancies:
    123,

  applicationStartDate:
    '2026-08-01',

  applicationDeadline:
    '2026-09-30',

  relevanceScore:
    100,

  verificationScore:
    100,

  verified:
    true,

  status:
    'open',

  discoveredAt:
    now,

  publishedAt:
    now,

  keywords: [
    'redis',
    'persistence',
    'test',
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
};

try {

  /*
   * ---------------------------------------------------
   * 3. REMOVE ANY OLD TEST RECORD
   * ---------------------------------------------------
   *
   * This makes the test repeatable.
   */

  await sarjomRepository.deleteJob(
    TEST_JOB_ID,
  );

  /*
   * ---------------------------------------------------
   * 4. PROCESS A — WRITE TO REDIS
   * ---------------------------------------------------
   */

  console.log(
    'PROCESS A — SAVING TEST JOB...',
  );

  const saved =
    await sarjomRepository.saveJob(
      testJob,
    );

  assert(
    saved.id ===
      TEST_JOB_ID,
    'Saved job ID does not match the test ID.',
  );

  assert(
    saved.title ===
      TEST_TITLE,
    'Saved job title does not match.',
  );

  console.log(
    'PROCESS A — SAVE SUCCESS',
  );

  /*
   * ---------------------------------------------------
   * 5. READ IMMEDIATELY
   * ---------------------------------------------------
   */

  const immediate =
    await sarjomRepository.getJob(
      TEST_JOB_ID,
    );

  assert(
    Boolean(immediate),
    'Job could not be read immediately after saving.',
  );

  assert(
    immediate?.title ===
      TEST_TITLE,
    'Immediate read returned incorrect title.',
  );

  assert(
    immediate?.vacancies ===
      123,
    'Immediate read returned incorrect vacancies.',
  );

  console.log(
    'IMMEDIATE READ — SUCCESS',
  );

  /*
   * ---------------------------------------------------
   * 6. LIST INDEX VERIFICATION
   * ---------------------------------------------------
   */

  const jobs =
    await sarjomRepository.listJobs();

  const indexed =
    jobs.find(
      job =>
        job.id ===
        TEST_JOB_ID,
    );

  assert(
    Boolean(indexed),
    'Saved job was not present in the persistent job index.',
  );

  console.log(
    'REDIS INDEX — SUCCESS',
  );

  /*
   * ---------------------------------------------------
   * 7. SIMULATED PROCESS RESTART
   * ---------------------------------------------------
   *
   * Node process restart cannot happen inside the
   * same process. The actual cross-process verification
   * is performed by the second command below.
   *
   * We therefore leave the record in Redis.
   */

  console.log(
    '\n========================================',
  );

  console.log(
    ' PROCESS A PERSISTENCE CHECK PASSED',
  );

  console.log(
    '========================================\n',
  );

  console.log(
    'The test record remains in Redis.',
  );

  console.log(
    `Test ID: ${TEST_JOB_ID}`,
  );

  console.log(
    '\nNow run PROCESS B:',
  );

  console.log(
    'node --env-file=.env.local dist\\lib\\sarjom-core\\test-redis-persistence-read.js',
  );

} catch (error) {

  console.error(
    '\nREDIS PERSISTENCE TEST FAILED:',
  );

  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );

  process.exitCode = 1;

}