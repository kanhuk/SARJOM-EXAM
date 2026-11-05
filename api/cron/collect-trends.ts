import {
  GOVERNMENT_SOURCES,
  type GovernmentSource,
} from '../../lib/government-sources.js';

import {
  FALLBACK_TRENDS,
  rankTrends,
  type TrendCategory,
  type TrendItem,
  type TrendSection,
  type NotificationType,
} from '../../lib/trends.js';

import { redis } from '../../lib/redis.js';

/**
 * SARJOM — Latest Notifications Intelligence Collector
 *
 * Main goals:
 * 1. Collect actionable items from configured government sources.
 * 2. Reject generic navigation pages and weak links.
 * 3. Classify section/subcategory/category/notification type.
 * 4. Avoid keeping stale scraped records forever.
 * 5. Run sources concurrently so Vercel does not wait on every source
 *    sequentially.
 */

const REDIS_KEY = 'sarjom:trends';
const REDIS_UPDATED_KEY = 'sarjom:trends:lastUpdated';

const MAX_ITEMS_TO_STORE = 100;
const MAX_LINKS_PER_SOURCE = 25;
const MAX_SOURCES_CONCURRENT = 8;
const FETCH_TIMEOUT_MS = 12000;
const EXISTING_ITEM_MAX_AGE_DAYS = 30;

const GENERIC_TITLES = new Set([
  'home',
  'homepage',
  'index',
  'main',
  'welcome',
  'login',
  'logout',
  'register',
  'registration',
  'contact',
  'contact us',
  'about',
  'about us',
  'privacy policy',
  'terms',
  'terms and conditions',
  'sitemap',
  'search',
  'search results',
  'menu',
  'dashboard',
  'download',
  'downloads',
  'advertisement',
  'advertisements',
  'notification',
  'notifications',
  'notice',
  'notices',
  'circular',
  'circulars',
  'recruitment',
  'recruitments',
  'recruitment calendar',
  'calendar',
  'latest news',
  'news',
  'news and events',
  'events',
  'archive',
  'archives',
  'result',
  'results',
  'admit card',
  'admit cards',
  'careers',
  'career',
  'tender',
  'tenders',
  'objection tracker',
  'objection',
  'feedback',
  'faqs',
  'faq',
  'annual report',
  'gallery',
  'photo gallery',
  'video gallery',
  'press release',
  'press releases',
]);

const NAVIGATION_WORDS = [
  'contact us',
  'about us',
  'privacy policy',
  'terms and conditions',
  'login',
  'sign in',
  'dashboard',
  'home page',
  'homepage',
  'feedback',
  'complaint registration',
  'grievance',
  'sitemap',
  'site map',
];

const RECRUITMENT_WORDS = [
  'recruitment',
  'vacancy',
  'vacancies',
  'appointment',
  'engagement',
  'selection',
  'job',
  'jobs',
  'employment',
  'staff',
  'post',
  'posts',
  'officer',
  'assistant',
  'clerk',
  'engineer',
  'teacher',
  'lecturer',
  'professor',
  'nurse',
  'constable',
  'inspector',
  'technician',
  'apprentice',
];

const EXAM_WORDS = [
  'examination',
  'exam',
  'entrance exam',
  'competitive examination',
  'test',
  'cgl',
  'chsl',
  'nda',
  'cds',
  'net',
  'neet',
  'jee',
  'cuet',
  'gate',
  'upsc',
  'ssc',
  'rrb',
  'ibps',
  'banking',
];

const RESULT_WORDS = [
  'result',
  'results',
  'merit list',
  'selection list',
  'provisional selection',
  'final selection',
  'score card',
  'scorecard',
  'cut off',
  'cutoff',
  'shortlisted',
  'selected candidates',
];

const ADMIT_CARD_WORDS = [
  'admit card',
  'hall ticket',
  'call letter',
  'e-admit',
  'download admit',
  'admission certificate',
];

const ANSWER_KEY_WORDS = [
  'answer key',
  'provisional answer key',
  'final answer key',
  'response sheet',
];

const APPLICATION_WORDS = [
  'apply',
  'application',
  'applications',
  'online application',
  'registration',
  'last date',
  'deadline',
  'extended',
  'extension',
  'apply online',
];

const SCHEME_WORDS = [
  'scheme',
  'yojana',
  'programme',
  'program',
  'benefit',
  'assistance',
  'subsidy',
  'financial assistance',
  'pension',
  'welfare',
];

