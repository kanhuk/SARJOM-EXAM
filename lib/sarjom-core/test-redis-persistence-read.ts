import {
  sarjomRepository,
  hasPersistentSarjomStore,
} from './repository.js';

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
  ' SARJOM REDIS PERSISTENCE READ TEST',
);

console.log(
  '========================================\n',
);

/*
 * -----------------------------------------------------
 * 1. VERIFY REDIS
 * -----------------------------------------------------
 */

assert(
  hasPersistentSarjomStore,
  'Redis is not configured.',
);

/*
 * -----------------------------------------------------
 * 2. READ FROM A NEW NODE PROCESS
 * -----------------------------------------------------
 */

console.log(
  'PROCESS B — READING TEST JOB FROM REDIS...',
);

const job =
  await sarjomRepository.getJob(
    TEST_JOB_ID,
  );

assert(
  Boolean(job),
  'Test job was not found after process restart.',
);

assert(
  job?.id ===
    TEST_JOB_ID,
  'Persisted job ID is incorrect.',
);

assert(
  job?.title ===
    TEST_TITLE,
  'Persisted job title is incorrect.',
);

assert(
  job?.vacancies ===
    123,
  'Persisted vacancy count is incorrect.',
);

assert(
  job?.stateCode ===
    'OD',
  'Persisted state code is incorrect.',
);

assert(
  job?.lifecycle ===
    'open',
  'Persisted lifecycle is incorrect.',
);

console.log(
  JSON.stringify(
    {
      id:
        job?.id,

      title:
        job?.title,

      vacancies:
        job?.vacancies,

      stateCode:
        job?.stateCode,

      lifecycle:
        job?.lifecycle,

      persistent:
        hasPersistentSarjomStore,
    },
    null,
    2,
  ),
);

/*
 * -----------------------------------------------------
 * 3. VERIFY INDEX
 * -----------------------------------------------------
 */

const jobs =
  await sarjomRepository.listJobs();

const indexed =
  jobs.find(
    item =>
      item.id ===
      TEST_JOB_ID,
  );

assert(
  Boolean(indexed),
  'Persisted job was not found in Redis job index.',
);

console.log(
  '\nREDIS PERSISTENCE VERIFIED.',
);

/*
 * -----------------------------------------------------
 * 4. CLEAN UP
 * -----------------------------------------------------
 */

await sarjomRepository.deleteJob(
  TEST_JOB_ID,
);

const afterDelete =
  await sarjomRepository.getJob(
    TEST_JOB_ID,
  );

assert(
  afterDelete ===
    null,
  'Test job was not removed during cleanup.',
);

console.log(
  'TEST RECORD CLEANED UP.',
);

console.log(
  '\n========================================',
);

console.log(
  ' REDIS PERSISTENCE TESTS PASSED',
);

console.log(
  '========================================\n',
);