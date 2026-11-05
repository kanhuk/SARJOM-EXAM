import crypto from 'node:crypto';
import type { DiscoveredJob } from '../job-discovery/types.js';
import { extractOfficialNotifications } from '../job-discovery/official-notification-extractor.js';
import { selectBestOfficialDocument } from '../job-discovery/official-notification-matcher.js';
import { analyzePdfWithGemini } from '../job-discovery/official-pdf-gemini.js';
import { evaluateNotificationFreshness } from '../job-discovery/notification-freshness.js';
import {
  reconcileRecruitmentEvidence,
  type RecruitmentEvidence,
} from '../job-discovery/reconciliation.js';
import { reconcileVersionAware } from '../job-discovery/version-aware-reconciliation.js';
import { sarjomRepository } from './repository.js';
import {
  classifyRecruitmentLifecycle,
  type RecruitmentLifecycleResult,
} from '../job-discovery/recruitment-lifecycle.js';
import type {
  OfficialDocumentRef,
  SarjomJob,
  SarjomReconciliationSnapshot,
} from './types.js';

function slugId(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex')
    .slice(0, 20);
}

function safeDate(value?: string | null): string | undefined {
  if (!value) return undefined;

  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : undefined;
}

export function modificationType(
  type: string,
  title: string,
  url: string,
): RecruitmentEvidence['modificationType'] {
  const text =
    `${type} ${title} ${url}`.toLowerCase();

  /*
   * =========================================================
   * OFFICIAL CANCELLATION
   * =========================================================
   *
   * Cancellation must be checked before generic
   * modification/revision detection.
   */
  if (
    /\bcancel(?:led|ed|lation)?\b/.test(text) ||
    /\bcancellation\b/.test(text) ||
    /\bwithdraw(?:n|al)?\b/.test(text)
  ) {
    return 'cancellation';
  }

  /*
   * =========================================================
   * OFFICIAL POSTPONEMENT
   * =========================================================
   */
  if (
    /\bpostpon(?:e|ed|ement)\b/.test(text) ||
    /\bdefer(?:red|ment)?\b/.test(text) ||
    /\brescheduled\b/.test(text)
  ) {
    return 'postponement';
  }

  /*
   * =========================================================
   * CORRIGENDUM / CORRECTION
   * =========================================================
   */
  if (
    /\bcorrigendum\b|\bcorrection\b/.test(text)
  ) {
    return 'corrigendum';
  }

  /*
   * =========================================================
   * EXTENSION
   * =========================================================
   */
  if (
    /\bextension\b|\bextended\b/.test(text)
  ) {
    return 'extension';
  }

  /*
   * =========================================================
   * REVISED / MODIFIED
   * =========================================================
   */
  if (
    /\brevised\b|\brevision\b|\bmodified\b/.test(text)
  ) {
    return 'revised';
  }

  if (/\breopen\b/.test(text)) {
    return 'revised';
  }

  return 'original';
}

function sourceEvidence(
  job: DiscoveredJob,
): RecruitmentEvidence {
  return {
    sourceType: 'source-article',
    sourceUrl: job.sourceUrl,
    title: job.title,
    organization: job.organization,
    postName: job.title,
    vacancies: job.vacancies ?? null,
    applicationStartDate:
      job.applicationStartDate ?? null,
    applicationLastDate:
      job.applicationDeadline ?? null,
    examDate: job.examDate ?? null,
    confidence: job.relevanceScore,
  };
}

function officialEvidence(
  job: DiscoveredJob,
  document: OfficialDocumentRef,
  analysis: Awaited<
    ReturnType<typeof analyzePdfWithGemini>
  >,
): RecruitmentEvidence {
  return {
    sourceType:
      'official-pdf',

    sourceUrl: document.url,

    sourceLabel: document.title,

    title:
      analysis.title ||
      document.title,

    organization:
      analysis.organization ||
      job.organization,

    advertisementNumber: null,

    postName:
      analysis.postName ||
      job.title,

    vacancies:
      analysis.vacancies ?? null,

    applicationStartDate:
      analysis.applicationStartDate ??
      null,

    applicationLastDate:
      analysis.applicationLastDate ??
      null,

    examDate:
      analysis.examDate ??
      null,

    confidence:
      analysis.confidence,

    documentDate:
      safeDate(job.publishedAt),

    modificationType:
      modificationType(
        document.type,
        document.title,
        document.url,
      ),
  };
}

