import {
  getCanonicalJob,
  queryCanonicalJobs,
} from '../../lib/sarjom-core/ai/canonical-query.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    const id =
      typeof req.query?.id === 'string'
        ? req.query.id.trim()
        : '';

    if (id) {
      const job = await getCanonicalJob(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Canonical job not found.',
        });
      }

      return res.status(200).json({
        success: true,
        source: 'sarjom-canonical',
        job,
      });
    }

    const lifecycle =
      typeof req.query?.lifecycle === 'string'
        ? req.query.lifecycle.trim() as any
        : undefined;

    const stateCode =
      typeof req.query?.state === 'string'
        ? req.query.state.trim()
        : undefined;

    const district =
      typeof req.query?.district === 'string'
        ? req.query.district.trim()
        : undefined;

    const query =
      typeof req.query?.q === 'string'
        ? req.query.q.trim()
        : undefined;

    const limit =
      typeof req.query?.limit === 'string'
        ? Number(req.query.limit)
        : undefined;

    const result = await queryCanonicalJobs({
      query,
      lifecycle,
      stateCode,
      district,
      limit,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Canonical query failed.',
    });
  }
}
