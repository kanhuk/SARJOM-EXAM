import handler from '../../api/jobs.js';
import { sarjomRepository } from './repository.js';
import type { SarjomJob } from './types.js';

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

type MockResponse = {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
  status: (code: number) => MockResponse;
  setHeader: (name: string, value: string) => void;
  json: (value: unknown) => MockResponse;
};

function createResponse(): MockResponse {
  const response: MockResponse = {
    statusCode: 200,
    body: null,
    headers: {},

    status(code: number) {
      response.statusCode = code;
      return response;
    },

    setHeader(
      name: string,
      value: string,
    ) {
      response.headers[name] = value;
    },

    json(value: unknown) {
      response.body = value;
      return response;
    },
  };

  return response;
}

function makeJob(
  overrides: Partial<SarjomJob>,
): SarjomJob {
  return {
    id:
      'dashboard-test-job',

    title:
      'SARJOM Dashboard Test Recruitment',

    organization:
      'SARJOM Test Organization',

    source:
      'dashboard-test',

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
      100,

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
  ' SARJOM JOBS API DASHBOARD TEST',
);

console.log(
  '========================================\n',
);

const testIds = [
  'dashboard-open',
  'dashboard-closing',
  'dashboard-pending-admit',
  'dashboard-admit-card',
  'dashboard-exam',
  'dashboard-upcoming',
  'dashboard-result',
  'dashboard-answer-key',
  'dashboard-review',
];

try {

  /*
   * -----------------------------------------------------
   * OPEN APPLICATION
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-open',

      title:
        'Dashboard Open Recruitment',

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
        'dashboard-closing',

      title:
        'Dashboard Closing Soon Recruitment',

      applicationDeadline:
        new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),

      lifecycle:
        'closing-soon',

      primarySurface:
        'closing-soon',

      notificationSurfaces: [
        'active-applications',
        'closing-soon',
      ],

      applicationOpen:
        true,

      closingSoon:
        true,

      applicationEnded:
        false,
    }),
  );

  /*
   * -----------------------------------------------------
   * CLOSED + ADMIT CARD PENDING
   *
   * MUST NOT appear in Admit Card.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-pending-admit',

      title:
        'Dashboard Pending Admit Card',

      applicationDeadline:
        '2026-07-31',

      lifecycle:
        'admit-card-pending',

      primarySurface:
        'archive',

      notificationSurfaces: [],

      applicationOpen:
        false,

      applicationEnded:
        true,

      admitCardAvailable:
        false,

      admitCardPending:
        true,
    }),
  );

  /*
   * -----------------------------------------------------
   * ADMIT CARD RELEASED
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-admit-card',

      title:
        'Dashboard Admit Card Released',

      applicationDeadline:
        '2026-07-31',

      lifecycle:
        'admit-card-released',

      primarySurface:
        'admit-card',

      notificationSurfaces: [
        'admit-card',
      ],

      applicationOpen:
        false,

      applicationEnded:
        true,

      admitCardAvailable:
        true,

      admitCardPending:
        false,

      admitCardUrl:
        'https://example.gov.in/admit-card',
    }),
  );

  /*
   * -----------------------------------------------------
   * EXAM SCHEDULED
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-exam',

      title:
        'Dashboard Exam Scheduled',

      applicationDeadline:
        '2026-07-31',

      examDate:
        '2026-09-20',

      lifecycle:
        'exam-scheduled',

      primarySurface:
        'exam-date',

      notificationSurfaces: [
        'exam-date',
      ],

      applicationOpen:
        false,

      applicationEnded:
        true,

      examDateKnown:
        true,
    }),
  );

  /*
   * -----------------------------------------------------
   * UPCOMING
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-upcoming',

      title:
        'Dashboard Upcoming Recruitment',

      applicationStartDate:
        '2026-10-01',

      applicationDeadline:
        '2026-10-31',

      lifecycle:
        'upcoming',

      primarySurface:
        'upcoming-jobs',

      notificationSurfaces: [
        'upcoming-jobs',
      ],

      applicationOpen:
        false,

      applicationEnded:
        false,

      isExpected:
        false,
    }),
  );

  /*
   * -----------------------------------------------------
   * RESULT
   *
   * Result is represented by the lifecycle
   * and resultUrl. It does NOT need a
   * "result" RecruitmentSurface.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-result',

      title:
        'Dashboard Result Released',

      applicationDeadline:
        '2026-07-31',

      lifecycle:
        'result-released',

      primarySurface:
        'archive',

      notificationSurfaces: [],

      applicationOpen:
        false,

      applicationEnded:
        true,

      resultUrl:
        'https://example.gov.in/result',
    }),
  );

  /*
   * -----------------------------------------------------
   * ANSWER KEY
   *
   * Answer key is represented by lifecycle
   * and answerKeyUrl. It does NOT need an
   * "answer-key" RecruitmentSurface.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-answer-key',

      title:
        'Dashboard Answer Key Released',

      applicationDeadline:
        '2026-07-31',

      lifecycle:
        'answer-key-released',

      primarySurface:
        'archive',

      notificationSurfaces: [],

      applicationOpen:
        false,

      applicationEnded:
        true,

      answerKeyUrl:
        'https://example.gov.in/answer-key',
    }),
  );

  /*
   * -----------------------------------------------------
   * REVIEW REQUIRED
   *
   * MUST NEVER BE PUBLIC.
   * -----------------------------------------------------
   */

  await sarjomRepository.saveJob(
    makeJob({
      id:
        'dashboard-review',

      title:
        'Dashboard Review Required',

      lifecycle:
        'unknown',

      primarySurface:
        'review',

      notificationSurfaces: [],

      publicationStatus:
        'hold-for-review',

      reviewRequired:
        true,

      applicationOpen:
        false,

      applicationEnded:
        false,
    }),
  );

  /*
   * -----------------------------------------------------
   * CALL /api/jobs
   * -----------------------------------------------------
   */

  const req = {
    method:
      'GET',

    query: {},
  };

  const res =
    createResponse();

  await handler(
    req,
    res,
  );

  console.log(
    `API STATUS: ${res.statusCode}`,
  );

  assert(
    res.statusCode ===
      200,
    'Jobs API should return HTTP 200.',
  );

  assert(
    res.body?.success ===
      true,
    'Jobs API should return success=true.',
  );

  /*
   * -----------------------------------------------------
   * VERIFY JOB LIST
   * -----------------------------------------------------
   */

  const jobs =
    res.body.jobs as SarjomJob[];

  assert(
    Array.isArray(jobs),
    'Jobs API must return a jobs array.',
  );

  const findJob =
    (id: string) =>
      jobs.find(
        job =>
          job.id ===
          id,
      );

  /*
   * -----------------------------------------------------
   * OPEN
   * -----------------------------------------------------
   */

  assert(
    Boolean(
      findJob(
        'dashboard-open',
      ),
    ),
    'Open recruitment should be public.',
  );

  /*
   * -----------------------------------------------------
   * CLOSING SOON
   * -----------------------------------------------------
   */

  assert(
    Boolean(
      findJob(
        'dashboard-closing',
      ),
    ),
    'Closing-soon recruitment should be public.',
  );

  /*
   * -----------------------------------------------------
   * PENDING ADMIT CARD
   * -----------------------------------------------------
   */

  const pendingAdmit =
    findJob(
      'dashboard-pending-admit',
    );

  assert(
    Boolean(pendingAdmit),
    'Pending-admit recruitment should remain stored.',
  );

  assert(
    pendingAdmit?.lifecycle ===
      'admit-card-pending',
    'Pending-admit job must retain admit-card-pending lifecycle.',
  );

  assert(
    pendingAdmit?.primarySurface ===
      'archive',
    'Pending-admit job must remain archived.',
  );

  assert(
    pendingAdmit?.admitCardAvailable ===
      false,
    'Pending-admit job must not be marked available.',
  );

  /*
   * -----------------------------------------------------
   * ADMIT CARD
   * -----------------------------------------------------
   */

  const admitCard =
    findJob(
      'dashboard-admit-card',
    );

  assert(
    Boolean(admitCard),
    'Released admit card should be public.',
  );

  assert(
    admitCard?.lifecycle ===
      'admit-card-released',
    'Released admit card must have correct lifecycle.',
  );

  assert(
    admitCard?.primarySurface ===
      'admit-card',
    'Released admit card must route to Admit Card.',
  );

  /*
   * -----------------------------------------------------
   * EXAM
   * -----------------------------------------------------
   */

  const exam =
    findJob(
      'dashboard-exam',
    );

  assert(
    Boolean(exam),
    'Scheduled exam should be available.',
  );

  assert(
    exam?.lifecycle ===
      'exam-scheduled',
    'Scheduled exam must have exam-scheduled lifecycle.',
  );

  /*
   * -----------------------------------------------------
   * UPCOMING
   * -----------------------------------------------------
   */

  const upcoming =
    findJob(
      'dashboard-upcoming',
    );

  assert(
    Boolean(upcoming),
    'Upcoming recruitment should be available.',
  );

  assert(
    upcoming?.lifecycle ===
      'upcoming',
    'Upcoming recruitment must have upcoming lifecycle.',
  );

  /*
   * -----------------------------------------------------
   * RESULT
   * -----------------------------------------------------
   */

  const resultJob =
    findJob(
      'dashboard-result',
    );

  assert(
    Boolean(resultJob),
    'Result recruitment should be available.',
  );

  assert(
    resultJob?.lifecycle ===
      'result-released',
    'Result recruitment must have result-released lifecycle.',
  );

  assert(
    Boolean(
      resultJob?.resultUrl,
    ),
    'Result URL should be preserved.',
  );

  /*
   * -----------------------------------------------------
   * ANSWER KEY
   * -----------------------------------------------------
   */

  const answerKey =
    findJob(
      'dashboard-answer-key',
    );

  assert(
    Boolean(answerKey),
    'Answer-key recruitment should be available.',
  );

  assert(
    answerKey?.lifecycle ===
      'answer-key-released',
    'Answer-key recruitment must have answer-key-released lifecycle.',
  );

  assert(
    Boolean(
      answerKey?.answerKeyUrl,
    ),
    'Answer-key URL should be preserved.',
  );

  /*
   * -----------------------------------------------------
   * REVIEW
   * -----------------------------------------------------
   */

  const review =
    findJob(
      'dashboard-review',
    );

  assert(
    !review,
    'Review-required recruitment must never be public.',
  );

  /*
   * -----------------------------------------------------
   * DASHBOARD STRUCTURE
   * -----------------------------------------------------
   */

  const dashboard =
    res.body.dashboard;

  assert(
    dashboard &&
      Array.isArray(
        dashboard.latestNotifications,
      ),
    'Dashboard latestNotifications must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.openApplications,
      ),
    'Dashboard openApplications must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.closingSoon,
      ),
    'Dashboard closingSoon must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.upcomingJobs,
      ),
    'Dashboard upcomingJobs must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.admitCards,
      ),
    'Dashboard admitCards must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.upcomingExams,
      ),
    'Dashboard upcomingExams must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.results,
      ),
    'Dashboard results must be an array.',
  );

  assert(
    dashboard &&
      Array.isArray(
        dashboard.answerKeys,
      ),
    'Dashboard answerKeys must be an array.',
  );

  /*
   * -----------------------------------------------------
   * VERIFY DASHBOARD ROUTING
   * -----------------------------------------------------
   */

  assert(
    dashboard.openApplications.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-open',
    ),
    'Open recruitment must appear in openApplications.',
  );

  assert(
    dashboard.closingSoon.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-closing',
    ),
    'Closing recruitment must appear in closingSoon.',
  );

  assert(
    dashboard.admitCards.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-admit-card',
    ),
    'Released admit card must appear in admitCards.',
  );

  assert(
    !dashboard.admitCards.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-pending-admit',
    ),
    'Pending admit card MUST NOT appear in admitCards.',
  );

  assert(
    dashboard.upcomingJobs.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-upcoming',
    ),
    'Upcoming recruitment must appear in upcomingJobs.',
  );

  assert(
    dashboard.upcomingExams.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-exam',
    ),
    'Scheduled exam must appear in upcomingExams.',
  );

  assert(
    dashboard.results.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-result',
    ),
    'Result must appear in results.',
  );

  assert(
    dashboard.answerKeys.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-answer-key',
    ),
    'Answer key must appear in answerKeys.',
  );

  assert(
    !dashboard.latestNotifications.some(
      (job: SarjomJob) =>
        job.id ===
        'dashboard-review',
    ),
    'Review-required recruitment must not appear in latest notifications.',
  );

  /*
   * -----------------------------------------------------
   * STATE FILTER
   * -----------------------------------------------------
   */

  const stateReq = {
    method:
      'GET',

    query: {
      state:
        'od',
    },
  };

  const stateRes =
    createResponse();

  await handler(
    stateReq,
    stateRes,
  );

  assert(
    stateRes.statusCode ===
      200,
    'State-filtered Jobs API should return HTTP 200.',
  );

  assert(
    stateRes.body.jobs.every(
      (job: SarjomJob) =>
        job.stateCode ===
        'OD',
    ),
    'State filter must return only Odisha jobs.',
  );

  /*
   * -----------------------------------------------------
   * DISTRICT FILTER
   * -----------------------------------------------------
   */

  const districtReq = {
    method:
      'GET',

    query: {
      district:
        'mayurbhanj',
    },
  };

  const districtRes =
    createResponse();

  await handler(
    districtReq,
    districtRes,
  );

  assert(
    districtRes.statusCode ===
      200,
    'District-filtered Jobs API should return HTTP 200.',
  );

  assert(
    districtRes.body.jobs.every(
      (job: SarjomJob) =>
        (
          job.districts ||
          []
        ).some(
          district =>
            district.toLowerCase() ===
            'mayurbhanj',
        ),
    ),
    'District filter must return only Mayurbhanj jobs.',
  );

  /*
   * -----------------------------------------------------
   * FINAL RESULT
   * -----------------------------------------------------
   */

  console.log(
    '\n========================================',
  );

  console.log(
    ' JOBS API DASHBOARD TESTS PASSED',
  );

  console.log(
    '========================================\n',
  );

} finally {

  /*
   * -----------------------------------------------------
   * CLEAN UP ONLY TEST JOBS
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