function snapshot(
  result:
    | ReturnType<
        typeof reconcileRecruitmentEvidence
      >
    | ReturnType<
        typeof reconcileVersionAware
      >,
): SarjomReconciliationSnapshot {
  return {
    publicationStatus:
      result.publicationStatus,

    severity:
      result.severity,

    safeToPublish:
      result.safeToPublish,

    summary:
      result.summary,

    warnings:
      result.warnings,

    conflicts:
      result.conflicts.map(c => ({
        field: c.field,
        severity: c.severity,
        values: c.values,
        officialPreferredValue:
          c.officialPreferredValue,
        reason: c.reason,
      })),

    versionDecision:
      'versionDecision' in result
        ? result.versionDecision
        : 'no-version-change',

    changedFields:
      'changedFields' in result
        ? result.changedFields
        : [],

    versionReasons:
      'versionReasons' in result
        ? result.versionReasons
        : [],
  };
}

function relatedStoredEvidence(
  job: DiscoveredJob,
  currentOfficialUrl: string,
): RecruitmentEvidence[] {
  // Small, bounded relation search.
  // It avoids a new database index at this stage.
  return [];
}

export interface PipelineResult {
  success: boolean;
  job: SarjomJob;
  selectedDocument?: OfficialDocumentRef;
  warnings: string[];
}

export interface OfficialCandidateInput {
  job: DiscoveredJob;
  documentUrl: string;
  documentTitle?: string;
  officialWebsiteUrl?: string;
  officialDomain?: string;
  documentType?: string;
}

function mapRoutingLifecycle(
  result: RecruitmentLifecycleResult,
): SarjomJob['lifecycle'] {
  switch (result.lifecycle) {
    case 'open':
      return 'open';

    case 'closing-soon':
      return 'closing-soon';

    case 'upcoming':
      return 'upcoming';

    case 'closed-awaiting-admit-card':
      return 'admit-card-pending';

    case 'admit-card-released':
      return 'admit-card-released';

    case 'exam-scheduled':
      return 'exam-scheduled';

    case 'exam-completed':
      return 'exam-completed';

    /*
     * =========================================================
     * RESULT / ANSWER KEY
     * =========================================================
     *
     * These must be explicitly mapped here.
     *
     * Without these mappings the lifecycle classifier can
     * correctly return result-released or
     * answer-key-released, but auto-engine would convert them
     * to "unknown".
     */

    case 'result-released':
      return 'result-released';

    case 'answer-key-released':
      return 'answer-key-released';

    case 'closed':
      return 'closed';

    case 'review-required':
    case 'unknown':
    default:
      return 'unknown';
  }
}

