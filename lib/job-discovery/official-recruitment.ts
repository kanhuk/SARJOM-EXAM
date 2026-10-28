import type {
  DiscoveredJob,
} from './types.js';

export interface OfficialRecruitmentCandidate {
  title: string;
  url: string;
  score: number;
  reasons: string[];
}

export interface OfficialRecruitmentResult {
  found: boolean;
  officialUrl?: string;
  notificationUrl?: string;
  applyUrl?: string;
  confidence: number;
  candidates: OfficialRecruitmentCandidate[];
  reason: string;
}

const REQUEST_TIMEOUT_MS = 15000;
const MAX_RESPONSE_BYTES = 4_000_000;

const NOISE_TERMS = [
  'biodata',
  'rajbhasha',
  'environment',
  'signage',
  'newsletter',
  'annual report',
  'rti',
  'message',
  'speech',
  'photo',
  'gallery',
  'tender',
  'procurement',
  'bonus',
  'feedback',
  'suggestion',
  'train time table',
  'timetable',
];

const RECRUITMENT_TERMS = [
  'recruitment',
  'notification',
  'advertisement',
  'advt',
  'vacancy',
  'vacancies',
  'application',
  'apply',
  'online form',
  'job',
  'career',
  'engagement',
  'appointment',
  'selection',
];

const JOB_TERMS = [
  'rrb',
  'railway recruitment board',
  'junior engineer',
  'junior engineering',
  ' je ',
];

function normalize(
  value: string,
): string {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtml(
  value: string,
): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#47;/gi, '/')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function cleanTitle(
  value: string,
): string {
  return normalize(
    decodeHtml(
      value
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#\d+;/g, ' '),
    ),
  );
}

function isHttpUrl(
  value: string,
): boolean {
  return /^https?:\/\//i.test(
    value,
  );
}

