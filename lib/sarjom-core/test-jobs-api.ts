import type { SarjomJob } from './types.js';
import { sarjomRepository } from './repository.js';
import handler from '../../api/jobs.js';

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
    id: 'test-job',
    title: 'SARJOM API Test Recruitment',
    organization: 'Test Government Organization',

    source: 'official-test',
    sourceUrl: 'https://example.gov.in',

    sourceType: 'government',
    category: 'government',

    state: 'Odisha',
    stateCode: 'OD',
    districts: ['Mayurbhanj'],

    vacancies: 100,

    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-09-30',

    relevanceScore: 100,
    verificationScore: 100,
    verified: true,

    status: 'open',

    discoveredAt: '2026-08-01T00:00:00.000Z',
    publishedAt: '2026-08-01T00:00:00.000Z',

    keywords: ['test', 'government'],

    contentType: 'job',

    lifecycle: 'open',

    primarySurface: 'active-applications',

    notificationSurfaces: [
      'active-applications',
    ],

    applicationOpen: true,
    closingSoon: false,
    applicationEnded: false,

    admitCardAvailable: false,
    admitCardPending: false,

    examDateKnown: false,
    examDatePassed: false,

    daysUntilDeadline: 46,
    daysUntilExam: null,

    publicationStatus: 'published',
    reviewRequired: false,

    ...overrides,
  };
}

type MockRequest = {
  method: string;
  query: Record<string, string>;
  headers: Record<string, string>;
};

type MockResponse = {
  statusCode: number;
  body: any;
  headers: Record<string, string>;

  status(code: number): MockResponse;
  setHeader(name: string, value: string): void;
  json(body: any): MockResponse;
  end(): MockResponse;
};

function createResponse(): MockResponse {
  const response: MockResponse = {
    statusCode: 200,
    body: null,
    headers: {},

    status(code: number) {
      this.statusCode = code;
      return this;
    },

    setHeader(
      name: string,
      value: string,
    ) {
      this.headers[name] = value;
    },

    json(body: any) {
      this.body = body;
      return this;
    },

    end() {
      return this;
    },
  };

  return response;
}

async function callApi(
  query: Record<string, string> = {},
): Promise<any> {
  const req: MockRequest = {
    method: 'GET',
    query,
    headers: {},
  };

  const res = createResponse();

  await handler(
    req as any,
    res as any,
  );

  assert(
    res.statusCode === 200,
    `Expected HTTP 200 but received ${res.statusCode}.`,
  );

  assert(
    res.body?.success === true,
    'API response must contain success=true.',
  );

  return res.body;
}

function ids(
  body: any,
): string[] {
  return (body.jobs || []).map(
    (job: SarjomJob) => job.id,
  );
}

console.log('\n========================================');
console.log(' SARJOM JOBS API LIFECYCLE TEST');
console.log('========================================\n');

