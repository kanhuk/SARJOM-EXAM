export type TrendCategory =
  | 'jobs'
  | 'scheme'
  | 'scholarship'
  | 'admission'
  | 'exam'
  | 'result'
  | 'farmer'
  | 'notification'
  | 'education'
  | 'health'
  | 'defence'
  | 'railway'
  | 'banking'
  | 'police'
  | 'teaching'
  | 'scientific'
  | 'other';


export type TrendSection =
  | 'central-government'
  | 'odisha-government'
  | 'odisha-jobs'
  | 'all-india-jobs'
  | 'banking-finance'
  | 'railways'
  | 'defence'
  | 'education-exams'
  | 'health'
  | 'scientific-technical'
  | 'state-government'
  | 'other';


export type TrendStatus =
  | 'new'
  | 'open'
  | 'closing-soon'
  | 'upcoming'
  | 'expired';


export type NotificationType =
  | 'recruitment'
  | 'application'
  | 'admit-card'
  | 'exam'
  | 'answer-key'
  | 'result'
  | 'merit-list'
  | 'admission'
  | 'counselling'
  | 'allotment'
  | 'scholarship'
  | 'scheme'
  | 'farmer'
  | 'benefit'
  | 'notification'
  | 'other';


export type TrendItem = {

  id: string;

  title: string;

  shortTitle?: string;

  category: TrendCategory;

  section?: TrendSection;

  subcategory?: string;

  notificationType?: NotificationType;

  emoji: string;

  url: string;

  source: string;

  organization?: string;

  level?: 'central' | 'state';

  state?: string;

  exam?: string;

  publishedAt?: string;

  applicationStart?: string;

  deadline?: string;

  deadlineLabel?: string;

  examDate?: string;

  posts?: string;

  qualification?: string;

  status: TrendStatus;

  priority: number;

  description?: string;

  keywords?: string[];

  verified?: boolean;

  officialSource?: boolean;

  collectedAt?: string;
};


/* =========================================================
   FALLBACK DATA
   ========================================================= */

export const FALLBACK_TRENDS: TrendItem[] = [

  {
    id: 'pmfby-kharif-2026',

    title: 'PMFBY Kharif 2026',

    shortTitle: 'PMFBY Kharif 2026',

    category: 'farmer',

    section: 'central-government',

    subcategory: 'Farmer Schemes',

    notificationType: 'farmer',

    emoji: '🌾',

    url: 'https://pmfby.gov.in/',

    source: 'PMFBY',

    organization:
      'Pradhan Mantri Fasal Bima Yojana',

    level: 'central',

    publishedAt: '2026-08-14',

    deadline: '2026-08-15',

    status: 'closing-soon',

    priority: 96,

    officialSource: true,

    verified: true
  },


  {
    id: 'ossc-chsl-specialist-2026',

    title: 'OSSC CHSL Specialist Posts',

    shortTitle:
      'OSSC CHSL Specialist Posts',

    category: 'jobs',

    section: 'odisha-jobs',

    subcategory: 'OSSC',

    notificationType: 'recruitment',

    emoji: '💼',

    url: 'https://www.ossc.gov.in/',

    source: 'OSSC',

    organization:
      'Odisha Staff Selection Commission',

    level: 'state',

    state: 'Odisha',

    publishedAt: '2026-08-13',

    status: 'new',

    priority: 92,

    officialSource: true,

    verified: true
  },


  {
    id: 'ossc-august-calendar-2026',

    title: 'OSSC August Recruitment Calendar',

    shortTitle:
      'OSSC Recruitment Calendar',

    category: 'notification',

    section: 'odisha-jobs',

    subcategory: 'OSSC',

    notificationType: 'notification',

    emoji: '📅',

    url: 'https://www.ossc.gov.in/',

    source: 'OSSC',

    organization:
      'Odisha Staff Selection Commission',

    level: 'state',

    state: 'Odisha',

    publishedAt: '2026-08-10',

    status: 'new',

    priority: 84,

    officialSource: true,

    verified: true
  },


  {
    id: 'sams-llb-round-2-2026',

    title:
      'SAMS Odisha LL.B. Second Round Allotment',

    shortTitle:
      'SAMS LL.B. 2nd Round',

    category: 'admission',

    section: 'odisha-government',

    subcategory: 'SAMS / Admissions',

    notificationType: 'allotment',

    emoji: '🎓',

    url:
      'https://degree.samsodisha.gov.in/LLB/LLBKeyDtl.aspx',

    source: 'SAMS Odisha',

    organization:
      'Student Academic Management System Odisha',

    level: 'state',

    state: 'Odisha',

    deadline: '2026-08-17',

    status: 'upcoming',

    priority: 90,

    officialSource: true,

    verified: true
  }

];


