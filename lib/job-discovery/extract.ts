import type { DiscoveryCandidate } from './discover.js';

export interface JobRecord {
  id: string;

  title: string;
  organization?: string;

  postNames: string[];
  vacancies?: number;

  jobType?: string;
  sector?: string;
  location?: string;

  qualification?: string;
  experience?: string;
  ageLimit?: string;
  salary?: string;

  applicationStartDate?: string;
  applicationLastDate?: string;
  examDate?: string;

  applicationMode?: string;

  officialNotificationUrl?: string;
  officialApplyUrl?: string;

  sourceUrl: string;
  sourceId: string;
  sourceName: string;

  publishedAt?: string;

  extractedAt: string;

  confidence: number;
}

const REQUEST_TIMEOUT_MS = 15000;
const MAX_RESPONSE_BYTES = 3_000_000;

const SOURCE_DOMAINS_TO_REJECT_AS_OFFICIAL = [
  'freejobalert.com',
  'naukri.com',
  'indeed.com',
  'sarkariresult.com',
  'sarkariexam.com',
];

const NOISE_PATTERNS = [
  /related articles/gi,
  /get job alerts/gi,
  /tell us your qualification/gi,
  /share\s*:/gi,
  /facebook/gi,
  /twitter/gi,
  /whatsapp/gi,
  /telegram/gi,
  /subscribe/gi,
  /newsletter/gi,
  /advertisement/gi,
  /read more/gi,
];

const KNOWN_ORGANIZATIONS: Array<{
  name: string;
  patterns: RegExp[];
}> = [
  {
    name: 'Union Public Service Commission',
    patterns: [
      /\bUPSC\b/i,
      /union public service commission/i,
    ],
  },
  {
    name: 'Staff Selection Commission',
    patterns: [
      /\bSSC\b/i,
      /staff selection commission/i,
    ],
  },
  {
    name: 'Railway Recruitment Board',
    patterns: [
      /\bRRB\b/i,
      /railway recruitment board/i,
    ],
  },
  {
    name: 'State Bank of India',
    patterns: [
      /\bSBI\b/i,
      /state bank of india/i,
    ],
  },
  {
    name: 'National Thermal Power Corporation',
    patterns: [
      /\bNTPC\b/i,
      /national thermal power corporation/i,
    ],
  },
  {
    name: 'Indian Space Research Organisation',
    patterns: [
      /\bISRO\b/i,
      /indian space research organisation/i,
    ],
  },
  {
    name: 'Airports Authority of India',
    patterns: [
      /\bAAI\b/i,
      /airports authority of india/i,
    ],
  },
  {
    name: 'Punjab National Bank',
    patterns: [
      /\bPNB\b/i,
      /punjab national bank/i,
    ],
  },
  {
    name: 'Bharat Petroleum Corporation Limited',
    patterns: [
      /\bBPCL\b/i,
      /bharat petroleum corporation/i,
    ],
  },
  {
    name: 'Indian Overseas Bank',
    patterns: [
      /\bIOB\b/i,
      /indian overseas bank/i,
    ],
  },
  {
    name: 'Integral Coach Factory',
    patterns: [
      /\bICF\b/i,
      /integral coach factory/i,
    ],
  },
  {
    name: 'NABCONS',
    patterns: [
      /\bNABCONS\b/i,
    ],
  },
  {
    name: 'NABFINS',
    patterns: [
      /\bNABFINS\b/i,
    ],
  },
  {
    name: 'NGEL',
    patterns: [
      /\bNGEL\b/i,
    ],
  },
  {
    name: 'DGQA',
    patterns: [
      /\bDGQA\b/i,
    ],
  },
];

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(
  value: string,
): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtml(
  value: string,
): string {
  return decodeHtmlEntities(
    value
      .replace(
        /<script\b[^>]*>[\s\S]*?<\/script>/gi,
        ' ',
      )
      .replace(
        /<style\b[^>]*>[\s\S]*?<\/style>/gi,
        ' ',
      )
      .replace(
        /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
        ' ',
      )
      .replace(
        /<svg\b[^>]*>[\s\S]*?<\/svg>/gi,
        ' ',
      )
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  );
}

function cleanText(
  value: string,
): string {
  let result = stripHtml(value);

  for (const pattern of NOISE_PATTERNS) {
    result = result.replace(pattern, ' ');
  }

  return normalizeWhitespace(result);
}

function cleanLine(
  value: string,
): string {
  return normalizeWhitespace(
    decodeHtmlEntities(value)
      .replace(/<[^>]+>/g, ' '),
  );
}

