import http from 'node:http';
import { URL } from 'node:url';

import jobsHandler from './api/jobs.js';
import searchHandler from './api/search.js';
import contentHandler from './api/content.js';
import trendsHandler from './api/trends.js';
import geographyHandler from './api/geography.js';
import adminAiCommandHandler from './api/admin/ai-command.js';
import askHandler from './api/ask.js';

type MockResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  ended: boolean;
};

function createResponse(
  res: http.ServerResponse,
): MockResponse & {
  status: (code: number) => any;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
} {
  const state: MockResponse = {
    statusCode: 200,
    headers: {},
    body: null,
    ended: false,
  };

  return {
    ...state,

    status(code: number) {
      state.statusCode = code;
      return this;
    },

    setHeader(name: string, value: string) {
      state.headers[name] = value;
      res.setHeader(name, value);
    },

    json(body: unknown) {
      state.body = body;

      if (!res.headersSent) {
        res.statusCode = state.statusCode;
        res.setHeader('Content-Type', 'application/json');
      }

      res.end(JSON.stringify(body));
      state.ended = true;
    },

    end() {
      if (!res.headersSent) {
        res.statusCode = state.statusCode;
      }

      res.end();
      state.ended = true;
    },
  };
}

async function readBody(
  req: http.IncomingMessage,
): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk),
    );
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function normalizeHeaders(
  headers: http.IncomingHttpHeaders,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
    } else if (typeof value === 'string') {
      result[key] = value;
    }
  }

  return result;
}

async function route(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const host = req.headers.host || 'localhost:4000';

  const requestUrl = new URL(
    req.url || '/',
    `http://${host}`,
  );

  const pathname = requestUrl.pathname;

  const query: Record<string, string> = {};

  for (const [key, value] of requestUrl.searchParams.entries()) {
    query[key] = value;
  }

  const body = await readBody(req);

  const request = {
    method: req.method || 'GET',
    headers: normalizeHeaders(req.headers),
    query,
    body,
  };

  const response = createResponse(res);

  let handler:
    | ((req: any, res: any) => Promise<any> | any)
    | undefined;

  switch (pathname) {
    case '/api/jobs':
      handler = jobsHandler;
      break;

    case '/api/search':
      handler = searchHandler;
      break;

    case '/api/content':
      handler = contentHandler;
      break;

    case '/api/trends':
      handler = trendsHandler;
      break;

    case '/api/geography':
      handler = geographyHandler;
      break;

    case '/api/admin/ai-command':
      handler = adminAiCommandHandler;
      break;

    case '/api/ask':
      handler = askHandler;
      break;

    default:
      res.statusCode = 404;
      res.setHeader(
        'Content-Type',
        'application/json',
      );

      res.end(
        JSON.stringify({
          success: false,
          error: 'SARJOM API route not found.',
          path: pathname,
        }),
      );

      return;
  }

  try {
    await handler(request, response);

    if (!response.ended && !res.writableEnded) {
      response.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.error(
      `[SARJOM API] ${pathname}`,
      error,
    );

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader(
        'Content-Type',
        'application/json',
      );
    }

    if (!res.writableEnded) {
      res.end(
        JSON.stringify({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Internal SARJOM API error.',
        }),
      );
    }
  }
}

const PORT = Number(
  process.env.SARJOM_API_PORT || 4000,
);

const server = http.createServer(
  (req, res) => {
    void route(req, res);
  },
);

server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log(' SARJOM LOCAL API SERVER');
  console.log('========================================');
  console.log('');
  console.log(
    `API: http://localhost:${PORT}`,
  );
  console.log('');
  console.log('Routes:');
  console.log('  /api/jobs');
  console.log('  /api/search');
  console.log('  /api/content');
  console.log('  /api/trends');
  console.log('  /api/geography');
  console.log('  /api/admin/ai-command');
  console.log('  /api/ask');
  console.log('');
});