const SCHOLARSHIP_WORDS = [
  'scholarship',
  'fellowship',
  'stipend',
  'student assistance',
  'post matric',
  'pre matric',
];

const ADMISSION_WORDS = [
  'admission',
  'allotment',
  'counselling',
  'counseling',
  'merit',
  'college admission',
  'university admission',
  'seat allotment',
  'spot admission',
];

const FARMER_WORDS = [
  'farmer',
  'farmers',
  'agriculture',
  'agricultural',
  'kharif',
  'rabi',
  'crop',
  'fasal',
  'insurance',
  'pm-kisan',
  'pm kisan',
  'pmfby',
  'kisaan',
];

const NOTIFICATION_WORDS = [
  'notification',
  'notice',
  'advertisement',
  'public notice',
  'official notice',
  'guidelines',
  'important notice',
  'corrigendum',
];

const ACTION_WORDS = [
  ...RECRUITMENT_WORDS,
  ...RESULT_WORDS,
  ...ADMIT_CARD_WORDS,
  ...ANSWER_KEY_WORDS,
  ...APPLICATION_WORDS,
  ...SCHOLARSHIP_WORDS,
  ...ADMISSION_WORDS,
  ...FARMER_WORDS,
  ...SCHEME_WORDS,
  ...EXAM_WORDS,
  ...NOTIFICATION_WORDS,
];

function cleanText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
}

function stripHtml(html: string): string {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  );
}

function normalizeTitle(title: string): string {
  return cleanText(title)
    .replace(/\s+/g, ' ')
    .trim();
}

function titleKey(title: string): string {
  return normalizeTitle(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function containsAny(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word.toLowerCase()));
}

function isGenericTitle(title: string): boolean {
  const normalized = titleKey(title);

  if (!normalized) return true;
  if (GENERIC_TITLES.has(normalized)) return true;
  if (normalized.length < 12) return true;

  return false;
}

function hasNavigationNoise(title: string): boolean {
  return containsAny(title, NAVIGATION_WORDS);
}

/**
 * Source keywords are useful, but a generic source keyword alone should not
 * turn a navigation page into a notification.
 */
function isStructuredDiscoverySource(source: GovernmentSource): boolean {
  return source.id === 'employment-news' || source.id === 'ncs';
}

function isNonNotificationTitle(title: string): boolean {
  const normalized = titleKey(title);

  const blockedExactTitles = new Set([
    'apply online',
    'online application',
    'application form',
    'download',
    'download now',
    'click here',
    'read more',
    'view details',
    'view more',
    'certificate of registration',
    'certificate of registration pop with pfrda',
    'attestation bio data form',
    'about computer based test',
    'about test practice centre',
    'additional faq',
  ]);

  if (blockedExactTitles.has(normalized)) {
    return true;
  }

  return containsAny(title, [
    'registration flow',
    'registration process',
    'employer registration',
    'jobseeker registration',
    'user registration',
    'career guidance',
    'success stories',
    'international jobseeker advisory',
    'advisories for international jobseeker',
    'staffing federation',
    'about us',
    'contact us',
    'privacy policy',
    'terms and conditions',
    'newsletter',
    'certificate of registration',
    'attestation & bio data form',
    'attestation and bio data form',
    'test practice centre',
    'about computer based test',
    'about test practice centre',
  ]);
}
function hasClearlyStaleYear(title: string): boolean {
  const currentYear = new Date().getFullYear();
  const years = title.match(/\b20\d{2}\b/g) ?? [];

  return years.some((year) => Number(year) < currentYear);
}

