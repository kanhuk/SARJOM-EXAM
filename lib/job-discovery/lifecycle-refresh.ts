/**
 * SARJOM Lifecycle Refresh Engine
 *
 * Re-evaluates stored recruitment records without re-running discovery/Gemini.
 * This is intentionally separate from discovery so a daily refresh is cheap.
 *
 * It:
 * 1. Takes stored recruitment records.
 * 2. Recalculates lifecycle using today's date.
 * 3. Produces the public dashboard routing.
 * 4. Never changes factual recruitment fields.
 * 5. Preserves reviewRequired records as blocked.
 */

import {
  classifyRecruitmentLifecycle,
  type RecruitmentLifecycleInput,
  type RecruitmentLifecycleResult,
  type RecruitmentSurface,
  type RecruitmentLifecycle,
} from './recruitment-lifecycle.js';

export interface StoredRecruitmentRecord
  extends RecruitmentLifecycleInput {
  updatedAt?: string | null;
  lifecycle?: RecruitmentLifecycle | null;
  primarySurface?: RecruitmentSurface | null;
  notificationSurfaces?: RecruitmentSurface[];
}

export interface LifecycleRefreshItem {
  id: string;
  previousLifecycle: RecruitmentLifecycle | null;
  lifecycle: RecruitmentLifecycle;
  changed: boolean;
  previousPrimarySurface: RecruitmentSurface | null;
  primarySurface: RecruitmentSurface;
  result: RecruitmentLifecycleResult;
}

export interface LifecycleRefreshResult {
  refreshedAt: string;
  total: number;
  changed: number;
  unchanged: number;
  blockedForReview: number;
  items: LifecycleRefreshItem[];
}

function isoDate(date: Date): string {
  return date.toISOString();
}

export function refreshRecruitmentLifecycles(
  records: StoredRecruitmentRecord[],
  today: Date = new Date(),
): LifecycleRefreshResult {
  const items: LifecycleRefreshItem[] = [];

  for (const record of records) {
    const result =
      classifyRecruitmentLifecycle(
        record,
        today,
      );

    const previousLifecycle =
      record.lifecycle ?? null;

    const previousPrimarySurface =
      record.primarySurface ?? null;

    const changed =
      previousLifecycle !==
        result.lifecycle ||
      previousPrimarySurface !==
        result.primarySurface;

    items.push({
      id: record.id,
      previousLifecycle,
      lifecycle: result.lifecycle,
      changed,
      previousPrimarySurface,
      primarySurface:
        result.primarySurface,
      result,
    });
  }

  return {
    refreshedAt: isoDate(today),
    total: items.length,
    changed: items.filter(
      item => item.changed,
    ).length,
    unchanged: items.filter(
      item => !item.changed,
    ).length,
    blockedForReview: items.filter(
      item =>
        item.lifecycle ===
        'review-required',
    ).length,
    items,
  };
}

/**
 * Apply only lifecycle/routing fields to an existing record.
 *
 * Factual fields are deliberately untouched.
 */
export function applyLifecycleRefresh(
  record: StoredRecruitmentRecord,
  result: LifecycleRefreshResult,
): StoredRecruitmentRecord {
  const item = result.items.find(
    candidate =>
      candidate.id === record.id,
  );

  if (!item) {
    return record;
  }

  return {
    ...record,

    lifecycle:
      item.lifecycle,

    primarySurface:
      item.primarySurface,

    notificationSurfaces:
      item.result.notificationSurfaces,

    updatedAt:
      record.updatedAt ??
      result.refreshedAt,
  };
}
