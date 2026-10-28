import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveSyllabus(
  syllabus: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (syllabus.contentType !== 'syllabus') {
    throw new Error(
      'Invalid syllabus record: contentType must be "syllabus".',
    );
  }

  return sarjomRepository.saveRecord(syllabus);
}

export async function getSyllabus(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'syllabus') {
    return null;
  }

  return record;
}

export async function listSyllabi(): Promise<
  SarjomGenericRecord[]
> {
  const records =
    await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'syllabus',
  );
}
