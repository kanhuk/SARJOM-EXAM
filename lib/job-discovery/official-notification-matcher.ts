import type { DiscoveredJob } from './types.js';
import type { OfficialNotificationDocument } from './official-notification-extractor.js';

export interface MatchedOfficialDocument {
  document: OfficialNotificationDocument;

  score: number;

  matchedSignals: string[];

  likelyNotification: boolean;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(' ')
    .filter(
      token =>
        token.length >= 3,
    );
}

function calculateMatchScore(
  job: DiscoveredJob,
  document: OfficialNotificationDocument,
): MatchedOfficialDocument {
  const documentText = normalize(
    `${document.title} ${document.url}`,
  );

  const jobText = normalize(
    `${job.title} ${job.organization} ${job.category} ${
      job.keywords?.join(' ') || ''
    }`,
  );

  const jobTokens = tokenize(jobText);

  let score = 0;

  const matchedSignals: string[] = [];

  /*
   * Organization matching
   */
  const organizationTokens =
    tokenize(job.organization);

  for (
    const token of organizationTokens
  ) {
    if (
      token.length >= 4 &&
      documentText.includes(token)
    ) {
      score += 15;

      matchedSignals.push(
        `organization:${token}`,
      );

      break;
    }
  }

  /*
   * Job-title matching
   */
  const titleTokens =
    tokenize(job.title);

  let titleMatches = 0;

  for (
    const token of titleTokens
  ) {
    if (
      token.length >= 3 &&
      documentText.includes(token)
    ) {
      titleMatches++;
    }
  }

  if (titleMatches > 0) {
    score += Math.min(
      titleMatches * 10,
      40,
    );

    matchedSignals.push(
      `title:${titleMatches} matches`,
    );
  }

  /*
   * Keyword matching
   */
  let keywordMatches = 0;

  for (
    const keyword of
      job.keywords || []
  ) {
    const token =
      normalize(keyword);

    if (
      token.length >= 3 &&
      documentText.includes(token)
    ) {
      keywordMatches++;
    }
  }

  if (keywordMatches > 0) {
    score += Math.min(
      keywordMatches * 5,
      25,
    );

    matchedSignals.push(
      `keywords:${keywordMatches}`,
    );
  }

  /*
   * Recruitment signals
   */
  const recruitmentSignals = [
    'recruitment',
    'notification',
    'advertisement',
    'vacancy',
    'vacancies',
    'junior engineer',
    'online application',
    'apply online',
    'eligibility',
    'selection process',
    'important dates',
  ];

  const recruitmentMatches =
    recruitmentSignals.filter(
      signal =>
        documentText.includes(signal),
    );

  if (
    recruitmentMatches.length > 0
  ) {
    score += Math.min(
      recruitmentMatches.length * 5,
      30,
    );

    matchedSignals.push(
      `recruitment-signals:${recruitmentMatches.length}`,
    );
  }

  /*
   * PDF itself
   */
  if (
    /\.pdf(?:[?#].*)?$/i.test(
      document.url,
    )
  ) {
    score += 10;

    matchedSignals.push(
      'official-pdf',
    );
  }

  /*
   * Notification type
   */
  if (
    document.type ===
    'notification'
  ) {
    score += 15;

    matchedSignals.push(
      'notification-type',
    );
  }

  /*
   * Cap score
   */
  score = Math.min(
    score,
    100,
  );

  /*
   * A document becomes a likely notification
   * only when there is meaningful evidence.
   */
  const likelyNotification =
    score >= 45 &&
    (
      titleMatches >= 1 ||
      keywordMatches >= 1
    );

  return {
    document,
    score,
    matchedSignals,
    likelyNotification,
  };
}

export function matchOfficialDocuments(
  job: DiscoveredJob,
  documents: OfficialNotificationDocument[],
): MatchedOfficialDocument[] {
  return documents
    .map(document =>
      calculateMatchScore(
        job,
        document,
      ),
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}

export function selectBestOfficialDocument(
  job: DiscoveredJob,
  documents: OfficialNotificationDocument[],
): MatchedOfficialDocument | null {
  const matches =
    matchOfficialDocuments(
      job,
      documents,
    );

  return matches[0] || null;
}