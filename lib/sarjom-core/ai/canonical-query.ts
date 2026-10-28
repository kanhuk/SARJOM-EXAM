import { sarjomRepository } from '../repository.js';
import type { SarjomJob } from '../types.js';

export interface CanonicalJobSource {
  recordId: string;
  officialUrl?: string;
  sourceUrl?: string;
  officialSource?: string;
  lastVerifiedAt?: string;
  sourceConfidence?: number;
}

export interface CanonicalJobResult {
  id: string;
  title: string;
  organization: string;
  category: string;
  stateCode?: string;
  districts?: string[];
  vacancies?: number;
  qualification?: string;
  ageLimit?: string;
  salary?: string;
  applicationStartDate?: string;
  applicationDeadline?: string;
  examDate?: string;
  lifecycle: SarjomJob['lifecycle'];
  publicationStatus?: SarjomJob['publicationStatus'];
  primarySurface?: string;
  officialUrl?: string;
  sourceUrl?: string;
  officialSource?: string;
  admitCardUrl?: string;
  answerKeyUrl?: string;
  resultUrl?: string;
  lastVerifiedAt?: string;
  sourceConfidence?: number;
  source: CanonicalJobSource;
}

export interface CanonicalJobQuery {
  query?: string;
  lifecycle?: SarjomJob['lifecycle'];
  stateCode?: string;
  district?: string;
  limit?: number;
}

export interface CanonicalJobResponse {
  success: true;
  source: 'sarjom-canonical';
  generatedAt: string;
  count: number;
  jobs: CanonicalJobResult[];
}

function isPublicCanonicalJob(job: SarjomJob): boolean {
  if (job.superseded === true) return false;
  if (job.publicationStatus === 'hold-for-review') return false;
  if (job.publicationStatus === 'draft') return false;
  if (job.reviewRequired === true) return false;
  if (job.lifecycle === 'unknown') return false;

  /*
   * A published record is required for public AI.
   * Older records without publicationStatus are allowed only when
   * they are otherwise clearly safe and verified.
   */
  if (
    job.publicationStatus !== undefined &&
    job.publicationStatus !== 'published'
  ) {
    return false;
  }

  return true;
}

function matchesQuery(job: SarjomJob, query?: string): boolean {
  if (!query) return true;

  const normalized = query.toLowerCase().trim();
  if (!normalized) return true;

  const haystack = [
    job.title,
    job.organization,
    job.category,
    job.stateCode,
    ...(job.districts ?? []),
    ...(job.keywords ?? []),
    job.description,
    job.qualification,
    job.salary,
    job.lifecycle,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized) ||
    normalized
      .split(/\s+/)
      .filter(Boolean)
      .some(token => token.length >= 2 && haystack.includes(token));
}

function matchesDistrict(job: SarjomJob, district?: string): boolean {
  if (!district) return true;

  const normalized = district.toLowerCase().trim();

  return (job.districts ?? []).some(
    value => value.toLowerCase() === normalized,
  );
}

function toCanonicalJob(job: SarjomJob): CanonicalJobResult {
  return {
    id: job.id,
    title: job.title,
    organization: job.organization,
    category: job.category,
    stateCode: job.stateCode,
    districts: job.districts,
    vacancies: job.vacancies,
    qualification: job.qualification,
    ageLimit: job.ageLimit,
    salary: job.salary,
    applicationStartDate: job.applicationStartDate,
    applicationDeadline: job.applicationDeadline,
    examDate: job.examDate,
    lifecycle: job.lifecycle,
    publicationStatus: job.publicationStatus,
    primarySurface: job.primarySurface,
    officialUrl: job.officialUrl,
    sourceUrl: job.sourceUrl,
    officialSource: job.source,
    admitCardUrl: job.admitCardUrl,
    answerKeyUrl: job.answerKeyUrl,
    resultUrl: job.resultUrl,
    lastVerifiedAt: job.lastVerifiedAt,
    sourceConfidence: job.sourceConfidence,
    source: {
      recordId: job.id,
      officialUrl: job.officialUrl,
      sourceUrl: job.sourceUrl,
      officialSource: job.source,
      lastVerifiedAt: job.lastVerifiedAt,
      sourceConfidence: job.sourceConfidence,
    },
  };
}

export async function queryCanonicalJobs(
  input: CanonicalJobQuery = {},
): Promise<CanonicalJobResponse> {
  const limit = Math.max(
    1,
    Math.min(
      Number.isFinite(input.limit) ? Number(input.limit) : 10,
      50,
    ),
  );

  const stateCode = input.stateCode?.trim().toUpperCase();
  const district = input.district?.trim();

  const jobs = await sarjomRepository.listJobs();

  const filtered = jobs
    .filter(isPublicCanonicalJob)
    .filter(job => !stateCode || job.stateCode === stateCode)
    .filter(job => !input.lifecycle || job.lifecycle === input.lifecycle)
    .filter(job => matchesDistrict(job, district))
    .filter(job => matchesQuery(job, input.query))
    .sort((a, b) => {
      const aVerified = a.lastVerifiedAt ? Date.parse(a.lastVerifiedAt) : 0;
      const bVerified = b.lastVerifiedAt ? Date.parse(b.lastVerifiedAt) : 0;
      return bVerified - aVerified;
    })
    .slice(0, limit)
    .map(toCanonicalJob);

  return {
    success: true,
    source: 'sarjom-canonical',
    generatedAt: new Date().toISOString(),
    count: filtered.length,
    jobs: filtered,
  };
}

export async function getCanonicalJob(
  id: string,
): Promise<CanonicalJobResult | null> {
  const job = await sarjomRepository.getJob(id);

  if (!job || !isPublicCanonicalJob(job)) {
    return null;
  }

  return toCanonicalJob(job);
}

export function isPublicCanonicalRecord(job: SarjomJob): boolean {
  return isPublicCanonicalJob(job);
}