function deriveLifecycleRouting(
  job: SarjomJob,
  today: Date = new Date(),
): RecruitmentLifecycleResult {
  return classifyRecruitmentLifecycle(
    {
      id: job.id,

      title: job.title,

      organization:
        job.organization,

      vacancies:
        job.vacancies,

      applicationStartDate:
        job.applicationStartDate,

      applicationDeadline:
        job.applicationDeadline,

      examDate:
        job.examDate,

      /*
       * IMPORTANT SARJOM RULE:
       *
       * Admit Card is NOT inferred merely because the
       * application has closed.
       *
       * It becomes available only when an actual
       * official admitCardUrl exists.
       */
      admitCardAvailable:
        Boolean(job.admitCardUrl),

      admitCardUrl:
        job.admitCardUrl,

      /*
       * Pending is persisted separately by the lifecycle
       * engine. It does NOT expose the recruitment on the
       * public Admit Card surface.
       */
      admitCardExpected:
        Boolean(job.admitCardPending),

      /*
       * Result becomes available only when an actual
       * result URL exists.
       */
      resultAvailable:
        Boolean(job.resultUrl),

      /*
       * Answer key becomes available only when an actual
       * answer-key URL exists.
       */
      answerKeyAvailable:
        Boolean(job.answerKeyUrl),

      reviewRequired:
        Boolean(job.reviewRequired),

      state:
        job.state,

      district:
        job.districts?.[0],
    },
    today,
  );
}
function applyLifecycleRouting(
  job: SarjomJob,
  today: Date = new Date(),
): SarjomJob {
  const routing =
    deriveLifecycleRouting(
      job,
      today,
    );

  /*
   * The recruitment-lifecycle classifier
   * is the authoritative lifecycle state
   * for normal recruitment progression.
   */
  const lifecycle =
    job.reviewRequired
      ? 'unknown'
      : mapRoutingLifecycle(
          routing,
        );

  /*
   * Official version-aware reconciliation
   * overrides the normal date-based lifecycle
   * when an official cancellation or
   * postponement has superseded the
   * previous recruitment version.
   */
  const versionDecision =
    job.reconciliation?.versionDecision;

  const finalLifecycle =
    versionDecision ===
      'official-cancellation'
      ? 'cancelled'
      : versionDecision ===
          'official-postponement'
        ? 'postponed'
        : lifecycle;

  /*
   * Cancellation is terminal for the current
   * recruitment/application cycle.
   *
   * Postponement does not automatically close
   * applications because an exam postponement
   * does not necessarily mean applications have
   * been cancelled or closed.
   */
  const isCancellation =
    versionDecision ===
    'official-cancellation';

  return {
    ...job,

    /*
     * Final lifecycle:
     *
     * official-cancellation → cancelled
     * official-postponement → postponed
     * otherwise → normal lifecycle
     */
    lifecycle:
      finalLifecycle,

    /*
     * Keep normal surface routing.
     */
    primarySurface:
      routing.primarySurface,

    notificationSurfaces:
      routing.notificationSurfaces,

    /*
     * Cancellation:
     *
     * applicationOpen → false
     * closingSoon → false
     * applicationEnded → true
     */
    applicationOpen:
      isCancellation
        ? false
        : routing.applicationOpen,

    closingSoon:
      isCancellation
        ? false
        : routing.closingSoon,

    applicationEnded:
      isCancellation
        ? true
        : routing.applicationEnded,

    /*
     * A cancelled recruitment cannot have
     * an active/pending admit card.
     */
    admitCardAvailable:
      isCancellation
        ? false
        : routing.admitCardAvailable,

    admitCardPending:
      isCancellation
        ? false
        : routing.admitCardPending,

    /*
     * Exam metadata remains available for
     * postponement because the new exam date
     * may still be known.
     */
    examDateKnown:
      routing.examDateKnown,

    examDatePassed:
      routing.examDatePassed,

    /*
     * A cancelled recruitment has no active
     * application deadline countdown or exam
     * countdown.
     */
    daysUntilDeadline:
      isCancellation
        ? null
        : routing.daysUntilDeadline,

    daysUntilExam:
      isCancellation
        ? null
        : routing.daysUntilExam,

    lifecycleUpdatedAt:
      today.toISOString(),
  };
}

function lifecycleRoutingChanged(
  previous: SarjomJob,
  next: SarjomJob,
): boolean {
  return (
    previous.lifecycle !==
      next.lifecycle ||

    previous.primarySurface !==
      next.primarySurface ||

    JSON.stringify(
      previous.notificationSurfaces ??
        [],
    ) !==
      JSON.stringify(
        next.notificationSurfaces ??
          [],
      ) ||

    previous.applicationOpen !==
      next.applicationOpen ||

    previous.closingSoon !==
      next.closingSoon ||

    previous.applicationEnded !==
      next.applicationEnded ||

    previous.admitCardAvailable !==
      next.admitCardAvailable ||

    previous.admitCardPending !==
      next.admitCardPending ||

    previous.examDateKnown !==
      next.examDateKnown ||

    previous.examDatePassed !==
      next.examDatePassed ||

    previous.daysUntilDeadline !==
      next.daysUntilDeadline ||

    previous.daysUntilExam !==
      next.daysUntilExam
  );
}

