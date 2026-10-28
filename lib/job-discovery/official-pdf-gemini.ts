import { GoogleGenerativeAI } from '@google/generative-ai';

export type OfficialModificationType =
  | 'original'
  | 'corrigendum'
  | 'extension'
  | 'revised'
  | 'cancellation'
  | 'postponement'
  | 'unknown';

export interface OfficialPdfGeminiResult {
  success: boolean;

  isRecruitmentDocument: boolean;
  isLikelyNotification: boolean;

  title: string;
  organization: string;
  postName: string;

  /**
   * Official advertisement / notification number.
   *
   * Examples:
   * 28/2025
   * Advt. No. 12/2026
   * Advertisement No. 45/2025
   */
  advertisementNumber: string | null;

  /**
   * Date printed on the official document.
   * Always normalized to YYYY-MM-DD when confidently available.
   */
  documentDate: string | null;

  vacancies: number | null;

  applicationStartDate: string | null;
  applicationLastDate: string | null;
  examDate: string | null;

  eligibility: string[];

  /**
   * Signals Gemini found in the actual PDF.
   */
  matchedSignals: string[];

  /**
   * Classification of the official document.
   */
  modificationType: OfficialModificationType;

  /**
   * Gemini confidence from 0 to 100.
   */
  confidence: number;

  summary: string;

  /**
   * Extracted text from the PDF.
   */
  extractedText: string;

  /**
   * Optional error message.
   */
  error?: string;
}

interface GeminiRawResult {
  isRecruitmentDocument?: unknown;
  isLikelyNotification?: unknown;

  title?: unknown;
  organization?: unknown;
  postName?: unknown;

  advertisementNumber?: unknown;
  documentDate?: unknown;

  vacancies?: unknown;

  applicationStartDate?: unknown;
  applicationLastDate?: unknown;
  examDate?: unknown;

  eligibility?: unknown;
  matchedSignals?: unknown;

  modificationType?: unknown;

  confidence?: unknown;
  summary?: unknown;
  extractedText?: unknown;
}

function cleanString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\s+/g, ' ')
    .trim();
}

function nullableString(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned || null;
}

function nullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/,/g, '')
      .trim();

    const parsed = Number(cleaned);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => cleanString(item))
    .filter(Boolean);
}

function normalizeDate(value: unknown): string | null {
  const raw = cleanString(value);

  if (!raw) {
    return null;
  }

  /*
   * Already YYYY-MM-DD.
   */
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(raw)
  ) {
    return raw;
  }

  /*
   * DD/MM/YYYY
   * DD-MM-YYYY
   * DD.MM.YYYY
   */
  const dmy = raw.match(
    /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/,
  );

  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);

    if (
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return `${year}-${String(month).padStart(2, '0')}-${String(
        day,
      ).padStart(2, '0')}`;
    }
  }

  /*
   * YYYY/MM/DD
   * YYYY-MM-DD
   * YYYY.MM.DD
   */
  const ymd = raw.match(
    /^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/,
  );

  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]);
    const day = Number(ymd[3]);

    if (
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return `${year}-${String(month).padStart(2, '0')}-${String(
        day,
      ).padStart(2, '0')}`;
    }
  }

  /*
   * Month-name formats:
   *
   * 12 January 2026
   * January 12, 2026
   * 12 Jan 2026
   */
  const parsedTimestamp = Date.parse(raw);

  if (!Number.isNaN(parsedTimestamp)) {
    const date = new Date(parsedTimestamp);

    return `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1,
    ).padStart(2, '0')}-${String(
      date.getUTCDate(),
    ).padStart(2, '0')}`;
  }

  return null;
}

function normalizeAdvertisementNumber(
  value: unknown,
): string | null {
  const raw = cleanString(value);

  if (!raw) {
    return null;
  }

  /*
   * Remove common labels but preserve the actual identifier.
   *
   * Examples:
   * "Advt. No. 28/2025"
   * "Advertisement No. 28/2025"
   * "Notification No. 28/2025"
   */
  const cleaned = raw
    .replace(
      /^(advertisement|advertisment|advt|adv|notification|notice)\s*(number|no\.?|#)?\s*[:\-]?\s*/i,
      '',
    )
    .trim();

  return cleaned || raw;
}

function normalizeModificationType(
  value: unknown,
): OfficialModificationType {
  const raw = cleanString(value).toLowerCase();

  if (!raw) {
    return 'unknown';
  }

  if (
    raw.includes('corrigendum') ||
    raw.includes('correction')
  ) {
    return 'corrigendum';
  }

  if (
    raw.includes('extension') ||
    raw.includes('extended')
  ) {
    return 'extension';
  }

  if (
    raw.includes('revised') ||
    raw.includes('revision') ||
    raw.includes('modified') ||
    raw.includes('modification')
  ) {
    return 'revised';
  }

  if (
    raw.includes('cancelled') ||
    raw.includes('canceled') ||
    raw.includes('cancellation')
  ) {
    return 'cancellation';
  }

  if (
    raw.includes('postponed') ||
    raw.includes('postponement')
  ) {
    return 'postponement';
  }

  if (raw === 'original') {
    return 'original';
  }

  return 'unknown';
}

function clampConfidence(value: unknown): number {
  const number = nullableNumber(value);

  if (number === null) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number)),
  );
}

