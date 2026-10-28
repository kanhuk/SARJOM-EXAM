import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveService(
  service: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (service.contentType !== 'service') {
    throw new Error(
      'Invalid service record: contentType must be "service".',
    );
  }

  return sarjomRepository.saveRecord(service);
}

export async function getService(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'service') {
    return null;
  }

  return record;
}

export async function listServices(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'service',
  );
}
