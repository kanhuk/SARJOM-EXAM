export interface OfficialSourceEntry {
  id: string;
  shortName: string;
  name: string;
  website: string;
  domains: string[];
  state?: string;
  tags: string[];
}

export const OFFICIAL_SOURCE_REGISTRY: OfficialSourceEntry[] = [
  { id: 'upsc', shortName: 'UPSC', name: 'Union Public Service Commission', website: 'https://upsc.gov.in/', domains: ['upsc.gov.in'], tags: ['upsc', 'central', 'recruitment'] },
  { id: 'ssc', shortName: 'SSC', name: 'Staff Selection Commission', website: 'https://ssc.gov.in/', domains: ['ssc.gov.in'], tags: ['ssc', 'central', 'recruitment'] },
  { id: 'rbi', shortName: 'RBI', name: 'Reserve Bank of India', website: 'https://www.rbi.org.in/', domains: ['rbi.org.in'], tags: ['rbi', 'banking'] },
  { id: 'rrb', shortName: 'RRB', name: 'Railway Recruitment Boards', website: 'https://indianrailways.gov.in/', domains: ['indianrailways.gov.in', 'rrbapply.gov.in'], tags: ['rrb', 'railway'] },
  { id: 'opsc', shortName: 'OPSC', name: 'Odisha Public Service Commission', website: 'https://opsc.gov.in/', domains: ['opsc.gov.in'], state: 'OD', tags: ['opsc', 'odisha'] },
  { id: 'ossc', shortName: 'OSSC', name: 'Odisha Staff Selection Commission', website: 'https://ossc.gov.in/', domains: ['ossc.gov.in'], state: 'OD', tags: ['ossc', 'odisha'] },
  { id: 'osssc', shortName: 'OSSSC', name: 'Odisha Sub-Ordinate Staff Selection Commission', website: 'https://osssc.gov.in/', domains: ['osssc.gov.in'], state: 'OD', tags: ['osssc', 'odisha'] },
  { id: 'btsc', shortName: 'BTSC', name: 'Bihar Technical Service Commission', website: 'https://btsc.bihar.gov.in/', domains: ['btsc.bihar.gov.in'], state: 'BR', tags: ['btsc', 'bihar'] },
];

export function findOfficialSourceByDomain(hostname: string): OfficialSourceEntry | undefined {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  return OFFICIAL_SOURCE_REGISTRY.find(source =>
    source.domains.some(domain => host === domain || host.endsWith(`.${domain}`)),
  );
}
