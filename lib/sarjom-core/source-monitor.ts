import crypto from 'node:crypto';
import { crawlOfficialRecruitmentPage } from '../job-discovery/official-crawler.js';
import { OFFICIAL_SOURCE_REGISTRY } from './source-registry.js';
import { sarjomRepository } from './repository.js';
import { processOfficialCandidate } from './auto-engine.js';
import type { DiscoveredJob, JobCategory } from '../job-discovery/types.js';

function id(value: string): string { return crypto.createHash('sha256').update(value).digest('hex').slice(0, 20); }

function category(tags: string[]): JobCategory {
  const t = tags.map(x => x.toLowerCase());
  if (t.includes('railway')) return 'railway';
  if (t.includes('banking')) return 'banking';
  if (t.includes('defence')) return 'defence';
  if (t.includes('odisha')) return 'government';
  return 'government';
}

function isPdf(url: string): boolean { return /\.pdf(?:[?#].*)?$/i.test(url); }

export interface SourceMonitorResult {
  sourcesChecked: number;
  candidatesSeen: number;
  newJobs: number;
  analyzed: number;
  heldForReview: number;
  errors: string[];
}

export async function monitorOfficialSources(): Promise<SourceMonitorResult> {
  const result: SourceMonitorResult = {
    sourcesChecked: 0,
    candidatesSeen: 0,
    newJobs: 0,
    analyzed: 0,
    heldForReview: 0,
    errors: [],
  };

  const existing = await sarjomRepository.listJobs();
  const knownUrls = new Set(
    existing.flatMap(j => [j.sourceUrl, j.officialUrl, j.officialNotificationUrl].filter(Boolean) as string[]),
  );

  const limit = Math.max(
    1,
    Math.min(
      OFFICIAL_SOURCE_REGISTRY.length,
      Number(process.env.SARJOM_MONITOR_SOURCE_LIMIT || OFFICIAL_SOURCE_REGISTRY.length),
    ),
  );
  const perSource = Math.max(
    1,
    Math.min(5, Number(process.env.SARJOM_MONITOR_CANDIDATES || 3)),
  );

  for (const source of OFFICIAL_SOURCE_REGISTRY.slice(0, limit)) {
    result.sourcesChecked++;

    try {
      const crawl = await crawlOfficialRecruitmentPage(
        source.website,
        `${source.shortName} recruitment`,
        source.name,
      );

      const candidates = crawl.candidates
        .filter(c => c.score >= 35)
        .slice(0, perSource);

      result.candidatesSeen += candidates.length;

      for (const candidate of candidates) {
        if (knownUrls.has(candidate.url)) continue;

        const synthetic: DiscoveredJob = {
          id: id(`${source.id}:${candidate.url}`),
          title: candidate.title || `${source.shortName} Recruitment`,
          organization: source.name,
          source: source.shortName,
          sourceUrl: candidate.url,
          sourceType: 'government',
          category: category(source.tags),
          state: source.state,
          relevanceScore: Math.min(100, candidate.score),
          verificationScore: 0,
          verified: false,
          status: 'new',
          discoveredAt: new Date().toISOString(),
          keywords: source.tags,
        };

        if (!isPdf(candidate.url)) {
          /*
           * The existing official crawler can discover an HTML recruitment
           * page. The candidate itself is still passed through the official
           * pipeline; if it is not a PDF, the pipeline will place it on hold
           * rather than pretending it is a verified notification.
           */
        }

        try {
          result.analyzed++;

          const processed = await processOfficialCandidate({
            job: synthetic,
            documentUrl: candidate.url,
            documentTitle: candidate.title,
            officialWebsiteUrl: source.website,
            officialDomain: source.domains[0],
          });

          knownUrls.add(candidate.url);

          if (processed.job.reviewRequired) {
            result.heldForReview++;
          } else {
            result.newJobs++;
          }
        } catch (error) {
          result.errors.push(
            `${source.shortName}: ${candidate.url}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
    } catch (error) {
      result.errors.push(
        `${source.shortName}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return result;
}
