import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveAnswerKey(
  answerKey: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (answerKey.contentType !== 'answer-key') {
    throw new Error(
      'Invalid answer key record: contentType must be "answer-key".',
    );
  }

  return sarjomRepository.saveRecord(answerKey);
}

export async function getAnswerKey(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'answer-key') {
    return null;
  }

  return record;
}

export async function listAnswerKeys(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'answer-key',
  );
}
