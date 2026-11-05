import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveResult(
  result: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (result.contentType !== 'result') {
    throw new Error(
      'Invalid result record: contentType must be "result".',
    );
  }

  return sarjomRepository.saveRecord(result);
}

export async function getResult(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'result') {
    return null;
  }

  return record;
}

export async function listResults(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'result',
  );
}
