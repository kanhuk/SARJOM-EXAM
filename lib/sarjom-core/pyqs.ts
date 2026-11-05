import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

function validQuestion(record: SarjomGenericRecord): boolean {
  const m = record.metadata;
  if (!m || record.contentType !== 'pyq') return false;

  const options = m.options;
  const answerIndex = m.answerIndex;

  return (
    record.status === 'published' &&
    Boolean(record.officialUrl?.trim()) &&
    Boolean(record.officialSource?.trim()) &&
    Boolean(record.lastVerifiedAt) &&
    Number.isFinite(Date.parse(record.lastVerifiedAt ?? '')) &&
    m.verificationStatus === 'verified' &&
    typeof m.question === 'string' &&
    Boolean(m.question.trim()) &&
    Array.isArray(options) &&
    options.length >= 2 &&
    options.every(option => typeof option === 'string') &&
    typeof answerIndex === 'number' &&
    Number.isInteger(answerIndex) &&
    answerIndex >= 0 &&
    answerIndex < options.length
  );
}

export async function savePyq(
  record: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (!validQuestion(record)) {
    throw new Error(
      'PYQ rejected: a published record must have verified status, official provenance, question options, and a valid answer index.',
    );
  }

  return sarjomRepository.saveRecord(record);
}

export async function getPyq(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);
  return record && validQuestion(record) ? record : null;
}

export async function listPyqs(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();
  return records.filter(validQuestion);
}

export { validQuestion as isVerifiedPyq };