async function saveWithGate(
  merged: SarjomJob,
  rec:
    | ReturnType<
        typeof reconcileRecruitmentEvidence
      >
    | ReturnType<
        typeof reconcileVersionAware
      >,
  warnings: string[],
): Promise<PipelineResult> {
  const gate =
    snapshot(rec);

  const blocked =
    !gate.safeToPublish;

  const finalJob: SarjomJob = {
    ...merged,

    publicationStatus:
      blocked
        ? 'hold-for-review'
        : 'published',

    reviewRequired:
      blocked,

    publicationReason:
      gate.summary,

    reconciliation:
      gate,
  };

  const routed =
    blocked
      ? {
          ...finalJob,

          lifecycle:
            'unknown' as const,

          primarySurface:
            'review' as const,

          notificationSurfaces:
            [],

          applicationOpen:
            false,

          closingSoon:
            false,

          applicationEnded:
            false,

          admitCardAvailable:
            false,

          admitCardPending:
            false,

          examDateKnown:
            false,

          examDatePassed:
            false,

          daysUntilDeadline:
            null,

          daysUntilExam:
            null,

          lifecycleUpdatedAt:
            new Date().toISOString(),
        }
      : applyLifecycleRouting(
          finalJob,
        );

  const saved =
    await sarjomRepository.saveJob(
      routed,
    );

  return {
    success:
      !blocked &&
      saved.verified,

    job:
      saved,

    selectedDocument:
      finalJob
        .officialDocuments?.[0],

    warnings,
  };
}

async function analyzeAndReconcile(
  job: DiscoveredJob,
  input: OfficialCandidateInput,
  sourceEvidence?: RecruitmentEvidence,
): Promise<PipelineResult> {
  const warnings: string[] = [];

  const document:
    OfficialDocumentRef = {
    title:
      input.documentTitle ||
      'Official recruitment notification',

    url:
      input.documentUrl,

    type:
      input.documentType ||
      'notification',

    official:
      true,
  };

  let analysis;

  try {
    analysis =
      await analyzePdfWithGemini(
  document.url,
  `${job.title} — ${job.organization}`,
)
  } catch (error) {
    warnings.push(
      error instanceof Error
        ? error.message
        : 'Gemini PDF analysis failed.',
    );

    const failed:
      SarjomJob = {
      ...job,

      id:
        job.id ||
        slugId(
          `${job.organization}:${job.title}`,
        ),

      contentType:
        'job',

      lifecycle:
        'unknown',

      officialNotificationUrl:
        input.documentUrl,

      officialDocuments:
        [document],

      publicationStatus:
        'hold-for-review',

      reviewRequired:
        true,

      publicationReason:
        'Gemini analysis failed; publication is blocked.',

      lastVerifiedAt:
        new Date().toISOString(),
    };

    const saved =
      await sarjomRepository.saveJob(
        failed,
      );

    return {
      success: false,
      job: saved,
      selectedDocument: document,
      warnings,
    };
  }

  if (
    !analysis.isRecruitmentDocument ||
    !analysis.isLikelyNotification ||
    analysis.confidence < 75
  ) {
    warnings.push(
      'Official PDF did not meet the minimum recruitment confidence threshold.',
    );
  }


  const official =
    officialEvidence(
      job,
      document,
      analysis,
    );


  const evidence =
    sourceEvidence
      ? [
          sourceEvidence,
          official,
        ]
      : [official];

  /*
   * Use version-aware reconciliation only
   * when an explicit modification is detected.
   */
  const isModification =
  official.modificationType ===
    'corrigendum' ||
  official.modificationType ===
    'extension' ||
  official.modificationType ===
    'revised' ||
  official.modificationType ===
    'cancellation' ||
  official.modificationType ===
    'postponement';

  const rec =
    isModification
      ? reconcileVersionAware(
          evidence,
        )
      : reconcileRecruitmentEvidence(
          evidence,
        );

  const freshness =
    evaluateNotificationFreshness({
      applicationStartDate:
        analysis.applicationStartDate,

      applicationLastDate:
        analysis.applicationLastDate,

      examDate:
        analysis.examDate,
    });

  const merged:
    SarjomJob = {
    ...job,

    id:
      job.id ||
      slugId(
        `${job.organization}:${job.title}`,
      ),

    contentType:
      'job',

    title:
      analysis.title ||
      job.title,

    organization:
      analysis.organization ||
      job.organization,

    officialUrl:
      input.documentUrl,

    officialNotificationUrl:
      input.documentUrl,

    officialWebsiteUrl:
      input.officialWebsiteUrl,

    officialDomain:
      input.officialDomain,

    officialDocuments:
      [document],

    vacancies:
      analysis.vacancies ??
      job.vacancies,

    qualification:
      analysis.eligibility?.join('; ') ||
      job.qualification,

    applicationStartDate:
      analysis.applicationStartDate ??
      job.applicationStartDate,

    applicationDeadline:
      analysis.applicationLastDate ??
      job.applicationDeadline,

    examDate:
      analysis.examDate ??
      job.examDate,

    description:
      analysis.summary ||
      job.description,

    verificationScore:
      Math.max(
        job.verificationScore,
        analysis.confidence,
      ),

    verified:
      Boolean(
        analysis.isRecruitmentDocument &&
        analysis.isLikelyNotification &&
        analysis.confidence >= 85,
      ),

    status:
      freshness.status === 'open'
        ? 'open'
        : freshness.status ===
            'expired'
          ? 'expired'
          : freshness.status ===
              'upcoming'
            ? 'new'
            : 'new',

    lifecycle:
      'unknown',

    isExpected:
      false,

    lastVerifiedAt:
      new Date().toISOString(),
  };

  if (
    freshness.status ===
    'expired'
  ) {
    merged.publicationReason =
      'Application deadline has passed.';
  }

  return saveWithGate(
    merged,
    rec,
    warnings,
  );
}

