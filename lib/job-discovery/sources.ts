import type { JobSource } from './types.js';

export const JOB_DISCOVERY_SOURCES: JobSource[] = [
  /*
   * Government / official
   */
  {
    id: 'employment-news',
    name: 'Employment News',
    url: 'https://employmentnews.gov.in/',
    type: 'government',
    discovery: true,
    official: true,
    enabled: true,
    country: 'India',
    tags: ['government', 'recruitment', 'jobs'],
  },

  {
    id: 'ncs',
    name: 'National Career Service',
    url: 'https://www.ncs.gov.in/',
    type: 'government',
    discovery: true,
    official: true,
    enabled: true,
    country: 'India',
    tags: ['government', 'jobs', 'employment'],
  },

  /*
   * Job discovery portals.
   *
   * These are discovery sources, not automatically authoritative
   * sources for final verification.
   */
  {
    id: 'naukri',
    name: 'Naukri',
    url: 'https://www.naukri.com/',
    type: 'job-portal',
    discovery: true,
    official: false,
    enabled: true,
    country: 'India',
    tags: ['private', 'jobs'],
  },

  {
    id: 'freejobalert',
    name: 'FreeJobAlert',
    url: 'https://www.freejobalert.com/',
    type: 'recruitment-portal',
    discovery: true,
    official: false,
    enabled: true,
    country: 'India',
    tags: ['government', 'private', 'jobs', 'recruitment'],
  },

  {
    id: 'indeed',
    name: 'Indeed',
    url: 'https://www.indeed.com/',
    type: 'job-portal',
    discovery: true,
    official: false,
    enabled: true,
    country: 'India',
    tags: ['private', 'jobs'],
  },

  /*
   * Major recruitment ecosystems.
   * More sources will be added after the engine is working.
   */
  {
    id: 'upsc',
    name: 'Union Public Service Commission',
    url: 'https://upsc.gov.in/',
    type: 'government',
    discovery: true,
    official: true,
    enabled: true,
    country: 'India',
    tags: ['government', 'upsc', 'recruitment', 'examination'],
  },

  {
    id: 'ssc',
    name: 'Staff Selection Commission',
    url: 'https://ssc.gov.in/',
    type: 'government',
    discovery: true,
    official: true,
    enabled: true,
    country: 'India',
    tags: ['government', 'ssc', 'recruitment', 'examination'],
  },
];