function extractJson(text: string): string {
  const cleaned = text.trim();

  /*
   * Gemini may return a markdown code block.
   */
  const fenced = cleaned.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i,
  );

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  /*
   * Try to locate the first JSON object.
   */
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    return cleaned.slice(
      firstBrace,
      lastBrace + 1,
    );
  }

  return cleaned;
}

function emptyResult(
  error?: string,
): OfficialPdfGeminiResult {
  return {
    success: false,

    isRecruitmentDocument: false,
    isLikelyNotification: false,

    title: '',
    organization: '',
    postName: '',

    advertisementNumber: null,
    documentDate: null,

    vacancies: null,

    applicationStartDate: null,
    applicationLastDate: null,
    examDate: null,

    eligibility: [],
    matchedSignals: [],

    modificationType: 'unknown',

    confidence: 0,

    summary: '',

    extractedText: '',

    error,
  };
}

function buildPrompt(
  targetJobTitle?: string,
): string {
  return `
You are SARJOM's official government recruitment document verification engine.

Your task is to examine the ACTUAL PDF document provided to you and determine whether it is an official recruitment document relevant to the target job.

The document may be:
- an original recruitment notification
- recruitment advertisement
- vacancy notification
- application notice
- corrigendum
- correction notice
- extension notice
- revised notification
- cancellation notice
- postponement notice
- another official recruitment-related document

TARGET JOB:
${targetJobTitle || 'Not explicitly provided'}

IMPORTANT:

1. READ THE ACTUAL PDF PAGES.
2. The PDF may be scanned or image-based.
3. Do not rely only on the filename.
4. Do not invent missing information.
5. If a field cannot be established confidently from the document, return null or an empty array.
6. Prefer information printed inside the official PDF over information inferred from the URL or filename.
7. Preserve official terminology where possible.
8. Dates must be returned as YYYY-MM-DD.
9. Number of vacancies must be a numeric value when confidently available.
10. Advertisement number must be extracted exactly enough to identify the recruitment.

ADVERTISEMENT / NOTIFICATION NUMBER:

Look carefully for:
- Advertisement No.
- Advertisement Number
- Advt. No.
- Advt No.
- Advt.
- Notification No.
- Recruitment No.
- Notice No.
- Advertisement / Notification reference number

Examples:
- 28/2025
- Advt. No. 12/2026
- Advertisement No. 45/2025
- No. 03/2026

Return ONLY the actual identifying number/reference in advertisementNumber.

Do NOT create an advertisement number if one is not visible or reliably extractable.

DOCUMENT DATE:

Find the date of the actual official document.

This may appear as:
- Date:
- Dated:
- Issued on:
- notification date
- corrigendum date
- extension date
- signed date

Return it as YYYY-MM-DD.

Do not confuse:
- application start date
- application closing date
- exam date

with the document publication/issue date.

MODIFICATION TYPE:

Classify the document as exactly one of:

original
corrigendum
extension
revised
cancellation
postponement
unknown

Use:

original
= original recruitment notification / advertisement.

corrigendum
= correction, corrigendum, erratum or correction of previously published recruitment information.

extension
= extension of application deadline or other recruitment deadline.

revised
= revised / modified / reopened recruitment notification where it replaces or materially changes the previous notification.

cancellation
= cancellation / withdrawal of recruitment.

postponement
= postponement of examination, recruitment process or scheduled recruitment event.

unknown
= cannot confidently determine.

IMPORTANT VERSION RULE:

A document that says "corrigendum", "correction", "extension", "revised", "cancelled", "cancellation", "postponed", or "postponement" should NOT automatically be classified as original even if the filename looks like a recruitment notification.

RECRUITMENT IDENTITY:

Extract:
- organization
- post name
- advertisement number
- vacancies
- application dates
- exam date
- eligibility

If this is a corrigendum or extension, identify the original recruitment whenever the document explicitly references it.

CONFLICT AVOIDANCE:

Never guess:
- vacancy numbers
- advertisement numbers
- dates
- eligibility
- exam dates

If uncertain, return null.

CONFIDENCE:

Give a confidence score from 0 to 100.

The confidence should reflect confidence in the extracted facts and classification, not merely whether the PDF looks official.

MATCHED SIGNALS:

Return short evidence signals such as:
- "Advertisement No. 28/2025 found"
- "Corrigendum explicitly identified"
- "Application deadline extended"
- "Official recruitment notification"
- "Organization name found"
- "Vacancy table found"
- "Exam date found"

Do not fabricate signals.

SUMMARY:

Provide a short factual summary explaining what the document is and what important recruitment information it contains.

OUTPUT:

Return ONLY valid JSON.

Use exactly this structure:

{
  "isRecruitmentDocument": true,
  "isLikelyNotification": true,
  "title": "",
  "organization": "",
  "postName": "",
  "advertisementNumber": null,
  "documentDate": null,
  "vacancies": null,
  "applicationStartDate": null,
  "applicationLastDate": null,
  "examDate": null,
  "eligibility": [],
  "matchedSignals": [],
  "modificationType": "original",
  "confidence": 0,
  "summary": "",
  "extractedText": ""
}
`;
}

