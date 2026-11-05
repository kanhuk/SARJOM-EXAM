/**
 * SARJOM SEMANTIC NORMALIZATION ENGINE
 *
 * Purpose:
 * - Reduce false conflicts caused by:
 *   • abbreviations
 *   • bilingual official names
 *   • punctuation
 *   • descriptive wording
 *   • recruitment metadata in titles
 *
 * IMPORTANT:
 * - This module does NOT normalize numeric recruitment facts.
 * - Vacancy counts, dates, advertisement numbers, etc. remain exact facts.
 * - Original source values are preserved elsewhere for audit/display.
 */

export type SemanticMatch =
  | 'exact'
  | 'strong'
  | 'probable'
  | 'different';

export interface SemanticComparison {
  match: SemanticMatch;
  score: number;
  reason: string;
}

/* -------------------------------------------------------
   COMMON STOP WORDS
------------------------------------------------------- */

const STOP_WORDS = new Set([
  'the',
  'of',
  'for',
  'and',
  'to',
  'in',
  'on',
  'at',
  'by',
  'under',
  'through',

  'department',
  'commission',
  'board',
  'authority',
  'government',
  'govt',

  'recruitment',
  'recruitment2025',
  'recruitment2026',

  'advertisement',
  'advertisementno',
  'advt',

  'notice',
  'notification',

  'regular',
  'appointment',
  'selection',
]);

/* -------------------------------------------------------
   ORGANIZATION ALIASES
------------------------------------------------------- */

const ORGANIZATION_ALIASES: Record<string, string> = {
  btsc: 'bihar technical service commission',

  'bihar technical service commission':
    'bihar technical service commission',

  'bihar technical service commission btsc':
    'bihar technical service commission',

  'bihar technical service commission bihar technical service commission':
    'bihar technical service commission',
};

/* -------------------------------------------------------
   POST ALIASES
------------------------------------------------------- */

const POST_ALIASES: Record<string, string> = {
  je: 'junior engineer',
  'j e': 'junior engineer',
  'junior engg': 'junior engineer',
  'junior eng': 'junior engineer',
};

/* -------------------------------------------------------
   BASIC CLEANING
------------------------------------------------------- */

