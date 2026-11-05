import {
  reconcileRecruitmentEvidence,
  type RecruitmentEvidence,
  type ReconciliationResult,
} from './reconciliation.js';

export interface VersionAwareResult extends ReconciliationResult {
  versionDecision:
    | 'normal-conflict'
    | 'official-correction'
    | 'official-extension'
    | 'official-revision'
    | 'official-cancellation'
    | 'official-postponement'
    | 'no-version-change';

  previousEvidence: RecruitmentEvidence | null;
  latestEvidence: RecruitmentEvidence | null;
  changedFields: string[];
  versionReasons: string[];
}

function isOfficialModification(item: RecruitmentEvidence): boolean {
  return (
    item.sourceType === 'corrigendum' ||
    item.sourceType === 'extension' ||
    item.modificationType === 'corrigendum' ||
    item.modificationType === 'extension' ||
    item.modificationType === 'revised' ||
    item.modificationType === 'cancellation' ||
    item.modificationType === 'postponement' ||
    item.modificationType === 'unknown' && false
  );
}

function modificationKind(
  item: RecruitmentEvidence | null,
): VersionAwareResult['versionDecision'] {
  if (!item) return 'no-version-change';

  if (
    item.sourceType === 'corrigendum' ||
    item.modificationType === 'corrigendum'
  ) {
    return 'official-correction';
  }

  if (
    item.sourceType === 'extension' ||
    item.modificationType === 'extension'
  ) {
    return 'official-extension';
  }

  if (item.modificationType === 'revised') {
    return 'official-revision';
  }

  if (item.modificationType === 'cancellation') {
    return 'official-cancellation';
  }

  if (item.modificationType === 'postponement') {
    return 'official-postponement';
  }

  return 'no-version-change';
}

function value(item: RecruitmentEvidence, field: keyof RecruitmentEvidence) {
  return item[field] ?? null;
}

function changedFields(
  previous: RecruitmentEvidence | null,
  latest: RecruitmentEvidence | null,
): string[] {
  if (!previous || !latest) return [];

  const fields: Array<keyof RecruitmentEvidence> = [
    'title',
    'organization',
    'advertisementNumber',
    'postName',
    'vacancies',
    'applicationStartDate',
    'applicationLastDate',
    'examDate',
  ];

  return fields
    .filter(field => {
      const a = value(previous, field);
      const b = value(latest, field);

      if (a === null && b === null) return false;
      return String(a) !== String(b);
    })
    .map(String);
}

function sortByDocumentDate(items: RecruitmentEvidence[]): RecruitmentEvidence[] {
  return [...items].sort((a, b) => {
    const da = a.documentDate ?? '';
    const db = b.documentDate ?? '';

    if (da !== db) return db.localeCompare(da);
    return (b.confidence ?? 0) - (a.confidence ?? 0);
  });
}

function selectPrevious(
  evidence: RecruitmentEvidence[],
  latestModification: RecruitmentEvidence,
): RecruitmentEvidence | null {
  const candidates = evidence.filter(item => item !== latestModification);

  const originals = candidates.filter(
    item =>
      !isOfficialModification(item) &&
      item.sourceType !== 'source-article' &&
      item.sourceType !== 'ai-extraction',
  );

  return sortByDocumentDate(originals)[0] ?? null;
}

function latestOfficialVersionEvidence(
  evidence: RecruitmentEvidence[],
  latestModification: RecruitmentEvidence,
): RecruitmentEvidence[] {
  /*
   * A corrigendum/extension supersedes the original notification.
   * Therefore the old official PDF must NOT be reconciled as if it were
   * a simultaneous conflicting version.
   *
   * Keep the latest official modification as the canonical version.
   * If there are additional official documents with the exact same
   * document date, they can corroborate that version.
   */
  const sameVersionOfficial = evidence.filter(item => {
    if (item === latestModification) return true;

    const isOfficial =
      item.sourceType === 'official-pdf' ||
      item.sourceType === 'official-webpage' ||
      item.sourceType === 'corrigendum' ||
      item.sourceType === 'extension';

    return isOfficial && item.documentDate === latestModification.documentDate;
  });

  return sameVersionOfficial;
}

export function reconcileVersionAware(
  evidence: RecruitmentEvidence[],
): VersionAwareResult {
  if (!evidence.length) {
    const base = reconcileRecruitmentEvidence([]);

    return {
      ...base,
      versionDecision: 'no-version-change',
      previousEvidence: null,
      latestEvidence: null,
      changedFields: [],
      versionReasons: ['No evidence supplied.'],
    };
  }

  const modifications = sortByDocumentDate(
    evidence.filter(isOfficialModification),
  );

  const latestModification = modifications[0] ?? null;

  if (!latestModification) {
    const base = reconcileRecruitmentEvidence(evidence);

    return {
      ...base,
      versionDecision:
        base.publicationStatus === 'hold-for-review'
          ? 'normal-conflict'
          : 'no-version-change',
      previousEvidence: selectPrevious(evidence, evidence[0]),
      latestEvidence: base.canonical,
      changedFields: [],
      versionReasons: ['No official corrigendum, extension, or revision found.'],
    };
  }

  const previousEvidence = selectPrevious(evidence, latestModification);
  const latestVersionEvidence = latestOfficialVersionEvidence(
    evidence,
    latestModification,
  );

  /*
   * Critical design rule:
   * Old official versions and source-article claims are not conflicts with
   * an explicit newer official modification. They are historical evidence.
   *
   * We reconcile only documents belonging to the latest official version.
   */
  const base = reconcileRecruitmentEvidence(latestVersionEvidence);

  const officialCriticalConflicts = base.conflicts.filter(
    conflict =>
      conflict.severity === 'critical' || conflict.severity === 'high',
  );

  const changes = changedFields(previousEvidence, latestModification);
  const reasons: string[] = [];

  if (
    latestModification.sourceType === 'corrigendum' ||
    latestModification.modificationType === 'corrigendum'
  ) {
    reasons.push('Official corrigendum detected.');
  }

  if (
    latestModification.sourceType === 'extension' ||
    latestModification.modificationType === 'extension'
  ) {
    reasons.push('Official application extension detected.');
  }

  if (latestModification.modificationType === 'revised') {
    reasons.push('Official revised notification detected.');
  }

  if (latestModification.modificationType === 'cancellation') {
    reasons.push('Official cancellation notice detected.');
  }

  if (latestModification.modificationType === 'postponement') {
    reasons.push('Official postponement notice detected.');
  }

  if (changes.length) {
    reasons.push(`Changed fields: ${changes.join(', ')}.`);
  }

  if (officialCriticalConflicts.length) {
    return {
      ...base,
      publicationStatus: 'hold-for-review',
      severity: 'critical',
      safeToPublish: false,
      versionDecision: modificationKind(latestModification),
      previousEvidence,
      latestEvidence: latestModification,
      changedFields: changes,
      versionReasons: [
        ...reasons,
        'Multiple documents belonging to the latest official version still conflict.',
      ],
      summary:
        'The latest official version contains conflicting official evidence. Admin review is required.',
    };
  }

  return {
    ...base,
    publicationStatus: base.publicationStatus === 'hold-for-review'
      ? 'publish-with-warning'
      : base.publicationStatus,
    severity: base.publicationStatus === 'hold-for-review'
      ? 'medium'
      : base.severity,
    safeToPublish: true,
    versionDecision: modificationKind(latestModification),
    previousEvidence,
    latestEvidence: latestModification,
    changedFields: changes,
    versionReasons: reasons,
    summary:
      'A newer official modification supersedes the previous version. The latest official evidence is canonical.',
  };
}



