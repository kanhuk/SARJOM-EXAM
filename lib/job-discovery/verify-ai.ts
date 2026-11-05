import { ai, MODEL_NAME } from '../gemini.js';

import type {
  DiscoveredJob,
} from './types.js';

export interface AIVerificationResult {
  verified: boolean;

  verificationScore: number;

  status:
    | 'new'
    | 'open'
    | 'closing-soon'
    | 'expired';

  organization?: string;

  title?: string;

  vacancies?: number;

  location?: string;

  state?: string;

  qualification?: string;

  ageLimit?: string;

  salary?: string;

  applicationStartDate?: string;

  applicationDeadline?: string;

  examDate?: string;

  applicationMode?: string;

  jobType?: string;

  category?: string;

  summary?: string;

  warnings: string[];

  conflicts: string[];

  evidence: string[];

  sourceAuthority:
    | 'official'
    | 'aggregator'
    | 'unknown';

  aiVerifiedAt: string;
}

interface GeminiVerificationResponse {
  verified?: boolean;

  verificationScore?: number;

  status?:
    | 'new'
    | 'open'
    | 'closing-soon'
    | 'expired';

  organization?: string | null;

  title?: string | null;

  vacancies?: number | null;

  location?: string | null;

  state?: string | null;

  qualification?: string | null;

  ageLimit?: string | null;

  salary?: string | null;

  applicationStartDate?: string | null;

  applicationDeadline?: string | null;

  examDate?: string | null;

  applicationMode?: string | null;

  jobType?: string | null;

  category?: string | null;

  summary?: string | null;

  warnings?: string[];

  conflicts?: string[];

  evidence?: string[];

  sourceAuthority?:
    | 'official'
    | 'aggregator'
    | 'unknown';
}

function cleanString(
  value: unknown,
): string | undefined {
  if (
    typeof value !== 'string'
  ) {
    return undefined;
  }

  const cleaned =
    value.trim();

  return cleaned || undefined;
}

function cleanNumber(
  value: unknown,
): number | undefined {
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0
  ) {
    return Math.round(value);
  }

  if (
    typeof value === 'string'
  ) {
    const number =
      Number(
        value.replace(
          /,/g,
          '',
        ),
      );

    if (
      Number.isFinite(number) &&
      number > 0
    ) {
      return Math.round(
        number,
      );
    }
  }

  return undefined;
}

function cleanScore(
  value: unknown,
): number {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number),
    ),
  );
}

function cleanArray(
  value: unknown,
): string[] {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item === 'string',
    )
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean)
    .slice(0, 20);
}

