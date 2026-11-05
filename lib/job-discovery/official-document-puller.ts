import { URL } from 'node:url';

export interface OfficialDocument {
  title: string;
  url: string;
  date: string;
  score: number;
  reasons: string[];
}

const RAILWAY_BASE_URL =
  'https://indianrailways.gov.in/railwayboard/';

const FETCH_FILES_URL =
  'https://indianrailways.gov.in/railwayboard/FetchFiles.jsp';

const REQUEST_TIMEOUT_MS = 20000;

function cleanText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#x2022;/gi, '')
    .replace(/&#9679;/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_\-./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreDocument(
  title: string,
  url: string,
  keywords: string[],
): {
  score: number;
  reasons: string[];
} {
  const value =
    normalize(`${title} ${url}`);

  let score = 0;
  const reasons: string[] = [];

  for (const keyword of keywords) {
    const normalizedKeyword =
      normalize(keyword);

    if (
      normalizedKeyword &&
      value.includes(normalizedKeyword)
    ) {
      score += 15;
      reasons.push(
        `matches ${keyword}`,
      );
    }
  }

  if (
    /\brrb\b/i.test(value)
  ) {
    score += 25;
    reasons.push('RRB signal');
  }

  if (
    /\bje\b/i.test(value) ||
    /junior engineer/i.test(value)
  ) {
    score += 30;
    reasons.push('JE signal');
  }

  if (
    /\bcen\b/i.test(value)
  ) {
    score += 25;
    reasons.push('CEN signal');
  }

  if (
    /recruitment|notification|advertisement|vacancy|employment/i.test(
      value,
    )
  ) {
    score += 20;
    reasons.push(
      'recruitment signal',
    );
  }

  if (
    /\.pdf(?:[?#].*)?$/i.test(url)
  ) {
    score += 10;
    reasons.push('PDF document');
  }

  return {
    score: Math.min(100, score),
    reasons,
  };
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const controller =
    new AbortController();

  const timer =
    setTimeout(
      () =>
        controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

  try {
    return await fetch(
      url,
      {
        ...options,
        signal:
          controller.signal,
      },
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchOfficialDocuments(
  date: string,
): Promise<OfficialDocument[]> {
  const response =
    await fetchWithTimeout(
      FETCH_FILES_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 SARJOM Official Document Crawler',
        },
        body:
          new URLSearchParams({
            datef: date,
          }).toString(),
      },
    );

  if (!response.ok) {
    throw new Error(
      `Railway FetchFiles.jsp HTTP ${response.status}`,
    );
  }

  const html =
    await response.text();

  const documents: OfficialDocument[] =
    [];

  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match:
    | RegExpExecArray
    | null;

  while (
    (match =
      anchorRegex.exec(html)) !== null
  ) {
    const rawUrl =
      match[1];

    const rawTitle =
      match[2];

    let url: string;

    try {
      url =
        new URL(
          rawUrl,
          RAILWAY_BASE_URL,
        ).toString();
    } catch {
      continue;
    }

    const title =
      cleanText(rawTitle);

    if (!title && !url) {
      continue;
    }

    const result =
      scoreDocument(
        title,
        url,
        [
          'RRB',
          'JE',
          'Junior Engineer',
          'CEN',
          'Recruitment',
          'Notification',
          'Vacancy',
          'Advertisement',
        ],
      );

    documents.push({
      title:
        title || url,
      url,
      date,
      score:
        result.score,
      reasons:
        result.reasons,
    });
  }

  return documents
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}

export async function findOfficialJobDocuments(
  dates: string[],
): Promise<OfficialDocument[]> {
  const all: OfficialDocument[] = [];

  for (const date of dates) {
    try {
      const documents =
        await fetchOfficialDocuments(
          date,
        );

      all.push(...documents);
    } catch (error) {
      console.warn(
        `[SARJOM] Official document fetch failed for ${date}:`,
        error instanceof Error
          ? error.message
          : String(error),
      );
    }
  }

  const seen =
    new Set<string>();

  return all.filter(
    (document) => {
      if (
        seen.has(document.url)
      ) {
        return false;
      }

      seen.add(document.url);

      return true;
    },
  );
}