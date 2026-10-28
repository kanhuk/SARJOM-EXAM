import handler from '../../api/cron/sarjom-auto-update.js';

type MockResponse = {
  statusCode: number;
  body: unknown;
  status: (code: number) => MockResponse;
  json: (value: unknown) => MockResponse;
};

function createResponse(): MockResponse {
  const response: MockResponse = {
    statusCode: 200,
    body: null,

    status(code: number) {
      response.statusCode = code;
      return response;
    },

    json(value: unknown) {
      response.body = value;
      return response;
    },
  };

  return response;
}

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

console.log(
  '\n========================================',
);

console.log(
  ' SARJOM CRON INTEGRATION TEST',
);

console.log(
  '========================================\n',
);

/*
 * -----------------------------------------------------
 * TEST 1 — METHOD VALIDATION
 * -----------------------------------------------------
 *
 * The cron endpoint accepts GET and POST only.
 */

const methodReq = {
  method: 'PUT',
  headers: {},
};

const methodRes =
  createResponse();

await handler(
  methodReq,
  methodRes,
);

console.log(
  'METHOD VALIDATION',
  JSON.stringify(
    {
      statusCode:
        methodRes.statusCode,
      body:
        methodRes.body,
    },
    null,
    2,
  ),
);

assert(
  methodRes.statusCode === 405,
  'Cron endpoint must reject unsupported HTTP methods.',
);

/*
 * -----------------------------------------------------
 * TEST 2 — CRON SECRET
 * -----------------------------------------------------
 *
 * Only test authentication if CRON_SECRET
 * exists in the environment.
 */

const cronSecret =
  process.env.CRON_SECRET;

if (cronSecret) {

  const unauthorizedReq = {
    method: 'GET',
    headers: {
      authorization:
        'Bearer WRONG_SECRET',
    },
  };

  const unauthorizedRes =
    createResponse();

  await handler(
    unauthorizedReq,
    unauthorizedRes,
  );

  console.log(
    '\nUNAUTHORIZED REQUEST',
    JSON.stringify(
      {
        statusCode:
          unauthorizedRes.statusCode,
        body:
          unauthorizedRes.body,
      },
      null,
      2,
    ),
  );

  assert(
    unauthorizedRes.statusCode === 401,
    'Cron endpoint must reject an invalid CRON_SECRET.',
  );

} else {

  console.log(
    '\nCRON_SECRET not configured locally.',
  );

  console.log(
    'Authentication test skipped.',
  );
}

/*
 * -----------------------------------------------------
 * TEST 3 — CONFIGURATION CHECK
 * -----------------------------------------------------
 */

console.log(
  '\nCRON CONFIGURATION',
);

console.log(
  JSON.stringify(
    {
      cronSecretConfigured:
        Boolean(
          process.env.CRON_SECRET,
        ),

      redisConfigured:
        Boolean(
          process.env.UPSTASH_REDIS_REST_URL &&
          process.env.UPSTASH_REDIS_REST_TOKEN,
        ),

      monitorSourceLimit:
        process.env.SARJOM_MONITOR_SOURCE_LIMIT ||
        'default',

      monitorCandidates:
        process.env.SARJOM_MONITOR_CANDIDATES ||
        'default',
    },
    null,
    2,
  ),
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
  ' CRON HANDLER INTEGRATION TEST PASSED',
);

console.log(
  '========================================\n',
);