export type JobSourceType =
  | 'government'
  | 'psu'
  | 'bank'
  | 'university'
  | 'private-company'
  | 'job-portal'
  | 'recruitment-portal'
  | 'research'
  | 'hospital'
  | 'defence'
  | 'other';

export type JobCategory =
  | 'government'
  | 'private'
  | 'banking'
  | 'railway'
  | 'defence'
  | 'police'
  | 'teaching'
  | 'research'
  | 'healthcare'
  | 'engineering'
  | 'internship'
  | 'apprenticeship'
  | 'fellowship'
  | 'other';

export interface JobSource {
  id: string;
  name: string;
  url: string;
  type: JobSourceType;

  /**
   * Discovery sources help SARJOM find opportunities.
   * They are not necessarily the final official authority.
   */
  discovery: boolean;

  /**
   * Official sources are preferred for verification.
   */
  official: boolean;

  enabled: boolean;

  country?: string;
  state?: string;

  /**
   * Optional source-specific tags used by the discovery engine.
   */
  tags?: string[];
}

export interface DiscoveredJob {
  id: string;

  title: string;
  organization: string;

  source: string;
  sourceUrl: string;

  /**
   * Official application/notification URL when discovered.
   */
  officialUrl?: string;

  sourceType: JobSourceType;
  category: JobCategory;

  location?: string;
  state?: string;

  vacancies?: number;

  qualification?: string;
  ageLimit?: string;
  salary?: string;

  applicationStartDate?: string;
  applicationDeadline?: string;
  examDate?: string;
  publishedAt?: string;

  description?: string;

  /**
   * AI/relevance quality score from 0–100.
   */
  relevanceScore: number;

  /**
   * Verification confidence from 0–100.
   */
  verificationScore: number;

  verified: boolean;

  /**
   * Whether this record is still considered active.
   */
  status: 'new' | 'open' | 'closing-soon' | 'expired';

  discoveredAt: string;

  keywords: string[];
}