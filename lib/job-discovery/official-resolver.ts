import type { DiscoveredJob } from './types.js';

export interface OfficialSourceResult {
  officialDomain?: string;
  officialUrl?: string;
  notificationUrl?: string;
  confidence: number;
  found: boolean;
  reason: string;
}

interface OrganizationRule {
  patterns: RegExp[];
  domain: string;
  domains?: string[];
}

const ORGANIZATION_RULES: OrganizationRule[] = [
  {
    patterns: [
      /\bunion public service commission\b/i,
      /\bUPSC\b/i,
    ],
    domain: 'upsc.gov.in',
  },
  {
    patterns: [
      /\bstaff selection commission\b/i,
      /\bSSC\b/i,
    ],
    domain: 'ssc.gov.in',
  },
  {
    patterns: [
      /\brailway recruitment board\b/i,
      /\bRRB\b/i,
    ],
    domain: 'indianrailways.gov.in',
    domains: [
      'indianrailways.gov.in',
      'rrbcdg.gov.in',
    ],
  },
  {
    patterns: [
      /\bstate bank of india\b/i,
      /\bSBI\b/i,
    ],
    domain: 'sbi.co.in',
  },
  {
    patterns: [
      /\bnational thermal power corporation\b/i,
      /\bNTPC\b/i,
    ],
    domain: 'ntpc.co.in',
  },
  {
    patterns: [
      /\bindian space research organisation\b/i,
      /\bISRO\b/i,
    ],
    domain: 'isro.gov.in',
  },
  {
    patterns: [
      /\bairport authority of india\b/i,
      /\bAAI\b/i,
    ],
    domain: 'aai.aero',
  },
  {
    patterns: [
      /\bpunjab national bank\b/i,
      /\bPNB\b/i,
    ],
    domain: 'pnbindia.in',
  },
  {
    patterns: [
      /\bunion bank of india\b/i,
      /\bUnion Bank\b/i,
    ],
    domain: 'unionbankofindia.bank.in',
  },
  {
    patterns: [
      /\bbharat petroleum\b/i,
      /\bBPCL\b/i,
    ],
    domain: 'bharatpetroleum.in',
  },
];

function findOrganizationRule(
  job: DiscoveredJob,
): OrganizationRule | undefined {
  const haystack =
    `${job.organization} ${job.title}`;

  return ORGANIZATION_RULES.find(
    (rule) =>
      rule.patterns.some(
        (pattern) =>
          pattern.test(haystack),
      ),
  );
}

function buildSearchUrl(
  domain: string,
  job: DiscoveredJob,
): string {
  const query =
    encodeURIComponent(
      `${job.title} ${job.organization} recruitment notification`,
    );

  return `https://www.google.com/search?q=site%3A${encodeURIComponent(domain)}+${query}`;
}

function buildOfficialHomepage(
  domain: string,
): string {
  return `https://${domain}/`;
}

export function resolveOfficialSource(
  job: DiscoveredJob,
): OfficialSourceResult {
  const rule =
    findOrganizationRule(job);

  if (!rule) {
    return {
      found: false,
      confidence: 0,
      reason:
        'No known official organization domain matched.',
    };
  }

  const domains =
    rule.domains ?? [rule.domain];

  const searchDomain =
    domains[0];

  return {
    found: true,
    officialDomain: searchDomain,
    officialUrl:
      buildOfficialHomepage(
        searchDomain,
      ),
    notificationUrl:
      buildSearchUrl(
        searchDomain,
        job,
      ),
    confidence: 80,
    reason:
      `Matched official domain for ${job.organization}.`,
  };
}