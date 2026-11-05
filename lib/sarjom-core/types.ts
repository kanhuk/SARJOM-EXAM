import type { DiscoveredJob } from '../job-discovery/types.js';
import type { RecruitmentSurface } from '../job-discovery/recruitment-lifecycle.js';

export type SarjomContentType =
  | 'job' | 'scheme' | 'scholarship' | 'service' | 'syllabus'
  | 'admit-card' | 'exam' | 'answer-key' | 'result' | 'pyq'
  | 'candidate_preference';

export type RecruitmentLifecycle =
  | 'upcoming' | 'open' | 'closing-soon' | 'closed'
  | 'admit-card-pending' | 'admit-card-released' | 'exam-scheduled'
  | 'exam-completed' | 'answer-key-released' | 'result-released'
  | 'cancelled' | 'postponed' | 'unknown';

export type PublicationStatus = 'published' | 'hold-for-review' | 'draft';

export interface OfficialDocumentRef {
  title: string;
  url: string;
  type: string;
  official: boolean;
  sha256?: string;
  documentId?: string;
  publishedAt?: string | null;
}

export interface SarjomReconciliationSnapshot {
  publicationStatus: 'publish' | 'publish-with-warning' | 'hold-for-review';
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  safeToPublish: boolean;
  summary: string;
  warnings: string[];
  conflicts: Array<{
    field: string;
    severity: string;
    values: Array<{ value: string | number | null; sourceType: string; sourceUrl: string }>;
    officialPreferredValue?: string | number | null;
    reason: string;
  }>;
  versionDecision: string;
  changedFields: string[];
  versionReasons: string[];
}

export interface SarjomJob extends DiscoveredJob {
  contentType: 'job';
  lifecycle: RecruitmentLifecycle;
  stateCode?: string;
  districts?: string[];
  organizationShortName?: string;
  officialDomain?: string;
  officialNotificationUrl?: string;
  officialWebsiteUrl?: string;
  officialDocuments?: OfficialDocumentRef[];
  advertisementNumber?: string | null;
  eligibility?: string[];
  admitCardUrl?: string;
  resultUrl?: string;
  answerKeyUrl?: string;
  lastVerifiedAt?: string;
  sourceConfidence?: number;
  isExpected?: boolean;
  expectedVacancies?: number | null;
  expectedNotificationDate?: string | null;
  expectedConfidence?: number | null;
  superseded?: boolean;
  supersededBy?: string | null;
  versionReason?: string[];

  /**
   * Automatic recruitment lifecycle routing metadata.
   *
   * These fields are derived from the current date and recruitment facts.
   * They do not replace the existing lifecycle type used by the core/dashboard.
   */
  primarySurface?: RecruitmentSurface;
  notificationSurfaces?: RecruitmentSurface[];
  applicationOpen?: boolean;
  closingSoon?: boolean;
  applicationEnded?: boolean;
  admitCardAvailable?: boolean;
  admitCardPending?: boolean;
  examDateKnown?: boolean;
  examDatePassed?: boolean;
  daysUntilDeadline?: number | null;
  daysUntilExam?: number | null;
  lifecycleUpdatedAt?: string;

  /** Automatic publication safety gate. */
  publicationStatus?: PublicationStatus;
  reviewRequired?: boolean;
  publicationReason?: string;
  reconciliation?: SarjomReconciliationSnapshot;
}

export interface SarjomGenericRecord {
  id: string;
    contentType: SarjomContentType;
title: string;
  description?: string;
  stateCode?: string;
  districts?: string[];
  officialUrl?: string;
  officialSource?: string;
  publishedAt?: string;
  updatedAt?: string;
  lastVerifiedAt?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface ContactTicket {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  category: 'incorrect-information' | 'job-question' | 'scheme-question' | 'scholarship-question' | 'technical' | 'suggestion' | 'other';
  priority: 'low' | 'normal' | 'high';
  name?: string;
  email?: string;
  mobile?: string;
  message: string;
  relatedJobId?: string;
  aiTriage?: {
    category?: ContactTicket['category'];
    priority?: ContactTicket['priority'];
    relatedJobId?: string;
    summary?: string;
  };
}

export interface AdminChange {
  id: string;
    entityType?: string;
createdAt: string;
  actor: 'admin' | 'admin-ai';
  entityId: string;
  action: string;
    planSignature?: string;
    before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
}