function stripMarkdownJson(
  text: string,
): string {
  let cleaned = text.trim();

  /*
   * Remove markdown code fences if Gemini returned them.
   */
  cleaned = cleaned
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  /*
   * Gemini can occasionally return explanatory text before
   * or after the JSON object.
   *
   * Extract the first complete JSON object instead of
   * assuming the entire response is pure JSON.
   */
  const firstBrace =
    cleaned.indexOf('{');

  if (firstBrace === -1) {
    return cleaned;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (
    let i = firstBrace;
    i < cleaned.length;
    i++
  ) {
    const character =
      cleaned[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (
      character === '\\' &&
      inString
    ) {
      escaped = true;
      continue;
    }

    if (
      character === '"' 
    ) {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (character === '{') {
      depth++;
    }

    if (character === '}') {
      depth--;

      if (depth === 0) {
        return cleaned.slice(
          firstBrace,
          i + 1,
        );
      }
    }
  }

  return cleaned.slice(
    firstBrace,
  );
}
function buildPrompt(
  job: DiscoveredJob,
): string {
  return `
You are SARJOM's Government & Jobs Verification AI.

Your task is to verify and enrich ONE job/recruitment record.

IMPORTANT RULES:

1. NEVER invent information.
2. If a field cannot be verified from the supplied evidence, return null.
3. Prefer official-source evidence over aggregator evidence.
4. If aggregator and official evidence conflict, prefer the official source.
5. Report every important conflict in "conflicts".
6. Do not treat navigation links, related articles, advertisements,
   recommendations, or unrelated organizations as job evidence.
7. A job must represent a real recruitment/employment opportunity.
8. Dates must use YYYY-MM-DD.
9. Vacancy counts must be numeric.
10. Do not convert a vague statement into a precise value.
11. If the official source is unavailable, you may verify using the
    supplied aggregator evidence, but lower the verification score.
12. Do not claim a job is current merely because the webpage exists.
13. Check deadlines against today's date.
14. If the deadline has passed, status must be "expired".
15. If the deadline is within 7 days, status should normally be
    "closing-soon".
16. If the deadline is in the future and the job is actionable,
    status should be "open".
17. If there is insufficient date information, use "new".
18. Return ONLY valid JSON.
19. Do not wrap the JSON in markdown.

TODAY'S DATE:
${new Date().toISOString().slice(0, 10)}

JOB RECORD:

${JSON.stringify(
  job,
  null,
  2,
)}

Return exactly this JSON structure:

{
  "verified": true,
  "verificationScore": 0,
  "status": "new",
  "organization": null,
  "title": null,
  "vacancies": null,
  "location": null,
  "state": null,
  "qualification": null,
  "ageLimit": null,
  "salary": null,
  "applicationStartDate": null,
  "applicationDeadline": null,
  "examDate": null,
  "applicationMode": null,
  "jobType": null,
  "category": null,
  "summary": null,
  "warnings": [],
  "conflicts": [],
  "evidence": [],
  "sourceAuthority": "unknown"
}

VERIFICATION SCORE GUIDANCE:

90-100:
Official notification or official recruitment page clearly confirms
the important fields.

75-89:
Strong evidence with most important fields verified, but some
information is missing.

50-74:
Useful evidence exists, but important information cannot be confirmed.

1-49:
Weak or incomplete evidence.

0:
Not a valid recruitment opportunity or evidence is unusable.

SOURCE AUTHORITY:

"official":
The supplied source URL or official URL clearly belongs to the
recruiting organization.

"aggregator":
Evidence primarily comes from a job aggregator.

"unknown":
Authority cannot be established.

VERY IMPORTANT:

If the title says one vacancy number but the article body contains
another number, do NOT silently choose one.

Example:

Title:
"SBI 9124 Clerk Online Form 2026"

Body:
"7680 vacancies..."

Return:

"vacancies": 9124,

and:

"conflicts": [
  "Aggregator body reports 7680 while the job title reports 9124 vacancies."
]

unless official evidence clearly establishes the correct figure.

Likewise, if an article mentions multiple organizations, identify the
organization actually responsible for THIS recruitment, not an
organization mentioned in related articles.
`;
}

export async function verifyJobWithAI(
  job: DiscoveredJob,
): Promise<AIVerificationResult> {
  const verifiedAt =
    new Date().toISOString();

  try {
    
    const response =
  await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: buildPrompt(job),
          },
        ],
      },
    ],
    config: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });
    const raw =
      response.text;

    if (!raw) {
      throw new Error(
        'Gemini returned an empty response',
      );
    }
    if (!raw) {
      throw new Error(
        'Gemini returned an empty response',
      );
    }

    const parsed =
      JSON.parse(
        stripMarkdownJson(raw),
      ) as GeminiVerificationResponse;

    const warnings =
      cleanArray(
        parsed.warnings,
      );

    const conflicts =
      cleanArray(
        parsed.conflicts,
      );

    const evidence =
      cleanArray(
        parsed.evidence,
      );

    const verificationScore =
      cleanScore(
        parsed.verificationScore,
      );

    const verified =
      Boolean(
        parsed.verified &&
          verificationScore >= 60,
      );

    return {
      verified,

      verificationScore,

      status:
        parsed.status ??
        'new',

      organization:
        cleanString(
          parsed.organization,
        ),

      title:
        cleanString(
          parsed.title,
        ),

      vacancies:
        cleanNumber(
          parsed.vacancies,
        ),

      location:
        cleanString(
          parsed.location,
        ),

      state:
        cleanString(
          parsed.state,
        ),

      qualification:
        cleanString(
          parsed.qualification,
        ),

      ageLimit:
        cleanString(
          parsed.ageLimit,
        ),

      salary:
        cleanString(
          parsed.salary,
        ),

      applicationStartDate:
        cleanString(
          parsed.applicationStartDate,
        ),

      applicationDeadline:
        cleanString(
          parsed.applicationDeadline,
        ),

      examDate:
        cleanString(
          parsed.examDate,
        ),

      applicationMode:
        cleanString(
          parsed.applicationMode,
        ),

      jobType:
        cleanString(
          parsed.jobType,
        ),

      category:
        cleanString(
          parsed.category,
        ),

      summary:
        cleanString(
          parsed.summary,
        ),

      warnings,

      conflicts,

      evidence,

      sourceAuthority:
        parsed.sourceAuthority ??
        'unknown',

      aiVerifiedAt:
        verifiedAt,
    };
  } catch (error) {
    console.error(
      '[SARJOM] AI verification failed:',
      error instanceof Error
        ? error.message
        : String(error),
    );

    /*
     * Safe fallback:
     *
     * Never destroy the discovered job simply because
     * Gemini is temporarily unavailable.
     */
    return {
      verified: false,

      verificationScore: 0,

      status:
        job.status,

      organization:
        job.organization,

      title:
        job.title,

      vacancies:
        job.vacancies,

      location:
        job.location,

      state:
        job.state,

      qualification:
        job.qualification,

      ageLimit:
        job.ageLimit,

      salary:
        job.salary,

      applicationStartDate:
        job.applicationStartDate,

      applicationDeadline:
        job.applicationDeadline,

      examDate:
        job.examDate,

      warnings: [
        'AI verification failed; original extracted data retained.',
      ],

      conflicts: [],

      evidence: [
        job.sourceUrl,
      ],

      sourceAuthority:
        job.officialUrl
          ? 'official'
          : 'unknown',

      aiVerifiedAt:
        verifiedAt,
    };
  }
}

export async function verifyJobsWithAI(
  jobs: DiscoveredJob[],
): Promise<
  Array<{
    job: DiscoveredJob;
    verification: AIVerificationResult;
  }>
> {
  const results: Array<{
    job: DiscoveredJob;
    verification: AIVerificationResult;
  }> = [];

  /*
   * Keep concurrency deliberately low.
   *
   * We do NOT want 100 Gemini requests firing simultaneously.
   */
  const concurrency = 2;

  for (
    let start = 0;
    start < jobs.length;
    start += concurrency
  ) {
    const batch =
      jobs.slice(
        start,
        start + concurrency,
      );

    const batchResults =
      await Promise.all(
        batch.map(
          async (job) => ({
            job,

            verification:
              await verifyJobWithAI(
                job,
              ),
          }),
        ),
      );

    results.push(
      ...batchResults,
    );
  }

  return results;
}