function isRelevantTitle(title: string, source: GovernmentSource): boolean {
  if (isGenericTitle(title)) return false;
  if (hasNavigationNoise(title)) return false;
  if (isNonNotificationTitle(title)) return false;

   if (isStructuredDiscoverySource(source)) {
  const normalized = titleKey(title);

  if (normalized.length < 15) {
    return false;
  }

  if (isNonNotificationTitle(title)) {
    return false;
  }

  /*
   * NCS contains many navigation and service pages.
   * Only accept titles that clearly describe an actual
   * employment opportunity, recruitment, vacancy, or hiring event.
   */
  if (source.id === 'ncs') {
    return containsAny(title, [
      'recruitment',
      'vacancy',
      'vacancies',
      'job vacancy',
      'government job',
      'government jobs',
      'employment opportunity',
      'career opportunity',
      'hiring',
      'walk-in interview',
      'walk in interview',
      'job fair',
      'recruitment drive',
      'selection',
      'appointment',
      'applications are invited',
      'application invited',
    ]);
  }

  /*
   * Employment News is a structured job-discovery source.
   * Require a concrete recruitment/opportunity phrase rather
   * than accepting generic "job", "jobs", or "apply" pages.
   */
  if (source.id === 'employment-news') {
    return containsAny(title, [
      'recruitment',
      'vacancy',
      'vacancies',
      'post of',
      'posts of',
      'position',
      'positions',
      'appointment',
      'engagement',
      'selection',
      'deputation',
      'walk-in interview',
      'walk in interview',
      'applications are invited',
      'application is invited',
      'empanelment',
      'employment opportunity',
      'career opportunity',
      'hiring',
      'contract basis',
    ]);
  }
} const lower = title.toLowerCase();

  const sourceMatch = source.keywords.some((keyword) =>
    lower.includes(keyword.toLowerCase()),
  );

  const actionMatch = containsAny(title, ACTION_WORDS);

  if (actionMatch) return true;

  if (sourceMatch && containsAny(title, [
    'notification',
    'notice',
    'advertisement',
    'circular',
    'recruitment',
    'vacancy',
    'exam',
    'examination',
    'result',
    'admit',
    'application',
    'scheme',
    'scholarship',
    'admission',
    'allotment',
    'corrigendum',
  ])) {
    return true;
  }

  return false;
}

function detectCategory(
  source: GovernmentSource,
  title: string,
): TrendCategory {
  if (containsAny(title, RESULT_WORDS)) return 'result';
  if (containsAny(title, ANSWER_KEY_WORDS)) return 'exam';
  if (containsAny(title, ADMIT_CARD_WORDS)) return 'exam';
  if (containsAny(title, SCHOLARSHIP_WORDS)) return 'scholarship';
  if (containsAny(title, ADMISSION_WORDS)) return 'admission';
  if (containsAny(title, FARMER_WORDS)) return 'farmer';

  if (containsAny(title, RECRUITMENT_WORDS)) {
    if (source.category === 'banking') return 'banking';
    if (source.category === 'railway') return 'railway';
    if (source.category === 'defence') return 'defence';
    if (source.category === 'police') return 'police';
    if (source.category === 'scientific') return 'scientific';
    if (source.category === 'teaching') return 'teaching';
    return 'jobs';
  }

  if (containsAny(title, SCHEME_WORDS)) return 'scheme';
  if (containsAny(title, EXAM_WORDS)) return 'exam';
  if (containsAny(title, NOTIFICATION_WORDS)) return 'notification';

  return source.category;
}

function detectSection(source: GovernmentSource): TrendSection {
  return source.section;
}

function detectSubcategory(source: GovernmentSource): string {
  return source.subcategory;
}

function detectNotificationType(
  title: string,
  category: TrendCategory,
): NotificationType {
  if (containsAny(title, RESULT_WORDS)) return 'result';
  if (containsAny(title, ANSWER_KEY_WORDS)) return 'answer-key';
  if (containsAny(title, ADMIT_CARD_WORDS)) return 'admit-card';

  if (containsAny(title, ADMISSION_WORDS)) {
    const lower = title.toLowerCase();
    if (lower.includes('allotment')) return 'allotment';
    if (lower.includes('counselling') || lower.includes('counseling')) {
      return 'counselling';
    }
    return 'admission';
  }

  if (containsAny(title, SCHOLARSHIP_WORDS)) return 'scholarship';
  if (containsAny(title, FARMER_WORDS)) return 'farmer';
  if (containsAny(title, APPLICATION_WORDS)) return 'application';
  if (containsAny(title, RECRUITMENT_WORDS)) return 'recruitment';
  if (category === 'scheme') return 'scheme';
  if (category === 'notification') return 'notification';
  if (category === 'exam') return 'exam';
  if (category === 'result') return 'result';

  return 'other';
}

function categoryEmoji(category: TrendCategory): string {
  switch (category) {
    case 'jobs': return '💼';
    case 'banking': return '🏦';
    case 'railway': return '🚆';
    case 'defence': return '🪖';
    case 'police': return '👮';
    case 'scientific': return '🔬';
    case 'teaching': return '👨‍🏫';
    case 'exam': return '📝';
    case 'result': return '🏆';
    case 'scheme': return '🏛️';
    case 'scholarship': return '📚';
    case 'admission': return '🎓';
    case 'farmer': return '🌾';
    case 'health': return '🏥';
    case 'education': return '📖';
    case 'notification': return '📢';
    default: return '📌';
  }
}

