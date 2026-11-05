import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

export async function saveAdmitCard(
  admitCard: SarjomGenericRecord,
): Promise<SarjomGenericRecord> {
  if (admitCard.contentType !== 'admit-card') {
    throw new Error(
      'Invalid admit card record: contentType must be "admit-card".',
    );
  }

  return sarjomRepository.saveRecord(admitCard);
}

export async function getAdmitCard(
  id: string,
): Promise<SarjomGenericRecord | null> {
  const record = await sarjomRepository.getRecord(id);

  if (!record || record.contentType !== 'admit-card') {
    return null;
  }

  return record;
}

export async function listAdmitCards(): Promise<SarjomGenericRecord[]> {
  const records = await sarjomRepository.listRecords();

  return records.filter(
    record => record.contentType === 'admit-card',
  );
}