function normalizeParsedResult(
  parsed: GeminiRawResult,
  extractedTextFallback = '',
): OfficialPdfGeminiResult {
  const modificationType =
    normalizeModificationType(
      parsed.modificationType,
    );

  return {
    success: true,

    isRecruitmentDocument:
      Boolean(
        parsed.isRecruitmentDocument,
      ),

    isLikelyNotification:
      Boolean(
        parsed.isLikelyNotification,
      ),

    title:
      cleanString(parsed.title),

    organization:
      cleanString(parsed.organization),

    postName:
      cleanString(parsed.postName),

    advertisementNumber:
      normalizeAdvertisementNumber(
        parsed.advertisementNumber,
      ),

    documentDate:
      normalizeDate(
        parsed.documentDate,
      ),

    vacancies:
      nullableNumber(
        parsed.vacancies,
      ),

    applicationStartDate:
      normalizeDate(
        parsed.applicationStartDate,
      ),

    applicationLastDate:
      normalizeDate(
        parsed.applicationLastDate,
      ),

    examDate:
      normalizeDate(
        parsed.examDate,
      ),

    eligibility:
      stringArray(
        parsed.eligibility,
      ),

    matchedSignals:
      stringArray(
        parsed.matchedSignals,
      ),

    modificationType,

    confidence:
      clampConfidence(
        parsed.confidence,
      ),

    summary:
      cleanString(
        parsed.summary,
      ),

    extractedText:
      cleanString(
        parsed.extractedText,
      ) ||
      extractedTextFallback,
  };
}

/**
 * Analyze an official recruitment PDF with Gemini.
 *
 * The PDF URL is fetched and sent to Gemini as inline PDF data.
 *
 * This function intentionally asks Gemini to inspect the actual
 * document pages because government recruitment PDFs are frequently
 * scanned/image-based.
 */
export async function analyzePdfWithGemini(
  url: string,
  targetJobTitle?: string,
): Promise<OfficialPdfGeminiResult> {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return emptyResult(
        'GEMINI_API_KEY is not configured.',
      );
    }

    if (!url) {
      return emptyResult(
        'PDF URL is empty.',
      );
    }

    const response =
      await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'SARJOM/2.0 Official Recruitment Verification Engine',
          Accept:
            'application/pdf,application/octet-stream;q=0.9,*/*;q=0.8',
        },
      });

    if (!response.ok) {
      return emptyResult(
        `Failed to download PDF: HTTP ${response.status}`,
      );
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) || '';

    const arrayBuffer =
      await response.arrayBuffer();

    const pdfBytes =
      Buffer.from(arrayBuffer);

    if (pdfBytes.length === 0) {
      return emptyResult(
        'Downloaded PDF is empty.',
      );
    }

    /*
     * Basic PDF signature validation.
     *
     * Some government servers return a HTML page instead of the
     * requested PDF. Detect that before sending it to Gemini.
     */
    const signature =
      pdfBytes
        .subarray(0, 5)
        .toString('ascii');

    if (
      signature !== '%PDF-' &&
      !contentType
        .toLowerCase()
        .includes('pdf')
    ) {
      return emptyResult(
        'URL did not return a valid PDF document.',
      );
    }

    const base64Pdf =
      pdfBytes.toString('base64');

    const genAI =
      new GoogleGenerativeAI(apiKey);

    /*
     * Gemini 2.5 Flash is used for document/PDF analysis.
     *
     * If your project already pins another Gemini model through
     * GEMINI_MODEL, that value is respected.
     */
    const modelName =
      process.env.GEMINI_MODEL ||
      'gemini-3.6-flash';

    const model =
      genAI.getGenerativeModel({
        model: modelName,

        generationConfig: {
          temperature: 0,
          responseMimeType:
            'application/json',
        },
      });

    const prompt =
      buildPrompt(
        targetJobTitle,
      );

    const result =
      await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Pdf,
          },
        },
        {
          text: prompt,
        },
      ]);

    const responseText =
      result.response.text();

    if (!responseText.trim()) {
      return emptyResult(
        'Gemini returned an empty response.',
      );
    }

    const jsonText =
      extractJson(
        responseText,
      );

    let parsed: GeminiRawResult;

    try {
      parsed =
        JSON.parse(
          jsonText,
        ) as GeminiRawResult;
    } catch {
      return emptyResult(
        'Gemini returned invalid JSON.',
      );
    }

    const normalized =
      normalizeParsedResult(
        parsed,
      );

    /*
     * Basic safety validation.
     *
     * Gemini must not be able to turn an obviously invalid result
     * into a publishable recruitment record.
     */
    if (
      normalized.isRecruitmentDocument &&
      normalized.confidence < 30
    ) {
      normalized.isLikelyNotification =
        false;
    }

    return normalized;
  } catch (error) {
    return emptyResult(
      error instanceof Error
        ? error.message
        : 'Unknown Gemini PDF analysis error.',
    );
  }
}
