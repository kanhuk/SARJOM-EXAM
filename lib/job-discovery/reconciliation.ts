/**
 * SARJOM Verification & Reconciliation Engine
 *
 * Purpose:
 * - Compare recruitment facts from multiple evidence sources.
 * - Detect factual conflicts instead of silently trusting one extraction.
 * - Use semantic normalization for organization/post-name wording differences.
 * - Keep numeric/date recruitment facts strict.
 * - Separate official evidence from source-article claims.
 * - Produce a safe publication decision.
 */

import {
  compareOrganization,
  comparePostName,
} from './semantic-normalization.js';

export type EvidenceSourceType =
  | 'official-pdf'
  | 'official-webpage'
  | 'corrigendum'
  | 'extension'
  | 'cancellation'
  | 'postponement'
  | 'source-article'
  | 'ai-extraction'
  | 'stored-record';

export type ReconciliationSeverity =
  | 'none'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface RecruitmentEvidence {
  sourceType: EvidenceSourceType;
  sourceUrl: string;
  sourceLabel?: string;

  title?: string | null;
  organization?: string | null;
  advertisementNumber?: string | null;
  postName?: string | null;

  vacancies?: number | null;
  applicationStartDate?: string | null;
  applicationLastDate?: string | null;
  examDate?: string | null;

  confidence?: number | null;

  documentDate?: string | null;
  modificationType?:
    | 'original'
    | 'corrigendum'
    | 'extension'
    | 'revised'
    | 'cancellation'
    | 'postponement'
    | 'unknown';
}

export interface FieldConflict {
  field:
    | 'organization'
    | 'advertisementNumber'
    | 'postName'
    | 'vacancies'
    | 'applicationStartDate'
    | 'applicationLastDate'
    | 'examDate';

  severity: ReconciliationSeverity;

  values: Array<{
    value: string | number | null;
    sourceType: EvidenceSourceType;
    sourceUrl: string;
  }>;

  officialPreferredValue?: string | number | null;

  reason: string;
}

export interface ReconciliationResult {
  publicationStatus:
    | 'publish'
    | 'publish-with-warning'
    | 'hold-for-review';

  severity: ReconciliationSeverity;

  canonical: RecruitmentEvidence | null;

  conflicts: FieldConflict[];

  warnings: string[];

  matchedSignals: string[];

  safeToPublish: boolean;

  summary: string;
}

/* -------------------------------------------------------
   BASIC NORMALIZATION
------------------------------------------------------- */