async function fetchHtml(
  url: string,
): Promise<string> {
  const controller = new AbortController();

  const timer = setTimeout(
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
          'SARJOM-JobExtractor/1.0 (+https://sarjom-backend.vercel.app)',
      },
      signal: controller.signal,
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
      !contentType.includes(
        'application/xhtml+xml',
      )
    ) {
      return '';
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
        'Response exceeds maximum allowed size',
      );
    }

    const html =
      await response.text();

    const bytes =
      new TextEncoder()
        .encode(html)
        .byteLength;

    if (bytes > MAX_RESPONSE_BYTES) {
      throw new Error(
        'Response exceeds maximum allowed size',
      );
    }

    return html;
  } finally {
    clearTimeout(timer);
  }
}

function extractPageTitle(
  html: string,
): string | undefined {
  const match = html.match(
    /<title\b[^>]*>([\s\S]*?)<\/title>/i,
  );

  if (!match?.[1]) {
    return undefined;
  }

  const title = cleanText(
    match[1],
  );

  return title || undefined;
}

function extractMainText(
  html: string,
): string {
  const bodyMatch =
    html.match(
      /<body\b[^>]*>([\s\S]*?)<\/body>/i,
    );

  const body =
    bodyMatch?.[1] ?? html;

  return cleanText(body);
}

function extractLines(
  html: string,
): string[] {
  const bodyMatch =
    html.match(
      /<body\b[^>]*>([\s\S]*?)<\/body>/i,
    );

  const body =
    bodyMatch?.[1] ?? html;

  const roughLines =
    body
      .replace(
        /<script\b[^>]*>[\s\S]*?<\/script>/gi,
        '\n',
      )
      .replace(
        /<style\b[^>]*>[\s\S]*?<\/style>/gi,
        '\n',
      )
      .replace(
        /<(?:br|\/p|\/div|\/li|\/tr|\/td|\/th)[^>]*>/gi,
        '\n',
      )
      .replace(
        /<[^>]+>/g,
        ' ',
      )
      .split(/\n+/);

  return roughLines
    .map(cleanLine)
    .filter(
      (line) =>
        line.length >= 3,
    );
}

function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
}

