import {
  rebuildIndexesWithRequest,
} from '../../lib/sarjom-core/admin/service.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    const result = await rebuildIndexesWithRequest(req);

    return res.status(200).json({
      success: true,
      operation: 'admin-rebuild-lifecycle-indexes',
      ...result,
      rebuiltAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Index rebuild failed.';

    const status =
      message === 'Unauthorized' ? 401 : 500;

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
}