function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDate(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const raw = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const match = raw.match(
    /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/,
  );

  if (!match) return raw;

  const [, day, month, year] = match;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(
    2,
    '0',
  )}`;
}

/* -------------------------------------------------------
   UNIQUE VALUES
------------------------------------------------------- */

function uniqueNonEmpty(
  values: Array<string | number | null | undefined>,
): Array<string | number> {
  const seen = new Set<string>();

  const result: Array<string | number> = [];

  for (const value of values) {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      continue;
    }

    const key =
      typeof value === 'string'
        ? normalizeText(value)
        : String(value);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
  }

  return result;
}

/* -------------------------------------------------------
   FIELD SEVERITY
------------------------------------------------------- */

function severityForField(
  field: FieldConflict['field'],
  values: Array<string | number>,
): ReconciliationSeverity {
  if (values.length < 2) {
    return 'none';
  }

  /*
   * These fields are factual recruitment data.
   * We DO NOT use semantic normalization on them.
   */
  if (
    field === 'vacancies' ||
    field === 'applicationStartDate' ||
    field === 'applicationLastDate' ||
    field === 'advertisementNumber'
  ) {
    return 'critical';
  }

  /*
   * Organization and post names are now semantically normalized.
   * A remaining mismatch is still serious.
   */
  if (
    field === 'organization' ||
    field === 'postName'
  ) {
    return 'high';
  }

  if (field === 'examDate') {
    return 'high';
  }

  return 'medium';
}

/* -------------------------------------------------------
   FIELD VALUE EXTRACTION
------------------------------------------------------- */

function valuesForField(
  evidence: RecruitmentEvidence[],
  field: FieldConflict['field'],
): Array<{
  value: string | number | null;
  sourceType: EvidenceSourceType;
  sourceUrl: string;
}> {
  return evidence
    .map(item => ({
      value:
        field === 'organization'
          ? item.organization ?? null
          : field === 'advertisementNumber'
            ? item.advertisementNumber ?? null
            : field === 'postName'
              ? item.postName ?? null
              : field === 'vacancies'
                ? item.vacancies ?? null
                : field === 'applicationStartDate'
                  ? normalizeDate(
                      item.applicationStartDate,
                    )
                  : field === 'applicationLastDate'
                    ? normalizeDate(
                        item.applicationLastDate,
                      )
                    : field === 'examDate'
                      ? normalizeDate(item.examDate)
                      : null,

      sourceType: item.sourceType,

      sourceUrl: item.sourceUrl,
    }))
    .filter(
      item =>
        item.value !== null &&
        item.value !== '',
    );
}

/* -------------------------------------------------------
   FIELD EQUIVALENCE
------------------------------------------------------- */

function equivalent(
  field: FieldConflict['field'],
  a: string | number,
  b: string | number,
): boolean {
  /*
   * IMPORTANT:
   *
   * Organization and postName use semantic normalization.
   *
   * Example:
   *
   * Bihar Technical Service Commission
   *
   * and
   *
   * Bihar Technical Service Commission
   * (बिहार तकनीकी सेवा आयोग)
   *
   * are treated as the same identity.
   */
  if (field === 'organization') {
    const comparison =
      compareOrganization(
        String(a),
        String(b),
      );

    return (
      comparison.match === 'exact' ||
      comparison.match === 'strong'
    );
  }

  if (field === 'postName') {
    const comparison =
      comparePostName(
        String(a),
        String(b),
      );

    return (
      comparison.match === 'exact' ||
      comparison.match === 'strong'
    );
  }

  /*
   * Advertisement numbers remain exact normalized text.
   */
  if (field === 'advertisementNumber') {
    return (
      normalizeText(String(a)) ===
      normalizeText(String(b))
    );
  }

  /*
   * Dates remain strict facts.
   */
  if (
    field === 'applicationStartDate' ||
    field === 'applicationLastDate' ||
    field === 'examDate'
  ) {
    return (
      normalizeDate(String(a)) ===
      normalizeDate(String(b))
    );
  }

  /*
   * Vacancies and other numeric facts remain strict.
   *
   * 2653 MUST NOT equal 2809.
   */
  return String(a) === String(b);
}

/* -------------------------------------------------------
   OFFICIAL EVIDENCE
------------------------------------------------------- */

function isOfficialEvidence(
  sourceType: EvidenceSourceType,
): boolean {
  return (
    sourceType === 'official-pdf' ||
    sourceType === 'official-webpage' ||
    sourceType === 'corrigendum' ||
    sourceType === 'extension' ||
    sourceType === 'cancellation' ||
    sourceType === 'postponement'
  );
}

/* -------------------------------------------------------
   CANONICAL EVIDENCE
------------------------------------------------------- */

function selectCanonical(
  evidence: RecruitmentEvidence[],
): RecruitmentEvidence | null {
  if (!evidence.length) {
    return null;
  }

  const rank: Record<
    EvidenceSourceType,
    number
  > = {
    corrigendum: 6,
    extension: 6,
    cancellation: 7,
    postponement: 7,
    'official-pdf': 5,
    'official-webpage': 4,
    'stored-record': 3,
    'ai-extraction': 2,
    'source-article': 1,
  };

  return [...evidence].sort(
    (a, b) => {
      const rankDiff =
        rank[b.sourceType] -
        rank[a.sourceType];

      if (rankDiff !== 0) {
        return rankDiff;
      }

      return (
        (b.confidence ?? 0) -
        (a.confidence ?? 0)
      );
    },
  )[0];
}

/* -------------------------------------------------------
   MAIN RECONCILIATION
------------------------------------------------------- */

export function reconcileRecruitmentEvidence(
  evidence: RecruitmentEvidence[],
): ReconciliationResult {
  if (!evidence.length) {
    return {
      publicationStatus:
        'hold-for-review',

      severity: 'critical',

      canonical: null,

      conflicts: [],

      warnings: [
        'No evidence was supplied.',
      ],

      matchedSignals: [],

      safeToPublish: false,

      summary:
        'No recruitment evidence is available.',
    };
  }

  const canonical =
    selectCanonical(evidence);

  const conflicts: FieldConflict[] = [];

  const warnings: string[] = [];

  const matchedSignals: string[] = [];

  const fields:
    FieldConflict['field'][] = [
      'organization',
      'advertisementNumber',
      'postName',
      'vacancies',
      'applicationStartDate',
      'applicationLastDate',
      'examDate',
    ];

  for (const field of fields) {
    const values =
      valuesForField(
        evidence,
        field,
      );

    if (values.length < 2) {
      continue;
    }

    /*
     * Deduplicate according to the field-specific
     * equivalence rules.
     */
    const distinct =
      values.filter(
        (candidate, index) =>
          values.findIndex(
            other =>
              equivalent(
                field,
                candidate.value!,
                other.value!,
              ),
          ) === index,
      );

    if (distinct.length <= 1) {
      /*
       * Record semantic matching separately so the
       * admin/debug layer can explain why a wording
       * difference was not treated as a conflict.
       */
      if (field === 'organization') {
        matchedSignals.push(
          'organization:semantically-consistent',
        );
      } else if (field === 'postName') {
        matchedSignals.push(
          'postName:semantically-consistent',
        );
      } else {
        matchedSignals.push(
          `${field}:consistent`,
        );
      }

      continue;
    }

    const severity =
      severityForField(
        field,
        distinct.map(
          item => item.value!,
        ),
      );

    const preferred =
      canonical
        ? valuesForField(
            [canonical],
            field,
          )[0]?.value ?? null
        : null;

    conflicts.push({
      field,

      severity,

      values: distinct,

      officialPreferredValue:
        preferred,

      reason:
        field === 'vacancies'
          ? 'Vacancy counts differ between evidence sources.'
          : field === 'applicationStartDate'
            ? 'Application start dates differ between evidence sources.'
            : field === 'applicationLastDate'
              ? 'Application deadlines differ between evidence sources.'
              : field === 'examDate'
                ? 'Exam dates differ between evidence sources.'
                : field === 'advertisementNumber'
                  ? 'Advertisement numbers differ between evidence sources.'
                  : field === 'organization'
                    ? 'Organization identities remain different after semantic normalization.'
                    : field === 'postName'
                      ? 'Post names remain different after semantic normalization.'
                      : `${field} differs between evidence sources.`,
    });
  }

  const officialEvidence =
    evidence.filter(
      item =>
        isOfficialEvidence(
          item.sourceType,
        ),
    );

  if (!officialEvidence.length) {
    warnings.push(
      'No official government evidence is present.',
    );
  } else {
    matchedSignals.push(
      `official-evidence:${officialEvidence.length}`,
    );
  }

  if (
    canonical?.confidence !== null &&
    canonical?.confidence !== undefined
  ) {
    if (canonical.confidence >= 90) {
      matchedSignals.push(
        'canonical-confidence:high',
      );
    } else if (
      canonical.confidence < 70
    ) {
      warnings.push(
        'Canonical evidence has confidence below 70.',
      );
    }
  }

  const hasCritical =
    conflicts.some(
      conflict =>
        conflict.severity ===
        'critical',
    );

  const hasHigh =
    conflicts.some(
      conflict =>
        conflict.severity ===
        'high',
    );

  let publicationStatus:
    ReconciliationResult['publicationStatus'];

  let severity:
    ReconciliationSeverity;

  if (hasCritical) {
    publicationStatus =
      'hold-for-review';

    severity = 'critical';
  } else if (hasHigh) {
    publicationStatus =
      'hold-for-review';

    severity = 'high';
  } else if (
    conflicts.length ||
    warnings.length
  ) {
    publicationStatus =
      'publish-with-warning';

    severity = 'medium';
  } else {
    publicationStatus = 'publish';

    severity = 'none';
  }

  const safeToPublish =
    publicationStatus !==
    'hold-for-review';

  const summary =
    publicationStatus === 'publish'
      ? 'Evidence is consistent and the recruitment is safe to publish.'
      : publicationStatus ===
          'publish-with-warning'
        ? 'Recruitment can be published, but the record contains non-blocking warnings.'
        : 'Publication is blocked until conflicting recruitment information is reviewed.';

  return {
    publicationStatus,

    severity,

    canonical,

    conflicts,

    warnings,

    matchedSignals,

    safeToPublish,

    summary,
  };
}