function findFirst(
  text: string,
  patterns: RegExp[],
): string | undefined {
  for (const pattern of patterns) {
    const match =
      text.match(pattern);

    if (match?.[1]) {
      const value =
        normalizeWhitespace(
          match[1],
        );

      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

function cleanFieldValue(
  value: string | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned =
    cleanText(value)
      .replace(
        /^(?:[:\-–—|]\s*)+/,
        '',
      )
      .trim();

  if (
    cleaned.length < 2 ||
    cleaned.length > 1000
  ) {
    return undefined;
  }

  return cleaned;
}
function extractOrganization(
  title: string,
  text: string,
): string | undefined {
  /*
   * IMPORTANT:
   * Do not search the entire article for organization names.
   *
   * Aggregator articles contain Related Articles, recommendations,
   * advertisements and cross-links to other organizations.
   *
   * Therefore organization detection must prioritize:
   *
   * 1. Explicit organization label
   * 2. Title
   * 3. URL
   * 4. Very beginning of article
   *
   * Never use the entire article as the primary organization source.
   */

  const explicit =
    findFirst(text.slice(0, 12000), [
      /\borganization\s*[:=-]\s*([^|]{3,180})/i,
      /\borganisation\s*[:=-]\s*([^|]{3,180})/i,
      /\brecruiting\s+organization\s*[:=-]\s*([^|]{3,180})/i,
      /\brecruiting\s+authority\s*[:=-]\s*([^|]{3,180})/i,
      /\brecruiting\s+body\s*[:=-]\s*([^|]{3,180})/i,
    ]);

  if (explicit) {
    const cleaned =
      cleanFieldValue(explicit);

    if (cleaned) {
      return cleaned;
    }
  }

  /*
   * Strongest signal: title.
   */
  const titleLower =
    title.toLowerCase();

  const titleMatches =
    KNOWN_ORGANIZATIONS.filter(
      (organization) =>
        organization.patterns.some(
          (pattern) =>
            pattern.test(title),
        ),
    );

  if (titleMatches.length > 0) {
    /*
     * Prefer the longest/more specific organization
     * match if multiple patterns happen to match.
     */
    return titleMatches
      .sort(
        (a, b) =>
          b.name.length -
          a.name.length,
      )[0]
      .name;
  }

  /*
   * URL is another strong signal.
   */
  const urlSource =
    text.slice(0, 3000);

  for (
    const organization
    of KNOWN_ORGANIZATIONS
  ) {
    if (
      organization.patterns.some(
        (pattern) =>
          pattern.test(
            urlSource,
          ),
      )
    ) {
      return organization.name;
    }
  }

  /*
   * Only inspect the beginning of the article.
   *
   * FreeJobAlert and similar aggregators place the actual
   * job description near the beginning, while Related Articles
   * and recommendations usually appear later.
   */
  const articleOpening =
    text.slice(0, 8000);

  const openingMatches =
    KNOWN_ORGANIZATIONS.filter(
      (organization) =>
        organization.patterns.some(
          (pattern) =>
            pattern.test(
              articleOpening,
            ),
        ),
    );

  if (openingMatches.length === 1) {
    return openingMatches[0].name;
  }

  /*
   * If several organizations appear in the opening,
   * do NOT guess.
   *
   * Returning undefined is safer than assigning the
   * wrong organization.
   */
  if (
    openingMatches.length > 1
  ) {
    /*
     * Try a very specific labeled sentence before giving up.
     */
    const sentence =
      articleOpening.match(
        /(?:organization|organisation|recruiting authority|recruiting body|department)\s+(?:is|:|-)\s*([^.!?]{3,180})/i,
      );

    if (sentence?.[1]) {
      return cleanFieldValue(
        sentence[1],
      );
    }

    return undefined;
  }

  return undefined;
}

  
function extractVacancyCandidates(
  title: string,
  text: string,
): number[] {
  const values: number[] = [];

  const add =
    (raw: string) => {
      const value =
        Number(
          raw.replace(/,/g, ''),
        );

      if (
        Number.isFinite(value) &&
        value > 0 &&
        value <= 1_000_000
      ) {
        values.push(value);
      }
    };

  const titlePatterns = [
    /\b(\d{1,6}(?:,\d{3})*)\s+(?:posts?|vacancies?|positions?|openings?)\b/i,
    /\b(\d{1,6}(?:,\d{3})*)\s+[A-Za-z][A-Za-z &/-]*(?:Online|Offline)\s+Form\b/i,
  ];

  for (
    const pattern
    of titlePatterns
  ) {
    const match =
      title.match(pattern);

    if (match?.[1]) {
      add(match[1]);
    }
  }

  const bodyPatterns = [
    /\btotal\s+(?:number\s+of\s+)?vacancies?\s*[:=-]?\s*(\d{1,6}(?:,\d{3})*)\b/gi,

    /\btotal\s+(?:number\s+of\s+)?posts?\s*[:=-]?\s*(\d{1,6}(?:,\d{3})*)\b/gi,

    /\b(\d{1,6}(?:,\d{3})*)\s+(?:posts?|vacancies?|positions?)\b/gi,

    /\bno\.?\s+of\s+(?:posts?|vacancies?|positions?)\s*[:=-]?\s*(\d{1,6}(?:,\d{3})*)\b/gi,
  ];

  for (
    const pattern
    of bodyPatterns
  ) {
    for (
      const match
      of text.matchAll(pattern)
    ) {
      if (match[1]) {
        add(match[1]);
      }
    }
  }

  return Array.from(
    new Set(values),
  );
}

function extractVacancies(
  title: string,
  text: string,
): number | undefined {
  const titleMatch =
    title.match(
      /\b(\d{1,6}(?:,\d{3})*)\s+(?:posts?|vacancies?|positions?|openings?)\b/i,
    );

  if (titleMatch?.[1]) {
    const value =
      Number(
        titleMatch[1]
          .replace(/,/g, ''),
      );

    if (
      Number.isFinite(value) &&
      value > 0
    ) {
      return value;
    }
  }

  const labeled =
    text.match(
      /\btotal\s+(?:number\s+of\s+)?(?:vacancies?|posts?|positions?)\s*[:=-]?\s*(\d{1,6}(?:,\d{3})*)\b/i,
    );

  if (labeled?.[1]) {
    const value =
      Number(
        labeled[1]
          .replace(/,/g, ''),
      );

    if (
      Number.isFinite(value) &&
      value > 0
    ) {
      return value;
    }
  }

  const candidates =
    extractVacancyCandidates(
      title,
      text,
    );

  return candidates[0];
}

function cleanPostCandidate(
  value: string,
): string | undefined {
  let result =
    cleanText(value);

  result =
    result
      .replace(
        /^[-:–—\s]+/,
        '',
      )
      .replace(
        /(?:\.\.\.|…).*$/,
        '',
      );

  const noiseMarkers = [
    'related articles',
    'get job alerts',
    'tell us your qualification',
    'share',
    'facebook',
    'twitter',
    'whatsapp',
    'telegram',
    'specific stages will be conducted',
    'wise vacancy numbers',
    'category-wise',
    'rrb-wise',
    'community-wise',
  ];

  const lower =
    result.toLowerCase();

  if (
    noiseMarkers.some(
      (marker) =>
        lower.includes(marker),
    )
  ) {
    return undefined;
  }

  if (
    result.length < 2 ||
    result.length > 300
  ) {
    return undefined;
  }

  return result;
}

function extractPostNames(
  title: string,
  lines: string[],
): string[] {
  const candidates: string[] = [];

  const addCandidate = (
    value: string | undefined,
  ) => {
    if (!value) return;

    let cleaned =
      cleanText(value);

    cleaned =
      cleaned
        .replace(
          /^[-:–—|,\s]+/,
          '',
        )
        .replace(
          /[|]+$/,
          '',
        )
        .trim();

    if (!cleaned) return;

    const lower =
      cleaned.toLowerCase();

    /*
     * Never accept navigation, article metadata,
     * explanatory headings or cross-link text.
     */
    const rejectedPatterns = [
      'related articles',
      'get job alerts',
      'tell us your qualification',
      'qualification experience',
      'educational qualification',
      'educational qualifications',
      'experience profile',
      'specific stages',
      'see annexure',
      'annexure a',
      'annexure b',
      'wise vacancy',
      'category-wise',
      'category wise',
      'community-wise',
      'community wise',
      'rrb-wise',
      'rrb wise',
      'important dates',
      'application fee',
      'how to apply',
      'selection process',
      'age limit',
      'salary',
      'pay scale',
      'eligibility criteria',
      'documents required',
      'instructions',
    ];

    if (
      rejectedPatterns.some(
        (pattern) =>
          lower.includes(pattern),
      )
    ) {
      return;
    }

    /*
     * A post name should not be a full paragraph.
     */
    if (
      cleaned.length < 2 ||
      cleaned.length > 150
    ) {
      return;
    }

    /*
     * Reject sentences that clearly aren't post names.
     */
    if (
      /[.!?]\s+[A-Z]/.test(
        cleaned,
      ) &&
      cleaned.length > 80
    ) {
      return;
    }

    candidates.push(cleaned);
  };

  /*
   * 1. Explicit post/designation labels.
   */
  const labelPatterns = [
    /^(?:post|post name|name of post|name of the post|designation)\s*[:=-]\s*(.+)$/i,
  ];

  for (
    const line of lines
  ) {
    for (
      const pattern of labelPatterns
    ) {
      const match =
        line.match(pattern);

      if (match?.[1]) {
        addCandidate(
          match[1],
        );
      }
    }
  }

  /*
   * 2. Extract the post section from common job titles.
   *
   * Examples:
   * "ISRO 267 Assistant, JPA, UDC & Steno Online Form 2026"
   *
   * → "Assistant, JPA, UDC & Steno"
   *
   * "BPCL 154 Technician & Operator Online Form 2026"
   *
   * → "Technician & Operator"
   */
  const titlePatterns = [
    /^\D*?\d{1,6}(?:,\d{3})*\s+(.+?)\s+(?:Online|Offline)\s+Form(?:\s+\d{4})?$/i,

    /^.+?\s+Recruitment\s+\d{4}\s*[-:]\s*(.+)$/i,
  ];

  for (
    const pattern of titlePatterns
  ) {
    const match =
      title.match(pattern);

    if (match?.[1]) {
      addCandidate(
        match[1],
      );
    }
  }

  /*
   * 3. Remove obvious title artifacts from extracted names.
   */
  const cleaned =
    candidates
      .map(
        (value) =>
          value
            .replace(
              /\s+(?:Online|Offline)\s+Form.*$/i,
              '',
            )
            .replace(
              /\s+\d{4}\s*$/,
              '',
            )
            .trim(),
      )
      .filter(
        (value) =>
          value.length >= 2 &&
          value.length <= 150,
      );

  /*
   * 4. Deduplicate case-insensitively.
   */
  const unique: string[] = [];
  const seen =
    new Set<string>();

  for (
    const value of cleaned
  ) {
    const key =
      value
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(value);
  }

  return unique.slice(0, 20);
}
function extractQualification(
  text: string,
): string | undefined {
  return cleanFieldValue(
    findFirst(text, [
      /\b(?:educational\s+qualification|educational\s+qualifications)\s*[:=-]\s*([^|]{10,600})/i,

      /\b(?:qualification|eligibility)\s*[:=-]\s*([^|]{10,600})/i,

      /\b(?:essential\s+qualification|minimum\s+qualification)\s*[:=-]\s*([^|]{10,600})/i,
    ]),
  );
}

function extractExperience(
  text: string,
): string | undefined {
  return cleanFieldValue(
    findFirst(text, [
      /\b(?:experience|work\s+experience)\s*[:=-]\s*([^|]{5,500})/i,

      /\b(?:post[- ]qualification\s+experience)\s*[:=-]\s*([^|]{5,500})/i,
    ]),
  );
}

function extractAgeLimit(
  text: string,
): string | undefined {
  const labeled =
    findFirst(text, [
      /\bage\s+limit\s*[:=-]\s*([^|]{3,250})/i,

      /\bmaximum\s+age\s*[:=-]\s*([^|]{3,100})/i,

      /\bminimum\s+age\s*[:=-]\s*([^|]{3,100})/i,
    ]);

  if (labeled) {
    return cleanFieldValue(
      labeled,
    );
  }

  const range =
    text.match(
      /\b(?:age|aged)\s*(?:between\s*)?(\d{1,3})\s*(?:to|-)\s*(\d{1,3})\s*years?\b/i,
    );

  if (range) {
    return `${range[1]} to ${range[2]} years`;
  }

  return undefined;
}

function extractSalary(
  text: string,
): string | undefined {
  return cleanFieldValue(
    findFirst(text, [
      /\b(?:salary|pay\s+scale|remuneration|pay\s+level)\s*[:=-]\s*([^|]{3,300})/i,

      /\b(?:salary|pay)\s+(?:of|up\s+to)\s*[:=-]?\s*(₹?\s*[\d,]+(?:\s*[-–]\s*₹?\s*[\d,]+)?)/i,
    ]),
  );
}

function extractLocation(
  text: string,
): string | undefined {
  return cleanFieldValue(
    findFirst(text, [
      /\bjob\s+location\s*[:=-]\s*([^|]{3,200})/i,

      /\bposting\s+location\s*[:=-]\s*([^|]{3,200})/i,

      /\bplace\s+of\s+posting\s*[:=-]\s*([^|]{3,200})/i,

      /\blocation\s*[:=-]\s*([^|]{3,200})/i,
    ]),
  );
}

function extractApplicationMode(
  text: string,
): string | undefined {
  const lower =
    text.toLowerCase();

  if (
    /\bapply\s+online\b/.test(
      lower,
    ) ||
    /\bonline\s+application\b/.test(
      lower,
    )
  ) {
    return 'Online';
  }

  if (
    /\bapply\s+offline\b/.test(
      lower,
    ) ||
    /\boffline\s+application\b/.test(
      lower,
    )
  ) {
    return 'Offline';
  }

  if (
    /\bwalk[- ]in\b/.test(
      lower,
    )
  ) {
    return 'Walk-in';
  }

  return undefined;
}
function parseDate(
  value: string,
): string | undefined {
  const cleaned =
    normalizeWhitespace(
      value
        .replace(
          /[|]+$/g,
          '',
        )
        .trim(),
    );

  if (!cleaned) {
    return undefined;
  }

  /*
   * DD/MM/YYYY
   * DD-MM-YYYY
   * DD.MM.YYYY
   */
  const numeric =
    cleaned.match(
      /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/,
    );

  if (numeric) {
    const day =
      Number(numeric[1]);

    const month =
      Number(numeric[2]);

    const year =
      Number(numeric[3]);

    const date =
      new Date(
        year,
        month - 1,
        day,
      );

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date
        .toISOString()
        .slice(0, 10);
    }

    return undefined;
  }

  /*
   * Month-name formats:
   *
   * 09 August 2026
   * 9 Aug 2026
   * August 09, 2026
   * Aug 9, 2026
   */
  const monthNames =
    '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';

  const dayMonthYear =
    cleaned.match(
      new RegExp(
        `^(\\d{1,2})\\s+(${monthNames})\\s+(\\d{4})$`,
        'i',
      ),
    );

  if (dayMonthYear) {
    const parsed =
      new Date(
        `${dayMonthYear[1]} ${dayMonthYear[2]} ${dayMonthYear[3]}`,
      );

    if (
      !Number.isNaN(
        parsed.getTime(),
      )
    ) {
      return parsed
        .toISOString()
        .slice(0, 10);
    }
  }

  const monthDayYear =
    cleaned.match(
      new RegExp(
        `^(${monthNames})\\s+(\\d{1,2}),?\\s+(\\d{4})$`,
        'i',
      ),
    );

  if (monthDayYear) {
    const parsed =
      new Date(
        `${monthDayYear[1]} ${monthDayYear[2]}, ${monthDayYear[3]}`,
      );

    if (
      !Number.isNaN(
        parsed.getTime(),
      )
    ) {
      return parsed
        .toISOString()
        .slice(0, 10);
    }
  }

  /*
   * Last fallback for valid JavaScript date strings.
   */
  const parsed =
    new Date(cleaned);

  if (
    !Number.isNaN(
      parsed.getTime(),
    )
  ) {
    const year =
      parsed.getFullYear();

    if (
      year >= 2000 &&
      year <= 2100
    ) {
      return parsed
        .toISOString()
        .slice(0, 10);
    }
  }

  return undefined;
}

function extractDateByPatterns(
  text: string,
  patterns: RegExp[],
): string | undefined {
  for (
    const pattern of patterns
  ) {
    const match =
      text.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const date =
      parseDate(
        match[1],
      );

    if (date) {
      return date;
    }
  }

  return undefined;
}
function extractApplicationStartDate(
  text: string,
): string | undefined {
  /*
   * Application start dates appear in several forms across
   * government-job aggregators:
   *
   * Application Start Date: 01.08.2026
   * Starting Date: 01/08/2026
   * Apply Online From: 01 August 2026
   * Online Application Starts: 01-08-2026
   * Starting from 01.08.2026
   */

  return extractDateByPatterns(
    text,
    [
      // Application start date
      /\b(?:application|online\s+application)\s+(?:start|starting|starts?|begin|beginning|begins?)\s*(?:date)?\s*[:=-]\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:application|online\s+application)\s+(?:start|starting|starts?|begin|beginning|begins?)\s*(?:date)?\s*[:=-]\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Start Date / Starting Date
      /\b(?:start\s+date|starting\s+date|application\s+start\s+date|online\s+application\s+start\s+date)\s*[:=-]\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:start\s+date|starting\s+date|application\s+start\s+date|online\s+application\s+start\s+date)\s*[:=-]\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Apply Online From
      /\b(?:apply|application|applications?)\s+(?:online\s+)?(?:from|starts?|starting)\s*[:=-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:apply|application|applications?)\s+(?:online\s+)?(?:from|starts?|starting)\s*[:=-]?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Online application will start
      /\b(?:online\s+application|online\s+applications?)\s+(?:will\s+)?start(?:s|ing)?\s*(?:from|on)?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:online\s+application|online\s+applications?)\s+(?:will\s+)?start(?:s|ing)?\s*(?:from|on)?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Registration starts
      /\bregistration\s+(?:starts?|begins?)\s*(?:from|on)?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\bregistration\s+(?:starts?|begins?)\s*(?:from|on)?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Common "from date" wording
      /\b(?:applications?|registration)\s+(?:can\s+be\s+made|can\s+be\s+submitted|may\s+be\s+submitted)\s+(?:from|on)\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:applications?|registration)\s+(?:can\s+be\s+made|can\s+be\s+submitted|may\s+be\s+submitted)\s+(?:from|on)\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,
    ],
  );
}

