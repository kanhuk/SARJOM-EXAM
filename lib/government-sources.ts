export type GovernmentLevel =
  | 'central'
  | 'state';

export type GovernmentCategory =
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

export type GovernmentSection =
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

export type GovernmentSource = {
  id: string;

  name: string;

  organization: string;

  level: GovernmentLevel;

  state?: string;

  url: string;

  category: GovernmentCategory;

  section: GovernmentSection;

  subcategory: string;

  keywords: string[];

  enabled: boolean;
};


/* =========================================================
   CENTRAL GOVERNMENT — RECRUITMENT
   ========================================================= */

export const GOVERNMENT_SOURCES: GovernmentSource[] = [
  // =========================================================
  // NATIONAL JOB DISCOVERY — OFFICIAL GOVERNMENT SOURCES
  // =========================================================

  {
    id: 'employment-news',
    name: 'Employment News',
    organization:
      'Ministry of Information and Broadcasting, Government of India',
    level: 'central',
    url: 'https://employmentnews.gov.in/NewEmp/AllJobs.aspx?k=All',
    category: 'jobs',
    section: 'all-india-jobs',
    subcategory: 'Employment News',
    keywords: [
      'recruitment',
      'job',
      'jobs',
      'vacancy',
      'vacancies',
      'post',
      'posts',
      'appointment',
      'selection',
      'deputation',
      'last date',
      'issued date',
      'advertisement',
      'employment',
      'career'
    ],
    enabled: true
  },

  {
    id: 'ncs',
    name: 'National Career Service',
    organization:
      'Ministry of Labour and Employment, Government of India',
    level: 'central',
    url: 'https://www.ncs.gov.in/jobs-in-all-india',
    category: 'jobs',
    section: 'all-india-jobs',
    subcategory: 'National Career Service',
    keywords: [
      'job',
      'jobs',
      'vacancy',
      'vacancies',
      'recruitment',
      'employer',
      'employment',
      'job fair',
      'government jobs',
      'career',
      'placement',
      'opportunity'
    ],
    enabled: true
  },
  {
    id: 'upsc',
    name: 'UPSC',
    organization: 'Union Public Service Commission',
    level: 'central',
    url: 'https://upsc.gov.in/',
    category: 'jobs',
    section: 'all-india-jobs',
    subcategory: 'UPSC',
    keywords: [
      'examination',
      'recruitment',
      'vacancy',
      'advertisement',
      'notification',
      'application',
      'admit card',
      'e-admit',
      'answer key',
      'result',
      'merit',
      'civil services',
      'IAS',
      'IPS',
      'IFS',
      'CDS',
      'NDA',
      'CAPF',
      'CMS',
      'EPFO',
      'engineering services'
    ],
    enabled: true
  },

  {
    id: 'upsc-otr',
    name: 'UPSC Online',
    organization: 'Union Public Service Commission',
    level: 'central',
    url: 'https://upsconline.nic.in/',
    category: 'jobs',
    section: 'all-india-jobs',
    subcategory: 'UPSC Applications',
    keywords: [
      'application',
      'online application',
      'registration',
      'recruitment',
      'examination',
      'admit card',
      'form',
      'last date'
    ],
    enabled: true
  },

  {
    id: 'ssc',
    name: 'SSC',
    organization: 'Staff Selection Commission',
    level: 'central',
    url: 'https://ssc.gov.in/',
    category: 'jobs',
    section: 'all-india-jobs',
    subcategory: 'SSC',
    keywords: [
      'SSC',
      'CGL',
      'CHSL',
      'MTS',
      'GD',
      'CPO',
      'JE',
      'Stenographer',
      'Selection Post',
      'recruitment',
      'vacancy',
      'notification',
      'application',
      'admit card',
      'answer key',
      'result',
      'merit',
      'calendar'
    ],
    enabled: true
  },

  {
    id: 'rrb',
    name: 'Railway Recruitment Boards',
    organization: 'Railway Recruitment Boards',
    level: 'central',
    url: 'https://www.rrbcdg.gov.in/',
    category: 'railway',
    section: 'railways',
    subcategory: 'RRB',
    keywords: [
      'RRB',
      'railway',
      'NTPC',
      'Group D',
      'ALP',
      'Technician',
      'JE',
      'RPF',
      'paramedical',
      'apprentice',
      'recruitment',
      'vacancy',
      'application',
      'exam',
      'admit card',
      'answer key',
      'result'
    ],
    enabled: true
  },

  {
    id: 'ibps',
    name: 'IBPS',
    organization: 'Institute of Banking Personnel Selection',
    level: 'central',
    url: 'https://www.ibps.in/',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'IBPS',
    keywords: [
      'IBPS',
      'PO',
      'Clerk',
      'SO',
      'RRB',
      'CRP',
      'bank',
      'banking',
      'recruitment',
      'notification',
      'application',
      'exam',
      'admit card',
      'result',
      'calendar'
    ],
    enabled: true
  },

  {
    id: 'sbi',
    name: 'SBI Careers',
    organization: 'State Bank of India',
    level: 'central',
    url: 'https://sbi.co.in/web/careers',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'SBI',
    keywords: [
      'SBI',
      'probationary officer',
      'PO',
      'clerk',
      'specialist officer',
      'SO',
      'circle based officer',
      'CBO',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'rbi',
    name: 'RBI',
    organization: 'Reserve Bank of India',
    level: 'central',
    url: 'https://www.rbi.org.in/',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'RBI',
    keywords: [
      'RBI',
      'Grade B',
      'Assistant',
      'officer',
      'recruitment',
      'vacancy',
      'notification',
      'application',
      'exam',
      'result'
    ],
    enabled: true
  },

  {
    id: 'nabard',
    name: 'NABARD',
    organization: 'National Bank for Agriculture and Rural Development',
    level: 'central',
    url: 'https://www.nabard.org/',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'NABARD',
    keywords: [
      'NABARD',
      'Grade A',
      'Grade B',
      'development assistant',
      'recruitment',
      'vacancy',
      'application',
      'exam',
      'result'
    ],
    enabled: true
  },

  {
    id: 'sebi',
    name: 'SEBI',
    organization: 'Securities and Exchange Board of India',
    level: 'central',
    url: 'https://www.sebi.gov.in/',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'SEBI',
    keywords: [
      'SEBI',
      'Grade A',
      'officer',
      'assistant manager',
      'recruitment',
      'vacancy',
      'application',
      'exam',
      'result'
    ],
    enabled: true
  },

  {
    id: 'lic',
    name: 'LIC',
    organization: 'Life Insurance Corporation of India',
    level: 'central',
    url: 'https://licindia.in/careers',
    category: 'banking',
    section: 'banking-finance',
    subcategory: 'LIC',
    keywords: [
      'LIC',
      'AAO',
      'ADO',
      'assistant',
      'officer',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },


  /* =======================================================
     CENTRAL EDUCATION / EXAMS
     ======================================================= */

  {
    id: 'nta',
    name: 'NTA',
    organization: 'National Testing Agency',
    level: 'central',
    url: 'https://www.nta.ac.in/',
    category: 'exam',
    section: 'education-exams',
    subcategory: 'NTA',
    keywords: [
      'NTA',
      'JEE',
      'NEET',
      'CUET',
      'UGC NET',
      'CSIR NET',
      'CMAT',
      'examination',
      'exam',
      'application',
      'admission',
      'city intimation',
      'admit card',
      'answer key',
      'result',
      'score card'
    ],
    enabled: true
  },

  {
    id: 'ugc',
    name: 'UGC',
    organization: 'University Grants Commission',
    level: 'central',
    url: 'https://www.ugc.gov.in/',
    category: 'education',
    section: 'education-exams',
    subcategory: 'UGC / Higher Education',
    keywords: [
      'UGC',
      'NET',
      'fellowship',
      'scholarship',
      'university',
      'higher education',
      'regulation',
      'notification',
      'public notice',
      'recruitment'
    ],
    enabled: true
  },

  {
    id: 'ctet',
    name: 'CTET',
    organization: 'Central Board of Secondary Education',
    level: 'central',
    url: 'https://ctet.nic.in/',
    category: 'teaching',
    section: 'education-exams',
    subcategory: 'CTET',
    keywords: [
      'CTET',
      'teacher eligibility',
      'application',
      'exam',
      'admit card',
      'answer key',
      'result',
      'certificate'
    ],
    enabled: true
  },


  /* =======================================================
     DEFENCE
     ======================================================= */

  {
    id: 'upsc-defence',
    name: 'UPSC Defence',
    organization: 'Union Public Service Commission',
    level: 'central',
    url: 'https://upsc.gov.in/',
    category: 'defence',
    section: 'defence',
    subcategory: 'UPSC Defence',
    keywords: [
      'NDA',
      'CDS',
      'CAPF',
      'defence',
      'army',
      'navy',
      'air force',
      'officer',
      'recruitment',
      'examination',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'join-indian-army',
    name: 'Indian Army',
    organization: 'Indian Army',
    level: 'central',
    url: 'https://joinindianarmy.nic.in/',
    category: 'defence',
    section: 'defence',
    subcategory: 'Indian Army',
    keywords: [
      'army',
      'agniveer',
      'Agniveer',
      'recruitment',
      'rally',
      'online application',
      'CEE',
      'admit card',
      'result',
      'officer',
      'JCO',
      'soldier'
    ],
    enabled: true
  },

  {
    id: 'join-indian-navy',
    name: 'Indian Navy',
    organization: 'Indian Navy',
    level: 'central',
    url: 'https://www.joinindiannavy.gov.in/',
    category: 'defence',
    section: 'defence',
    subcategory: 'Indian Navy',
    keywords: [
      'navy',
      'agniveer',
      'SSR',
      'MR',
      'INET',
      'officer',
      'recruitment',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'indian-air-force',
    name: 'Indian Air Force',
    organization: 'Indian Air Force',
    level: 'central',
    url: 'https://careerindianairforce.cdac.in/',
    category: 'defence',
    section: 'defence',
    subcategory: 'Indian Air Force',
    keywords: [
      'air force',
      'Agniveervayu',
      'AFCAT',
      'recruitment',
      'application',
      'exam',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'indiancoastguard',
    name: 'Indian Coast Guard',
    organization: 'Indian Coast Guard',
    level: 'central',
    url: 'https://joinindiancoastguard.cdac.in/',
    category: 'defence',
    section: 'defence',
    subcategory: 'Coast Guard',
    keywords: [
      'coast guard',
      'navik',
      'yantrik',
      'assistant commandant',
      'recruitment',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },


  /* =======================================================
     PARAMILITARY / POLICE
     ======================================================= */

  {
    id: 'bsf',
    name: 'BSF',
    organization: 'Border Security Force',
    level: 'central',
    url: 'https://rectt.bsf.gov.in/',
    category: 'police',
    section: 'defence',
    subcategory: 'BSF',
    keywords: [
      'BSF',
      'constable',
      'head constable',
      'sub inspector',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'crpf',
    name: 'CRPF',
    organization: 'Central Reserve Police Force',
    level: 'central',
    url: 'https://rect.crpf.gov.in/',
    category: 'police',
    section: 'defence',
    subcategory: 'CRPF',
    keywords: [
      'CRPF',
      'constable',
      'SI',
      'ASI',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'cisf',
    name: 'CISF',
    organization: 'Central Industrial Security Force',
    level: 'central',
    url: 'https://www.cisf.gov.in/',
    category: 'police',
    section: 'defence',
    subcategory: 'CISF',
    keywords: [
      'CISF',
      'constable',
      'head constable',
      'SI',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'itbp',
    name: 'ITBP',
    organization: 'Indo-Tibetan Border Police',
    level: 'central',
    url: 'https://recruitment.itbpolice.nic.in/',
    category: 'police',
    section: 'defence',
    subcategory: 'ITBP',
    keywords: [
      'ITBP',
      'constable',
      'head constable',
      'SI',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'ssb',
    name: 'SSB',
    organization: 'Sashastra Seema Bal',
    level: 'central',
    url: 'https://recruitment.ssb.gov.in/',
    category: 'police',
    section: 'defence',
    subcategory: 'SSB',
    keywords: [
      'SSB',
      'constable',
      'SI',
      'ASI',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },


  /* =======================================================
     SCIENCE / TECHNICAL
     ======================================================= */

  {
    id: 'drdo',
    name: 'DRDO',
    organization: 'Defence Research and Development Organisation',
    level: 'central',
    url: 'https://www.drdo.gov.in/',
    category: 'scientific',
    section: 'scientific-technical',
    subcategory: 'DRDO',
    keywords: [
      'recruitment',
      'career',
      'vacancy',
      'apprentice',
      'scientist',
      'technical',
      'CEPTAM',
      'notification',
      'result'
    ],
    enabled: true
  },

  {
    id: 'isro',
    name: 'ISRO',
    organization: 'Indian Space Research Organisation',
    level: 'central',
    url: 'https://www.isro.gov.in/',
    category: 'scientific',
    section: 'scientific-technical',
    subcategory: 'ISRO',
    keywords: [
      'recruitment',
      'career',
      'vacancy',
      'scientist',
      'engineer',
      'technical assistant',
      'technician',
      'apprentice',
      'notification',
      'result'
    ],
    enabled: true
  },

  {
    id: 'csir',
    name: 'CSIR',
    organization: 'Council of Scientific and Industrial Research',
    level: 'central',
    url: 'https://www.csir.res.in/',
    category: 'scientific',
    section: 'scientific-technical',
    subcategory: 'CSIR',
    keywords: [
      'CSIR',
      'scientist',
      'technical',
      'recruitment',
      'vacancy',
      'fellowship',
      'project',
      'result'
    ],
    enabled: true
  },

  {
    id: 'icar',
    name: 'ICAR',
    organization: 'Indian Council of Agricultural Research',
    level: 'central',
    url: 'https://icar.gov.in/',
    category: 'scientific',
    section: 'scientific-technical',
    subcategory: 'ICAR',
    keywords: [
      'ICAR',
      'agriculture',
      'scientist',
      'recruitment',
      'vacancy',
      'fellowship',
      'admission',
      'result'
    ],
    enabled: true
  },

  {
    id: 'icmr',
    name: 'ICMR',
    organization: 'Indian Council of Medical Research',
    level: 'central',
    url: 'https://www.icmr.gov.in/',
    category: 'scientific',
    section: 'scientific-technical',
    subcategory: 'ICMR',
    keywords: [
      'ICMR',
      'scientist',
      'research',
      'fellowship',
      'recruitment',
      'vacancy',
      'technical',
      'result'
    ],
    enabled: true
  },


  /* =======================================================
     CENTRAL FARMER / SCHEMES
     ======================================================= */

  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    organization: 'Government of India',
    level: 'central',
    url: 'https://pmkisan.gov.in/',
    category: 'farmer',
    section: 'central-government',
    subcategory: 'Farmer Schemes',
    keywords: [
      'PM-KISAN',
      'PM KISAN',
      'installment',
      'farmer',
      'registration',
      'beneficiary',
      'eKYC',
      'payment',
      'status',
      'correction'
    ],
    enabled: true
  },

  {
    id: 'pmfby',
    name: 'PMFBY',
    organization: 'Pradhan Mantri Fasal Bima Yojana',
    level: 'central',
    url: 'https://pmfby.gov.in/',
    category: 'farmer',
    section: 'central-government',
    subcategory: 'Farmer Schemes',
    keywords: [
      'PMFBY',
      'Kharif',
      'Rabi',
      'crop insurance',
      'farmer',
      'enrolment',
      'deadline',
      'premium',
      'insurance'
    ],
    enabled: true
  },


  /* =======================================================
     ODISHA JOBS
     ======================================================= */

  {
    id: 'opsc',
    name: 'OPSC',
    organization: 'Odisha Public Service Commission',
    level: 'state',
    state: 'Odisha',
    url: 'https://www.opsc.gov.in/',
    category: 'jobs',
    section: 'odisha-jobs',
    subcategory: 'OPSC',
    keywords: [
      'OPSC',
      'recruitment',
      'advertisement',
      'vacancy',
      'notification',
      'application',
      'exam',
      'admit card',
      'answer key',
      'result',
      'selection'
    ],
    enabled: true
  },

  {
    id: 'ossc',
    name: 'OSSC',
    organization: 'Odisha Staff Selection Commission',
    level: 'state',
    state: 'Odisha',
    url: 'https://www.ossc.gov.in/',
    category: 'jobs',
    section: 'odisha-jobs',
    subcategory: 'OSSC',
    keywords: [
      'OSSC',
      'CHSL',
      'CGL',
      'CTSRE',
      'recruitment',
      'advertisement',
      'vacancy',
      'notification',
      'application',
      'admit card',
      'answer key',
      'result',
      'selection'
    ],
    enabled: true
  },

  {
    id: 'osssc',
    name: 'OSSSC',
    organization: 'Odisha Sub-Ordinate Staff Selection Commission',
    level: 'state',
    state: 'Odisha',
    url: 'https://www.osssc.gov.in/',
    category: 'jobs',
    section: 'odisha-jobs',
    subcategory: 'OSSSC',
    keywords: [
      'OSSSC',
      'RI',
      'Revenue Inspector',
      'Amin',
      'teacher',
      'nursing',
      'health',
      'recruitment',
      'advertisement',
      'vacancy',
      'notification',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },

  {
    id: 'odisha-police',
    name: 'Odisha Police',
    organization: 'Odisha Police',
    level: 'state',
    state: 'Odisha',
    url: 'https://odishapolice.gov.in/',
    category: 'police',
    section: 'odisha-jobs',
    subcategory: 'Odisha Police',
    keywords: [
      'Odisha Police',
      'constable',
      'SI',
      'sub inspector',
      'recruitment',
      'vacancy',
      'application',
      'admit card',
      'result'
    ],
    enabled: true
  },


  /* =======================================================
     ODISHA EDUCATION
     ======================================================= */

  {
    id: 'sams-odisha',
    name: 'SAMS Odisha',
    organization: 'Student Academic Management System Odisha',
    level: 'state',
    state: 'Odisha',
    url: 'https://samsodisha.gov.in/',
    category: 'admission',
    section: 'odisha-government',
    subcategory: 'SAMS / Admissions',
    keywords: [
      'admission',
      'allotment',
      'merit',
      'round',
      'application',
      'selection',
      'intimation',
      'counselling',
      'counseling',
      'deadline'
    ],
    enabled: true
  },

  {
    id: 'odisha-scholarship',
    name: 'Odisha Scholarship Portal',
    organization: 'Government of Odisha',
    level: 'state',
    state: 'Odisha',
    url: 'https://scholarship.odisha.gov.in/',
    category: 'scholarship',
    section: 'odisha-government',
    subcategory: 'Odisha Scholarships',
    keywords: [
      'scholarship',
      'application',
      'eligibility',
      'student',
      'renewal',
      'deadline',
      'registration',
      'post matric',
      'pre matric'
    ],
    enabled: true
  },


  /* =======================================================
     ODISHA GOVERNMENT
     ======================================================= */

  {
    id: 'odisha-gov',
    name: 'Odisha Government',
    organization: 'Government of Odisha',
    level: 'state',
    state: 'Odisha',
    url: 'https://odisha.gov.in/',
    category: 'scheme',
    section: 'odisha-government',
    subcategory: 'Odisha Schemes',
    keywords: [
      'scheme',
      'yojana',
      'benefit',
      'assistance',
      'subsidy',
      'farmer',
      'women',
      'student',
      'welfare',
      'announcement',
      'government',
      'notification'
    ],
    enabled: true
  },


  /* =======================================================
     STATE GOVERNMENT / ADDITIONAL
     ======================================================= */

  {
    id: 'odisha-health',
    name: 'Odisha Health Department',
    organization: 'Government of Odisha',
    level: 'state',
    state: 'Odisha',
    url: 'https://health.odisha.gov.in/',
    category: 'health',
    section: 'odisha-jobs',
    subcategory: 'Odisha Health',
    keywords: [
      'health',
      'medical',
      'nursing',
      'doctor',
      'pharmacist',
      'technician',
      'recruitment',
      'vacancy',
      'appointment',
      'notification'
    ],
    enabled: true
  },

  {
    id: 'odisha-forest',
    name: 'Odisha Forest Department',
    organization: 'Government of Odisha',
    level: 'state',
    state: 'Odisha',
    url: 'https://forest.odisha.gov.in/',
    category: 'jobs',
    section: 'odisha-jobs',
    subcategory: 'Odisha Forest',
    keywords: [
      'forest',
      'forester',
      'forest guard',
      'recruitment',
      'vacancy',
      'notification',
      'application'
    ],
    enabled: true
  }

];


/* =========================================================
   HELPERS
   ========================================================= */

export function getEnabledGovernmentSources():
  GovernmentSource[] {

  return GOVERNMENT_SOURCES.filter(
    source => source.enabled
  );
}


export function getSourcesBySection(
  section: GovernmentSection
): GovernmentSource[] {

  return GOVERNMENT_SOURCES.filter(
    source =>
      source.enabled &&
      source.section === section
  );
}


export function getSourcesByCategory(
  category: GovernmentCategory
): GovernmentSource[] {

  return GOVERNMENT_SOURCES.filter(
    source =>
      source.enabled &&
      source.category === category
  );
}