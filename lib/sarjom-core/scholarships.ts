import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveScholarship(
  scholarship: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (scholarship.contentType !== 'scholarship') {
    throw new Error(
      'Invalid scholarship record: contentType must be "scholarship".',
    );
  }

  return sarjomRepository.saveRecord(scholarship);
}

export async function getScholarship(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'scholarship') {
    return null;
  }

  return record;
}

export async function listScholarships(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'scholarship',
  );
}