/* =========================================================
   STATUS
   ========================================================= */

export function getStatus(
  item: TrendItem,
  now = new Date()
): TrendStatus {

  if (item.deadline) {

    const end =
      new Date(
        item.deadline +
        'T23:59:59+05:30'
      );

    const diff =
      end.getTime() -
      now.getTime();

    if (diff < 0) {
      return 'expired';
    }

    if (
      diff <=
      3 * 24 * 60 * 60 * 1000
    ) {
      return 'closing-soon';
    }

    return 'open';
  }


  if (item.applicationStart) {

    const start =
      new Date(
        item.applicationStart
      );

    if (
      start.getTime() >
      now.getTime()
    ) {
      return 'upcoming';
    }
  }


  if (item.publishedAt) {

    const published =
      new Date(
        item.publishedAt
      );

    const age =
      now.getTime() -
      published.getTime();

    if (
      age >= 0 &&
      age <=
      3 * 24 * 60 * 60 * 1000
    ) {
      return 'new';
    }
  }


  return item.status || 'open';
}


/* =========================================================
   PRIORITY
   ========================================================= */

export function scoreTrend(
  item: TrendItem,
  now = new Date()
): number {

  let score = 20;


  const status =
    getStatus(
      item,
      now
    );


  if (
    status === 'closing-soon'
  ) {
    score += 55;
  }

  else if (
    status === 'open'
  ) {
    score += 25;
  }

  else if (
    status === 'new'
  ) {
    score += 40;
  }

  else if (
    status === 'upcoming'
  ) {
    score += 30;
  }


  if (item.publishedAt) {

    const published =
      new Date(
        item.publishedAt
      );

    const ageDays =
      Math.max(
        0,
        (
          now.getTime() -
          published.getTime()
        ) / 86400000
      );

    score +=
      Math.max(
        0,
        30 -
        ageDays * 3
      );
  }


  /* CATEGORY WEIGHTS */

  if (
    item.category === 'jobs'
  ) {
    score += 18;
  }

  if (
    item.category === 'exam'
  ) {
    score += 16;
  }

  if (
    item.category === 'result'
  ) {
    score += 17;
  }

  if (
    item.category === 'admission'
  ) {
    score += 14;
  }

  if (
    item.category === 'scholarship'
  ) {
    score += 14;
  }

  if (
    item.category === 'scheme'
  ) {
    score += 12;
  }

  if (
    item.category === 'farmer'
  ) {
    score += 12;
  }

  if (
    item.category === 'banking'
  ) {
    score += 17;
  }

  if (
    item.category === 'railway'
  ) {
    score += 17;
  }

  if (
    item.category === 'defence'
  ) {
    score += 17;
  }

  if (
    item.category === 'police'
  ) {
    score += 16;
  }


  /* SECTION WEIGHTS */

  if (
    item.section ===
    'odisha-jobs'
  ) {
    score += 8;
  }

  if (
    item.section ===
    'all-india-jobs'
  ) {
    score += 7;
  }

  if (
    item.section ===
    'banking-finance'
  ) {
    score += 7;
  }

  if (
    item.section ===
    'railways'
  ) {
    score += 7;
  }

  if (
    item.section ===
    'defence'
  ) {
    score += 7;
  }


  if (
    item.notificationType ===
    'recruitment'
  ) {
    score += 8;
  }

  if (
    item.notificationType ===
    'application'
  ) {
    score += 8;
  }

  if (
    item.notificationType ===
    'admit-card'
  ) {
    score += 9;
  }

  if (
    item.notificationType ===
    'result'
  ) {
    score += 9;
  }


  if (
    item.officialSource
  ) {
    score += 10;
  }

  if (
    item.verified
  ) {
    score += 5;
  }


  return Math.min(
    100,
    Math.round(score)
  );
}


/* =========================================================
   RANK
   ========================================================= */

export function rankTrends(
  items: TrendItem[]
): TrendItem[] {

  const now =
    new Date();


  return items

    .map(
      item => ({

        ...item,

        status:
          getStatus(
            item,
            now
          ),

        priority:
          scoreTrend(
            item,
            now
          )

      })
    )

    .filter(
      item =>
        item.status !==
        'expired'
    )

    .sort(
      (a, b) =>

        b.priority -
        a.priority ||

        (
          b.publishedAt ||
          ''
        ).localeCompare(
          a.publishedAt ||
          ''
        ) ||

        a.title.localeCompare(
          b.title
        )
    );
}