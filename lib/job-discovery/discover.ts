import type { JobSource } from './types.js';

export interface DiscoveryCandidate {
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  discoveredAt: string;
  depth: number;
}

const REQUEST_TIMEOUT_MS = 12000;
const MAX_RESPONSE_BYTES = 2_000_000;

const MAX_CRAWL_DEPTH = 2;
const MAX_PAGES_PER_SOURCE = 10;
const MAX_CANDIDATES_PER_SOURCE = 200;

const BLOCKED_PATH_PATTERNS = [
  /\/login\b/i,
  /\/signin\b/i,
  /\/sign-in\b/i,
  /\/signup\b/i,
  /\/sign-up\b/i,
  /\/register\b/i,
  /\/registration\b/i,
  /\/privacy\b/i,
  /\/terms\b/i,
  /\/cookie\b/i,
  /\/contact\b/i,
  /\/about\b/i,
];

const BLOCKED_TITLE_PATTERNS = [
  /^home$/i,
  /^login$/i,
  /^sign in$/i,
  /^sign up$/i,
  /^register$/i,
  /^registration$/i,
  /^contact us$/i,
  /^about us$/i,
  /^privacy policy$/i,
  /^terms and conditions$/i,
  /^cookie policy$/i,
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtml(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalizeUrl(
  rawUrl: string,
  baseUrl: string,
): string | undefined {
  try {
    const url = new URL(rawUrl, baseUrl);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return undefined;
    }

    url.hash = '';

    const trackingParameters = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
    ];

    for (const parameter of trackingParameters) {
      url.searchParams.delete(parameter);
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

function isBlockedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return BLOCKED_PATH_PATTERNS.some((pattern) =>
      pattern.test(parsed.pathname),
    );
  } catch {
    return true;
  }
}

function isSameDomain(
  candidateUrl: string,
  sourceUrl: string,
): boolean {
  try {
    const candidate = new URL(candidateUrl);
    const source = new URL(sourceUrl);

    return candidate.hostname === source.hostname;
  } catch {
    return false;
  }
}

function isUsefulTitle(title: string): boolean {
  const normalized = normalizeWhitespace(
    decodeHtmlEntities(title),
  );

  if (normalized.length < 8) return false;
  if (normalized.length > 300) return false;

  if (
    BLOCKED_TITLE_PATTERNS.some((pattern) =>
      pattern.test(normalized),
    )
  ) {
    return false;
  }

  return true;
}

function isLikelyHtmlResponse(
  contentType: string | null,
): boolean {
  if (!contentType) return true;

  return (
    contentType.includes('text/html') ||
    contentType.includes('application/xhtml+xml')
  );
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept:
          'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
        'User-Agent':
          'SARJOM-JobDiscovery/1.0 (+https://sarjom-backend.vercel.app)',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`,
      );
    }

    if (
      !isLikelyHtmlResponse(
        response.headers.get('content-type'),
      )
    ) {
      return '';
    }

    const contentLength = response.headers.get(
      'content-length',
    );

    if (
      contentLength &&
      Number(contentLength) > MAX_RESPONSE_BYTES
    ) {
      throw new Error(
        'Response exceeds maximum allowed size',
      );
    }

    const text = await response.text();

    const byteLength = new TextEncoder().encode(text).byteLength;

    if (byteLength > MAX_RESPONSE_BYTES) {
      throw new Error(
        'Response exceeds maximum allowed size',
      );
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

interface ExtractedLink {
  title: string;
  url: string;
}

function extractLinks(
  html: string,
  baseUrl: string,
): ExtractedLink[] {
  const links: ExtractedLink[] = [];

  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) !== null) {
    const rawUrl = decodeHtmlEntities(match[1]);

    const title = normalizeWhitespace(
      decodeHtmlEntities(stripHtml(match[2])),
    );

    if (!isUsefulTitle(title)) {
      continue;
    }

    const url = normalizeUrl(rawUrl, baseUrl);

    if (!url) {
      continue;
    }

    if (isBlockedUrl(url)) {
      continue;
    }

    links.push({
      title,
      url,
    });
  }

  return links;
}

function isLikelyDiscoveryPage(
  title: string,
  url: string,
): boolean {
  const value = `${title} ${url}`.toLowerCase();

  return [
    'latest',
    'notification',
    'notifications',
    'recruitment',
    'recruitments',
    'vacancy',
    'vacancies',
    'jobs',
    'job',
    'government-jobs',
    'latest-update',
    'career',
    'employment',
    'sarkari',
    'naukri',
    'opening',
    'openings',
    'opportunity',
    'opportunities',
    'advertisement',
    'advt',
    'result',
    'admit',
    'application',
    'apply',
  ].some((keyword) => value.includes(keyword));
}

function isLikelyJobCandidate(
  title: string,
  url: string,
): boolean {
  const normalizedTitle = normalizeWhitespace(title);
  const lowerTitle = normalizedTitle.toLowerCase();
  const value =
    `${normalizedTitle} ${url}`.toLowerCase();

  /*
   * These are navigation/category pages, not individual
   * recruitment opportunities.
   */
  const navigationOnlyTitles = [
    'latest notifications',
    'latest notification',
    'selection process',
    'all india govt jobs',
    'state govt jobs',
    'bank jobs',
    'teaching jobs',
    'engineering jobs',
    'railway jobs',
    'police/defence jobs',
    'employment news',
    'search jobs',
    'sarkari job',
    'sarkari naukri',
    'anganwadi recruitment',
    'forest jobs',
    'government jobs',
    'private jobs',
  ];

  if (
    navigationOnlyTitles.includes(lowerTitle)
  ) {
    return false;
  }

  /*
   * FreeJobAlert individual notification pages normally
   * use /articles/.
   */
  const isArticlePage =
    /\/articles\//i.test(url);

  /*
   * Strong recruitment/opportunity language.
   */
  const hasRecruitmentLanguage = [
    'recruitment',
    'vacancy',
    'vacancies',
    'notification',
    'advertisement',
    'advt',
    'appointment',
    'engagement',
    'selection',
    'application',
    'apply',
    'post',
    'posts',
    'position',
    'positions',
    'hiring',
    'walk-in',
    'walk in',
    'job opening',
    'employment opportunity',
    'career opportunity',
    'apprentice',
    'apprenticeship',
    'fellowship',
    'internship',
    'online form',
    'offline form',
  ].some((keyword) =>
    value.includes(keyword),
  );

  if (!hasRecruitmentLanguage) {
    return false;
  }

  /*
   * Article pages containing recruitment language are
   * strong individual-job candidates.
   */
  if (isArticlePage) {
    return true;
  }

  /*
   * For non-article sources, require stronger evidence
   * that the page describes an actual opportunity.
   */
  const hasSpecificOpportunityPattern =
    /\b\d+\s+(?:posts?|vacancies?|positions?|openings?)\b/i.test(
      normalizedTitle,
    ) ||
    /\b(?:recruitment|vacancy|notification|advertisement)\b/i.test(
      normalizedTitle,
    ) ||
    /\b(?:online|offline)\s+form\b/i.test(
      normalizedTitle,
    ) ||
    /\bapplications?\s+(?:are\s+)?invited\b/i.test(
      normalizedTitle,
    );

  return hasSpecificOpportunityPattern;
}

function createCandidate(
  link: ExtractedLink,
  source: JobSource,
  depth: number,
): DiscoveryCandidate {
  return {
    title: link.title,
    url: link.url,
    sourceId: source.id,
    sourceName: source.name,
    discoveredAt: new Date().toISOString(),
    depth,
  };
}

export async function discoverFromSource(
  source: JobSource,
): Promise<DiscoveryCandidate[]> {
  if (!source.enabled || !source.discovery) {
    return [];
  }

  const sourceUrl = normalizeUrl(
    source.url,
    source.url,
  );

  if (!sourceUrl) {
    return [];
  }

  const queue: Array<{
    url: string;
    depth: number;
  }> = [
    {
      url: sourceUrl,
      depth: 0,
    },
  ];

  const visited = new Set<string>();
  const candidateUrls = new Set<string>();

  const candidates: DiscoveryCandidate[] = [];

  let pagesProcessed = 0;

  while (
    queue.length > 0 &&
    pagesProcessed < MAX_PAGES_PER_SOURCE &&
    candidates.length < MAX_CANDIDATES_PER_SOURCE
  ) {
    const current = queue.shift();

    if (!current) {
      break;
    }

    if (visited.has(current.url)) {
      continue;
    }

    visited.add(current.url);

    if (isBlockedUrl(current.url)) {
      continue;
    }

    let html: string;

    try {
      html = await fetchText(current.url);
    } catch (error) {
      console.warn(
        `[SARJOM] Discovery failed: ${current.url}`,
        error instanceof Error
          ? error.message
          : String(error),
      );

      continue;
    }

    pagesProcessed++;

    if (!html) {
      continue;
    }

    const links = extractLinks(
      html,
      current.url,
    );

    for (const link of links) {
      if (candidateUrls.has(link.url)) {
        continue;
      }

      candidateUrls.add(link.url);

      /*
       * Individual recruitment/job pages become candidates.
       */
      if (
        isLikelyJobCandidate(
          link.title,
          link.url,
        )
      ) {
        candidates.push(
          createCandidate(
            link,
            source,
            current.depth + 1,
          ),
        );

        if (
          candidates.length >=
          MAX_CANDIDATES_PER_SOURCE
        ) {
          break;
        }
      }

      /*
       * Relevant listing/category pages are crawled
       * one level deeper.
       */
      if (
        current.depth < MAX_CRAWL_DEPTH &&
        isSameDomain(link.url, sourceUrl) &&
        isLikelyDiscoveryPage(
          link.title,
          link.url,
        ) &&
        !visited.has(link.url)
      ) {
        queue.push({
          url: link.url,
          depth: current.depth + 1,
        });
      }
    }
  }

  return candidates;
}

export async function discoverFromSources(
  sources: JobSource[],
): Promise<DiscoveryCandidate[]> {
  const results: DiscoveryCandidate[] = [];

  const concurrency = 2;

  for (
    let start = 0;
    start < sources.length;
    start += concurrency
  ) {
    const batch = sources.slice(
      start,
      start + concurrency,
    );

    const batchResults = await Promise.allSettled(
      batch.map((source) =>
        discoverFromSource(source),
      ),
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      }
    }
  }

  return results;
}