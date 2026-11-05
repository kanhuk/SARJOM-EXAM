import { ai, MODEL_NAME } from '../../gemini.js';
import {
  queryCanonicalJobs,
  type CanonicalJobResult,
} from './canonical-query.js';

export interface SarjomAIAnswer {
  answer: string;
  source: 'sarjom-canonical';
  generatedAt: string;
  recordsUsed: number;
  sources: Array<{
    recordId: string;
    title: string;
    officialUrl?: string;
    officialSource?: string;
    lastVerifiedAt?: string;
  }>;
}

function compactRecord(job: CanonicalJobResult) {
  return {
    id: job.id,
    title: job.title,
    organization: job.organization,
    category: job.category,
    stateCode: job.stateCode,
    districts: job.districts,
    vacancies: job.vacancies,
    qualification: job.qualification,
    ageLimit: job.ageLimit,
    salary: job.salary,
    applicationStartDate: job.applicationStartDate,
    applicationDeadline: job.applicationDeadline,
    examDate: job.examDate,
    lifecycle: job.lifecycle,
    primarySurface: job.primarySurface,
    officialUrl: job.officialUrl,
    officialSource: job.officialSource,
    admitCardUrl: job.admitCardUrl,
    answerKeyUrl: job.answerKeyUrl,
    resultUrl: job.resultUrl,
    lastVerifiedAt: job.lastVerifiedAt,
    sourceConfidence: job.sourceConfidence,
  };
}

export async function answerSarjomQuestion(
  question: string,
): Promise<SarjomAIAnswer> {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    throw new Error('Question is required.');
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'SARJOM AI is not configured: GEMINI_API_KEY is missing.',
    );
  }

  /*
   * Gemini receives ONLY records returned by the
   * canonical public AI query service.
   */
  const canonical = await queryCanonicalJobs({
    query: normalizedQuestion,
    limit: 10,
  });

  const records = canonical.jobs.map(compactRecord);

  const context = JSON.stringify(records, null, 2);

  const systemInstruction = `
You are SARJOM AI, the official AI assistant for SARJOM.

SOURCE-OF-TRUTH RULE:
- Use ONLY the SARJOM canonical records supplied below.
- Never invent vacancies, dates, eligibility, salary, deadlines,
  exam dates, results, admit-card status, answer-key status,
  organizations, or URLs.
- Do not use outside knowledge to fill missing SARJOM facts.
- If the supplied records do not contain the requested fact,
  clearly state that SARJOM does not currently have a verified
  canonical record for that fact.
- officialUrl and officialSource are provenance information.
- lastVerifiedAt indicates when the SARJOM record was last verified.
- If multiple records match, keep them separate.
- Never claim to have personally verified an external website.
- Be concise, factual and useful.
`;

  const prompt = `
USER QUESTION:
${normalizedQuestion}

SARJOM CANONICAL RECORDS:
${context}

Answer using only the canonical records above.
`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  const answer =
    typeof response.text === 'string' && response.text.trim()
      ? response.text.trim()
      : records.length
        ? 'SARJOM AI could not generate a response from the verified records.'
        : 'SARJOM does not currently have a verified canonical record matching this question.';

  return {
    answer,
    source: 'sarjom-canonical',
    generatedAt: new Date().toISOString(),
    recordsUsed: records.length,
    sources: canonical.jobs.map(job => ({
      recordId: job.id,
      title: job.title,
      officialUrl: job.officialUrl,
      officialSource: job.officialSource,
      lastVerifiedAt: job.lastVerifiedAt,
    })),
  };
}
