import { assertAdminToken } from '../../lib/sarjom-core/admin.js';
import { getCanonicalJob } from '../../lib/sarjom-core/ai/canonical-query.js';
import {
  createAdminAiPlan,
  executeAdminAiPlan,
  type AdminAiPlan,
} from '../../lib/sarjom-core/admin-ai.js';

function token(req: any): string | undefined {
  const header = req.headers?.authorization;

  if (
    typeof header === 'string' &&
    header.startsWith('Bearer ')
  ) {
    return header.slice(7);
  }

  return typeof req.headers?.['x-sarjom-admin-token'] === 'string'
    ? req.headers['x-sarjom-admin-token']
    : undefined;
}

export default async function handler(
  req: any,
  res: any,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    assertAdminToken(token(req));

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body || {});

    if (
      typeof body.command !== 'string' ||
      !body.command.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'command is required.',
      });
    }

    /*
     * PLAN CREATION
     *
     * First request creates the AI plan and signs it.
     */
    if (body.confirm !== true) {
      const signedPlan =
        await createAdminAiPlan(
          body.command.trim(),
        );

      if (signedPlan.plan.action === "inspect-job") {
        const inspection = signedPlan.plan.jobId
          ? await getCanonicalJob(signedPlan.plan.jobId)
          : null;
        return res.status(200).json({
          success: true,
          plan: signedPlan.plan,
          planSignature: signedPlan.planSignature,
          executed: false,
          result: inspection,
          message: inspection
            ? "Read-only inspection completed. No SARJOM data was changed."
            : "No publicly eligible canonical record was found. No SARJOM data was changed.",
        });
      }

      return res.status(200).json({
        success: true,
        plan: signedPlan.plan,
        planSignature:
          signedPlan.planSignature,
        executed: false,
        message:
          'Review this exact plan and send confirm=true with the same plan and signature to execute.',
      });
    }

    /*
     * EXECUTION
     *
     * Never regenerate the AI plan here.
     *
     * The server executes ONLY the exact plan
     * that was previously returned and signed.
     */
    if (
      !body.plan ||
      typeof body.plan !== 'object'
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Execution requires the reviewed Admin AI plan.',
      });
    }

    if (
      typeof body.planSignature !== 'string' ||
      !body.planSignature
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Execution requires the Admin AI plan signature.',
      });
    }

    const plan =
      body.plan as AdminAiPlan;

    const result =
      await executeAdminAiPlan(
        plan,
        body.planSignature,
        `Admin AI confirmed: ${body.command.trim()}`,
        body.command.trim(),
      );

    return res.status(200).json({
      success: true,
      plan,
      planSignature:
        body.planSignature,
      executed: true,
      result,
      message:
        'Approved SARJOM Admin AI change executed successfully.',
    });
  } catch (error) {
    const status =
      error instanceof Error &&
      error.message.startsWith('Unauthorized')
        ? 401
        : 500;

    return res.status(status).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'SARJOM Admin AI failed.',
    });
  }
}