export async function processDiscoveredJob(
  job: DiscoveredJob,
  sourceArticleUrl: string,
  organizationDomain?: string,
): Promise<PipelineResult> {
  const extraction =
    await extractOfficialNotifications(
      sourceArticleUrl,
      organizationDomain,
    );

  const match =
    selectBestOfficialDocument(
      job,
      extraction.documents,
    );

  if (
    !match ||
    !match.likelyNotification ||
    match.score < 55
  ) {
    const base:
      SarjomJob = {
      ...job,

      id:
        job.id ||
        slugId(
          `${job.organization}:${job.title}`,
        ),

      contentType:
        'job',

      lifecycle:
        'unknown',

      publicationStatus:
        'hold-for-review',

      reviewRequired:
        true,

      publicationReason:
        'No sufficiently strong official notification match was found.',

      lastVerifiedAt:
        new Date().toISOString(),
    };

    const saved =
      await sarjomRepository.saveJob(
        base,
      );

    return {
      success: false,
      job: saved,
      warnings: [
        base.publicationReason!,
      ],
    };
  }

  return analyzeAndReconcile(
    job,
    {
      job,

      documentUrl:
        match.document.url,

      documentTitle:
        match.document.title,

      officialDomain:
        organizationDomain,

      documentType:
        match.document.type,
    },

    sourceEvidence(job),
  );
}

export async function processOfficialCandidate(
  input: OfficialCandidateInput,
): Promise<PipelineResult> {
  return analyzeAndReconcile(
    input.job,
    input,
  );
}

export function refreshStoredJobLifecycle(
  job: SarjomJob,
  today: Date = new Date(),
): SarjomJob {
  return applyLifecycleRouting(
    job,
    today,
  );
}

export async function refreshAllStoredJobs(): Promise<{
  checked: number;
  updated: number;
  errors: string[];
}> {
  const jobs =
    await sarjomRepository.listJobs();

  let updated = 0;

  const errors: string[] = [];

  const today =
    new Date();

  for (const job of jobs) {
    try {
      if (
        job.publicationStatus ===
        'hold-for-review'
      ) {
        continue;
      }

      const refreshed =
        refreshStoredJobLifecycle(
          job,
          today,
        );

      if (
        lifecycleRoutingChanged(
          job,
          refreshed,
        )
      ) {
        await sarjomRepository.saveJob(
          refreshed,
        );

        updated++;
      }
    } catch (error) {
      errors.push(
        `${job.id}: ${
          error instanceof Error
            ? error.message
            : 'unknown error'
        }`,
      );
    }
  }

  return {
    checked:
      jobs.length,

    updated,

    errors,
  };
}







