import refreshHandler from '../../api/admin/refresh-lifecycle.js';
import rebuildHandler from '../../api/admin/rebuild-indexes.js';
import reviewHandler from '../../api/admin/review.js';

process.env.SARJOM_ADMIN_SECRET = 'test-admin-secret';

function response() {
  const r: any = {
    statusCode: 200,
    body: null,
    status(code: number) {
      r.statusCode = code;
      return r;
    },
    json(body: unknown) {
      r.body = body;
      return r;
    },
  };
  return r;
}

async function testUnauthorized(name: string, handler: any, method: string) {
  const req = {
    method,
    headers: {},
    query: {},
    body: {},
  };

  const res = response();
  await handler(req, res);

  if (res.statusCode !== 401) {
    throw new Error(
      `${name}: expected 401, received ${res.statusCode} (${JSON.stringify(res.body)})`,
    );
  }

  console.log(`✓ ${name}`);
}

async function testWrongSecret(name: string, handler: any, method: string) {
  const req = {
    method,
    headers: {
      authorization: 'Bearer wrong-secret',
    },
    query: {},
    body: {},
  };

  const res = response();
  await handler(req, res);

  if (res.statusCode !== 401) {
    throw new Error(
      `${name}: expected 401, received ${res.statusCode} (${JSON.stringify(res.body)})`,
    );
  }

  console.log(`✓ ${name}`);
}

async function main() {
  await testUnauthorized(
    'Refresh rejects missing credential',
    refreshHandler,
    'POST',
  );

  await testUnauthorized(
    'Rebuild rejects missing credential',
    rebuildHandler,
    'POST',
  );

  await testUnauthorized(
    'Review rejects missing credential',
    reviewHandler,
    'GET',
  );

  await testWrongSecret(
    'Refresh rejects wrong credential',
    refreshHandler,
    'POST',
  );

  await testWrongSecret(
    'Rebuild rejects wrong credential',
    rebuildHandler,
    'POST',
  );

  await testWrongSecret(
    'Review rejects wrong credential',
    reviewHandler,
    'GET',
  );

  {
    const req = {
      method: 'GET',
      headers: {},
      query: {},
      body: {},
    };

    const res = response();
    await refreshHandler(req, res);

    if (res.statusCode !== 405) {
      throw new Error(`Refresh method guard failed: ${res.statusCode}`);
    }

    console.log('✓ Refresh method guard');
  }

  {
    const req = {
      method: 'GET',
      headers: {},
      query: {},
      body: {},
    };

    const res = response();
    await rebuildHandler(req, res);

    if (res.statusCode !== 405) {
      throw new Error(`Rebuild method guard failed: ${res.statusCode}`);
    }

    console.log('✓ Rebuild method guard');
  }

  console.log('');
  console.log('SARJOM ADMIN SECURITY TESTS PASSED');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
