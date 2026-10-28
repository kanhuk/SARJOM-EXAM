export interface OfficialNotificationDocument {
  title: string;
  url: string;
  type:
    | 'notification'
    | 'advertisement'
    | 'reopen-notification'
    | 'application'
    | 'other';
  official: boolean;
  score: number;
  reasons: string[];
}

export interface OfficialNotificationExtractionResult {
  found: boolean;
  sourceUrl: string;
  officialDomain?: string;
  documents: OfficialNotificationDocument[];
}

/**
 * Domains that are commonly used by Indian government organisations.
 *
 * This is intentionally conservative. A URL is considered official only
 * when its hostname matches one of these patterns or the supplied
 * organization domain.
 */
const GOVERNMENT_DOMAIN_PATTERNS = [
  /\.gov\.in$/i,
  /\.nic\.in$/i,
  /\.ac\.in$/i,
  /\.edu\.in$/i,
  /\.res\.in$/i,
];

/**
 * Fetch HTML from a source article.
 */
async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch article: HTTP ${response.status}`,
    );
  }

  return await response.text();
}

/**
 * Decode common HTML entities.
 */
function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#47;/gi, '/')
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/gi, "'");
}

/**
 * Convert relative URLs to absolute URLs.
 */
function resolveUrl(
  href: string,
  sourceUrl: string,
): string | null {
  try {
    return new URL(href, sourceUrl).toString();
  } catch {
    return null;
  }
}

/**
 * Determine whether a URL points to an official Indian
 * government / academic organisation.
 */
function isOfficialDomain(
  url: string,
  organizationDomain?: string,
): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (
      organizationDomain &&
      hostname.includes(
        organizationDomain.toLowerCase(),
      )
    ) {
      return true;
    }

    return GOVERNMENT_DOMAIN_PATTERNS.some(
      pattern => pattern.test(hostname),
    );
  } catch {
    return false;
  }
}

/**
 * Determine document type from visible link text.
 */
function detectType(
  text: string,
  url: string,
): OfficialNotificationDocument['type'] {
  const value = text.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (
    value.includes('reopen') &&
    value.includes('notification')
  ) {
    return 'reopen-notification';
  }

  if (
    value.includes('official notification') ||
    value.includes('notification pdf') ||
    value.includes('detailed notification') ||
    value.includes('detailed notice') ||
    value.includes('recruitment notification')
  ) {
    return 'notification';
  }

  if (
    value.includes('advertisement') ||
    value.includes('advt')
  ) {
    return 'advertisement';
  }

  if (
    lowerUrl.includes('.pdf') &&
    (
      value.includes('download pdf') ||
      value.includes('download')
    )
  ) {
    return 'notification';
  }

  if (
    value.includes('apply online') ||
    value.includes('application')
  ) {
    return 'application';
  }

  return 'other';
}/**
 * Score a candidate official document.
 */
function scoreDocument(
  text: string,
  url: string,
): {
  score: number;
  reasons: string[];
} {
  const value = text.toLowerCase();
  const lowerUrl = url.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  if (
    value.includes('official notification pdf')
  ) {
    score += 60;
    reasons.push(
      'explicit official notification PDF link',
    );
  } else if (
    value.includes('notification pdf')
  ) {
    score += 50;
    reasons.push(
      'notification PDF link',
    );
  } else if (
    value.includes('notification')
  ) {
    score += 35;
    reasons.push(
      'notification link',
    );
  }

  if (value.includes('advertisement')) {
    score += 20;
    reasons.push('advertisement signal');
  }

  if (value.includes('reopen')) {
    score += 15;
    reasons.push('reopen notification signal');
  }

  if (
    value.includes('download pdf') ||
    value.includes('download')
  ) {
    score += 10;
    reasons.push('download link');
  }

  if (lowerUrl.endsWith('.pdf')) {
    score += 20;
    reasons.push('PDF URL');
  }

  return {
    score: Math.min(score, 100),
    reasons,
  };
}

/**
 * Extract official notification documents from an article.
 *
 * The extractor intentionally examines the link text as well as
 * the href. This is important because FreeJobAlert labels links
 * such as:
 *
 * "Official Notification PDF (Civil - 28/2025)"
 *
 * while the actual href points directly to the government site.
 */
export async function extractOfficialNotifications(
  sourceUrl: string,
  organizationDomain?: string,
): Promise<OfficialNotificationExtractionResult> {
  const html = await fetchHtml(sourceUrl);

  const documents: OfficialNotificationDocument[] =
    [];

  /**
   * Capture anchor tags.
   *
   * This intentionally handles attributes appearing in
   * different orders.
   */
  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) !== null) {
    const rawHref = decodeHtml(match[1]);
    const rawContent = match[2];

    const text = decodeHtml(
      rawContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    );

    if (!rawHref || !text) {
      continue;
    }

    const absoluteUrl = resolveUrl(
      rawHref,
      sourceUrl,
    );

    if (!absoluteUrl) {
      continue;
    }

    /**
     * We are specifically interested in links that look
     * like notification / recruitment documents.
     */
    const lowerText = text.toLowerCase();

    const relevant =
      lowerText.includes('notification') ||
      lowerText.includes('advertisement') ||
      lowerText.includes('reopen') ||
      lowerText.includes('download pdf') ||
      lowerText.includes('detailed notice') ||
      lowerText.includes('advt');

    if (!relevant) {
      continue;
    }

      if (
      !isOfficialDomain(
        absoluteUrl,
        organizationDomain,
      )
    ) {
      continue;
    }

    /*
     * Only keep actual PDF documents.
     *
     * Recruitment/notification webpages are useful for
     * discovery, but they are not notification documents.
     */
    const isPdf =
      /\.pdf(?:[?#].*)?$/i.test(
        absoluteUrl,
      );

    if (!isPdf) {
      continue;
    }

    const type = detectType(
      text,
      absoluteUrl,
    );
    const {
      score,
      reasons,
    } = scoreDocument(
      text,
      absoluteUrl,
    );

    documents.push({
      title: text,
      url: absoluteUrl,
      type,
      official: true,
      score,
      reasons,
    });
  }

  /**
   * Remove duplicate URLs while keeping the highest score.
   */
  const unique = new Map<
    string,
    OfficialNotificationDocument
  >();

  for (const document of documents) {
    const existing = unique.get(document.url);

    if (
      !existing ||
      document.score > existing.score
    ) {
      unique.set(
        document.url,
        document,
      );
    }
  }

  const sorted = Array.from(
    unique.values(),
  ).sort(
    (a, b) => b.score - a.score,
  );

  let officialDomain: string | undefined;

  if (sorted.length > 0) {
    try {
      officialDomain =
        new URL(sorted[0].url).hostname;
    } catch {
      // Ignore invalid URL.
    }
  }

  return {
    found: sorted.length > 0,
    sourceUrl,
    officialDomain,
    documents: sorted,
  };
}