function basePriority(
  category: TrendCategory,
  title: string,
  source: GovernmentSource,
): number {
  let score = 40;

  const categoryBoosts: Partial<Record<TrendCategory, number>> = {
    jobs: 20,
    banking: 20,
    railway: 20,
    defence: 20,
    police: 19,
    scientific: 17,
    teaching: 17,
    exam: 18,
    result: 18,
    admission: 16,
    scholarship: 16,
    farmer: 15,
    scheme: 14,
    notification: 10,
  };

  score += categoryBoosts[category] ?? 0;

  if (containsAny(title, APPLICATION_WORDS)) score += 8;
  if (containsAny(title, [
    'last date',
    'deadline',
    'closing date',
    'exam date',
    'important dates',
    'extended',
    'corrigendum',
  ])) {
    score += 8;
  }

  if (source.state === 'Odisha') score += 5;

  return Math.min(95, score);
}

function extractDeadline(text: string): string | undefined {
  const patterns = [
    /(?:last date|deadline|closing date|last date for application)[^\d]{0,60}(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
    /(?:last date|deadline|closing date)[^\d]{0,60}(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i,
    /(?:last date|deadline|closing date)[^\d]{0,60}((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;

    const parsed = new Date(match[1]);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return undefined;
}
function extractPublicationDate(text: string): string | undefined {
  const patterns = [
    /(?:published(?: on)?|publication date|date of publication|issued(?: on)?|dated|notice date|advertisement date)[^\d]{0,60}(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
    /(?:published(?: on)?|publication date|date of publication|issued(?: on)?|dated|notice date|advertisement date)[^\d]{0,60}(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i,
    /(?:published(?: on)?|publication date|date of publication|issued(?: on)?|dated|notice date|advertisement date)[^\d]{0,60}((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (!match?.[1]) continue;

    const parsed = new Date(match[1]);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return undefined;
}

function extractDateFromUrl(url: string): string | undefined {
  if (!url) return undefined;

  const candidates: string[] = [];

  // DDMMYYYY embedded in a filename or numeric ID.
  // Example: 17032023126565 -> 2023-03-17
  for (const match of url.matchAll(/(\d{2})(\d{2})(20\d{2})/g)) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      candidates.push(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      );
    }
  }

  // YYYYMMDD embedded in a filename or numeric ID.
  for (const match of url.matchAll(/(20\d{2})(\d{2})(\d{2})/g)) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      candidates.push(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      );
    }
  }

  // YYYY-MM-DD / YYYY_MM_DD / YYYY.MM.DD
  for (const match of url.matchAll(
    /(20\d{2})[-_.](\d{1,2})[-_.](\d{1,2})/g,
  )) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      candidates.push(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      );
    }
  }

  // DD-MM-YYYY / DD_MM_YYYY / DD.MM.YYYY
  for (const match of url.matchAll(
    /(\d{1,2})[-_.](\d{1,2})[-_.](20\d{2})/g,
  )) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      candidates.push(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      );
    }
  }

  for (const candidate of candidates) {
    const parsed = new Date(candidate);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return undefined;
}
function isOlderThanLimit(dateString: string | undefined): boolean {
  if (!dateString) return false;

  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) return false;

  const ageDays = (Date.now() - timestamp) / 86400000;
  return ageDays > 180;
}

function makeId(
  source: GovernmentSource,
  title: string,
  url: string,
): string {
  const value = `${source.id}|${titleKey(title)}|${url}`;

  return `${source.id}-${Buffer.from(value)
    .toString('base64url')
    .slice(0, 32)}`;
}

function extractLinks(
  html: string,
  source: GovernmentSource,
): TrendItem[] {
  const results: TrendItem[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  let scanned = 0;

  while ((match = anchorRegex.exec(html)) !== null) {
    scanned++;

    if (scanned > MAX_LINKS_PER_SOURCE * 20) break;

    const rawUrl = match[1];
    const title = normalizeTitle(stripHtml(match[2]));

    if (!isRelevantTitle(title, source)) continue;

    let absoluteUrl: string;

    try {
      absoluteUrl = new URL(rawUrl, source.url).href;
    } catch {
      continue;
    }

    if (!/^https?:\/\//i.test(absoluteUrl)) continue;

    const normalizedUrl = absoluteUrl.split('#')[0].trim();
    const normalizedTitle = titleKey(title);

    if (!normalizedUrl || !normalizedTitle) continue;
    if (seenUrls.has(normalizedUrl)) continue;
    if (seenTitles.has(normalizedTitle)) continue;

    seenUrls.add(normalizedUrl);
    seenTitles.add(normalizedTitle);

    const category = detectCategory(source, title);
    const section = detectSection(source);
    const subcategory = detectSubcategory(source);
    const notificationType = detectNotificationType(title, category);

    /*
     * Extract deadline from the title only. We deliberately do not pretend
     * that the source page's fetch time is its publication date.
     */
    const deadline = extractDeadline(title);
    const publishedAt =
      extractPublicationDate(title) ??
      extractDateFromUrl(normalizedUrl);

    const item: TrendItem = {
      id: makeId(source, title, normalizedUrl),
      title,
      shortTitle:
        title.length > 90 ? `${title.slice(0, 87)}...` : title,
      category,
      section,
      subcategory,
      notificationType,
      emoji: categoryEmoji(category),
      url: normalizedUrl,
      source: source.name,
      organization: source.organization,
      level: source.level,
      state: source.state,
      deadline,
      publishedAt,
      status: deadline ? 'open' : 'new',
      priority: basePriority(category, title, source),
      keywords: source.keywords,
      officialSource: true,
      verified: false,
      collectedAt: new Date().toISOString(),
    };

    results.push(item);

    if (results.length >= MAX_LINKS_PER_SOURCE) break;
  }

  return results;
}

async function fetchSource(
  source: GovernmentSource,
): Promise<TrendItem[]> {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT_MS,
  );

  try {
    const response = await fetch(source.url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SARJOM-Government-Intelligence/3.0)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    if (!html || html.length < 100) return [];

    return extractLinks(html, source);
  } finally {
    clearTimeout(timer);
  }
}

function isValidTrend(item: TrendItem): boolean {
  if (!item.id || !item.title || !item.url || !item.source) {
    return false;
  }

  if (isGenericTitle(item.title)) return false;
  if (hasNavigationNoise(item.title)) return false;
  if (isNonNotificationTitle(item.title)) return false;

  if (!/^https?:\/\//i.test(item.url)) return false;
  if (!item.section) return false;
  if (!item.subcategory) return false;

  /*
   * Reject clearly old notifications.
   *
   * A current deadline must NOT automatically make a clearly
   * old document valid. This prevents old PDFs from surviving
   * simply because a deadline was extracted incorrectly.
   */
  if (hasClearlyStaleYear(item.title)) {
    return false;
  }

  if (item.publishedAt && isOlderThanLimit(item.publishedAt)) {
    return false;
  }

  return true;
}
function isFreshExistingItem(item: TrendItem): boolean {
  if (!item.collectedAt) return false;

  const timestamp = Date.parse(item.collectedAt);
  if (Number.isNaN(timestamp)) return false;

  const ageMs = Date.now() - timestamp;
  const maxAgeMs =
    EXISTING_ITEM_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  if (!(ageMs >= 0 && ageMs <= maxAgeMs)) return false;

  if (isNonNotificationTitle(item.title)) return false;
  if (hasClearlyStaleYear(item.title) && !item.deadline) return false;

  if (item.publishedAt && isOlderThanLimit(item.publishedAt) && !item.deadline) {
    return false;
  }

  return true;
}

function deduplicate(items: TrendItem[]): TrendItem[] {
  const byUrl = new Map<string, TrendItem>();
  const byTitle = new Map<string, TrendItem>();

  for (const item of items) {
    if (!isValidTrend(item)) continue;

    const url = item.url.split('#')[0].trim();
    const existing = byUrl.get(url);

    if (
      !existing ||
      item.priority > existing.priority ||
      (item.priority === existing.priority &&
        Date.parse(item.collectedAt ?? '') >
          Date.parse(existing.collectedAt ?? ''))
    ) {
      byUrl.set(url, item);
    }
  }

  for (const item of byUrl.values()) {
    const key = titleKey(item.title);
    const existing = byTitle.get(key);

    if (
      !existing ||
      item.priority > existing.priority ||
      (item.priority === existing.priority &&
        Date.parse(item.collectedAt ?? '') >
          Date.parse(existing.collectedAt ?? ''))
    ) {
      byTitle.set(key, item);
    }
  }

  return Array.from(byTitle.values());
}

function buildCategoryCounts(
  items: TrendItem[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  return counts;
}

function buildSectionCounts(
  items: TrendItem[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const item of items) {
    const section = item.section || 'other';
    counts[section] = (counts[section] || 0) + 1;
  }

  return counts;
}

function getFreshExistingItems(
  items: TrendItem[],
): TrendItem[] {
  return items.filter(isFreshExistingItem);
}

async function collectSources(
  sources: GovernmentSource[],
  diagnostics: {
    sourcesAttempted: number;
    sourcesSuccessful: number;
    sourcesFailed: number;
    sourceResults: Array<{
      source: string;
      section: string;
      subcategory: string;
      collected: number;
      error?: string;
    }>;
  },
): Promise<TrendItem[]> {
  const collected: TrendItem[] = [];

  /*
   * Process sources in small concurrent batches. This is considerably faster
   * than waiting 12 seconds for each source one after another, while avoiding
   * an uncontrolled request burst.
   */
  for (
    let start = 0;
    start < sources.length;
    start += MAX_SOURCES_CONCURRENT
  ) {
    const batch = sources.slice(
      start,
      start + MAX_SOURCES_CONCURRENT,
    );

    diagnostics.sourcesAttempted += batch.length;

    const results = await Promise.allSettled(
      batch.map((source) => fetchSource(source)),
    );

    results.forEach((result, index) => {
      const source = batch[index];

      if (result.status === 'fulfilled') {
        diagnostics.sourcesSuccessful++;
        collected.push(...result.value);

        diagnostics.sourceResults.push({
          source: source.name,
          section: source.section,
          subcategory: source.subcategory,
          collected: result.value.length,
        });
      } else {
        diagnostics.sourcesFailed++;

        diagnostics.sourceResults.push({
          source: source.name,
          section: source.section,
          subcategory: source.subcategory,
          collected: 0,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    });
  }

  return collected;
}

export default async function handler(
  req: any,
  res: any,
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  const cronSecret = process.env.CRON_SECRET;
  const authorization = req.headers?.authorization || '';

  if (
    cronSecret &&
    authorization !== `Bearer ${cronSecret}`
  ) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (!redis) {
    return res.status(503).json({
      success: false,
      error: 'Persistent storage is not configured.',
      required: [
        'UPSTASH_REDIS_REST_URL',
        'UPSTASH_REDIS_REST_TOKEN',
      ],
    });
  }

  const startedAt = Date.now();

  const sources = GOVERNMENT_SOURCES.filter(
    (source) => source.enabled,
  );

  const diagnostics = {
    sourcesConfigured: sources.length,
    sourcesAttempted: 0,
    sourcesSuccessful: 0,
    sourcesFailed: 0,
    itemsCollected: 0,
    sourceResults: [] as Array<{
      source: string;
      section: string;
      subcategory: string;
      collected: number;
      error?: string;
    }>,
  };

  let collected: TrendItem[] = [];

  try {
    collected = await collectSources(
      sources,
      diagnostics,
    );
  } catch (error) {
    console.error(
      '[SARJOM] Collector error:',
      error,
    );
  }

  diagnostics.itemsCollected = collected.length;

  let existing: TrendItem[] = [];

  try {
    const stored = await redis.get<TrendItem[]>(
      REDIS_KEY,
    );

    if (Array.isArray(stored)) {
      existing = getFreshExistingItems(stored);
    }
  } catch (error) {
    console.error(
      '[SARJOM] Redis read error:',
      error,
    );
  }

  /*
   * Important:
   * Do NOT merge the entire historical Redis feed forever.
   * Only fresh existing records are retained.
   * Fallback records are retained separately.
   */
  const merged = deduplicate([
    ...FALLBACK_TRENDS,
    ...existing,
    ...collected,
  ]);

  const ranked = rankTrends(merged)
    .filter((item) => item.status !== 'expired')
    .slice(0, MAX_ITEMS_TO_STORE);

  await redis.set(
    REDIS_KEY,
    ranked,
  );

  const updatedAt = new Date().toISOString();

  await redis.set(
    REDIS_UPDATED_KEY,
    updatedAt,
  );

  const categoryCounts = buildCategoryCounts(
    ranked,
  );

  const sectionCounts = buildSectionCounts(
    ranked,
  );

  return res.status(200).json({
    success: true,
    updatedAt,
    durationMs: Date.now() - startedAt,
    collected: collected.length,
    existing: existing.length,
    stored: ranked.length,
    persistentStore: true,
    categoryCounts,
    sectionCounts,
    top: ranked.slice(0, 10),
    diagnostics,
  });
}