import {
  listReviewJobs,
  getAdminJob,
  setPublicationStatus,
} from '../../lib/sarjom-core/admin/service.js';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const id =
        typeof req.query?.id === 'string'
          ? req.query.id
          : undefined;

      if (id) {
        const job = await getAdminJob(req, id);

        if (!job) {
          return res.status(404).json({
            success: false,
            error: 'Job not found',
          });
        }

        return res.status(200).json({
          success: true,
          job,
        });
      }

      const jobs = await listReviewJobs(req);

      return res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
      });
    }

    if (req.method === 'POST') {
      const id =
        typeof req.body?.id === 'string'
          ? req.body.id
          : '';

      const status =
        req.body?.status === 'published' ||
        req.body?.status === 'hold-for-review'
          ? req.body.status
          : null;

      const reason =
        typeof req.body?.reason === 'string'
          ? req.body.reason.trim()
          : '';

      if (!id || !status || !reason) {
        return res.status(400).json({
          success: false,
          error:
            'id, status, and reason are required.',
        });
      }

      const job = await setPublicationStatus(
        req,
        id,
        status,
        reason,
      );

      return res.status(200).json({
        success: true,
        operation: 'publication-status-change',
        job,
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Admin review operation failed.';

    const status =
      message === 'Unauthorized' ? 401 :
      message === 'Job not found' ? 404 :
      500;

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
}