const testJobs: SarjomJob[] = [
  /*
   * 1. Normal open application
   */
  makeJob({
    id: 'api-open',
    title: 'API Open Recruitment',

    lifecycle: 'open',

    primarySurface:
      'active-applications',

    notificationSurfaces: [
      'active-applications',
    ],

    applicationOpen: true,
    applicationEnded: false,
  }),

  /*
   * 2. Closing soon
   */
  makeJob({
    id: 'api-closing',
    title: 'API Closing Soon Recruitment',

    lifecycle: 'closing-soon',

    primarySurface:
      'closing-soon',

    notificationSurfaces: [
      'active-applications',
      'closing-soon',
    ],

    applicationOpen: true,
    closingSoon: true,
    applicationEnded: false,

    applicationDeadline:
      '2026-08-20',

    daysUntilDeadline: 5,
  }),

  /*
   * 3. Closed + admit card pending
   *
   * IMPORTANT:
   * This must stay in archive.
   * It must NOT appear in Admit Card.
   */
  makeJob({
    id: 'api-admit-pending',
    title: 'API Pending Admit Card',

    lifecycle:
      'admit-card-pending',

    primarySurface:
      'archive',

    notificationSurfaces: [],

    applicationOpen: false,
    applicationEnded: true,

    admitCardAvailable: false,
    admitCardPending: true,

    applicationDeadline:
      '2026-07-31',

    daysUntilDeadline: -15,
  }),

  /*
   * 4. Admit card actually released
   */
  makeJob({
    id: 'api-admit-released',
    title: 'API Admit Card Released',

    lifecycle:
      'admit-card-released',

    primarySurface:
      'admit-card',

    notificationSurfaces: [
      'admit-card',
    ],

    applicationOpen: false,
    applicationEnded: true,

    admitCardAvailable: true,
    admitCardPending: false,

    admitCardUrl:
      'https://example.gov.in/admit-card',

    applicationDeadline:
      '2026-07-31',

    daysUntilDeadline: -15,
  }),

  /*
   * 5. Exam date announced
   */
  makeJob({
    id: 'api-exam',
    title: 'API Exam Date Announced',

    lifecycle:
      'exam-scheduled',

    primarySurface:
      'exam-date',

    notificationSurfaces: [
      'exam-date',
    ],

    applicationOpen: false,
    applicationEnded: true,

    examDate:
      '2026-09-20',

    examDateKnown: true,
    examDatePassed: false,

    daysUntilExam: 36,

    applicationDeadline:
      '2026-07-31',

    daysUntilDeadline: -15,
  }),

  /*
   * 6. Upcoming
   */
  makeJob({
    id: 'api-upcoming',
    title: 'API Upcoming Recruitment',

    lifecycle: 'upcoming',

    primarySurface:
      'upcoming-jobs',

    notificationSurfaces: [
      'upcoming-jobs',
    ],

    applicationOpen: false,
    applicationEnded: false,

    applicationStartDate:
      '2026-10-01',

    applicationDeadline:
      '2026-10-31',

    isExpected: true,
  }),

  /*
   * 7. Review required
   *
   * This must NEVER be publicly returned.
   */
  makeJob({
    id: 'api-review',
    title: 'API Review Required',

    lifecycle: 'open',

    primarySurface:
      'active-applications',

    publicationStatus:
      'hold-for-review',

    reviewRequired: true,
  }),

  /*
   * 8. Bihar job for state filtering
   */
  makeJob({
    id: 'api-bihar',
    title: 'API Bihar Recruitment',

    state: 'Bihar',
    stateCode: 'BR',
    districts: ['Patna'],

    lifecycle: 'open',

    primarySurface:
      'active-applications',
  }),
];

const testIds =
  testJobs.map(
    job => job.id,
  );

