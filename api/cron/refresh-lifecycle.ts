import { refreshAllStoredJobs } from '../../lib/sarjom-core/auto-engine.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const expectedSecret = process.env.SARJOM_CRON_SECRET;

  if (expectedSecret) {
    const authorization =
      req.headers?.authorization ??
      req.headers?.Authorization;

    const suppliedSecret =
      typeof authorization === 'string'
        ? authorization.replace(/^Bearer\s+/i, '')
        : undefined;

    if (suppliedSecret !== expectedSecret) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }
  }

  try {
    const result = await refreshAllStoredJobs();

    return res.status(200).json({
      success: true,
      operation: 'lifecycle-refresh',
      ...result,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      operation: 'lifecycle-refresh',
      error:
        error instanceof Error
          ? error.message
          : 'Lifecycle refresh failed.',
    });
  }
}
