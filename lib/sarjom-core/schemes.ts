import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveScheme(
  scheme: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (scheme.contentType !== 'scheme') {
    throw new Error(
      'Invalid scheme record: contentType must be "scheme".',
    );
  }

  return sarjomRepository.saveRecord(scheme);
}

export async function getScheme(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record =
    await sarjomRepository.getRecord(id);

  if (
    !record ||
    record.contentType !== 'scheme'
  ) {
    return null;
  }

  return record;
}

export async function listSchemes(): Promise<
  SarjomGenericRecord[]
> {
  const records =
    await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'scheme',
  );
}
