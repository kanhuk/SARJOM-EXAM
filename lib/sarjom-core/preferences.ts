import { sarjomRepository } from './repository.js';
import type { SarjomGenericRecord } from './types.js';

const PREF_PREFIX = 'pref_';

function preferenceId(userId: string): string {
  return `${PREF_PREFIX}${userId}`;
}

/**
 * Get candidate exam preferences.
 * Returns empty array if no preference record exists.
 */
export async function getCandidatePreferences(
  userId: string,
): Promise<string[]> {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const record = await sarjomRepository.getRecord(preferenceId(userId));

  if (!record || record.contentType !== 'candidate_preference') {
    return [];
  }

  const selected = record.metadata?.selectedExamIds;

  if (!Array.isArray(selected)) {
    return [];
  }

  return selected.filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
}

/**
 * Save candidate exam preferences.
 * Creates or updates the preference record.
 */
export async function saveCandidatePreferences(
  userId: string,
  selectedExamIds: string[],
): Promise<SarjomGenericRecord> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required');
  }

  const cleanIds = Array.isArray(selectedExamIds)
    ? selectedExamIds
        .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        .map(id => id.trim())
    : [];

  const uniqueIds = Array.from(new Set(cleanIds));

  const record: SarjomGenericRecord = {
    id: preferenceId(userId),
    contentType: 'candidate_preference',
    title: `Preferences for ${userId}`,
    status: 'published',
    updatedAt: new Date().toISOString(),
    metadata: {
      userId,
      selectedExamIds: uniqueIds,
      updatedAt: new Date().toISOString(),
    },
  };

  return sarjomRepository.saveRecord(record);
}

/**
 * Add one exam to candidate preferences.
 */
export async function addExamPreference(
  userId: string,
  examId: string,
): Promise<string[]> {
  const current = await getCandidatePreferences(userId);
  if (!current.includes(examId)) {
    current.push(examId);
  }
  await saveCandidatePreferences(userId, current);
  return current;
}

/**
 * Remove one exam from candidate preferences.
 */
export async function removeExamPreference(
  userId: string,
  examId: string,
): Promise<string[]> {
  const current = await getCandidatePreferences(userId);
  const updated = current.filter(id => id !== examId);
  await saveCandidatePreferences(userId, updated);
  return updated;
}


