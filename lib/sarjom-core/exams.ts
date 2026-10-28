import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveExam(
  exam: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (exam.contentType !== 'exam') {
    throw new Error(
      'Invalid exam record: contentType must be "exam".',
    );
  }

  return sarjomRepository.saveRecord(exam);
}

export async function getExam(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'exam') {
    return null;
  }

  return record;
}

export async function listExams(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'exam',
  );
}
