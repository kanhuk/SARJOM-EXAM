export type NotificationVersionStatus =
  | 'latest'
  | 'superseded'
  | 'same-version'
  | 'unknown';

export interface NotificationVersionDocument {
  url: string;
  title: string;

  type?:
    | 'notification'
    | 'corrigendum'
    | 'extension'
    | 'revised'
    | 'cancellation'
    | 'postponement'
    | 'other';

  official?: boolean;

  advertisementNumber?: string | null;
  documentDate?: string | null;

  /**
   * Optional extracted text from Gemini/PDF analysis.
   * Used only when available.
   */
  extractedText?: string | null;

  /**
   * Optional explicit relationship supplied by
   * another discovery layer.
   */
  supersedesUrl?: string | null;
}

export interface NotificationVersionResult {
  status: NotificationVersionStatus;

  isLatest: boolean;
  superseded: boolean;

  currentDocumentUrl: string | null;
  supersededBy: string | null;

  advertisementNumber: string | null;

  reasons: string[];
}

function normalize(
  value: string | null | undefined,
): string {
  return (value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDate(
  value?: string | null,
): Date | null {
  if (!value) {
    return null;
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value.trim(),
    );

  if (!match) {
    return null;
  }

  const date = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
    ),
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return date;
}

function normalizeAdvertisementNumber(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const normalized =
    normalize(value)
      .replace(
        /advertisement|advt|advertisement no\.?|advertisement number|विज्ञापन सं[०o.]*/gi,
        '',
      )
      .replace(/[^a-z0-9/.-]/gi, '')
      .trim();

  return normalized || null;
}

function containsAny(
  text: string,
  signals: string[],
): boolean {
  return signals.some(
    (signal) =>
      text.includes(signal),
  );
}

function documentType(
  document: NotificationVersionDocument,
): string {
  if (document.type) {
    return document.type;
  }

  const text = normalize(
    `${document.title} ${
      document.extractedText || ''
    }`,
  );

  if (
    containsAny(text, [
      'corrigendum',
      'corrigenda',
      'corrigendum notice',
    ])
  ) {
    return 'corrigendum';
  }

  if (
    containsAny(text, [
      'revised advertisement',
      'revised notification',
      'revised notice',
    ])
  ) {
    return 'revised';
  }

  if (
    containsAny(text, [
      'extension',
      'extended',
      'extension notice',
    ])
  ) {
    return 'extension';
  }

  if (
    containsAny(text, [
      'cancelled',
      'cancellation',
      'cancelation',
    ])
  ) {
    return 'cancellation';
  }

  if (
    containsAny(text, [
      'postponed',
      'postponement',
      'deferred',
    ])
  ) {
    return 'postponement';
  }

  if (
    containsAny(text, [
      'notification',
      'advertisement',
      'recruitment',
    ])
  ) {
    return 'notification';
  }

  return 'other';
}

function extractAdvertisementNumber(
  document: NotificationVersionDocument,
): string | null {
  if (
    document.advertisementNumber
  ) {
    return normalizeAdvertisementNumber(
      document.advertisementNumber,
    );
  }

  const text =
    `${document.title} ${
      document.extractedText || ''
    }`;

  const patterns = [
    /(?:advertisement|advt\.?|विज्ञापन)\s*(?:no\.?|number|सं[०o.]?)?\s*[-:./]?\s*([a-z0-9]+(?:[./-][a-z0-9]+)*)/i,

    /(?:advertisement\s*no\.?|advt\s*no\.?)\s*[-:./]?\s*([a-z0-9]+(?:[./-][a-z0-9]+)*)/i,
  ];

  for (const pattern of patterns) {
    const match =
      pattern.exec(text);

    if (match?.[1]) {
      return normalizeAdvertisementNumber(
        match[1],
      );
    }
  }

  return null;
}

function sameAdvertisement(
  a: NotificationVersionDocument,
  b: NotificationVersionDocument,
): boolean {
  const aNumber =
    extractAdvertisementNumber(a);

  const bNumber =
    extractAdvertisementNumber(b);

  if (
    !aNumber ||
    !bNumber
  ) {
    return false;
  }

  return (
    aNumber === bNumber
  );
}

function isModification(
  document: NotificationVersionDocument,
): boolean {
  return [
    'corrigendum',
    'extension',
    'revised',
    'cancellation',
    'postponement',
  ].includes(
    documentType(document),
  );
}

function modificationPriority(
  document: NotificationVersionDocument,
): number {
  switch (
    documentType(document)
  ) {
    case 'cancellation':
      return 100;

    case 'revised':
      return 90;

    case 'corrigendum':
      return 80;

    case 'postponement':
      return 70;

    case 'extension':
      return 60;

    case 'notification':
      return 20;

    default:
      return 0;
  }
}

function getDocumentDate(
  document: NotificationVersionDocument,
): Date | null {
  if (
    document.documentDate
  ) {
    return parseDate(
      document.documentDate,
    );
  }

  return null;
}

/**
 * Resolve one document against a collection of
 * official documents belonging to the same recruitment.
 */
export function resolveNotificationVersion(
  target: NotificationVersionDocument,
  documents: NotificationVersionDocument[],
): NotificationVersionResult {

  const targetAdvertisement =
    extractAdvertisementNumber(
      target,
    );

  const targetType =
    documentType(target);

  const reasons: string[] = [];

  /*
   * Explicit supersession relationship always wins.
   */
  if (
    target.supersedesUrl
  ) {
    const superseded =
      documents.find(
        (document) =>
          document.url ===
          target.supersedesUrl,
      );

    if (superseded) {
      reasons.push(
        'Document explicitly supersedes another official document.',
      );
    }
  }

  const candidates =
    documents.filter(
      (document) =>
        document.url !== target.url &&
        document.official !== false,
    );

  /*
   * Find documents that clearly refer to
   * the same advertisement.
   */
  const related =
    candidates.filter(
      (document) =>
        sameAdvertisement(
          target,
          document,
        ),
    );

  /*
   * If no advertisement number exists,
   * we should be conservative.
   */
  if (
    !targetAdvertisement &&
    related.length === 0
  ) {
    return {
      status: 'unknown',
      isLatest: false,
      superseded: false,

      currentDocumentUrl:
        target.url,

      supersededBy: null,

      advertisementNumber:
        null,

      reasons: [
        'No reliable advertisement number was found.',
        'Cannot safely determine document version.',
      ],
    };
  }

  /*
   * Look for a newer modification.
   */
  let newestModification:
    NotificationVersionDocument | null =
    null;

  let newestModificationDate:
    Date | null = null;

  for (
    const document of related
  ) {
    if (
      !isModification(
        document,
      )
    ) {
      continue;
    }

    const date =
      getDocumentDate(
        document,
      );

    if (!date) {
      continue;
    }

    if (
      !newestModificationDate ||
      date.getTime() >
        newestModificationDate.getTime()
    ) {
      newestModification =
        document;

      newestModificationDate =
        date;
    }
  }

  if (
    newestModification
  ) {
    const targetDate =
      getDocumentDate(
        target,
      );

    if (
      !targetDate ||
      newestModificationDate!.getTime() >
        targetDate.getTime()
    ) {
      reasons.push(
        `Newer ${documentType(
          newestModification,
        )} found.`,
      );

      return {
        status: 'superseded',
        isLatest: false,
        superseded: true,

        currentDocumentUrl:
          newestModification.url,

        supersededBy:
          newestModification.url,

        advertisementNumber:
          targetAdvertisement,

        reasons,
      };
    }
  }

  /*
   * Compare same-version documents.
   */
  const sameVersion =
    candidates.filter(
      (document) =>
        sameAdvertisement(
          target,
          document,
        ),
    );

  if (
    sameVersion.length === 0
  ) {
    reasons.push(
      'No newer related official document found.',
    );

    return {
      status: 'latest',
      isLatest: true,
      superseded: false,

      currentDocumentUrl:
        target.url,

      supersededBy: null,

      advertisementNumber:
        targetAdvertisement,

      reasons,
    };
  }

  /*
   * Compare document dates when possible.
   */
  const targetDate =
    getDocumentDate(target);

  let newerSameVersion:
    NotificationVersionDocument | null =
    null;

  let newerDate:
    Date | null = null;

  for (
    const document of sameVersion
  ) {
    const date =
      getDocumentDate(
        document,
      );

    if (!date) {
      continue;
    }

    if (
      !targetDate ||
      date.getTime() >
        targetDate.getTime()
    ) {
      if (
        !newerDate ||
        date.getTime() >
          newerDate.getTime()
      ) {
        newerDate = date;
        newerSameVersion =
          document;
      }
    }
  }

  if (
    newerSameVersion
  ) {
    reasons.push(
      'A newer official document with the same advertisement number was found.',
    );

    return {
      status: 'superseded',
      isLatest: false,
      superseded: true,

      currentDocumentUrl:
        newerSameVersion.url,

      supersededBy:
        newerSameVersion.url,

      advertisementNumber:
        targetAdvertisement,

      reasons,
    };
  }

  /*
   * If this document itself is a high-priority
   * modification and no newer modification exists,
   * consider it the latest known version.
   */
  if (
    isModification(target)
  ) {
    reasons.push(
      `Latest known modification type: ${targetType}.`,
    );

    return {
      status: 'latest',
      isLatest: true,
      superseded: false,

      currentDocumentUrl:
        target.url,

      supersededBy: null,

      advertisementNumber:
        targetAdvertisement,

      reasons,
    };
  }

  /*
   * We found related documents but cannot prove
   * which one is newer.
   */
  const hasUndatedModification =
    related.some(
      (document) =>
        isModification(
          document,
        ) &&
        !getDocumentDate(
          document,
        ),
    );

  if (
    hasUndatedModification
  ) {
    reasons.push(
      'A related modification exists, but its document date could not be established.',
    );

    return {
      status: 'unknown',
      isLatest: false,
      superseded: false,

      currentDocumentUrl:
        target.url,

      supersededBy: null,

      advertisementNumber:
        targetAdvertisement,

      reasons,
    };
  }

  reasons.push(
    'No evidence that this document has been superseded.',
  );

  return {
    status: 'latest',
    isLatest: true,
    superseded: false,

    currentDocumentUrl:
      target.url,

    supersededBy: null,

    advertisementNumber:
      targetAdvertisement,

    reasons,
  };
}