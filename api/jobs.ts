import {
  hasPersistentSarjomStore,
  sarjomRepository,
} from '../lib/sarjom-core/repository.js';

import {
  buildDashboardData,
} from '../lib/sarjom-core/dashboard.js';

type PublicSurface =
  | 'all'
  | 'active-applications'
  | 'closing-soon'
  | 'upcoming-jobs'
  | 'admit-card'
  | 'exam-date'
  | 'results'
  | 'answer-keys'
  | 'archive';

function getQueryString(
  req: any,
  key: string,
): string | undefined {
  const value = req.query?.[key];

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0
    ? trimmed
    : undefined;
}

function getSurface(
  req: any,
): PublicSurface {
  const raw =
    getQueryString(req, 'surface');

  if (!raw) {
    return 'all';
  }

  const normalized =
    raw.toLowerCase();

  const allowed: PublicSurface[] = [
  'all',
  'active-applications',
  'closing-soon',
  'upcoming-jobs',
  'admit-card',
  'exam-date',
  'results',
  'answer-keys',
  'archive',
];

  if (
    allowed.includes(
      normalized as PublicSurface,
    )
  ) {
    return normalized as PublicSurface;
  }

  return 'all';
}

/**
 * Public publication safety gate.
 *
 * A recruitment must never be exposed publicly when:
 *
 * 1. It is explicitly held for review.
 * 2. It is marked review-required.
 * 3. It has been superseded.
 * 4. It is explicitly in draft state.
 */
function isPublicJob(
  job: any,
): boolean {
  if (job.superseded === true) {
    return false;
  }

  if (
    job.publicationStatus ===
    'hold-for-review'
  ) {
    return false;
  }

  if (
    job.publicationStatus ===
    'draft'
  ) {
    return false;
  }

  if (
    job.reviewRequired === true
  ) {
    return false;
  }

  if (
    job.lifecycle ===
    'review-required'
  ) {
    return false;
  }

  return true;
}

function matchesSurface(
  job: any,
  surface: PublicSurface,
): boolean {
  if (surface === 'all') {
    return true;
  }

  /*
   * The persisted primarySurface is the
   * canonical routing decision.
   */
  if (
    job.primarySurface ===
    surface
  ) {
    return true;
  }   /*
   * Results
   *
   * A job may appear here only when
   * an official result exists or the
   * lifecycle engine has explicitly
   * routed it to the Results surface.
   */
  if (
    surface === 'results' &&
    (
      job.resultUrl ||
      job.lifecycle === 'result-released' ||
      job.primarySurface === 'results'
    )
  ) {
    return true;
  }

  /*
   * Answer Keys
   *
   * A job may appear here only when
   * an official answer key exists or
   * the lifecycle engine has explicitly
   * routed it to this surface.
   */
  if (
    surface === 'answer-keys' &&
    (
      job.answerKeyUrl ||
      job.lifecycle === 'answer-key-released' ||
      job.primarySurface === 'answer-keys'
    )
  ) {
    return true;
  }

  /*
   * Closing-soon jobs remain visible in
   * Active Applications as well as Closing Soon.
   */
  if (
    surface ===
      'active-applications' &&
    job.primarySurface ===
      'closing-soon'
  ) {
    return true;
  }

  return false;
}

export default async function handler(
  req: any,
  res: any,
) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*',
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS',
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
  );

  if (
    req.method === 'OPTIONS'
  ) {
    return res
      .status(204)
      .end();
  }

  if (
    req.method !== 'GET'
  ) {
    return res
      .status(405)
      .json({
        success: false,
        error: 'Method Not Allowed',
      });
  }

  try {
    /*
     * ============================================================
     * SINGLE JOB MODE
     * ============================================================
     *
     * Example:
     *
     * /api/jobs?id=engine-closing
     *
     * The same public safety gate is applied here.
     */
    const id =
      getQueryString(req, 'id');

    if (id) {
      const job =
        await sarjomRepository.getJob(id);

      if (!job) {
        return res
          .status(404)
          .json({
            success: false,
            error: 'Job not found.',
          });
      }

      /*
       * Never expose private/review/superseded
       * records through the public API.
       */
      if (!isPublicJob(job)) {
        return res
          .status(404)
          .json({
            success: false,
            error: 'Job not found.',
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          persistentStore:
            hasPersistentSarjomStore,

          job,
        });
    }

    /*
     * ============================================================
     * LIST / DASHBOARD MODE
     * ============================================================
     */

    const dashboard =
      await buildDashboardData();

    const surface =
      getSurface(req);

    const stateRaw =
      getQueryString(
        req,
        'state',
      );

    const districtRaw =
      getQueryString(
        req,
        'district',
      );

    const state =
      stateRaw?.toUpperCase();

    const district =
      districtRaw?.toLowerCase();

    const allJobs =
      await sarjomRepository.listJobs();

    const jobs =
      allJobs.filter(
        job => {
          /*
           * PUBLICATION SAFETY FIRST
           */
          if (
            !isPublicJob(job)
          ) {
            return false;
          }

          /*
           * State filter
           */
          if (
            state &&
            job.stateCode !== state
          ) {
            return false;
          }

          /*
           * District filter
           */
          if (
            district &&
            !(
              job.districts ||
              []
            ).some(
              item =>
                item.toLowerCase() ===
                district,
            )
          ) {
            return false;
          }

          /*
           * Lifecycle surface
           */
          if (
            !matchesSurface(
              job,
              surface,
            )
          ) {
            return false;
          }

          return true;
        },
      );

    return res
      .status(200)
      .json({
        success: true,

        persistentStore:
          hasPersistentSarjomStore,

        surface,

        filters: {
          state:
            state ?? null,

          district:
            district ?? null,
        },

        count:
          jobs.length,

        jobs,

        dashboard,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : 'Failed to load jobs.',
      });
  }
}