function clean(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[(){}\[\],.:;'"`/\\|_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* -------------------------------------------------------
   ORGANIZATION NORMALIZATION
------------------------------------------------------- */

function canonicalOrganization(
  value: string | null | undefined,
): string {
  let result = clean(value);

  if (!result) {
    return '';
  }

  /*
   * Remove bilingual text inside parentheses.
   *
   * Example:
   * Bihar Technical Service Commission
   * Bihar Technical Service Commission (बिहार तकनीकी सेवा आयोग)
   *
   * Both become the same English identity.
   */
  result = result.replace(/\([^)]*\)/g, ' ');

  result = result
    .replace(/\s+/g, ' ')
    .trim();

  /*
   * Explicit BTSC alias.
   */
  if (result === 'btsc') {
    return ORGANIZATION_ALIASES.btsc;
  }

  /*
   * If the canonical organization name is present,
   * discard additional descriptive wording.
   */
  if (
    result.includes(
      'bihar technical service commission',
    )
  ) {
    return ORGANIZATION_ALIASES[
      'bihar technical service commission'
    ];
  }

  return result;
}

/* -------------------------------------------------------
   POST NORMALIZATION
------------------------------------------------------- */

function canonicalPost(
  value: string | null | undefined,
): string {
  if (!value) {
    return '';
  }

  /*
   * For bilingual job titles, the English portion is normally
   * before "/".
   *
   * Example:
   *
   * Junior Engineer (Civil) / कनीय अभियंता (असैनिक)
   *
   * becomes:
   *
   * Junior Engineer Civil
   */
  const englishPart = value.split('/')[0];

  let result = clean(englishPart);

  if (!result) {
    return '';
  }

  /*
   * Normalize common abbreviations.
   */
  for (const [alias, replacement] of Object.entries(
    POST_ALIASES,
  )) {
    const escapedAlias = alias.replace(
      /\s+/g,
      '\\s+',
    );

    result = result.replace(
      new RegExp(
        `\\b${escapedAlias}\\b`,
        'g',
      ),
      replacement,
    );
  }

  /*
   * Remove organization acronym when it is attached
   * to the post title.
   *
   * Example:
   * BTSC Junior Engineer Civil
   *
   * becomes:
   * Junior Engineer Civil
   */
  result = result.replace(
    /\bbtsc\b/g,
    ' ',
  );

  /*
   * Remove year metadata.
   *
   * Example:
   * Junior Engineer Recruitment 2026
   *
   * becomes:
   * Junior Engineer
   */
  result = result.replace(
    /\b20\d{2}\b/g,
    ' ',
  );

  /*
   * Remove recruitment/document metadata.
   */
  result = result.replace(
    /\brecruitment\b/g,
    ' ',
  );

  result = result.replace(
    /\badvertisement\b/g,
    ' ',
  );

  result = result.replace(
    /\bnotification\b/g,
    ' ',
  );

  result = result.replace(
    /\bnotice\b/g,
    ' ',
  );

  /*
   * Normalize common engineering terminology.
   */
  result = result.replace(
    /\bcivil engineering\b/g,
    'civil',
  );

  result = result.replace(
    /\bengineer civil\b/g,
    'junior engineer civil',
  );

  result = result.replace(
    /\bjunior engineer\s+civil\b/g,
    'junior engineer civil',
  );

  /*
   * Remove generic stop words.
   */
  result = result
    .split(' ')
    .filter(
      token =>
        token &&
        !STOP_WORDS.has(token),
    )
    .join(' ');

  result = result
    .replace(/\s+/g, ' ')
    .trim();

  return result;
}

/* -------------------------------------------------------
   TOKENIZATION
------------------------------------------------------- */

function tokens(
  value: string | null | undefined,
  kind: 'organization' | 'post',
): Set<string> {
  const canonical =
    kind === 'organization'
      ? canonicalOrganization(value)
      : canonicalPost(value);

  return new Set(
    canonical
      .split(' ')
      .filter(
        token =>
          token &&
          !STOP_WORDS.has(token),
      ),
  );
}

/* -------------------------------------------------------
   JACCARD SIMILARITY
------------------------------------------------------- */

function jaccard(
  a: Set<string>,
  b: Set<string>,
): number {
  if (!a.size || !b.size) {
    return 0;
  }

  let intersection = 0;

  for (const token of a) {
    if (b.has(token)) {
      intersection++;
    }
  }

  const union = new Set([
    ...a,
    ...b,
  ]).size;

  return union
    ? intersection / union
    : 0;
}

/* -------------------------------------------------------
   ORGANIZATION COMPARISON
------------------------------------------------------- */

export function compareOrganization(
  a: string | null | undefined,
  b: string | null | undefined,
): SemanticComparison {
  const left =
    canonicalOrganization(a);

  const right =
    canonicalOrganization(b);

  if (!left || !right) {
    return {
      match: 'different',
      score: 0,
      reason:
        'One organization value is empty.',
    };
  }

  /*
   * Exact normalized identity.
   */
  if (left === right) {
    return {
      match: 'exact',
      score: 100,
      reason:
        'Organization names normalize to the same canonical identity.',
    };
  }

  const score = Math.round(
    jaccard(
      tokens(a, 'organization'),
      tokens(b, 'organization'),
    ) * 100,
  );

  if (score >= 80) {
    return {
      match: 'strong',
      score,
      reason:
        'Organization names have the same normalized identity.',
    };
  }

  if (score >= 60) {
    return {
      match: 'probable',
      score,
      reason:
        'Organization names are highly similar after normalization.',
    };
  }

  return {
    match: 'different',
    score,
    reason:
      'Organization identities remain materially different.',
  };
}

/* -------------------------------------------------------
   POST NAME COMPARISON
------------------------------------------------------- */

export function comparePostName(
  a: string | null | undefined,
  b: string | null | undefined,
): SemanticComparison {
  const left =
    canonicalPost(a);

  const right =
    canonicalPost(b);

  if (!left || !right) {
    return {
      match: 'different',
      score: 0,
      reason:
        'One post name is empty.',
    };
  }

  /*
   * Exact normalized identity.
   *
   * This should catch:
   *
   * BTSC Junior Engineer Civil Recruitment 2026
   *
   * and:
   *
   * Junior Engineer (Civil) / कनीय अभियंता (असैनिक)
   */
  if (left === right) {
    return {
      match: 'exact',
      score: 100,
      reason:
        'Post names normalize to the same canonical identity.',
    };
  }

  const score = Math.round(
    jaccard(
      tokens(a, 'post'),
      tokens(b, 'post'),
    ) * 100,
  );

  if (score >= 70) {
    return {
      match: 'strong',
      score,
      reason:
        'Post names describe the same normalized role.',
    };
  }

  if (score >= 50) {
    return {
      match: 'probable',
      score,
      reason:
        'Post names are similar but may require review.',
    };
  }

  return {
    match: 'different',
    score,
    reason:
      'Post names remain materially different.',
  };
}