function extractApplicationLastDate(
  text: string,
): string | undefined {
  /*
   * Last dates are particularly important because they
   * determine whether a job is currently actionable.
   */

  return extractDateByPatterns(
    text,
    [
      // Explicit last date
      /\b(?:last\s+date|last\s+date\s+to\s+apply|last\s+date\s+of\s+application|application\s+last\s+date|closing\s+date|closing\s+date\s+for\s+application)\s*[:=-]\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:last\s+date|last\s+date\s+to\s+apply|last\s+date\s+of\s+application|application\s+last\s+date|closing\s+date|closing\s+date\s+for\s+application)\s*[:=-]\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Last date is / will be
      /\b(?:last\s+date|closing\s+date|last\s+day)\s+(?:is|will\s+be)\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:last\s+date|closing\s+date|last\s+day)\s+(?:is|will\s+be)\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Apply before / by
      /\b(?:apply|applications?|application)\s+(?:online\s+)?(?:before|by)\s*[:=-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:apply|applications?|application)\s+(?:online\s+)?(?:before|by)\s*[:=-]?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Application closes
      /\b(?:application|online\s+application|registration)\s+(?:closes?|closing)\s*(?:on|date)?\s*[:=-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:application|online\s+application|registration)\s+(?:closes?|closing)\s*(?:on|date)?\s*[:=-]?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Closing date
      /\bclosing\s+date\s+(?:for\s+(?:online\s+)?application\s+)?(?:is|will\s+be)?\s*[:=-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\bclosing\s+date\s+(?:for\s+(?:online\s+)?application\s+)?(?:is|will\s+be)?\s*[:=-]?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      /*
       * Very common Indian recruitment wording:
       *
       * "Candidates can apply till 18.08.2026"
       * "Applications are invited till 18 August 2026"
       */
      /\b(?:apply|applications?|candidates?)\s+(?:can\s+)?(?:apply\s+)?(?:online\s+)?(?:till|until|upto|up\s+to)\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:apply|applications?|candidates?)\s+(?:can\s+)?(?:apply\s+)?(?:online\s+)?(?:till|until|upto|up\s+to)\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // "on or before"
      /\b(?:apply|applications?|application)\s+(?:on\s+or\s+before|before)\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:apply|applications?|application)\s+(?:on\s+or\s+before|before)\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,
    ],
  );
}