try {
  /*
   * Insert into the IN-MEMORY repository.
   *
   * This test is intentionally run WITHOUT:
   *
   * --env-file=.env.local
   *
   * so it does not touch Upstash Redis.
   */
  for (const job of testJobs) {
    await sarjomRepository.saveJob(job);
  }

  /*
   * -----------------------------------------------------
   * ALL PUBLIC JOBS
   * -----------------------------------------------------
   */

  const all =
    await callApi();

  const allIds =
    ids(all);

  assert(
    allIds.includes('api-open'),
    'Open recruitment should be public.',
  );

  assert(
    allIds.includes('api-closing'),
    'Closing-soon recruitment should be public.',
  );

  assert(
    allIds.includes('api-admit-pending'),
    'Pending-admit recruitment should remain publicly accessible through archive/all.',
  );

  assert(
    allIds.includes('api-admit-released'),
    'Released admit-card recruitment should be public.',
  );

  assert(
    allIds.includes('api-exam'),
    'Exam-date recruitment should be public.',
  );

  assert(
    allIds.includes('api-upcoming'),
    'Upcoming recruitment should be public.',
  );

  assert(
    !allIds.includes('api-review'),
    'Review-required recruitment must never be public.',
  );

  /*
   * -----------------------------------------------------
   * ACTIVE APPLICATIONS
   * -----------------------------------------------------
   */

  const active =
    await callApi({
      surface:
        'active-applications',
    });

  const activeIds =
    ids(active);

  assert(
    activeIds.includes('api-open'),
    'Open recruitment must appear in active applications.',
  );

  assert(
    activeIds.includes('api-closing'),
    'Closing-soon recruitment must remain in active applications.',
  );

  assert(
    !activeIds.includes('api-admit-pending'),
    'Closed pending-admit recruitment must not appear in active applications.',
  );

  assert(
    !activeIds.includes('api-admit-released'),
    'Admit-card recruitment must not appear in active applications.',
  );

  /*
   * -----------------------------------------------------
   * CLOSING SOON
   * -----------------------------------------------------
   */

  const closing =
    await callApi({
      surface:
        'closing-soon',
    });

  const closingIds =
    ids(closing);

  assert(
    closingIds.includes('api-closing'),
    'Closing-soon recruitment must appear in Closing Soon.',
  );

  assert(
    !closingIds.includes('api-open'),
    'Normal open recruitment must not appear in Closing Soon.',
  );

  /*
   * -----------------------------------------------------
   * ADMIT CARD
   * -----------------------------------------------------
   */

  const admit =
    await callApi({
      surface:
        'admit-card',
    });

  const admitIds =
    ids(admit);

  assert(
    admitIds.includes('api-admit-released'),
    'Released admit card must appear in Admit Card.',
  );

  assert(
    !admitIds.includes('api-admit-pending'),
    'Pending admit card MUST NOT appear in Admit Card.',
  );

  assert(
    !admitIds.includes('api-open'),
    'Open recruitment must not appear in Admit Card.',
  );

  /*
   * -----------------------------------------------------
   * EXAM DATE
   * -----------------------------------------------------
   */

  const exams =
    await callApi({
      surface:
        'exam-date',
    });

  const examIds =
    ids(exams);

  assert(
    examIds.includes('api-exam'),
    'Exam-date recruitment must appear in Exam Date.',
  );

  assert(
    !examIds.includes('api-admit-pending'),
    'Pending admit-card recruitment must not appear in Exam Date.',
  );

  /*
   * -----------------------------------------------------
   * UPCOMING
   * -----------------------------------------------------
   */

  const upcoming =
    await callApi({
      surface:
        'upcoming-jobs',
    });

  const upcomingIds =
    ids(upcoming);

  assert(
    upcomingIds.includes('api-upcoming'),
    'Upcoming recruitment must appear in Upcoming Jobs.',
  );

  assert(
    !upcomingIds.includes('api-open'),
    'Open recruitment must not appear in Upcoming Jobs.',
  );

  /*
   * -----------------------------------------------------
   * ARCHIVE
   * -----------------------------------------------------
   */

  const archive =
    await callApi({
      surface:
        'archive',
    });

  const archiveIds =
    ids(archive);

  assert(
    archiveIds.includes('api-admit-pending'),
    'Pending admit-card recruitment must remain in Archive.',
  );

  assert(
    !archiveIds.includes('api-admit-released'),
    'Released admit-card recruitment must not remain in Archive.',
  );

  /*
   * -----------------------------------------------------
   * STATE FILTER
   * -----------------------------------------------------
   */

  const odisha =
    await callApi({
      state: 'OD',
    });

  const odishaIds =
    ids(odisha);

  assert(
    odishaIds.includes('api-open'),
    'Odisha open job should pass the state filter.',
  );

  assert(
    !odishaIds.includes('api-bihar'),
    'Bihar job must not pass the Odisha state filter.',
  );

  /*
   * -----------------------------------------------------
   * DISTRICT FILTER
   * -----------------------------------------------------
   */

  const mayurbhanj =
    await callApi({
      district:
        'Mayurbhanj',
    });

  const mayurbhanjIds =
    ids(mayurbhanj);

  assert(
    mayurbhanjIds.includes('api-open'),
    'Mayurbhanj job should pass the district filter.',
  );

  assert(
    !mayurbhanjIds.includes('api-bihar'),
    'Patna job must not pass the Mayurbhanj district filter.',
  );

  /*
   * -----------------------------------------------------
   * REVIEW SAFETY
   * -----------------------------------------------------
   */

  const publicActive =
    await callApi({
      surface:
        'active-applications',
    });

  assert(
    !ids(publicActive).includes(
      'api-review',
    ),
    'Review-required job must never leak through public API.',
  );

  console.log('\n========================================');
  console.log(' JOBS API LIFECYCLE TESTS PASSED');
  console.log('========================================\n');
} finally {
  /*
   * Remove only our test records.
   */
  for (const id of testIds) {
    await sarjomRepository.deleteJob(id);
  }
}