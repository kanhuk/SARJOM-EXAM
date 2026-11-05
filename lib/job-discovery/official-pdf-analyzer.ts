
import { PDFParse } from 'pdf-parse';
export interface OfficialPdfAnalysis {
  url: string;
  title: string;

  pageCount: number;
  textLength: number;

  score: number;
  matchedSignals: string[];

  isRecruitmentDocument: boolean;
  isLikelyNotification: boolean;

  extractedText: string;
}

const REQUEST_TIMEOUT_MS = 30000;
const MAX_PDF_BYTES = 15_000_000;
const MAX_TEXT_FOR_ANALYSIS = 60_000;

async function downloadPdf(
  url: string,
): Promise<Buffer> {
  const controller =
    new AbortController();

  const timer =
    setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

  try {
    const response =
      await fetch(url, {
        signal:
          controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 SARJOM Official Document Analyzer',
        },
      });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`,
      );
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) || '';

    if (
      !contentType.toLowerCase().includes('pdf') &&
      !url.toLowerCase().includes('.pdf')
    ) {
      throw new Error(
        `Expected PDF but received ${contentType || 'unknown content type'}`,
      );
    }

    const contentLength =
      response.headers.get(
        'content-length',
      );

    if (
      contentLength &&
      Number(contentLength) >
        MAX_PDF_BYTES
    ) {
      throw new Error(
        `PDF exceeds ${MAX_PDF_BYTES} bytes`,
      );
    }

    const arrayBuffer =
      await response.arrayBuffer();

    if (
      arrayBuffer.byteLength >
      MAX_PDF_BYTES
    ) {
      throw new Error(
        `PDF exceeds ${MAX_PDF_BYTES} bytes`,
      );
    }

    return Buffer.from(
      arrayBuffer,
    );
  } finally {
    clearTimeout(timer);
  }
}

function normalizeText(
  text: string,
): string {
  return text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function analyzeText(
  text: string,
): {
  score: number;
  matchedSignals: string[];
  isRecruitmentDocument: boolean;
  isLikelyNotification: boolean;
} {
  const normalized =
    text
      .toLowerCase()
      .replace(/\s+/g, ' ');

  let score = 0;

  const matchedSignals: string[] =
    [];

  function signal(
    pattern: RegExp,
    points: number,
    name: string,
  ) {
    if (
      pattern.test(normalized)
    ) {
      score += points;
      matchedSignals.push(name);
    }
  }

  /*
   * Strong recruitment signals.
   */
  signal(
    /\brailway recruitment board\b/i,
    30,
    'Railway Recruitment Board',
  );

  signal(
    /\brrb\b/i,
    20,
    'RRB',
  );

  signal(
    /\bjunior engineer\b/i,
    30,
    'Junior Engineer',
  );

  signal(
    /\b(?:je|j\.e\.)\b/i,
    15,
    'JE',
  );

  signal(
    /\bcentralised employment notice\b/i,
    35,
    'Centralised Employment Notice',
  );

  signal(
    /\bcen\b/i,
    20,
    'CEN',
  );

  signal(
    /\brecruitment\b/i,
    15,
    'Recruitment',
  );

  signal(
    /\bvacancies?\b/i,
    10,
    'Vacancy',
  );

  signal(
    /\bposts?\b/i,
    5,
    'Posts',
  );

  /*
   * Notification signals.
   */
  signal(
    /\bnotification\b/i,
    15,
    'Notification',
  );

  signal(
    /\bofficial notification\b/i,
    20,
    'Official Notification',
  );

  signal(
    /\bemployment notice\b/i,
    20,
    'Employment Notice',
  );

  signal(
    /\badvertisement\b/i,
    15,
    'Advertisement',
  );

  signal(
    /\bapplications?\s+(?:are\s+)?invited\b/i,
    15,
    'Applications Invited',
  );

  /*
   * Application-related signals.
   */
  signal(
    /\bapply online\b/i,
    10,
    'Apply Online',
  );

  signal(
    /\bonline application\b/i,
    10,
    'Online Application',
  );

  signal(
    /\blast date\b/i,
    10,
    'Last Date',
  );

  signal(
    /\bimportant dates?\b/i,
    10,
    'Important Dates',
  );

  /*
   * Decide whether the document is
   * actually recruitment-related.
   */
  const recruitmentCore =
    [
      /\brrb\b/i,
      /\brailway recruitment board\b/i,
      /\bjunior engineer\b/i,
      /\bcentralised employment notice\b/i,
      /\bcen\b/i,
    ].some(
      (pattern) =>
        pattern.test(
          normalized,
        ),
    );

  const recruitmentSupport =
    [
      /\brecruitment\b/i,
      /\bvacancies?\b/i,
      /\bnotification\b/i,
      /\bapplications?\s+(?:are\s+)?invited\b/i,
      /\bapply online\b/i,
    ].filter(
      (pattern) =>
        pattern.test(
          normalized,
        ),
    ).length;

  const isRecruitmentDocument =
    recruitmentCore &&
    recruitmentSupport >= 1;

  const isLikelyNotification =
    isRecruitmentDocument &&
    (
      /\bnotification\b/i.test(
        normalized,
      ) ||
      /\bcentralised employment notice\b/i.test(
        normalized,
      ) ||
      /\bcen\b/i.test(
        normalized,
      ) ||
      /\badvertisement\b/i.test(
        normalized,
      )
    );

  return {
    score: Math.min(
      100,
      score,
    ),
    matchedSignals,
    isRecruitmentDocument,
    isLikelyNotification,
  };
}

export async function analyzeOfficialPdf(
  url: string,
  title = '',
): Promise<OfficialPdfAnalysis> {
  const buffer =
    await downloadPdf(url);

  const parser =
  new PDFParse({
    data: buffer,
  });

const parsed =
  await parser.getText();

const info =
  await parser.getInfo({
    parsePageInfo: true,
  });

await parser.destroy();

const text =
  normalizeText(
    parsed.text || '',
  );

const pageCount =
  info.total || 0;
  const analysisText =
    text.slice(
      0,
      MAX_TEXT_FOR_ANALYSIS,
    );

  const analysis =
    analyzeText(
      analysisText,
    );

  return {
    url,
    title:
      title || url,
    pageCount,
    textLength:
      text.length,
    score:
      analysis.score,
    matchedSignals:
      analysis.matchedSignals,
    isRecruitmentDocument:
      analysis.isRecruitmentDocument,
    isLikelyNotification:
      analysis.isLikelyNotification,
    extractedText:
      analysisText,
  };
}