function extractExamDate(
  text: string,
): string | undefined {
  return extractDateByPatterns(
    text,
    [
      // Explicit exam date
      /\b(?:exam\s+date|examination\s+date|written\s+exam\s+date|online\s+exam\s+date|cbt\s+date|computer\s+based\s+test\s+date)\s*[:=-]\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:exam\s+date|examination\s+date|written\s+exam\s+date|online\s+exam\s+date|cbt\s+date|computer\s+based\s+test\s+date)\s*[:=-]\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Exam will be held
      /\b(?:exam|examination|written\s+exam|computer\s+based\s+test|cbt)\s+(?:will\s+be\s+held|is\s+scheduled|scheduled)\s+(?:on\s+)?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:exam|examination|written\s+exam|computer\s+based\s+test|cbt)\s+(?:will\s+be\s+held|is\s+scheduled|scheduled)\s+(?:on\s+)?([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // Date of examination
      /\bdate\s+of\s+(?:exam|examination|written\s+exam)\s*[:=-]\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\bdate\s+of\s+(?:exam|examination|written\s+exam)\s*[:=-]\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,

      // CBT scheduled
      /\b(?:cbt|computer\s+based\s+test)\s+(?:date|is|will\s+be)\s+(?:scheduled\s+)?(?:on)?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/i,

      /\b(?:cbt|computer\s+based\s+test)\s+(?:date|is|will\s+be)\s+(?:scheduled\s+)?(?:on)?\s*([A-Za-z]{3,12}\s+\d{1,2},?\s+\d{4})/i,
    ],
  );
}
function isRejectedOfficialDomain(
  url: string,
): boolean {
  try {
    const hostname =
      new URL(url)
        .hostname
        .toLowerCase()
        .replace(/^www\./, '');

    return SOURCE_DOMAINS_TO_REJECT_AS_OFFICIAL.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(
          `.${domain}`,
        ),
    );
  } catch {
    return true;
  }
}