function isPdf(
  url: string,
): boolean {
  return /\.pdf(?:[?#].*)?$/i.test(
    url,
  );
}

function isNoise(
  title: string,
  url: string,
): boolean {
  const value =
    `${title} ${url}`.toLowerCase();

  return NOISE_TERMS.some(
    (term) =>
      value.includes(term),
  );
}

function scoreCandidate(
  title: string,
  url: string,
  job: DiscoveredJob,
): OfficialRecruitmentCandidate {
  const value =
    ` ${title} ${url} `.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  /*
   * Match the actual job.
   */
  const jobText =
    `${job.title} ${job.organization}`
      .toLowerCase();

  const jobTokens =
    jobText
      .split(/[^a-z0-9]+/)
      .filter(
        (token) =>
          token.length >= 3,
      );

  for (
    const token of jobTokens
  ) {
    if (
      value.includes(
        ` ${token} `,
      ) ||
      value.includes(token)
    ) {
      score += 5;
      reasons.push(
        `matches ${token}`,
      );
    }
  }

  /*
   * Strong RRB / JE signals.
   */
  if (
    /\brrb\b/i.test(value)
  ) {
    score += 30;
    reasons.push('RRB match');
  }

  if (
    /junior\s+engineer/i.test(
      value,
    )
  ) {
    score += 35;
    reasons.push(
      'Junior Engineer match',
    );
  }

  if (
    /\bje\b/i.test(value)
  ) {
    score += 15;
    reasons.push('JE match');
  }

  /*
   * Recruitment signals.
   */
  for (
    const term of RECRUITMENT_TERMS
  ) {
    if (
      value.includes(
        ` ${term} `,
      ) ||
      value.includes(term)
    ) {
      score += 8;
      reasons.push(
        `${term} signal`,
      );
    }
  }

  /*
   * Current year is a useful signal.
   */
  if (
    value.includes('2026')
  ) {
    score += 15;
    reasons.push(
      '2026 match',
    );
  }

  /*
   * Official recruitment section.
   */
  if (
    /recruitment/i.test(
      value,
    ) &&
    /view_section/i.test(url)
  ) {
    score += 25;
    reasons.push(
      'official recruitment section',
    );
  }

  /*
   * PDFs are useful but receive only
   * a small bonus.
   */
  if (isPdf(url)) {
    score += 5;
    reasons.push(
      'PDF document',
    );
  }

  /*
   * Strong penalty for unrelated
   * official documents.
   */
  if (
    isNoise(
      title,
      url,
    )
  ) {
    score -= 60;
    reasons.push(
      'likely unrelated document',
    );
  }

  /*
   * Application links are valuable.
   */
  if (
    /\bapply\b|\bapplication\b|\bonline form\b/i.test(
      value,
    )
  ) {
    score += 15;
    reasons.push(
      'application signal',
    );
  }

  return {
    title,
    url,
    score: Math.max(
      0,
      Math.min(
        100,
        score,
      ),
    ),
    reasons,
  };
}

async function fetchHtml(
  url: string,
): Promise<string> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

  try {
    const response =
      await fetch(
        url,
        {
          redirect: 'follow',
          signal:
            controller.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; SARJOM/1.0; +https://sarjom.example)',
            Accept:
              'text/html,application/xhtml+xml',
          },
        },
      );

    if (
      !response.ok
    ) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`,
      );
    }

    const contentLength =
      response.headers.get(
        'content-length',
      );

    if (
      contentLength &&
      Number(contentLength) >
        MAX_RESPONSE_BYTES
    ) {
      throw new Error(
        'Response too large',
      );
    }

    const text =
      await response.text();

    if (
      Buffer.byteLength(
        text,
        'utf8',
      ) >
      MAX_RESPONSE_BYTES
    ) {
      throw new Error(
        'Response too large',
      );
    }

    return text;
  } finally {
    clearTimeout(
      timeout,
    );
  }
}

function extractLinks(
  html: string,
  sourceUrl: string,
): Array<{
  title: string;
  url: string;
}> {
  const results: Array<{
    title: string;
    url: string;
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
      decodeHtml(
        match[1],
      );

    let url: string;

    try {
      url =
        new URL(
          rawUrl,
          sourceUrl,
        ).toString();
    } catch {
      continue;
    }

    if (
      !isHttpUrl(url)
    ) {
      continue;
    }

    const title =
      cleanTitle(
        match[2],
      ) ||
      url;

    results.push({
      title,
      url,
    });
  }

  return results;
}

function deduplicate(
  candidates: OfficialRecruitmentCandidate[],
): OfficialRecruitmentCandidate[] {
  const map =
    new Map<
      string,
      OfficialRecruitmentCandidate
    >();

  for (
    const candidate of candidates
  ) {
    const key =
      candidate.url
        .toLowerCase();

    const existing =
      map.get(key);

    if (
      !existing ||
      candidate.score >
        existing.score
    ) {
      map.set(
        key,
        candidate,
      );
    }
  }

  return Array.from(
    map.values(),
  );
}

export async function findOfficialRecruitmentCandidates(
  job: DiscoveredJob,
  officialUrl: string,
): Promise<OfficialRecruitmentResult> {
  try {
    const html =
      await fetchHtml(
        officialUrl,
      );

    const links =
      extractLinks(
        html,
        officialUrl,
      );

    const candidates =
      links
        .map(
          (link) =>
            scoreCandidate(
              link.title,
              link.url,
              job,
            ),
        )
        .filter(
          (candidate) =>
            candidate.score >= 15,
        );

    const unique =
      deduplicate(
        candidates,
      )
        .sort(
          (a, b) =>
            b.score -
            a.score,
        )
        .slice(
          0,
          30,
        );

    const best =
      unique[0];

    if (!best) {
      return {
        found: false,
        officialUrl,
        confidence: 20,
        candidates: [],
        reason:
          'Official page loaded, but no relevant recruitment candidate was found.',
      };
    }

    const notification =
      unique.find(
        (candidate) =>
          isPdf(
            candidate.url,
          ) &&
          candidate.score >=
            45,
      );

    const application =
      unique.find(
        (candidate) =>
          /\bapply\b|\bapplication\b|\bonline form\b/i.test(
            `${candidate.title} ${candidate.url}`,
          ) &&
          candidate.score >=
            40,
      );

    const confidence =
      Math.min(
        100,
        Math.max(
          30,
          best.score +
            (notification
              ? 10
              : 0) +
            (application
              ? 10
              : 0),
        ),
      );

    return {
      found: true,
      officialUrl,
      notificationUrl:
        notification?.url,
      applyUrl:
        application?.url,
      confidence,
      candidates: unique,
      reason:
        'Found official recruitment candidates and ranked them against the target job.',
    };
  } catch (error) {
    return {
      found: false,
      officialUrl,
      confidence: 0,
      candidates: [],
      reason:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}