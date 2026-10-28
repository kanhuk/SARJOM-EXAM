import { URL } from 'node:url';

export interface OfficialCrawlerCandidate {
  title: string;
  url: string;
  score: number;
  reasons: string[];
}

export interface OfficialCrawlerResult {
  found: boolean;
  officialUrl: string;
  candidates: OfficialCrawlerCandidate[];
  confidence: number;
  reason: string;
}

const REQUEST_TIMEOUT_MS = 15000;
const MAX_HTML_BYTES = 5_000_000;

const USER_AGENT =
  'SARJOM-Official-Recruitment-Crawler/1.0';

const RECRUITMENT_KEYWORDS = [
  'recruitment',
  'recruitment notice',
  'recruitment notification',
  'advertisement',
  'advertisement notice',
  'employment',
  'vacancy',
  'vacancies',
  'vacancy notice',
  'vacancy circular',
  'job',
  'jobs',
  'career',
  'careers',
  'apply online',
  'application',
  'online application',
  'notification',
  'notice',
  'selection',
  'engagement',
  'appointment',
];

const STRONG_KEYWORDS = [
  'official notification',
  'recruitment notification',
  'recruitment advertisement',
  'employment notification',
  'apply online',
  'online application',
  'vacancy notice',
  'vacancy circular',
  'advertisement no',
  'advt no',
  'notification no',
];

const NEGATIVE_KEYWORDS = [
  'tender',
  'procurement',
  'train',
  'timetable',
  'tourist',
  'tourism',
  'rti',
  'contact',
  'feedback',
  'about us',
  'press release',
  'annual report',
  'pension',
  'retirement',
];

function normalizeText(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ');
}

function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

function sameOfficialDomain(
  url: string,
  officialUrl: string,
): boolean {
  try {
    const a = new URL(url).hostname
      .toLowerCase()
      .replace(/^www\./, '');

    const b = new URL(officialUrl).hostname
      .toLowerCase()
      .replace(/^www\./, '');

    return (
      a === b ||
      a.endsWith(`.${b}`) ||
      b.endsWith(`.${a}`)
    );
  } catch {
    return false;
  }
}

function isPdfUrl(url: string): boolean {
  return /\.pdf(?:[?#].*)?$/i.test(url);
}

function scoreCandidate(
  title: string,
  url: string,
  targetText: string,
): {
  score: number;
  reasons: string[];
} {
  const combined =
    `${title} ${url} ${targetText}`
      .toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  for (const keyword of STRONG_KEYWORDS) {
    if (combined.includes(keyword)) {
      score += 20;
      reasons.push(`matches ${keyword}`);
    }
  }

  for (const keyword of RECRUITMENT_KEYWORDS) {
    if (combined.includes(keyword)) {
      score += 8;
      reasons.push(`matches ${keyword}`);
    }
  }

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (combined.includes(keyword)) {
      score -= 12;
      reasons.push(`negative ${keyword}`);
    }
  }

  if (isPdfUrl(url)) {
    score += 25;
    reasons.push('PDF candidate');
  }

  if (
    /\b(20\d{2})\b/.test(
      combined,
    )
  ) {
    score += 5;
    reasons.push('contains year');
  }

  if (
    /\b(?:rrb|ssc|upsc|sbi|ibps|ntpc|isro)\b/i.test(
      combined,
    )
  ) {
    score += 8;
    reasons.push('contains recruitment organization signal');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
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
      await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept:
            'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
        },
      });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`,
      );
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) ?? '';

    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml+xml')
    ) {
      throw new Error(
        `Expected HTML but received ${contentType}`,
      );
    }

    const buffer =
      Buffer.from(
        await response.arrayBuffer(),
      );

    if (
      buffer.length >
      MAX_HTML_BYTES
    ) {
      throw new Error(
        `HTML exceeds ${MAX_HTML_BYTES} bytes`,
      );
    }

    return buffer.toString('utf8');
  } finally {
    clearTimeout(timeout);
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
      anchorRegex.exec(html)) !== null
  ) {
    const rawHref =
      decodeHtmlEntities(
        match[1],
      ).trim();

    const rawTitle =
      normalizeText(
        decodeHtmlEntities(
          match[2],
        ),
      );

    if (!rawHref) {
      continue;
    }

    let absoluteUrl: string;

    try {
      absoluteUrl =
        new URL(
          rawHref,
          sourceUrl,
        ).toString();
    } catch {
      continue;
    }

    if (
      !isHttpUrl(
        absoluteUrl,
      )
    ) {
      continue;
    }

    if (
      rawHref.startsWith('#') ||
      rawHref.toLowerCase().startsWith('mailto:') ||
      rawHref.toLowerCase().startsWith('javascript:')
    ) {
      continue;
    }

    results.push({
      title:
        rawTitle ||
        absoluteUrl,
      url: absoluteUrl,
    });
  }

  return results;
}

function deduplicateCandidates(
  candidates: OfficialCrawlerCandidate[],
): OfficialCrawlerCandidate[] {
  const map =
    new Map<
      string,
      OfficialCrawlerCandidate
    >();

  for (const candidate of candidates) {
    const key =
      candidate.url
        .toLowerCase()
        .replace(/\/+$/, '');

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
  ).sort(
    (a, b) =>
      b.score - a.score,
  );
}

export async function crawlOfficialRecruitmentPage(
  officialUrl: string,
  targetTitle: string,
  organization?: string,
): Promise<OfficialCrawlerResult> {
  if (
    !isHttpUrl(
      officialUrl,
    )
  ) {
    return {
      found: false,
      officialUrl,
      candidates: [],
      confidence: 0,
      reason:
        'Invalid official URL.',
    };
  }

  let html: string;

  try {
    html =
      await fetchHtml(
        officialUrl,
      );
  } catch (error) {
    return {
      found: false,
      officialUrl,
      candidates: [],
      confidence: 0,
      reason:
        `Official page fetch failed: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
    };
  }

  const targetText =
    `${targetTitle} ${
      organization ?? ''
    }`;

  const links =
    extractLinks(
      html,
      officialUrl,
    );

  const candidates: OfficialCrawlerCandidate[] =
    [];

  for (const link of links) {
    if (
      !sameOfficialDomain(
        link.url,
        officialUrl,
      )
    ) {
      continue;
    }

    const result =
      scoreCandidate(
        link.title,
        link.url,
        targetText,
      );

    if (
      result.score < 10
    ) {
      continue;
    }

    candidates.push({
      title:
        link.title,
      url:
        link.url,
      score:
        result.score,
      reasons:
        result.reasons,
    });
  }

  /*
   * The official page itself is also a candidate.
   * This is useful when the page is already the
   * actual recruitment notice/listing.
   */
  const selfScore =
    scoreCandidate(
      targetTitle,
      officialUrl,
      targetText,
    );

  candidates.push({
    title:
      targetTitle ||
      'Official recruitment page',
    url:
      officialUrl,
    score:
      selfScore.score,
    reasons:
      [
        'official source page',
        ...selfScore.reasons,
      ],
  });

  const ranked =
    deduplicateCandidates(
      candidates,
    ).slice(0, 30);

  const best =
    ranked[0];

  if (!best) {
    return {
      found: false,
      officialUrl,
      candidates: [],
      confidence: 20,
      reason:
        'Official page loaded, but no recruitment candidates were found.',
    };
  }

  const confidence =
    Math.min(
      95,
      Math.max(
        30,
        best.score,
      ),
    );

  return {
    found: true,
    officialUrl,
    candidates: ranked,
    confidence,
    reason:
      'Official recruitment candidates were discovered and ranked.',
  };
}