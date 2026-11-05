import { sarjomRepository } from './repository.js';
import { isVerifiedPyq } from './pyqs.js';
import type { SarjomGenericRecord } from './types.js';

export interface SarjomSearchResult {
  type: 'record';
  score: number;
  item: SarjomGenericRecord;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function scoreText(query: string, text: string): number {
  const q = normalize(query);
  const t = normalize(text);
  if (!q || !t) return 0;
  if (t.includes(q)) return 100;
  const tokens = q.split(' ').filter(token => token.length >= 2);
  if (!tokens.length) return 0;
  const matched = tokens.filter(token => t.includes(token)).length;
  return Math.round((matched / tokens.length) * 80);
}

export async function searchSarjom(query: string, limit = 20): Promise<SarjomSearchResult[]> {
  // RETAINED_SEARCH_PATCH_V1: exam-preparation content only.
  const records = await sarjomRepository.listRecords();
  const results: SarjomSearchResult[] = [];
  const retainedTypes = new Set([
    'exam', 'syllabus', 'pyq', 'admit-card', 'answer-key', 'result',
  ]);

  for (const record of records) {
    if (!retainedTypes.has(record.contentType)) continue;
    if (record.contentType === 'pyq' && !isVerifiedPyq(record)) continue;

    const text = [
      record.title,
      record.description,
      record.contentType,
      record.stateCode,
      ...(record.districts || []),
      record.officialSource,
      ...Object.values(record.metadata || {}).filter(
        (value): value is string => typeof value === 'string',
      ),
    ].filter(Boolean).join(' ');

    const score = scoreText(query, text);
    if (score > 0) results.push({ type: 'record', score, item: record });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(limit, 50)));
}


