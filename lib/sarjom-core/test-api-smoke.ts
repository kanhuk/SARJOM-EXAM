import jobsHandler from '../../api/jobs.js';
import searchHandler from '../../api/search.js';
import contentHandler from '../../api/content.js';
import trendsHandler from '../../api/trends.js';
import geographyHandler from '../../api/geography.js';
import healthHandler from '../../api/admin/health.js';

type MockRequest = {
  method: string;
  query?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
};

type MockResponse = {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
  status: (code: number) => MockResponse;
  setHeader: (name: string, value: string) => void;
  json: (value: unknown) => MockResponse;
  end: () => MockResponse;
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

    end() {
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

async function testEndpoint(
  name: string,
  handler: any,
  req: MockRequest,
): Promise<MockResponse> {
  console.log(`\n[TEST] ${name}`);

  const res = createResponse();

  await handler(
    req,
    res,
  );

  console.log(
    `STATUS: ${res.statusCode}`,
  );

  assert(
    res.statusCode >= 200 &&
      res.statusCode < 500,
    `${name} returned unexpected HTTP status ${res.statusCode}.`,
  );

  return res;
}

console.log(
  '\n========================================',
);

console.log(
  ' SARJOM API SMOKE TEST',
);

console.log(
  '========================================',
);

try {

  /*
   * -----------------------------------------------------
   * /api/jobs
   * -----------------------------------------------------
   */

  const jobs =
    await testEndpoint(
      '/api/jobs',
      jobsHandler,
      {
        method:
          'GET',

        query: {},
      },
    );

  assert(
    jobs.body?.success === true,
    '/api/jobs must return success=true.',
  );

  assert(
    Array.isArray(
      jobs.body?.jobs,
    ),
    '/api/jobs must return jobs array.',
  );

  assert(
    jobs.body?.dashboard !== undefined,
    '/api/jobs must return dashboard data.',
  );

  /*
   * -----------------------------------------------------
   * /api/search
   * -----------------------------------------------------
   */

  const search =
    await testEndpoint(
      '/api/search',
      searchHandler,
      {
        method:
          'GET',

        query: {
          q:
            'government',
        },
      },
    );

  assert(
    search.body !== undefined,
    '/api/search must return a response body.',
  );

  /*
   * -----------------------------------------------------
   * /api/content
   * -----------------------------------------------------
   */

  const content =
    await testEndpoint(
      '/api/content',
      contentHandler,
      {
        method:
          'GET',

        query: {},
      },
    );

  assert(
    content.body !== undefined,
    '/api/content must return a response body.',
  );

  /*
   * -----------------------------------------------------
   * /api/trends
   * -----------------------------------------------------
   */

  const trends =
    await testEndpoint(
      '/api/trends',
      trendsHandler,
      {
        method:
          'GET',

        query: {},
      },
    );

  assert(
    trends.body !== undefined,
    '/api/trends must return a response body.',
  );

  /*
   * -----------------------------------------------------
   * /api/geography
   * -----------------------------------------------------
   */

  const geography =
    await testEndpoint(
      '/api/geography',
      geographyHandler,
      {
        method:
          'GET',

        query: {},
      },
    );

  assert(
    geography.body !== undefined,
    '/api/geography must return a response body.',
  );

  /*
   * -----------------------------------------------------
   * /api/admin/health
   *
   * Health endpoint is intentionally tested
   * without assuming authentication behavior.
   * -----------------------------------------------------
   */

  const health =
    await testEndpoint(
      '/api/admin/health',
      healthHandler,
      {
        method:
          'GET',

        headers: {},
      },
    );

  assert(
    health.body !== undefined,
    '/api/admin/health must return a response body.',
  );

  /*
   * -----------------------------------------------------
   * CORS
   * -----------------------------------------------------
   */

  assert(
    jobs.headers[
      'Access-Control-Allow-Origin'
    ] === '*',
    '/api/jobs should expose CORS header.',
  );

  /*
   * -----------------------------------------------------
   * METHOD PROTECTION
   * -----------------------------------------------------
   */

  const invalidJobs =
    await testEndpoint(
      '/api/jobs invalid method',
      jobsHandler,
      {
        method:
          'POST',

        query: {},
      },
    );

  assert(
    invalidJobs.statusCode ===
      405,
    '/api/jobs must reject unsupported methods with 405.',
  );

  /*
   * -----------------------------------------------------
   * OPTIONS / CORS PREFLIGHT
   * -----------------------------------------------------
   */

  const optionsJobs =
    await testEndpoint(
      '/api/jobs OPTIONS',
      jobsHandler,
      {
        method:
          'OPTIONS',
      },
    );

  assert(
    optionsJobs.statusCode ===
      204,
    '/api/jobs OPTIONS must return 204.',
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
    ' SARJOM API SMOKE TEST PASSED',
  );

  console.log(
    '========================================\n',
  );

} catch (error) {

  console.error(
    '\n========================================',
  );

  console.error(
    ' SARJOM API SMOKE TEST FAILED',
  );

  console.error(
    '========================================\n',
  );

  console.error(
    error,
  );

  process.exitCode = 1;
}