function isPdfUrl(
  url: string,
): boolean {
  return /\.pdf(?:[?#].*)?$/i.test(
    url,
  );
}

function isApplyLikeText(
  text: string,
): boolean {
  return [
    'apply online',
    'apply now',
    'online application',
    'application link',
    'apply here',
    'registration link',
    'online registration',
  ].some(
    (keyword) =>
      text.includes(keyword),
  );
}

function isNotificationLikeText(
  text: string,
): boolean {
  return [
    'official notification',
    'notification pdf',
    'download notification',
    'official advertisement',
    'advertisement pdf',
    'detailed advertisement',
    'official advt',
  ].some(
    (keyword) =>
      text.includes(keyword),
  );
}

function extractOfficialLinks(
  html: string,
  sourceUrl: string,
): {
  officialNotificationUrl?: string;
  officialApplyUrl?: string;
} {
  let officialNotificationUrl:
    | string
    | undefined;

  let officialApplyUrl:
    | string
    | undefined;

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
      decodeHtmlEntities(
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

    /*
     * NEVER call another aggregator's page
     * an official application URL.
     */
    if (
      isRejectedOfficialDomain(
        url,
      )
    ) {
      continue;
    }

    const anchorText =
      cleanText(
        match[2],
      ).toLowerCase();

    if (
      !officialNotificationUrl &&
      (
        isNotificationLikeText(
          anchorText,
        ) ||
        isPdfUrl(url)
      )
    ) {
      officialNotificationUrl =
        url;
    }

    if (
      !officialApplyUrl &&
      isApplyLikeText(
        anchorText,
      )
    ) {
      officialApplyUrl =
        url;
    }
  }

  return {
    officialNotificationUrl,
    officialApplyUrl,
  };
}

function extractSector(
  title: string,
): string | undefined {
  const lower =
    title.toLowerCase();

  if (
    lower.includes('bank') ||
    lower.includes('banking') ||
    lower.includes('clerk') ||
    lower.includes('lbo')
  ) {
    return 'Banking';
  }

  if (
    lower.includes('teacher') ||
    lower.includes('lecturer') ||
    lower.includes('professor') ||
    lower.includes('faculty')
  ) {
    return 'Education';
  }

  if (
    lower.includes('railway') ||
    lower.includes('rrb')
  ) {
    return 'Railways';
  }

  if (
    lower.includes('police') ||
    lower.includes('defence') ||
    lower.includes('army') ||
    lower.includes('navy')
  ) {
    return 'Defence & Police';
  }

  if (
    lower.includes('engineer') ||
    lower.includes('technician') ||
    lower.includes('apprentice')
  ) {
    return 'Engineering & Technical';
  }

  return undefined;
}

function extractJobType(
  title: string,
): string | undefined {
  const lower =
    title.toLowerCase();

  if (
    lower.includes('apprentice') ||
    lower.includes('apprenticeship')
  ) {
    return 'Apprenticeship';
  }

  if (
    lower.includes('internship') ||
    lower.includes('intern')
  ) {
    return 'Internship';
  }

  if (
    lower.includes('contract')
  ) {
    return 'Contract';
  }

  if (
    lower.includes('walk-in') ||
    lower.includes('walk in')
  ) {
    return 'Walk-in';
  }

  if (
    lower.includes('deputation')
  ) {
    return 'Deputation';
  }

  return 'Regular Recruitment';
}

function createId(
  candidate: DiscoveryCandidate,
): string {
  return Buffer.from(
    `${candidate.sourceId}|${candidate.url}`,
  )
    .toString('base64url')
    .slice(0, 48);
}

function calculateConfidence(
  record: JobRecord,
): number {
  let score = 0;

  if (record.title) {
    score += 15;
  }

  if (record.organization) {
    score += 10;
  }

  if (
    record.postNames.length > 0
  ) {
    score += 10;
  }

  if (
    record.vacancies !== undefined
  ) {
    score += 15;
  }

  if (record.qualification) {
    score += 10;
  }

  if (record.experience) {
    score += 5;
  }

  if (record.ageLimit) {
    score += 5;
  }

  if (record.salary) {
    score += 5;
  }

  if (record.location) {
    score += 5;
  }

  if (
    record.applicationStartDate
  ) {
    score += 5;
  }

  if (
    record.applicationLastDate
  ) {
    score += 10;
  }

  if (
    record.officialNotificationUrl
  ) {
    score += 3;
  }

  if (
    record.officialApplyUrl
  ) {
    score += 2;
  }

  return Math.min(
    100,
    score,
  );
}

export async function extractJob(
  candidate: DiscoveryCandidate,
): Promise<JobRecord | null> {
  let html: string;

  try {
    html =
      await fetchHtml(
        candidate.url,
      );
  } catch (error) {
    console.warn(
      `[SARJOM] Extraction failed: ${candidate.url}`,
      error instanceof Error
        ? error.message
        : String(error),
    );

    return null;
  }

  if (!html) {
    return null;
  }

  const pageTitle =
    extractPageTitle(html) ??
    candidate.title;

  const text =
    extractMainText(html);

  const lines =
    extractLines(html);

  if (text.length < 100) {
    return null;
  }

  const organization =
    extractOrganization(
      candidate.title,
      text,
    );

  const postNames =
    extractPostNames(
      candidate.title,
      lines,
    );

  const vacancies =
    extractVacancies(
      candidate.title,
      text,
    );

  const qualification =
    extractQualification(
      text,
    );

  const experience =
    extractExperience(
      text,
    );

  const ageLimit =
    extractAgeLimit(
      text,
    );

  const salary =
    extractSalary(
      text,
    );

  const location =
    extractLocation(
      text,
    );

  const applicationMode =
    extractApplicationMode(
      text,
    );

  const applicationStartDate =
    extractApplicationStartDate(
      text,
    );

  const applicationLastDate =
    extractApplicationLastDate(
      text,
    );

  const examDate =
    extractExamDate(
      text,
    );

  const officialLinks =
    extractOfficialLinks(
      html,
      candidate.url,
    );

  const record: JobRecord = {
    id: createId(
      candidate,
    ),

    title: candidate.title,

    organization,

    postNames,

    vacancies,

    jobType:
      extractJobType(
        candidate.title,
      ),

    sector:
      extractSector(
        candidate.title,
      ),

    location,

    qualification,

    experience,

    ageLimit,

    salary,

    applicationStartDate,

    applicationLastDate,

    examDate,

    applicationMode,

    officialNotificationUrl:
      officialLinks
        .officialNotificationUrl,

    officialApplyUrl:
      officialLinks
        .officialApplyUrl,

    sourceUrl:
      candidate.url,

    sourceId:
      candidate.sourceId,

    sourceName:
      candidate.sourceName,

    extractedAt:
      new Date().toISOString(),

    confidence: 0,
  };

  record.confidence =
    calculateConfidence(
      record,
    );

  return record;
}

export async function extractJobs(
  candidates: DiscoveryCandidate[],
): Promise<JobRecord[]> {
  const results: JobRecord[] = [];

  const concurrency = 3;

  for (
    let start = 0;
    start < candidates.length;
    start += concurrency
  ) {
    const batch =
      candidates.slice(
        start,
        start + concurrency,
      );

    const batchResults =
      await Promise.allSettled(
        batch.map(
          (candidate) =>
            extractJob(
              candidate,
            ),
        ),
      );

    for (
      const result
      of batchResults
    ) {
      if (
        result.status ===
          'fulfilled' &&
        result.value
      ) {
        results.push(
          result.value,
        );
      }
    }
  }

  return results;
}