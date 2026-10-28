import type { DiscoveredJob } from './types.js';
import {
  resolveOfficialSource,
  type OfficialSourceResult,
} from './official-resolver.js';

export interface OfficialSearchResult
  extends OfficialSourceResult {
  candidates: Array<{
    title: string;
    url: string;
    score: number;
  }>;
}

const REJECTED_DOMAINS = [
  'freejobalert.com',
  'naukri.com',
  'indeed.com',
  'sarkariresult.com',
  'sarkariexam.com',
];

const POSITIVE_PATTERNS = [
  /recruitment/i,
  /career/i,
  /careers/i,
  /vacancy/i,
  /vacancies/i,
  /notification/i,
  /advertisement/i,
  /recruitment-notice/i,
  /recruitment-notification/i,
  /employment/i,
  /job/i,
  /\.pdf(?:[?#]|$)/i,
];

function isRejectedDomain(
  url: string,
): boolean {
  try {
    const hostname =
      new URL(url)
        .hostname
        .toLowerCase()
        .replace(/^www\./, '');

    return REJECTED_DOMAINS.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(`.${domain}`),
    );
  } catch {
    return true;
  }
}
function scoreLink(
  title: string,
  url: string,
  job: DiscoveredJob,
): number {
  let score = 0;

  const value =
    `${title} ${url}`.toLowerCase();

  const jobWords =
    `${job.title} ${job.organization}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(
        (word) =>
          word.length >= 3,
      );

  /*
   * Strong job-specific matching.
   */
  for (
    const word of jobWords
  ) {
    if (value.includes(word)) {
      score += 5;
    }
  }

  /*
   * Recruitment-specific signals.
   */
  if (
    /\brecruitment\b/i.test(value)
  ) {
    score += 35;
  }

  if (
    /\bnotification\b/i.test(value)
  ) {
    score += 35;
  }

  if (
    /\bvacanc(?:y|ies)\b/i.test(value)
  ) {
    score += 30;
  }

  if (
    /\bcareer(?:s)?\b/i.test(value)
  ) {
    score += 25;
  }

  if (
    /\bjob(?:s)?\b/i.test(value)
  ) {
    score += 20;
  }

  if (
    /\bapplication\b/i.test(value)
  ) {
    score += 20;
  }

  if (
    /\b(?:JE|junior engineer)\b/i.test(
      value,
    )
  ) {
    score += 30;
  }

  if (
    /\bRRB\b/i.test(value)
  ) {
    score += 30;
  }

  /*
   * Recruitment pages are preferred over generic PDFs.
   */
  if (
    /view_section/i.test(url) &&
    /recruitment/i.test(value)
  ) {
    score += 40;
  }

  /*
   * PDFs are useful evidence, but a PDF alone is NOT
   * proof that it is a recruitment notification.
   */
  if (
    /\.pdf(?:[?#]|$)/i.test(url)
  ) {
    score += 5;
  }

  /*
   * Strong penalty for clearly unrelated documents.
   */
  const unrelatedPatterns = [
    /biodata/i,
    /rail\s+rajbhasha/i,
    /environment\s+conservation/i,
    /signage/i,
    /screenreader/i,
    /productivity\s+linked\s+bonus/i,
    /message/i,
    /newsletter/i,
    /annual\s+report/i,
    /rti/i,
  ];

  for (
    const pattern of unrelatedPatterns
  ) {
    if (pattern.test(value)) {
      score -= 60;
    }
  }

  return Math.max(
    0,
    Math.min(100, score),
  );
}

function extractLinks(
  html: string,
  baseUrl: string,
  job: DiscoveredJob,
) {
  const results: Array<{
    title: string;
    url: string;
    score: number;
  }> = [];

  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match:
    | RegExpExecArray
    | null;

  while (
    (match =
      anchorRegex.exec(
        html,
      )) !== null
  ) {
    const rawUrl =
      match[1];

    let url: string;

    try {
      url =
        new URL(
          rawUrl,
          baseUrl,
        ).toString();
    } catch {
      continue;
    }

    if (
      isRejectedDomain(url)
    ) {
      continue;
    }

    let title =
      match[2]
        .replace(
          /<[^>]+>/g,
          ' ',
        )
        .replace(
          /\s+/g,
          ' ',
        )
        .trim();

    if (!title) {
      title = url;
    }

    const score =
      scoreLink(
        title,
        url,
        job,
      );

    results.push({
      title,
      url,
      score,
    });
  }

  return results;
}

async function fetchText(
  url: string,
): Promise<string> {
  const response =
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 SARJOM/1.0',
        Accept:
          'text/html,application/xhtml+xml',
      },
      signal:
        AbortSignal.timeout(
          15000,
        ),
    });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

export async function searchOfficialSource(
  job: DiscoveredJob,
): Promise<OfficialSearchResult> {
  const resolved =
    resolveOfficialSource(job);

  if (
    !resolved.found ||
    !resolved.officialDomain
  ) {
    return {
      ...resolved,
      candidates: [],
    };
  }

  const officialUrl =
    resolved.officialUrl ??
    `https://${resolved.officialDomain}/`;

  try {
    const html =
      await fetchText(
        officialUrl,
      );

    const candidates =
      extractLinks(
        html,
        officialUrl,
        job,
      )
        .sort(
          (a, b) =>
            b.score - a.score,
        )
        .slice(0, 20);

    const best =
      candidates[0];

    return {
      ...resolved,
      found: true,
      officialUrl:
        best?.url ??
        officialUrl,
      notificationUrl:
        best?.url ??
        resolved.notificationUrl,
      candidates,
      confidence:
        best
          ? Math.max(
              resolved.confidence,
              best.score,
            )
          : resolved.confidence,
      reason:
        best
          ? `Found an official candidate page on ${resolved.officialDomain}.`
          : `Official domain identified, but no strong recruitment link was found.`,
    };
  } catch (error) {
    return {
      ...resolved,
      candidates: [],
      reason:
        `Official domain identified, but it could not be fetched: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
    };
  }
}